"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  UserCheck, 
  TrendingUp, 
  Heart,
  Calendar,
  Loader2
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useOverviewStats } from "@/hooks/use-analytics";
import { useGiveaways } from "@/hooks/use-giveaways";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import Link from "next/link";
import { InstagramConnectCTA } from "@/components/dashboard/instagram-connect-cta";

export default function DashboardPage() {
  const { data: session } = useSession();
  
  // Fetch overview statistics
  const { data: overviewStats, isLoading: statsLoading, isError: statsError } = useOverviewStats();
  
  // Fetch upcoming giveaways
  const { data: giveawaysData, isLoading: giveawaysLoading, isError: giveawaysError } = useGiveaways({
    status: "scheduled",
    limit: 5
  });
  
  // Prepare stats data with loading/error states
  const stats = useMemo(() => {
    if (statsLoading) {
      return {
        activeGiveaways: null,
        totalParticipants: null,
        totalEngagement: null,
        completionRate: null,
        upcomingGiveaways: null
      };
    }
    
    if (statsError) {
      return {
        activeGiveaways: 0,
        totalParticipants: 0,
        totalEngagement: 0,
        completionRate: 0,
        upcomingGiveaways: 0
      };
    }
    
    return {
      activeGiveaways: overviewStats?.activeGiveaways || 0,
      totalParticipants: overviewStats?.totalParticipants || 0,
      totalEngagement: overviewStats?.totalEngagement || 0,
      completionRate: overviewStats?.completionRate || 0,
      upcomingGiveaways: giveawaysData?.giveaways.length || 0
    };
  }, [statsLoading, statsError, overviewStats, giveawaysData]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your giveaways today.
        </p>
      </div>
      
      {/* Instagram Connect CTA */}
      <InstagramConnectCTA />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Giveaways</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeGiveaways}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.upcomingGiveaways} upcoming
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(stats.totalParticipants || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Growing your audience
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatNumber(stats.totalEngagement || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  Likes, comments, and shares
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Verified entry rate
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your giveaway activity over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-[240px] w-full" />
            ) : (
              <div className="h-[240px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Activity Chart</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Giveaways</CardTitle>
            <CardDescription>
              Your scheduled giveaways
            </CardDescription>
          </CardHeader>
          <CardContent>
            {giveawaysLoading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : giveawaysError ? (
              <div className="text-sm text-red-500 dark:text-red-400 text-center py-6">
                Error loading upcoming giveaways
              </div>
            ) : giveawaysData?.giveaways && giveawaysData.giveaways.length > 0 ? (
              <div className="space-y-4">
                {giveawaysData.giveaways.map((giveaway) => (
                  <Link 
                    href={`/giveaways/${giveaway.id}`} 
                    key={giveaway.id}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{giveaway.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Starts {new Date(giveaway.startDate) > new Date() 
                          ? new Date(giveaway.startDate).toLocaleDateString() 
                          : 'soon'
                        }
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                No upcoming giveaways. <Link href="/giveaways/create" className="text-blue-500 hover:underline">Create one</Link>.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 