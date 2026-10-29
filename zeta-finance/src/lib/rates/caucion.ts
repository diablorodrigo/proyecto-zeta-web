/**
 * Curva de caución colocadora en pesos → plazos 3 / 7 / 10 / 15 / 30.
 * Portado de Zeta-contadores `zeta-landing/caucion-buckets.js`.
 *
 * BYMA trae la TNA en decimal (0,212 = 21,2%). ArgentinaDatos ya viene en puntos.
 * Cada fila entra al plazo más cercano si está a lo sumo a 3 días.
 * Si dos filas caen en el mismo plazo, gana la más cercana y, en empate, la de más volumen.
 * El plazo sin fila viva conserva el respaldo.
 */

export const CAUCION_BUCKETS = [3, 7, 10, 15, 30] as const;
export const CAUCION_BUCKET_WINDOW_DAYS = 3;

export type CaucionBucket = (typeof CAUCION_BUCKETS)[number];

export type CaucionQuote = {
  days: number;
  tna: number;
  volume: number;
};

export type CaucionCurve = {
  caucionByDays: Record<number, number>;
  filledBuckets: number;
};

function finiteOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function tnaPointsFromBymaRow(row: {
  trade?: unknown;
  vwap?: unknown;
  bidPrice?: unknown;
  offerPrice?: unknown;
} | null): number | null {
  if (!row) return null;
  const trade = finiteOrNull(row.trade);
  const vwap = finiteOrNull(row.vwap);
  const bid = finiteOrNull(row.bidPrice);
  const offer = finiteOrNull(row.offerPrice);
  let decimal: number | null = null;
  if (trade != null && trade > 0) decimal = trade;
  else if (vwap != null && vwap > 0) decimal = vwap;
  else if (bid != null && bid > 0 && offer != null && offer > 0) {
    decimal = (bid + offer) / 2;
  }
  if (decimal == null) return null;
  const points = decimal * 100;
  if (points < 5 || points > 80) return null;
  return Math.round(points * 10) / 10;
}

export function tnaPointsFromArgentinaDatosRow(row: {
  tna?: unknown;
  tasaActual?: unknown;
  tasaPromedio?: unknown;
  ultimo?: unknown;
} | null): number | null {
  if (!row) return null;
  const raw = finiteOrNull(
    row.tna ?? row.tasaActual ?? row.tasaPromedio ?? row.ultimo,
  );
  if (raw == null || raw <= 10 || raw >= 120) return null;
  return Math.round(raw * 10) / 10;
}

export function nearestCaucionBucket(days: number): CaucionBucket | null {
  let best: CaucionBucket | null = null;
  let bestDelta = Infinity;
  for (const bucket of CAUCION_BUCKETS) {
    const delta = Math.abs(days - bucket);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = bucket;
    }
  }
  if (best == null || bestDelta > CAUCION_BUCKET_WINDOW_DAYS) return null;
  return best;
}

export function bucketCaucionQuotes(
  quotes: CaucionQuote[] | null | undefined,
  fallback: Record<number, number> | null | undefined,
): CaucionCurve {
  const out: Record<number, number> = {};
  const base = fallback ?? {};
  for (const key of CAUCION_BUCKETS) {
    const seed = finiteOrNull(base[key]);
    if (seed != null) out[key] = seed;
  }

  const bestByBucket: Record<
    number,
    { tna: number; delta: number; volume: number }
  > = {};

  for (const quote of quotes ?? []) {
    if (!quote || quote.tna == null || quote.days == null) continue;
    const bucket = nearestCaucionBucket(quote.days);
    if (bucket == null) continue;
    const delta = Math.abs(quote.days - bucket);
    const volume = finiteOrNull(quote.volume) || 0;
    const current = bestByBucket[bucket];
    if (
      !current ||
      delta < current.delta ||
      (delta === current.delta && volume > current.volume)
    ) {
      bestByBucket[bucket] = { tna: quote.tna, delta, volume };
    }
  }

  let filled = 0;
  for (const bucket of CAUCION_BUCKETS) {
    const winner = bestByBucket[bucket];
    if (!winner) continue;
    out[bucket] = winner.tna;
    filled += 1;
  }

  return { caucionByDays: out, filledBuckets: filled };
}

export function quotesFromBymaRows(rows: unknown): CaucionQuote[] {
  const quotes: CaucionQuote[] = [];
  if (!Array.isArray(rows)) return quotes;
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    if (record.denominationCcy !== "ARS") continue;
    const days = finiteOrNull(record.daysToMaturity);
    const tna = tnaPointsFromBymaRow(record);
    if (days == null || days <= 0 || tna == null) continue;
    quotes.push({
      days,
      tna,
      volume: finiteOrNull(record.tradeVolume) || 0,
    });
  }
  return quotes;
}

export function quotesFromArgentinaDatosRows(rows: unknown): CaucionQuote[] {
  const quotes: CaucionQuote[] = [];
  if (!Array.isArray(rows)) return quotes;
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const days = finiteOrNull(record.plazo ?? record.dias);
    const tna = tnaPointsFromArgentinaDatosRow(record);
    if (days == null || days <= 0 || tna == null) continue;
    quotes.push({
      days,
      tna,
      volume: finiteOrNull(record.montoContado) || 0,
    });
  }
  return quotes;
}
