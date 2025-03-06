"use client";

import { useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error") || "";

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

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
          <CardTitle className="text-2xl font-bold">Welcome to SortTea</CardTitle>
          <CardDescription>Sign in to manage your giveaways</CardDescription>
          {error && (
            <div className="p-2 mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded">
              {error === "OAuthSignin" && "Error starting OAuth sign in. Please try again."}
              {error === "OAuthCallback" && "Error completing OAuth sign in. Please try again."}
              {error === "AccessDenied" && "You do not have permission to sign in."}
              {error === "default" && "An error occurred. Please try again."}
            </div>
          )}
        </CardHeader>
        <CardContent className="grid gap-4">
          {providers && Object.values(providers).map((provider: any) => (
            <Button
              key={provider.id}
              variant="outline"
              className="w-full"
              onClick={() => signIn(provider.id, { callbackUrl })}
            >
              {provider.id === "google" && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              )}
              {provider.id === "facebook" && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path
                    fill="currentColor"
                    d="M9.101,23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085,1.848-5.978,5.858-5.978c0.401,0,0.955,0.042,1.569,0.103 v3.294h-1.198c-1.323,0-2.126,0.54-2.126,2.033v1.127h3.002l-0.564,3.667h-2.438v7.98H9.101z"
                  />
                </svg>
              )}
              Sign in with {provider.name}
            </Button>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-xs text-center text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 