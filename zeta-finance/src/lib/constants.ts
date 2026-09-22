export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/5493496462977";

export const WHATSAPP_DISPLAY = "+54 3496-462977";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hola@zetafinance.com";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/simulador", label: "Simulador" },
  { href: "/sobre-mi", label: "Sobre mí" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const SERVICE_LINES = [
  {
    id: "asesoria",
    title: "Asesoría financiera personal",
    description:
      "Ordenamos tus ingresos, gastos y deudas, y armamos un plan realista de ahorro con objetivos claros.",
    items: [
      "Diagnóstico completo de tu situación actual",
      "Plan de ahorro y fondo de emergencia",
      "Estrategia para reducir deudas",
      "Seguimiento mensual de objetivos",
    ],
  },
  {
    id: "inversiones",
    title: "Inversiones y patrimonio",
    description:
      "Diseñamos una cartera acorde a tu perfil de riesgo y horizonte, y la revisamos contigo con el tiempo.",
    items: [
      "Perfil de riesgo y horizonte de inversión",
      "Cartera diversificada y explicada paso a paso",
      "Revisión y rebalanceo periódico",
      "Planificación patrimonial a largo plazo",
    ],
  },
] as const;

export const WORK_STEPS = [
  {
    n: "01",
    title: "Primera consulta",
    description:
      "Una llamada gratuita para entender tu situación y tus objetivos.",
  },
  {
    n: "02",
    title: "Diagnóstico",
    description:
      "Analizo ingresos, gastos, deudas y ahorro, y te lo explico sin tecnicismos.",
  },
  {
    n: "03",
    title: "Plan a medida",
    description:
      "Recibes una estrategia escrita, con pasos concretos y plazos.",
  },
  {
    n: "04",
    title: "Seguimiento",
    description:
      "Revisiones periódicas para ajustar el plan a tu vida real.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "¿La primera consulta tiene coste?",
    a: "No. La primera conversación es gratuita y sin compromiso: revisamos tu situación, tus objetivos y te digo con honestidad si puedo ayudarte.",
  },
  {
    q: "¿Necesito tener mucho dinero para empezar?",
    a: "No. Se trabaja igual de bien con quien empieza a ordenar sus gastos que con quien ya tiene un patrimonio para invertir. Lo importante es tener un objetivo.",
  },
  {
    q: "¿Cómo son las sesiones?",
    a: "Por videollamada o presenciales si estás cerca. Cada sesión termina con acciones concretas y un plan escrito para que sepas exactamente qué hacer.",
  },
  {
    q: "¿Gestionas mi dinero directamente?",
    a: "No. Tú mantienes el control de tus cuentas en todo momento. Mi trabajo es asesorarte, explicarte cada decisión y acompañarte en su seguimiento.",
  },
] as const;

export const RISK_PROFILES = [
  {
    id: "conservador" as const,
    nombre: "Conservador",
    descripcion:
      "Priorizás cuidar el capital. Volatilidad baja y foco en renta fija.",
    rendimiento: "8,2%",
    volatilidad: "5,4%",
  },
  {
    id: "moderado" as const,
    nombre: "Moderado",
    descripcion:
      "Equilibrio entre crecimiento y estabilidad. Mix de renta fija y acciones.",
    rendimiento: "13,6%",
    volatilidad: "11,8%",
  },
  {
    id: "agresivo" as const,
    nombre: "Agresivo",
    descripcion:
      "Máxima exposición a renta variable. Aceptás caídas por mayor retorno.",
    rendimiento: "19,4%",
    volatilidad: "18,2%",
  },
];

export type RiskProfileId = (typeof RISK_PROFILES)[number]["id"];

export const INSTRUMENTS = [
  { id: "acciones_ar", nombre: "Acciones Argentinas", sigla: "A" },
  { id: "cedears", nombre: "CE.DE.AR", sigla: "CE" },
  { id: "bonos_usd", nombre: "Bonos soberanos en dólares", sigla: "BD" },
  { id: "tbills", nombre: "Bonos EEUU", sigla: "BE" },
  { id: "acciones_eu", nombre: "Acciones Europeas", sigla: "EU" },
  { id: "plazo_fijo", nombre: "Plazo fijo", sigla: "PF" },
  { id: "renta_fija_ars", nombre: "Renta fija en pesos", sigla: "RF" },
] as const;

export type InstrumentId = (typeof INSTRUMENTS)[number]["id"];

export const TARGET_ALLOCATIONS: Record<
  RiskProfileId,
  Record<InstrumentId, number>
> = {
  conservador: {
    acciones_ar: 5,
    cedears: 5,
    bonos_usd: 20,
    tbills: 25,
    acciones_eu: 5,
    plazo_fijo: 20,
    renta_fija_ars: 20,
  },
  moderado: {
    acciones_ar: 15,
    cedears: 20,
    bonos_usd: 20,
    tbills: 10,
    acciones_eu: 10,
    plazo_fijo: 10,
    renta_fija_ars: 15,
  },
  agresivo: {
    acciones_ar: 30,
    cedears: 30,
    bonos_usd: 15,
    tbills: 0,
    acciones_eu: 15,
    plazo_fijo: 5,
    renta_fija_ars: 5,
  },
};

export function emptyAllocation(): Record<InstrumentId, number> {
  return Object.fromEntries(
    INSTRUMENTS.map((i) => [i.id, 0]),
  ) as Record<InstrumentId, number>;
}

export function scoreAllocation(
  profileId: RiskProfileId,
  allocation: Record<InstrumentId, number>,
) {
  const target = TARGET_ALLOCATIONS[profileId];
  const totalDiff = INSTRUMENTS.reduce(
    (acc, inst) =>
      acc + Math.abs((allocation[inst.id] ?? 0) - (target[inst.id] ?? 0)),
    0,
  );
  const puntaje = Math.max(0, Math.round(100 - totalDiff / 2));
  const diversificacion = Math.round(
    (INSTRUMENTS.filter((i) => (allocation[i.id] ?? 0) > 0).length /
      INSTRUMENTS.length) *
      100,
  );
  const desvios = INSTRUMENTS.map((activo) => ({
    activo,
    diferencia: (allocation[activo.id] ?? 0) - (target[activo.id] ?? 0),
  }))
    .sort((a, b) => Math.abs(b.diferencia) - Math.abs(a.diferencia))
    .slice(0, 3);

  const profileName =
    RISK_PROFILES.find((p) => p.id === profileId)?.nombre.toLowerCase() ??
    profileId;

  let etiqueta = "Podés afinar la puntería";
  let titulo = "Tu cartera se aleja del perfil elegido";
  let detalle = `Hay desvíos relevantes respecto de la cartera de referencia para un perfil ${profileName}.`;

  if (puntaje >= 85) {
    etiqueta = "Muy asertivo";
    titulo = `Cartera de perfil ${profileName} muy bien calibrada`;
    detalle = `Tu distribución coincide casi punto por punto con la cartera de referencia para un perfil ${profileName}.`;
  } else if (puntaje >= 70) {
    etiqueta = "Bien encaminado";
    titulo = `Cartera de perfil ${profileName} con buen equilibrio`;
    detalle = `Estás cerca del mix ideal. Con pequeños ajustes queda todavía más alineada.`;
  } else if (puntaje >= 50) {
    etiqueta = "Ajustable";
    titulo = `Cartera de perfil ${profileName} con desvíos importantes`;
    detalle = `Hay espacio para rebalancear y acercarte al perfil ${profileName} sin perder tu intención de inversión.`;
  }

  return { puntaje, etiqueta, titulo, detalle, diversificacion, desvios };
}
