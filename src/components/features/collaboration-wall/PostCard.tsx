"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, MapPin } from "lucide-react";

/* ── Types ── */
export type PostType = "IDE" | "GERAKAN" | "EVENT" | "LAPORAN";

export interface Post {
  id: string;
  author: { name: string; initials: string; location: string };
  timeAgo: string;
  type: PostType;
  content: string;
  tags?: string[];
  hasImage?: boolean;
  likes: number;
  replies: number;
  isVerifiedAction?: boolean;
  verifiedActionLabel?: string;
}

/* ── Mock data ── */
export const mockPosts: Post[] = [
  {
    id: "1",
    author: { name: "Dewi Lestari", initials: "DL", location: "Gubeng" },
    timeAgo: "2 jam yang lalu",
    type: "IDE",
    content:
      "Bagaimana kalau kita buat bank sampah digital di Gubeng? Saya punya rancangan alur pengumpulan yang bisa terintegrasi langsung dengan PACUL.",
    tags: ["#BankSampah", "#Gubeng", "#ZeroWaste"],
    hasImage: false,
    likes: 24,
    replies: 8,
    isVerifiedAction: true,
    verifiedActionLabel: "Zero Waste Hero — Terverifikasi",
  },
  {
    id: "2",
    author: { name: "Rian Hidayat", initials: "RH", location: "Wonokromo" },
    timeAgo: "5 jam yang lalu",
    type: "GERAKAN",
    content:
      "Ajak warga Wonokromo cycling setiap Minggu pagi! Kurangi emisi transportasi dan mempererat komunitas. Siapa mau bergabung?",
    tags: ["#SuroboyoCycling", "#GreenTransport"],
    hasImage: false,
    likes: 45,
    replies: 12,
    isVerifiedAction: false,
  },
  {
    id: "3",
    author: { name: "Siti Aminah", initials: "SA", location: "Tegalsari" },
    timeAgo: "Kemarin, 14:00",
    type: "EVENT",
    content:
      "Workshop Urban Farming gratis di Taman Bungkul! Pelajari cara bertanam sayuran di lahan sempit. Daftar sekarang — slot terbatas.",
    tags: ["#UrbanFarming", "#Surabaya", "#Workshop"],
    hasImage: false,
    likes: 67,
    replies: 23,
    isVerifiedAction: false,
  },
];

/* ── Badge config ── */
const TYPE_CONFIG: Record<PostType, { bg: string; color: string; label: string }> = {
  IDE:     { bg: "rgba(45,95,63,0.10)",   color: "#2D5F3F", label: "Ide" },
  GERAKAN: { bg: "rgba(16,185,129,0.10)", color: "#10B981", label: "Gerakan" },
  EVENT:   { bg: "rgba(245,158,11,0.10)", color: "#F59E0B", label: "Event" },
  LAPORAN: { bg: "rgba(239,68,68,0.10)",  color: "#EF4444", label: "Laporan" },
};

const AVATAR_COLORS = ["#2D5F3F", "#10B981", "#F59E0B", "#7AC74F", "#2D8B56"];
function avatarColor(initials: string) {
  return AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];
}

/* ── Card ── */
export default function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const badge = TYPE_CONFIG[post.type];
  const showJoinBtn = post.type === "GERAKAN" || post.type === "EVENT";

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);
  };

  return (
    <div className="rounded-[12px] border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        {/* Avatar */}
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: avatarColor(post.author.initials) }}
        >
          {post.author.initials}
        </span>

        {/* Name + location */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1A1A1A]">{post.author.name}</p>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={10} /> {post.author.location}
          </p>
        </div>

        {/* Time + type badge */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-xs text-gray-400">{post.timeAgo}</span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: badge.bg, color: badge.color }}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="mb-3 text-sm leading-relaxed text-gray-700">{post.content}</p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="cursor-pointer text-sm font-medium text-[#2D5F3F] hover:underline"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Verified action banner */}
      {post.isVerifiedAction && post.verifiedActionLabel && (
        <div
          className="mb-3 rounded-r-md py-1.5 pl-3 pr-3 text-xs font-medium"
          style={{
            backgroundColor: "rgba(16,185,129,0.05)",
            borderLeft: "2px solid #10B981",
            color: "#10B981",
          }}
        >
          🔗 Terikat: {post.verifiedActionLabel}
        </div>
      )}

      {/* Engagement footer */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        {/* Like */}
        <motion.button
          onClick={handleLike}
          animate={likeAnimating ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: liked ? "#EF4444" : "#9CA3AF" }}
        >
          <Heart
            size={15}
            fill={liked ? "#EF4444" : "none"}
            stroke={liked ? "#EF4444" : "#9CA3AF"}
          />
          <span>{likeCount}</span>
          <span>Suka</span>
        </motion.button>

        {/* Reply */}
        <button className="flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-[#2D5F3F]">
          <MessageCircle size={15} />
          <span>{post.replies}</span>
          <span>Balas</span>
        </button>

        {/* Join (Gerakan / Event only) */}
        {showJoinBtn && (
          <button
            className="ml-auto rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2D5F3F" }}
          >
            Ikut Gabung
          </button>
        )}
      </div>
    </div>
  );
}
