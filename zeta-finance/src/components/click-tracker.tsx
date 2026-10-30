"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Rastreo delegado de clics clave (sin datos personales).
 * - data-track="Evento" + data-track-<prop>="valor" en cualquier enlace/botón.
 * - Si no hay data-track: enlaces de WhatsApp y "Agendar consulta" se detectan solos.
 */
export function ClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const el = target?.closest?.("a,button") as HTMLElement | null;
      if (!el) return;
      const ubicacion = window.location.pathname;

      const named = el.closest("[data-track]") as HTMLElement | null;
      if (named?.dataset.track) {
        const props: Record<string, string> = { ubicacion };
        for (const [k, v] of Object.entries(named.dataset)) {
          if (k.startsWith("track") && k !== "track" && v) {
            const prop = k.slice(5);
            props[prop.charAt(0).toLowerCase() + prop.slice(1)] = v;
          }
        }
        trackEvent(named.dataset.track, props);
        return;
      }

      const href = el instanceof HTMLAnchorElement ? el.href : "";
      if (/wa\.me|whatsapp\.com/i.test(href)) {
        trackEvent("WhatsApp Click", { ubicacion });
        return;
      }
      const text = (el.textContent ?? "").toLowerCase();
      if (text.includes("agendar")) {
        trackEvent("Agendar Consulta", { ubicacion });
      }
    }
    document.addEventListener("click", onClick, { capture: true });
    return () =>
      document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
