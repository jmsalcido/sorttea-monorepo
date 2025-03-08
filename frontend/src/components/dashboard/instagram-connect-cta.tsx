"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, AlertCircle } from "lucide-react";
import { useConnectInstagram, useUserProfile } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface InstagramConnectCTAProps {
  showAsButton?: boolean;
}

// Remove the diagnostic types
export function InstagramConnectCTA({ showAsButton = false }: InstagramConnectCTAProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: profile, isLoading } = useUserProfile();
  const connectInstagram = useConnectInstagram();
  const queryClient = useQueryClient();

  // Listen for postMessage from popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return;

      // Handle successful connection
      if (event.data.type === 'INSTAGRAM_AUTH_SUCCESS') {
        setIsConnecting(false);
        setError(null);
        toast.success("Instagram account connected successfully!");
        // Refresh user profile data
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      }

      // Handle connection failure
      if (event.data.type === 'INSTAGRAM_AUTH_ERROR') {
        setIsConnecting(false);
        const errorMsg = event.data.error || 'Unknown error';
        setError(errorMsg);
        toast.error(`Failed to connect Instagram: ${errorMsg}`);
      }
    };

    // Add event listener
    window.addEventListener('message', handleMessage);

    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [queryClient]);

  // Don't show if profile is still loading or Instagram is already connected
  if (isLoading) {
    return showAsButton ? <Button disabled><Skeleton className="h-4 w-24" /></Button> : null;
  }
  
  // If Instagram is already connected, don't show anything
  if (profile?.instagramUsername) {
    return null;
  }

  const handleConnectInstagram = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Get auth URL from the backend
      const response = await fetch('/api/instagram/auth-url');
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        
        // Show detailed error message with status code if available
        const statusCode = errorData.statusCode || response.status;
        const errorMsg = errorData.error || `Server error: ${response.status}`;
        
        // Create a more informative error message with debugging tips
        let detailedError = `${errorMsg} (Status: ${statusCode})`;
        
        // Add specific error handling for common status codes
        if (statusCode === 403) {
          detailedError += " - This may be an authentication issue. Your session might have expired or you may not have the required permissions.";
        } else if (statusCode === 404) {
          detailedError += " - The requested endpoint could not be found. This may be a configuration issue.";
        } else if (statusCode === 500) {
          detailedError += " - The server encountered an error. Check backend logs for more details.";
        }
        
        throw new Error(detailedError);
      }
      
      const data = await response.json();
      
      if (data.auth_url) {
        // Open Instagram OAuth flow in a popup window
        const popupWindow = window.open(
          data.auth_url, 
          'instagram-oauth', 
          'width=600,height=700,menubar=no,toolbar=no,location=no'
        );
        
        // Check if popup was blocked
        if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
          setIsConnecting(false);
          setError("Popup was blocked");
          toast.error("Popup was blocked. Please allow popups for this site.");
        }
      } else {
        throw new Error("No authorization URL returned from the server");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get Instagram auth URL:', errorMessage);
      setError(errorMessage);
      toast.error(`Instagram connection failed: ${errorMessage}`);
      setIsConnecting(false);
    }
  };

  // Update handleDirectConnect method with a more reliable approach
  const handleDirectConnect = () => {
    setIsConnecting(true);
    setError(null);
    
    // Show a more detailed error with steps to connect manually
    setError("Manual connection required: Please follow these steps to connect your Instagram account");
    
    // Reset the connecting state
    setIsConnecting(false);
  };

  // Remove runTokenDiagnostics function

  if (showAsButton) {
    return (
      <Button
        variant="outline"
        onClick={handleConnectInstagram}
        disabled={isConnecting}
        className="whitespace-nowrap"
      >
        {isConnecting ? (
          "Connecting..."
        ) : (
          <>
            <Instagram className="mr-2 h-4 w-4" />
            Connect Instagram
          </>
        )}
      </Button>
    );
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20 mb-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl flex items-center gap-2">
          <Instagram className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          Connect Your Instagram Account
        </CardTitle>
        <CardDescription>
          Link your Instagram account to manage your giveaways effectively
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Connecting your Instagram account allows SortTea to verify entries, track engagement, and manage giveaway participants. Your data is kept private and secure.
        </p>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>
                {error.includes("Manual connection required") ? "Manual Connection Required" : `Error: ${error}`}
              </span>
            </div>
            
            {error.includes("Manual connection required") ? (
              <div className="text-xs mt-2 space-y-2">
                <p>To connect your Instagram account, please follow these steps:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Sign in to the admin panel (contact your admin for access)</li>
                  <li>Navigate to "Instagram Accounts" section</li>
                  <li>Click "Add Instagram Account" button</li>
                  <li>Follow the authentication process</li>
                  <li>After connecting, return to this dashboard</li>
                </ol>
                <p className="mt-2 text-muted-foreground">
                  This manual method bypasses the authentication issues you're experiencing.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mt-1">
                {error.includes('403') ? (
                  <>
                    Authentication error detected. This may happen if your session token is not being recognized by the backend. 
                    <button 
                      onClick={() => window.open('/api/auth/signin', '_blank')}
                      className="text-blue-600 dark:text-blue-400 ml-1 underline"
                    >
                      Try signing in again
                    </button>
                  </>
                ) : (
                  "Please try again or contact support if this problem persists."
                )}
              </p>
            )}
          </div>
        )}
        
        {/* Remove Diagnostic Results Section */}
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={handleConnectInstagram} 
          disabled={isConnecting}
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 self-start"
        >
          {isConnecting ? (
            <>
              <Instagram className="mr-2 h-4 w-4 animate-pulse" />
              Connecting...
            </>
          ) : (
            <>
              <Instagram className="mr-2 h-4 w-4" />
              Connect Instagram
            </>
          )}
        </Button>
        
        <div className="flex w-full">
          {error?.includes('403') && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>Having trouble?</span>
              <button 
                onClick={handleDirectConnect} 
                className="text-blue-600 dark:text-blue-400 underline"
                disabled={isConnecting}
              >
                Try direct connection
              </button>
            </div>
          )}
          
          {/* Remove Diagnose Token button */}
        </div>
      </CardFooter>
    </Card>
  );
} 