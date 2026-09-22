import Link from "next/link";
import { ArrowRight, ChartLine, Check, Target } from "lucide-react";
import { SERVICE_LINES } from "@/lib/constants";

export function HomeServices() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            En qué te puedo ayudar
          </h2>
          <p className="mt-3 text-muted-foreground">
            Dos formas de trabajar juntos, según el momento en el que estés.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SERVICE_LINES.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                {service.id === "asesoria" ? (
                  <Target className="h-5 w-5" />
                ) : (
                  <ChartLine className="h-5 w-5" />
                )}
              </div>
              <h3 className="font-display text-xl font-bold sm:text-2xl">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {service.description}
              </p>
              <ul className="mt-6 space-y-3">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver el detalle de los servicios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
