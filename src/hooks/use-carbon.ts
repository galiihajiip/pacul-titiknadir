// TODO: Carbon tracker custom hook — BLOK carbon-tracker
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { carbonService } from "@/services/carbon.service";

export function useCarbonActivities() {
  return useQuery({
    queryKey: ["carbon", "activities"],
    queryFn: () => carbonService.getActivities().then((r) => r.data),
  });
}

export function useCarbonSummary() {
  return useQuery({
    queryKey: ["carbon", "summary"],
    queryFn: () => carbonService.getSummary().then((r) => r.data),
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: carbonService.createActivity,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["carbon"] });
    },
  });
}
