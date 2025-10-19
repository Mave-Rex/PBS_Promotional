"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ====== Rate-limit (frontend) ======
const WINDOW_MS = 2 * 60 * 60 * 1000; // 2 horas
const LS_KEY = "contact:lastSentAt";

// ====== Helpers teléfono Ecuador ======
function normalizeEcPhone(raw: string): string | null {
  if (!raw) return null;
  const s = raw.replace(/[\s\-().]/g, "");

  // E.164
  if (/^\+5939\d{8}$/.test(s)) return s;        // móvil: +593 9 ########
  if (/^\+593[2-7]\d{7}$/.test(s)) return s;    // fijo:  +593 [2-7] #######

  // Locales
  if (/^09\d{8}$/.test(s)) return "+593" + s.slice(1);     // 09 -> +5939
  if (/^0[2-7]\d{7}$/.test(s)) return "+593" + s.slice(1); // 0X -> +593X
  return null;
}

// ====== Schema Zod ======
const Schema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(60, "Nombre demasiado largo"),
  email: z.string().email("Correo inválido"),
  phone: z
    .string()
    .trim()
    .min(7, "Teléfono demasiado corto")
    .refine((v) => normalizeEcPhone(v) !== null, "Teléfono de Ecuador inválido"),
  subject: z.string().trim().min(3, "Asunto muy corto").max(80, "Asunto demasiado largo"),
  message: z
    .string()
    .trim()
    .min(10, "Por favor, agrega más detalles")
    .refine(
      (v) => v.split(/\s+/).filter(Boolean).length <= 200,
      "Máximo 200 palabras"
    ),
  website: z.string().optional(), // honeypot
});

type FormInputs = z.infer<typeof Schema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [serverMsg, setServerMsg] = useState<string>("");
  const alertRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<FormInputs>({
    resolver: zodResolver(Schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("sending");
    setServerMsg("");

    // --- Rate-limit silencioso (solo frontend) ---
    if (typeof window !== "undefined") {
      const last = Number(localStorage.getItem(LS_KEY) || 0);
      const now = Date.now();
      if (last && now - last < WINDOW_MS) {
        // Simula éxito: NO llamamos al backend
        setStatus("ok");
        reset();
        setTimeout(() => alertRef.current?.focus(), 0);
        return;
      }
    }

    // Honeypot: si trae algo, simula OK y no envía
    if ((values.website || "").trim()) {
      setStatus("ok");
      reset();
      if (typeof window !== "undefined") localStorage.setItem(LS_KEY, String(Date.now()));
      setTimeout(() => alertRef.current?.focus(), 0);
      return;
    }

    // Normaliza teléfono a +593…
    const normalized = normalizeEcPhone(values.phone);
    if (!normalized) {
      setError("phone", { type: "manual", message: "Teléfono de Ecuador inválido" });
      setStatus("err");
      setTimeout(() => alertRef.current?.focus(), 0);
      return;
    }

    try {
      // Envío real (FormData) a tu backend
      const data = new FormData();
      data.set("name", values.name.trim());
      data.set("email", values.email.trim());
      data.set("phone", normalized);
      data.set("subject", values.subject.trim());
      data.set("message", values.message.trim());
      data.set("website", values.website || "");

      const res = await fetch("/api/contact", { method: "POST", body: data });

      if (res.ok) {
        setStatus("ok");
        reset();
        if (typeof window !== "undefined") localStorage.setItem(LS_KEY, String(Date.now()));
      } else {
        type ErrorResponse = { error?: string };
        let json: unknown = {};
        try { json = await res.json(); } catch { /* ignore */ }
        const { error } = json as ErrorResponse;
        setServerMsg(error ?? `Código ${res.status}`);
        setStatus("err");
      }
    } finally {
      setTimeout(() => alertRef.current?.focus(), 0);
    }
  });

  return (
    <section id="contacto" className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">Contáctanos</h2>
          <p className="mt-3 text-gray-600">Cuéntanos sobre tu proyecto y te responderemos muy pronto.</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Panel de información */}
          <aside className="md:col-span-2">
            <div className="h-full rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-7 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800">Información</h3>
              <p className="mt-2 text-sm text-gray-600">
                Escríbenos o agenda una llamada. También atendemos por WhatsApp.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <a href="mailto:pbspromotionalcorporativo@gmail.com" className="text-gray-600 hover:text-gray-800">
                      pbspromotionalcorporativo@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <div>
                    <p className="font-medium text-gray-800">Teléfono</p>
                    <a href="tel:+593985569985" className="text-gray-600 hover:text-gray-800">
                      +593 98 556 9985
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <div>
                    <p className="font-medium text-gray-800">Horario</p>
                    <p className="text-gray-600">Lun–Vie · 09:00–17:00</p>
                  </div>
                </li>
              </ul>

              <a
                href="https://wa.me/+593985569985"
                target="_blank"
                rel="noopener"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white shadow hover:bg-pink-700"
              >
                WhatsApp
              </a>

              <p className="mt-4 text-xs text-gray-500">
                * Respetamos tu privacidad. No compartimos tu información.
              </p>
            </div>
          </aside>

          {/* Formulario */}
          <div className="md:col-span-3">
            <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg">
              {/* Honeypot anti-spam */}
              <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    {...register("name")}
                    required
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="Tu nombre"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                  {errors.name && (
                    <p id="err-name" className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo</label>
                  <input
                    type="email"
                    {...register("email")}
                    required
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="tucorreo@ejemplo.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                  {errors.email && (
                    <p id="err-email" className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    {...register("phone")}
                    autoComplete="tel"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="+593 ..."
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                  />
                  {errors.phone && (
                    <p id="err-phone" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Asunto</label>
                  <input
                    {...register("subject")}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="¿Qué servicio necesitas?"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "err-subject" : undefined}
                  />
                  {errors.subject && (
                    <p id="err-subject" className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea
                  {...register("message")}
                  required
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 min-h-[140px]
                             focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                  placeholder="Cuéntanos brevemente tu necesidad…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-message" : undefined}
                />
                {errors.message && (
                  <p id="err-message" className="mt-1 text-xs text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Área de alertas accesible */}
              <div
                ref={alertRef}
                tabIndex={-1}
                aria-live="polite"
                aria-atomic="true"
                className="mt-4"
              >
                {status === "ok" && (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    ¡Mensaje enviado! Te responderemos en 24–48h.
                  </div>
                )}
                {status === "err" && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    No pudimos enviar tu mensaje. {serverMsg || "Intenta nuevamente."}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "sending" || isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white shadow hover:bg-pink-700 disabled:opacity-60"
                >
                  {status === "sending" || isSubmitting ? "Enviando…" : "Enviar mensaje"}
                </button>
                <span className="text-xs text-gray-500">
                  {status === "sending" ? "Procesando…" : "Tiempo de respuesta: 24–48h"}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
