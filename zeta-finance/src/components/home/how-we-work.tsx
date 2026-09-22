import { WORK_STEPS } from "@/lib/constants";

export function HomeHowWeWork() {
  return (
    <section className="border-b border-border/70 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Cómo trabajamos
        </h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WORK_STEPS.map((step) => (
            <li key={step.n}>
              <p className="font-display text-3xl font-bold text-primary/35">
                {step.n}
              </p>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
