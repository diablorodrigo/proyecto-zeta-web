import { NextResponse } from "next/server";
import {
  fetchQuoteForEvaluation,
  fetchSp500BenchmarkAround,
} from "@/lib/market";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker")?.trim() ?? "";
  const from = searchParams.get("from")?.trim() ?? "";
  const includeBenchmark = searchParams.get("benchmark") === "1";

  if (!ticker || !from) {
    return NextResponse.json(
      { ok: false, error: "Parámetros requeridos: ticker y from (YYYY-MM-DD)" },
      { status: 400 },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(from)) {
    return NextResponse.json(
      { ok: false, error: "Fecha from inválida" },
      { status: 400 },
    );
  }

  try {
    const quote = await fetchQuoteForEvaluation(ticker, from);
    let benchmark: Awaited<ReturnType<typeof fetchSp500BenchmarkAround>> | null =
      null;

    if (includeBenchmark) {
      try {
        benchmark = await fetchSp500BenchmarkAround(from);
      } catch (err) {
        console.warn("[api/market/quote] benchmark failed", err);
      }
    }

    return NextResponse.json({
      ok: true,
      quote: {
        ticker: quote.ticker,
        currency: quote.currency,
        purchasePrice: quote.purchasePrice,
        purchaseDateUsed: quote.purchaseDateUsed,
        currentPrice: quote.currentPrice,
        currentDate: quote.currentDate,
      },
      benchmark,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al cotizar el ticker";
    const status = /inválid|no hay datos|no se pudo|no stooq|failed/i.test(
      message,
    )
      ? 404
      : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
