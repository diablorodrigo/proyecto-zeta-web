"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Deja solo los dígitos de la parte entera (descarta decimales tras una coma, "$", espacios). */
export function digitosMonto(text: string): string {
  let t = text.trim();
  // "1.500.000,50" o "1500000,5": lo que va después de la coma son centavos.
  const coma = t.lastIndexOf(",");
  if (coma >= 0 && t.length - coma - 1 <= 2) t = t.slice(0, coma);
  return t.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
}

/** Formato es-AR con punto de miles: "1000000" -> "1.000.000". */
export function formatMiles(digits: string): string {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

type MoneyInputProps = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  value: string;
  onValueChange: (formatted: string, numero: number | null) => void;
  /** Prefijo visible: "$" o "US$". */
  prefix?: string;
};

export function MoneyInput({ value, onValueChange, prefix = "$", className, ...props }: MoneyInputProps) {
  const ref = React.useRef<HTMLInputElement>(null);
  const caretDigits = React.useRef<number | null>(null);
  const shown = formatMiles(digitosMonto(value));

  React.useLayoutEffect(() => {
    const el = ref.current;
    const n = caretDigits.current;
    if (!el || n == null || document.activeElement !== el) return;
    caretDigits.current = null;
    let pos = 0;
    let seen = 0;
    while (pos < el.value.length && seen < n) {
      if (/\d/.test(el.value[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
  });

  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-base text-muted-foreground md:text-sm"
      >
        {prefix}
      </span>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        data-slot="input"
        className={cn(
          "h-10 w-full min-w-0 rounded-lg border border-input bg-white py-2 pr-3 text-base tabular-nums transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm",
          prefix.length > 1 ? "pl-12" : "pl-7",
          className,
        )}
        value={shown}
        onChange={(event) => {
          const el = event.target;
          const caret = el.selectionStart ?? el.value.length;
          const raw = el.value;
          const digits = digitosMonto(raw);
          // dígitos a la izquierda del cursor (sin contar ceros iniciales descartados)
          const left = raw.slice(0, caret).replace(/\D/g, "").length - (raw.replace(/\D/g, "").length - digits.length);
          caretDigits.current = Math.max(0, left);
          const formatted = formatMiles(digits);
          onValueChange(formatted, digits ? Number(digits) : null);
        }}
        {...props}
      />
    </div>
  );
}
