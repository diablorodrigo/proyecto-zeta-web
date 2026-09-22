import { NextResponse } from "next/server";
import { fetchSp500FiveYears } from "@/lib/market";

export const runtime = "nodejs";

export async function GET() {
  try {
    const series = await fetchSp500FiveYears();
    return NextResponse.json({
      ok: true,
      symbol: "^GSPC",
      name: "S&P 500",
      points: series,
    });
  } catch (err) {
    console.error("[api/market/sp500]", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "No se pudo cargar el S&P 500",
        points: [],
      },
      { status: 502 },
    );
  }
}
