"use client";

import Image from "next/image";

type Props = {
  imgSrc?: string;
  pdfHref?: string;
  title?: string;                 // título pequeño arriba de la imagen
  ctaText?: string;               // texto del overlay
  hrColorClass?: string;          // color de la línea (tailwind)
  hrWidthClass?: string;          // ancho de la línea
  alt?: string;
};

export default function DownloadCatalog({
  imgSrc = "/images/catalogo.jpeg",
  pdfHref = "/Catálogo PBS PROMOTIONAL 2024.pdf",       
  ctaText = "Descargar Catálogo",
  alt = "Portada del catálogo",
}: Props) {
  const safeHref = encodeURI(pdfHref);

  return (
    <section id="catalog" className="w-full flex flex-col items-center py-10">
      
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-4">
            Catálogo
          </h2>

      {/* Tarjeta/imagen con overlay de descarga */}
      <a
        href={safeHref}
        download
        aria-label={ctaText}
        className="
          group relative block
          w-full max-w-[360px] sm:max-w-[420px] md:max-w-[460px]
          rounded-2xl overflow-hidden border border-pink-400 bg-black/60
          shadow-[0_0_20px_rgba(255,0,204,.25)]
          hover:shadow-[0_0_36px_rgba(255,0,204,.45)]
          transition
        "
      >
        <Image
          src={imgSrc}
          alt={alt}
          width={1130}
          height={1600}
          sizes="(max-width: 768px) 90vw, 460px"
          className="h-auto w-full object-cover"
          priority
        />

        {/* Glow borde rosa */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-pink-400/30"
        />

        {/* Overlay al hover */}
        <div
          className="
            absolute inset-0 grid place-items-center
            bg-gradient-to-b from-black/10 via-black/40 to-black/70
            opacity-0 group-hover:opacity-100 transition-opacity
          "
        >
          <span
            className="
              px-4 py-2 rounded-xl font-semibold text-black
              bg-pink-400
              shadow-[0_0_24px_rgba(255,0,204,.55)]
            "
          >
            {ctaText}
          </span>
        </div>

        {/* Hint móvil */}
        <span className="absolute bottom-2 right-2 text-xs text-pink-200/80 sm:hidden">
          Toca para descargar
        </span>
      </a>

      {/* Línea ROSA debajo de la imagen (centrada) */}
      <hr className="border-t-2 border-pink-500 my-8 w-2/3 mx-auto" />
    </section>
  );
}
