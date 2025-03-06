"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  UserCheck, 
  TrendingUp, 
  Heart,
  Calendar
} from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  
  // This would normally come from an API
  const stats = {
    activeGiveaways: 4,
    totalParticipants: 2347,
    totalEngagement: 12583,
    completionRate: 78.6,
    upcomingGiveaways: 2
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your giveaways today.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Giveaways</CardTitle>
            <Trophy className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGiveaways}</div>
            <p className="text-xs text-muted-foreground">
              {stats.upcomingGiveaways} upcoming
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalParticipants)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatNumber(124)} from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalEngagement)}</div>
            <p className="text-xs text-muted-foreground">
              Likes, comments, and shares
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
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
            {/* This would be a chart component in a real application */}
            <div className="h-[240px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Activity Chart</p>
            </div>
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
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Summer Giveaway #{i+1}</p>
                    <p className="text-xs text-muted-foreground">Starts in {3 + i} days</p>
                  </div>
                </div>
              ))}
              
              {stats.upcomingGiveaways === 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                  No upcoming giveaways
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 