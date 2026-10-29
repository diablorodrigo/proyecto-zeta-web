import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomePlanillasTeaser() {
  return (
    <article className="zeta-card flex h-full flex-col rounded-3xl border border-border bg-white p-6 shadow-[0_16px_40px_-32px_rgba(30,58,52,0.4)] sm:p-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
        Planillas
      </p>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Ordená tus números, sin suscripción
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        Finanzas personales en pesos y dólares ($ 6.900) e ingresos para
        profesionales independientes ($ 9.900). Pago único y seguro con Mercado
        Pago. Te llegan por mail, con la guía PDF de tu profesión.
      </p>
      <Link
        href="/planillas"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 w-full bg-primary text-primary-foreground sm:mt-auto sm:w-fit",
        )}
      >
        Ver planillas
        <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
      </Link>
    </article>
  );
}
