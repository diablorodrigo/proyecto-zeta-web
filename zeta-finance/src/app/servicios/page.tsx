import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { CnvNotice } from "@/components/cnv-notice";
import { buttonVariants } from "@/components/ui/button";
import { SERVICE_LINES } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Servicios de asesoría financiera",
  description:
    "Asesoría financiera personal e inversiones y patrimonio, con acompañamiento cercano en Salta.",
  path: "/servicios",
});

export default function ServiciosPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold text-primary">Servicios</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Trabajo con pocas personas a la vez para poder acompañar de verdad
            cada caso.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Estas son las dos líneas de trabajo y lo que incluye cada una.
          </p>
          <CnvNotice className="mt-8 max-w-3xl" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          {SERVICE_LINES.map((service) => (
            <article
              key={service.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl font-bold">
                {service.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{service.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/contacto"
                className={cn(
                  buttonVariants(),
                  "mt-8 self-start bg-primary text-primary-foreground",
                )}
              >
                Consultar por este servicio
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-dashed border-border bg-secondary/30 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">
            ¿Tu caso es distinto?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Si necesitas algo puntual —revisar una cartera, una segunda opinión
            sobre una decisión concreta o preparar una compra importante—
            escríbeme y lo vemos.
          </p>
          <Link
            href="/contacto"
            className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ir a contacto
          </Link>
        </div>
      </section>
    </>
  );
}
