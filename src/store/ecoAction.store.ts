import { create } from "zustand";
import type { EcoChallenge, Badge } from "@/types/eco-action";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  points: number;
  level: number;
}

interface EcoActionStore {
  challenges: EcoChallenge[];
  userChallenges: string[];
  leaderboard: LeaderboardEntry[];
  ecoPoints: number;
  badges: Badge[];
  uploadState: "idle" | "uploading" | "analyzing" | "success" | "error";
  joinChallenge: (challengeId: string) => void;
  uploadProof: (file: File, challengeId: string) => Promise<void>;
  claimReward: (challengeId: string) => void;
  resetUpload: () => void;
}

const MOCK_CHALLENGES: EcoChallenge[] = [
  { id: "c1", title: "Zero Waste 7 Hari", description: "Kurangi sampah plastik selama 7 hari penuh", xpReward: 500, pointReward: 300, status: "active", progress: 5, total: 7, deadline: "2026-11-20", category: "Limbah" },
  { id: "c2", title: "Hemat Listrik 80%", description: "Kurangi penggunaan listrik hingga 80%", xpReward: 350, pointReward: 200, status: "active", progress: 8, total: 10, deadline: "2026-11-25", category: "Energi" },
  { id: "c3", title: "Transportasi Umum 10x", description: "Naik MRT atau Bus 10 kali dalam sebulan", xpReward: 400, pointReward: 250, status: "active", progress: 3, total: 10, deadline: "2026-11-30", category: "Transportasi" },
  { id: "c4", title: "Tanam 5 Pohon", description: "Tanam dan dokumentasikan 5 bibit pohon", xpReward: 750, pointReward: 500, status: "active", progress: 2, total: 5, deadline: "2026-12-05", category: "Penghijauan" },
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: "u1", name: "Dewi Lestari", initials: "DL", points: 8420, level: 18 },
  { rank: 2, userId: "u2", name: "Rian Hidayat", initials: "RH", points: 7810, level: 16 },
  { rank: 3, userId: "u3", name: "Siti Aminah", initials: "SA", points: 6950, level: 15 },
  { rank: 4, userId: "u4", name: "Budi Santoso", initials: "BS", points: 5230, level: 13 },
  { rank: 5, userId: "usr_001", name: "Aditya Pratama", initials: "AP", points: 4200, level: 12 },
];

const MOCK_BADGES: Badge[] = [
  { id: "b1", name: "Early Bird", description: "Aksi pertama tercatat", icon: "🌅", unlocked: true, unlockedAt: "2026-03-15" },
  { id: "b2", name: "Waste Warrior", description: "7 hari tanpa sampah plastik", icon: "⚔️", unlocked: true, unlockedAt: "2026-04-02" },
  { id: "b3", name: "Energy Saver", description: "Kurangi listrik 20%", icon: "⚡", unlocked: true, unlockedAt: "2026-05-05" },
  { id: "b4", name: "Tree Planter", description: "Tanam 5 pohon", icon: "🌳", unlocked: true, unlockedAt: "2026-06-10" },
  { id: "b5", name: "Water Hero", description: "Hemat air 30% selama sebulan", icon: "💧", unlocked: false },
  { id: "b6", name: "Community Leader", description: "Top 10 leaderboard", icon: "👑", unlocked: false },
];

export const useEcoActionStore = create<EcoActionStore>((set, get) => ({
  challenges: MOCK_CHALLENGES,
  userChallenges: ["c1", "c2"],
  leaderboard: MOCK_LEADERBOARD,
  ecoPoints: 4200,
  badges: MOCK_BADGES,
  uploadState: "idle",

  joinChallenge: (challengeId) =>
    set((state) => ({
      userChallenges: state.userChallenges.includes(challengeId)
        ? state.userChallenges
        : [...state.userChallenges, challengeId],
    })),

  uploadProof: async (_file: File, _challengeId: string) => {
    set({ uploadState: "uploading" });
    await new Promise((r) => setTimeout(r, 1200));
    set({ uploadState: "analyzing" });
    await new Promise((r) => setTimeout(r, 1800));
    set({ uploadState: "success" });
  },

  claimReward: (challengeId) => {
    const challenge = get().challenges.find((c) => c.id === challengeId);
    if (!challenge) return;
    set((state) => ({
      ecoPoints: state.ecoPoints + challenge.pointReward,
      challenges: state.challenges.map((c) =>
        c.id === challengeId ? { ...c, status: "completed" as const } : c
      ),
    }));
  },

  resetUpload: () => set({ uploadState: "idle" }),
}));
