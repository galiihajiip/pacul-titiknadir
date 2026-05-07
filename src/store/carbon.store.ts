// TODO: Carbon tracker Zustand store — BLOK carbon-tracker
import { create } from "zustand";
import type { CarbonActivity, CarbonSummary } from "@/types/carbon";

interface CarbonStore {
  activities: CarbonActivity[];
  summary: CarbonSummary | null;
  setActivities: (activities: CarbonActivity[]) => void;
  setSummary: (summary: CarbonSummary) => void;
  addActivity: (activity: CarbonActivity) => void;
}

export const useCarbonStore = create<CarbonStore>((set) => ({
  activities: [],
  summary: null,
  setActivities: (activities) => set({ activities }),
  setSummary: (summary) => set({ summary }),
  addActivity: (activity) =>
    set((state) => ({ activities: [activity, ...state.activities] })),
}));
