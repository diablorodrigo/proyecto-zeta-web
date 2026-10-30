import type { Metadata } from "next";
import { GuideList } from "@/components/guias/guide-list";
import { pageMetadata } from "@/lib/seo";

const title = "Guías gratis de finanzas por profesión";
const description =
  "Guías PDF gratuitas de planificación financiera para médicos, abogados, contadores, ingenieros, RR.HH., psicólogos y emprendedores. Dejás tu nombre y email, y abrís la tuya.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/guias",
});

export default function GuiasPage() {
  return (
    <>
      <section className="border-b border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <p className="text-sm font-semibold text-primary">Guías gratis</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Una guía de finanzas para tu profesión
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Elegí la tuya, dejá tu nombre y tu email, y abrí el PDF en el
            momento. Sirve para pegar el link en un mensaje: cada profesión
            tiene su propia dirección.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            Las escribe Cristian Bernaldez, asesor financiero matriculado CNV,
            desde Salta.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <GuideList />
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Es material orientativo. No reemplaza una asesoría personalizada ni
          es una recomendación de inversión. Si tu profesión no está, escribinos
          y vemos una guía para tu actividad.
        </p>
      </section>
    </>
  );
}
