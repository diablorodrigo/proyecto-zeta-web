import assert from "node:assert/strict";
import { test } from "vitest";
import {
  LECAP_CONFIG_FALLBACK,
  buildLecapCurve,
  mergeLecapPrices,
  parseTemPct,
  payoffExactFromTem,
  pickLecapForPlazo,
  quoteCalendar,
  resolveLecapHorizon,
  resolveLecapTerms,
  tradableLecaps,
} from "@/lib/rates/lecap";

const FRIDAY_CLOSE = new Date("2026-10-24T15:30:00.000Z");

const DATA912_FRIDAY = [
  { symbol: "S30O6", c: 134.989, v: 2003653702, px_bid: 134.96, px_ask: 134.989 },
  { symbol: "S13N6", c: 108.435, v: 52681184620, px_bid: 108.435, px_ask: 108.438 },
  { symbol: "S30N6", c: 127.09, v: 48797594850, px_bid: 127.07, px_ask: 127.09 },
  { symbol: "S29E7", c: 104.932, v: 4051084049, px_bid: 104.932, px_ask: 104.95 },
  { symbol: "S2N6D", c: 0.07, v: 20000 },
  { symbol: "X30N6", c: 129, v: 1000 },
  { symbol: "D30O6", c: 152800, v: 1000 },
];

const MENU_TODAY = "2026-10-26";
const MENU_LETTERS = [
  { ticker: "S30O6", maturity: "2026-10-30", tna: 19.55, dias: 4 },
  { ticker: "S13N6", maturity: "2026-11-13", tna: 22.75, dias: 18 },
  { ticker: "S30N6", maturity: "2026-11-30", tna: 22.96, dias: 35 },
  { ticker: "S29E7", maturity: "2027-01-29", tna: 24.73, dias: 95 },
  { ticker: "S31L5", maturity: "2026-10-25", vencimiento: "25/10/2026", tna: 40, dias: 12 },
];

test("el payoff contractual redondeado coincide con el flujo publicado", () => {
  const cases = [
    ["S30O6", 2.55, "2025-10-31", "2026-10-30", 135.28],
    ["S13N6", 2.1, "2026-06-30", "2026-11-13", 109.65],
    ["S30N6", 2.3, "2025-12-15", "2026-11-30", 129.89],
    ["S29E7", 2.25, "2026-08-31", "2027-01-29", 111.68],
  ] as const;
  for (const [ticker, tem, issue, maturity, cents] of cases) {
    const exact = payoffExactFromTem(tem, issue, maturity);
    assert.ok(exact != null, ticker);
    assert.equal(Math.round(exact * 100) / 100, cents, ticker);
  }
});

test("la ficha sin TEM usa la tasa verificada y no asume VN 100", () => {
  const s13 = resolveLecapTerms("S13N6", {
    fechaEmision: "2026-06-30 00:00:00.0",
    fechaVencimiento: "2026-11-13 00:00:00.0",
    interes:
      "Pagarán una tasa efectiva mensual capitalizable mensualmente hasta el vencimiento del instrumento.",
    denominacion: "LETRA DEL TESORO NACIONAL CAPITALIZABLE EN PESOS",
  });
  assert.ok(s13);
  assert.equal(s13.temPct, 2.1);
  assert.equal(s13.temSource, "tem_verificada");
  assert.equal(s13.payoffPor100, 109.65);
  assert.equal(
    resolveLecapTerms("S31Z9", {
      fechaEmision: "2026-01-01 00:00:00.0",
      fechaVencimiento: "2026-06-30 00:00:00.0",
      interes: "A descuento.",
      denominacion: "LETRA",
    }),
    null,
  );
  assert.equal(parseTemPct("Tasa efectiva mensual: 2,30 %"), 2.3);
  const fromFicha = resolveLecapTerms("S30N6", {
    fechaEmision: "2025-12-15 00:00:00.0",
    fechaVencimiento: "2026-11-30 00:00:00.0",
    interes: "Tasa efectiva mensual: 2,30 %",
    denominacion: "LETRA DEL TESORO NACIONAL CAPITALIZABLE EN PESOS",
  });
  assert.equal(fromFicha?.temSource, "byma_ficha");
  assert.equal(fromFicha?.payoffPor100, 129.89);
});

test("un sábado usa el cierre del viernes y la liquidación del lunes", () => {
  const calendar = quoteCalendar(FRIDAY_CLOSE);
  assert.equal(calendar.artDate, "2026-10-24");
  assert.equal(calendar.tradeDate, "2026-10-23");
  assert.equal(calendar.settlement, "2026-10-26");
  assert.equal(calendar.marketOpen, false);

  const mondayOpen = quoteCalendar(new Date("2026-10-26T15:00:00.000Z"));
  assert.equal(mondayOpen.artDate, "2026-10-26");
  assert.equal(mondayOpen.tradeDate, "2026-10-26");
  assert.equal(mondayOpen.settlement, "2026-10-27");
  assert.equal(mondayOpen.marketOpen, true);

  const beforeBell = quoteCalendar(new Date("2026-10-26T13:00:00.000Z"));
  assert.equal(beforeBell.marketOpen, false);
  assert.equal(beforeBell.tradeDate, "2026-10-23");

  const bancario = quoteCalendar(new Date("2026-11-06T15:00:00.000Z"));
  assert.equal(bancario.tradeDate, "2026-11-06");
  assert.equal(bancario.marketOpen, true);
  assert.equal(bancario.settlement, "2026-11-11");
});

test("Data912 manda el precio y un trade en cero de BYMA no lo pisa", () => {
  const merged = mergeLecapPrices(DATA912_FRIDAY, [
    {
      symbol: "S30N6",
      settlementType: "2",
      denominationCcy: "ARS",
      trade: 0,
      vwap: 0,
      bidPrice: 0,
      offerPrice: 0,
      closingPrice: 0,
      previousClosingPrice: 0,
    },
    {
      symbol: "S10N5",
      settlementType: "2",
      denominationCcy: "ARS",
      trade: 101.5,
      closingPrice: 101.5,
      tradeVolume: 10,
    },
  ]);
  assert.equal(merged.S30N6?.price, 127.09);
  assert.equal(merged.S30N6?.source, "data912");
  assert.equal(merged.S10N5?.source, "byma");
  assert.equal(merged.S2N6D, undefined);
  assert.equal(merged.X30N6, undefined);
});

test("la curva del 24/10/2026 calcula TNA, TEA y TIR de cada letra", () => {
  const curve = buildLecapCurve({
    now: FRIDAY_CLOSE,
    data912Rows: DATA912_FRIDAY,
    bymaRows: [],
    fichas: {},
  });
  assert.ok(curve);
  assert.equal(curve.marketOpen, false);
  assert.equal(curve.source, "data912");
  assert.equal(curve.reference.ticker, "S30N6");
  assert.equal(curve.reference.dias, 35);
  assert.equal(curve.reference.tna, 22.96);
  assert.equal(curve.reference.tea, 25.5);
  assert.equal(curve.reference.tir, 25.5);
  assert.deepEqual(
    curve.letters.map((letter) => letter.ticker),
    ["S30O6", "S13N6", "S30N6", "S29E7"],
  );
  const byTicker = Object.fromEntries(curve.letters.map((letter) => [letter.ticker, letter]));
  assert.equal(byTicker.S30O6?.tna, 19.55);
  assert.equal(byTicker.S30O6?.tea, 21.57);
  assert.equal(byTicker.S13N6?.tna, 22.75);
  assert.equal(byTicker.S13N6?.tea, 25.38);
  assert.equal(byTicker.S30N6?.payoffPor100, 129.89);
  assert.equal(byTicker.S29E7?.tna, 24.73);
  assert.equal(byTicker.S29E7?.tea, 27.08);
  assert.equal(byTicker.S29E7?.tir, 27.08);
});

test("elige la letra más cercana al plazo y descarta la vencida", () => {
  const corta = pickLecapForPlazo(MENU_LETTERS, 15, { today: MENU_TODAY });
  assert.equal(corta.letter?.ticker, "S13N6");
  assert.equal(corta.fit, true);
  assert.equal(corta.letter?.diasHoy, 18);
  assert.ok(corta.menu.every((letter) => letter.ticker !== "S31L5"));

  const lejos = pickLecapForPlazo(MENU_LETTERS, 60, { today: MENU_TODAY });
  assert.equal(lejos.letter?.ticker, "S30N6");
  assert.equal(lejos.fit, false);

  const vencida = pickLecapForPlazo(MENU_LETTERS, 10, {
    today: MENU_TODAY,
    ticker: "S31L5",
  });
  assert.equal(vencida.manual, false);
  assert.equal(vencida.letter?.ticker, "S30O6");

  const menu = tradableLecaps(LECAP_CONFIG_FALLBACK, "2026-11-01");
  assert.ok(menu.every((letter) => letter.ticker !== "S30O6"));
  assert.equal(menu[0]?.ticker, "S13N6");
  assert.equal(menu[0]?.diasHoy, 12);
});

test("el modo por letra usa los días reales al vencimiento", () => {
  const horizon = resolveLecapHorizon(MENU_LETTERS, {
    mode: "letra",
    ticker: "S29E7",
    today: MENU_TODAY,
    plazoDays: 7,
  });
  assert.equal(horizon.letter?.ticker, "S29E7");
  assert.equal(horizon.plazo, 95);
  assert.equal(horizon.fit, true);

  const vencida = resolveLecapHorizon(MENU_LETTERS, {
    mode: "letra",
    ticker: "S31L5",
    today: MENU_TODAY,
  });
  assert.equal(vencida.letter?.ticker, "S30N6");
  assert.equal(vencida.plazo, vencida.letter?.diasHoy);
});

test("si no hay precio usable no se inventa una curva", () => {
  assert.equal(
    buildLecapCurve({
      now: FRIDAY_CLOSE,
      data912Rows: [{ symbol: "S30N6", c: 0, px_bid: 0, px_ask: 0 }],
      bymaRows: [
        { symbol: "S30N6", settlementType: "2", denominationCcy: "ARS", trade: 0 },
      ],
      fichas: {},
    }),
    null,
  );
});
