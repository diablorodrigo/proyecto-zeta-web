import type { Metadata } from "next";
import { ProyeccionApp } from "@/components/proyeccion/proyeccion-app";
import { PROYECCION_PATH, SITE_URL } from "@/lib/proyeccion/path";

const title = "¿Cuánto pierde tu plata quieta?";
const description =
  "Mirá cuánto poder de compra pierde la plata que queda en la cuenta y cómo se comparan un plazo fijo, un money market, una caución y las letras hasta su vencimiento.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: PROYECCION_PATH },
  openGraph: {
    title,
    description,
    url: PROYECCION_PATH,
    locale: "es_AR",
    type: "website",
    siteName: "Zeta Finance",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function ProyeccionPage() {
  return <ProyeccionApp />;
}
