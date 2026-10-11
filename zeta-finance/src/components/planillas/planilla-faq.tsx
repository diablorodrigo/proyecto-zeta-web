"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { PLANILLA_FAQ } from "@/lib/planillas";

export function PlanillaFaq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="mt-8 space-y-3">
      {PLANILLA_FAQ.map((item, index) => {
        const isOpen = open === index;
        return (
          <div
            key={item.q}
            className="rounded-xl border border-border bg-card px-5"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : index)}
            >
              <span className="font-semibold">{item.q}</span>
              {isOpen ? (
                <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>
            {isOpen ? (
              <p className="animate-fade-in pb-4 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
