import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Libre_Baskerville } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import "./globals.css";

const display = Libre_Baskerville({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Zeta Finance — Asesoría financiera y de inversiones",
    template: "%s — Zeta Finance",
  },
  description:
    "Asesoría financiera personal e inversiones con acompañamiento cercano. Primera consulta sin coste para entender tu situación y tus objetivos.",
  openGraph: {
    title: "Zeta Finance — Asesoría financiera y de inversiones",
    description:
      "Ordena tus finanzas e invierte con criterio, con acompañamiento personal.",
    locale: "es_AR",
    type: "website",
    siteName: "Zeta Finance",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a34",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
