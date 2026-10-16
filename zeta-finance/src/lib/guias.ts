export const GUIA_SLUGS = [
  "medicos",
  "abogados",
  "contadores",
  "ingenieros",
  "rrhh",
  "psicologos",
  "emprendedores",
] as const;

export type GuiaSlug = (typeof GUIA_SLUGS)[number];

export type Guia = {
  slug: GuiaSlug;
  nombre: string;
  titulo: string;
  resumen: string;
  archivo: string;
  archivoNombre: string;
};

export const GUIAS: readonly Guia[] = [
  {
    slug: "medicos",
    nombre: "Médicos",
    titulo: "Finanzas para médicos",
    resumen:
      "7 pasos concretos para ordenar ingresos variables, protegerte de los imprevistos y hacer crecer tus ahorros.",
    archivo: "/guias/medicos.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-medicos.pdf",
  },
  {
    slug: "abogados",
    nombre: "Abogados",
    titulo: "Finanzas para abogados",
    resumen:
      "7 pasos concretos para ordenar honorarios irregulares, atravesar los meses flojos y convertir los cobros grandes en patrimonio.",
    archivo: "/guias/abogados.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-abogados.pdf",
  },
  {
    slug: "contadores",
    nombre: "Contadores",
    titulo: "Finanzas para contadores",
    resumen:
      "Herramientas para responder las preguntas de inversión de tus clientes, detectar quién necesita un plan y ordenar también tus propias finanzas.",
    archivo: "/guias/contadores.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-contadores.pdf",
  },
  {
    slug: "ingenieros",
    nombre: "Ingenieros",
    titulo: "Finanzas para ingenieros",
    resumen:
      "7 pasos para ordenar sueldo, bonos y proyectos, invertir en pesos y en dólares y calcular tu retiro.",
    archivo: "/guias/ingenieros.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-ingenieros.pdf",
  },
  {
    slug: "rrhh",
    nombre: "RR.HH.",
    titulo: "Finanzas para profesionales de RR.HH.",
    resumen:
      "7 pasos para ordenar sueldo u honorarios, cobrar sin perder contra la inflación y hacer crecer tus ahorros, en relación de dependencia o por tu cuenta.",
    archivo: "/guias/rrhh.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-rrhh.pdf",
  },
  {
    slug: "psicologos",
    nombre: "Psicólogos",
    titulo: "Finanzas para psicólogos",
    resumen:
      "7 pasos para fijar y actualizar tus honorarios, ordenar los cobros de obras sociales y tener un sueldo propio todo el año.",
    archivo: "/guias/psicologos.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-psicologos.pdf",
  },
  {
    slug: "emprendedores",
    nombre: "Emprendedores",
    titulo: "Finanzas para emprendedores",
    resumen:
      "7 pasos para separar el negocio de lo personal, cuidar la caja, ajustar precios y hacer crecer los excedentes.",
    archivo: "/guias/emprendedores.pdf",
    archivoNombre: "Zeta-Finance-finanzas-para-emprendedores.pdf",
  },
];

export function getGuia(slug: string): Guia | undefined {
  return GUIAS.find((guia) => guia.slug === slug);
}
