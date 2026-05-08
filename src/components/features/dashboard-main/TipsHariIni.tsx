"use client";

import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

const tips = [
  {
    id: "1",
    emoji: "🚲",
    title: "Ganti perjalanan pendek dengan bersepeda",
    impact: "Hemat ~0.8 kg CO₂/hari",
    color: "#10B981",
  },
  {
    id: "2",
    emoji: "🥦",
    title: "Kurangi konsumsi daging merah 2x seminggu",
    impact: "Hemat ~1.2 kg CO₂/minggu",
    color: "#7AC74F",
  },
  {
    id: "3",
    emoji: "💡",
    title: "Matikan perangkat standby saat tidak dipakai",
    impact: "Hemat ~0.3 kg CO₂/hari",
    color: "#F59E0B",
  },
];

const recentActivity = [
  { text: "Dewi Lestari menyelesaikan Zero Waste Hero", time: "5 menit lalu" },
  { text: "Rian Hidayat bergabung di Surobayo Cycling", time: "12 menit lalu" },
  { text: "Siti Aminah naik ke Level 8", time: "1 jam lalu" },
];

export default function TipsHariIni() {
  return (
    <div className="flex flex-col gap-4">
      {/* Tips card */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb size={15} className="text-[#F59E0B]" />
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Tips Hari Ini</h3>
        </div>
        <div className="flex flex-col gap-3">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-lg p-3"
              style={{ backgroundColor: `${tip.color}08` }}
            >
              <span className="text-xl leading-none">{tip.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#1A1A1A]">{tip.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold" style={{ color: tip.color }}>
                  {tip.impact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent community activity */}
      <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1A1A1A]">Aktivitas Komunitas</h3>
          <button className="flex items-center gap-1 text-xs font-medium text-[#2D5F3F] hover:underline">
            Lihat <ArrowRight size={11} />
          </button>
        </div>
        <ul className="flex flex-col divide-y divide-[#F9F9F9]">
          {recentActivity.map((act, i) => (
            <li key={i} className="flex items-start justify-between gap-3 py-2.5">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#7AC74F]" />
                <p className="text-xs text-gray-600">{act.text}</p>
              </div>
              <span className="shrink-0 text-[10px] text-gray-400">{act.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
