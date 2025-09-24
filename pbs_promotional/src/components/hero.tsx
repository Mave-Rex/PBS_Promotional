import { FaWhatsapp } from "react-icons/fa";
export default function Hero() {
  return (
    <>
      <section
        id="inicio"
        className="pt-24 pb-16 text-center bg-gradient-to-b from-[#1a1d22] to-[#0b0c0f]"
      >
        <h1 className="text-5xl md:text-7xl font-bold">
          <span className="block text-pink-500">PBS</span>
          <span className="block text-2xl md:text-4xl tracking-[0.25em] text-pink-400">
            PROMOTIONAL
          </span>
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-white/90">
          ¡Impulsando tu imagen corporativa!
        </p>
      </section>

      <section className="bg-white text-gray-900 py-12 text-center">
        <p className="text-sm md:text-base">
          ¿Necesitas hablar con uno de nuestros vendedores?
        </p>
        <a
        href="https://wa.me/+593985569985"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-3 rounded-full bg-gray-900 text-white px-6 py-3 md:px-8 md:py-4 shadow-lg hover:shadow-xl">
        <FaWhatsapp className="h-6 w-6 text-green-500" />
        <span className="text-base md:text-lg font-semibold">WhatsApp</span>
        </a>
      </section>
    </>
  );
}
