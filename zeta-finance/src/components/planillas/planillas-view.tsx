import Image from "next/image";
import Link from "next/link";
import { Check, Gift } from "lucide-react";
import { BuyActions } from "@/components/planillas/buy-actions";
import { PlanillaFaq } from "@/components/planillas/planilla-faq";
import {
  CONTACT_EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  LOCATION_LABEL,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from "@/lib/constants";
import {
  PLANILLA_COMBO,
  PLANILLA_GIFT,
  PLANILLA_LEGAL,
  PLANILLA_PRODUCTS,
} from "@/lib/planillas";

export function PlanillasView() {
  return (
    <>
      <section className="border-b border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <p className="text-sm font-semibold text-primary">Planillas</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl sm:leading-[1.12]">
            Ordená tus números con una planilla, sin suscripción
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Dos archivos de Excel para usar en la compu o en el celular. Pagás
            una vez. Te los mando por WhatsApp, con el ejemplo, la versión en
            blanco y un link para tu copia en Google Sheets.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Cristian Bernaldez, asesor financiero matriculado por CNV.{" "}
            {LOCATION_LABEL}.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PLANILLA_PRODUCTS.map((product) => (
              <a
                key={product.id}
                href={`#${product.id}`}
                className="rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-primary/40"
              >
                <p className="text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className="mt-2 font-display text-2xl font-bold">
                  {product.priceLabel}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Pago único
                </p>
              </a>
            ))}
            <a
              href="#combo"
              className="rounded-2xl border border-primary/30 bg-accent px-4 py-4 transition-colors hover:border-primary/50"
            >
              <p className="text-sm font-medium text-foreground">
                {PLANILLA_COMBO.name}
              </p>
              <p className="mt-2 font-display text-2xl font-bold">
                {PLANILLA_COMBO.priceLabel}
              </p>
              <p className="mt-1 text-xs text-primary">
                Ahorrás {PLANILLA_COMBO.savingsLabel}
              </p>
            </a>
          </div>
        </div>
      </section>

      {PLANILLA_PRODUCTS.map((product) => (
        <section
          key={product.id}
          id={product.id}
          className="scroll-mt-24 border-b border-border/70"
        >
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-12">
              <div>
                <p className="text-sm font-semibold text-primary">
                  Pago único · {product.priceLabel}
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {product.name}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {product.subtitle}
                </p>
              </div>

              <figure className="lg:row-span-2">
                <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-[0_18px_40px_rgba(30,58,52,0.08)]">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    width={product.imageWidth}
                    height={product.imageHeight}
                    className="h-auto w-[920px] max-w-none sm:w-full"
                    sizes="(min-width: 1024px) 520px, 100vw"
                    priority={product.id === "personales"}
                  />
                </div>
                <figcaption className="mt-2 text-xs text-muted-foreground">
                  Vista de ejemplo, con datos de muestra.
                  <span className="sm:hidden"> Deslizá para ver el detalle.</span>
                </figcaption>
              </figure>

              <div>
                <BuyActions id={product.id} priceLabel={product.priceLabel} />
                <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground">
                  {PLANILLA_LEGAL}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h3 className="font-display text-xl font-bold">Qué te resuelve</h3>
                <ul className="mt-4 space-y-4">
                  {product.benefits.map((benefit) => (
                    <li key={benefit.title} className="text-sm leading-relaxed">
                      <span className="font-semibold">{benefit.title}</span>{" "}
                      <span className="text-muted-foreground">
                        {benefit.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h3 className="font-display text-xl font-bold">Qué incluye</h3>
                <ul className="mt-4 space-y-3">
                  {product.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h3 className="font-display text-xl font-bold">Para quién es</h3>
                <ul className="mt-4 space-y-3">
                  {product.audience.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="mt-6 flex gap-3 rounded-2xl border border-primary/20 bg-accent px-5 py-4 text-sm leading-relaxed">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>{PLANILLA_GIFT}</p>
            </div>
          </div>
        </section>
      ))}

      <section id="combo" className="scroll-mt-24 border-b border-border/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="rounded-3xl bg-[color:var(--zeta-forest)] px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
            <p className="text-sm font-semibold text-primary-foreground/80">
              Combo · ahorrás {PLANILLA_COMBO.savingsLabel}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {PLANILLA_COMBO.name}
            </h2>
            <p className="mt-4 max-w-2xl text-primary-foreground/85">
              {PLANILLA_COMBO.subtitle}
            </p>
            <p className="mt-5 font-display text-4xl font-bold">
              {PLANILLA_COMBO.priceLabel}
            </p>
            <p className="mt-1 text-sm text-primary-foreground/75">
              Pago único, sin suscripción. Incluye la guía PDF de tu profesión.
            </p>
            <div className="mt-6">
              <BuyActions
                id="combo"
                priceLabel={PLANILLA_COMBO.priceLabel}
                onDark
              />
            </div>
            <p className="mt-5 max-w-2xl text-xs leading-relaxed text-primary-foreground/70">
              {PLANILLA_LEGAL}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <PlanillaFaq />
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
            {PLANILLA_LEGAL}
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-5">
            <h2 className="font-display text-xl font-bold">
              Cualquier duda, escribime
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              WhatsApp e Instagram son la vía más directa. También podés
              escribir al mail.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href={whatsappLink(
                    "Hola, tengo una duda sobre las planillas",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  WhatsApp {WHATSAPP_DISPLAY}
                </Link>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Instagram {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="text-muted-foreground">{LOCATION_LABEL}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
