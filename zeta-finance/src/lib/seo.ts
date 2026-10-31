import type { Metadata } from "next";
import {
  CNV_CREDENTIAL,
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/proyeccion/path";

export const HOME_TITLE = "Asesor financiero en Salta | Zeta Finance";

export const HOME_DESCRIPTION =
  "Asesoría financiera personal e inversiones en Salta, Argentina. Primera consulta sin costo para entender tu situación y tus objetivos.";

type OgImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

const DEFAULT_OG_IMAGE: OgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Zeta Finance — Asesor financiero en Salta",
};

export function pageMetadata({
  title,
  description,
  path,
  images,
  omitImages = false,
}: {
  title: string;
  description: string;
  path: string;
  images?: OgImage[];
  /** Deja que el opengraph-image del segmento (por ejemplo /proyeccion) ponga la imagen. */
  omitImages?: boolean;
}): Metadata {
  const fullTitle = title.includes("Zeta Finance")
    ? title
    : `${title} | Zeta Finance`;
  const ogImages = omitImages ? undefined : (images ?? [DEFAULT_OG_IMAGE]);

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      locale: "es_AR",
      type: "website",
      siteName: "Zeta Finance",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImages ? { images: ogImages } : {}),
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["FinancialService", "Organization"],
    "@id": `${SITE_URL}/#organization`,
    name: "Zeta Finance",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-zeta-finance.png`,
    image: `${SITE_URL}/logo-zeta-finance.png`,
    email: CONTACT_EMAIL,
    telephone: WHATSAPP_DISPLAY,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Salta",
      addressCountry: "AR",
    },
    areaServed: "Salta, Argentina",
    sameAs: [INSTAGRAM_URL],
    identifier: {
      "@type": "PropertyValue",
      propertyID: "CNV",
      name: "Matrícula CNV",
      value: "2103",
    },
    description:
      `Asesoría financiera personal e inversiones en Salta, Argentina. ${CNV_CREDENTIAL}.`,
  };
}
