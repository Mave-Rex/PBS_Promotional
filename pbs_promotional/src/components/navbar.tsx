"use client";

import { useMemo,useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight, MessageCircle } from "lucide-react";
import products from "../data/kits.json";
import { promoCategories } from "@/data/promoCategories";


export default function Navbar() {
  const [open, setOpen] = useState(false);           // drawer móvil
  const [openServices, setOpenServices] = useState(false); // submenú móvil
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
  setOpenSubmenu((prev) => (prev === menu ? null : menu));
};

  type Product = {
  id: string;
  section: string;      // p.ej. "baño", "día_madre", etc.
  name: string;         // título de la pieza
  imagePath: string;    // ruta 1025x642
  description?: string;
};


const categories = useMemo(() => {
  const set = new Set<string>();
  (products as Product[]).forEach((p) => set.add(p.section));
  // orden opcional
  return Array.from(set);
}, []);



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

            {/* Kits con dropdown */}
            <div className="relative group">
              <Link href="/services#kitsCorporativos" className="hover:text-white inline-flex items-center gap-1">
                Kits Corporativos <ChevronDown className="h-4 w-4" />
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
                aria-label="Submenú de Kits"
              >
                <ul className="max-h-80 overflow-auto pr-1">
                  {categories.map((section) => (
                     <li key={section}>
                  <Link
                    href={`/services#sec-${section}`} // 👈 usa el section tal cual
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 text-white/90"
                  >
                    <ChevronRight className="h-4 w-4 opacity-60" />
                    <span className="capitalize">{section.replace(/_/g, " ")}</span>
                  </Link>
                </li>
                  ))}
                </ul>

              </div>
            </div>

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
                aria-label="Submenú de Servicios">
                <ul className="max-h-80 overflow-auto pr-1">
                  <li>
                    <Link
                      href="/services#listaServicios"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 text-white/90"
                    >
                      <ChevronRight className="h-4 w-4 opacity-60" />
                      <span>Artículos Promocionales</span>
                      
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services#listaServicios"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 text-white/90"
                    >
                      <ChevronRight className="h-4 w-4 opacity-60" />
                      <span>Branding</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services#listaServicios"
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 text-white/90"
                    >
                      <ChevronRight className="h-4 w-4 opacity-60" />
                      <span>Eventos Corporativos</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>


            <Link href="/#about" className="hover:text-white">Quiénes somos</Link>
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2  font-semibold text-purple
              hover:shadow-[0_0_28px_#ff69b4AA] "
            >
              <MessageCircle size={16} /> Contacto
            </Link>
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

            {/* Submenú: Kits */}
            <div className="flex items-center justify-between">
              <Link
                href="/services#kitsCorporativos"
                onClick={() => setOpen(false)}
                className="py-2 hover:text-white flex-1"
              >
                Kits Corporativos
              </Link>

              <button
                type="button"
                className="p-2 -mr-2"
                onClick={() => toggleSubmenu("kits")}
                aria-expanded={openSubmenu === "kits"}
                aria-controls="mobile-sub-kits"
                aria-label="Abrir submenú de Kits"
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSubmenu === "kits" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {openSubmenu === "kits" && (
              <div id="mobile-sub-kits" className="ml-3 border-l border-white/10 pl-3">
                <ul className="max-h-64 overflow-auto">
                  {categories.map((section) => (
                    <li key={section}>
                      <Link
                        href={`/services#sec-${section}`}
                        onClick={() => setOpen(false)}
                        className="block py-2 hover:text-white capitalize"
                      >
                        {section.replace(/_/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Submenú: Servicios */}
            <div className="flex items-center justify-between">
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="py-2 hover:text-white flex-1"
              >
                Servicios
              </Link>

              <button
                type="button"
                className="p-2 -mr-2"
                onClick={() => toggleSubmenu("services")}
                aria-expanded={openSubmenu === "services"}
                aria-controls="mobile-sub-services"
                aria-label="Abrir submenú de Servicios"
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSubmenu === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {openSubmenu === "services" && (
              <div id="mobile-sub-services" className="ml-3 border-l border-white/10 pl-3">
                <ul className="max-h-64 overflow-auto">
                  <li>
                    <Link
                      href="/services#listaServicios"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-white"
                    >
                      Artículos Promocionales
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services#listaServicios"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-white"
                    >
                      Branding
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services#listaServicios"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-white"
                    >
                      Eventos Corporativos
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Puedes agregar más submenús fácilmente 
            <div className="flex items-center justify-between">
              <Link href="/otros" onClick={() => setOpen(false)} className="py-2 hover:text-white flex-1">
                Otros
              </Link>
              <button
                type="button"
                className="p-2 -mr-2"
                onClick={() => toggleSubmenu("otros")}
                aria-expanded={openSubmenu === "otros"}
                aria-controls="mobile-sub-otros"
                aria-label="Abrir submenú de Otros"
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    openSubmenu === "otros" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {openSubmenu === "otros" && (
              <div id="mobile-sub-otros" className="ml-3 border-l border-white/10 pl-3">
                <ul className="max-h-64 overflow-auto">
                  <li>
                    <Link
                      href="/otros#sec1"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-white"
                    >
                      Ejemplo 1
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/otros#sec2"
                      onClick={() => setOpen(false)}
                      className="block py-2 hover:text-white"
                    >
                      Ejemplo 2
                    </Link>
                  </li>
                </ul>
              </div>
            )}  */}

            <Link href="/#about" onClick={() => setOpen(false)} className="hover:text-white py-2">
              Quiénes somos
            </Link>
            <div className="pt-2 flex gap-2">
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-pink-500 px-3 py-2 text-center font-semibold text-purple"
            >
              Contacto
            </Link>
          </div>
          </nav>
        </div>
      )}
    </header>
  );
}
