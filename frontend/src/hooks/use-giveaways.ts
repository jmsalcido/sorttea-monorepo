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
    queryFn: async () => {
      try {
        // First check if the API is reachable
        try {
          await giveawayService.apiClient.checkHealth();
          console.log('API is reachable, proceeding with giveaways request');
        } catch (healthError) {
          console.error('API health check failed, still attempting giveaways request:', healthError);
        }
        
        return await giveawayService.getGiveaways(params);
      } catch (error) {
        console.error('Failed to fetch giveaways:', error);
        
        // Check authentication status
        try {
          const session = await import('next-auth/react').then(mod => mod.getSession());
          console.log('Current session:', session ? 'Active' : 'None', session);
        } catch (sessionError) {
          console.error('Error checking session:', sessionError);
        }
        
        throw error;
      }
    },
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

/**
 * Hook for fetching upcoming giveaways (starting in the next 7 days)
 */
export function useUpcomingGiveaways(limit: number = 5) {
  return useQuery({
    queryKey: ["upcomingGiveaways", limit],
    queryFn: async () => {
      try {
        // First check if the API is reachable
        try {
          await giveawayService.apiClient.checkHealth();
          console.log('API is reachable, proceeding with upcoming giveaways request');
        } catch (healthError) {
          console.error('API health check failed, still attempting upcoming giveaways request:', healthError);
        }
        
        // Make separate requests for each status
        // Get draft giveaways
        const draftGiveawaysPromise = giveawayService.getGiveaways({ 
          status: 'draft',
          limit: 50 // Get a reasonable number to filter from
        });
        
        // Get active giveaways
        const activeGiveawaysPromise = giveawayService.getGiveaways({ 
          status: 'active',
          limit: 50 // Get a reasonable number to filter from
        });
        
        // Get paused giveaways
        const pausedGiveawaysPromise = giveawayService.getGiveaways({ 
          status: 'paused',
          limit: 50 // Get a reasonable number to filter from
        });
        
        // Wait for all requests to complete
        const [draftGiveaways, activeGiveaways, pausedGiveaways] = await Promise.all([
          draftGiveawaysPromise,
          activeGiveawaysPromise,
          pausedGiveawaysPromise
        ]);
        
        // Combine the results
        const allGiveaways = [
          ...(draftGiveaways.giveaways || []),
          ...(activeGiveaways.giveaways || []),
          ...(pausedGiveaways.giveaways || [])
        ];
        
        console.log(`Found ${draftGiveaways.giveaways?.length || 0} draft, ${activeGiveaways.giveaways?.length || 0} active, and ${pausedGiveaways.giveaways?.length || 0} paused giveaways`);
        
        // Debug giveaway dates
        if (allGiveaways.length > 0) {
          console.log('Sample giveaway dates:');
          allGiveaways.slice(0, 3).forEach((giveaway, index) => {
            console.log(`Giveaway ${index + 1}: '${giveaway.title}', startDate = '${giveaway.startDate}', parsed = ${new Date(giveaway.startDate).toISOString()}`);
          });
        }
        
        // Calculate the date range (next 7 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7); // 7 days from now
        nextWeek.setHours(23, 59, 59, 999); // End of the 7th day
        
        console.log(`Date filter range: ${today.toISOString()} to ${nextWeek.toISOString()}`);
        
        // Filter giveaways to those starting in the next 7 days (or already started but still running)
        const upcomingGiveaways = allGiveaways.filter(giveaway => {
          const startDate = new Date(giveaway.startDate);
          // Include if start date is between today and next week
          const isUpcoming = startDate >= today && startDate <= nextWeek;
          if (isUpcoming) {
            console.log(`Found upcoming giveaway: '${giveaway.title}', startDate = ${startDate.toISOString()}`);
          }
          return isUpcoming;
        });
        
        console.log(`Filtered to ${upcomingGiveaways.length} giveaways starting in the next 7 days`);
        
        // Sort by start date (closest first)
        upcomingGiveaways.sort((a, b) => {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
        
        // Limit the results
        const limitedResults = upcomingGiveaways.slice(0, limit);
        
        return {
          giveaways: limitedResults,
          total: upcomingGiveaways.length
        };
      } catch (error) {
        console.error('Failed to fetch upcoming giveaways:', error);
        throw error;
      }
    },
  });
} 