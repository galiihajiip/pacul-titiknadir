"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const activities = [
  {
    initials: "DL",
    name: "Dewi Lestari",
    action: "menyelesaikan tantangan Zero Waste Hero",
    time: "5 menit lalu",
    color: "#10B981",
    xp: "+500 XP",
  },
  {
    initials: "RH",
    name: "Rian Hidayat",
    action: "bergabung di Surobayo Cycling",
    time: "12 menit lalu",
    color: "#2D5F3F",
    xp: "+80 XP",
  },
  {
    initials: "SA",
    name: "Siti Aminah",
    action: "naik ke Level 8",
    time: "1 jam lalu",
    color: "#7AC74F",
    xp: "+350 XP",
  },
  {
    initials: "AP",
    name: "Aditya Pratama",
    action: "upload bukti aksi tanam pohon",
    time: "2 jam lalu",
    color: "#F59E0B",
    xp: "+200 XP",
  },
  {
    initials: "BS",
    name: "Budi Santoso",
    action: "redeem reward Tote Bag Eco",
    time: "3 jam lalu",
    color: "#EF4444",
    xp: "-300 XP",
  },
];

const AVATAR_COLORS: Record<string, string> = {
  DL: "#2D5F3F",
  RH: "#10B981",
  SA: "#7AC74F",
  AP: "#F59E0B",
  BS: "#2D8B56",
};

export default function AktivitasKomunitas() {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1A1A1A]">Aktivitas Komunitas</h3>
        <Link
          href="/dashboard/collaboration"
          className="flex items-center gap-1 text-xs font-medium text-[#2D5F3F] hover:underline"
        >
          Lihat semua <ArrowRight size={11} />
        </Link>
      </div>

      <ul className="flex flex-col divide-y divide-[#F9FAFB]">
        {activities.map((act, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: i * 0.07 }}
            className="flex items-center gap-3 py-3"
          >
            {/* Avatar */}
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: AVATAR_COLORS[act.initials] ?? "#2D5F3F" }}
            >
              {act.initials}
            </span>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-[#1A1A1A]">
                <span className="font-semibold">{act.name}</span>{" "}
                <span className="text-gray-500">{act.action}</span>
              </p>
              <p className="text-[10px] text-gray-400">{act.time}</p>
            </div>

            {/* XP badge */}
            <span
              className="shrink-0 text-[10px] font-bold"
              style={{ color: act.xp.startsWith("-") ? "#EF4444" : "#2D5F3F" }}
            >
              {act.xp}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
