import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeGuiasTeaser() {
  return (
    <article className="zeta-card flex h-full flex-col rounded-3xl border border-primary/15 bg-accent/60 p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
        Guías gratis
      </p>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Finanzas pensadas para tu profesión
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        Médicos, abogados, contadores, ingenieros, RR.HH., psicólogos y
        emprendedores. Dejás tu nombre y tu email, y abrís el PDF.
      </p>
      <Link
        href="/guias"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 w-full bg-primary text-primary-foreground sm:mt-auto sm:w-fit",
        )}
      >
        Ver las guías
        <ArrowRight className="transition-transform duration-200 group-hover/button:translate-x-0.5" />
      </Link>
    </article>
  );
}
