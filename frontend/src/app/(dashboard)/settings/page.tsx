"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import { useUserProfile, useUpdateProfile, useDisconnectInstagram } from "@/hooks/use-user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { InstagramConnectCTA } from "@/components/dashboard/instagram-connect-cta";
import { Instagram, User, UserCircle2, Settings2, AlertTriangle } from "lucide-react";

// Validation schema for profile form
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  imageUrl: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => {
        if (!val) return true;
        return val.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null || val.startsWith('https://');
      },
      {
        message: "URL must be an image (jpeg, jpg, gif, png, webp) or a secure HTTPS URL.",
      }
    ),
  bio: z.string().max(500, {
    message: "Bio must be at most 500 characters.",
  }).optional().or(z.literal("")),
  website: z.string().url({ 
    message: "Please enter a valid URL." 
  }).optional().or(z.literal(""))
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Add a helper function to extract profile information
const extractProfileData = (profile: any) => {
  return {
    name: profile?.name || profile?.profile?.display_name || profile?.username || '',
    imageUrl: profile?.imageUrl || profile?.profile?.provider_image_url || '',
    bio: profile?.bio || profile?.profile?.bio || '',
    website: profile?.website || profile?.profile?.website || '',
  };
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const disconnectInstagram = useDisconnectInstagram();
  
  const [isEmailChangeOpen, setIsEmailChangeOpen] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  
  // Setup form with default values from profile
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      bio: '',
      website: '',
    },
    values: profile ? extractProfileData(profile) : undefined,
  });
  
  // Function to update profile
  function onSubmit(data: ProfileFormValues) {
    const updatedData = {
      name: data.name,
      imageUrl: data.imageUrl,
      bio: data.bio,
      website: data.website,
    };
    
    updateProfile.mutate(updatedData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
    });
  }
  
  // Function to disconnect Instagram
  const handleDisconnectInstagram = () => {
    if (confirm("Are you sure you want to disconnect your Instagram account?")) {
      disconnectInstagram.mutate();
    }
  };
  
  // Update the useEffect that preloads avatar images
  useEffect(() => {
    if (profile) {
      const profileData = extractProfileData(profile);
      if (profileData.imageUrl) {
        setAvatarLoading(true);
        setAvatarError(false);
        
        const img = new Image();
        img.src = profileData.imageUrl;
        
        img.onload = () => {
          setAvatarLoading(false);
        };
        
        img.onerror = () => {
          setAvatarLoading(false);
          setAvatarError(true);
        };
      }
    }
  }, [profile]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <UserCircle2 className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="connections" className="gap-2">
            <Instagram className="h-4 w-4" />
            <span>Connections</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile information and how others see you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[300px]" />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="relative group">
                          <Avatar className="h-20 w-20 border-2 border-gray-200 dark:border-gray-800">
                            {extractProfileData(profile).imageUrl && !avatarError ? (
                              <>
                                <AvatarImage 
                                  src={extractProfileData(profile).imageUrl} 
                                  alt={extractProfileData(profile).name || "User avatar"} 
                                  className="object-cover"
                                  onLoad={() => setAvatarLoading(false)}
                                  onError={() => {
                                    setAvatarLoading(false);
                                    setAvatarError(true);
                                  }}
                                />
                                {avatarLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                                    <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  </div>
                                )}
                              </>
                            ) : (
                              <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                {extractProfileData(profile)?.name?.charAt(0)?.toUpperCase() || "U"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-default">
                            <span className="text-white text-xs">Profile Picture</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center max-w-[100px]">
                          Enter image URL in the field below
                        </p>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is your public display name.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/your-photo.jpg" 
                                  {...field} 
                                  className={field.value ? "pr-10" : ""}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Enter a direct link to an image file (JPG, PNG, GIF, WEBP) for your profile picture.
                              </FormDescription>
                              {field.value && (
                                <div className="mt-2 text-xs flex items-center">
                                  <span className="text-blue-600 dark:text-blue-400">Preview:</span>
                                  <div className="ml-2 h-6 w-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                    <img 
                                      src={field.value} 
                                      alt="Preview" 
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNy4yNSA0LjI1SDguNzVWNS43NUg3LjI1VjQuMjVaTTcuMjUgNy4yNUg4Ljc1VjExLjc1SDcuMjVWNy4yNVpNOCAxNEMzLjU5IDE0IDAgMTAuNDEgMCA2QzAgMS41OSAzLjU5IC0yIDE5LTIyIDhhOCAwIDAgMCAwIDE2Wk04IDEuNUEzLjc1IDMuNzUgMCAwIDAgNCA1LjI1IDMuNzUgMy43NSAwIDAgMCA4IDlhMy43NSAzLjc1IDAgMCAwIDQuMjUtNC4yNUEzLjc1IDMuNzUgMCAwIDAgOCAxLjVaIiBmaWxsPSIjNjM2MzczIi8+PC9zdmc+';
                                        (e.target as HTMLImageElement).classList.add('error-img');
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <textarea
                                  placeholder="Tell us about yourself"
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                A brief description about yourself. This will be visible on your public profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://yourwebsite.com"
                                  type="url"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Your personal website or social media profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateProfile.isPending || !form.formState.isDirty}
                      >
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your account details and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-4 items-center">
                      <Input id="email" value={profile?.email || ""} readOnly className="bg-gray-50 dark:bg-gray-900" />
                      {/* Email change is typically handled through a more secure flow with verification */}
                      <Button variant="outline" size="sm" disabled className="whitespace-nowrap">
                        Change Email
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Email changes require verification and are not available in this demo.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Account Role</Label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md border flex justify-between items-center">
                      <span className="capitalize">{profile?.is_staff ? "admin" : "user"}</span>
                      <span className="text-xs text-muted-foreground">Role permissions are managed by administrators</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label>Account Created</Label>
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md border">
                      {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString() : "Unknown"}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="text-red-600 dark:text-red-400">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-red-600/80 dark:text-red-400/80">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Account deletion is disabled in this demo.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Connections Tab */}
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Connect your accounts to enhance functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-md">
                        <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      </div>
                      <div>
                        <p className="font-medium">Instagram</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.instagramUsername ? 
                            `Connected as @${profile.instagramUsername}` : 
                            "Not connected"
                          }
                        </p>
                      </div>
                    </div>
                    
                    {profile?.instagramUsername ? (
                      <Button 
                        variant="outline" 
                        onClick={handleDisconnectInstagram}
                        disabled={disconnectInstagram.isPending}
                      >
                        {disconnectInstagram.isPending ? "Disconnecting..." : "Disconnect"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const width = 600;
                          const height = 700;
                          const left = window.screen.width / 2 - width / 2;
                          const top = window.screen.height / 2 - height / 2;
                          
                          // Open Instagram auth popup
                          window.open(
                            '/api/auth/instagram',
                            'instagram-connect',
                            `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=no`
                          );
                        }}
                      >
                        <Instagram className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md">
                      <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">
                        Not connected
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-black p-2 rounded-md">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.986 6.38 6.38 0 01-1.631-3.308h.004l-1.09-.003v10.534c0 .667-.332 1.26-.839 1.622a2.194 2.194 0 01-1.296.42c-1.21 0-2.19-.98-2.19-2.19a2.19 2.19 0 011.713-2.137c.135-.028.273-.046.415-.049v-2.209c-.114 0-.227.008-.339.016a4.433 4.433 0 00-2.937 1.45 4.359 4.359 0 00-1.157 2.934c0 2.44 1.98 4.42 4.422 4.42a4.417 4.417 0 004.422-4.42V5.949c.714.573 1.516 1.015 2.585 1.215v-2.205a3.962 3.962 0 01-1.162-.626l.003.003.007-.01.63.008s.626-.64.61-.626"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">TikTok</p>
                      <p className="text-sm text-muted-foreground">
                        Not connected
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-md">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">
                        Not connected
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-md">
                      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">YouTube</p>
                      <p className="text-sm text-muted-foreground">
                        Not connected
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 