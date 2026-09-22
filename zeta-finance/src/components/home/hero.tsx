import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.8L1 23l5.3-1.4A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.2.8.9-3.1-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.6 4.1 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="animate-rise">
          <p className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-primary">
            Asesoría independiente
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl">
            Tus finanzas, con un plan claro y sin letra pequeña
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Asesoría financiera y de inversiones para personas que quieren
            decidir con criterio. Ordenamos tu situación actual, definimos
            objetivos y construimos una estrategia de ahorro e inversión que
            puedas sostener en el tiempo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contacto"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              Agendar consulta gratuita
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-primary/30 bg-background text-foreground",
              )}
            >
              <WhatsAppIcon />
              WhatsApp {WHATSAPP_DISPLAY}
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Respuesta en menos de 24 horas laborables.
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary shadow-[0_24px_50px_rgba(30,58,52,0.12)]">
          <Image
            src="/assets/hero-asesoria.jpg"
            alt="Escritorio de asesoría financiera"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 520px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
