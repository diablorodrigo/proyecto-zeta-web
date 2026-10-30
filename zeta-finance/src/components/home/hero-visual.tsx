"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef } from "react";

const ALT =
  "Toro de bronce de Wall Street entre rascacielos, con cielo dorado y verde";

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (fine) {
      const onMove = (e: PointerEvent) => {
        set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
      };
      const onLeave = () => set(0, 0);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    }

    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = (r.top + r.height / 2) / window.innerHeight - 0.5;
      set(0, Math.max(-0.5, Math.min(0.5, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const common = { alt: ALT, fill: true, priority: true } as const;
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({
    ...common,
    src: "/assets/hero-toro-bronce-828.webp",
    sizes: "100vw",
  });
  const { props: desktop } = getImageProps({
    ...common,
    src: "/assets/hero-toro-bronce.webp",
    sizes: "(min-width: 1024px) 560px, 100vw",
  });

  return (
    <div ref={ref} className="hero-bull absolute inset-0">
      <div className="hero-bull-layer absolute inset-[-6%]">
        <picture>
          <source media="(max-width: 767px)" srcSet={mobileSrcSet} sizes="100vw" />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt viene en props */}
          <img {...desktop} className="hero-bull-img h-full w-full object-cover" />
        </picture>
      </div>
      <div className="hero-bull-veil pointer-events-none absolute inset-0" aria-hidden />
    </div>
  );
}
