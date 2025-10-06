import { NextRequest, NextResponse } from "next/server";
import { ServerClient } from "postmark";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Rate limit en memoria (está bien en top-level)
const hits = new Map<string, number>();
const WINDOW_MS = 60 * 60 * 1000;

const sanitize = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
const keyFor = (ip: string, email: string) => `${ip}:${email.toLowerCase()}`;
const getIP = (req: NextRequest) => {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip;
  return "127.0.0.1";
};

export async function POST(req: NextRequest) {
  try {
    // ✅ lee y valida ENV en runtime, no en build
    const TOKEN  = process.env.POSTMARK_TOKEN;
    const FROM   = process.env.MAIL_FROM;
    const TO     = process.env.MAIL_TO;
    const STREAM = process.env.POSTMARK_STREAM || "outbound";

    if (!TOKEN || !FROM || !TO) {
      return NextResponse.json(
        { error: "Faltan variables de entorno (POSTMARK_TOKEN, MAIL_FROM, MAIL_TO)." },
        { status: 500 }
      );
    }

    const client = new ServerClient(TOKEN);

    // Acepta JSON o form-data
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

    if (website) return NextResponse.json({ ok: true, skipped: "honeypot" });
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Campos requeridos faltantes." }, { status: 400 });
    }

    // Rate limit
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

    const html = `
      <h2>Nuevo mensaje</h2>
      <p><b>Nombre:</b> ${sanitize(name)}</p>
      <p><b>Correo:</b> ${sanitize(email)}</p>
      ${phone ? `<p><b>Teléfono:</b> ${sanitize(phone)}</p>` : ""}
      <p><b>Asunto:</b> ${sanitize(subject)}</p>
      <hr/>
      <pre style="white-space:pre-wrap">${sanitize(message)}</pre>
    `;

    const r = await client.sendEmail({
      From: FROM,
      To: TO,
      ReplyTo: email,
      Subject: `📩 ${subject} — ${name}`,
      HtmlBody: html,
      TextBody: `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone || "-"}\nAsunto: ${subject}\n\n${message}`,
      MessageStream: STREAM,
    });

    hits.set(k, Date.now());

    return NextResponse.json({
      ok: true,
      id: r.MessageID,
      to: r.To,
      submittedAt: r.SubmittedAt,
      stream: STREAM,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Contact ERROR:", message);
    return NextResponse.json({ error: "No se pudo enviar el correo." }, { status: 500 });
  }
}

export async function GET() {
  const STREAM = process.env.POSTMARK_STREAM || "outbound";
  return NextResponse.json({ status: "ok", stream: STREAM });
}
