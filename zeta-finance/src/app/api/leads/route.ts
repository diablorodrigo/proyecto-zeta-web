import { NextResponse } from "next/server";
import { forwardLeadToSheets, leadSchema } from "@/lib/leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "JSON inválido" },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Datos inválidos",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const result = await forwardLeadToSheets(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/leads]", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : "Error al procesar la solicitud",
      },
      { status: 502 },
    );
  }
}
