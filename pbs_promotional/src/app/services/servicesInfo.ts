// src/data/servicesInfo.ts
export type ImageMeta = {
  src: string;       // ruta relativa a /public
  alt: string;
  width: number;     // para <Image />
  height: number;    // para <Image />
};

export type ServiceItem = {
  slug: string;      // anchor/route
  title: string;
  summary: string;   // texto corto para cards/listas
  image: ImageMeta;
  content?: string;  // texto largo opcional para la sección
};

export const heroImage: ImageMeta = {
  src: "/images/services_list.png",
  alt: "Servicios publicitarios",
  width: 800,
  height: 400,
};

export const didYouKnow = {
  title: "¿Sabías qué?",
  text:
    "El marketing es el sistema de investigar un mercado, ofrecer valor y satisfacer al cliente con un objetivo de lucro. También llamada mercadotecnia, estudia el comportamiento de los mercados y las necesidades de los consumidores.",
};

export const servicesList: ServiceItem[] = [
  {
    slug: "articulos-promocionales",
    title: "Artículos Promocionales",
    summary:
      "Merch personalizado para activar tu marca: tazas, bolígrafos, textiles y más.",
    image: {
      src: "/images/promotional_items.png",
      alt: "Artículos promocionales coloridos sobre una mesa",
      width: 1000,
      height: 667,
    },
    content:
      "Desarrollamos y producimos merchandising de alta calidad con impresión a uno o varios colores, bordado y empaques personalizados.",
  },
  {
    slug: "branding",
    title: "Branding",
    summary:
      "Construcción y gestión de marca: identidad visual, manual de marca y aplicaciones.",
    image: {
      src: "/images/branding.png",
      alt: "Piezas de identidad visual y branding",
      width: 1000,
      height: 667,
    },
    content:
      "Definimos tu propuesta de valor, tono y sistema visual. Entregables: logotipo, paleta cromática, tipografía, grillas y guía de uso.",
  },
  {
    slug: "eventos-corporativos",
    title: "Eventos Corporativos",
    summary:
      "Planeación, logística y producción de eventos para empresas.",
    image: {
      src: "/images/corporate_events.png",
      alt: "Evento corporativo con presentaciones",
      width: 1000,
      height: 667,
    },
    content:
      "Coordinamos venue, escenografía, BTL, registro y cobertura audiovisual para que tu evento sea una experiencia memorable.",
  },
];
