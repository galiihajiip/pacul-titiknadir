"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Trash2, Bus, Clock, Users, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Types ── */
interface Challenge {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  progress: number;
  timeLeft: string;
  participants: number;
  xpReward: number;
  category: string;
  isJoined: boolean;
}

/* ── Mock data ── */
const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "1",
    icon: Zap,
    iconColor: "#F59E0B",
    title: "Kurangi Listrik 20%",
    description:
      "Kurangi penggunaan listrik rumah tangga sebesar 20% dalam sebulan.",
    progress: 65,
    timeLeft: "12 hari lagi",
    participants: 1240,
    xpReward: 200,
    category: "Energi",
    isJoined: false,
  },
  {
    id: "2",
    icon: Trash2,
    iconColor: "#10B981",
    title: "Zero Waste 7 Hari",
    description:
      "Kurangi sampah rumah tangga ke nol selama 7 hari berturut-turut.",
    progress: 40,
    timeLeft: "5 hari lagi",
    participants: 850,
    xpReward: 150,
    category: "Limbah",
    isJoined: true,
  },
  {
    id: "3",
    icon: Bus,
    iconColor: "#2D5F3F",
    title: "Transportasi Umum 10x",
    description:
      "Gunakan transportasi umum minimal 10 kali dalam seminggu.",
    progress: 80,
    timeLeft: "3 hari lagi",
    participants: 2100,
    xpReward: 100,
    category: "Transportasi",
    isJoined: true,
  },
];

/* ── Card ── */
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: "easeOut" },
  }),
};

function ChallengeCard({
  challenge,
  index,
  onJoin,
}: {
  challenge: Challenge;
  index: number;
  onJoin: (id: string) => void;
}) {
  const { icon: Icon, iconColor, title, description, progress, timeLeft, participants, xpReward, category, isJoined, id } = challenge;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="flex flex-col rounded-[12px] border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md"
      style={{ borderTop: `3px solid ${iconColor}` }}
    >
      {/* Top row: icon + category */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ backgroundColor: `${iconColor}15`, color: iconColor }}
        >
          {category}
        </span>
      </div>

      {/* Title */}
      <h4 className="mb-1.5 text-sm font-semibold text-[#1A1A1A]">{title}</h4>

      {/* Description — clamp 2 lines */}
      <p
        className="mb-4 flex-1 text-xs leading-relaxed text-gray-600"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {description}
      </p>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-gray-500">Progress</span>
          <span className="font-semibold" style={{ color: iconColor }}>{progress}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress tantangan ${title}: ${progress}%`}
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: iconColor }}
          />
        </div>
      </div>

      {/* Footer meta */}
      <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={11} /> {timeLeft}
        </span>
        <span className="flex items-center gap-1">
          <Users size={11} /> {participants.toLocaleString("id-ID")}
        </span>
        <span className="ml-auto rounded-full bg-[#7AC74F]/10 px-2 py-0.5 text-[10px] font-semibold text-[#7AC74F]">
          +{xpReward} XP
        </span>
      </div>

      {/* CTA button */}
      {isJoined ? (
        <div
          className="flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold"
          style={{
            backgroundColor: "rgba(16,185,129,0.08)",
            color: "#10B981",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <CheckCircle size={13} /> Sudah Bergabung
        </div>
      ) : (
        <button
          onClick={() => onJoin(id)}
          className="rounded-md py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2D5F3F" }}
        >
          Ikut Tantangan
        </button>
      )}
    </motion.div>
  );
}

/* ── Main ── */
export default function TantanganAktif() {
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);

  const handleJoin = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isJoined: true, participants: c.participants + 1 } : c))
    );
  };

  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1A1A1A]">Tantangan Aktif</h3>
        <span className="rounded-full bg-[#2D5F3F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#2D5F3F]">
          {challenges.length} tantangan
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {challenges.map((c, i) => (
          <ChallengeCard key={c.id} challenge={c} index={i} onJoin={handleJoin} />
        ))}
      </div>
    </div>
  );
}
