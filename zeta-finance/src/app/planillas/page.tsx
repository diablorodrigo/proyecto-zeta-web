import type { Metadata } from "next";
import { PlanillasView } from "@/components/planillas/planillas-view";
import { PLANILLA_COMBO, PLANILLA_PRODUCTS } from "@/lib/planillas";

const title = "Planillas de finanzas en pesos y dólares | Zeta Finance";
const description =
  "Planillas de Excel para ordenar tus finanzas personales en pesos y dólares o tus ingresos como profesional independiente. Pago único y seguro con Mercado Pago, desde $ 6.900. Te llegan por mail, con guía PDF de regalo.";

export const metadata: Metadata = {
  metadataBase: new URL("https://zeta-finance.vercel.app"),
  title: { absolute: title },
  description,
  alternates: { canonical: "/planillas" },
  openGraph: {
    title,
    description,
    url: "/planillas",
    locale: "es_AR",
    type: "website",
    siteName: "Zeta Finance",
    images: [
      {
        url: "/planillas/preview-finanzas-personales-ars-usd.png",
        width: 1400,
        height: 680,
        alt: "Vista de la planilla de finanzas personales en pesos y dólares",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Planillas Zeta Finance",
  itemListElement: [
    ...PLANILLA_PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.subtitle,
        image: `https://zeta-finance.vercel.app${product.image}`,
        brand: { "@type": "Brand", name: "Zeta Finance" },
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: String(product.priceAmount),
          availability: "https://schema.org/InStock",
          url: "https://zeta-finance.vercel.app/planillas",
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
          url: "https://zeta-finance.vercel.app/planillas",
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
