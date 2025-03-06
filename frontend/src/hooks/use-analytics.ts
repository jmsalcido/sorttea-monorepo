import { useQuery } from "@tanstack/react-query";
import { AnalyticsService, AnalyticsPeriod } from "@/services/analytics.service";
import { toast } from "sonner";

const analyticsService = new AnalyticsService();

/**
 * Hook for fetching overview statistics
 */
export function useOverviewStats(period?: AnalyticsPeriod) {
  return useQuery({
    queryKey: ["analytics", "overview", period],
    queryFn: () => analyticsService.getOverviewStats(period),
  });
}

/**
 * Hook for fetching timeseries data
 */
export function useTimeseriesData(period?: AnalyticsPeriod) {
  return useQuery({
    queryKey: ["analytics", "timeseries", period],
    queryFn: () => analyticsService.getTimeseriesData(period),
  });
}

/**
 * Hook for fetching top performing giveaways
 */
export function useTopGiveaways(limit: number = 5) {
  return useQuery({
    queryKey: ["analytics", "top-giveaways", limit],
    queryFn: () => analyticsService.getTopGiveaways(limit),
  });
}

/**
 * Hook for fetching engagement breakdown
 */
export function useEngagementBreakdown() {
  return useQuery({
    queryKey: ["analytics", "engagement-breakdown"],
    queryFn: () => analyticsService.getEngagementBreakdown(),
  });
}

/**
 * Hook for fetching participant demographics
 */
export function useParticipantDemographics() {
  return useQuery({
    queryKey: ["analytics", "participant-demographics"],
    queryFn: () => analyticsService.getParticipantDemographics(),
  });
}

/**
 * Function to export analytics report
 * This doesn't use React Query because it's a direct download
 */
export async function exportAnalyticsReport(period?: AnalyticsPeriod, format: 'csv' | 'pdf' = 'csv') {
  try {
    const blob = await analyticsService.exportReport(period, format);
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report.${format}`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`Report exported successfully as ${format.toUpperCase()}`);
  } catch (error: any) {
    toast.error(`Failed to export report: ${error.message || 'Unknown error'}`);
  }
} 