import {
  CAUCION_DIAS_PAGINA,
  CAUCION_FALLBACK,
  FCI_FALLBACK,
  FCI_NOMBRE,
  PLAZO_FIJO_FALLBACK_TNA,
  USD_FONDO_TNA,
} from "@/lib/rates/fallback";
import {
  LECAP_CONFIG_FALLBACK,
  LECAP_FALLBACK_AS_OF,
  daysBetweenIso,
  quoteCalendar,
  resolveLecapTerms,
  tradableLecaps,
  yieldFromPrice,
  type LecapLetter,
} from "@/lib/rates/lecap";
import type { LecapVista, MarketSnapshot } from "@/lib/rates/types";

function respaldo(fuente: string, fecha: string | null, aConfirmar = false) {
  return { fuente, fecha, respaldo: true, aConfirmar };
}

/** Letras de respaldo con los días recalculados a `now`. Las ya vencidas salen. */
export function lecapsDeRespaldo(now: Date): LecapVista[] {
  const calendar = quoteCalendar(now);
  const menu = tradableLecaps(LECAP_CONFIG_FALLBACK, now);
  const vistas: LecapVista[] = [];
  for (const letter of menu) {
    const terms = resolveLecapTerms(letter.ticker, null);
    const days = terms
      ? daysBetweenIso(calendar.settlement, terms.maturity)
      : letter.dias;
    const yields =
      terms && days
        ? yieldFromPrice(letter.precio, terms.payoffExact, days)
        : null;
    if (!yields || days == null || days < 1) continue;
    vistas.push({
      ticker: letter.ticker,
      nombre: `LECAP ${letter.ticker} vence ${letter.vencimiento}`,
      tna: yields.tna,
      tea: yields.tea,
      tir: yields.tir,
      dias: days,
      diasHoy: letter.diasHoy,
      vencimiento: letter.vencimiento,
      maturity: letter.maturity,
      precio: letter.precio,
      fuente: respaldo("Respaldo, cierre 23/10/2026", LECAP_FALLBACK_AS_OF),
    });
  }
  return vistas;
}

export function snapshotDeRespaldo(now = new Date()): MarketSnapshot {
  return {
    asOf: now.toISOString(),
    plazoFijo: {
      tna: PLAZO_FIJO_FALLBACK_TNA,
      ...respaldo("Respaldo fijo", null),
    },
    moneyMarket: {
      tna: FCI_FALLBACK.tna,
      nombre: FCI_NOMBRE,
      diasVentana: FCI_FALLBACK.dias,
      ...respaldo("Respaldo (cuotaparte 15/10 a 22/10/2026)", FCI_FALLBACK.fecha),
    },
    caucion: {
      tna: CAUCION_FALLBACK[CAUCION_DIAS_PAGINA] ?? 21.5,
      dias: CAUCION_DIAS_PAGINA,
      byDays: Object.fromEntries(
        Object.entries(CAUCION_FALLBACK).map(([days, tna]) => [days, tna]),
      ),
      ...respaldo("Respaldo fijo", null),
    },
    lecaps: lecapsDeRespaldo(now),
    usd: {
      tna: USD_FONDO_TNA,
      ...respaldo("Tasa fija, a confirmar", null, true),
    },
  };
}

export function lecapVistaFromLetter(
  letter: LecapLetter,
  fecha: string | null,
  respaldoFlag: boolean,
): LecapVista {
  const etiqueta =
    letter.fuente === "data912"
      ? "Data912"
      : letter.fuente === "byma"
        ? "BYMA"
        : "Respaldo";
  return {
    ticker: letter.ticker,
    nombre: `LECAP ${letter.ticker} vence ${letter.vencimiento}`,
    tna: letter.tna,
    tea: letter.tea,
    tir: letter.tir,
    dias: letter.dias,
    diasHoy: letter.diasHoy,
    vencimiento: letter.vencimiento,
    maturity: letter.maturity,
    precio: letter.precio,
    fuente: {
      fuente: etiqueta,
      fecha,
      respaldo: respaldoFlag,
      aConfirmar: false,
    },
  };
}
