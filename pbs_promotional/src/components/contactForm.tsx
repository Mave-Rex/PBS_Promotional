export default function ContactForm() {
  return (
    <section id="contacto" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Contáctanos
          </h2>
          <p className="mt-3 text-gray-600">
            Cuéntanos sobre tu proyecto y te responderemos muy pronto.
          </p>
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
                    <a href="mailto:contacto@pbs.ec" className="text-gray-600 hover:text-gray-800">
                      pbspromotionalcorporativo@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-pink-500" />
                  <div>
                    <p className="font-medium text-gray-800">Teléfono</p>
                    <a href="tel:+593000000000" className="text-gray-600 hover:text-gray-800">
                      +593 098 556 9985
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
            {/* 
              👉 Si usas Formspree, pon tu endpoint en action:
              action="https://formspree.io/f/TU_ID" method="POST"
              O cambia por tu endpoint serverless /api/contact
            */}
            <form
              action="#"
              method="POST"
              className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-lg"
            >
              {/* Honeypot anti-spam */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Correo</label>
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="+593 …"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Asunto</label>
                  <input
                    name="subject"
                    required
                    className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 
                               focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                    placeholder="¿Sobre qué quieres hablar?"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                <textarea
                  name="message"
                  required
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 min-h-[140px]
                             focus:outline-none focus:ring-4 focus:ring-pink-100 focus:border-pink-500"
                  placeholder="Cuéntanos brevemente tu necesidad…"
                />
              </div>

              {/* reCAPTCHA v3/hCaptcha podría ir aquí si lo integras */}

              <div className="mt-6 flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white shadow hover:bg-pink-700"
                >
                  Enviar mensaje
                </button>
                <span className="text-xs text-gray-500">Tiempo de respuesta: 24–48h</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
