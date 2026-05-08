"use client";

import { motion } from "framer-motion";
import { Leaf, Trophy, Star, CheckCircle, Lock, Award, Users } from "lucide-react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import { useCountAnimation } from "@/hooks/useCountAnimation";

/* ── A. Stats data ── */
const statsConfig = [
  {
    icon: Leaf,
    label: "CO₂ SAVED",
    target: 124,
    suffix: " kg",
    iconBg: "rgba(45,95,63,0.12)",
    iconColor: "#2D5F3F",
    duration: 1600,
  },
  {
    icon: Trophy,
    label: "TANTANGAN SELESAI",
    target: 15,
    suffix: "",
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#F59E0B",
    duration: 1200,
  },
  {
    icon: Star,
    label: "ECOPOINTS EARNED",
    target: 4200,
    suffix: "",
    iconBg: "rgba(244,162,97,0.15)",
    iconColor: "#F4A261",
    duration: 2000,
  },
];

/* ── B. Badges data ── */
const profileBadges = [
  { name: "Early Bird", emoji: "🌅", earned: true },
  { name: "Tree Planter", emoji: "🌳", earned: true },
  { name: "Waste Warrior", emoji: "⚔️", earned: true },
  { name: "Energy Saver", emoji: "⚡", earned: true },
  { name: "Water Hero", emoji: "💧", earned: false },
  { name: "Leader", emoji: "👑", earned: false },
  { name: "Speaker", emoji: "📢", earned: false },
  { name: "Zero Hero", emoji: "♻️", earned: false },
];

/* ── C. Activity data ── */
const recentActivities = [
  {
    icon: Trophy,
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#F59E0B",
    label: "Menyelesaikan Tantangan Transportasi Publik Selama 7 Hari",
    time: "2 jam lalu",
  },
  {
    icon: Users,
    iconBg: "rgba(45,95,63,0.12)",
    iconColor: "#2D5F3F",
    label: "Bergabung Kolaborasi Aksi Bersih Pantai Kenjeran",
    time: "Kemarin, 14:20",
  },
  {
    icon: Award,
    iconBg: "rgba(122,199,79,0.12)",
    iconColor: "#7AC74F",
    label: "Mendapatkan Badge Waste Warrior",
    time: "3 hari lalu",
  },
];

/* ── Stat card with counter ── */
function StatCard({
  icon: Icon,
  label,
  target,
  suffix,
  iconBg,
  iconColor,
  duration,
  delay,
}: (typeof statsConfig)[0] & { delay: number }) {
  const { value, ref } = useCountAnimation(target, duration);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex flex-col items-center rounded-[12px] border border-[#E5E7EB] bg-white p-6 text-center shadow-sm"
    >
      <div
        className="mb-3 flex h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <p className="text-3xl font-extrabold text-[#1A1A1A]">
        {value.toLocaleString("id-ID")}
        {suffix}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-gray-500">{label}</p>
    </motion.div>
  );
}

/* ── Page ── */
export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header — fade + slide from top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ProfileHeader />
      </motion.div>

      {/* A. Stats — 3 columns, stagger left→right */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsConfig.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.1 + i * 0.1} />
        ))}
      </div>

      {/* B + C. Badges (60%) + Activities (40%) */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">

        {/* B. Achievement badges grid */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Pencapaian</h3>
            <span className="text-xs text-gray-400">
              {profileBadges.filter((b) => b.earned).length}/{profileBadges.length} diraih
            </span>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {profileBadges.map((badge, i) => (
              <div key={badge.name} className="group relative flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
                  className="relative flex h-20 w-20 cursor-default items-center justify-center rounded-full border-2 text-3xl"
                  style={
                    badge.earned
                      ? {
                          background: "radial-gradient(circle, #e6f4eb, #c8e6c9)",
                          borderColor: "#2D5F3F",
                        }
                      : {
                          backgroundColor: "#F3F4F6",
                          borderColor: "#E5E7EB",
                          filter: "grayscale(1)",
                          opacity: 0.5,
                        }
                  }
                >
                  {badge.emoji}
                  {badge.earned ? (
                    <CheckCircle
                      size={16}
                      className="absolute -bottom-1 -right-1 text-[#2D5F3F]"
                      fill="white"
                    />
                  ) : (
                    <Lock
                      size={12}
                      className="absolute -bottom-1 -right-1 text-gray-400"
                    />
                  )}
                </motion.div>

                <p className="text-center text-[10px] font-medium text-gray-600">
                  {badge.name}
                </p>

                {/* Tooltip */}
                <div className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-50 hidden w-32 -translate-x-1/2 rounded-[8px] bg-[#1A1A1A] p-2 text-[10px] text-white shadow-lg group-hover:block">
                  <p className="font-semibold">{badge.name}</p>
                  <p className="mt-1 font-medium" style={{ color: badge.earned ? "#7AC74F" : "#EF4444" }}>
                    {badge.earned ? "Sudah diraih ✓" : "Belum terbuka 🔒"}
                  </p>
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]" />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 text-xs font-medium text-[#2D5F3F] hover:underline">
            Lihat Semua →
          </button>
        </div>

        {/* C. Recent Activities */}
        <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-[#1A1A1A]">Aktivitas Terkini</h3>

          <ul className="flex flex-col">
            {recentActivities.map((act, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.08 }}
                className={`flex items-start gap-3 py-3.5 ${i < recentActivities.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}
              >
                {/* Icon circle */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: act.iconBg }}
                >
                  <act.icon size={16} style={{ color: act.iconColor }} />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-[#1A1A1A]">
                    {act.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{act.time}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
