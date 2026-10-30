import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroStage } from "@/components/home/hero-visual";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

const arrowClass =
  "transition-transform duration-200 group-hover/button:translate-x-0.5";

export function HomeHero() {
  return (
    <HeroStage
      title={
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="hero-kicker motion-safe:animate-rise inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-medium tracking-[0.18em] text-[#f6efe0] uppercase backdrop-blur-sm sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9b46a]" aria-hidden />
            Asesoría independiente · Salta
          </p>
          <h1 className="hero-headline motion-safe:animate-rise mt-4 font-display font-bold text-[#fbf6ea] [animation-delay:80ms]">
            Tus finanzas, con un{" "}
            <em className="hero-gold font-display italic">plan claro</em>{" "}
            <span className="whitespace-nowrap">y sin letra pequeña</span>
          </h1>
        </div>
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pb-8 text-center sm:px-6 sm:pb-10">
        <p className="motion-safe:animate-rise max-w-xl text-[0.95rem] leading-relaxed text-[#efe6d2] [animation-delay:160ms] sm:text-lg">
          Asesoría financiera y de inversiones para decidir con criterio:
          ordenamos tu situación y armamos una estrategia que puedas sostener.
        </p>
        <div className="motion-safe:animate-rise mt-5 flex w-full flex-col gap-3 [animation-delay:220ms] sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/contacto"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full bg-primary text-primary-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] sm:w-auto",
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
              "w-full border-white/35 bg-white/10 text-[#fbf6ea] backdrop-blur-md hover:bg-white/20 hover:text-white sm:w-auto",
            )}
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp {WHATSAPP_DISPLAY}
          </Link>
        </div>
        <p className="motion-safe:animate-rise mt-4 text-xs text-[#e6dcc6]/85 [animation-delay:280ms] sm:text-sm">
          Primera consulta sin costo · Respuesta en menos de 24 h laborables ·{" "}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#f3d79a] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Instagram {INSTAGRAM_HANDLE}
          </a>
        </p>
      </div>
    </HeroStage>
  );
}
