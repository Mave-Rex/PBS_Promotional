// app/components/Hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Slide = {
  image: string;          // ruta de la imagen (1920x1080 aprox)
  subtitle: string;       // texto que aparece debajo de "PROMOTIONAL"
  href: string;           // hash o ruta a donde navegar al hacer click
  alt?: string;
};

const SLIDES: Slide[] = [
  { image: "/images/catalogo.jpg", subtitle: "Catálogo", href: "/services", alt: "Catálogo de productos" },
  { image: "/images/kits.jpg",   subtitle: "Kits Corporativos", href: "/services#kitsCorporativos", alt: "Servicios de diseño" },
  { image: "/images/servicios.jpg", subtitle: "Servicios", href: "/services", alt: "Branding e identidad" },
];

const AUTOPLAY_MS = 5000;

export default function Hero() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = SLIDES.length;

  const goTo = (i: number) => setIndex((i + total) % total);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // autoplay
  useEffect(() => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  // pausa en hover con un pequeño truco
  const pause = () => timerRef.current && clearTimeout(timerRef.current);
  const resume = () => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, AUTOPLAY_MS);
  };

  return (
    <section
      id="inicio"
      className="relative isolate h-[55vh] min-h-[420px] w-full overflow-hidden bg-[#0b0c0f] text-center flex flex-col justify-center"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Slides de fondo */}
      <div className="absolute inset-0 ">
        {SLIDES.map((s, i) => (
          <div
            key={s.image}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt={s.alt ?? s.subtitle}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* oscurecedor + degradado para legibilidad del texto */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Contenido (logotipo / título) */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          <span className="block text-pink-400 drop-shadow-[0_4px_16px_rgba(236,72,153,0.35)]">PBS</span>
          <span className="block text-2xl md:text-4xl tracking-[0.25em] text-pink-400">
            PROMOTIONAL
          </span>
        </h1>

        {/* Subtítulo dinámico con enlace */}
        <Link
          href={SLIDES[index].href}
          scroll
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-lg md:text-xl 
                     text-white/95 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label={`Ir a ${SLIDES[index].subtitle}`}
        >
          <span>{SLIDES[index].subtitle}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" className="inline-block">
            <path fill="currentColor" d="m13.172 12l-4.95-4.95l1.414-1.414L16 12l-6.364 6.364l-1.414-1.414z"/>
          </svg>
        </Link>

        {/* Lema fijo opcional */}
        <p className="mt-4 text-base md:text-lg text-white/80">
          ¡Impulsando tu Imagen Corporativa!
        </p>
      </div>

      {/* Controles */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-2 md:px-4">
        <button
          onClick={prev}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white/25
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Slide anterior"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="m10.828 12l4.95 4.95l-1.414 1.414L8 12l6.364-6.364l1.414 1.414z"/>
          </svg>
        </button>
        <button
          onClick={next}
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white/25
                     focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Slide siguiente"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="m13.172 12l-4.95-4.95l1.414-1.414L16 12l-6.364 6.364l-1.414-1.414z"/>
          </svg>
        </button>
      </div>

      {/* Bullets */}
      <div className="absolute bottom-5 left-0 right-0 z-10 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-pink-400
              ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
