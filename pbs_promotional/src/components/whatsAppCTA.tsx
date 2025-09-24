import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  return (
<section className="bg-white text-gray-900 py-10 text-center">
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
      );
    }