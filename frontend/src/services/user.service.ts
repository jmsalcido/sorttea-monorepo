import { ApiClient } from "@/lib/api";

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  date_joined?: string;
  last_login?: string;
  instagramUsername?: string;
  imageUrl?: string;
  profile?: {
    id: string;
    display_name?: string;
    bio?: string;
    website?: string;
    auth_provider?: string;
    provider_user_id?: string;
    provider_profile_url?: string;
    provider_image_url?: string;
    last_login_provider?: string;
    has_instagram_connected?: boolean;
    created_at: string;
    updated_at: string;
  };
  instagram_account?: any;
  // Keep these for backwards compatibility with existing code
  role?: "admin" | "moderator" | "user";
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileInput {
  name?: string;
  instagramUsername?: string;
  imageUrl?: string;
  bio?: string;
  website?: string;
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
    // Format the data for the backend API
    const formattedData: Record<string, any> = {
      profile: {
        // Map from frontend field names to backend field names
        display_name: data.name,
        bio: data.bio,
        website: data.website
      }
    };
    
    // Keep imageUrl and instagramUsername separate as they may be handled differently
    if (data.imageUrl !== undefined) {
      formattedData.imageUrl = data.imageUrl;
    }
    
    if (data.instagramUsername !== undefined) {
      formattedData.instagramUsername = data.instagramUsername;
    }
    
    // Use the update_profile action endpoint defined in the UserViewSet
    return this.apiClient.patch<UserProfile>('/accounts/users/update_profile/', formattedData);
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