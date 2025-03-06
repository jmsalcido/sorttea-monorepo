import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService, UpdateProfileInput } from "@/services/user.service";
import { toast } from "sonner";

const userService = new UserService();

/**
 * Hook for fetching the current user's profile
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => userService.getProfile(),
  });
}

/**
 * Hook for updating the user's profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["user", "profile"], updatedProfile);
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message || 'Unknown error'}`);
    },
  });
}

/**
 * Hook for connecting Instagram account
 */
export function useConnectInstagram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (accessToken: string) => userService.connectInstagram(accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("Instagram account connected successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to connect Instagram: ${error.message || 'Unknown error'}`);
    },
  });
}

/**
 * Hook for disconnecting Instagram account
 */
export function useDisconnectInstagram() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userService.disconnectInstagram(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      toast.success("Instagram account disconnected");
    },
    onError: (error: any) => {
      toast.error(`Failed to disconnect Instagram: ${error.message || 'Unknown error'}`);
    },
  });
}

/**
 * Hook for fetching all users (admin only)
 */
export function useUsers(params?: { role?: string; limit?: number; page?: number }) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => userService.getUsers(params),
  });
}

/**
 * Hook for updating a user's role (admin only)
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "moderator" | "user" }) => 
      userService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: any) => {
      toast.error(`Failed to update user role: ${error.message || 'Unknown error'}`);
    },
  });
} 