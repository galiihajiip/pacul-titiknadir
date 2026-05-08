"use client";

import { motion } from "framer-motion";
import { MapPin, Pencil, Share2 } from "lucide-react";

const user = {
  initials: "AP",
  name: "Aditya Pratama",
  location: "Surabaya, Indonesia",
  level: 12,
  xpCurrent: 750,
  xpNext: 1000,
  xpPct: 75,
  ecoPoints: 4200,
  joined: "Okt 2026",
};

const miniStats = [
  { label: `${user.ecoPoints.toLocaleString("id-ID")} EcoPoints` },
  { label: `Level ${user.level}` },
  { label: `Bergabung ${user.joined}` },
];

export default function ProfileHeader() {
  return (
    <div
      className="relative overflow-hidden rounded-[14px] p-7 text-white"
      style={{
        background: "linear-gradient(135deg, #2D5F3F 0%, #1a3d27 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-10 right-32 h-36 w-36 rounded-full bg-white/5" />

      <div className="relative flex flex-wrap items-center justify-between gap-8">

        {/* ── LEFT: Avatar + name + buttons ── */}
        <div className="flex items-center gap-5">
          {/* Avatar circle */}
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "3px solid #F4A261",
            }}
          >
            {user.initials}
          </div>

          {/* Name + location + buttons */}
          <div>
            <h1 className="text-xl font-bold leading-tight">{user.name}</h1>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-white/70">
              <MapPin size={13} />
              {user.location}
            </p>

            {/* Action buttons */}
            <div className="mt-3 flex gap-3">
              <button className="flex items-center gap-1.5 rounded-md border border-white/40 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:border-white/70 hover:bg-white/10">
                <Pencil size={13} />
                Edit Profil
              </button>
              <button
                className="flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#F4A261" }}
              >
                <Share2 size={13} />
                Bagikan
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Level progress ── */}
        <div className="min-w-[280px] flex-1">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/50">
            Current Status
          </p>
          <p className="text-2xl font-bold">Level {user.level}</p>
          <p className="mt-0.5 text-sm text-white/70">
            {user.xpNext - user.xpCurrent} XP lagi untuk Level {user.level + 1}!
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${user.xpPct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: "#F4A261" }}
            />
          </div>

          {/* XP range labels */}
          <div className="mt-1 flex justify-between text-[10px] text-white/50">
            <span>0 XP</span>
            <span>{user.xpNext.toLocaleString("id-ID")} XP</span>
          </div>

          {/* Mini stats row */}
          <div className="mt-4 flex items-center gap-0 divide-x divide-white/20">
            {miniStats.map((s, i) => (
              <span
                key={i}
                className="px-3 text-xs text-white/70 first:pl-0 last:pr-0"
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
