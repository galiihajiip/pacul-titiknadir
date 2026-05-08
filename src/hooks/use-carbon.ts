import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carbonService } from "@/services/carbon.service";
import type { NewEmissionDTO } from "@/services/carbon.service";

export function useCarbonEmissions() {
  return useQuery({
    queryKey: ["carbon", "emissions"],
    queryFn: () => carbonService.getEmissions(),
  });
}

export function useCarbonWeeklyTrend() {
  return useQuery({
    queryKey: ["carbon", "trend", "weekly"],
    queryFn: () => carbonService.getWeeklyTrend(),
  });
}

export function useCarbonMonthlyTrend() {
  return useQuery({
    queryKey: ["carbon", "trend", "monthly"],
    queryFn: () => carbonService.getMonthlyTrend(),
  });
}

export function useAddEmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewEmissionDTO) => carbonService.addEmission(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["carbon"] });
    },
  });
}
