import assert from "node:assert/strict";
import { test } from "vitest";
import {
  calcPlazoFijoSimple,
  macroBandsFromArgentinaDatos,
  pickMacroBand,
  plazoFijoFromDepositos,
} from "@/lib/rates/plazo-fijo";

test("el plazo fijo promedio toma el último depósito del BCRA entre 15 y 90", () => {
  const quote = plazoFijoFromDepositos([
    { fecha: "2026-10-01", valor: 40 },
    { fecha: "2026-10-28", valor: "19.48" },
  ]);
  assert.deepEqual(quote, { tna: 19.5, fecha: "2026-10-28" });
  assert.equal(plazoFijoFromDepositos([{ valor: 10 }]), null);
  assert.equal(plazoFijoFromDepositos([]), null);
});

test("el interés simple no resta impuestos ni comisiones", () => {
  const resultado = calcPlazoFijoSimple(1_000_000, 30, 19);
  assert.ok(resultado.interes != null && resultado.total != null);
  assert.ok(Math.abs(resultado.interes - 1_000_000 * 0.19 * (30 / 365)) < 1e-6);
  assert.equal(resultado.total, 1_000_000 + resultado.interes);
});

test("los tramos de Macro llegan en decimal y elige la banda del monto", () => {
  const bands = macroBandsFromArgentinaDatos([
    { entidad: "OTRO BANCO", tasas: [] },
    {
      entidad: "BANCO MACRO S.A.",
      tasas: [
        {
          tna: 0.195,
          plazoMinDias: 30,
          plazoMaxDias: 35,
          montoMinimo: 1,
          montoMaximo: 4_999_999.99,
        },
        {
          tna: 0.2,
          plazoMinDias: 30,
          plazoMaxDias: 35,
          montoMinimo: 5_000_000,
          montoMaximo: null,
        },
      ],
    },
  ]);
  assert.equal(bands?.[0]?.tna, 19.5);
  assert.equal(pickMacroBand(bands, 100_000, 32)?.tna, 19.5);
  assert.equal(pickMacroBand(bands, 6_000_000, 32)?.tna, 20);
  assert.equal(pickMacroBand(bands, 100_000, 10), null);
});
