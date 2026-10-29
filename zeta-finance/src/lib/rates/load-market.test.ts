import assert from "node:assert/strict";
import { test } from "vitest";
import {
  CAUCION_FALLBACK,
  FCI_FALLBACK,
  PLAZO_FIJO_FALLBACK_TNA,
  PLAZO_FIJO_FECHA,
  PLAZO_FIJO_FUENTE,
} from "@/lib/rates/fallback";
import { loadMarketRates, type FetchLike } from "@/lib/rates/load-market";

const FRIDAY_CLOSE = new Date("2026-10-24T15:30:00.000Z");

const DATA912 = [
  { symbol: "S30N6", c: 127.09, v: 100, px_bid: 127.07, px_ask: 127.09 },
  { symbol: "S13N6", c: 108.435, v: 100, px_bid: 108.4, px_ask: 108.44 },
];

function mockFetch(map: Record<string, unknown>): FetchLike {
  return async (input) => {
    const url = String(input);
    const key = Object.keys(map).find((item) => url.includes(item));
    if (!key) return new Response("no", { status: 404 });
    return Response.json(map[key]);
  };
}

test("si las fuentes fallan, cada instrumento queda en su respaldo fijo", async () => {
  const fetchImpl: FetchLike = async () => {
    throw new Error("caído");
  };
  const snapshot = await loadMarketRates({ now: FRIDAY_CLOSE, fetch: fetchImpl });
  assert.equal(snapshot.plazoFijo.tna, 19);
  assert.equal(snapshot.plazoFijo.tna, PLAZO_FIJO_FALLBACK_TNA);
  assert.equal(snapshot.plazoFijo.fuente, PLAZO_FIJO_FUENTE);
  assert.equal(snapshot.plazoFijo.fecha, PLAZO_FIJO_FECHA);
  assert.equal(snapshot.plazoFijo.aConfirmar, true);
  assert.equal(snapshot.plazoFijo.respaldo, true);
  assert.equal(snapshot.moneyMarket.tna, FCI_FALLBACK.tna);
  assert.equal(snapshot.moneyMarket.respaldo, true);
  assert.equal(snapshot.moneyMarket.fecha, FCI_FALLBACK.fecha);
  assert.equal(snapshot.caucion.tna, CAUCION_FALLBACK[7]);
  assert.equal(snapshot.caucion.respaldo, true);
  assert.equal(snapshot.usd.tna, 5);
  assert.equal(snapshot.usd.aConfirmar, true);
  assert.ok(snapshot.lecaps.every((letter) => letter.fuente.respaldo));
  assert.ok(snapshot.lecaps.some((letter) => letter.ticker === "S30N6"));
});

test("la serie de depósitos a 30 días no pisa el 19% de plazo fijo", async () => {
  const snapshot = await loadMarketRates({
    now: FRIDAY_CLOSE,
    fetch: mockFetch({
      "/free/cauciones": [
        { denominationCcy: "ARS", daysToMaturity: 7, trade: 0.26, tradeVolume: 10 },
      ],
      "/cauciones/ars": [],
      depositos30Dias: [{ fecha: "2026-10-27", valor: 22.6 }],
      "/historico": {
        historico: [
          { fecha: "2026-10-15", valorCuotaparte: 12676.343 },
          { fecha: "2026-10-22", valorCuotaparte: 12720.788 },
        ],
      },
      "/live/arg_notes": DATA912,
      "/live/arg_bonds": [],
      "/free/lebacs": [],
    }),
  });
  assert.equal(snapshot.plazoFijo.tna, 19);
  assert.equal(snapshot.plazoFijo.fuente, PLAZO_FIJO_FUENTE);
  assert.equal(snapshot.plazoFijo.fecha, PLAZO_FIJO_FECHA);
  assert.equal(snapshot.plazoFijo.aConfirmar, true);
  assert.equal(snapshot.plazoFijo.respaldo, true);
  assert.equal(snapshot.moneyMarket.tna, 18.28);
  assert.equal(snapshot.moneyMarket.respaldo, false);
  assert.equal(snapshot.moneyMarket.fuente, "CNV, cuotaparte vía ArgentinaDatos");
  assert.equal(snapshot.caucion.tna, 26);
  assert.equal(snapshot.caucion.respaldo, false);
  assert.equal(snapshot.caucion.fuente, "BYMA");
  const s30 = snapshot.lecaps.find((letter) => letter.ticker === "S30N6");
  assert.ok(s30);
  assert.equal(s30.tna, 22.96);
  assert.equal(s30.tea, 25.5);
  assert.equal(s30.fuente.respaldo, false);
  assert.equal(s30.fuente.fuente, "Data912");
  assert.equal(snapshot.usd.respaldo, true);
});

test("si BYMA no trae la caución de 7 días, usa ArgentinaDatos", async () => {
  const snapshot = await loadMarketRates({
    now: FRIDAY_CLOSE,
    fetch: mockFetch({
      "/free/cauciones": [
        { denominationCcy: "ARS", daysToMaturity: 30, trade: 0.3, tradeVolume: 10 },
      ],
      "/cauciones/ars": [{ plazo: 7, tna: 23.4, montoContado: 100 }],
      depositos30Dias: [],
      "/historico": { historico: [] },
      "/live/arg_notes": [],
      "/live/arg_bonds": [],
      "/free/lebacs": [],
    }),
  });
  assert.equal(snapshot.caucion.tna, 23.4);
  assert.equal(snapshot.caucion.fuente, "ArgentinaDatos");
  assert.equal(snapshot.caucion.respaldo, false);
  assert.equal(snapshot.plazoFijo.respaldo, true);
  assert.equal(snapshot.moneyMarket.respaldo, true);
});
