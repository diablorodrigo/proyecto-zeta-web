import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sobre mí",
  description:
    "Zeta Finance nace para ordenar finanzas e invertir con criterio, sin promesas imposibles.",
};

const PRINCIPLES = [
  {
    title: "Transparencia",
    description:
      "Te explico cada decisión y cada coste antes de tomarlo. Si algo no te encaja, no se hace.",
  },
  {
    title: "Independencia",
    description:
      "No vendo productos de terceros ni cobro comisiones por recomendarlos.",
  },
  {
    title: "Aprender contigo",
    description:
      "El objetivo es que dentro de un año entiendas tus finanzas mejor que hoy.",
  },
] as const;

export default function SobreMiPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold text-primary">Sobre mí</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Claridad primero. Después, la estrategia.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          <p>
            <strong className="font-semibold text-foreground">
              Zeta Finance
            </strong>{" "}
            nace de una idea sencilla: la mayoría de las personas no necesita
            productos financieros complicados, necesita alguien que se siente
            con ellas, ordene los números y explique las cosas en un idioma
            normal.
          </p>
          <p>
            Acompaño a particulares y familias a poner orden en sus finanzas y a
            invertir con criterio, sin promesas de rentabilidades imposibles y
            sin decisiones que no entiendas.
          </p>
          <p>
            Cada proceso empieza igual: una conversación honesta sobre dónde
            estás, a dónde quieres llegar y qué riesgo estás realmente dispuesto
            a asumir. A partir de ahí construimos un plan escrito, con pasos
            concretos, y lo revisamos con el tiempo.
          </p>
        </div>

        <h2 className="mt-14 font-display text-2xl font-bold">Cómo trabajo</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {PRINCIPLES.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <Link
          href="/contacto"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-10 bg-primary text-primary-foreground",
          )}
        >
          Hablemos de tu caso
        </Link>
      </section>
    </>
  );
}
