import Image from "next/image";
import { heroImage, didYouKnow, servicesList } from "./servicesInfo";

export default function ServicesMain() {
  return (
    <main className="pt-14 md:pt-14">
      {/* Hero */}
      <section
        className="
          relative mx-auto max-w-4xl
          h-[38vh] md:h-[45vh] lg:h-[52vh]
          overflow-hidden rounded-2xl
        "
      >
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          width={heroImage.width}
          height={heroImage.height}
          className="w-full h-auto object-cover"
          priority
        />
        <h1 className="absolute inset-x-0 bottom-6 text-center text-white text-4xl font-bold">
          Servicios Publicitarios
        </h1>
      </section>

      {/* ¿Sabías qué? */}
      <section className="max-w-3xl mx-auto px-4 py-10">
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
