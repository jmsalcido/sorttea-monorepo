import { ApiClient } from "@/lib/api";

/**
 * Interface for giveaway verification rules
 */
export interface GiveawayRule {
  mustFollow: boolean;  // maps to verify_follow in backend
  mustLike: boolean;    // maps to verify_like in backend
  mustComment: boolean; // maps to verify_comment in backend
  mustTag: boolean;     // maps to verify_tags in backend
  requiredTagCount: number; // maps to required_tag_count in backend
}

/**
 * Interface for Instagram-specific settings
 */
export interface InstagramSettings {
  accountToFollow: string;    // maps to instagram_account_to_follow in backend
  postToLike: string;         // maps to instagram_post_to_like in backend
  postToComment: string;      // maps to instagram_post_to_comment in backend
}

/**
 * Interface for a complete giveaway
 */
export interface Giveaway {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "paused" | "ended";
  startDate: string;
  endDate: string;
  prizeDescription: string;
  winnerCount: number;
  
  // Instagram-specific fields
  instagramSettings: InstagramSettings;
  
  // Verification rules
  rules: GiveawayRule;
  
  // Statistics
  participants: number;
  verifiedParticipants?: number;
  
  // Media
  imageUrl?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for creating a new giveaway
 */
export interface CreateGiveawayInput {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  prize_description: string;
  winner_count?: number;
  
  // Instagram-specific fields
  instagram_account_to_follow?: string;
  instagram_post_to_like?: string;
  instagram_post_to_comment?: string;
  required_tag_count?: number;
  
  // Verification rules
  verify_follow?: boolean;
  verify_like?: boolean;
  verify_comment?: boolean;
  verify_tags?: boolean;
  
  // Status
  status?: "draft" | "active" | "paused" | "ended";
  
  // Media
  image_url?: string;
}

/**
 * Interface for updating an existing giveaway
 */
export interface UpdateGiveawayInput {
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  prize_description?: string;
  winner_count?: number;
  
  // Instagram-specific fields
  instagram_account_to_follow?: string;
  instagram_post_to_like?: string;
  instagram_post_to_comment?: string;
  required_tag_count?: number;
  
  // Verification rules
  verify_follow?: boolean;
  verify_like?: boolean;
  verify_comment?: boolean;
  verify_tags?: boolean;
  
  // Status
  status?: "draft" | "active" | "paused" | "ended";
  
  // Media
  image_url?: string;
}

/**
 * Service for interacting with giveaway-related endpoints
 */
export class GiveawayService {
  public apiClient: ApiClient;
  
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
      mustTag: apiGiveaway.verify_tags || false,
      requiredTagCount: apiGiveaway.required_tag_count || 0
    };
    
    // Return transformed giveaway
    return {
      id: apiGiveaway.id,
      title: apiGiveaway.title,
      description: apiGiveaway.description,
      status: apiGiveaway.status,
      startDate: apiGiveaway.start_date,
      endDate: apiGiveaway.end_date,
      prizeDescription: apiGiveaway.prize_description,
      winnerCount: apiGiveaway.winner_count || 0,
      instagramSettings: {
        accountToFollow: apiGiveaway.instagram_account_to_follow || '',
        postToLike: apiGiveaway.instagram_post_to_like || '',
        postToComment: apiGiveaway.instagram_post_to_comment || ''
      },
      rules: rules,
      participants: apiGiveaway.entry_count || 0,
      verifiedParticipants: apiGiveaway.verified_participants || 0,
      imageUrl: apiGiveaway.image_url,
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
    console.log('Creating giveaway with data:', data);
    
    // Format the input data to match what the backend expects
    const formattedData = {
      ...data,
      // Make sure all the fields are properly formatted for the backend
    };
    
    const response = await this.apiClient.post<any>('/giveaway/giveaways/', formattedData);
    return this.transformGiveaway(response);
  }

  /**
   * Update an existing giveaway
   */
  async updateGiveaway(id: string, data: UpdateGiveawayInput): Promise<Giveaway> {
    console.log('Updating giveaway with data:', data);
    
    // Format the input data to match what the backend expects
    const formattedData = {
      ...data,
      // Make sure all the fields are properly formatted for the backend
    };
    
    const response = await this.apiClient.put<any>(`/giveaway/giveaways/${id}/`, formattedData);
    return this.transformGiveaway(response);
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