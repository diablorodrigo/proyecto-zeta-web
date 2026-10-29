import { z } from "zod";
import { getGuia, GUIA_SLUGS } from "@/lib/guias";

export const assetSchema = z.object({
  ticker: z
    .string()
    .trim()
    .min(1, "Ticker requerido")
    .max(12)
    .transform((v) => v.toUpperCase()),
  purchaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  quantity: z.coerce.number().positive("Cantidad debe ser positiva"),
});

export const leadSchema = z.discriminatedUnion("tipo", [
  z.object({
    tipo: z.literal("cartera"),
    nombre: z.string().trim().min(2).max(120),
    telefono: z.string().trim().min(6).max(40),
    email: z.union([z.literal(""), z.string().trim().email()]),
    activos: z.array(assetSchema).min(1),
    mensaje: z.string().trim().max(2000).optional(),
    evaluacion: z
      .object({
        valorEstimado: z.number().optional(),
        valorBenchmark: z.number().optional(),
        diferenciaPct: z.number().optional(),
      })
      .optional(),
  }),
  z.object({
    tipo: z.literal("reunion"),
    nombre: z.string().trim().min(2).max(120),
    telefono: z.string().trim().min(6).max(40),
    email: z.union([z.literal(""), z.string().trim().email()]),
    mensaje: z.string().trim().max(2000).optional(),
  }),
  z.object({
    tipo: z.literal("contacto"),
    nombre: z.string().trim().min(2).max(120),
    telefono: z.union([z.literal(""), z.string().trim().min(6).max(40)]),
    email: z.string().trim().email(),
    interes: z.enum([
      "asesoria",
      "inversiones",
      "no_se",
    ]),
    mensaje: z.string().trim().max(4000).optional(),
  }),
  z.object({
    tipo: z.literal("simulacion"),
    nombre: z.string().trim().min(1).max(80),
    apellido: z.string().trim().min(1).max(80),
    telefono: z.string().trim().min(6).max(40),
    email: z.string().trim().email(),
    perfil: z.enum(["conservador", "moderado", "agresivo"]),
    asignacion: z.record(z.string(), z.number()),
    puntaje: z.number().min(0).max(100),
    mensaje: z.string().trim().max(2000).optional(),
  }),
  z.object({
    tipo: z.literal("guia"),
    nombre: z.string().trim().min(2).max(120),
    email: z.string().trim().max(160).email(),
    profesion: z.enum(GUIA_SLUGS),
  }),
  z.object({
    tipo: z.literal("proyeccion"),
    nombre: z.string().trim().min(2).max(120),
    telefono: z.string().trim().min(6).max(40),
    email: z.union([z.literal(""), z.string().trim().email()]).optional(),
    ingreso: z.number().finite().min(0).max(1e15),
    montoQuieto: z.number().finite().min(0).max(1e15),
    usd: z.number().finite().min(0).max(1e12).optional(),
    horizonteMeses: z.union([
      z.literal(1),
      z.literal(3),
      z.literal(6),
      z.literal(12),
    ]),
    mejorOpcion: z.string().trim().min(1).max(200),
    supuestos: z
      .object({
        inflacionMensual: z.array(z.number().finite()).max(24),
        plazoFijoTna: z.number().finite(),
        moneyMarketTna: z.number().finite(),
        caucionTna: z.number().finite(),
        usdTna: z.number().finite(),
        lecaps: z
          .array(
            z.object({
              ticker: z.string().trim().max(12),
              tea: z.number().finite(),
              dias: z.number().finite(),
            }),
          )
          .max(20),
      })
      .optional(),
    mensaje: z.string().trim().max(2000).optional(),
  }),
]);

export type LeadPayload = z.infer<typeof leadSchema>;

export type LeadResponse = {
  ok: true;
  mode: "sheets" | "demo";
  message: string;
};

export async function forwardLeadToSheets(
  payload: LeadPayload,
): Promise<LeadResponse> {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

  const ahora = new Date();
  const nombreCompleto =
    payload.tipo === "simulacion"
      ? `${payload.nombre} ${payload.apellido}`.trim()
      : payload.nombre;
  const guia = payload.tipo === "guia" ? getGuia(payload.profesion) : undefined;
  const profesion = guia?.nombre ?? "";

  const row = {
    timestamp: ahora.toISOString(),
    fecha: new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Salta",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(ahora),
    tipo: payload.tipo,
    nombre: nombreCompleto,
    telefono: "telefono" in payload ? payload.telefono || "" : "",
    email:
      "email" in payload && payload.email
        ? payload.email.trim().toLowerCase()
        : "",
    profesion,
    activos_json:
      payload.tipo === "cartera"
        ? JSON.stringify(payload.activos)
        : payload.tipo === "simulacion"
          ? JSON.stringify({
              perfil: payload.perfil,
              asignacion: payload.asignacion,
              puntaje: payload.puntaje,
            })
          : payload.tipo === "contacto"
            ? JSON.stringify({ interes: payload.interes })
            : payload.tipo === "guia"
              ? JSON.stringify({
                  profesion: payload.profesion,
                  etiqueta: profesion,
                })
              : payload.tipo === "proyeccion"
                ? JSON.stringify({
                    ingreso: payload.ingreso,
                    montoQuieto: payload.montoQuieto,
                    usd: payload.usd ?? 0,
                    horizonteMeses: payload.horizonteMeses,
                    mejorOpcion: payload.mejorOpcion,
                    supuestos: payload.supuestos ?? null,
                  })
                : "",
    mensaje:
      payload.tipo === "guia"
        ? `Guía gratis: ${profesion}`
        : "mensaje" in payload && payload.mensaje
          ? payload.mensaje
          : payload.tipo === "cartera" && payload.evaluacion
            ? JSON.stringify(payload.evaluacion)
            : "",
  };

  if (!webhook) {
    if (payload.tipo === "guia") {
      console.warn(
        "[leads:guia] sin GOOGLE_SHEETS_WEBHOOK_URL: el PDF se entrega, pero el lead no queda en la hoja",
        JSON.stringify(row),
      );
    } else {
      console.info("[leads:demo]", JSON.stringify(row, null, 2));
    }
    return {
      ok: true,
      mode: "demo",
      message:
        payload.tipo === "guia"
          ? "Listo. Ya podés abrir la guía."
          : "Recibimos tu solicitud (modo demo). Pronto te contactamos por WhatsApp.",
    };
  }

  const res = await fetch(webhook, {
    method: "POST",
    redirect: "manual",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });

  if (!isWebhookAccepted(res)) {
    const text = await res.text().catch(() => "");
    console.error("[leads:sheets-error]", res.status, text);
    throw new Error(
      "No pudimos registrar tus datos. Probá de nuevo en unos minutos.",
    );
  }

  return {
    ok: true,
    mode: "sheets",
    message:
      payload.tipo === "guia"
        ? "Listo. Ya podés abrir la guía."
        : "¡Listo! Recibimos tu solicitud. Te contactamos a la brevedad.",
  };
}

function isWebhookAccepted(res: Response) {
  if (res.status >= 200 && res.status < 300) return true;
  if (res.status < 300 || res.status >= 400) return false;

  const location = res.headers.get("location") ?? "";
  if (/accounts\.google\.com|ServiceLogin/i.test(location)) {
    console.error(
      "[leads:sheets-auth] el webhook redirige al login de Google. Republicá el Apps Script con acceso: Cualquier persona.",
      location,
    );
    return false;
  }

  return true;
}
