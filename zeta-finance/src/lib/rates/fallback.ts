/**
 * Números de respaldo. Son los mismos de Zeta-contadores (config.js / rates.js)
 * cuando BYMA, Data912, ArgentinaDatos o la CNV no responden.
 * La fecha queda visible en la página con la etiqueta "respaldo".
 */

export const FCI_NOMBRE = "Balanz Capital Money Market - Clase A";

export const CAUCION_FALLBACK: Record<number, number> = {
  3: 20.5,
  7: 21.5,
  10: 22,
  15: 22.5,
  30: 23.5,
};

export const PLAZO_FIJO_FALLBACK_TNA = 19.5;

/** Cuotaparte 15/10/2026 → 22/10/2026. TNA 18,28%. */
export const FCI_FALLBACK = {
  tna: 18.28,
  fecha: "2026-10-22",
  fechaInicio: "2026-10-15",
  dias: 7,
  vcp: 12720.788,
  vcpInicio: 12676.343,
};

/** Tasa fija del fondo en dólares. No hay fuente viva en esta versión. */
export const USD_FONDO_TNA = 5;

export const CAUCION_DIAS_PAGINA = 7;
