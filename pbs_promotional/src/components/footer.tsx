import { Facebook, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b0c0f] border-t border-white/10">
      {/* Redes sociales */}
      <div className="py-10 text-center">
        <h2 className="text-2xl font-semibold text-pink-500 mb-6">
          Síguenos en Redes
        </h2>
        <div className="flex justify-center gap-6">
          <Link
            href="https://www.instagram.com/pbspromotional.ec/"
            target="_blank"
            aria-label="Instagram PBS Promotional">
            <Instagram
              size={32}
              className="text-pink-500 hover:text-pink-400 transition-colors duration-200"
            />
          </Link>
          {/*<Link
            href="https://wa.me/0000000000"
            target="_blank"
            aria-label="WhatsApp PBS Promotional">
            <MessageCircle
              size={32}
              className="text-pink-500 hover:text-pink-400 transition-colors duration-200"
            />
          </Link>
          <Link
            href="https://www.facebook.com/"
            target="_blank"
            aria-label="Facebook PBS Promotional">
            <Facebook
              size={32}
              className="text-pink-500 hover:text-pink-400 transition-colors duration-200"
            />
          </Link>*/}
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} PBS Promotional. Todos los derechos
          reservados.
        </p>
        {/*<p className="text-sm text-white/60">
          Powered by{" "}
          <a
            href="#"
            className="text-pink-500 hover:text-pink-400 font-medium transition-colors duration-200"
          >
            Rex Team Digital Solutions
          </a>
        </p> */}
      </div>
    </footer>
  );
}
