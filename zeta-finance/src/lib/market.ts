export type PricePoint = {
  date: string; // YYYY-MM-DD
  close: number;
};

export type QuoteResult = {
  ticker: string;
  currency?: string;
  purchasePrice: number | null;
  purchaseDateUsed: string | null;
  currentPrice: number | null;
  currentDate: string | null;
  series: PricePoint[];
};

type CacheEntry<T> = { expiresAt: number; value: T };

const memoryCache = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  memoryCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function unixSeconds(d: Date): number {
  return Math.floor(d.getTime() / 1000);
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseYahooChart(json: unknown): PricePoint[] {
  const result = (json as {
    chart?: {
      result?: Array<{
        timestamp?: number[];
        indicators?: { quote?: Array<{ close?: Array<number | null> }> };
      }>;
    };
  }).chart?.result?.[0];

  if (!result?.timestamp?.length) return [];

  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const points: PricePoint[] = [];

  for (let i = 0; i < result.timestamp.length; i++) {
    const close = closes[i];
    if (close == null || !Number.isFinite(close)) continue;
    const date = formatDate(new Date(result.timestamp[i]! * 1000));
    points.push({ date, close: Number(close) });
  }

  return points;
}

async function fetchYahooSeries(
  symbol: string,
  period1: number,
  period2: number,
  interval: "1d" | "1wk" = "1d",
): Promise<PricePoint[]> {
  const url = new URL(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`,
  );
  url.searchParams.set("period1", String(period1));
  url.searchParams.set("period2", String(period2));
  url.searchParams.set("interval", interval);
  url.searchParams.set("events", "history");
  url.searchParams.set("includeAdjustedClose", "true");

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ZetaFinance/1.0)",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Yahoo chart failed (${res.status}) for ${symbol}`);
  }

  const json = await res.json();
  const error = (json as { chart?: { error?: { description?: string } } }).chart
    ?.error;
  if (error) {
    throw new Error(error.description ?? `Invalid ticker: ${symbol}`);
  }

  return parseYahooChart(json);
}

async function fetchStooqSeries(symbol: string): Promise<PricePoint[]> {
  // Stooq uses lowercase tickers; S&P 500 is ^spx
  const stooqSymbol = symbol === "^GSPC" ? "^spx" : symbol.toLowerCase();
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol)}&i=d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ZetaFinance/1.0)" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Stooq failed (${res.status})`);
  const text = await res.text();
  const lines = text.trim().split("\n");
  if (lines.length < 2 || !lines[0]?.toLowerCase().includes("date")) {
    throw new Error(`No Stooq data for ${symbol}`);
  }

  const points: PricePoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]!.split(",");
    const date = cols[0];
    const close = Number(cols[4]);
    if (!date || !Number.isFinite(close)) continue;
    points.push({ date, close });
  }
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchPriceSeries(
  symbol: string,
  from: Date,
  to: Date = new Date(),
  interval: "1d" | "1wk" = "1d",
): Promise<PricePoint[]> {
  try {
    const series = await fetchYahooSeries(
      symbol,
      unixSeconds(from),
      unixSeconds(to),
      interval,
    );
    if (series.length > 0) return series;
  } catch {
    // fall through to Stooq
  }

  const stooq = await fetchStooqSeries(symbol);
  const fromStr = formatDate(from);
  return stooq.filter((p) => p.date >= fromStr);
}

export async function fetchSp500FiveYears(): Promise<PricePoint[]> {
  const cacheKey = "sp500-5y";
  const cached = getCached<PricePoint[]>(cacheKey);
  if (cached) return cached;

  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 5);

  // Weekly points keep payload smaller for charts
  const series = await fetchPriceSeries("^GSPC", from, to, "1wk");
  if (series.length === 0) {
    throw new Error("No se pudieron obtener datos del S&P 500");
  }

  setCached(cacheKey, series, 15 * 60 * 1000);
  return series;
}

function nearestOnOrBefore(
  series: PricePoint[],
  targetDate: string,
): PricePoint | null {
  let best: PricePoint | null = null;
  for (const p of series) {
    if (p.date <= targetDate) best = p;
    else break;
  }
  // If purchase date is before first available bar, use first
  if (!best && series.length) return series[0]!;
  return best;
}

export async function fetchQuoteForEvaluation(
  ticker: string,
  fromDate: string,
): Promise<QuoteResult> {
  const normalized = ticker.trim().toUpperCase();
  if (!/^[A-Z0-9.\-^]{1,12}$/.test(normalized)) {
    throw new Error(`Ticker inválido: ${ticker}`);
  }

  const cacheKey = `quote:${normalized}:${fromDate}`;
  const cached = getCached<QuoteResult>(cacheKey);
  if (cached) return cached;

  const from = new Date(`${fromDate}T00:00:00Z`);
  if (Number.isNaN(from.getTime())) {
    throw new Error("Fecha de compra inválida");
  }

  // Start a bit earlier to find nearest trading day
  const padded = new Date(from);
  padded.setUTCDate(padded.getUTCDate() - 10);

  let series: PricePoint[];
  try {
    series = await fetchPriceSeries(normalized, padded, new Date(), "1d");
  } catch (err) {
    throw new Error(
      `No hay datos de mercado para ${normalized}` +
        (err instanceof Error ? ` (${err.message})` : ""),
    );
  }

  if (series.length === 0) {
    throw new Error(`No hay datos de mercado para ${normalized}`);
  }

  const purchase = nearestOnOrBefore(series, fromDate);
  const current = series[series.length - 1]!;

  const result: QuoteResult = {
    ticker: normalized,
    purchasePrice: purchase?.close ?? null,
    purchaseDateUsed: purchase?.date ?? null,
    currentPrice: current.close,
    currentDate: current.date,
    series,
  };

  setCached(cacheKey, result, 10 * 60 * 1000);
  return result;
}

export async function fetchSp500BenchmarkAround(
  fromDate: string,
): Promise<{ purchase: PricePoint; current: PricePoint }> {
  const cacheKey = `sp500-bench:${fromDate}`;
  const cached = getCached<{ purchase: PricePoint; current: PricePoint }>(
    cacheKey,
  );
  if (cached) return cached;

  const from = new Date(`${fromDate}T00:00:00Z`);
  const padded = new Date(from);
  padded.setUTCDate(padded.getUTCDate() - 10);

  const series = await fetchPriceSeries("^GSPC", padded, new Date(), "1d");
  if (series.length === 0) {
    throw new Error("No hay datos del S&P 500 para el benchmark");
  }

  const purchase = nearestOnOrBefore(series, fromDate);
  const current = series[series.length - 1]!;
  if (!purchase) throw new Error("Sin precio S&P 500 en la fecha de compra");

  const value = { purchase, current };
  setCached(cacheKey, value, 10 * 60 * 1000);
  return value;
}
