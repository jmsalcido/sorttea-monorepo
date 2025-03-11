"use client";

import { signOut } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// Loading component for Suspense
function SignOutLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-pulse h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardContent>
      </Card>
    </div>
  );
}

// Client component with hooks
function SignOutClient() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl });
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-4">
            <Image 
              src="/sorttea-logo.svg" 
              alt="SortTea Logo" 
              width={120} 
              height={120}
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            onClick={handleSignOut} 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing out..." : "Sign out"}
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-gray-500">
            You will be redirected after signing out.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Main component with Suspense
export default function SignOut() {
  return (
    <Suspense fallback={<SignOutLoading />}>
      <SignOutClient />
    </Suspense>
  );
} 