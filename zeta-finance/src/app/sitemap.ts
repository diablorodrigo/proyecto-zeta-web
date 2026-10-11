import type { MetadataRoute } from "next";

const ROUTES = [
  "",
  "/servicios",
  "/simulador",
  "/planillas",
  "/sobre-mi",
  "/contacto",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `https://zeta-finance.vercel.app${path}`,
  }));
}
