import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";
import { cn } from "@/lib/utils";

export function HomeProyeccionTeaser() {
  return (
    <section className="border-b border-border/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-8 rounded-3xl border border-border bg-[#fbfaf6] px-6 py-10 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Para empezar
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              ¿Cuánto pierde tu plata quieta?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Si el sueldo queda en la cuenta, la inflación se lo come. Cargá tu
              ingreso y mirá, en pesos de hoy, cuánto pierde y qué pasa con un
              plazo fijo, un fondo de dinero, una caución o una letra.
            </p>
          </div>
          <Link
            href={PROYECCION_PATH}
            className={cn(
              buttonVariants({ size: "lg" }),
              "shrink-0 bg-primary text-primary-foreground",
            )}
          >
            Ver cuánto pierde
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
