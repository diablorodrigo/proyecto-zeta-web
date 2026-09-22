import { z } from "zod";

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

  const nombreCompleto =
    payload.tipo === "simulacion"
      ? `${payload.nombre} ${payload.apellido}`.trim()
      : payload.nombre;

  const row = {
    timestamp: new Date().toISOString(),
    tipo: payload.tipo,
    nombre: nombreCompleto,
    telefono: "telefono" in payload ? payload.telefono || "" : "",
    email: "email" in payload ? payload.email || "" : "",
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
            : "",
    mensaje:
      "mensaje" in payload && payload.mensaje
        ? payload.mensaje
        : payload.tipo === "cartera" && payload.evaluacion
          ? JSON.stringify(payload.evaluacion)
          : "",
  };

  if (!webhook) {
    console.info("[leads:demo]", JSON.stringify(row, null, 2));
    return {
      ok: true,
      mode: "demo",
      message:
        "Recibimos tu solicitud (modo demo). Pronto te contactamos por WhatsApp.",
    };
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[leads:sheets-error]", res.status, text);
    throw new Error("No pudimos guardar el lead en Google Sheets");
  }

  return {
    ok: true,
    mode: "sheets",
    message:
      "¡Listo! Recibimos tu solicitud. Te contactamos a la brevedad.",
  };
}
