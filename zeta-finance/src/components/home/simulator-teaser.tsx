import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BARS = [
  { height: "38%", delay: "0ms" },
  { height: "62%", delay: "90ms" },
  { height: "48%", delay: "160ms" },
  { height: "78%", delay: "230ms" },
  { height: "56%", delay: "300ms" },
  { height: "88%", delay: "370ms" },
] as const;

export function HomeSimulatorTeaser() {
  return (
    <section className="reveal relative overflow-hidden border-b border-primary/10 bg-[linear-gradient(180deg,#ffffff_0%,#f3f7ef_42%,#ffffff_100%)]">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Herramienta gratuita
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Simulá tu cartera y medí su riesgo
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Elegí tu perfil de riesgo, distribuí tu capital entre acciones,
            bonos y plazo fijo, y recibí en el momento una evaluación de qué
            tan alineada está tu cartera con ese perfil.
          </p>
          <Link
            href="/simulador"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 w-full bg-primary text-primary-foreground sm:w-auto",
            )}
          >
            Probar el simulador
            <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
          </Link>
        </div>

        <div className="glass-card rounded-[1.6rem] px-5 py-6 sm:px-7" aria-hidden>
          <div className="flex h-40 items-end gap-2.5 sm:h-48">
            {BARS.map((bar) => (
              <span
                key={bar.delay}
                className="bar-grow block flex-1 rounded-t-lg bg-primary/80"
                style={{
                  height: bar.height,
                  animationDelay: bar.delay,
                }}
              />
            ))}
          </div>
          <div className="mt-4 h-px bg-primary/15" />
          <p className="mt-3 text-xs tracking-[0.14em] text-muted-foreground uppercase">
            Ilustración del simulador
          </p>
        </div>
      </div>
    </section>
  );
}
