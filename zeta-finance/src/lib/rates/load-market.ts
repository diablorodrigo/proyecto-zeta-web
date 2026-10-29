import { getCached, setCached } from "@/lib/market";
import {
  bucketCaucionQuotes,
  nearestCaucionBucket,
  quotesFromArgentinaDatosRows,
  quotesFromBymaRows,
  type CaucionQuote,
} from "@/lib/rates/caucion";
import {
  CAUCION_DIAS_PAGINA,
  CAUCION_FALLBACK,
  FCI_NOMBRE,
} from "@/lib/rates/fallback";
import { tnaFromCuotapartes } from "@/lib/rates/cuotaparte";
import {
  LECAP_VERIFIED_TERMS,
  buildLecapCurve,
  mergeLecapPrices,
} from "@/lib/rates/lecap";
import { plazoFijoFromDepositos } from "@/lib/rates/plazo-fijo";
import { lecapVistaFromLetter, snapshotDeRespaldo } from "@/lib/rates/snapshot";
import type { MarketSnapshot } from "@/lib/rates/types";

const BYMA_CAUCIONES_URL =
  "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/cauciones";
const BYMA_LEBACS_URL =
  "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/lebacs";
const BYMA_FICHA_URL =
  "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/bnown/fichatecnica/especies/general";
const DATA912_NOTES_URL = "https://data912.com/live/arg_notes";
const DATA912_BONDS_URL = "https://data912.com/live/arg_bonds";
const ARGENTINA_DATOS_CAUCIONES_URL =
  "https://api.argentinadatos.com/v1/finanzas/cauciones/ars";
const DEPOSITOS_30_URL =
  "https://api.argentinadatos.com/v1/finanzas/tasas/depositos30Dias";
const FCI_HISTORICO_URL =
  "https://api.argentinadatos.com/v1/finanzas/fci/fondos/balanz-capital-money-market-clase-a/historico";

const CACHE_KEY = "proyeccion-market-v1";
const CACHE_VIVO_MS = 30 * 60 * 1000;
const CACHE_RESPALDO_MS = 5 * 60 * 1000;

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

function bymaHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Origin: "https://open.bymadata.com.ar",
    Referer: "https://open.bymadata.com.ar/",
    "User-Agent": "Mozilla/5.0 (compatible; ZetaFinance/1.0)",
  };
}

async function fetchJson(
  fetchImpl: FetchLike,
  url: string,
  timeoutMs: number,
  init?: RequestInit,
): Promise<unknown | null> {
  try {
    const res = await fetchImpl(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ZetaFinance/1.0)",
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[proyeccion-rates] sin datos de", url, error);
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function quoteCubrePlazo(quotes: CaucionQuote[], plazo: number): boolean {
  return quotes.some((quote) => nearestCaucionBucket(quote.days) === plazo);
}

function byDaysRecord(curve: Record<number, number>): Record<string, number> {
  return Object.fromEntries(Object.entries(curve).map(([days, tna]) => [days, tna]));
}

async function fetchBymaFicha(fetchImpl: FetchLike, ticker: string) {
  const data = await fetchJson(fetchImpl, BYMA_FICHA_URL, 4000, {
    method: "POST",
    headers: bymaHeaders(),
    body: JSON.stringify({ symbol: ticker }),
  });
  const record = asRecord(data);
  const row = Array.isArray(record?.data) ? record.data[0] : null;
  return row && typeof row === "object" ? (row as Record<string, unknown>) : null;
}

async function loadLecapCurve(fetchImpl: FetchLike, now: Date) {
  const [notes, bonds, bymaRows] = await Promise.all([
    fetchJson(fetchImpl, DATA912_NOTES_URL, 4000),
    fetchJson(fetchImpl, DATA912_BONDS_URL, 4000),
    fetchJson(fetchImpl, BYMA_LEBACS_URL, 5000, {
      method: "POST",
      headers: bymaHeaders(),
      body: JSON.stringify({ page_size: 700 }),
    }),
  ]);
  const noteRows = Array.isArray(notes) ? notes : [];
  const bondRows = Array.isArray(bonds) ? bonds : [];
  const data912Rows = noteRows.concat(bondRows);
  const bymaRecord = asRecord(bymaRows);
  const bymaList = Array.isArray(bymaRows)
    ? bymaRows
    : Array.isArray(bymaRecord?.data)
      ? (bymaRecord.data as unknown[])
      : [];

  const known = Object.keys(LECAP_VERIFIED_TERMS);
  const fichas: Record<string, Record<string, unknown> | null> = {};
  const knownFichas = await Promise.all(
    known.map(async (ticker) => [ticker, await fetchBymaFicha(fetchImpl, ticker)] as const),
  );
  for (const [ticker, row] of knownFichas) fichas[ticker] = row;

  const extra = Object.keys(mergeLecapPrices(data912Rows, bymaList))
    .filter((ticker) => !fichas[ticker])
    .slice(0, 6);
  if (extra.length) {
    const extraFichas = await Promise.all(
      extra.map(async (ticker) => [ticker, await fetchBymaFicha(fetchImpl, ticker)] as const),
    );
    for (const [ticker, row] of extraFichas) fichas[ticker] = row;
  }

  return buildLecapCurve({
    now,
    data912Rows,
    bymaRows: bymaList,
    fichas,
  });
}

export async function loadMarketRates(options?: {
  now?: Date;
  fetch?: FetchLike;
}): Promise<MarketSnapshot> {
  const now = options?.now ?? new Date();
  const fetchImpl = options?.fetch ?? ((input, init) => fetch(input, init));
  const base = snapshotDeRespaldo(now);
  const hoy = now.toISOString().slice(0, 10);

  try {
    const [bymaCaucion, argentinaCaucion, depositos, fciPayload, lecapCurve] =
      await Promise.all([
        fetchJson(fetchImpl, BYMA_CAUCIONES_URL, 5000, {
          method: "POST",
          headers: bymaHeaders(),
          body: "{}",
        }),
        fetchJson(fetchImpl, ARGENTINA_DATOS_CAUCIONES_URL, 3500),
        fetchJson(fetchImpl, DEPOSITOS_30_URL, 3500),
        fetchJson(fetchImpl, FCI_HISTORICO_URL, 8000),
        loadLecapCurve(fetchImpl, now),
      ]);

    let caucion = base.caucion;
    const bymaQuotes = quotesFromBymaRows(bymaCaucion);
    if (quoteCubrePlazo(bymaQuotes, CAUCION_DIAS_PAGINA)) {
      const curve = bucketCaucionQuotes(bymaQuotes, CAUCION_FALLBACK);
      caucion = {
        tna: curve.caucionByDays[CAUCION_DIAS_PAGINA] ?? base.caucion.tna,
        dias: CAUCION_DIAS_PAGINA,
        byDays: byDaysRecord(curve.caucionByDays),
        fuente: "BYMA",
        fecha: hoy,
        respaldo: false,
        aConfirmar: false,
      };
    } else {
      const adQuotes = quotesFromArgentinaDatosRows(argentinaCaucion);
      if (quoteCubrePlazo(adQuotes, CAUCION_DIAS_PAGINA)) {
        const curve = bucketCaucionQuotes(adQuotes, CAUCION_FALLBACK);
        caucion = {
          tna: curve.caucionByDays[CAUCION_DIAS_PAGINA] ?? base.caucion.tna,
          dias: CAUCION_DIAS_PAGINA,
          byDays: byDaysRecord(curve.caucionByDays),
          fuente: "ArgentinaDatos",
          fecha: hoy,
          respaldo: false,
          aConfirmar: false,
        };
      }
    }

    const pf = plazoFijoFromDepositos(depositos);
    const fciRecord = asRecord(fciPayload);
    const historico = Array.isArray(fciRecord?.historico)
      ? fciRecord.historico
      : [];
    const fci = tnaFromCuotapartes(historico, 7);

    return {
      asOf: now.toISOString(),
      plazoFijo: pf
        ? {
            tna: pf.tna,
            fuente: "ArgentinaDatos (BCRA, depósitos a 30 días)",
            fecha: pf.fecha,
            respaldo: false,
            aConfirmar: false,
          }
        : base.plazoFijo,
      moneyMarket: fci
        ? {
            tna: fci.tna,
            nombre: FCI_NOMBRE,
            diasVentana: fci.dias,
            fuente: "CNV, cuotaparte vía ArgentinaDatos",
            fecha: fci.fecha,
            respaldo: false,
            aConfirmar: false,
          }
        : base.moneyMarket,
      caucion,
      lecaps:
        lecapCurve && lecapCurve.letters.length
          ? lecapCurve.letters.map((letter) =>
              lecapVistaFromLetter(letter, lecapCurve.tradeDate, false),
            )
          : base.lecaps,
      usd: base.usd,
    };
  } catch (error) {
    console.warn("[proyeccion-rates] respaldo completo", error);
    return base;
  }
}

let inflight: Promise<MarketSnapshot> | null = null;

export function snapshotUsaAlgunaFuenteViva(snapshot: MarketSnapshot): boolean {
  return (
    !snapshot.plazoFijo.respaldo ||
    !snapshot.moneyMarket.respaldo ||
    !snapshot.caucion.respaldo ||
    snapshot.lecaps.some((letter) => !letter.fuente.respaldo)
  );
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const cached = getCached<MarketSnapshot>(CACHE_KEY);
  if (cached) return cached;
  if (!inflight) {
    inflight = loadMarketRates().finally(() => {
      inflight = null;
    });
  }
  const snapshot = await inflight;
  setCached(
    CACHE_KEY,
    snapshot,
    snapshotUsaAlgunaFuenteViva(snapshot) ? CACHE_VIVO_MS : CACHE_RESPALDO_MS,
  );
  return snapshot;
}
