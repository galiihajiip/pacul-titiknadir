"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const challenges = [
  {
    id: "1",
    label: "Hemat Listrik 80%",
    sub: "Target: Kurangi penggunaan AC",
    progress: 80,
    color: "#2D5F3F",
  },
  {
    id: "2",
    label: "Gunakan Transportasi Umum",
    sub: "Target: 10 perjalanan MRT/Bus",
    progress: 45,
    color: "#F4A261",
  },
  {
    id: "3",
    label: "Zero Waste 7 Hari",
    sub: "Target: Tidak ada sampah plastik",
    progress: 71,
    color: "#10B981",
  },
];

export default function TantanganAktifPanel() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Tantangan Aktif</h3>
        <Link
          href="/dashboard/eco-action"
          className="flex items-center gap-1 text-sm font-medium text-[#2D5F3F] hover:underline"
        >
          Lihat Semua <ArrowRight size={13} />
        </Link>
      </div>

      {/* Challenge items */}
      <div className="flex flex-col gap-5">
        {challenges.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          >
            {/* Label row */}
            <div className="mb-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">{c.label}</p>
                <p className="text-xs text-gray-500">{c.sub}</p>
              </div>
              <span
                className="ml-3 shrink-0 text-sm font-bold"
                style={{ color: c.color }}
              >
                {c.progress}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: c.color }}
                initial={{ width: 0 }}
                animate={{ width: `${c.progress}%` }}
                transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
