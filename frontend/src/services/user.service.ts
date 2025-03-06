import { ApiClient } from "@/lib/api";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  instagramUsername?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  instagramUsername?: string;
  imageUrl?: string;
}

/**
 * Service for interacting with user-related endpoints
 */
export class UserService {
  private apiClient: ApiClient;
  
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    return this.apiClient.get<UserProfile>('/accounts/users/me/');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileInput): Promise<UserProfile> {
    return this.apiClient.patch<UserProfile>('/accounts/users/me/', data);
  }

  /**
   * Connect Instagram account
   */
  async connectInstagram(accessToken: string): Promise<{ success: boolean }> {
    return this.apiClient.post<{ success: boolean }>('/accounts/users/me/connect-instagram/', { accessToken });
  }

  /**
   * Disconnect Instagram account
   */
  async disconnectInstagram(): Promise<{ success: boolean }> {
    return this.apiClient.post<{ success: boolean }>('/accounts/users/me/disconnect-instagram/', {});
  }

  /**
   * Get all users (admin only)
   */
  async getUsers(params?: { role?: string; limit?: number; page?: number }): Promise<{ users: UserProfile[]; total: number }> {
    const queryParams: Record<string, string> = {};
    
    if (params?.role) {
      queryParams.role = params.role;
    }
    
    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }
    
    if (params?.page) {
      queryParams.page = params.page.toString();
    }
    
    return this.apiClient.get<{ users: UserProfile[]; total: number }>('/accounts/admin/users/', queryParams);
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: "admin" | "moderator" | "user"): Promise<UserProfile> {
    return this.apiClient.patch<UserProfile>(`/accounts/admin/users/${userId}/role/`, { role });
  }
} 