import { ApiClient } from "@/lib/api";

export interface Participant {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  email?: string;
  giveawayCount: number;
  isVerified: boolean;
  joinedAt?: string;
  lastParticipatedAt?: string;
}

export interface ParticipantsResponse {
  participants: Participant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ParticipantService {
  private apiClient: ApiClient;
  private useMockData: boolean;

  constructor() {
    this.apiClient = new ApiClient();
    // Set to false when backend endpoint is ready
    this.useMockData = true;
  }

  /**
   * Get all participants across giveaways
   */
  async getAllParticipants(params?: { 
    page?: number; 
    limit?: number;
    verified?: boolean;
  }): Promise<ParticipantsResponse> {
    if (this.useMockData) {
      // Import mock data dynamically to avoid bundling in production
      const { mockParticipants } = await import("@/app/(dashboard)/participants/mock-data");
      
      // Apply pagination and filtering
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const verified = params?.verified;
      
      let filteredParticipants = [...mockParticipants];
      
      // Apply verified filter if specified
      if (verified !== undefined) {
        filteredParticipants = filteredParticipants.filter(p => p.isVerified === verified);
      }
      
      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedItems = filteredParticipants.slice(startIndex, endIndex);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        participants: paginatedItems,
        total: filteredParticipants.length,
        page,
        limit,
        totalPages: Math.ceil(filteredParticipants.length / limit)
      };
    }
    
    // Real API call for when backend is ready
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
    
    return this.apiClient.get<ParticipantsResponse>('/giveaway/participants/', queryParams);
  }

  /**
   * Get participant details
   */
  async getParticipantDetails(participantId: string): Promise<Participant> {
    if (this.useMockData) {
      // Import mock data dynamically
      const { mockParticipants } = await import("@/app/(dashboard)/participants/mock-data");
      
      // Find participant by ID
      const participant = mockParticipants.find(p => p.id === participantId);
      
      if (!participant) {
        throw new Error(`Participant with ID ${participantId} not found`);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return participant;
    }
    
    return this.apiClient.get<Participant>(`/giveaway/participants/${participantId}/`);
  }
}

// Export a singleton instance
export const participantService = new ParticipantService(); 