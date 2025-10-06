import Image from "next/image";
import { heroImage, didYouKnow, servicesList } from "./servicesInfo";

export default function ServicesMain() {
  return (
    <main className="pt-14 md:pt-14">
      {/* Hero */}
      <section
        className="
          relative mx-auto w-[92%] max-w-4xl
          h-[42vh] sm:h-[46vh] md:h-[50vh] lg:h-[54vh]
          overflow-hidden rounded-2xl
        "
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          sizes="(min-width:1024px) 800px, 92vw"
          className="object-cover"
          priority
        />

        {/* Overlay para mejorar contraste del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Título centrado y responsivo */}
        <div className="absolute inset-0 flex items-end md:items-center justify-center p-4">
          <h1 className="text-white text-center font-bold leading-tight
                        text-3xl sm:text-4xl md:text-5xl drop-shadow">
            Servicios <br className="sm:hidden" /> Publicitarios
          </h1>
        </div>
      </section>

      {/* ¿Sabías qué? */}
      <section id="listaServicios"  className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-pink-500 text-center mb-4">
          {didYouKnow.title}
        </h2>
        <p className="text-gray-700 text-justify">{didYouKnow.text}</p>
      </section>

      {/* Lista de servicios */}
      <section className="max-w-5xl mx-auto px-4 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesList.map((s) => (
          <article key={s.slug} id={s.slug} className="bg-white rounded-xl shadow p-4">
            <Image
              src={s.image.src}
              alt={s.image.alt}
              width={s.image.width}
              height={s.image.height}
              className="w-full h-auto rounded-md"
            />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">{s.title}</h3>
            <p className="mt-2 text-gray-600">{s.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
