"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

const ALT =
  "Toro de bronce de Wall Street entre rascacielos, con cielo dorado y verde";

/**
 * Portada cinemática: fondo (foto completa) → titular → toro recortado → CTAs.
 * Variables CSS: --px/--py (mouse, -0.5..0.5) y --p (progreso de scroll 0..1).
 */
export function HeroStage({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const range = Math.max(1, r.height - window.innerHeight);
        const p = Math.min(1, Math.max(0, -r.top / range));
        el.style.setProperty("--p", p.toFixed(4));
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      apply();
    };
    const onLeave = () => {
      px = 0;
      py = 0;
      apply();
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const common = { fill: true, priority: true } as const;
  const bgMobile = getImageProps({ ...common, alt: ALT, src: "/assets/hero-toro-hd-movil.webp", sizes: "100vw" }).props.srcSet;
  const bg = getImageProps({ ...common, alt: ALT, src: "/assets/hero-toro-hd.webp", sizes: "100vw" }).props;
  const cutMobile = getImageProps({ ...common, alt: "", src: "/assets/hero-toro-hd-recorte-movil.webp", sizes: "100vw" }).props.srcSet;
  const cut = getImageProps({ ...common, alt: "", src: "/assets/hero-toro-hd-recorte.webp", sizes: "100vw" }).props;

  return (
    <section ref={ref} className="hero-cine relative -mt-[65px] bg-[#0d1512]">
      <div className="hero-cine-stage sticky top-0 h-[100svh] overflow-hidden">
        {/* Capa 1: fondo */}
        <div className="hero-layer hero-layer-bg absolute inset-0">
          <div className="hero-zoom absolute inset-0">
            <picture>
              <source media="(max-width: 767px)" srcSet={bgMobile} sizes="100vw" />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- alt viene en props */}
              <img {...bg} className="hero-img h-full w-full object-cover" />
            </picture>
          </div>
        </div>
        <div className="hero-shade pointer-events-none absolute inset-0" aria-hidden />

        {/* Capa 2: titular (pasa detrás del toro) */}
        <div className="hero-title-layer pointer-events-none absolute inset-x-0 z-10">
          {title}
        </div>

        {/* Capa 3: toro recortado */}
        <div className="hero-layer hero-layer-bull pointer-events-none absolute inset-0 z-20" aria-hidden>
          <div className="hero-zoom absolute inset-0">
            <picture>
              <source media="(max-width: 767px)" srcSet={cutMobile} sizes="100vw" />
              {/* eslint-disable-next-line jsx-a11y/alt-text -- decorativa */}
              <img {...cut} className="hero-img h-full w-full object-cover" />
            </picture>
          </div>
        </div>
        <div className="hero-floor pointer-events-none absolute inset-0 z-20" aria-hidden />

        {/* Capa 4: contenido interactivo */}
        <div className="hero-ui absolute inset-x-0 bottom-0 z-30">{children}</div>
        <div className="hero-fade-out pointer-events-none absolute inset-0 z-40" aria-hidden />
      </div>
    </section>
  );
}
