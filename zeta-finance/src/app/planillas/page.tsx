import type { Metadata } from "next";
import { PlanillasView } from "@/components/planillas/planillas-view";
import { EBOOK_INVERTIR_SIN_MIEDO } from "@/lib/ebooks";
import { PLANILLA_COMBO, PLANILLA_PRODUCTS } from "@/lib/planillas";
import { SITE_URL } from "@/lib/proyeccion/path";
import { pageMetadata } from "@/lib/seo";

const title = "Planillas y ebook Invertir sin miedo | Zeta Finance";
const description =
  "Planillas de Excel y el ebook Invertir sin miedo. Pago único con Mercado Pago desde $ 6.900, o la guía en PDF por $ 14.900 con descarga inmediata en Hotmart.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/planillas",
  images: [
    {
      url: "/planillas/preview-finanzas-personales-ars-usd.png",
      width: 1400,
      height: 680,
      alt: "Vista de la planilla de finanzas personales en pesos y dólares",
    },
  ],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Shop Zeta Finance",
  itemListElement: [
    ...PLANILLA_PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.subtitle,
        image: `${SITE_URL}${product.image}`,
        brand: { "@type": "Brand", name: "Zeta Finance" },
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: String(product.priceAmount),
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/planillas`,
        },
      },
    })),
    {
      "@type": "ListItem",
      position: PLANILLA_PRODUCTS.length + 1,
      item: {
        "@type": "Product",
        name: `Combo: ${PLANILLA_COMBO.name}`,
        description: PLANILLA_COMBO.subtitle,
        brand: { "@type": "Brand", name: "Zeta Finance" },
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: String(PLANILLA_COMBO.priceAmount),
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/planillas`,
        },
      },
    },
    {
      "@type": "ListItem",
      position: PLANILLA_PRODUCTS.length + 2,
      item: {
        "@type": "Product",
        name: EBOOK_INVERTIR_SIN_MIEDO.name,
        description: EBOOK_INVERTIR_SIN_MIEDO.description,
        image: `${SITE_URL}${EBOOK_INVERTIR_SIN_MIEDO.image}`,
        brand: { "@type": "Brand", name: "Zeta Finance" },
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: String(EBOOK_INVERTIR_SIN_MIEDO.priceAmount),
          availability: "https://schema.org/InStock",
          url: EBOOK_INVERTIR_SIN_MIEDO.buyUrl,
        },
      },
    },
  ],
};

export default function PlanillasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PlanillasView />
    </>
  );
}
