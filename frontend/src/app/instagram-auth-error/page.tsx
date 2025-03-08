"use client";

import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function InstagramAuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Unknown error";

  // Auto redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  // Close the popup window if this page is opened in a popup
  useEffect(() => {
    if (window.opener) {
      // Notify the opener that connection failed
      window.opener.postMessage({ type: 'INSTAGRAM_AUTH_ERROR', error }, window.location.origin);
      
      // Close the popup after a short delay
      setTimeout(() => window.close(), 1000);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full border-red-200 dark:border-red-800">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Connection Failed</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-4">
            {error === "access_denied" 
              ? "Instagram access was denied. This may happen if you cancel the authorization process."
              : `An error occurred while connecting your Instagram account: ${error}`
            }
          </p>
          <p className="text-sm text-muted-foreground">
            You can try again by returning to the dashboard and clicking on "Connect Instagram" again.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button variant="outline">Return to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 