import { NextRequest, NextResponse } from "next/server";
import { ServerClient } from "postmark";

// === ENV requeridas ===
const TOKEN  = process.env.POSTMARK_TOKEN!;
const FROM   = process.env.MAIL_FROM!;
const TO     = process.env.MAIL_TO!;
const STREAM = process.env.POSTMARK_STREAM || "outbound";

const client = new ServerClient(TOKEN);

// === Rate limit en memoria: 1 envío / hora por IP+email ===
const hits = new Map<string, number>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hora

function keyFor(ip: string, email: string) {
  return `${ip}:${email.toLowerCase()}`; // usa solo IP si prefieres: return ip;
}

function getIP(req: NextRequest) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip;
  return "127.0.0.1";
}

const sanitize = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(req: NextRequest) {
  try {
    // Acepta form-data y JSON
    const ct = req.headers.get("content-type") || "";
    let name = "", email = "", phone = "", subject = "", message = "", website = "";

    if (ct.includes("application/json")) {
      const body = await req.json();
      ({ name = "", email = "", phone = "", subject = "", message = "", website = "" } = body);
    } else {
      const form = await req.formData();
      name = (form.get("name") || "").toString().trim();
      email = (form.get("email") || "").toString().trim();
      phone = (form.get("phone") || "").toString().trim();
      subject = (form.get("subject") || "").toString().trim();
      message = (form.get("message") || "").toString().trim();
      website = (form.get("website") || "").toString().trim(); // honeypot
    }

    // Honeypot
    if (website) return NextResponse.json({ ok: true, skipped: "honeypot" });

    // Validación mínima
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Campos requeridos faltantes." }, { status: 400 });
    }

    // === Rate limit ===
    const ip = getIP(req);
    const k = keyFor(ip, email);
    const last = hits.get(k) || 0;
    const elapsed = Date.now() - last;
    if (elapsed < WINDOW_MS) {
      const retryAfterMinutes = Math.ceil((WINDOW_MS - elapsed) / 60000);
      return NextResponse.json(
        { error: "Límite de envío alcanzado. Intenta más tarde.", retryAfterMinutes },
        { status: 429, headers: { "Retry-After": String(retryAfterMinutes * 60) } }
      );
    }

    // Email HTML
    const html = `
      <h2>Nuevo mensaje</h2>
      <p><b>Nombre:</b> ${sanitize(name)}</p>
      <p><b>Correo:</b> ${sanitize(email)}</p>
      ${phone ? `<p><b>Teléfono:</b> ${sanitize(phone)}</p>` : ""}
      <p><b>Asunto:</b> ${sanitize(subject)}</p>
      <hr/>
      <pre style="white-space:pre-wrap">${sanitize(message)}</pre>
    `;

    // Envío con Postmark
    const r = await client.sendEmail({
      From: FROM,
      To: TO,
      ReplyTo: email,
      Subject: `📩 ${subject} — ${name}`,
      HtmlBody: html,
      TextBody: `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone || "-"}\nAsunto: ${subject}\n\n${message}`,
      MessageStream: STREAM,
    });

    // marca el envío solo si fue OK
    hits.set(k, Date.now());

    return NextResponse.json({
      ok: true,
      id: r.MessageID,
      to: r.To,
      submittedAt: r.SubmittedAt,
      stream: STREAM, // <- usa el que enviaste
    });
  } catch (e: any) {
    console.error("Contact ERROR:", e?.message || e);
    return NextResponse.json({ error: "No se pudo enviar el correo." }, { status: 500 });
  }
}

// (Opcional) Salud del endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", stream: STREAM });
}
