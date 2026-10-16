import Link from "next/link";
import {
  Brain,
  Calculator,
  HardHat,
  Scale,
  Stethoscope,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { GUIAS, type GuiaSlug } from "@/lib/guias";

const ICONS: Record<GuiaSlug, LucideIcon> = {
  medicos: Stethoscope,
  abogados: Scale,
  contadores: Calculator,
  ingenieros: HardHat,
  rrhh: Users,
  psicologos: Brain,
  emprendedores: Store,
};

export function GuideList() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GUIAS.map((guia) => {
        const Icon = ICONS[guia.slug];
        return (
          <li key={guia.slug}>
            <Link
              href={`/guias/${guia.slug}`}
              className="flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-xl font-bold">
                {guia.nombre}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {guia.resumen}
              </p>
              <span className="mt-4 text-sm font-semibold text-primary">
                Quiero esta guía
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
