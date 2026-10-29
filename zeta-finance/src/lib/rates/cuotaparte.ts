/**
 * TNA simple de un fondo a partir de la cuotaparte.
 * Portado de Zeta-contadores `broker-costs.js` (`tnaFromCuotapartes`).
 *
 * TNA = (vcpFin / vcpInicio − 1) × 365 / días × 100.
 * La ventana pedida es de 7 días corridos. Se acepta el último punto
 * en o antes de esa fecha si el hueco queda entre 5 y 10 días.
 * Los honorarios del fondo ya están en la cuotaparte: no se restan aparte.
 */

export type CuotaparteRow = {
  fecha?: unknown;
  valorCuotaparte?: unknown;
  vcp?: unknown;
};

export type CuotaparteQuote = {
  tna: number;
  vcp: number;
  vcpInicio: number;
  fecha: string;
  fechaInicio: string;
  dias: number;
};

function parseIsoUtc(iso: unknown): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso ?? ""));
  if (!match) return null;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function tnaFromCuotapartes(
  rows: CuotaparteRow[] | null | undefined,
  windowDays?: number,
): CuotaparteQuote | null {
  let window = Number(windowDays);
  if (!Number.isFinite(window) || window < 1) window = 7;

  const series: { fecha: string; utc: number; vcp: number }[] = [];
  for (const row of rows ?? []) {
    if (!row) continue;
    const vcp = Number(
      row.valorCuotaparte != null ? row.valorCuotaparte : row.vcp,
    );
    const utc = parseIsoUtc(row.fecha);
    if (!utc || !(vcp > 0)) continue;
    series.push({ fecha: String(row.fecha).slice(0, 10), utc, vcp });
  }

  series.sort((a, b) => a.utc - b.utc);
  if (series.length < 2) return null;

  const end = series[series.length - 1]!;
  const target = end.utc - window * 86400000;
  let start: (typeof series)[number] | null = null;
  for (const row of series) {
    if (row.utc <= target) start = row;
  }
  if (!start || start.utc >= end.utc) return null;

  const days = Math.round((end.utc - start.utc) / 86400000);
  if (days < 5 || days > 10) return null;

  const tna = (end.vcp / start.vcp - 1) * (365 / days) * 100;
  if (!(tna > 0 && tna < 80)) return null;

  return {
    tna: Math.round(tna * 100) / 100,
    vcp: end.vcp,
    vcpInicio: start.vcp,
    fecha: end.fecha,
    fechaInicio: start.fecha,
    dias: days,
  };
}
