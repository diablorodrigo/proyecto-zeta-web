import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeCta() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-3xl bg-[color:var(--zeta-forest)] px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Damos el primer paso?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Cuéntame en qué punto estás y te digo cómo puedo ayudarte. Sin coste
            y sin compromiso.
          </p>
          <Link
            href="/contacto"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 bg-background text-foreground hover:bg-background/90",
            )}
          >
            Reservar mi consulta
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
