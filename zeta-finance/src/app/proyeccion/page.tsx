import type { Metadata } from "next";
import { ProyeccionApp } from "@/components/proyeccion/proyeccion-app";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";
import { pageMetadata } from "@/lib/seo";

const title = "¿Cuánto pierde tu plata quieta?";
const description =
  "Mirá cuánto poder de compra pierde la plata que queda en la cuenta y cómo se comparan un plazo fijo, un money market, una caución y las letras hasta su vencimiento.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: PROYECCION_PATH,
  omitImages: true,
});

export default function ProyeccionPage() {
  return <ProyeccionApp />;
}
