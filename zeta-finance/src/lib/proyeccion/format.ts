export function formatPesos(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatPct(decimal: number, digits = 1): string {
  return new Intl.NumberFormat("es-AR", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(decimal) ? decimal : 0);
}

export function formatPuntos(puntos: number, digits = 2): string {
  return `${new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(puntos)}%`;
}

export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "sin fecha";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function parseEntero(text: string): number | null {
  const digits = text.replace(/\D/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isFinite(value) ? value : null;
}

export function parseDecimal(text: string): number | null {
  const normalized = text.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function fraseContraInflacion(pesos: number, porcentaje: number): string {
  const plata = formatPesos(Math.abs(pesos));
  const pct = formatPct(Math.abs(porcentaje));
  if (porcentaje > 0.0000001) return `Le ganás a la inflación por ${plata} (${pct})`;
  if (porcentaje < -0.0000001) return `Le perdés a la inflación por ${plata} (${pct})`;
  return "Quedás empatado con la inflación";
}
