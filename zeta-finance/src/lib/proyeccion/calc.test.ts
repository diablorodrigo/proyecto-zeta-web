import assert from "node:assert/strict";
import { test } from "vitest";
import {
  inflacionAcumulada,
  inflacionAcumuladaDias,
  lecapAlVencimiento,
  mmTem,
  perdidaPoderAdquisitivo,
  proyectarNominal,
  resultadoEnHorizonte,
  teaToTem,
  tnaToTem,
  usdProyeccion,
} from "@/lib/proyeccion/calc";
import { calcPlazoFijoSimple } from "@/lib/rates/plazo-fijo";

test("tnaToTem de un plazo fijo a 30 días es el interés simple del mes", () => {
  const tna = 0.195;
  assert.ok(Math.abs(tnaToTem(tna, 30) - (tna * 30) / 365) < 1e-12);
});

test("tnaToTem de una caución a 7 días renueva el tramo hasta un mes", () => {
  const tna = 0.215;
  const esperado = (1 + (tna * 7) / 365) ** (30 / 7) - 1;
  assert.ok(Math.abs(tnaToTem(tna, 7) - esperado) < 1e-12);
});

test("teaToTem y el money market siguen las fórmulas pedidas", () => {
  const tea = 0.255;
  assert.ok(Math.abs(teaToTem(tea) - ((1 + tea) ** (30 / 365) - 1)) < 1e-12);
  const tna = 0.1828;
  assert.ok(Math.abs(mmTem(tna) - ((1 + tna / 365) ** 30 - 1)) < 1e-12);
  assert.ok(Math.abs(mmTem(tna) - tnaToTem(tna, 1)) < 1e-12);
});

test("la inflación acumulada multiplica los meses y repite el último si faltan", () => {
  const pis = [0.017, 0.016, 0.018];
  assert.ok(
    Math.abs(inflacionAcumulada(pis, 3) - (1.017 * 1.016 * 1.018 - 1)) < 1e-12,
  );
  assert.ok(Math.abs(inflacionAcumulada([0.02], 2) - (1.02 * 1.02 - 1)) < 1e-12);
});

test("un tramo de días que no cierra en un mes usa la fracción del mes siguiente", () => {
  const dias = 35;
  const frac = dias / 30 - 1;
  const esperado = 1.017 * 1.016 ** frac - 1;
  assert.ok(Math.abs(inflacionAcumuladaDias([0.017, 0.016], dias) - esperado) < 1e-12);
});

test("si queda quieta, la pérdida es el poder de compra que se va", () => {
  const pis = [0.02, 0.02, 0.02];
  const resultado = perdidaPoderAdquisitivo(100_000, pis, 3);
  const inflacion = 1.02 ** 3 - 1;
  const porcentaje = 1 - 1 / (1 + inflacion);
  assert.ok(Math.abs(resultado.porcentaje - porcentaje) < 1e-12);
  assert.ok(Math.abs(resultado.pesos - 100_000 * porcentaje) < 1e-8);
});

test("un instrumento renovado separa el nominal, el real y cuánto le gana a la inflación", () => {
  const tem = 0.01;
  const pis = [0.02, 0.02];
  const nominal = proyectarNominal(1000, tem, 2);
  assert.ok(Math.abs(nominal - 1000 * 1.01 ** 2) < 1e-10);
  const resultado = resultadoEnHorizonte(1000, tem, pis, 2);
  const inflacion = inflacionAcumulada(pis, 2);
  assert.ok(Math.abs(resultado.real - nominal / (1 + inflacion)) < 1e-10);
  assert.ok(
    Math.abs(resultado.porcentaje - (1.01 ** 2 / (1 + inflacion) - 1)) < 1e-12,
  );
  assert.ok(Math.abs(resultado.pesos - (resultado.real - 1000)) < 1e-8);
});

test("un mes de plazo fijo coincide con el interés simple, sin comisiones", () => {
  const monto = 5_000_000;
  const tnaPuntos = 19.5;
  const simple = calcPlazoFijoSimple(monto, 30, tnaPuntos);
  const compuesto = proyectarNominal(monto, tnaToTem(tnaPuntos / 100, 30), 1);
  assert.ok(simple.total != null);
  assert.ok(Math.abs(compuesto - simple.total) < 1e-6);
});

test("la LECAP llega al vencimiento con la TEA y se compara con la inflación de esos días", () => {
  const monto = 100_000;
  const tea = 0.255;
  const dias = 35;
  const resultado = lecapAlVencimiento(monto, tea, dias, [0.017, 0.016], dias);
  const nominal = monto * (1 + tea) ** (dias / 365);
  assert.ok(Math.abs(resultado.nominal - nominal) < 1e-6);
  const inflacion = inflacionAcumuladaDias([0.017, 0.016], dias);
  assert.ok(Math.abs(resultado.real - nominal / (1 + inflacion)) < 1e-6);
  assert.ok(Math.abs(resultado.porcentaje - (resultado.real / monto - 1)) < 1e-12);
});

test("el fondo en dólares capitaliza la TNA fija como un money market", () => {
  const proyeccion = usdProyeccion(1000, 0.05, 3);
  const tem = (1 + 0.05 / 365) ** 30 - 1;
  assert.ok(Math.abs(proyeccion.tem - tem) < 1e-12);
  assert.ok(Math.abs(proyeccion.final - 1000 * (1 + tem) ** 3) < 1e-8);
  assert.ok(Math.abs(proyeccion.ganancia - (proyeccion.final - 1000)) < 1e-8);
  const colchon = usdProyeccion(1000, 0, 3);
  assert.equal(colchon.ganancia, 0);
});
