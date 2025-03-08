"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, CheckCircle, Globe, Instagram, Users, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate } from "@/lib/utils";
import { Giveaway } from "@/services/giveaway.service";
import { useGiveaway } from "@/hooks/use-giveaways";
import { Skeleton } from "@/components/ui/skeleton";

export default function GiveawayDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Get ID and ensure it's properly decoded
  const id = typeof params.id === 'string' ? decodeURIComponent(params.id) : '';
  
  // Add validation for UUID format (basic validation)
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  
  const { data: giveaway, isLoading, isError, error } = useGiveaway(id);
  
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
        
        <Alert variant="destructive">
          <AlertTitle>Invalid Giveaway ID</AlertTitle>
          <AlertDescription>
            The giveaway ID format is invalid. Please go back to the giveaways list and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (isLoading) {
    return <GiveawayDetailSkeleton />;
  }
  
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Giveaways
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load giveaway details: {(error as Error)?.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!giveaway) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Giveaways
          </Button>
        </div>
        
        <Alert>
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The giveaway you're looking for doesn't exist or has been deleted.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "ended":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back to Giveaways
          </Button>
          <Badge className={getStatusBadgeColor(giveaway.status)} variant="outline">
            {giveaway.status.charAt(0).toUpperCase() + giveaway.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.push(`/giveaways/${id}/edit`)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {giveaway.status === "draft" && (
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Globe className="h-4 w-4" />
              Launch Giveaway
            </Button>
          )}
          {giveaway.status === "paused" && (
            <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <PlayCircle className="h-4 w-4" />
              Resume Giveaway
            </Button>
          )}
          {giveaway.status === "active" && (
            <Button 
              variant="outline"
              className="flex items-center gap-2 text-yellow-600 border-yellow-600 hover:bg-yellow-50"
            >
              <PauseCircle className="h-4 w-4" />
              Pause Giveaway
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column - Main giveaway info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{giveaway.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(new Date(giveaway.startDate), { month: 'long', day: 'numeric', year: 'numeric' })} - 
                {formatDate(new Date(giveaway.endDate), { month: 'long', day: 'numeric', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{giveaway.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Prize</h3>
                <p className="text-muted-foreground whitespace-pre-line">{giveaway.prizeDescription}</p>
              </div>
              
              {giveaway.imageUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Giveaway Image</h3>
                  <img 
                    src={giveaway.imageUrl} 
                    alt={giveaway.title} 
                    className="rounded-md max-h-80 object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5 text-pink-500" />
                <CardTitle>Instagram Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Account to Follow</h3>
                  <p className="font-medium">
                    {giveaway.instagramSettings.accountToFollow || 'Not specified'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Post to Like</h3>
                  {giveaway.instagramSettings.postToLike ? (
                    <a 
                      href={giveaway.instagramSettings.postToLike}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Post
                    </a>
                  ) : (
                    <p className="font-medium">Not specified</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Post to Comment</h3>
                  {giveaway.instagramSettings.postToComment ? (
                    <a 
                      href={giveaway.instagramSettings.postToComment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Post
                    </a>
                  ) : (
                    <p className="font-medium">Not specified</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Stats & Rules */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participation Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{giveaway.participants || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Participants</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{giveaway.verifiedParticipants || 0}</div>
                  <div className="text-sm text-muted-foreground">Verified Participants</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{giveaway.winnerCount || 1}</div>
                  <div className="text-sm text-muted-foreground">Winners Selected</div>
                </div>
              </div>
              
              {giveaway.status === "active" && (
                <Button className="w-full">View Participants</Button>
              )}
              
              {giveaway.status === "ended" && (
                <Button className="w-full">View Winners</Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Participation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {giveaway.rules.mustFollow && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Follow</p>
                      <p className="text-sm text-muted-foreground">
                        Must follow @{giveaway.instagramSettings.accountToFollow}
                      </p>
                    </div>
                  </li>
                )}
                
                {giveaway.rules.mustLike && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Like</p>
                      <p className="text-sm text-muted-foreground">
                        Must like the giveaway post
                      </p>
                    </div>
                  </li>
                )}
                
                {giveaway.rules.mustComment && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Comment</p>
                      <p className="text-sm text-muted-foreground">
                        Must comment on the giveaway post
                      </p>
                    </div>
                  </li>
                )}
                
                {giveaway.rules.mustTag && giveaway.rules.requiredTagCount > 0 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Tag Friends</p>
                      <p className="text-sm text-muted-foreground">
                        Must tag {giveaway.rules.requiredTagCount} friend{giveaway.rules.requiredTagCount > 1 ? 's' : ''} in the comment
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for the giveaway detail page
function GiveawayDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <div>
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-56" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Import required icons after component declaration due to Next.js warning about
// importing components that aren't referenced
import { Edit, PauseCircle, PlayCircle } from "lucide-react"; 