"use client";

import { motion } from "framer-motion";
import { Leaf, Zap, Coins, Trophy } from "lucide-react";

const kpis = [
  {
    icon: Leaf,
    label: "Total Emisi Bulan Ini",
    value: "12.4 ton",
    sub: "↓ 18% dari bulan lalu",
    subColor: "#10B981",
    iconBg: "rgba(16,185,129,0.12)",
    iconColor: "#10B981",
    border: "#10B981",
  },
  {
    icon: Zap,
    label: "Aksi Selesai",
    value: "38",
    sub: "↑ 5 aksi minggu ini",
    subColor: "#F59E0B",
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#F59E0B",
    border: "#F59E0B",
  },
  {
    icon: Coins,
    label: "Poin Terkumpul",
    value: "2,340",
    sub: "+ 320 XP minggu ini",
    subColor: "#2D5F3F",
    iconBg: "rgba(45,95,63,0.12)",
    iconColor: "#2D5F3F",
    border: "#2D5F3F",
  },
  {
    icon: Trophy,
    label: "Rank Komunitas",
    value: "#12",
    sub: "Top 5% di Surabaya",
    subColor: "#7AC74F",
    iconBg: "rgba(122,199,79,0.12)",
    iconColor: "#7AC74F",
    border: "#7AC74F",
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.08 }}
          className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm"
          style={{ borderTop: `3px solid ${kpi.border}` }}
        >
          <div
            className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: kpi.iconBg }}
          >
            <kpi.icon size={20} style={{ color: kpi.iconColor }} />
          </div>
          <p className="text-xs text-gray-500">{kpi.label}</p>
          <p className="mt-0.5 text-2xl font-bold text-[#1A1A1A]">{kpi.value}</p>
          <p className="mt-1 text-xs font-medium" style={{ color: kpi.subColor }}>
            {kpi.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
