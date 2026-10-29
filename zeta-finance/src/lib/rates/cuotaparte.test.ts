import assert from "node:assert/strict";
import { test } from "vitest";
import { tnaFromCuotapartes } from "@/lib/rates/cuotaparte";

test("la TNA del money market sale de las cuotapartes de 7 días", () => {
  const quote = tnaFromCuotapartes(
    [
      { fecha: "2026-10-15", valorCuotaparte: 12676.343 },
      { fecha: "2026-10-22", valorCuotaparte: 12720.788 },
    ],
    7,
  );
  assert.ok(quote);
  assert.equal(quote.tna, 18.28);
  assert.equal(quote.dias, 7);
  assert.equal(quote.fecha, "2026-10-22");
  assert.equal(quote.fechaInicio, "2026-10-15");
});

test("un hueco fuera de 5 a 10 días no inventa una TNA", () => {
  assert.equal(
    tnaFromCuotapartes(
      [
        { fecha: "2026-10-01", vcp: 100 },
        { fecha: "2026-10-20", vcp: 101 },
      ],
      7,
    ),
    null,
  );
});
