"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buttonVariants } from "@/components/ui/button";
import {
  CONTACT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const INTERESTS = [
  { id: "asesoria", label: "Asesoría financiera personal" },
  { id: "inversiones", label: "Inversiones y patrimonio" },
  { id: "no_se", label: "Todavía no lo sé" },
] as const;

export function ContactForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [interes, setInteres] =
    useState<(typeof INTERESTS)[number]["id"]>("asesoria");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (nombre.trim().length < 2) {
      setError("Ingresá tu nombre y apellido.");
      return;
    }
    if (!email.trim().includes("@")) {
      setError("Ingresá un email válido.");
      return;
    }

    start(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "contacto",
            nombre: nombre.trim(),
            email: email.trim(),
            telefono: telefono.trim(),
            interes,
            mensaje: mensaje.trim(),
          }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          message?: string;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setError(data.error ?? "No se pudo enviar el mensaje.");
          return;
        }
        setSuccess(
          data.message ??
            "Mensaje recibido. Te respondo a la brevedad.",
        );
        setNombre("");
        setEmail("");
        setTelefono("");
        setMensaje("");
      } catch {
        setError("Error de red. Probá de nuevo o escribinos por WhatsApp.");
      }
    });
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-5 sm:p-8"
      >
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Contacto
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cuéntame brevemente tu situación y qué te gustaría conseguir. La
          primera consulta es gratuita y sin compromiso.
        </p>

        <div className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="c-nombre">Nombre y apellido *</Label>
            <Input
              id="c-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-email">Email *</Label>
            <Input
              id="c-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-tel">Teléfono (opcional)</Label>
            <Input
              id="c-tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Me interesa</legend>
            {INTERESTS.map((option) => (
              <label
                key={option.id}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="interes"
                  value={option.id}
                  checked={interes === option.id}
                  onChange={() => setInteres(option.id)}
                  className="accent-[var(--primary)]"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          <div className="space-y-1.5">
            <Label htmlFor="c-msg">Cuéntame tu situación</Label>
            <Textarea
              id="c-msg"
              rows={5}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="mt-3 text-sm font-medium text-primary" role="status">
            {success}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="mt-6 bg-primary text-primary-foreground"
          size="lg"
        >
          {pending ? "Enviando…" : "Enviar mensaje"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Usaré tus datos únicamente para responderte. Nunca los comparto con
          terceros.
        </p>
      </form>

      <aside className="space-y-8">
        <div className="rounded-2xl border border-border bg-secondary/40 p-6">
          <h2 className="font-display text-xl font-bold">
            Prefiero escribir directamente
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Si te resulta más cómodo, hablamos por WhatsApp al{" "}
            <span className="font-semibold text-foreground">
              {WHATSAPP_DISPLAY}
            </span>
            .
          </p>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-5 bg-primary text-primary-foreground",
            )}
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </Link>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Otros datos
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            <li className="text-muted-foreground">Buenos Aires, Argentina</li>
            <li className="text-muted-foreground">
              Horario de respuesta: lunes a viernes, de 9 a 18 h.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
