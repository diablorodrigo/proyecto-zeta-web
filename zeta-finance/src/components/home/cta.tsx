import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { buttonVariants } from "@/components/ui/button";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function HomeCta() {
  return (
    <section className="reveal relative overflow-hidden bg-[color:var(--zeta-forest)] text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 -bottom-20 h-64 w-64 rounded-full bg-[#b7d7c4]/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
          ¿Damos el primer paso?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
          Cuéntame en qué punto estás y te digo cómo puedo ayudarte. Sin coste
          y sin compromiso.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/contacto"
            className={cn(
              buttonVariants({ size: "lg" }),
              "w-full bg-background! text-foreground! hover:bg-white! sm:w-auto",
            )}
          >
            Reservar mi consulta
            <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
          </Link>
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full border-white/35! bg-white/10! text-white! shadow-none! hover:border-white/60! hover:bg-white/15! hover:text-white! sm:w-auto",
            )}
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp {WHATSAPP_DISPLAY}
          </Link>
        </div>
      </div>
    </section>
  );
}
