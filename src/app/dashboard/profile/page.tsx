"use client";

import { motion } from "framer-motion";
import { Leaf, Zap, Coins, Trophy, CheckCircle, Lock } from "lucide-react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";

/* ── Mock data ── */
const user = {
  name: "Aditya Dwi",
  initials: "AD",
  location: "Wonokromo, Surabaya",
  level: 7,
  xp: 2340,
  xpNext: 3000,
  joined: "Maret 2026",
};

const stats = [
  { icon: Zap, label: "Total Aksi", value: "142", color: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  { icon: Leaf, label: "Emisi Dikurangi", value: "48.2 ton", color: "#10B981", bg: "rgba(16,185,129,0.10)" },
  { icon: Coins, label: "Poin Terkumpul", value: "2,340", color: "#2D5F3F", bg: "rgba(45,95,63,0.10)" },
  { icon: Trophy, label: "Ranking", value: "#12", color: "#7AC74F", bg: "rgba(122,199,79,0.10)" },
];

const badges = [
  { emoji: "🌱", name: "First Step", desc: "Aksi pertama tercatat", earned: true, earnedAt: "15 Mar 2026" },
  { emoji: "♻️", name: "Zero Waste Hero", desc: "7 hari tanpa sampah plastik", earned: true, earnedAt: "2 Apr 2026" },
  { emoji: "🚲", name: "Green Commuter", desc: "10x naik transportasi umum", earned: true, earnedAt: "18 Apr 2026" },
  { emoji: "⚡", name: "Energy Saver", desc: "Kurangi listrik 20%", earned: true, earnedAt: "5 Mei 2026" },
  { emoji: "🌿", name: "Eco Warrior", desc: "50 aksi lingkungan selesai", earned: false, earnedAt: null },
  { emoji: "🏆", name: "Community Leader", desc: "Top 10 leaderboard", earned: false, earnedAt: null },
  { emoji: "🌍", name: "Climate Champion", desc: "Kurangi 100 ton CO₂", earned: false, earnedAt: null },
];

const activities = [
  { label: "Selesaikan Zero Waste 7 Hari", xp: "+500 XP", time: "2 hari lalu", color: "#10B981" },
  { label: "Upload bukti bersepeda ke kantor", xp: "+120 XP", time: "4 hari lalu", color: "#2D5F3F" },
  { label: "Bergabung Surobayo Cycling", xp: "+80 XP", time: "1 minggu lalu", color: "#7AC74F" },
  { label: "Laporan emisi mingguan dikirim", xp: "+50 XP", time: "1 minggu lalu", color: "#F59E0B" },
  { label: "Redeem reward Tote Bag Eco", xp: "-300 XP", time: "2 minggu lalu", color: "#EF4444" },
];

const xpPct = Math.round((user.xp / user.xpNext) * 100);

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile header card */}
      <ProfileHeader />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="rounded-[12px] border border-[#E5E7EB] bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: s.bg }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="mt-0.5 text-xl font-bold text-[#1A1A1A]">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main grid: badges (left) + activity (right) */}
      <div className="grid gap-6 lg:grid-cols-[55fr_45fr]">
        {/* Achievement badges */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Pencapaian</h3>
            <span className="text-xs text-gray-400">
              {badges.filter((b) => b.earned).length}/{badges.length} diraih
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {badges.map((badge, i) => (
              <div key={badge.name} className="group relative flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex h-12 w-12 cursor-default items-center justify-center rounded-full border-2 text-xl"
                  style={
                    badge.earned
                      ? { background: "radial-gradient(circle, #e6f4eb, #c8e6c9)", borderColor: "#2D5F3F" }
                      : { backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", filter: "grayscale(1)", opacity: 0.5 }
                  }
                >
                  {badge.emoji}
                  {!badge.earned && (
                    <Lock size={10} className="absolute bottom-0.5 right-0.5 text-gray-400" />
                  )}
                  {badge.earned && (
                    <CheckCircle size={12} className="absolute bottom-0 right-0 text-[#2D5F3F]" fill="white" />
                  )}
                </motion.div>

                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-50 hidden w-36 -translate-x-1/2 rounded-[8px] bg-[#1A1A1A] p-2 text-[10px] text-white shadow-lg group-hover:block">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="mt-0.5 text-white/70">{badge.desc}</p>
                  <p className="mt-1 font-medium" style={{ color: badge.earned ? "#7AC74F" : "#EF4444" }}>
                    {badge.earned ? `Diraih: ${badge.earnedAt}` : "Belum terbuka"}
                  </p>
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity history */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Riwayat Aktivitas</h3>
          <ul className="flex flex-col divide-y divide-[#F9F9F9]">
            {activities.map((act, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: i * 0.07 }}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: act.color }} />
                  <p className="text-sm text-[#1A1A1A]">{act.label}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <span className="text-xs font-bold" style={{ color: act.xp.startsWith("-") ? "#EF4444" : "#2D5F3F" }}>
                    {act.xp}
                  </span>
                  <span className="text-[10px] text-gray-400">{act.time}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
