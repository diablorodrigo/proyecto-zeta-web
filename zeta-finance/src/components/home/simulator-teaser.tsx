import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeSimulatorTeaser() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-8 rounded-3xl bg-secondary/70 px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Herramienta gratuita
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Simulá tu cartera y medí su riesgo
            </h2>
            <p className="mt-4 text-muted-foreground">
              Elegí tu perfil de riesgo, distribuí tu capital entre acciones,
              bonos y plazo fijo, y recibí en el momento una evaluación de qué
              tan alineada está tu cartera con ese perfil.
            </p>
          </div>
          <Link
            href="/simulador"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shrink-0 bg-primary text-primary-foreground",
            )}
          >
            Probar el simulador
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
