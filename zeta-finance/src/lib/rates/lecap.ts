/**
 * LECAP en pesos: precio de mercado → TNA / TEA / TIR.
 * Portado de Zeta-contadores `zeta-landing/lecap-yields.js`.
 *
 * La letra capitaliza una TEM contractual (base 30/360) y paga un solo flujo
 * al vencimiento. En esta página se proyecta hasta ese vencimiento, sin costo
 * de salida: la TEA y la TIR salen del precio y del payoff, y coinciden.
 *
 *   TNA = (payoff / precio − 1) × 365 / días × 100
 *   TEA = TIR = ((payoff / precio) ^ (365 / días) − 1) × 100
 *
 * Los días de la tasa corren desde la liquidación de 24 hs hasta el vencimiento.
 */

export const LECAP_TICKER = /^S\d{2}[A-Z]\d$/;

const BYMA_CLOSED: Record<string, 1> = {
  "2026-01-01": 1,
  "2026-02-16": 1,
  "2026-02-17": 1,
  "2026-03-24": 1,
  "2026-04-02": 1,
  "2026-04-03": 1,
  "2026-05-01": 1,
  "2026-05-25": 1,
  "2026-06-15": 1,
  "2026-07-09": 1,
  "2026-08-17": 1,
  "2026-10-12": 1,
  "2026-11-09": 1,
  "2026-11-10": 1,
  "2026-11-23": 1,
  "2026-12-08": 1,
  "2026-12-25": 1,
  "2026-12-31": 1,
  "2027-01-01": 1,
};

const BYMA_NO_SETTLEMENT: Record<string, 1> = {
  "2026-03-23": 1,
  "2026-07-10": 1,
  "2026-11-06": 1,
  "2026-12-07": 1,
  "2026-12-24": 1,
};

export const LECAP_VERIFIED_TERMS: Record<
  string,
  { issue: string; maturity: string; temPct: number }
> = {
  S30O6: { issue: "2025-10-31", maturity: "2026-10-30", temPct: 2.55 },
  S13N6: { issue: "2026-06-30", maturity: "2026-11-13", temPct: 2.1 },
  S30N6: { issue: "2025-12-15", maturity: "2026-11-30", temPct: 2.3 },
  S29E7: { issue: "2026-08-31", maturity: "2027-01-29", temPct: 2.25 },
};

export const LECAP_SOURCE_LABEL: Record<string, string> = {
  data912: "Data912",
  byma: "BYMA",
  config: "config",
};

export type LecapFallback = {
  ticker: string;
  tna: number;
  tea: number;
  tir: number;
  dias: number;
  maturity: string;
  vencimiento: string;
  precio: number;
  payoffPor100: number;
  temPct: number;
  fuente: string;
};

/** Cierre del 23/10/2026. Misma foto que el respaldo de Zeta-contadores. */
export const LECAP_CONFIG_FALLBACK: LecapFallback[] = [
  {
    ticker: "S30O6",
    tna: 19.55,
    tea: 21.57,
    tir: 21.57,
    dias: 4,
    maturity: "2026-10-30",
    vencimiento: "30/10/2026",
    precio: 134.989,
    payoffPor100: 135.28,
    temPct: 2.55,
    fuente: "config",
  },
  {
    ticker: "S13N6",
    tna: 22.75,
    tea: 25.38,
    tir: 25.38,
    dias: 18,
    maturity: "2026-11-13",
    vencimiento: "13/11/2026",
    precio: 108.435,
    payoffPor100: 109.65,
    temPct: 2.1,
    fuente: "config",
  },
  {
    ticker: "S30N6",
    tna: 22.96,
    tea: 25.5,
    tir: 25.5,
    dias: 35,
    maturity: "2026-11-30",
    vencimiento: "30/11/2026",
    precio: 127.09,
    payoffPor100: 129.89,
    temPct: 2.3,
    fuente: "config",
  },
  {
    ticker: "S29E7",
    tna: 24.73,
    tea: 27.08,
    tir: 27.08,
    dias: 95,
    maturity: "2027-01-29",
    vencimiento: "29/01/2027",
    precio: 104.932,
    payoffPor100: 111.68,
    temPct: 2.25,
    fuente: "config",
  },
];

export const LECAP_MAX_GAP_DAYS = 15;

export const LECAP_FALLBACK_AS_OF = "2026-10-23";

export type LecapTerms = {
  ticker: string;
  temPct: number;
  temSource: string;
  issue: string;
  maturity: string;
  payoffExact: number;
  payoffPor100: number;
};

export type LecapPrice = {
  ticker: string;
  price: number;
  volume: number;
  source: "data912" | "byma";
};

export type LecapLetter = {
  ticker: string;
  precio: number;
  volumen?: number;
  fuente: string;
  temPct?: number;
  temSource?: string;
  emision?: string;
  maturity: string;
  vencimiento: string;
  payoffPor100?: number;
  settlement?: string;
  dias: number;
  diasHoy: number;
  tna: number;
  tea: number;
  tir: number;
};

export type LecapCurve = {
  letters: LecapLetter[];
  reference: LecapLetter;
  source: string;
  sourceLabel: string;
  marketOpen: boolean;
  tradeDate: string;
  settlement: string;
};

export type QuoteCalendar = {
  artDate: string;
  tradeDate: string;
  settlement: string;
  marketOpen: boolean;
};

type MenuLetter = LecapLetter & { diasHoy: number };

function lecapFinite(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function lecapRound(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function isLecapTicker(symbol: unknown): boolean {
  return LECAP_TICKER.test(String(symbol || "").toUpperCase());
}

export function shiftIsoDate(iso: string, days: number): string | null {
  const ms = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(ms)) return null;
  return new Date(ms + days * 86400000).toISOString().slice(0, 10);
}

function isoWeekday(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getUTCDay();
}

function isBymaSessionDay(iso: string): boolean {
  const day = isoWeekday(iso);
  if (day === 0 || day === 6) return false;
  return !BYMA_CLOSED[iso];
}

function isBymaSettlementDay(iso: string): boolean {
  return isBymaSessionDay(iso) && !BYMA_NO_SETTLEMENT[iso];
}

function previousSessionDay(iso: string): string {
  let cursor = iso;
  for (let i = 0; i < 14; i++) {
    if (isBymaSessionDay(cursor)) return cursor;
    const next = shiftIsoDate(cursor, -1);
    if (!next) return iso;
    cursor = next;
  }
  return iso;
}

function nextSettlementDay(tradeIso: string): string {
  let cursor = shiftIsoDate(tradeIso, 1) ?? tradeIso;
  for (let i = 0; i < 16; i++) {
    if (isBymaSettlementDay(cursor)) return cursor;
    const next = shiftIsoDate(cursor, 1);
    if (!next) return cursor;
    cursor = next;
  }
  return cursor;
}

function artParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  let hour = Number(bag.hour);
  if (hour === 24) hour = 0;
  return {
    iso: `${bag.year}-${bag.month}-${bag.day}`,
    minutes: hour * 60 + Number(bag.minute),
  };
}

export function quoteCalendar(now: Date | string | number): QuoteCalendar {
  const date = now instanceof Date ? now : new Date(now);
  const art = artParts(date);
  let trade = previousSessionDay(art.iso);
  const beforeOpen = art.minutes < 10 * 60 + 30;
  if (art.iso === trade && beforeOpen) {
    trade = previousSessionDay(shiftIsoDate(art.iso, -1) ?? art.iso);
  }
  const open =
    isBymaSessionDay(art.iso) && !beforeOpen && art.minutes < 17 * 60;
  return {
    artDate: art.iso,
    tradeDate: trade,
    settlement: nextSettlementDay(trade),
    marketOpen: open,
  };
}

export function daysBetweenIso(fromIso: string, toIso: string): number | null {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return Math.round((to - from) / 86400000);
}

function parseBymaTimestamp(value: unknown): string | null {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(String(value || ""));
  return match ? match[1]! : null;
}

export function parseTemPct(text: unknown): number | null {
  const match = /(\d{1,2}[,.]\d{1,3})\s*%/.exec(String(text || ""));
  if (!match) return null;
  const tem = Number(match[1]!.replace(",", "."));
  if (!Number.isFinite(tem) || tem <= 0 || tem > 15) return null;
  return tem;
}

export function days30360(issueIso: string, maturityIso: string): number | null {
  const issue = /^(\d{4})-(\d{2})-(\d{2})$/.exec(issueIso || "");
  const maturity = /^(\d{4})-(\d{2})-(\d{2})$/.exec(maturityIso || "");
  if (!issue || !maturity) return null;
  const d1 = Math.min(Number(issue[3]), 30);
  const d2 = Math.min(Number(maturity[3]), 30);
  return (
    (Number(maturity[1]) - Number(issue[1])) * 360 +
    (Number(maturity[2]) - Number(issue[2])) * 30 +
    (d2 - d1)
  );
}

export function payoffExactFromTem(
  temPct: number,
  issueIso: string,
  maturityIso: string,
): number | null {
  const days = days30360(issueIso, maturityIso);
  const tem = Number(temPct);
  if (days == null || days <= 0 || !Number.isFinite(tem) || tem <= 0) return null;
  return 100 * (1 + tem / 100) ** (days / 30);
}

export function formatVencimiento(iso: string | null | undefined): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!match) return iso || "";
  return `${match[3]}/${match[2]}/${match[1]}`;
}

function fichaIsDiscountOrCer(row: Record<string, unknown> | null): boolean {
  const text = `${String(row?.interes || "")} ${String(row?.denominacion || "")}`;
  if (/capitalizable/i.test(text)) return false;
  return /CER|descuento/i.test(text);
}

export function resolveLecapTerms(
  ticker: string,
  fichaRow: Record<string, unknown> | null | undefined,
): LecapTerms | null {
  const symbol = String(ticker || "").toUpperCase();
  if (!isLecapTicker(symbol)) return null;
  const catalog = LECAP_VERIFIED_TERMS[symbol] ?? null;
  const ficha = fichaRow ?? null;
  if (ficha && fichaIsDiscountOrCer(ficha) && !catalog) return null;

  let tem = parseTemPct(ficha?.interes);
  let temSource: string | null = tem != null ? "byma_ficha" : null;
  if (tem == null && catalog) {
    tem = catalog.temPct;
    temSource = "tem_verificada";
  }
  const issue =
    parseBymaTimestamp(ficha?.fechaEmision) || catalog?.issue || null;
  const maturity =
    parseBymaTimestamp(ficha?.fechaVencimiento) || catalog?.maturity || null;
  if (tem == null || !issue || !maturity || !temSource) return null;

  const exact = payoffExactFromTem(tem, issue, maturity);
  if (exact == null) return null;
  return {
    ticker: symbol,
    temPct: tem,
    temSource,
    issue,
    maturity,
    payoffExact: exact,
    payoffPor100: lecapRound(exact, 2),
  };
}

function usableLecapPrice(value: unknown): number | null {
  const price = lecapFinite(value);
  if (price == null || price < 80 || price > 400) return null;
  return price;
}

export function priceFromData912Row(row: Record<string, unknown> | null): LecapPrice | null {
  if (!row || !isLecapTicker(row.symbol)) return null;
  let last = usableLecapPrice(row.c);
  if (last == null) {
    const bid = lecapFinite(row.px_bid);
    const ask = lecapFinite(row.px_ask);
    if (bid != null && ask != null && bid > 0 && ask > 0) {
      last = usableLecapPrice((bid + ask) / 2);
    }
  }
  if (last == null) return null;
  return {
    ticker: String(row.symbol).toUpperCase(),
    price: last,
    volume: lecapFinite(row.v) || 0,
    source: "data912",
  };
}

export function priceFromBymaLebacRow(row: Record<string, unknown> | null): LecapPrice | null {
  if (!row || String(row.settlementType) !== "2") return null;
  if (row.denominationCcy && row.denominationCcy !== "ARS") return null;
  if (!isLecapTicker(row.symbol)) return null;
  const trade = lecapFinite(row.trade);
  const vwap = lecapFinite(row.vwap);
  const bid = lecapFinite(row.bidPrice);
  const offer = lecapFinite(row.offerPrice);
  const close = lecapFinite(row.closingPrice);
  const previous = lecapFinite(row.previousClosingPrice);
  let raw: number | null = null;
  if (trade != null && trade > 0) raw = trade;
  else if (vwap != null && vwap > 0) raw = vwap;
  else if (bid != null && bid > 0 && offer != null && offer > 0) raw = (bid + offer) / 2;
  else if (close != null && close > 0) raw = close;
  else if (previous != null && previous > 0) raw = previous;
  const price = usableLecapPrice(raw);
  if (price == null) return null;
  let volume = lecapFinite(row.tradeVolume);
  if (volume == null || volume <= 0) volume = lecapFinite(row.volume) || 0;
  return {
    ticker: String(row.symbol).toUpperCase(),
    price,
    volume,
    source: "byma",
  };
}

function rowsOf(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: Record<string, unknown>[] }).data;
  }
  return [];
}

export function mergeLecapPrices(
  data912Rows: unknown,
  bymaRows: unknown,
): Record<string, LecapPrice> {
  const byTicker: Record<string, LecapPrice> = {};
  for (const row of rowsOf(data912Rows)) {
    const quote = priceFromData912Row(row);
    if (!quote) continue;
    byTicker[quote.ticker] = quote;
  }
  for (const row of rowsOf(bymaRows)) {
    const quote = priceFromBymaLebacRow(row);
    if (!quote || byTicker[quote.ticker]) continue;
    byTicker[quote.ticker] = quote;
  }
  return byTicker;
}

export function yieldFromPrice(price: number, payoffExact: number, days: number) {
  if (!(price > 0) || !(payoffExact > 0) || !(days > 0)) return null;
  if (payoffExact <= price) return null;
  const ratio = payoffExact / price;
  const tna = (ratio - 1) * (365 / days) * 100;
  const tea = (ratio ** (365 / days) - 1) * 100;
  if (!(tna > 0 && tna < 80 && tea > 0 && tea < 150)) return null;
  const teaRounded = lecapRound(tea, 2);
  return {
    tna: lecapRound(tna, 2),
    tea: teaRounded,
    tir: teaRounded,
  };
}

export function buildLecapCurve(input: {
  now?: Date | string | number;
  data912Rows?: unknown;
  bymaRows?: unknown;
  fichas?: Record<string, Record<string, unknown> | null>;
  referenceMinDays?: number;
} | null | undefined): LecapCurve | null {
  const source = input ?? {};
  const now = source.now ? new Date(source.now) : new Date();
  if (Number.isNaN(now.getTime())) return null;
  const calendar = quoteCalendar(now);
  const prices = mergeLecapPrices(source.data912Rows, source.bymaRows);
  const fichas = source.fichas ?? {};
  const letters: LecapLetter[] = [];

  for (const ticker of Object.keys(prices)) {
    const terms = resolveLecapTerms(ticker, fichas[ticker]);
    if (!terms) continue;
    const diasHoy = daysBetweenIso(calendar.artDate, terms.maturity);
    if (!(diasHoy != null && diasHoy >= 1)) continue;
    const days = daysBetweenIso(calendar.settlement, terms.maturity);
    const yields = yieldFromPrice(
      prices[ticker]!.price,
      terms.payoffExact,
      days ?? 0,
    );
    if (!yields) continue;
    letters.push({
      ticker,
      precio: lecapRound(prices[ticker]!.price, 3),
      volumen: prices[ticker]!.volume,
      fuente: prices[ticker]!.source,
      temPct: terms.temPct,
      temSource: terms.temSource,
      emision: terms.issue,
      maturity: terms.maturity,
      vencimiento: formatVencimiento(terms.maturity),
      payoffPor100: terms.payoffPor100,
      settlement: calendar.settlement,
      dias: days ?? 0,
      diasHoy,
      tna: yields.tna,
      tea: yields.tea,
      tir: yields.tir,
    });
  }

  letters.sort((a, b) => {
    if (a.dias !== b.dias) return a.dias - b.dias;
    return (b.volumen || 0) - (a.volumen || 0);
  });
  if (!letters.length) return null;

  const minDays = lecapFinite(source.referenceMinDays) ?? 30;
  let reference: LecapLetter | null = null;
  for (const letter of letters) {
    if (letter.dias >= minDays) {
      reference = letter;
      break;
    }
  }
  if (!reference) reference = letters[0]!;
  return {
    letters,
    reference,
    source: reference.fuente,
    sourceLabel: LECAP_SOURCE_LABEL[reference.fuente] || reference.fuente,
    marketOpen: calendar.marketOpen,
    tradeDate: calendar.tradeDate,
    settlement: calendar.settlement,
  };
}

export function lecapTodayIso(now?: Date | string | number): string | null {
  if (typeof now === "string" && /^\d{4}-\d{2}-\d{2}$/.test(now)) return now;
  const date = now instanceof Date ? now : new Date(now || Date.now());
  if (Number.isNaN(date.getTime())) return null;
  return artParts(date).iso;
}

export function maturityIsoOf(letter: {
  maturity?: string;
  vencimiento?: string;
} | null): string | null {
  if (!letter) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(letter.maturity || "")) return letter.maturity!;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(letter.vencimiento || ""));
  if (!match) return null;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export function tradableLecaps<T extends { ticker?: string; maturity?: string; vencimiento?: string }>(
  letters: T[] | null | undefined,
  now?: Date | string | number,
): (T & MenuLetter)[] {
  const today = lecapTodayIso(now || new Date());
  if (!today) return [];
  const menu: (T & MenuLetter)[] = [];
  for (const letter of letters ?? []) {
    const maturity = maturityIsoOf(letter);
    if (!maturity) continue;
    const diasHoy = daysBetweenIso(today, maturity);
    if (!(diasHoy != null && diasHoy >= 1)) continue;
    menu.push({
      ...letter,
      ticker: String(letter.ticker || "").toUpperCase(),
      maturity,
      vencimiento: letter.vencimiento || formatVencimiento(maturity),
      diasHoy,
    } as T & MenuLetter);
  }
  menu.sort((a, b) => {
    if (a.diasHoy !== b.diasHoy) return a.diasHoy - b.diasHoy;
    return String(a.ticker).localeCompare(String(b.ticker));
  });
  return menu;
}

function preferLecap(candidate: MenuLetter, incumbent: MenuLetter, plazo: number) {
  const gapC = Math.abs(candidate.diasHoy - plazo);
  const gapI = Math.abs(incumbent.diasHoy - plazo);
  if (gapC !== gapI) return gapC < gapI;
  const withinC = candidate.diasHoy <= plazo;
  const withinI = incumbent.diasHoy <= plazo;
  if (withinC !== withinI) return withinC;
  if (candidate.diasHoy !== incumbent.diasHoy) return candidate.diasHoy > incumbent.diasHoy;
  return String(candidate.ticker) < String(incumbent.ticker);
}

export type LecapPick = {
  mode?: "plazo" | "letra";
  menu: MenuLetter[];
  letter: MenuLetter | null;
  plazo: number | null;
  gapDays: number | null;
  absGap: number | null;
  fit: boolean;
  manual: boolean;
  maxGapDays: number;
  reason: string;
  criterion: string;
  today: string | null;
};

const LECAP_PICK_CRITERION =
  "Modo por plazo: entre las letras que todavía no vencieron, se elige la de vencimiento más cercano a los días pedidos.";

const LECAP_LETTER_MODE =
  "Modo por letra: el plazo es la cantidad de días de hoy al vencimiento de la letra elegida.";

export function pickLecapForPlazo(
  letters: Parameters<typeof tradableLecaps>[0],
  plazoDays: number,
  options?: { maxGapDays?: number; today?: Date | string | number; ticker?: string },
): LecapPick {
  const opts = options ?? {};
  const maxGapRaw = lecapFinite(opts.maxGapDays);
  const maxGap = maxGapRaw == null || maxGapRaw < 0 ? LECAP_MAX_GAP_DAYS : maxGapRaw;
  const today = lecapTodayIso(opts.today || new Date());
  const menu = tradableLecaps(letters, today ?? undefined);
  const plazo = Math.round(Number(plazoDays));
  const base: LecapPick = {
    menu,
    letter: null,
    plazo: Number.isFinite(plazo) ? plazo : null,
    gapDays: null,
    absGap: null,
    fit: false,
    manual: false,
    maxGapDays: maxGap,
    reason: "sin-letras",
    criterion: LECAP_PICK_CRITERION,
    today,
  };
  if (!menu.length || !Number.isFinite(plazo) || plazo < 1) return base;

  let forced: MenuLetter | null = null;
  const ticker = String(opts.ticker || "").toUpperCase();
  if (ticker) {
    forced = menu.find((letter) => letter.ticker === ticker) ?? null;
  }

  let chosen = forced;
  if (!chosen) {
    chosen = menu[0]!;
    for (let j = 1; j < menu.length; j++) {
      if (preferLecap(menu[j]!, chosen, plazo)) chosen = menu[j]!;
    }
  }

  const gapDays = chosen.diasHoy - plazo;
  const absGap = Math.abs(gapDays);
  return {
    menu,
    letter: chosen,
    plazo,
    gapDays,
    absGap,
    fit: absGap <= maxGap,
    manual: !!forced,
    maxGapDays: maxGap,
    reason: forced
      ? absGap <= maxGap
        ? "manual"
        : "manual-lejos"
      : absGap <= maxGap
        ? "calza"
        : "lejos",
    criterion: LECAP_PICK_CRITERION,
    today,
  };
}

function defaultLecapLetter(menu: MenuLetter[]): MenuLetter | null {
  for (const row of menu) {
    if (row.diasHoy >= 30) return row;
  }
  return menu[0] ?? null;
}

export function resolveLecapHorizon(
  letters: Parameters<typeof tradableLecaps>[0],
  options?: {
    mode?: "plazo" | "letra";
    maxGapDays?: number;
    today?: Date | string | number;
    ticker?: string;
    plazoDays?: number;
  },
): LecapPick {
  const opts = options ?? {};
  const mode = opts.mode === "plazo" ? "plazo" : "letra";
  const maxGapRaw = lecapFinite(opts.maxGapDays);
  const maxGap = maxGapRaw == null || maxGapRaw < 0 ? LECAP_MAX_GAP_DAYS : maxGapRaw;
  if (mode === "plazo") {
    const pick = pickLecapForPlazo(letters, opts.plazoDays ?? 0, opts);
    pick.mode = "plazo";
    return pick;
  }

  const today = lecapTodayIso(opts.today || new Date());
  const menu = tradableLecaps(letters, today ?? undefined);
  const ticker = String(opts.ticker || "").toUpperCase();
  let letter: MenuLetter | null = null;
  if (ticker) letter = menu.find((row) => row.ticker === ticker) ?? null;
  if (!letter) letter = defaultLecapLetter(menu);
  if (!letter) {
    return {
      mode: "letra",
      menu,
      letter: null,
      plazo: null,
      gapDays: null,
      absGap: null,
      fit: false,
      manual: false,
      maxGapDays: maxGap,
      reason: "sin-letras",
      criterion: LECAP_LETTER_MODE,
      today,
    };
  }
  return {
    mode: "letra",
    menu,
    letter,
    plazo: letter.diasHoy,
    gapDays: 0,
    absGap: 0,
    fit: true,
    manual: false,
    maxGapDays: maxGap,
    reason: "por-letra",
    criterion: LECAP_LETTER_MODE,
    today,
  };
}

export function lecapDetailsFromReference(reference: LecapLetter) {
  return {
    ticker: reference.ticker,
    vencimiento: reference.vencimiento,
    nombre: `LECAP Vto. ${reference.vencimiento}`,
    diasAlVencimiento: reference.dias,
    precio: reference.precio,
    payoffPor100: reference.payoffPor100,
    temPct: reference.temPct,
    tna: reference.tna,
    tea: reference.tea,
    tir: reference.tir,
    settlement: reference.settlement,
    maturity: reference.maturity,
    fuente: reference.fuente,
  };
}
