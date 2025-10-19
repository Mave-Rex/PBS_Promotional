"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Modal from "../../components/productModal";
import ReactCountryFlag from "react-country-flag";

/* =========================
   Tipos base (del documento)
========================= */
type ProductItem = {
  id: string;
  section: string;      // "baño", "día_madre", etc.
  name: string;         // título
  imagePath: string;    // ruta 1025x642
  description?: string | string[];
};

type CartItem = {
  id: string;
  name: string;
  imagePath: string;
  qty: number;
};

/* =========================
   Utils
========================= */
function groupBySection(items: ProductItem[]) {
  const map: Record<string, ProductItem[]> = {};
  for (const it of items) (map[it.section] ||= []).push(it);
  return map;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Valida móvil de Ecuador:
 *  - 09XXXXXXXX (10 dígitos)  ó
 *  - +5939XXXXXXXX (12 dígitos después del +)
 */
function isValidEcuPhone(phone: string) {
  const cleaned = phone.replace(/\s|-/g, "");
  return /^(?:09\d{8}|\+5939\d{8})$/.test(cleaned);
}

/* =========================
   Toasts locales
========================= */
type Toast = { id: number; type: "info"|"success"|"error"; msg: string };
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);
  function push(type: Toast["type"], msg: string, ttl = 3000) {
    const id = idRef.current++;
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), ttl);
  }
  return { toasts, push };
}

/* =========================
   Componente principal
========================= */
export default function CorporativeKits() {
  const [data, setData] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ProductItem | null>(null);

  // Carrito (en este componente)
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  // Form RFQ
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState<"idle"|"sending">("idle");

  // Honeypot
  const [website, setWebsite] = useState("");

  const { toasts, push } = useToasts();

  /* Carga de productos */
  useEffect(() => {
    let mounted = true;
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
        try {
          const mod = await import("../../data/kits.json");
          if (mounted) {
            setData(mod.default as ProductItem[]);
            setLoading(false);
          }
        } catch {
          if (mounted) {
            setError("No se pudo cargar el documento de productos.");
            setLoading(false);
          }
        }
      });
    return () => { mounted = false; };
  }, []);

  const grouped = useMemo(() => groupBySection(data), [data]);
  const sections = useMemo(() => Object.keys(grouped), [grouped]);

  /* =========================
     Lógica Carrito
  ========================= */
  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const totalUnits = useMemo(
    () => cartItems.reduce((acc, it) => acc + it.qty, 0),
    [cartItems]
  );

  function addToCart(item: ProductItem, qty = 1) {
    setCart((prev) => {
      const ex = prev[item.id];
      const nextQty = Math.max(1, (ex?.qty ?? 0) + qty);
      return {
        ...prev,
        [item.id]: {
          id: item.id,
          name: item.name,
          imagePath: item.imagePath,
          qty: nextQty,
        },
      };
    });
    push("success", `Añadido: ${item.name}`);
  }

  function inc(id: string) {
    setCart((prev) => ({ ...prev, [id]: { ...prev[id], qty: prev[id].qty + 1 } }));
  }
  function dec(id: string) {
    setCart((prev) => {
      const it = prev[id];
      if (!it) return prev;
      const q = Math.max(1, it.qty - 1);
      return { ...prev, [id]: { ...it, qty: q } };
    });
  }
  function removeFromCart(id: string) {
    setCart((prev) => {
      const clone = { ...prev };
      const removed = clone[id]?.name;
      delete clone[id];
      if (removed) push("info", `Quitado: ${removed}`);
      return clone;
    });
  }
  function clearCart() {
    setCart({});
  }

  /* =========================
     Envío de solicitud (RFQ)
  ========================= */
  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    if (sending === "sending") return;

    if (website.trim()) {
      // honeypot: simulamos OK
      push("success", "Solicitud enviada.");
      clearCart();
      setName(""); setEmail(""); setPhone(""); setNotes("");
      setCartOpen(false);
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      push("error", "Nombre inválido (mínimo 2 caracteres).");
      return;
    }
    if (!isValidEmail(email.trim())) {
      push("error", "Email inválido.");
      return;
    }
    if (!isValidEcuPhone(phone.trim())) {
      push("error", "Teléfono inválido (Ecuador: 09XXXXXXXX o +5939XXXXXXXX).");
      return;
    }
    if (cartItems.length === 0) {
      push("error", "Tu carrito está vacío.");
      return;
    }

    setSending("sending");
    try {
      const payload = {
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
        notes: notes.trim(),
        items: cartItems.map(({name, qty }) => ({name, qty })),
        // Puedes incluir metadata adicional si la tienes (ciudad, empresa, etc.)
      };

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        push("success", "¡Solicitud enviada! Te contactaremos pronto.");
        clearCart();
        setName(""); setEmail(""); setPhone(""); setNotes("");
        setCartOpen(false);
      } else {
        const j = await res.json().catch(() => ({}));
        push("error", j?.error ?? "No se pudo enviar la solicitud.");
      }
    } catch {
      push("error", "Error de red al enviar la solicitud.");
    } finally {
      setSending("idle");
    }
  }

  /* =========================
     UI
  ========================= */
  if (loading) {
    return (
      <section className="py-4 md:py-4 bg-white text-gray-800">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Kits <span className="text-pink-600">Corporativos</span>
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
            Kits <span className="text-pink-600">Corporativos</span>
          </h2>
          <p className="mt-6 text-center text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="kitsCorporativos" className="py-2 md:py-2 bg-white text-gray-900 relative">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`rounded-xl px-4 py-3 shadow text-sm
                        ${t.type === "success" ? "bg-green-50 text-green-700 border border-green-200"
                          : t.type === "error" ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-gray-900 text-white border border-gray-800"}`}
          >
            {t.msg}
          </div>
        ))}
      </div>

      {/* Botón flotante del carrito */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 z-[50] inline-flex items-center gap-2 rounded-full bg-pink-600 px-4 py-3 text-white shadow-lg hover:bg-pink-700"
        aria-label="Abrir carrito de cotización"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-white" />
        <span className="font-semibold text-sm">Cotización ({totalUnits})</span>
      </button>

      <div className="mx-auto max-w-7xl px-4">
        {/* Título */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Kits <span className="text-pink-600">Corporativos</span>
          </h2>
          <p className="mt-3 text-gray-600">Envíos a Nivel Nacional</p>
          <ReactCountryFlag countryCode="EC" svg style={{ width: "1.5em", height: "1em" }} />
        </div>

        {/* Índice de secciones */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sections.map((sec) => (
            <a
              key={sec}
              href={`#sec-${sec}`}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-semibold text-gray-800 hover:border-pink-400 hover:shadow capitalize"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {grouped[sec].map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="relative">
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
                      <h4 className="text-base font-semibold text-gray-900">{item.name}</h4>

                      <div className="mt-3 flex items-center justify-center gap-3">
                        {item.description && (
                          <button
                            onClick={() => { setCurrent(item); setOpen(true); }}
                            className="inline-flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-200"
                          >
                            Ver detalle
                          </button>
                        )}
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="inline-flex items-center rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
                        >
                          Añadir a cotización
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalle */}
      <Modal open={open} onClose={() => setOpen(false)} title={current?.name}>
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
            {Array.isArray(current.description) ? (
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {current.description.map((idea, idx) => (
                  <li key={idx}>{idea}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 leading-relaxed">{current.description}</p>
            )}

            <div className="pt-2">
              <button
                onClick={() => { addToCart(current, 1); setOpen(false); setCartOpen(true); }}
                className="inline-flex items-center rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
              >
                Añadir a cotización
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Drawer Carrito + Form */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white border-l border-gray-200 shadow-2xl z-[55] transform transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de cotización"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="text-lg font-semibold">Tu cotización ({totalUnits})</h4>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-lg px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>

        <div className="h-full overflow-y-auto">
          {/* Lista de items */}
          <div className="p-4 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">No has añadido productos.</p>
            ) : (
              cartItems.map((it) => (
                <div key={it.id} className="flex gap-3 items-center border rounded-xl p-2">
                  <div className="relative h-16 w-24 rounded-md overflow-hidden bg-gray-100">
                    <Image src={it.imagePath} alt={it.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{it.name}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => dec(it.id)}
                        className="h-7 w-7 rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Disminuir"
                      >−</button>
                      <span className="min-w-6 text-center">{it.qty}</span>
                      <button
                        onClick={() => inc(it.id)}
                        className="h-7 w-7 rounded-md bg-gray-100 hover:bg-gray-200"
                        aria-label="Aumentar"
                      >+</button>
                      <button
                        onClick={() => removeFromCart(it.id)}
                        className="ml-auto text-xs text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-600 hover:underline"
              >
                Vaciar carrito
              </button>
            )}
          </div>

          {/* Formulario de contacto */}
          <div className="p-4 border-t bg-gray-50">
            <h5 className="text-sm font-semibold mb-3">Datos para cotización</h5>
            <form onSubmit={submitQuote} className="space-y-3">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                autoComplete="off"
                tabIndex={-1}
              />

              <div>
                <label className="block text-xs text-gray-600 mb-1">Nombre*</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Email*</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="tucorreo@dominio.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Teléfono*</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="+593 ..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Notas (opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Indícanos cantidades aproximadas, ciudad de entrega, etc."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={sending === "sending" || cartItems.length === 0}
                className={`w-full rounded-xl px-4 py-2 text-sm font-semibold text-white
                  ${sending === "sending" || cartItems.length === 0
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"}`}
              >
                {sending === "sending" ? "Enviando…" : "Enviar solicitud"}
              </button>

              <p className="text-[11px] text-gray-500">
                Al enviar aceptas ser contactado para elaborar tu cotización. No es un pago ni compromiso de compra.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Backdrop del drawer */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setCartOpen(false)}
          aria-hidden
        />
      )}
    </section>
  );
}
