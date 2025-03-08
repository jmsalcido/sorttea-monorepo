"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGiveaway } from "@/hooks/use-giveaways";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditGiveawayPage() {
  const params = useParams();
  const router = useRouter();
  
  // Get ID and ensure it's properly decoded
  const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
  
  // Add validation for UUID format (basic validation)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  const { data: giveaway, isLoading, isError } = useGiveaway(id);
  
  // Show error for invalid UUID format
  if (!isValidUUID) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push('/giveaways')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Giveaways
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Invalid Giveaway ID</CardTitle>
            <CardDescription>
              The giveaway ID format is invalid.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please go back to the giveaways list and try again.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/giveaways")}
            >
              Return to Giveaways List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/5" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back to Giveaway
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Edit Giveaway</CardTitle>
          <CardDescription>
            Update your giveaway details and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The edit giveaway form will be implemented soon. For now, you can view the giveaway details or return to the giveaways list.
          </p>
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => router.push(`/giveaways/${id}`)}
            >
              View Giveaway Details
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/giveaways")}
            >
              Return to Giveaways List
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 