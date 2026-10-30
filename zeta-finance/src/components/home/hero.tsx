import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOCATION_LABEL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const arrowClass =
  "transition-transform duration-200 group-hover/button:translate-x-0.5";

export function HomeHero() {
  return (
    <section className="relative border-b border-border/70">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="hero-mesh absolute inset-[-8%] opacity-90" />
        <div className="hero-dots absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:py-20">
        <div>
          <p className="motion-safe:animate-rise inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3 py-1 text-sm font-medium text-primary shadow-[0_8px_24px_-18px_rgba(30,58,52,0.8)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Asesoría independiente
          </p>
          <h1 className="motion-safe:animate-rise mt-5 font-display text-[2.35rem] leading-[1.08] font-bold tracking-tight text-foreground [animation-delay:70ms] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            Tus finanzas, con un{" "}
            <em className="font-display text-primary italic">plan claro</em> y
            sin letra pequeña
          </h1>
          <p className="motion-safe:animate-rise mt-5 max-w-xl text-base leading-relaxed text-muted-foreground [animation-delay:140ms] sm:text-lg">
            Asesoría financiera y de inversiones para personas que quieren
            decidir con criterio. Ordenamos tu situación actual, definimos
            objetivos y construimos una estrategia de ahorro e inversión que
            puedas sostener en el tiempo.
          </p>
          <div className="motion-safe:animate-rise mt-8 flex flex-col gap-3 [animation-delay:200ms] sm:flex-row sm:items-center">
            <Link
              href="/contacto"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full bg-primary text-primary-foreground sm:w-auto",
              )}
            >
              Agendar consulta gratuita
              <ArrowRight className={arrowClass} />
            </Link>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full border-primary/25 bg-white/80 text-foreground backdrop-blur-sm sm:w-auto",
              )}
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp {WHATSAPP_DISPLAY}
            </Link>
          </div>
          <p className="motion-safe:animate-rise mt-5 text-sm text-muted-foreground [animation-delay:260ms]">
            Respuesta en menos de 24 horas laborables.{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Instagram {INSTAGRAM_HANDLE}
            </a>
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative rounded-[1.75rem] bg-white/80 p-2 shadow-[0_30px_70px_-36px_rgba(30,58,52,0.55)] ring-1 ring-foreground/10 backdrop-blur-sm">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-secondary">
              <Image
                src="/assets/hero-asesoria.jpg"
                alt="Escritorio de asesoría financiera"
                fill
                priority
                className="hero-photo object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-white/25" />
              <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
                {LOCATION_LABEL}
              </p>
            </div>
          </div>

          <div className="float-a glass-card relative z-10 mt-3 rounded-2xl px-4 py-3 lg:absolute lg:top-8 lg:left-3 lg:mt-0 lg:w-44">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-primary uppercase">
              Primera consulta
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-foreground">
              Sin coste
            </p>
            <p className="text-xs text-muted-foreground">Sin compromiso</p>
          </div>

          <div className="float-b glass-card relative z-10 mt-3 rounded-2xl px-4 py-3 lg:absolute lg:right-0 lg:bottom-4 lg:mt-0 lg:w-60">
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-primary uppercase">
              Simulador
            </p>
            <svg
              viewBox="0 0 240 86"
              aria-hidden
              className="mt-2 h-16 w-full text-primary"
              fill="none"
            >
              <path
                d="M2 70 C 28 68, 36 46, 62 50 C 92 54, 104 24, 138 28 C 170 32, 186 16, 238 12 V 84 H 2 Z"
                className="chart-area"
              />
              <path
                d="M2 70 C 28 68, 36 46, 62 50 C 92 54, 104 24, 138 28 C 170 32, 186 16, 238 12"
                className="chart-line"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            <Link
              href="/simulador"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Probar el simulador
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
