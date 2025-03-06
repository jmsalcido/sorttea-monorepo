import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GiveawayService, Giveaway, CreateGiveawayInput, UpdateGiveawayInput } from "@/services/giveaway.service";
import { toast } from "sonner";

const giveawayService = new GiveawayService();

/**
 * Hook for fetching all giveaways
 */
export function useGiveaways(params?: { status?: string; limit?: number; page?: number }) {
  return useQuery({
    queryKey: ["giveaways", params],
    queryFn: () => giveawayService.getGiveaways(params),
  });
}

/**
 * Hook for fetching a single giveaway by ID
 */
export function useGiveaway(id: string) {
  return useQuery({
    queryKey: ["giveaway", id],
    queryFn: () => giveawayService.getGiveaway(id),
    enabled: !!id, // Only run the query if an ID is provided
  });
}

/**
 * Hook for creating a new giveaway
 */
export function useCreateGiveaway() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateGiveawayInput) => giveawayService.createGiveaway(data),
    onSuccess: () => {
      // Invalidate the giveaways list query to refetch it
      queryClient.invalidateQueries({ queryKey: ["giveaways"] });
      toast.success("Giveaway created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create giveaway: ${error.message}`);
    },
  });
}

/**
 * Hook for updating an existing giveaway
 */
export function useUpdateGiveaway(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateGiveawayInput) => giveawayService.updateGiveaway(id, data),
    onSuccess: (updatedGiveaway) => {
      // Update both the list and the individual giveaway queries
      queryClient.invalidateQueries({ queryKey: ["giveaways"] });
      queryClient.setQueryData(["giveaway", id], updatedGiveaway);
      toast.success("Giveaway updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update giveaway: ${error.message}`);
    },
  });
}

/**
 * Hook for deleting a giveaway
 */
export function useDeleteGiveaway() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => giveawayService.deleteGiveaway(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giveaways"] });
      toast.success("Giveaway deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete giveaway: ${error.message}`);
    },
  });
}

/**
 * Hook for fetching giveaway participants
 */
export function useGiveawayParticipants(
  giveawayId: string,
  params?: { verified?: boolean; page?: number; limit?: number }
) {
  return useQuery({
    queryKey: ["giveaway", giveawayId, "participants", params],
    queryFn: () => giveawayService.getParticipants(giveawayId, params),
    enabled: !!giveawayId, // Only run the query if a giveaway ID is provided
  });
}

/**
 * Hook for selecting winners for a giveaway
 */
export function useSelectWinners(giveawayId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (count: number) => giveawayService.selectWinners(giveawayId, count),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["giveaway", giveawayId] });
      queryClient.invalidateQueries({ queryKey: ["giveaway", giveawayId, "participants"] });
      toast.success("Winners selected successfully");
    },
    onError: (error) => {
      toast.error(`Failed to select winners: ${error.message}`);
    },
  });
}

/**
 * Hook for fetching giveaway analytics
 */
export function useGiveawayAnalytics(giveawayId: string) {
  return useQuery({
    queryKey: ["giveaway", giveawayId, "analytics"],
    queryFn: () => giveawayService.getAnalytics(giveawayId),
    enabled: !!giveawayId, // Only run the query if a giveaway ID is provided
  });
} 