import { useQuery } from "@tanstack/react-query";
import { participantService } from "@/services/participant.service";
import { toast } from "sonner";

/**
 * Hook for fetching all participants across giveaways
 */
export function useAllParticipants(params?: { 
  page?: number; 
  limit?: number;
  verified?: boolean;
}) {
  return useQuery({
    queryKey: ["participants", params],
    queryFn: async () => {
      try {
        return await participantService.getAllParticipants(params);
      } catch (error) {
        toast.error("Failed to load participants. Please try again.");
        throw error;
      }
    },
  });
}

/**
 * Hook for fetching participant details
 */
export function useParticipantDetails(participantId: string) {
  return useQuery({
    queryKey: ["participant", participantId],
    queryFn: async () => {
      try {
        return await participantService.getParticipantDetails(participantId);
      } catch (error) {
        toast.error("Failed to load participant details. Please try again.");
        throw error;
      }
    },
    enabled: !!participantId,
  });
} 