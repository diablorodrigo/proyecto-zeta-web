import type { Metadata } from "next";
import { RiskSimulator } from "@/components/simulador/risk-simulator";

export const metadata: Metadata = {
  title: "Simulador de carteras",
  description:
    "Elegí tu perfil de riesgo, distribuí tu capital y medí la alineación de tu cartera.",
};

export default function SimuladorPage() {
  return (
    <section className="border-b border-border/70 bg-secondary/40">
      <RiskSimulator />
    </section>
  );
}
