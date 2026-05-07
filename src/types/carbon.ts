// TODO: Carbon tracker types — BLOK carbon-tracker

export type ActivityCategory = "transportation" | "energy" | "food" | "shopping";

export interface CarbonActivity {
  id: string;
  userId: string;
  category: ActivityCategory;
  description: string;
  emissionKg: number;
  date: string;
  createdAt: string;
}

export interface CarbonSummary {
  totalEmissionKg: number;
  weeklyTrend: { date: string; emissionKg: number }[];
  categoryBreakdown: { category: ActivityCategory; emissionKg: number }[];
}
