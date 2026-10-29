export type Fuente = {
  /** De dónde salió el número: organismo, o "Respaldo". */
  fuente: string;
  fecha: string | null;
  respaldo: boolean;
  aConfirmar: boolean;
};

export type LecapVista = {
  ticker: string;
  nombre: string;
  tna: number;
  tea: number;
  tir: number;
  dias: number;
  diasHoy: number;
  vencimiento: string;
  maturity: string;
  precio: number | null;
  fuente: Fuente;
};

export type MarketSnapshot = {
  asOf: string;
  plazoFijo: { tna: number } & Fuente;
  moneyMarket: { tna: number; nombre: string; diasVentana: number | null } & Fuente;
  caucion: {
    tna: number;
    dias: number;
    byDays: Record<string, number>;
  } & Fuente;
  lecaps: LecapVista[];
  usd: { tna: number } & Fuente;
};
