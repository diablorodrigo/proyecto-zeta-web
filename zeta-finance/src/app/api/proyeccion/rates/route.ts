import { NextResponse } from "next/server";
import { INFLACION_REM } from "@/lib/proyeccion/config";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import { getMarketSnapshot } from "@/lib/rates/load-market";
import { snapshotDeRespaldo } from "@/lib/rates/snapshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60 * 1000;
const LIMIT = 60;

export async function GET(request: Request) {
  if (!allowRequest(`proyeccion-rates:${clientIp(request)}`, LIMIT, WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, error: "Demasiadas consultas. Probá de nuevo en un minuto." },
      { status: 429 },
    );
  }

  try {
    const mercado = await getMarketSnapshot();
    return NextResponse.json(
      {
        ok: true,
        cacheMinutes: 30,
        mercado,
        inflacion: INFLACION_REM,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("[api/proyeccion/rates]", error);
    return NextResponse.json({
      ok: true,
      cacheMinutes: 5,
      mercado: snapshotDeRespaldo(new Date()),
      inflacion: INFLACION_REM,
      respaldo: true,
    });
  }
}
