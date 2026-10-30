/**
 * Ruta pública de "¿Cuánto pierde tu plata quieta?".
 * Para cambiarla: editá esta constante y renombrá la carpeta `src/app/proyeccion`
 * para que coincida (sin la barra inicial). Menú, inicio, sitemap y los
 * botones de compartir leen solo este valor.
 */
export const PROYECCION_PATH = "/proyeccion";

export const PROYECCION_RATES_PATH = "/api/proyeccion/rates";

function siteUrlFromEnv() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = raw ? raw : "https://www.zetafinance.com.ar";
  return base.replace(/\/+$/, "");
}

export const SITE_URL = siteUrlFromEnv();
