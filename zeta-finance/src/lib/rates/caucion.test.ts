import assert from "node:assert/strict";
import { test } from "vitest";
import {
  bucketCaucionQuotes,
  quotesFromArgentinaDatosRows,
  quotesFromBymaRows,
  tnaPointsFromBymaRow,
} from "@/lib/rates/caucion";
import { CAUCION_FALLBACK } from "@/lib/rates/fallback";

test("BYMA pasa la TNA de decimal a puntos y descarta otras monedas", () => {
  assert.equal(tnaPointsFromBymaRow({ trade: 0.212 }), 21.2);
  assert.equal(tnaPointsFromBymaRow({ trade: 0, vwap: 0.2 }), 20);
  assert.equal(tnaPointsFromBymaRow({ trade: 0, bidPrice: 0.2, offerPrice: 0.22 }), 21);
  const quotes = quotesFromBymaRows([
    { denominationCcy: "ARS", daysToMaturity: 7, trade: 0.212, tradeVolume: 1000 },
    { denominationCcy: "USD", daysToMaturity: 7, trade: 0.05, tradeVolume: 9 },
    { denominationCcy: "ARS", daysToMaturity: 6, trade: 0.25, tradeVolume: 50 },
  ]);
  assert.equal(quotes.length, 2);
  const curve = bucketCaucionQuotes(quotes, CAUCION_FALLBACK);
  assert.equal(curve.caucionByDays[7], 21.2);
  assert.equal(curve.caucionByDays[3], CAUCION_FALLBACK[3]);
  assert.equal(curve.filledBuckets, 1);
});

test("ArgentinaDatos ya viene en puntos y solo cubre el plazo cercano", () => {
  const quotes = quotesFromArgentinaDatosRows([
    { plazo: 30, tna: 24.4, montoContado: 10 },
    { plazo: 90, tna: 30 },
  ]);
  assert.equal(quotes.length, 2);
  const curve = bucketCaucionQuotes(quotes, CAUCION_FALLBACK);
  assert.equal(curve.caucionByDays[30], 24.4);
  assert.equal(curve.caucionByDays[7], CAUCION_FALLBACK[7]);
  assert.equal(curve.filledBuckets, 1);
});
