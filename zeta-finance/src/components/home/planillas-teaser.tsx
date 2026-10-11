import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomePlanillasTeaser() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Planillas
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Ordená tus números, sin suscripción
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Finanzas personales en pesos y dólares ($ 6.900) e ingresos para
              profesionales independientes ($ 9.900). Pago único. De regalo, la
              guía PDF de tu profesión.
            </p>
          </div>
          <Link
            href="/planillas"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shrink-0 bg-primary text-primary-foreground",
            )}
          >
            Ver planillas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
