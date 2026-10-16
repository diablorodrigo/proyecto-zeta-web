import type { MetadataRoute } from "next";
import { GUIAS } from "@/lib/guias";

const ROUTES = [
  "",
  "/servicios",
  "/simulador",
  "/planillas",
  "/guias",
  ...GUIAS.map((guia) => `/guias/${guia.slug}`),
  "/sobre-mi",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `https://zeta-finance.vercel.app${path}`,
  }));
}
