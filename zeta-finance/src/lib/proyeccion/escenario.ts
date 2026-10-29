import {
  inflacionAcumulada,
  lecapAlVencimiento,
  mmTem,
  perdidaPoderAdquisitivo,
  resultadoEnHorizonte,
  tnaToTem,
  usdProyeccion,
} from "@/lib/proyeccion/calc";
import type { HorizonteMeses } from "@/lib/proyeccion/config";
import type { Fuente, LecapVista, MarketSnapshot } from "@/lib/rates/types";

export type Supuestos = {
  /** Inflación mensual en decimal, en orden. */
  inflacion: number[];
  plazoFijoTna: number;
  plazoFijoFuente: Fuente;
  moneyMarketTna: number;
  moneyMarketNombre: string;
  moneyMarketFuente: Fuente;
  caucionTna: number;
  caucionDias: number;
  caucionFuente: Fuente;
  usdTna: number;
  usdFuente: Fuente;
  lecaps: Array<
    Pick<
      LecapVista,
      | "ticker"
      | "nombre"
      | "tea"
      | "tna"
      | "tir"
      | "dias"
      | "diasHoy"
      | "vencimiento"
      | "maturity"
      | "fuente"
    >
  >;
};

function fuenteDe(snapshot: { fuente: string; fecha: string | null; respaldo: boolean; aConfirmar: boolean }): Fuente {
  return {
    fuente: snapshot.fuente,
    fecha: snapshot.fecha,
    respaldo: snapshot.respaldo,
    aConfirmar: snapshot.aConfirmar,
  };
}

export function supuestosDesdeSnapshot(
  snapshot: MarketSnapshot,
  inflacion: number[],
): Supuestos {
  return {
    inflacion,
    plazoFijoTna: snapshot.plazoFijo.tna / 100,
    plazoFijoFuente: fuenteDe(snapshot.plazoFijo),
    moneyMarketTna: snapshot.moneyMarket.tna / 100,
    moneyMarketNombre: snapshot.moneyMarket.nombre,
    moneyMarketFuente: fuenteDe(snapshot.moneyMarket),
    caucionTna: snapshot.caucion.tna / 100,
    caucionDias: snapshot.caucion.dias,
    caucionFuente: fuenteDe(snapshot.caucion),
    usdTna: snapshot.usd.tna / 100,
    usdFuente: fuenteDe(snapshot.usd),
    lecaps: snapshot.lecaps.map((letter) => ({
      ...letter,
      tea: letter.tea / 100,
      tna: letter.tna / 100,
      tir: letter.tir / 100,
    })),
  };
}

export type Fila = {
  id: string;
  nombre: string;
  detalle: string;
  /** TNA en decimal, si el instrumento se muestra así. */
  tna: number | null;
  /** TEA en decimal. En las letras es la tasa de la proyección. */
  tea: number | null;
  tem: number | null;
  liquidez: string;
  nominal: number;
  real: number;
  pesos: number;
  porcentaje: number;
  fuente: string;
  fecha: string | null;
  respaldo: boolean;
  aConfirmar: boolean;
  periodo: string;
};

export type Escenario = {
  meses: HorizonteMeses;
  monto: number;
  inflacion: number;
  perdida: { pesos: number; porcentaje: number };
  filas: Fila[];
  lecaps: Fila[];
  usd: {
    tem: number;
    colchon: number;
    fondo: number;
    gananciaFondo: number;
  } | null;
  mejor: { id: string; nombre: string; porcentaje: number; periodo: string } | null;
};

function mesesTexto(n: number): string {
  return n === 1 ? "1 mes" : `${n} meses`;
}

function filaBase(
  parcial: Omit<Fila, "nominal" | "real" | "pesos" | "porcentaje"> & {
    nominal: number;
    real: number;
    pesos: number;
    porcentaje: number;
  },
): Fila {
  return parcial;
}

export function armarEscenario(input: {
  monto: number;
  usd: number;
  meses: HorizonteMeses;
  supuestos: Supuestos;
}): Escenario {
  const { monto, meses, supuestos } = input;
  const pis = supuestos.inflacion;
  const perdida = perdidaPoderAdquisitivo(monto, pis, meses);
  const inflacion = inflacionAcumulada(pis, meses);
  const periodo = mesesTexto(meses);

  const quieto = resultadoEnHorizonte(monto, 0, pis, meses);
  const pfTem = tnaToTem(supuestos.plazoFijoTna, 30);
  const pf = resultadoEnHorizonte(monto, pfTem, pis, meses);
  const mm = mmTem(supuestos.moneyMarketTna);
  const money = resultadoEnHorizonte(monto, mm, pis, meses);
  const cauTem = tnaToTem(supuestos.caucionTna, supuestos.caucionDias);
  const caucion = resultadoEnHorizonte(monto, cauTem, pis, meses);

  const filas: Fila[] = [
    filaBase({
      id: "cuenta",
      nombre: "Cuenta sin interés",
      detalle: "La plata queda en el banco y no suma nada.",
      tna: 0,
      tea: null,
      tem: 0,
      liquidez: "La podés usar en el momento.",
      ...quieto,
      fuente: "No tiene rendimiento",
      fecha: null,
      respaldo: false,
      aConfirmar: false,
      periodo,
    }),
    filaBase({
      id: "plazo-fijo",
      nombre: "Plazo fijo",
      detalle: "A 30 días, renovado a la misma tasa durante el horizonte.",
      tna: supuestos.plazoFijoTna,
      tea: null,
      tem: pfTem,
      liquidez: "A los 30 días. Acá se supone que lo renovás.",
      ...pf,
      fuente: supuestos.plazoFijoFuente.fuente,
      fecha: supuestos.plazoFijoFuente.fecha,
      respaldo: supuestos.plazoFijoFuente.respaldo,
      aConfirmar: supuestos.plazoFijoFuente.aConfirmar,
      periodo,
    }),
    filaBase({
      id: "money-market",
      nombre: "Money market",
      detalle: supuestos.moneyMarketNombre,
      tna: supuestos.moneyMarketTna,
      tea: null,
      tem: mm,
      liquidez: "Rescate en el día.",
      ...money,
      fuente: supuestos.moneyMarketFuente.fuente,
      fecha: supuestos.moneyMarketFuente.fecha,
      respaldo: supuestos.moneyMarketFuente.respaldo,
      aConfirmar: supuestos.moneyMarketFuente.aConfirmar,
      periodo,
    }),
    filaBase({
      id: "caucion",
      nombre: `Caución a ${supuestos.caucionDias} días`,
      detalle: "Se renueva a la misma tasa hasta cubrir los meses elegidos.",
      tna: supuestos.caucionTna,
      tea: null,
      tem: cauTem,
      liquidez: `Cada ${supuestos.caucionDias} días. Acá se supone que la renovás.`,
      ...caucion,
      fuente: supuestos.caucionFuente.fuente,
      fecha: supuestos.caucionFuente.fecha,
      respaldo: supuestos.caucionFuente.respaldo,
      aConfirmar: supuestos.caucionFuente.aConfirmar,
      periodo,
    }),
  ];

  const lecaps: Fila[] = supuestos.lecaps.map((letter) => {
    const resultado = lecapAlVencimiento(
      monto,
      letter.tea,
      letter.dias,
      pis,
      letter.diasHoy,
    );
    const dias = letter.diasHoy;
    return filaBase({
      id: `lecap-${letter.ticker}`,
      nombre: letter.nombre,
      detalle: "Proyectada hasta el vencimiento, sin costo de salida.",
      tna: letter.tna,
      tea: letter.tea,
      tem: null,
      liquidez: `Al vencimiento, el ${letter.vencimiento}.`,
      ...resultado,
      fuente: letter.fuente.fuente,
      fecha: letter.fuente.fecha,
      respaldo: letter.fuente.respaldo,
      aConfirmar: letter.fuente.aConfirmar,
      periodo: dias === 1 ? "1 día" : `${dias} días`,
    });
  });

  const candidatos = [...filas.filter((fila) => fila.id !== "cuenta"), ...lecaps];
  const mejor = candidatos.reduce<Escenario["mejor"]>((best, fila) => {
    if (!best || fila.porcentaje > best.porcentaje) {
      return {
        id: fila.id,
        nombre: fila.nombre,
        porcentaje: fila.porcentaje,
        periodo: fila.periodo,
      };
    }
    return best;
  }, null);

  const usd =
    input.usd > 0
      ? {
          tem: usdProyeccion(input.usd, supuestos.usdTna, meses).tem,
          colchon: input.usd,
          fondo: usdProyeccion(input.usd, supuestos.usdTna, meses).final,
          gananciaFondo: usdProyeccion(input.usd, supuestos.usdTna, meses).ganancia,
        }
      : null;

  return {
    meses,
    monto,
    inflacion,
    perdida: { pesos: perdida.pesos, porcentaje: perdida.porcentaje },
    filas,
    lecaps,
    usd,
    mejor,
  };
}
