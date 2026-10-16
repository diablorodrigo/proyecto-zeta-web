"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Guia } from "@/lib/guias";
import { whatsappLink } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GuideForm({ guia }: { guia: Guia }) {
  const [nombreListo, setNombreListo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, start] = useTransition();

  function openPdf() {
    const link = document.createElement("a");
    link.href = guia.archivo;
    link.download = guia.archivoNombre;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const data = new FormData(e.currentTarget);
    const nombreLimpio = String(data.get("nombre") ?? "").trim();
    const emailLimpio = String(data.get("email") ?? "").trim().toLowerCase();

    if (nombreLimpio.length < 2) {
      setError("Ingresá tu nombre y apellido.");
      return;
    }
    if (!EMAIL_RE.test(emailLimpio)) {
      setError("Ingresá un email válido.");
      return;
    }

    start(async () => {
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "guia",
            nombre: nombreLimpio,
            email: emailLimpio,
            profesion: guia.slug,
          }),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setError(
            data.error ??
              "No pudimos registrar tus datos. Probá de nuevo en unos minutos.",
          );
          return;
        }
        setNombreListo(nombreLimpio);
        setReady(true);
        openPdf();
      } catch {
        setError("Error de red. Probá de nuevo en unos minutos.");
      }
    });
  }

  if (ready) {
    return (
      <div
        className="rounded-2xl border border-border bg-card p-5 sm:p-8"
        role="status"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Guía lista
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
          Listo{nombreListo ? `, ${nombreListo.split(" ")[0]}` : ""}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {guia.titulo} ya está disponible. Si el PDF no se abrió solo, tocá el
          botón.
        </p>
        <a
          href={guia.archivo}
          download={guia.archivoNombre}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          <Download className="h-4 w-4" />
          Abrir la guía en PDF
        </a>
        <p className="mt-4 text-sm text-muted-foreground">
          Si querés verla con tu situación,{" "}
          <a
            href={whatsappLink(
              `Hola, me llevé la guía «${guia.titulo}» y quiero una consulta.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            escribinos por WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      method="post"
      action={`/guias/${guia.slug}`}
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-card p-5 sm:p-8"
      noValidate
    >
      <h2 className="font-display text-2xl font-bold tracking-tight">
        Dejá tus datos y abrí el PDF
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Dejá tu nombre y tu email para abrir el PDF. Queda registrado quién se
        lo llevó.
      </p>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="guia-nombre">Nombre y apellido</Label>
          <Input
            id="guia-nombre"
            name="nombre"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guia-email">Email</Label>
          <Input
            id="guia-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={160}
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-6 bg-primary text-primary-foreground"
        size="lg"
      >
        {pending ? "Enviando…" : "Recibir la guía"}
      </Button>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Tu nombre y tu email quedan en Zeta Finance. Los uso para esta guía y,
        si tiene sentido, para escribirte. No los vendo ni los paso a listas de
        publicidad.
      </p>
    </form>
  );
}
