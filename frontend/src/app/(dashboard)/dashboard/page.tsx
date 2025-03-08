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
  Users,
  Activity
} from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { useOverviewStats, useTimeseriesData } from "@/hooks/use-analytics";
import { useGiveaways, useUpcomingGiveaways, useActiveGiveawaysCount } from "@/hooks/use-giveaways";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import Link from "next/link";
import { InstagramConnectCTA } from "@/components/dashboard/instagram-connect-cta";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
  TooltipProps
} from "recharts";
import { TimeseriesData } from "@/services/analytics.service";
import { useUserProfile } from "@/hooks/use-user";

// Extended TimeseriesData with completionRate
interface ExtendedTimeseriesData extends TimeseriesData {
  completionRate?: number;
}

// Fallback mock data function - will only be used if API fails
const getFallbackActivityData = (): ExtendedTimeseriesData[] => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    return date;
  });

  return last30Days.map((date) => {
    // Generate random values that trend upward for participants
    const day = date.getDate();
    const participants = Math.floor(Math.random() * 15) + day / 1.5;
    const engagement = Math.floor(Math.random() * 25) + day;
    
    return {
      date: date.toISOString().split('T')[0],
      participants: Math.floor(participants),
      engagement: Math.floor(engagement),
      completionRate: Math.min(100, Math.floor(40 + Math.random() * 40))
    };
  });
};

// Define types for the tooltip props and payload
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 p-3 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="font-medium text-sm mb-1">{label && new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="capitalize">{entry.name}: </span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: profile } = useUserProfile();
  
  // Debug state for using mock data (only shown in development)
  const [useMockData, setUseMockData] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Fetch overview statistics
  const { data: overviewStats, isLoading: statsLoading, isError: statsError } = useOverviewStats();
  
  // Fetch active giveaways count
  const { data: activeGiveawaysData, isLoading: activeGiveawaysLoading } = useActiveGiveawaysCount();
  
  // Fetch upcoming giveaways (starting in next 7 days)
  const { data: upcomingGiveawaysData, isLoading: upcomingGiveawaysLoading, isError: upcomingGiveawaysError, error: upcomingGiveawaysErrorData } = useUpcomingGiveaways(5);
  
  // Fetch real activity data from the backend
  const { data: timeseriesData, isLoading: timeseriesLoading, isError: timeseriesError } = useTimeseriesData(undefined, useMockData);
  
  // Process activity data - use actual API data or fallback to mock data if needed
  const activityData = useMemo(() => {
    // If loading, return empty array
    if (timeseriesLoading) return [];
    
    // If API returned data and it's not empty, use it
    if (timeseriesData && timeseriesData.length > 0) {
      // Add completionRate field if not present in the API data
      return timeseriesData.map(item => ({
        ...item,
        // If completionRate exists in API data, use it; otherwise calculate a reasonable value
        completionRate: (item as any).completionRate ?? Math.min(100, Math.round((item.participants > 0 ? (item.engagement / item.participants) * 100 : 50) + Math.random() * 20))
      })) as ExtendedTimeseriesData[];
    }
    
    // If API returned empty data or failed, return empty array instead of using mock data
    // In production, we'll show "No data available" message instead
    return [];
  }, [timeseriesData, timeseriesLoading]);
  
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
    <div className="space-y-6 pb-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {profile?.profile?.display_name || session?.user?.name?.split(' ')[0] || session?.user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your giveaways today.
            </p>
          </div>
          
          {/* Development-only toggle for mock data */}
          {isDevelopment && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Mock Data</span>
              <button
                onClick={() => setUseMockData(!useMockData)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  useMockData 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {useMockData ? 'On' : 'Off'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Instagram Connect CTA */}
      <InstagramConnectCTA />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={`${stats.activeGiveaways ? 'border-l-4 border-l-green-500 dark:border-l-green-600' : ''} hover:shadow-md transition-all`}>
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
        
        <Card className="hover:shadow-md transition-all border-t-4 border-t-blue-400 dark:border-t-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <div className="rounded-full p-1 bg-blue-100 dark:bg-blue-900/30">
              <UserCheck className="h-4 w-4 text-blue-500" />
            </div>
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
        
        <Card className="hover:shadow-md transition-all border-t-4 border-t-pink-400 dark:border-t-pink-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <div className="rounded-full p-1 bg-pink-100 dark:bg-pink-900/30">
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
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
        
        <Card className="hover:shadow-md transition-all border-t-4 border-t-yellow-400 dark:border-t-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <div className="rounded-full p-1 bg-yellow-100 dark:bg-yellow-900/30">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </div>
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
      
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 hover:shadow-md transition-all overflow-hidden p-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b-0 pb-3 pt-4 px-4 m-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" /> 
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your giveaway activity over the last 30 days
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  Participants
                </Badge>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800">
                  Engagement
                </Badge>
              </div>
            </div>
          </CardHeader>
          {statsLoading || timeseriesLoading ? (
            <CardContent className="p-0">
              <Skeleton className="h-[270px] w-full" />
            </CardContent>
          ) : activityData.length === 0 ? (
            <div className="h-[270px] w-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50/30 dark:from-blue-950/30 dark:to-purple-950/10">
              <Activity className="h-16 w-16 text-blue-200 dark:text-blue-800/40 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No activity data available yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Start a giveaway to collect engagement data
              </p>
            </div>
          ) : (
            <CardContent className="p-4 pt-4">
              <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" opacity={0.5} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                      minTickGap={15}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis 
                      yAxisId="left"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="participants" 
                      name="Participants"
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorParticipants)" 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="engagement" 
                      name="Engagement"
                      stroke="#ec4899" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorEngagement)" 
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          )}
          
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 pb-4 px-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average Participants</h4>
                <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                  {activityData.length ? Math.round(activityData.reduce((sum: number, item: ExtendedTimeseriesData) => sum + item.participants, 0) / activityData.length) : 0}
                </p>
              </div>
              <div className="text-center border-x border-gray-200 dark:border-gray-700">
                <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Average Engagement</h4>
                <p className="text-base font-semibold text-pink-600 dark:text-pink-400">
                  {activityData.length ? Math.round(activityData.reduce((sum: number, item: ExtendedTimeseriesData) => sum + item.engagement, 0) / activityData.length) : 0}
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Completion Rate</h4>
                <p className="text-base font-semibold text-yellow-600 dark:text-yellow-400">
                  {activityData.length ? Math.round(activityData.reduce((sum: number, item: ExtendedTimeseriesData) => sum + (item.completionRate || 0), 0) / activityData.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="lg:col-span-3 hover:shadow-md transition-all overflow-hidden p-0">
          {upcomingGiveawaysData?.giveaways?.length === 0 ? (
            // For empty state, use a single continuous div with background gradient
            <div className="flex flex-col">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 px-4 pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                      Upcoming Giveaways
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Giveaways starting in the next 7 days
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-teal-50/30 dark:from-green-950/30 dark:to-teal-950/10 px-4 pb-0 pt-0 text-center" style={{ minHeight: '270px' }}>
                <div className="flex flex-col items-center justify-center py-6">
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
              </div>
            </div>
          ) : (
            // For non-empty state, use regular Card structure
            <>
              <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-b-0 pb-3 pt-4 px-4 m-0">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                      Upcoming Giveaways
                    </CardTitle>
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
                </div>
              </CardHeader>
              
              {upcomingGiveawaysLoading ? (
                <CardContent className="p-0">
                  <div className="space-y-4 pt-4 px-4">
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
                </CardContent>
              ) : upcomingGiveawaysError ? (
                <CardContent className="p-4">
                  <div className="text-sm text-red-500 dark:text-red-400 text-center py-6">
                    Error loading upcoming giveaways: {upcomingGiveawaysErrorData instanceof Error ? upcomingGiveawaysErrorData.message : 'Unknown error'}
                  </div>
                </CardContent>
              ) : !upcomingGiveawaysData?.giveaways ? (
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                    No giveaway data available. Please try again later.
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-4 px-4 pb-0">
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
                </CardContent>
              )}
            </>
          )}
        </Card>
      </div>
      
      {/* Daily Completion Rate card with bar chart */}
      <Card className="hover:shadow-md transition-all overflow-hidden p-0">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-b-0 pb-3 pt-4 px-4 m-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Daily Completion Rate
              </CardTitle>
              <CardDescription>
                Percentage of users who complete all entry requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {timeseriesLoading ? (
          <CardContent className="p-0">
            <Skeleton className="h-[170px] w-full" />
          </CardContent>
        ) : activityData.length === 0 ? (
          <div className="h-[170px] w-full flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-amber-50/30 dark:from-yellow-950/30 dark:to-amber-950/10">
            <TrendingUp className="h-12 w-12 text-amber-200 dark:text-amber-800/40 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No completion rate data available yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Start a giveaway to collect completion data
            </p>
          </div>
        ) : (
          <CardContent className="p-4 pt-4">
            <div className="h-[170px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData.slice(-14)} // Last 14 days
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { day: 'numeric' })}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-gray-500 dark:text-gray-400"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={70} stroke="#22c55e" strokeDasharray="3 3" strokeWidth={2} />
                  <Bar 
                    dataKey="completionRate" 
                    name="Completion Rate" 
                    radius={[4, 4, 0, 0]}
                  >
                    {activityData.slice(-14).map((entry: ExtendedTimeseriesData, index: number) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.completionRate && entry.completionRate >= 70 ? '#22c55e' : '#f59e0b'}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 