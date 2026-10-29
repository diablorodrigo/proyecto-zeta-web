import type { MetadataRoute } from "next";
import { GUIAS } from "@/lib/guias";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";

const ROUTES = [
  "",
  "/servicios",
  "/simulador",
  PROYECCION_PATH,
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
