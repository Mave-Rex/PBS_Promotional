"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { itemCategories } from "../app/services/itemCategories";
export default function Navbar() {
  const [open, setOpen] = useState(false);           // drawer móvil
  const [openServices, setOpenServices] = useState(false); // submenú móvil

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0b0c0f]/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/#inicio" className="flex items-center gap-2" aria-label="Ir al inicio">
            <Image src="/images/logo_sin_fondo.png" alt="PBS Promotional" width={28} height={28} className="h-7 w-7" priority />
            <span className="font-semibold text-white">PBS Promotional</span>
          </Link>

          {/* Links desktop */}
          <nav className="hidden md:flex items-center gap-6 text-white/80">
            <Link href="/#inicio" className="hover:text-white">Inicio</Link>

            {/* Servicios con dropdown */}
            <div className="relative group">
              <Link href="/services" className="hover:text-white inline-flex items-center gap-1">
                Servicios <ChevronDown className="h-4 w-4" />
              </Link>

              {/* Dropdown */}
              <div
                className="
                  invisible opacity-0 translate-y-1
                  group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-200
                  absolute left-0 top-full mt-2 w-80 rounded-xl border border-white/10
                  bg-zinc-900/95 backdrop-blur shadow-xl p-3
                "
                role="menu"
                aria-label="Submenú de servicios"
              >
                <div className="px-2 pb-2 text-xs uppercase tracking-wide text-zinc-400">
                  Artículos Promocionales
                </div>
                <ul className="max-h-80 overflow-auto pr-1">
                  {itemCategories.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={"/underConstruction"}
                        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 text-white/90"
                      >
                        <ChevronRight className="h-4 w-4 opacity-60" />
                        <span>{c.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

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

      {/* Drawer móvil */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-[#0b0c0f] border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 space-y-2 text-white/80">
            <Link href="/#inicio" onClick={() => setOpen(false)} className="hover:text-white py-2">
              Inicio
            </Link>

        {/* Servicios (fila con link + botón toggle) */}
        <div className="flex items-center justify-between">
          {/* Link que navega a /services y cierra el drawer */}
          <Link
            href="/services"
            onClick={() => setOpen(false)}
            className="py-2 hover:text-white flex-1"
          >
            Servicios
          </Link>

          {/* Botón que SOLO abre/cierra el submenú */}
          <button
            type="button"
            className="p-2 -mr-2"
            onClick={() => setOpenServices(v => !v)}
            aria-expanded={openServices}
            aria-controls="mobile-sub-services"
            aria-label="Abrir submenú de Servicios"
          >
            <ChevronDown className={`h-5 w-5 transition-transform ${openServices ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Submenú móvil */}
        {openServices && (
          <div id="mobile-sub-services" className="ml-3 border-l border-white/10 pl-3">
            <ul className="max-h-64 overflow-auto">
              {/* Opcional: primer item que también va a /services */}
              <li>
                <Link
                  href="/services"
                  onClick={() => setOpen(false)}
                  className="block py-2 font-medium hover:text-white"
                >
                  Ver todos los servicios
                </Link>
              </li>

              {itemCategories.map(c => (
                <li key={c.slug}>
                  <Link
                    href={`/services/articulos/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="block py-2 hover:text-white"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
            <Link href="/#about" onClick={() => setOpen(false)} className="hover:text-white py-2">
              Quiénes somos
            </Link>
            <Link href="/#contacto" onClick={() => setOpen(false)} className="hover:text-white py-2">
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
