"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";
import { cn } from "@/lib/utils";

function pageUrl() {
  return `${window.location.origin}${PROYECCION_PATH}`;
}

export function ShareBar() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(pageUrl());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function shareWhatsapp() {
    const text = `Mirá cuánto pierde la plata quieta por la inflación: ${pageUrl()}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={copy}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        {copied ? "Link copiado" : "Copiar link"}
      </button>
      <button
        type="button"
        onClick={shareWhatsapp}
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        Compartir por WhatsApp
      </button>
    </div>
  );
}
