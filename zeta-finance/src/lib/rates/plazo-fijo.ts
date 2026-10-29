/**
 * Plazo fijo promedio (BCRA, depósitos a 30 días) vía ArgentinaDatos,
 * y tramos de Banco Macro. Portado de `api/rates.js` y `macro-vs-letra.js`.
 *
 * Esta página no resta comisiones ni impuestos: el interés del plazo fijo
 * es el bruto. `calcPlazoFijoSimple` es el interés de un solo plazo.
 */

export type PlazoFijoQuote = {
  tna: number;
  fecha: string | null;
};

export type MacroBand = {
  montoMin: number | null;
  montoMax: number | null;
  plazoMin: number;
  plazoMax: number | null;
  tna: number;
};

export function plazoFijoFromDepositos(rows: unknown): PlazoFijoQuote | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const latest = rows[rows.length - 1];
  if (!latest || typeof latest !== "object") return null;
  const record = latest as Record<string, unknown>;
  const raw = record.valor ?? record.tna;
  const tnaPf = typeof raw === "number" ? raw : Number.parseFloat(String(raw ?? ""));
  if (!Number.isFinite(tnaPf) || tnaPf <= 15 || tnaPf >= 90) return null;
  const fecha =
    typeof record.fecha === "string" ? record.fecha.slice(0, 10) : null;
  return { tna: Number.parseFloat(tnaPf.toFixed(1)), fecha };
}

export function calcPlazoFijoSimple(monto: number, dias: number, tna: number) {
  const montoOk = Number.isFinite(monto) && monto >= 0;
  const diasOk = Number.isFinite(dias) && dias > 0;
  const tnaOk = Number.isFinite(tna);
  if (!montoOk || !diasOk || !tnaOk) {
    return {
      monto: montoOk ? monto : 0,
      dias: diasOk ? dias : 0,
      tna: tnaOk ? tna : 0,
      interes: null as number | null,
      total: null as number | null,
    };
  }
  const interes = monto * (tna / 100) * (dias / 365);
  return { monto, dias, tna, interes, total: monto + interes };
}

export function pickMacroBand(
  bands: MacroBand[] | null | undefined,
  monto: number,
  dias: number,
): MacroBand | null {
  if (!Number.isFinite(monto) || !Number.isFinite(dias)) return null;
  let match: MacroBand | null = null;
  for (const band of bands ?? []) {
    if (!band) continue;
    if (!Number.isFinite(band.tna) || !Number.isFinite(band.plazoMin)) continue;
    if (dias < band.plazoMin) continue;
    if (band.plazoMax != null && dias > band.plazoMax) continue;
    if (band.montoMin != null && monto < band.montoMin) continue;
    if (band.montoMax != null && monto > band.montoMax) continue;
    if (!match || (band.montoMin || 0) > (match.montoMin || 0)) match = band;
  }
  return match;
}

export function macroBandsFromArgentinaDatos(entities: unknown): MacroBand[] | null {
  const list = Array.isArray(entities) ? entities : [];
  let macro: Record<string, unknown> | null = null;
  for (const entity of list) {
    if (!entity || typeof entity !== "object") continue;
    const record = entity as Record<string, unknown>;
    if (/MACRO/i.test(String(record.entidad ?? ""))) {
      macro = record;
      break;
    }
  }
  if (!macro || !Array.isArray(macro.tasas)) return null;

  const bands: MacroBand[] = [];
  for (const tasa of macro.tasas) {
    if (!tasa || typeof tasa !== "object") continue;
    const row = tasa as Record<string, unknown>;
    const raw = Number(row.tna);
    if (!Number.isFinite(raw) || raw <= 0) continue;
    const points = raw <= 1.5 ? raw * 100 : raw;
    const plazoMin = Number(row.plazoMinDias);
    if (!Number.isFinite(plazoMin)) continue;
    bands.push({
      montoMin: row.montoMinimo == null ? null : Number(row.montoMinimo),
      montoMax: row.montoMaximo == null ? null : Number(row.montoMaximo),
      plazoMin,
      plazoMax: row.plazoMaxDias == null ? null : Number(row.plazoMaxDias),
      tna: Math.round(points * 10) / 10,
    });
  }
  return bands.length ? bands : null;
}
