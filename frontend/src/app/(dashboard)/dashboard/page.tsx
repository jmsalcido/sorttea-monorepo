"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  UserCheck, 
  TrendingUp, 
  Heart,
  Calendar,
  Loader2,
  Clock,
  PlusCircle,
  Users
} from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { useOverviewStats } from "@/hooks/use-analytics";
import { useGiveaways, useUpcomingGiveaways, useActiveGiveawaysCount } from "@/hooks/use-giveaways";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import Link from "next/link";
import { InstagramConnectCTA } from "@/components/dashboard/instagram-connect-cta";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: session } = useSession();
  
  // Fetch overview statistics
  const { data: overviewStats, isLoading: statsLoading, isError: statsError } = useOverviewStats();
  
  // Fetch active giveaways count
  const { data: activeGiveawaysData, isLoading: activeGiveawaysLoading } = useActiveGiveawaysCount();
  
  // Fetch upcoming giveaways (starting in next 7 days)
  const { data: upcomingGiveawaysData, isLoading: upcomingGiveawaysLoading, isError: upcomingGiveawaysError, error: upcomingGiveawaysErrorData } = useUpcomingGiveaways(5);
  
  // Log data for debugging
  console.log('Active giveaways data:', activeGiveawaysData);
  console.log('Upcoming giveaways data:', upcomingGiveawaysData);
  
  // Prepare stats data with loading/error states
  const stats = useMemo(() => {
    if (statsLoading || activeGiveawaysLoading) {
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
        activeGiveaways: activeGiveawaysData?.count || 0,
        totalParticipants: 0,
        totalEngagement: 0,
        completionRate: 0,
        upcomingGiveaways: upcomingGiveawaysData?.total || 0
      };
    }
    
    return {
      activeGiveaways: activeGiveawaysData?.count || 0,
      totalParticipants: overviewStats?.totalParticipants || 0,
      totalEngagement: overviewStats?.totalEngagement || 0,
      completionRate: overviewStats?.completionRate || 0,
      upcomingGiveaways: upcomingGiveawaysData?.total || 0
    };
  }, [statsLoading, statsError, overviewStats, upcomingGiveawaysData, activeGiveawaysData, activeGiveawaysLoading]);
  
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
        <Card className={`${stats.activeGiveaways ? 'border-l-4 border-l-green-500 dark:border-l-green-600' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Giveaways</CardTitle>
            <div className={`rounded-full p-1 ${stats.activeGiveaways ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <Trophy className={`h-4 w-4 ${stats.activeGiveaways ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
            </div>
          </CardHeader>
          <CardContent>
            {statsLoading || activeGiveawaysLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <>
                <div className="flex items-baseline gap-1">
                  <div className="text-2xl font-bold">{stats.activeGiveaways}</div>
                  <div className="text-sm text-muted-foreground">active now</div>
                </div>
                
                {stats.upcomingGiveaways != null && stats.upcomingGiveaways > 0 ? (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stats.upcomingGiveaways} upcoming
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">in next 7 days</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, stats.upcomingGiveaways * 20)}%` }}></div>
                    </div>
                  </div>
                ) : stats.activeGiveaways != null && stats.activeGiveaways > 0 ? (
                  <div className="mt-2">
                    <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      No upcoming giveaways scheduled
                    </p>
                    <Link 
                      href="/giveaways/create" 
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Schedule your next giveaway
                    </Link>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">No active giveaways right now</p>
                    <Link 
                      href="/giveaways/create" 
                      className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/30 px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Create your first giveaway
                    </Link>
                  </div>
                )}
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Giveaways</CardTitle>
              <CardDescription>
                {upcomingGiveawaysData && upcomingGiveawaysData.total ? 
                  `${upcomingGiveawaysData.total} giveaway${upcomingGiveawaysData.total !== 1 ? 's' : ''} scheduled in the next 7 days` :
                  'Giveaways starting in the next 7 days'
                }
              </CardDescription>
            </div>
            {upcomingGiveawaysData && upcomingGiveawaysData.total > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                {upcomingGiveawaysData.total} upcoming
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {upcomingGiveawaysLoading ? (
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
            ) : upcomingGiveawaysError ? (
              <div className="text-sm text-red-500 dark:text-red-400 text-center py-6">
                Error loading upcoming giveaways: {upcomingGiveawaysErrorData instanceof Error ? upcomingGiveawaysErrorData.message : 'Unknown error'}
              </div>
            ) : !upcomingGiveawaysData?.giveaways ? (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                No giveaway data available. Please try again later.
              </div>
            ) : upcomingGiveawaysData.giveaways.length > 0 ? (
              <div className="space-y-3">
                {upcomingGiveawaysData.giveaways.map((giveaway) => {
                  // Calculate days until giveaway starts
                  const startDate = new Date(giveaway.startDate);
                  const today = new Date();
                  const diffTime = startDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  let startLabel;
                  let timeColor;
                  if (diffDays <= 0) {
                    startLabel = "Starting today!";
                    timeColor = "text-red-500 dark:text-red-400";
                  } else if (diffDays === 1) {
                    startLabel = "Starting tomorrow";
                    timeColor = "text-orange-500 dark:text-orange-400";
                  } else {
                    startLabel = `Starting in ${diffDays} days`;
                    timeColor = "text-blue-500 dark:text-blue-400";
                  }
                  
                  // Determine the status style
                  let statusColor;
                  let statusBg;
                  switch (giveaway.status) {
                    case 'active':
                      statusColor = "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
                      break;
                    case 'draft':
                      statusColor = "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800";
                      break;
                    case 'paused':
                      statusColor = "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
                      break;
                    default:
                      statusColor = "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700";
                  }
                  
                  return (
                    <Link 
                      href={`/giveaways/${encodeURIComponent(giveaway.id)}`} 
                      key={giveaway.id}
                      className="block" // Remove flex to use the card layout
                    >
                      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md transition-all bg-white dark:bg-gray-950">
                        <div className="px-4 pt-4 pb-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h3 className="font-medium text-base line-clamp-1">{giveaway.title}</h3>
                              <p className={`text-xs ${timeColor} font-medium flex items-center gap-1 mt-1`}>
                                <Calendar className="h-3 w-3" />
                                {startLabel}
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusColor} capitalize whitespace-nowrap ml-2`}>
                              {giveaway.status}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                            {giveaway.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                          <div className="flex items-center">
                            <div className="flex -space-x-2">
                              {/* Show rule indicators */}
                              {giveaway.rules.mustFollow && (
                                <span className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs border-2 border-white dark:border-gray-900" title="Must Follow">
                                  F
                                </span>
                              )}
                              {giveaway.rules.mustLike && (
                                <span className="h-6 w-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center text-pink-600 dark:text-pink-400 text-xs border-2 border-white dark:border-gray-900" title="Must Like">
                                  L
                                </span>
                              )}
                              {giveaway.rules.mustComment && (
                                <span className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs border-2 border-white dark:border-gray-900" title="Must Comment">
                                  C
                                </span>
                              )}
                              {giveaway.rules.mustTag && (
                                <span className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 text-xs border-2 border-white dark:border-gray-900" title={`Tag ${giveaway.rules.requiredTagCount} Friend${giveaway.rules.requiredTagCount !== 1 ? 's' : ''}`}>
                                  T
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {giveaway.participants > 0 ? giveaway.participants : 'No'} participant{giveaway.participants !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                
                <div className="pt-2 flex justify-center">
                  <Link 
                    href="/giveaways"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    View all giveaways
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                  <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-base font-medium mb-2">No upcoming giveaways</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any giveaways scheduled in the next 7 days.
                </p>
                <Link 
                  href="/giveaways/create" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create New Giveaway
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 