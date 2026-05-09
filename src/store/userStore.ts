import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface XPEvent {
  id: string;
  source: string;
  amount: number;
  label: string;
  timestamp: string;
}

interface UserStore {
  xp: number;
  totalXpEarned: number;
  level: number;
  xpToNextLevel: number;
  carbonSaved: number;
  challengesCompleted: number;
  rank: number;
  xpHistory: XPEvent[];

  awardXP: (amount: number, source: string, label: string) => void;
  deductXP: (amount: number) => void;
  addCarbonSaved: (kg: number) => void;
  incrementChallengesCompleted: () => void;
  resetToDemo: () => void;
}

function calcLevel(totalXp: number): { level: number; xpToNext: number } {
  const level = Math.floor(totalXp / 500) + 1;
  const xpToNext = level * 500 - totalXp;
  return { level, xpToNext };
}

const DEMO: Pick<UserStore, "xp" | "totalXpEarned" | "level" | "xpToNextLevel" | "carbonSaved" | "challengesCompleted" | "rank" | "xpHistory"> = {
  xp: 1250,
  totalXpEarned: 4200,
  level: 9,
  xpToNextLevel: 300,
  carbonSaved: 124,
  challengesCompleted: 15,
  rank: 12,
  xpHistory: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...DEMO,

      awardXP: (amount, source, label) => {
        const s = get();
        const newTotal = s.totalXpEarned + amount;
        const { level, xpToNext } = calcLevel(newTotal);
        const event: XPEvent = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          source,
          amount,
          label,
          timestamp: new Date().toISOString(),
        };
        set({
          xp: s.xp + amount,
          totalXpEarned: newTotal,
          level,
          xpToNextLevel: xpToNext,
          xpHistory: [event, ...s.xpHistory].slice(0, 50),
        });
      },

      deductXP: (amount) =>
        set((s) => ({ xp: Math.max(0, s.xp - amount) })),

      addCarbonSaved: (kg) =>
        set((s) => ({ carbonSaved: s.carbonSaved + kg })),

      incrementChallengesCompleted: () =>
        set((s) => ({ challengesCompleted: s.challengesCompleted + 1 })),

      resetToDemo: () => set(DEMO),
    }),
    {
      name: "pacul-user-store",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted: unknown, fromVersion: number) => {
        const p = persisted as Partial<typeof DEMO>;
        if (fromVersion < 2 && (!p.xp || p.xp === 0)) {
          return { ...DEMO };
        }
        return p;
      },
      partialize: (s) => ({
        xp: s.xp,
        totalXpEarned: s.totalXpEarned,
        level: s.level,
        xpToNextLevel: s.xpToNextLevel,
        carbonSaved: s.carbonSaved,
        challengesCompleted: s.challengesCompleted,
        rank: s.rank,
        xpHistory: s.xpHistory,
      }),
    }
  )
);
