// TODO: Carbon tracker API service — BLOK carbon-tracker
import { api } from "./api";
import type { CarbonActivity, CarbonSummary } from "@/types/carbon";

export const carbonService = {
  getActivities: () => api.get<CarbonActivity[]>("/carbon/activities"),
  getSummary: () => api.get<CarbonSummary>("/carbon/summary"),
  createActivity: (data: Omit<CarbonActivity, "id" | "userId" | "createdAt">) =>
    api.post<CarbonActivity>("/carbon/activities", data),
  deleteActivity: (id: string) => api.delete(`/carbon/activities/${id}`),
};
