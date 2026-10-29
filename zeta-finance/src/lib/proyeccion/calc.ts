/**
 * Fórmulas puras de la proyección. Las tasas entran en decimal (0,195 = 19,5%).
 *
 * TNA → TEM, capitalización cada `dias`: (1 + TNA·d/365)^(30/d) − 1
 * TEA → TEM: (1 + TEA)^(30/365) − 1
 * Money market: (1 + TNA/365)^30 − 1
 * Inflación acumulada: Π (1 + π_k) − 1
 * Quieto: Y% = 1 − 1/(1+Π_n), $X = M0·Y%
 * Instrumento renovado: M_n = M0·(1+TEM)^n
 *   real = M_n / (1+Π_n)
 *   W% = (1+TEM)^n / (1+Π_n) − 1
 * LECAP al vencimiento: M = M0·(1+TEA)^(días/365)
 * USD: TEM = (1+TNA/365)^30 − 1, U_n = U0·(1+TEM)^n
 */

export function tnaToTem(tna: number, dias: number): number {
  if (!Number.isFinite(tna) || !Number.isFinite(dias) || dias <= 0) {
    throw new Error("La TNA y los días tienen que ser números, y los días mayores a cero.");
  }
  return (1 + tna * (dias / 365)) ** (30 / dias) - 1;
}

export function teaToTem(tea: number): number {
  if (!Number.isFinite(tea)) {
    throw new Error("La TEA tiene que ser un número.");
  }
  return (1 + tea) ** (30 / 365) - 1;
}

export function mmTem(tna: number): number {
  if (!Number.isFinite(tna)) {
    throw new Error("La TNA tiene que ser un número.");
  }
  return (1 + tna / 365) ** 30 - 1;
}

export function temUsd(tna: number): number {
  return mmTem(tna);
}

/** Si faltan meses, se repite la última tasa conocida. */
export function tasasMensuales(pis: number[], n: number): number[] {
  if (!Number.isFinite(n) || n <= 0) return [];
  const source = (pis ?? []).filter((pi) => Number.isFinite(pi));
  const last = source.length ? source[source.length - 1]! : 0;
  const count = Math.floor(n);
  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(source[i] ?? last);
  return out;
}

export function inflacionAcumulada(pis: number[], n: number): number {
  return tasasMensuales(pis, n).reduce((acc, pi) => acc * (1 + pi), 1) - 1;
}

/**
 * Inflación hasta una fecha que no cae justo en un mes.
 * Los meses enteros se componen y el resto usa la tasa del mes siguiente
 * elevada a la fracción (días / 30).
 */
export function inflacionAcumuladaDias(pis: number[], dias: number): number {
  if (!Number.isFinite(dias) || dias <= 0) return 0;
  const meses = dias / 30;
  const full = Math.floor(meses);
  const frac = meses - full;
  const monthly = tasasMensuales(pis, full + (frac > 0 ? 1 : 0));
  let acc = 1;
  for (let i = 0; i < full; i++) acc *= 1 + (monthly[i] ?? 0);
  if (frac > 0) acc *= (1 + (monthly[full] ?? 0)) ** frac;
  return acc - 1;
}

export function perdidaPoderAdquisitivo(m0: number, pis: number[], n: number) {
  const inflacion = inflacionAcumulada(pis, n);
  const porcentaje = inflacion === -1 ? 0 : 1 - 1 / (1 + inflacion);
  return {
    inflacion,
    porcentaje,
    pesos: m0 * porcentaje,
  };
}

export type ResultadoReal = {
  nominal: number;
  real: number;
  pesos: number;
  porcentaje: number;
  inflacion: number;
};

export function proyectarNominal(m0: number, tem: number, n: number): number {
  return m0 * (1 + tem) ** n;
}

export function resultadoEnHorizonte(
  m0: number,
  tem: number,
  pis: number[],
  n: number,
): ResultadoReal {
  const inflacion = inflacionAcumulada(pis, n);
  const nominal = proyectarNominal(m0, tem, n);
  const real = inflacion === -1 ? nominal : nominal / (1 + inflacion);
  const porcentaje =
    inflacion === -1 ? 0 : (1 + tem) ** n / (1 + inflacion) - 1;
  return { nominal, real, pesos: real - m0, porcentaje, inflacion };
}

export function lecapAlVencimiento(
  m0: number,
  tea: number,
  diasRendimiento: number,
  pis: number[],
  diasInflacion: number,
): ResultadoReal {
  const inflacion = inflacionAcumuladaDias(pis, diasInflacion);
  const nominal =
    diasRendimiento > 0 ? m0 * (1 + tea) ** (diasRendimiento / 365) : m0;
  const real = inflacion === -1 ? nominal : nominal / (1 + inflacion);
  const porcentaje = m0 > 0 ? real / m0 - 1 : 0;
  return { nominal, real, pesos: real - m0, porcentaje, inflacion };
}

export function usdProyeccion(u0: number, tna: number, n: number) {
  const tem = temUsd(tna);
  const final = u0 * (1 + tem) ** n;
  return { tem, final, ganancia: final - u0 };
}
