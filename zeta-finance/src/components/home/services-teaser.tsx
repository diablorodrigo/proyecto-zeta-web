import Link from "next/link";
import { ArrowRight, ChartLine, Check, Target } from "lucide-react";
import { SERVICE_LINES } from "@/lib/constants";

export function HomeServices() {
  return (
    <section className="reveal border-b border-border/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Servicios
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            En qué te puedo ayudar
          </h2>
          <p className="mt-3 text-muted-foreground">
            Dos formas de trabajar juntos, según el momento en el que estés.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {SERVICE_LINES.map((service, index) => (
            <article
              key={service.id}
              className="zeta-card relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-[0_16px_40px_-32px_rgba(30,58,52,0.45)] sm:p-8"
            >
              <span
                aria-hidden
                className="absolute top-4 right-5 font-display text-5xl font-bold text-primary/10"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary ring-1 ring-primary/10">
                {service.id === "asesoria" ? (
                  <Target className="h-5 w-5" aria-hidden />
                ) : (
                  <ChartLine className="h-5 w-5" aria-hidden />
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
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
            className="group inline-flex items-center gap-1 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Ver el detalle de los servicios
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
