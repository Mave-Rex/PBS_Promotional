"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Modal from "../../components/productModal";
import ReactCountryFlag from "react-country-flag";

// Tipos del documento
type ProductItem = {
  id: string;
  section: string;      // p.ej. "baño", "día_madre", etc.
  name: string;         // título de la pieza
  imagePath: string;    // ruta 1025x642
  description?: string; // opcional
};

// Util: agrupar por sección
function groupBySection(items: ProductItem[]) {
  const map: Record<string, ProductItem[]> = {};
  for (const it of items) {
    (map[it.section] ||= []).push(it);
  }
  return map;
}

export default function PromotionalProducts() {
  const [data, setData] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ProductItem | null>(null);

  useEffect(() => {
    let mounted = true;

    // 1) intenta vía API
    fetch("/api/products")
      .then(async (r) => {
        if (!r.ok) throw new Error("No se pudo cargar /api/products");
        return r.json();
      })
      .then((json: ProductItem[]) => {
        if (mounted) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(async () => {
        // 2) fallback: importar JSON local
        try {
          const mod = await import("../../data/products.json");
          if (mounted) {
            setData(mod.default as ProductItem[]);
            setLoading(false);
          }
        } catch (e) {
          if (mounted) {
            setError("No se pudo cargar el documento de productos.");
            setLoading(false);
          }
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => groupBySection(data), [data]);
  const sections = useMemo(() => Object.keys(grouped), [grouped]);

  if (loading) {
    return (
      <section className="py-4 md:py-4 bg-white text-gray-800">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Productos <span className="text-pink-600">Promocionales</span>
          </h2>
          <p className="mt-6 text-center text-gray-500">Cargando…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-2 md:py-2 bg-white text-gray-800">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Productos <span className="text-pink-600">Promocionales</span>
          </h2>
          <p className="mt-6 text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="py-2 md:py-2 bg-white text-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        {/* Título general llamativo */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Productos <span className="text-pink-600">Promocionales</span>
          </h2>
          <p className="mt-3 text-gray-600">
            Envíos a Nivel Nacional
          </p>
          <ReactCountryFlag countryCode="EC" svg style={{ width: "1.5em", height: "1em" }} />
        </div>

        {/* “Tarjetas” de secciones (derivadas del documento) */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sections.map((sec) => (
            <a
              key={sec}
              href={`#sec-${sec}`}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-semibold text-gray-800 hover:border-pink-400 hover:shadow"
              title={`Ir a ${sec.replace("_", " ")}`}
            >
              {sec.replace("_", " ")}
            </a>
          ))}
        </div>

        {/* Listado por sección */}
        <div className="mt-12 space-y-14">
          {sections.map((sec) => (
            <div key={sec} id={`sec-${sec}`}>
              <div className="mb-5 flex items-center gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
                  {sec.replace("_", " ")}
                </h3>
                <div className="flex-grow border-t-2 border-pink-500"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped[sec].map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative">
                      {/* Mantener relación 1025x642 */}
                      <div className="relative w-full aspect-[1025/642]">
                        <Image
                          src={item.imagePath}
                          alt={item.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    </div>

                    <div className="p-4 text-center">
                      <h4 className="text-base font-semibold text-gray-900">
                        {item.name}
                      </h4>

                      {/* Si hay descripción, muestra botón → abre modal */}
                      {item.description ? (
                        <button
                          onClick={() => {
                            setCurrent(item);
                            setOpen(true);
                          }}
                          className="mt-3 inline-flex items-center rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
                        >
                          Ver detalle
                        </button>
                      ) : (
                        <p className="mt-2 text-sm text-gray-500">
                          {/* sin descripción; no se muestra botón */}
                          {/* (podrías mostrar tags, precio, etc.) */}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalle */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={current?.name}
      >
        {current && (
          <div className="space-y-3">
            <div className="relative w-full aspect-[1025/642] overflow-hidden rounded-xl">
              <Image
                src={current.imagePath}
                alt={current.name}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            {Array.isArray(current?.description) ? (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    {current.description.map((idea, idx) => (
                    <li key={idx}>{idea}</li>
                    ))}
                </ul>
             ) : (
                <p className="text-gray-700 leading-relaxed">{current?.description}</p>
            )}

          </div>
        )}
      </Modal>
    </section>
  );
}
