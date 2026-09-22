"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  INSTRUMENTS,
  RISK_PROFILES,
  emptyAllocation,
  scoreAllocation,
  type InstrumentId,
  type RiskProfileId,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type Contact = {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
};

const emptyContact: Contact = {
  nombre: "",
  apellido: "",
  correo: "",
  telefono: "",
};

export function RiskSimulator() {
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [profile, setProfile] = useState<RiskProfileId | null>(null);
  const [allocation, setAllocation] = useState(emptyAllocation());
  const [evaluated, setEvaluated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const contactReady =
    contact.nombre.trim().length > 0 &&
    contact.apellido.trim().length > 0 &&
    contact.correo.includes("@") &&
    contact.telefono.trim().length >= 6;

  const assigned = useMemo(
    () => Object.values(allocation).reduce((a, b) => a + b, 0),
    [allocation],
  );
  const remaining = 100 - assigned;

  const result = profile ? scoreAllocation(profile, allocation) : null;

  function setInstrument(id: InstrumentId, value: number) {
    setAllocation((prev) => {
      const others = Object.entries(prev).reduce(
        (acc, [key, val]) => (key === id ? acc : acc + val),
        0,
      );
      return {
        ...prev,
        [id]: Math.max(0, Math.min(value, 100 - others)),
      };
    });
    setEvaluated(false);
    setSuccess(null);
  }

  function onEvaluate() {
    setError(null);
    setSuccess(null);
    if (!profile || assigned !== 100 || !contactReady || !result) {
      setError(
        assigned !== 100
          ? "Asigná el 100% del capital para ver el resultado."
          : "Completá tus datos y elegí un perfil.",
      );
      return;
    }

    start(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "simulacion",
            nombre: contact.nombre.trim(),
            apellido: contact.apellido.trim(),
            email: contact.correo.trim(),
            telefono: contact.telefono.trim(),
            perfil: profile,
            asignacion: allocation,
            puntaje: result.puntaje,
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          message?: string;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setError(data.error ?? "No pudimos guardar tu simulación.");
          return;
        }
        setEvaluated(true);
        setSuccess(
          data.message ?? "Simulación guardada. Revisá tu resultado abajo.",
        );
      } catch {
        setError("Error de red. Intentá de nuevo.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-14 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Simulador de carteras
        </h1>
        <p className="mt-4 text-muted-foreground">
          Elegí tu perfil de riesgo, distribuí el 100% de tu capital entre los
          instrumentos y recibí una evaluación de qué tan alineada está tu
          cartera con ese perfil.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold">Tus datos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Los necesito para enviarte el detalle de tu resultado.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["nombre", "Nombre"],
              ["apellido", "Apellido"],
              ["correo", "Correo"],
              ["telefono", "Teléfono"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label htmlFor={`sim-${key}`}>{label}</Label>
              <Input
                id={`sim-${key}`}
                type={key === "correo" ? "email" : "text"}
                value={contact[key]}
                onChange={(e) => {
                  setContact((c) => ({ ...c, [key]: e.target.value }));
                  setEvaluated(false);
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-xl font-bold">Perfil de riesgo</h2>
        {!contactReady ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Completá nombre, apellido, correo y teléfono para elegir tu perfil.
          </p>
        ) : null}
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {RISK_PROFILES.map((item) => {
            const active = profile === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={!contactReady}
                onClick={() => {
                  setProfile(item.id);
                  setEvaluated(false);
                  setSuccess(null);
                }}
                className={cn(
                  "rounded-2xl border p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                  active
                    ? "border-primary bg-accent/60 ring-2 ring-primary/30"
                    : "border-border bg-background hover:border-primary/40",
                )}
              >
                <p className="font-display text-lg font-bold">{item.nombre}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.descripcion}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Rend. ref.</dt>
                    <dd className="font-semibold">{item.rendimiento}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Volatilidad</dt>
                    <dd className="font-semibold">{item.volatilidad}</dd>
                  </div>
                </dl>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Los rendimientos mostrados son referencias históricas de ejemplo.
          Esta simulación es educativa y no constituye una recomendación de
          inversión personalizada.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">Armá tu cartera</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile
                ? `Asignado: ${assigned}% · te quedan ${remaining}% por asignar`
                : "Elegí un perfil"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {INSTRUMENTS.map((inst) => {
            const value = allocation[inst.id];
            return (
              <div key={inst.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-bold text-primary">
                      {inst.sigla}
                    </span>
                    <span className="text-sm font-medium">{inst.nombre}</span>
                  </div>
                  <span className="tabular-nums text-sm font-semibold">
                    {value}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={value}
                  disabled={!profile}
                  onChange={(e) =>
                    setInstrument(inst.id, Number(e.target.value))
                  }
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--primary) ${value}%, transparent ${value}%)`,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-foreground p-5 text-background">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Alineación con tu perfil
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-4xl leading-none">
                {evaluated && result ? `${result.puntaje}%` : "--"}
              </span>
              <span className="pb-1 text-sm opacity-80">
                {evaluated && result ? result.etiqueta : "Sin evaluar"}
              </span>
            </div>
          </div>
          <Button
            type="button"
            onClick={onEvaluate}
            disabled={!profile || assigned !== 100 || !contactReady || pending}
            className="bg-background text-foreground hover:bg-background/90"
          >
            {pending ? "Guardando…" : "Ver resultado"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-3 text-sm font-medium text-primary" role="status">
            {success}
          </p>
        ) : null}

        {evaluated && result ? (
          <div className="mt-6 animate-fade-in rounded-xl border border-border bg-secondary/40 p-5">
            <h3 className="font-display text-lg font-bold sm:text-xl">
              {result.titulo}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.detalle}
            </p>
            <p className="mt-3 text-sm">
              Diversificación aproximada:{" "}
              <strong>{result.diversificacion}%</strong> de los instrumentos con
              peso.
            </p>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              {result.desvios.map((d) => (
                <li key={d.activo.id}>
                  {d.activo.nombre}:{" "}
                  <span className="font-medium text-foreground">
                    {d.diferencia >= 0 ? "+" : ""}
                    {d.diferencia}%
                  </span>{" "}
                  vs referencia
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  );
}
