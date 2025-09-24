"use client"; // 👈 necesario en Next.js App Router para usar useState
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // íconos hamburguesa y cerrar

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0b0c0f]/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/#inicio" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="pbs" className="h-7 w-7" />
            <span className="font-semibold text-white">PBS Promotional</span>
          </Link>

          {/* Links desktop */}
          <nav className="hidden md:flex gap-6 text-white/80">
            <a href="/#inicio" className="hover:text-white">Inicio</a>
            <a href="/services" className="hover:text-white">Servicios</a>
            <a href="/#about" className="hover:text-white">Quiénes somos</a>
            <a href="/#contacto" className="hover:text-white">Contacto</a>
            <a href="/#contacto" className="hover:text-white">Cursos Online</a>
          </nav>

          {/* Botón hamburguesa móvil */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {open && (
        <div className="md:hidden bg-[#0b0c0f] border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 space-y-3 text-white/80">
            <a href="/#inicio" onClick={() => setOpen(false)} className="hover:text-white">
              Inicio
            </a>
            <a href="/services" onClick={() => setOpen(false)} className="hover:text-white">
              Servicios
            </a>
            <a href="/#about" onClick={() => setOpen(false)} className="hover:text-white">
              Quiénes somos
            </a>
            <a href="/#contacto" onClick={() => setOpen(false)} className="hover:text-white">
              Contacto
            </a>
            <a href="/#contacto" onClick={() => setOpen(false)} className="hover:text-white">
              Cursos Online
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
