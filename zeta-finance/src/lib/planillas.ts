import { whatsappLink } from "@/lib/constants";

/**
 * Links de pago de Mercado Pago.
 *
 * Los tres checkouts están en las constantes de abajo.
 * Si hace falta cambiarlos sin tocar el código, estas env vars pisan la constante:
 *
 *   NEXT_PUBLIC_MP_PLANILLA_PERSONALES
 *   NEXT_PUBLIC_MP_PLANILLA_INDEPENDIENTES
 *   NEXT_PUBLIC_MP_PLANILLA_COMBO
 *
 * Si una URL contiene "PLACEHOLDER", el botón Comprar abre WhatsApp
 * con el pedido escrito. Con los links reales, Comprar abre Mercado Pago.
 * El botón "Consultar por WhatsApp" no cambia.
 */
function paymentUrl(envValue: string | undefined, fallback: string) {
  const value = envValue?.trim();
  return value ? value : fallback;
}

export const MERCADO_PAGO_PLANILLA_PERSONALES = paymentUrl(
  process.env.NEXT_PUBLIC_MP_PLANILLA_PERSONALES,
  "https://mpago.la/1zwoFZM",
);

export const MERCADO_PAGO_PLANILLA_INDEPENDIENTES = paymentUrl(
  process.env.NEXT_PUBLIC_MP_PLANILLA_INDEPENDIENTES,
  "https://mpago.la/2S7jdGy",
);

export const MERCADO_PAGO_PLANILLA_COMBO = paymentUrl(
  process.env.NEXT_PUBLIC_MP_PLANILLA_COMBO,
  "https://mpago.la/1N62aNP",
);

export const PLANILLA_LEGAL =
  "Herramienta de organización personal. No constituye asesoramiento financiero personalizado ni recomendación de inversión.";

export const PLANILLA_GIFT =
  "De regalo: la guía PDF de finanzas para tu profesión (médicos, abogados, contadores, ingenieros o RR.HH.). Te llega por mail junto con la planilla. Si tu profesión no está en la lista, elegí la que más se parezca a tu forma de cobrar.";

export const PLANILLA_DELIVERY =
  "Pagás con Mercado Pago y te llega todo por mail: el Excel con el ejemplo, la versión en blanco, un link para tu copia en Google Sheets y la guía PDF de regalo.";

export const PLANILLA_MP_PROTECTION =
  "Pago seguro con Mercado Pago, con la protección al comprador.";

export type PlanillaPaymentId = "personales" | "independientes" | "combo";

const PAYMENT_URLS: Record<PlanillaPaymentId, string> = {
  personales: MERCADO_PAGO_PLANILLA_PERSONALES,
  independientes: MERCADO_PAGO_PLANILLA_INDEPENDIENTES,
  combo: MERCADO_PAGO_PLANILLA_COMBO,
};

const BUY_MESSAGES: Record<PlanillaPaymentId, string> = {
  personales:
    "Hola, quiero la planilla Finanzas personales en pesos y dólares",
  independientes:
    "Hola, quiero la planilla Ingresos para profesionales independientes",
  combo: "Hola, quiero el combo de las dos planillas",
};

const CONSULT_MESSAGES: Record<PlanillaPaymentId, string> = {
  personales:
    "Hola, quiero consultar por la planilla Finanzas personales en pesos y dólares",
  independientes:
    "Hola, quiero consultar por la planilla Ingresos para profesionales independientes",
  combo: "Hola, quiero consultar por el combo de las dos planillas",
};

export function isMercadoPagoReady(id: PlanillaPaymentId) {
  return !/placeholder/i.test(PAYMENT_URLS[id]);
}

export function planillaBuyHref(id: PlanillaPaymentId) {
  if (!isMercadoPagoReady(id)) return whatsappLink(BUY_MESSAGES[id]);
  return PAYMENT_URLS[id];
}

export function planillaConsultHref(id: PlanillaPaymentId) {
  return whatsappLink(CONSULT_MESSAGES[id]);
}

export const PLANILLA_PRODUCTS = [
  {
    id: "personales" as const,
    name: "Finanzas personales en pesos y dólares",
    priceLabel: "$ 6.900",
    priceAmount: 6900,
    subtitle:
      "Ordená tus ingresos y gastos en ARS y USD, mirá cuánto ahorrás de verdad y armá tu fondo de emergencia. Sin saber Excel.",
    image: "/planillas/preview-finanzas-personales-ars-usd.png",
    imageAlt:
      "Vista de ejemplo de la planilla Finanzas personales en pesos y dólares: resumen de septiembre, ahorro del 21% y ranking de gastos.",
    imageWidth: 1400,
    imageHeight: 680,
    benefits: [
      {
        title: "Pesos y dólares en un solo lugar.",
        text: "Cargás cada movimiento en la moneda que fue y la planilla te muestra el equivalente en las dos, con el dólar MEP de referencia que vos elegís.",
      },
      {
        title: "Sabés cuánto ahorrás cada mes.",
        text: "Ingresos, gastos fijos, gastos variables, ahorro y tasa de ahorro, mes por mes y del año, con colores que te avisan si vas bien.",
      },
      {
        title: "Ves en qué se te va la plata.",
        text: "Ranking de tus 10 categorías de gasto y gráfico de evolución mensual, que se actualizan solos.",
      },
      {
        title: "Tu fondo de emergencia, con número y fecha.",
        text: "Te calcula cuántos meses de gastos fijos tenés cubiertos, cuánto te falta y cuánto aportar por mes.",
      },
      {
        title: "Tu meta en dólares, a la vista.",
        text: "Objetivo, aportes, progreso, aporte mensual necesario y tu tipo de cambio promedio de compra.",
      },
    ],
    includes: [
      "Archivo Excel con datos de ejemplo y una versión en blanco, lista para usar.",
      "6 hojas: Inicio, Configuración, Movimientos, Resumen, Fondo de emergencia y Ahorro USD.",
      "25 categorías de ingresos y gastos, editables.",
      "Menús desplegables, validaciones y celdas de carga marcadas en color crema.",
      "Gráficos automáticos: evolución mensual y top 10 de gastos.",
      "Lugar para 600 movimientos y 200 aportes en dólares.",
    ],
    audience: [
      "Personas y familias que cobran en pesos, ahorran en dólares y quieren ordenar sus números sin pagar una app mensual.",
      "Quien nunca supo cuánto ahorra por mes y quiere empezar por ahí.",
      "Quien quiere armar un fondo de emergencia o juntar dólares para un objetivo (viaje, auto, vivienda).",
      "No hace falta saber Excel: se carga como un formulario.",
    ],
  },
  {
    id: "independientes" as const,
    name: "Ingresos para profesionales independientes",
    priceLabel: "$ 9.900",
    priceAmount: 9900,
    subtitle:
      "Para monotributistas y autónomos: controlá tus cobros, pagate un sueldo fijo, separá para impuestos y no te pases de tu categoría.",
    image: "/planillas/preview-ingresos-independientes.png",
    imageAlt:
      "Vista de ejemplo del dashboard de ingresos para profesionales independientes: cobrado, sueldo propio, monotributo y top 5 de clientes.",
    imageWidth: 1400,
    imageHeight: 748,
    benefits: [
      {
        title: "Nunca más un cobro olvidado.",
        text: "Ves cuánto te deben, desde hace cuántos días y a quién reclamar primero, con alertas en amarillo y rojo.",
      },
      {
        title: "Un sueldo propio aunque tus ingresos suban y bajen.",
        text: "Calcula cuánto te podés pagar por mes según tus últimos 12 meses y te muestra el colchón que se arma con los meses buenos.",
      },
      {
        title: "La plata de los impuestos, apartada desde el día uno.",
        text: "Definís qué porcentaje separar de cada cobro y ves cuánto deberías tener guardado contra lo que ya pagaste.",
      },
      {
        title: "Tu categoría de monotributo bajo control.",
        text: "Compara tu facturación de los últimos 12 meses con el tope que cargás vos y te avisa cuando te acercás.",
      },
      {
        title: "Honorarios que no pierden contra la inflación.",
        text: "Cargás la inflación del período y te sugiere tu tarifa actualizada y redondeada.",
      },
    ],
    includes: [
      "Archivo Excel con un ejemplo completo de 12 meses y una versión en blanco.",
      "10 hojas: Inicio, Dashboard, Configuración, Cobros, Gastos, Pendientes, Sueldo propio, Impuestos, Monotributo y Honorarios.",
      "Dashboard con indicadores, alertas, ingresos mensuales (generado y cobrado) y top 5 de clientes.",
      "Cobros en pesos o dólares, con estado cobrado o pendiente y días de demora automáticos.",
      "Menús desplegables, validaciones y celdas de carga marcadas en color crema.",
      "Lugar para 500 cobros, 300 gastos y 100 pagos de impuestos.",
    ],
    audience: [
      "Profesionales que facturan por su cuenta: médicos, psicólogos, odontólogos, kinesiólogos, abogados, contadores, arquitectos, consultores, diseñadores y programadores freelance.",
      "Monotributistas que quieren anticiparse a la recategorización y autónomos que necesitan ordenar su flujo de cobros.",
      "Quien tiene meses buenos y meses flojos y quiere dejar de vivir al día.",
      "No hace falta saber Excel.",
    ],
  },
] as const;

export const PLANILLA_COMBO = {
  id: "combo" as const,
  name: "Las dos planillas",
  priceLabel: "$ 14.900",
  priceAmount: 14900,
  savingsLabel: "$ 1.900",
  subtitle:
    "Finanzas personales en pesos y dólares, más ingresos para profesionales independientes. El combo es la opción natural si facturás por tu cuenta y también querés ordenar la plata de tu casa.",
};

export const PLANILLA_FAQ = [
  {
    q: "¿Cómo la recibo?",
    a: "Pagás con Mercado Pago y te llega todo por mail: el archivo Excel con el ejemplo, la versión en blanco, un link para hacerte tu copia en Google Sheets y la guía PDF de regalo. Es un pago único, sin suscripción. El pago es seguro con Mercado Pago y cuenta con la protección al comprador.",
  },
  {
    q: "¿Funciona en Google Sheets?",
    a: "Sí. Subí el archivo a Google Drive, abrilo con Hojas de cálculo de Google y elegí Archivo, Guardar como Hojas de cálculo de Google. También funciona en Excel (2010 o posterior) y en LibreOffice.",
  },
  {
    q: "¿Sirve en el celular?",
    a: "Sí, con la app gratuita de Google Sheets o con Excel para celular. Para anotar un gasto o un cobro en el momento anda muy bien. Para mirar el resumen, los gráficos o el dashboard es más cómodo en una compu o tablet.",
  },
  {
    q: "¿Qué es la guía de regalo?",
    a: "Una guía PDF de 6 páginas con pasos concretos para ordenar las finanzas según tu profesión: médicos, abogados, contadores, ingenieros o RR.HH. Te llega gratis por mail junto con la planilla. Si tu profesión no está en la lista, elegí la que más se parezca a tu forma de cobrar.",
  },
  {
    q: "¿Tengo que tocar fórmulas?",
    a: "No. Cargás datos solo en las celdas color crema y el resto se calcula solo.",
  },
  {
    q: "¿El tipo de cambio se actualiza solo?",
    a: "No, a propósito: lo cargás vos (por ejemplo, el MEP del día) para que la planilla de pesos y dólares funcione igual en cualquier programa y sin conexión. También podés cargar un tipo de cambio distinto para un movimiento puntual.",
  },
  {
    q: "¿Trae los topes y las alícuotas del monotributo?",
    a: "No, a propósito. Los topes los fija ARCA y se actualizan, y las alícuotas dependen de tu situación. En la planilla de ingresos cargás el tope vigente de tu categoría y el porcentaje que querés separar, idealmente definidos con tu contador. Así la planilla no queda desactualizada.",
  },
  {
    q: "¿Reemplaza a mi contador o a un sistema de facturación?",
    a: "No. No emite facturas ni presenta nada ante ARCA. Es una herramienta para que tengas tus números ordenados y llegues a tu contador con la información clara.",
  },
  {
    q: "¿Puedo romper las fórmulas sin querer?",
    a: "En Excel y LibreOffice no: las fórmulas vienen protegidas y solo se cargan las celdas color crema. En Google Sheets la protección de Excel no se mantiene al convertir el archivo, por eso la versión por link se entrega con avisos de protección. Si algo se rompe, volvés a descargar el original.",
  },
  {
    q: "¿Esto es asesoramiento financiero?",
    a: "No. Es una herramienta de organización personal. No constituye asesoramiento financiero personalizado ni recomendación de inversión.",
  },
  {
    q: "¿Y si tengo una duda?",
    a: "Cualquier duda, escribime. Si querés consultar antes de comprar, podés escribirme por WhatsApp. La planilla y la guía te llegan por mail después del pago.",
  },
] as const;
