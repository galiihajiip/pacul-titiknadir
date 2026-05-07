"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const breakdownData = [
  { name: "Energi", value: 50, color: "#F59E0B" },
  { name: "Transportasi", value: 30, color: "#2D5F3F" },
  { name: "Pangan", value: 12, color: "#7AC74F" },
  { name: "Limbah", value: 8, color: "#10B981" },
];

const TOTAL_KG = 450;

/* ── Custom Tooltip ── */
function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#A8D5BA] bg-white px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-[#2D5F3F]">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value}%</p>
    </div>
  );
}

/* ── Center label rendered as SVG foreignObject ── */
function CenterLabel({
  cx,
  cy,
}: {
  cx?: number;
  cy?: number;
}) {
  if (!cx || !cy) return null;
  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 22, fontWeight: 700, fill: "#1A1A1A" }}
      >
        {TOTAL_KG}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: 10, fill: "#9CA3AF" }}
      >
        kg CO₂
      </text>
    </g>
  );
}

export default function BreakdownKategori() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">
        Breakdown Kategori
      </h3>

      {/* Donut chart */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={breakdownData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={900}
            labelLine={false}
            label={({ cx, cy }) => <CenterLabel cx={cx} cy={cy} />}
          >
            {breakdownData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <ul className="mt-3 flex flex-col gap-2">
        {breakdownData.map(({ name, value, color }) => (
          <li key={name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[#1A1A1A]">{name}</span>
            </div>
            <span className="font-medium text-gray-500">{value}%</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
