"use client";

import { useEffect, useId, useState } from "react";
import { JERGA } from "@/lib/proyeccion/config";

export function Jargon({
  term,
}: {
  term: keyof typeof JERGA;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="underline decoration-dotted underline-offset-4"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {term}
      </button>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className="absolute left-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-white p-3 text-left text-sm font-normal normal-case leading-relaxed text-foreground shadow-lg"
        >
          {JERGA[term]}
        </span>
      ) : null}
    </span>
  );
}
