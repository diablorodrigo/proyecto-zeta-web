/**
 * Supuestos que no salen de una cotización.
 * La inflación es la mediana del REM BCRA (relevamiento de septiembre 2026,
 * publicado el 6 de octubre de 2026). Está marcada "a confirmar": se actualiza
 * a mano cuando sale el REM siguiente. El fondo en dólares es una tasa fija.
 */

export const PORCENTAJE_QUIETO_DEFAULT = 0.3;

export const HORIZONTES = [1, 3, 6, 12] as const;
export type HorizonteMeses = (typeof HORIZONTES)[number];
export const HORIZONTE_DEFAULT: HorizonteMeses = 3;

export type MesInflacion = {
  etiqueta: string;
  /** Tasa mensual en decimal. 0,017 = 1,7%. */
  tasa: number;
};

export const INFLACION_REM = {
  fuente: "REM BCRA, mediana del IPC nivel general",
  fecha: "2026-10-06",
  relevamiento: "28 al 30 de septiembre de 2026",
  aConfirmar: true,
  meses: [
    { etiqueta: "oct 2026", tasa: 0.017 },
    { etiqueta: "nov 2026", tasa: 0.016 },
    { etiqueta: "dic 2026", tasa: 0.018 },
    { etiqueta: "ene 2027", tasa: 0.016 },
    { etiqueta: "feb 2027", tasa: 0.016 },
    { etiqueta: "mar 2027", tasa: 0.017 },
  ] satisfies MesInflacion[],
};

export const DISCLAIMER =
  "Esta simulación es informativa y educativa. No es una recomendación de inversión ni una oferta, ni una promesa de rentabilidad. Usa criterios cuantitativos y datos públicos (BCRA, BYMA, Data912, ArgentinaDatos, CNV) con la fecha indicada; las tasas cambian y los rendimientos pasados o esperados no garantizan resultados. Hacé tu propio análisis o consultá con un asesor. Cristian Bernaldez, Zeta Finance, asesor financiero matriculado por la CNV, matrícula N° 2103.";

export const AVISO_SIMPLE =
  "Es una guía para mirar el contexto con tus números. No es una promesa de lo que vas a ganar ni de lo que vas a perder.";

export const AVISO_SIN_COSTOS =
  "Estos números no restan impuestos ni comisiones. En el money market, los honorarios del fondo ya están dentro de la cuotaparte que usamos para la tasa: no los volvemos a descontar.";

export const JERGA = {
  TNA: "Tasa nominal anual: el interés pactado por un año, sin tener en cuenta cada cuánto se suma al capital.",
  TEA: "Tasa efectiva anual: lo que rendiría en un año si el interés se vuelve a invertir. En una letra con un solo pago, es lo mismo que la TIR.",
  TIR: "Tasa interna de retorno. En estas letras hay un solo pago al vencimiento, así que coincide con la TEA.",
  LECAP:
    "Letra del Tesoro en pesos. Capitaliza una tasa y paga todo junto cuando vence. Acá la dejamos hasta esa fecha: no simulamos venderla antes.",
  caución:
    "Préstamo muy corto entre inversores, con títulos como garantía. Mostramos la tasa de quien presta la plata (la colocadora), a 7 días, como si la renovaras.",
  "money market":
    "Fondo común de inversión de muy corto plazo. El que usamos se puede pedir de vuelta en el día (rescate inmediato).",
  "poder adquisitivo":
    "Cuántas cosas podés comprar con esa plata después de la inflación. Si los precios suben y la plata no, el poder adquisitivo baja.",
  inflación:
    "Suba de precios. Usamos lo que esperan los analistas en el REM del BCRA, no el dato ya publicado por el INDEC.",
} as const;
