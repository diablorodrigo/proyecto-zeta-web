"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPesos } from "@/lib/proyeccion/format";

export type ChartPoint = {
  nombre: string;
  real: number;
  negativo: boolean;
};

export function ResultsChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e4e2d8" />
          <XAxis
            dataKey="nombre"
            tick={{ fontSize: 12, fill: "#3d4a46" }}
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#3d4a46" }}
            width={78}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) =>
              new Intl.NumberFormat("es-AR", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value)
            }
          />
          <Tooltip
            cursor={{ fill: "rgba(30, 58, 52, 0.06)" }}
            formatter={(value) => [formatPesos(Number(value)), "En pesos de hoy"]}
          />
          <Bar dataKey="real" radius={[6, 6, 0, 0]}>
            {data.map((point) => (
              <Cell
                key={point.nombre}
                fill={point.negativo ? "#8f3d3d" : "#1e3a34"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
