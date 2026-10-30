import { StepMark } from "@/components/home/step-mark";
import { WORK_STEPS } from "@/lib/constants";

export function HomeHowWeWork() {
  return (
    <section className="reveal border-b border-border/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
          El proceso
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Cómo trabajamos
        </h2>
        <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden
            className="absolute top-6 right-0 left-0 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent lg:block"
          />
          {WORK_STEPS.map((step) => (
            <li
              key={step.n}
              className="relative border-l border-primary/20 pl-5 lg:border-0 lg:pl-0"
            >
              <StepMark value={step.n} />
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
