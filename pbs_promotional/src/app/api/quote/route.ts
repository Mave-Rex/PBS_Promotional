  // /app/api/quote/route.ts
  import { NextRequest, NextResponse } from "next/server";
  import { z } from "zod";
  import { ServerClient } from "postmark";
  import crypto from "crypto";

  export const dynamic = "force-dynamic";
  export const runtime = "nodejs";

  /* ============================
    ENV (mismas que tu contacto)
  ============================ */
  const TOKEN  = process.env.POSTMARK_TOKEN;
  const FROM   = process.env.MAIL_FROM;          // p.ej. 'Rex Team <no-reply@tu-dominio.com>'
  const TO     = process.env.MAIL_TO;            // p.ej. 'ventas@tu-dominio.com'
  const STREAM = process.env.POSTMARK_STREAM || "outbound";
  const RL_SECRET = process.env.RL_SECRET;       // clave para firmar cookie

  /* ============================
    Rate limit SILENCIOSO (cookie)
    - 1 envío cada 2 horas por navegador
    - si excede: responde 200 OK pero no envía
  ============================ */
  const RL_COOKIE = "qrl2h";
  const WINDOW_MS = 2 * 60 * 60 * 1000; // 2 horas
  const LIMIT = 1; // 1 envío por ventana

  type RLData = { stamps: number[] }; // timestamps de envíos previos (guardamos 1)

  function sign(base64: string) {
    if (!RL_SECRET) throw new Error("Falta RL_SECRET");
    return crypto.createHmac("sha256", RL_SECRET).update(base64).digest("base64url");
  }
  function pack(data: RLData) {
    const b64 = Buffer.from(JSON.stringify(data), "utf8").toString("base64url");
    const sig = sign(b64);
    return `${b64}.${sig}`;
  }
  function unpack(token?: string | null): RLData | null {
    if (!token) return null;
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return null;
    const good = sign(b64);
    const a = Buffer.from(sig);
    const b = Buffer.from(good);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    try {
      const json = Buffer.from(b64, "base64url").toString("utf8");
      return JSON.parse(json) as RLData;
    } catch {
      return null;
    }
  }
  function bumpCookie(prev: RLData | null) {
    const now = Date.now();
    const stamps = (prev?.stamps || []).filter((t) => now - t < WINDOW_MS);
    stamps.push(now);
    // mantenemos solo el último para que la cookie sea pequeña
    return pack({ stamps: [stamps[stamps.length - 1]] });
  }

  /* ============================
    Utils & Validaciones
  ============================ */
  const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]!));

  function isValidEcuPhone(phone: string) {
    const cleaned = phone.replace(/\s|-/g, "");
    return /^(?:09\d{8}|\+5939\d{8})$/.test(cleaned);
  }

  // JSON o FormData -> objeto plano
  async function parseBody(req: NextRequest) {
    const ct = (req.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("application/json")) {
      return await req.json();
    }
    if (ct.includes("multipart/form-data") || ct.includes("application/x-www-form-urlencoded")) {
      const fd = await req.formData();
      const itemsRaw = (fd.get("items") || "[]").toString();
      let itemsParsed: unknown = [];
      try { itemsParsed = JSON.parse(itemsRaw); } catch {}
      return {
        customer: {
          name: (fd.get("customer.name") || "").toString(),
          email: (fd.get("customer.email") || "").toString(),
          phone: (fd.get("customer.phone") || "").toString(),
        },
        notes: (fd.get("notes") || "").toString(),
        website: (fd.get("website") || "").toString(), // honeypot
        items: itemsParsed,
      };
    }
    try { return await req.json(); } catch { return null; }
  }

  // Zod: nombre solo letras (Unicode), sin dígitos
  const NAME = z
    .string()
    .trim()
    .min(5, "Muy corto")
    .max(30, "Muy largo")
    .regex(/^[\p{L}\p{M}\s'-]+$/u, "Usa solo letras y espacios")
    .refine((s) => !/\d/.test(s), "No se permiten números");

  const ItemSchema = z.object({
    name: z.string().trim().min(1, "Nombre de producto requerido"),
    qty: z.number().int().min(1, "Cantidad inválida"),
  });

  const PayloadSchema = z.object({
    customer: z.object({
      name: NAME,
      email: z.string().email("Email inválido").trim(),
      phone: z.string().trim().refine(isValidEcuPhone, {
        message: "Teléfono inválido (Ecuador: +593 ...)",
      }),
    }),
    notes: z.string().trim().max(1000).optional().default(""),
    items: z.array(ItemSchema).min(1, "Carrito vacío"),
    website: z.string().optional().default(""), // honeypot
  });

  /* ============================
    Handler
  ============================ */
  export async function POST(req: NextRequest) {
    try {
      if (!TOKEN || !FROM || !TO) {
        return NextResponse.json(
          { error: "Faltan variables de entorno (POSTMARK_TOKEN, MAIL_FROM, MAIL_TO)." },
          { status: 500 }
        );
      }
      if (!RL_SECRET) {
        return NextResponse.json(
          { error: "Falta RL_SECRET para la cookie de rate-limit." },
          { status: 500 }
        );
      }

      const raw = await parseBody(req);
      if (!raw) return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });

      const parsed = PayloadSchema.safeParse(raw);
      if (!parsed.success) {
        // Normaliza el path de Zod: ['items', 0, 'qty'] -> "items[].qty"
        const pathToKey = (path: readonly PropertyKey[]) =>
          path
            .map((p) =>
              typeof p === "number" ? "[]" :
              typeof p === "symbol" ? String(p) : p
            )
            .join(".");

        const labelFor = (path: readonly PropertyKey[]) => {
          const key = pathToKey(path);

          const MAP: Record<string, string> = {
            "customer.name": "Nombre",
            "customer.email": "Email",
            "customer.phone": "Teléfono",
            "notes": "Notas",
            "items": "Carrito",
            "items[].name": "Producto",
            "items[].qty": "Cantidad",
          };

          if (MAP[key]) return MAP[key];

          if (key.startsWith("items[].")) {
            const sub = key.slice("items[].".length);
            return MAP["items[]." + sub] || "Ítem";
          }
          if (key.startsWith("customer.")) return "Datos del cliente";
          return "Campo";
        };

        const friendly = parsed.error.issues.map((i) => {
          const label = labelFor(i.path);
          return `${label}: ${i.message}`;
        });

        return NextResponse.json(
          {
            error: friendly.join("; "),
            errors: parsed.error.issues.map((i) => ({
              field: labelFor(i.path),
              path: i.path, // te queda por si deseas ubicar el input exacto
              code: i.code,
              message: i.message,
            })),
          },
          { status: 400 }
        );
      }


      const { customer, notes, items, website } = parsed.data;

      // Honeypot: OK silencioso (no envía)
      if (website && website.trim()) {
        return NextResponse.json({ ok: true, skipped: "honeypot" }, { status: 200 });
      }

      // Rate-limit silencioso por cookie (por navegador)
      const cookiesIn = req.headers.get("cookie") || "";
      const cookieMatch = cookiesIn.match(new RegExp(`(?:^|;\\s*)${RL_COOKIE}=([^;]+)`));
      const prev = unpack(cookieMatch?.[1]);
      const now = Date.now();
      const stamps = (prev?.stamps || []).filter((t) => now - t < WINDOW_MS);

      if (stamps.length >= LIMIT) {
        // Dentro de la ventana: responder 200 OK y no enviar email (silencioso)
        const res = NextResponse.json({ ok: true, skipped: "rate_limit" }, { status: 200 });
        // no actualizamos la cookie (mantenemos el último sello)
        if (prev) {
          res.headers.append("Set-Cookie", `${RL_COOKIE}=${pack(prev)}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60*60*24*7}`);
        }
        return res;
      }

      // Construir email (sin IDs)
      const itemsRowsHtml = items.map(
        (it) => `
          <tr>
            <td style="padding:8px;border:1px solid #eee">${escapeHtml(it.name)}</td>
            <td style="padding:8px;border:1px solid #eee;text-align:center">${it.qty}</td>
          </tr>`
      ).join("");

      const html =
        `<h2>Nueva Solicitud de Cotización</h2>` +
        `<h3>Cliente</h3>` +
        `<ul>` +
        `<li><b>Nombre:</b> ${escapeHtml(customer.name)}</li>` +
        `<li><b>Email:</b> ${escapeHtml(customer.email)}</li>` +
        `<li><b>Teléfono:</b> ${escapeHtml(customer.phone)}</li>` +
        `</ul>` +
        `<h3>Items</h3>` +
        `<table style="border-collapse:collapse;border:1px solid #eee">` +
        `<thead><tr style="background:#fafafa"><th style="padding:8px;border:1px solid #eee;text-align:left">Producto</th><th style="padding:8px;border:1px solid #eee;text-align:center">Cant.</th></tr></thead>` +
        `<tbody>${itemsRowsHtml}</tbody>` +
        `</table>` +
        (notes ? `<h3>Notas</h3><p style="white-space:pre-wrap">${escapeHtml(notes)}</p>` : "");

      const text =
        `Nueva Solicitud de Cotización\n\n` +
        `Cliente:\n- Nombre: ${customer.name}\n- Email: ${customer.email}\n- Teléfono: ${customer.phone}\n\n` +
        `Items:\n` +
        items.map((it) => `- ${it.name} x ${it.qty}`).join("\n") +
        (notes ? `\n\nNotas:\n${notes}` : "") +
        `\n\nMensaje generado automáticamente.`;

      const client = new ServerClient(TOKEN);
      const r = await client.sendEmail({
        From: FROM,
        To: TO,
        ReplyTo: customer.email,
        Subject: `Nueva solicitud de cotización`,
        HtmlBody: html,
        TextBody: text,
        MessageStream: STREAM,
      });

      // Éxito → sellamos cookie con nuevo timestamp
      const res = NextResponse.json(
        { ok: true, messageId: r.MessageID, to: r.To, stream: STREAM },
        { status: 200 }
      );
      const updated = bumpCookie(prev);
      res.headers.append(
        "Set-Cookie",
        `${RL_COOKIE}=${updated}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 24 * 7}`
      );
      return res;

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Quote ERROR:", message);
      return NextResponse.json({ error: "No se pudo enviar la cotización." }, { status: 500 });
    }
  }

  export async function GET() {
    // Endpoint de verificación simple
    return NextResponse.json({ status: "ok", stream: STREAM, windowHours: WINDOW_MS / 3600000, limit: LIMIT });
  }
