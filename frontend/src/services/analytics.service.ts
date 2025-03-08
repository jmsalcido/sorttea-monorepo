import { ApiClient } from "@/lib/api";
import { getSession } from "next-auth/react";

export interface AnalyticsPeriod {
  startDate: string;
  endDate: string;
}

export interface OverviewStats {
  totalGiveaways: number;
  activeGiveaways: number;
  totalParticipants: number;
  completionRate: number;
  totalEngagement: number;
}

export interface TimeseriesData {
  date: string;
  participants: number;
  engagement: number;
}

export interface TopGiveaway {
  id: string;
  title: string;
  participants: number;
  engagement: number;
  changePercent: number;
}

/**
 * Service for interacting with analytics-related endpoints
 */
export class AnalyticsService {
  private apiClient: ApiClient;
  
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Get overview statistics
   */
  async getOverviewStats(period?: AnalyticsPeriod): Promise<OverviewStats> {
    const queryParams: Record<string, string> = {};
    
    if (period?.startDate) {
      queryParams.startDate = period.startDate;
    }
    
    if (period?.endDate) {
      queryParams.endDate = period.endDate;
    }
    
    return this.apiClient.get<OverviewStats>('/analytics/overview/', queryParams);
  }

  /**
   * Get timeseries data for charts
   */
  async getTimeseriesData(period?: AnalyticsPeriod, useMockData: boolean = false): Promise<TimeseriesData[]> {
    const queryParams: Record<string, string> = {};
    
    if (period?.startDate) {
      queryParams.startDate = period.startDate;
    }
    
    if (period?.endDate) {
      queryParams.endDate = period.endDate;
    }
    
    // Add mock data parameter if requested
    if (useMockData && process.env.NODE_ENV === 'development') {
      queryParams.mock = 'true';
    }
    
    return this.apiClient.get<TimeseriesData[]>('/analytics/timeseries/', queryParams);
  }

  /**
   * Get top performing giveaways
   */
  async getTopGiveaways(limit: number = 5): Promise<TopGiveaway[]> {
    return this.apiClient.get<TopGiveaway[]>('/analytics/top-giveaways/', {
      limit: limit.toString()
    });
  }

  /**
   * Get engagement breakdown by type
   */
  async getEngagementBreakdown(): Promise<Record<string, number>> {
    return this.apiClient.get<Record<string, number>>('/analytics/engagement-breakdown/');
  }

  /**
   * Get participant demographics
   */
  async getParticipantDemographics(): Promise<any> {
    return this.apiClient.get<any>('/analytics/participant-demographics/');
  }

  /**
   * Export analytics report
   */
  async exportReport(period?: AnalyticsPeriod, format: 'csv' | 'pdf' = 'csv'): Promise<Blob> {
    const queryParams: Record<string, string> = {
      format
    };
    
    if (period?.startDate) {
      queryParams.startDate = period.startDate;
    }
    
    if (period?.endDate) {
      queryParams.endDate = period.endDate;
    }
    
    // Direct API call for downloading a blob
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const url = new URL(`${baseUrl}/analytics/export/`);
    
    // Add query parameters
    Object.keys(queryParams).forEach(key => 
      url.searchParams.append(key, queryParams[key])
    );
    
    // Get session from next-auth directly since we can't access the private method
    const session = await getSession();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to export report');
    }
    
    return response.blob();
  }
} 