"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContactBlock } from "@/components/proyeccion/contact-block";
import { Jargon } from "@/components/proyeccion/jargon";
import { ShareBar } from "@/components/proyeccion/share-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoneyInput, formatMiles } from "@/components/ui/money-input";
import { whatsappLink } from "@/lib/constants";
import {
  AVISO_SIMPLE,
  AVISO_SIN_COSTOS,
  DISCLAIMER,
  HORIZONTES,
  HORIZONTE_DEFAULT,
  INFLACION_REM,
  PORCENTAJE_QUIETO_DEFAULT,
  type HorizonteMeses,
} from "@/lib/proyeccion/config";
import { armarEscenario, type Fila, type Supuestos } from "@/lib/proyeccion/escenario";
import {
  formatFecha,
  formatPct,
  formatPesos,
  formatPuntos,
  formatUsd,
  fraseContraInflacion,
  parseDecimal,
  parseEntero,
} from "@/lib/proyeccion/format";
import { PROYECCION_RATES_PATH } from "@/lib/proyeccion/path";
import type { Fuente, MarketSnapshot } from "@/lib/rates/types";
import { snapshotDeRespaldo } from "@/lib/rates/snapshot";
import { cn } from "@/lib/utils";

const ResultsChart = dynamic(
  () => import("@/components/proyeccion/results-chart").then((mod) => mod.ResultsChart),
  { ssr: false, loading: () => <div className="h-72" /> },
);

const MESES_REM = INFLACION_REM.meses.map((mes) => mes.etiqueta);

function textosInflacionInicial() {
  const base = INFLACION_REM.meses.map((mes) =>
    String(Number((mes.tasa * 100).toFixed(2))),
  );
  const last = base[base.length - 1] ?? "1.7";
  while (base.length < 12) base.push(last);
  return base;
}

function mesesTexto(n: number) {
  return n === 1 ? "1 mes" : `${n} meses`;
}

function etiquetaFuente(fila: Pick<Fila, "fuente" | "fecha" | "respaldo" | "aConfirmar">) {
  const partes = [fila.fuente];
  if (fila.fecha) partes.push(formatFecha(fila.fecha));
  else if (fila.respaldo) partes.push("sin fecha de mercado");
  if (fila.respaldo && !/respaldo/i.test(partes.join(" "))) partes.push("respaldo");
  if (fila.aConfirmar && !/a confirmar/i.test(partes.join(" "))) partes.push("a confirmar");
  return partes.join(" · ");
}

function fuenteSiEdito(base: Fuente, editado: boolean): Fuente {
  if (!editado) return base;
  return {
    fuente: "Editado por vos",
    fecha: null,
    respaldo: false,
    aConfirmar: true,
  };
}

function puntos(text: string, fallback: number) {
  const parsed = parseDecimal(text);
  return parsed == null ? fallback : parsed;
}

export function ProyeccionApp() {
  const [ingresoText, setIngresoText] = useState("");
  const [montoText, setMontoText] = useState("");
  const [montoTocado, setMontoTocado] = useState(false);
  const [quiereUsd, setQuiereUsd] = useState(false);
  const [usdText, setUsdText] = useState("");
  const [meses, setMeses] = useState<HorizonteMeses>(HORIZONTE_DEFAULT);
  const [inflacionText, setInflacionText] = useState(textosInflacionInicial);
  const [snapshot, setSnapshot] = useState<MarketSnapshot | null>(null);
  const [ratesText, setRatesText] = useState({
    plazoFijo: "",
    moneyMarket: "",
    caucion: "",
    usd: "",
  });
  const [lecapText, setLecapText] = useState<Record<string, string>>({});
  const dirty = useRef({
    plazoFijo: false,
    moneyMarket: false,
    caucion: false,
    usd: false,
    lecap: {} as Record<string, boolean>,
  });

  useEffect(() => {
    let cancel = false;
    const respaldo = snapshotDeRespaldo(new Date());
    aplicar(respaldo);

    async function cargar() {
      try {
        const res = await fetch(PROYECCION_RATES_PATH);
        if (!res.ok) return;
        const data = (await res.json()) as { mercado?: MarketSnapshot };
        if (!cancel && data.mercado?.plazoFijo && data.mercado.moneyMarket) {
          aplicar(data.mercado);
        }
      } catch {
        // Queda el respaldo ya mostrado.
      }
    }

    function aplicar(next: MarketSnapshot) {
      setSnapshot(next);
      setRatesText((current) => ({
        plazoFijo: dirty.current.plazoFijo ? current.plazoFijo : String(next.plazoFijo.tna),
        moneyMarket: dirty.current.moneyMarket
          ? current.moneyMarket
          : String(next.moneyMarket.tna),
        caucion: dirty.current.caucion ? current.caucion : String(next.caucion.tna),
        usd: dirty.current.usd ? current.usd : String(next.usd.tna),
      }));
      setLecapText((current) => {
        const copy = { ...current };
        for (const letter of next.lecaps) {
          if (!dirty.current.lecap[letter.ticker]) copy[letter.ticker] = String(letter.tea);
        }
        return copy;
      });
    }

    void cargar();
    return () => {
      cancel = true;
    };
  }, []);

  const ingreso = parseEntero(ingresoText);
  const monto = parseEntero(montoText);
  const usd = quiereUsd ? parseEntero(usdText) ?? 0 : 0;

  function onIngreso(value: string) {
    setIngresoText(value);
    if (!montoTocado) {
      const neto = parseEntero(value);
      setMontoText(neto == null ? "" : formatMiles(String(Math.round(neto * PORCENTAJE_QUIETO_DEFAULT))));
    }
  }

  const supuestos = useMemo<Supuestos | null>(() => {
    if (!snapshot) return null;
    const inflacion = inflacionText.map((text) => {
      const parsed = parseDecimal(text);
      const last = INFLACION_REM.meses[INFLACION_REM.meses.length - 1]?.tasa ?? 0.017;
      return parsed == null ? last : parsed / 100;
    });
    const baseLecaps = snapshot.lecaps.map((letter) => {
      const teaPuntos = puntos(lecapText[letter.ticker] ?? "", letter.tea);
      const editado = Math.abs(teaPuntos - letter.tea) > 0.001;
      return {
        ...letter,
        tna: letter.tna / 100,
        tir: (editado ? teaPuntos : letter.tir) / 100,
        tea: teaPuntos / 100,
        fuente: fuenteSiEdito(letter.fuente, editado),
      };
    });
    const plazoFijoPuntos = puntos(ratesText.plazoFijo, snapshot.plazoFijo.tna);
    const moneyPuntos = puntos(ratesText.moneyMarket, snapshot.moneyMarket.tna);
    const caucionPuntos = puntos(ratesText.caucion, snapshot.caucion.tna);
    const usdPuntos = puntos(ratesText.usd, snapshot.usd.tna);
    return {
      inflacion,
      plazoFijoTna: plazoFijoPuntos / 100,
      plazoFijoFuente: fuenteSiEdito(
        snapshot.plazoFijo,
        Math.abs(plazoFijoPuntos - snapshot.plazoFijo.tna) > 0.001,
      ),
      moneyMarketTna: moneyPuntos / 100,
      moneyMarketNombre: snapshot.moneyMarket.nombre,
      moneyMarketFuente: fuenteSiEdito(
        snapshot.moneyMarket,
        Math.abs(moneyPuntos - snapshot.moneyMarket.tna) > 0.001,
      ),
      caucionTna: caucionPuntos / 100,
      caucionDias: snapshot.caucion.dias,
      caucionFuente: fuenteSiEdito(
        snapshot.caucion,
        Math.abs(caucionPuntos - snapshot.caucion.tna) > 0.001,
      ),
      usdTna: usdPuntos / 100,
      usdFuente: fuenteSiEdito(
        snapshot.usd,
        Math.abs(usdPuntos - snapshot.usd.tna) > 0.001,
      ),
      lecaps: baseLecaps,
    };
  }, [snapshot, inflacionText, ratesText, lecapText]);

  const escenario =
    supuestos && monto != null && monto > 0
      ? armarEscenario({ monto, usd, meses, supuestos })
      : null;

  const mensaje = escenario
    ? [
        "Hola, vi en Zeta Finance cuánto pierde la plata quieta y quiero verlo con mis números.",
        ingreso != null ? `Ingreso mensual neto: ${formatPesos(ingreso)}.` : null,
        `Plata quieta: ${formatPesos(escenario.monto)} durante ${mesesTexto(escenario.meses)}.`,
        `Si la dejo quieta, pierde ${formatPesos(escenario.perdida.pesos)} (${formatPct(escenario.perdida.porcentaje)}) de poder adquisitivo.`,
        escenario.mejor
          ? `La opción que más le gana a la inflación en esta cuenta es ${escenario.mejor.nombre} (${escenario.mejor.periodo}): ${formatPct(escenario.mejor.porcentaje)}.`
          : null,
        usd > 0 ? `Dólares quietos: ${formatUsd(usd)}.` : null,
        "No incluye impuestos ni comisiones.",
      ]
        .filter(Boolean)
        .join("\n")
    : "Hola, quiero ver cuánto pierde la plata quieta con mis números.";

  const lead = {
    ingreso: ingreso ?? 0,
    montoQuieto: monto ?? 0,
    usd,
    horizonteMeses: meses,
    mejorOpcion: escenario?.mejor
      ? `${escenario.mejor.nombre} (${escenario.mejor.periodo})`
      : "Sin monto cargado",
    supuestos: supuestos
      ? {
          inflacionMensual: supuestos.inflacion,
          plazoFijoTna: supuestos.plazoFijoTna * 100,
          moneyMarketTna: supuestos.moneyMarketTna * 100,
          caucionTna: supuestos.caucionTna * 100,
          usdTna: supuestos.usdTna * 100,
          lecaps: supuestos.lecaps.map((letter) => ({
            ticker: letter.ticker,
            tea: letter.tea * 100,
            dias: letter.diasHoy,
          })),
        }
      : undefined,
    mensaje,
  };

  return (
    <div className="bg-white text-foreground">
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-sm font-semibold text-primary">Para el público general</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl">
            ¿Cuánto pierde tu plata quieta?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Tu sueldo pierde valor cada mes que queda quieto. Mirá cuánto en un
            minuto, con datos públicos y sin registrarte.
          </p>
          <div className="mt-8">
            <ShareBar />
          </div>
        </div>
      </section>

      <section className="border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Tus números</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Lo que cargues queda en esta pantalla. No lo guardamos, salvo que al
            final pidas que te contactemos.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ingreso">Ingreso mensual neto</Label>
              <MoneyInput
                id="ingreso"
                aria-label="Ingreso mensual neto, en pesos"
                placeholder="Ej. 1.500.000"
                value={ingresoText}
                onValueChange={(value) => onIngreso(value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quieto">Monto que queda quieto</Label>
              <MoneyInput
                id="quieto"
                aria-label="Monto que queda quieto, en pesos"
                placeholder="El 30% del ingreso"
                value={montoText}
                onValueChange={(value) => {
                  setMontoTocado(true);
                  setMontoText(value);
                }}
              />
              <p className="text-xs text-muted-foreground">
                Arranca en el 30% de tu ingreso. Cambialo si querés.
              </p>
            </div>
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={quiereUsd}
              onChange={(event) => setQuiereUsd(event.target.checked)}
              className="accent-[var(--primary)]"
            />
            Tengo dólares quietos
          </label>
          {quiereUsd ? (
            <div className="mt-3 max-w-sm space-y-1.5">
              <Label htmlFor="usd">Dólares quietos</Label>
              <MoneyInput
                id="usd"
                prefix="US$"
                aria-label="Dólares quietos, en dólares"
                placeholder="Ej. 1.000"
                value={usdText}
                onValueChange={(value) => setUsdText(value)}
              />
            </div>
          ) : null}

          <fieldset className="mt-6">
            <legend className="text-sm font-medium">¿Por cuántos meses?</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {HORIZONTES.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  aria-pressed={meses === opcion}
                  onClick={() => setMeses(opcion)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium",
                    meses === opcion
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-white text-foreground",
                  )}
                >
                  {mesesTexto(opcion)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="border-b border-border/70 bg-[#fbfaf6]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          {escenario ? (
            <Resultados escenario={escenario} />
          ) : (
            <p className="text-muted-foreground">
              Cargá el monto que te queda quieto y aparece el resultado.
            </p>
          )}
          <Supuestos
            snapshot={snapshot}
            meses={meses}
            inflacionText={inflacionText}
            onInflacion={(index, value) =>
              setInflacionText((current) =>
                current.map((item, i) => (i === index ? value : item)),
              )
            }
            ratesText={ratesText}
            onRate={(key, value) => {
              dirty.current[key] = true;
              setRatesText((current) => ({ ...current, [key]: value }));
            }}
            lecapText={lecapText}
            onLecap={(ticker, value) => {
              dirty.current.lecap[ticker] = true;
              setLecapText((current) => ({ ...current, [ticker]: value }));
            }}
          />
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            {AVISO_SIN_COSTOS}
          </p>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold">Aviso</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{DISCLAIMER}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{AVISO_SIMPLE}</p>
        </div>
      </section>

      <ContactBlock whatsappHref={whatsappLink(mensaje)} lead={lead} />
    </div>
  );
}

function Resultados({
  escenario,
}: {
  escenario: ReturnType<typeof armarEscenario>;
}) {
  const chart = escenario.filas.map((fila) => ({
    nombre:
      fila.id === "cuenta"
        ? "Cuenta"
        : fila.id === "plazo-fijo"
          ? "Plazo fijo"
          : fila.id === "money-market"
            ? "Fondo"
            : "Caución",
    real: Math.round(fila.real),
    negativo: fila.porcentaje < 0,
  }));

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        <div className="rounded-3xl bg-[#1e3a34] px-6 py-8 text-white sm:px-8">
          <p className="text-sm font-medium text-white/80">Si la dejás en la cuenta</p>
          <p className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
            Si lo dejás quieto {mesesTexto(escenario.meses)} perdés{" "}
            {formatPesos(escenario.perdida.pesos)} ({formatPct(escenario.perdida.porcentaje)})
            de poder adquisitivo
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">
            Es plata de hoy: con la misma cantidad, después de {mesesTexto(escenario.meses)}{" "}
            comprás menos. La inflación usada está en los supuestos, marcada a confirmar.
          </p>
        </div>
        <div className="rounded-3xl border border-border bg-white p-4 sm:p-6">
          <p className="text-sm font-medium">
            Cuánta plata de hoy te queda en {mesesTexto(escenario.meses)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mismos meses para la cuenta, el plazo fijo, el money market y la caución.
          </p>
          <ResultsChart data={chart} />
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        <Jargon term="TNA" /> · <Jargon term="TEA" /> · <Jargon term="money market" /> ·{" "}
        <Jargon term="caución" /> · <Jargon term="poder adquisitivo" />
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {escenario.filas.map((fila) => (
          <FilaCard key={fila.id} fila={fila} />
        ))}
      </div>

      <div className="mt-10">
        <h3 className="font-display text-2xl font-bold">
          <Jargon term="LECAP" /> hasta que vencen
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Cada letra se proyecta hasta su propio vencimiento, con su <Jargon term="TEA" />{" "}
          (que en este caso es la <Jargon term="TIR" />). No se vende antes y no se le
          resta un costo de salida. Por eso el plazo no es el de los {mesesTexto(escenario.meses)}{" "}
          que elegiste arriba.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {escenario.lecaps.length ? (
            escenario.lecaps.map((fila) => <FilaCard key={fila.id} fila={fila} />)
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay letras vigentes en el respaldo de hoy.
            </p>
          )}
        </div>
      </div>

      {escenario.usd ? (
        <div className="mt-10 rounded-3xl border border-border bg-white p-6">
          <h3 className="font-display text-2xl font-bold">Dólares en {mesesTexto(escenario.meses)}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No pasamos esto a pesos: no proyectamos el tipo de cambio.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary/50 p-4">
              <p className="text-sm font-medium">Colchón</p>
              <p className="mt-2 font-display text-2xl font-bold">
                {formatUsd(escenario.usd.colchon)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Siguen siendo los mismos dólares. No ganan interés.
              </p>
            </div>
            <div className="rounded-2xl bg-secondary/50 p-4">
              <p className="text-sm font-medium">Fondo en dólares</p>
              <p className="mt-2 font-display text-2xl font-bold">
                {formatUsd(escenario.usd.fondo)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ganancia: {formatUsd(escenario.usd.gananciaFondo)}. Tasa fija, a confirmar.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilaCard({ fila }: { fila: Fila }) {
  const gana = fila.porcentaje >= 0;
  return (
    <article className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{fila.nombre}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{fila.detalle}</p>
        </div>
        <p className={cn("text-sm font-semibold", gana ? "text-primary" : "text-destructive")}>
          {formatPct(fila.porcentaje)}
        </p>
      </div>
      <p className="mt-4 text-sm">{fraseContraInflacion(fila.pesos, fila.porcentaje)}</p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Tasa</dt>
          <dd className="font-medium">
            {fila.tna != null && fila.id !== "cuenta" ? (
              <>
                <Jargon term="TNA" /> {formatPuntos(fila.tna * 100)}
              </>
            ) : (
              "Sin interés"
            )}
            {fila.tea != null ? (
              <>
                {" "}
                · <Jargon term="TEA" /> {formatPuntos(fila.tea * 100)}
              </>
            ) : null}
            {fila.tem != null && fila.id !== "cuenta" ? (
              <span className="block text-xs text-muted-foreground">
                Equivale a {formatPct(fila.tem, 2)} por mes
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Resultado nominal</dt>
          <dd className="font-medium">{formatPesos(fila.nominal)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">En pesos de hoy</dt>
          <dd className="font-medium">{formatPesos(fila.real)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Liquidez</dt>
          <dd>{fila.liquidez}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">
        {fila.periodo} · {etiquetaFuente(fila)}
      </p>
    </article>
  );
}

function Supuestos({
  snapshot,
  meses,
  inflacionText,
  onInflacion,
  ratesText,
  onRate,
  lecapText,
  onLecap,
}: {
  snapshot: MarketSnapshot | null;
  meses: HorizonteMeses;
  inflacionText: string[];
  onInflacion: (index: number, value: string) => void;
  ratesText: { plazoFijo: string; moneyMarket: string; caucion: string; usd: string };
  onRate: (key: "plazoFijo" | "moneyMarket" | "caucion" | "usd", value: string) => void;
  lecapText: Record<string, string>;
  onLecap: (ticker: string, value: string) => void;
}) {
  return (
    <div className="mt-10 rounded-3xl border border-border bg-white p-5 sm:p-6">
      <h3 className="font-display text-2xl font-bold">Supuestos, a confirmar</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Podés cambiarlos. La inflación es la mediana del {INFLACION_REM.fuente}, relevada{" "}
        {INFLACION_REM.relevamiento} y publicada el {formatFecha(INFLACION_REM.fecha)}. Si el
        horizonte pide más meses que los publicados, se repite el último. El fondo en
        dólares usa una tasa fija del 5% hasta que haya una fuente viva.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {inflacionText.slice(0, Math.max(meses, INFLACION_REM.meses.length)).map((value, index) => (
          <label key={MESES_REM[index] ?? `mes-${index}`} className="space-y-1 text-xs">
            <span className="font-medium text-foreground">
              {MESES_REM[index] ?? `Mes ${index + 1}`}
              {index >= INFLACION_REM.meses.length ? " · repite" : ""}
            </span>
            <Input
              inputMode="decimal"
              value={value}
              aria-label={`Inflación ${MESES_REM[index] ?? index + 1}`}
              onChange={(event) => onInflacion(index, event.target.value)}
            />
            <span className="text-muted-foreground">% del mes · a confirmar</span>
          </label>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <RateField
          id="tna-pf"
          label="Plazo fijo, TNA %"
          help={snapshot ? etiquetaFuente(snapshot.plazoFijo) : "Buscando la tasa…"}
          value={ratesText.plazoFijo}
          onChange={(value) => onRate("plazoFijo", value)}
        />
        <RateField
          id="tna-mm"
          label="Money market, TNA %"
          help={snapshot ? etiquetaFuente(snapshot.moneyMarket) : "Buscando la tasa…"}
          value={ratesText.moneyMarket}
          onChange={(value) => onRate("moneyMarket", value)}
        />
        <RateField
          id="tna-cau"
          label="Caución a 7 días, TNA %"
          help={snapshot ? etiquetaFuente(snapshot.caucion) : "Buscando la tasa…"}
          value={ratesText.caucion}
          onChange={(value) => onRate("caucion", value)}
        />
        <RateField
          id="tna-usd"
          label="Fondo en dólares, TNA %"
          help={snapshot ? etiquetaFuente(snapshot.usd) : "Tasa fija, a confirmar"}
          value={ratesText.usd}
          onChange={(value) => onRate("usd", value)}
        />
      </div>

      {snapshot && snapshot.lecaps.length > 0 ? (
        <div className="mt-6">
          <p className="text-sm font-medium">TEA de cada letra, en %</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {snapshot.lecaps.map((letter) => (
              <label key={letter.ticker} className="space-y-1 text-xs">
                <span className="font-medium text-foreground">{letter.ticker}</span>
                <Input
                  inputMode="decimal"
                  value={lecapText[letter.ticker] ?? ""}
                  aria-label={`TEA ${letter.ticker}`}
                  onChange={(event) => onLecap(letter.ticker, event.target.value)}
                />
                <span className="text-muted-foreground">{etiquetaFuente(letter.fuente)}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RateField({
  id,
  label,
  help,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="text-xs text-muted-foreground">{help}</p>
    </div>
  );
}
