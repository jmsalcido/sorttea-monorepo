"use client";

import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InstagramAuthSuccess() {
  const router = useRouter();

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  // Close the popup window if this page is opened in a popup
  useEffect(() => {
    if (window.opener) {
      // Notify the opener that connection was successful
      window.opener.postMessage({ type: 'INSTAGRAM_AUTH_SUCCESS' }, window.location.origin);
      
      // Close the popup after a short delay
      setTimeout(() => window.close(), 1000);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Instagram className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Successfully Connected!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Your Instagram account has been successfully connected to SortTea. You can now create and manage giveaways with Instagram integration.
          </p>
          <p className="text-sm text-muted-foreground">
            You will be redirected to the dashboard automatically in a few seconds.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 