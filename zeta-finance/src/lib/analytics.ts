"use client";

import { track } from "@vercel/analytics";

type Props = Record<string, string>;

/** Envía un evento sin datos personales. Nunca debe fallar ni bloquear la UI. */
export function trackEvent(name: string, props?: Props) {
  try {
    track(name, props);
  } catch {
    /* analítica opcional */
  }
}

/** Evento que se envía una sola vez por sesión del navegador. */
export function trackOncePerSession(name: string, props?: Props) {
  try {
    const key = `zf-ev-${name}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* sin sessionStorage: igual enviamos */
  }
  trackEvent(name, props);
}
