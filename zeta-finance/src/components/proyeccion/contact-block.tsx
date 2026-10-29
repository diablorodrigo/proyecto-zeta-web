"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WHATSAPP_DISPLAY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ContactBlock({
  whatsappHref,
  lead,
}: {
  whatsappHref: string;
  lead: Record<string, unknown>;
}) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (nombre.trim().length < 2) {
      setError("Ingresá tu nombre.");
      return;
    }
    if (telefono.trim().length < 6) {
      setError("Ingresá un teléfono.");
      return;
    }
    if (email.trim() && !email.includes("@")) {
      setError("El email no parece válido.");
      return;
    }

    start(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...lead,
            tipo: "proyeccion",
            nombre: nombre.trim(),
            telefono: telefono.trim(),
            email: email.trim(),
          }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          message?: string;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setError(data.error ?? "No se pudo enviar. Probá de nuevo o escribinos por WhatsApp.");
          return;
        }
        setSuccess(data.message ?? "Listo. Te escribimos a la brevedad.");
        setNombre("");
        setTelefono("");
        setEmail("");
      } catch {
        setError("Error de red. Probá de nuevo o escribinos por WhatsApp.");
      }
    });
  }

  return (
    <section id="contacto" className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold text-primary">Contacto</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Quiero que lo veamos con mis números
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hasta acá no guardamos lo que escribiste. Si nos dejás tus datos,
            te contactamos con este resultado. También podés escribir directo.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 bg-[#128C7E] text-white hover:bg-[#0f7a6e]",
            )}
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            El mensaje ya viene con el resultado de esta pantalla.
          </p>
          <p className="mt-6 text-sm">
            <Link href="/servicios" className="font-medium text-primary hover:underline">
              Ver los servicios de asesoría
            </Link>
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-white p-5 sm:p-8"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="p-nombre">Nombre *</Label>
              <Input
                id="p-nombre"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-tel">Teléfono *</Label>
              <Input
                id="p-tel"
                value={telefono}
                onChange={(event) => setTelefono(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">Email (opcional)</Label>
              <Input
                id="p-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
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
            {pending ? "Enviando…" : "Pedir que me contacten"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Usamos estos datos solo para responderte.
          </p>
        </form>
      </div>
    </section>
  );
}
