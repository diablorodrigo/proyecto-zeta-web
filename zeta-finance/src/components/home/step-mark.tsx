"use client";

import { useEffect, useRef, useState } from "react";

export function StepMark({ value }: { value: string }) {
  const target = Number(value);
  const ref = useRef<HTMLParagraphElement>(null);
  const [current, setCurrent] = useState(Number.isNaN(target) ? 0 : target);

  useEffect(() => {
    const el = ref.current;
    if (!el || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 700;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setCurrent(Math.round(target * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setCurrent(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return (
    <p
      ref={ref}
      className="relative z-10 inline-block bg-white pr-3 font-display text-4xl font-bold text-primary tabular-nums"
    >
      <span aria-hidden>{String(current).padStart(2, "0")}</span>
      <span className="sr-only">{value}</span>
    </p>
  );
}
