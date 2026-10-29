import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "vitest";
import { PROYECCION_PATH } from "@/lib/proyeccion/path";

test("la carpeta de la app coincide con la constante de la ruta", () => {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const page = path.join(here, "../../app", PROYECCION_PATH.slice(1), "page.tsx");
  assert.equal(fs.existsSync(page), true);
  assert.equal(PROYECCION_PATH.includes("simulador"), false);
});
