"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HomeFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="reveal border-b border-border/70 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Dudas
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = open === index;
            return (
              <div
                key={item.q}
                className={cn(
                  "rounded-2xl border bg-card px-5 transition-colors",
                  isOpen ? "border-primary/25 shadow-[0_14px_32px_-28px_rgba(30,58,52,0.7)]" : "border-border",
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="font-semibold">{item.q}</span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                </button>
                {isOpen ? (
                  <p className="motion-safe:animate-fade-in pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
