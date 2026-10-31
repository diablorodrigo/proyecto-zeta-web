import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideForm } from "@/components/guias/guide-form";
import { CNV_CREDENTIAL } from "@/lib/constants";
import { GUIAS, getGuia } from "@/lib/guias";
import { pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ profesion: string }>;
};

export function generateStaticParams() {
  return GUIAS.map((guia) => ({ profesion: guia.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profesion } = await params;
  const guia = getGuia(profesion);
  if (!guia) return { title: "Guía" };

  const description = `${guia.resumen} Guía gratis de Zeta Finance. Dejás tu nombre y email, y abrís el PDF.`;

  return pageMetadata({
    title: guia.titulo,
    description,
    path: `/guias/${guia.slug}`,
  });
}

export default async function GuiaPage({ params }: Props) {
  const { profesion } = await params;
  const guia = getGuia(profesion);
  if (!guia) notFound();

  const otras = GUIAS.filter((item) => item.slug !== guia.slug);

  return (
    <>
      <section className="border-b border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold text-primary">
            <Link href="/guias" className="hover:underline">
              Guías gratis
            </Link>
            <span aria-hidden> · </span>
            {guia.nombre}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {guia.titulo}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {guia.resumen}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <GuideForm guia={guia} />

        <aside className="space-y-8">
          <div className="rounded-2xl border border-border bg-secondary/40 p-6">
            <h2 className="font-display text-xl font-bold">Qué incluye</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <li>Pasos concretos, escritos para esta profesión.</li>
              <li>Pensada para la Argentina real: pesos, dólares e inflación.</li>
              <li>La abrís en el teléfono en cuanto dejás tus datos.</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {CNV_CREDENTIAL}. Salta.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Otras profesiones</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {otras.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/guias/${item.slug}`}
                    className="inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:border-primary/40"
                  >
                    {item.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Es material orientativo. No reemplaza una asesoría personalizada, no
            es una recomendación de inversión ni una promesa de rentabilidad.
          </p>
        </aside>
      </section>
    </>
  );
}
