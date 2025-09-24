"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0b0c0f]/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/#inicio" className="flex items-center gap-2" aria-label="Ir al inicio">
            <Image
              src="/images/logo.png" // ← archivo en /public/images/logo.png
              alt="PBS Promotional"
              width={28}
              height={28}
              className="h-7 w-7"
              priority
            />
            <span className="font-semibold text-white">PBS Promotional</span>
          </Link>

          {/* Links desktop */}
          <nav className="hidden md:flex gap-6 text-white/80">
            <Link href="/#inicio" className="hover:text-white">Inicio</Link>
            <Link href="/services" className="hover:text-white">Servicios</Link>
            <Link href="/#about" className="hover:text-white">Quiénes somos</Link>
            <Link href="/#contacto" className="hover:text-white">Contacto</Link>
          </nav>

          {/* Botón hamburguesa móvil */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-[#0b0c0f] border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 space-y-3 text-white/80">
            <Link href="/#inicio" onClick={() => setOpen(false)} className="hover:text-white">
              Inicio
            </Link>
            <Link href="/services" onClick={() => setOpen(false)} className="hover:text-white">
              Servicios
            </Link>
            <Link href="/#about" onClick={() => setOpen(false)} className="hover:text-white">
              Quiénes somos
            </Link>
            <Link href="/#contacto" onClick={() => setOpen(false)} className="hover:text-white">
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
