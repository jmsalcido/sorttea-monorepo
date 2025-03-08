import { ApiClient } from "@/lib/api";

export interface GiveawayRule {
  mustFollow: boolean;
  mustLike: boolean;
  mustComment: boolean;
  mustTag: number;
}

export interface Giveaway {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "paused" | "ended";
  startDate: string;
  endDate: string;
  rules: GiveawayRule;
  participants: number;
  imageUrl?: string;
  instagramPostUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGiveawayInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  prize_description: string;
  rules: GiveawayRule;
  status?: "draft" | "active" | "paused" | "ended";
  instagramPostUrl?: string;
  imageUrl?: string;
}

export interface UpdateGiveawayInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  rules?: Partial<GiveawayRule>;
  status?: "draft" | "active" | "paused" | "ended";
  instagramPostUrl?: string;
  imageUrl?: string;
}

/**
 * Service for interacting with giveaway-related endpoints
 */
export class GiveawayService {
  private apiClient: ApiClient;
  
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Get all giveaways
   */
  async getGiveaways(params?: { status?: string; limit?: number; page?: number }): Promise<{ giveaways: Giveaway[]; total: number }> {
    const queryParams: Record<string, string> = {};
    
    if (params?.status) {
      queryParams.status = params.status;
    }
    
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    
    if (params?.page) {
      queryParams.page = params.page.toString();
    }
    
    // Log API request
    console.log('Fetching giveaways with params:', queryParams);
    
    const response = await this.apiClient.get<any>('/giveaway/giveaways/', queryParams);
    
    // Log raw API response
    console.log('Raw API response:', JSON.stringify(response, null, 2));
    
    // If the response doesn't match the expected structure, transform it
    if (!response.giveaways && Array.isArray(response.results)) {
      console.log('Transforming response format');
      return {
        giveaways: response.results.map((item: any) => this.transformGiveaway(item)),
        total: response.count || response.results.length
      };
    }
    
    return response;
  }

  // Helper method to transform API response to expected format
  private transformGiveaway(apiGiveaway: any): Giveaway {
    // Log the transformation
    console.log('Transforming giveaway:', apiGiveaway);
    
    // Extract rules from API response or create default
    const rules: GiveawayRule = {
      mustFollow: apiGiveaway.verify_follow || false,
      mustLike: apiGiveaway.verify_like || false,
      mustComment: apiGiveaway.verify_comment || false,
      mustTag: apiGiveaway.required_tag_count || 0
    };
    
    // Return transformed giveaway
    return {
      id: apiGiveaway.id,
      title: apiGiveaway.title,
      description: apiGiveaway.description,
      status: apiGiveaway.status,
      startDate: apiGiveaway.start_date,
      endDate: apiGiveaway.end_date,
      rules: rules,
      participants: apiGiveaway.entry_count || 0,
      imageUrl: apiGiveaway.image_url,
      instagramPostUrl: apiGiveaway.instagram_post_to_like,
      createdAt: apiGiveaway.created_at,
      updatedAt: apiGiveaway.updated_at
    };
  }

  /**
   * Get a single giveaway by ID
   */
  async getGiveaway(id: string): Promise<Giveaway> {
    return this.apiClient.get<Giveaway>(`/giveaway/giveaways/${id}/`);
  }

  /**
   * Create a new giveaway
   */
  async createGiveaway(data: CreateGiveawayInput): Promise<Giveaway> {
    return this.apiClient.post<Giveaway>('/giveaway/giveaways/', data);
  }

  /**
   * Update an existing giveaway
   */
  async updateGiveaway(id: string, data: UpdateGiveawayInput): Promise<Giveaway> {
    return this.apiClient.put<Giveaway>(`/giveaway/giveaways/${id}/`, data);
  }

  /**
   * Delete a giveaway
   */
  async deleteGiveaway(id: string): Promise<{ success: boolean }> {
    return this.apiClient.delete<{ success: boolean }>(`/giveaway/giveaways/${id}/`);
  }

  /**
   * Get participants for a giveaway
   */
  async getParticipants(giveawayId: string, params?: { verified?: boolean; page?: number; limit?: number }): Promise<any> {
    const queryParams: Record<string, string> = {};
    
    if (params?.verified !== undefined) {
      queryParams.verified = params.verified.toString();
    }
    
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    
    if (params?.page) {
      queryParams.page = params.page.toString();
    }
    
    return this.apiClient.get<any>(`/giveaway/giveaways/${giveawayId}/participants/`, queryParams);
  }

  /**
   * Select winners for a giveaway
   */
  async selectWinners(giveawayId: string, count: number): Promise<any> {
    return this.apiClient.post<any>(`/giveaway/giveaways/${giveawayId}/winners/`, { count });
  }

  /**
   * Get analytics for a giveaway
   */
  async getAnalytics(giveawayId: string): Promise<any> {
    return this.apiClient.get<any>(`/giveaway/giveaways/${giveawayId}/analytics/`);
  }
} 