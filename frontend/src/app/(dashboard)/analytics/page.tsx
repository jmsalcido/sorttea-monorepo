"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  Heart,
  Share2
} from "lucide-react";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <Button variant="outline" className="hidden md:flex">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
          </div>
        </div>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard 
              title="Total Giveaways" 
              value="12" 
              change="+2" 
              changeText="from last month" 
              icon={BarChart3} 
              iconColor="text-blue-500" 
            />
            <MetricCard 
              title="Total Participants" 
              value="8,793" 
              change="+15.3%" 
              changeText="from last month" 
              icon={Users} 
              iconColor="text-green-500" 
            />
            <MetricCard 
              title="Engagement Rate" 
              value="24.8%" 
              change="+5.2%" 
              changeText="from last month" 
              icon={Heart} 
              iconColor="text-red-500" 
            />
            <MetricCard 
              title="Social Shares" 
              value="1,432" 
              change="+8.1%" 
              changeText="from last month" 
              icon={Share2} 
              iconColor="text-purple-500" 
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Giveaway Performance</CardTitle>
                <CardDescription>
                  Participants and engagement over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Performance Chart</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Performing Giveaways</CardTitle>
                <CardDescription>
                  Ranked by total engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{i}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          Summer Collection Giveaway #{i}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            <span>{1200 - (i * 120)}</span>
                          </div>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Heart className="mr-1 h-3 w-3" />
                            <span>{87 - (i * 5)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center text-sm font-medium">
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        <span>+{27 - (i * 3)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>
                  Breakdown of participant engagement by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Metrics Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of user engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Analysis Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Participant Demographics</CardTitle>
              <CardDescription>
                Understand your giveaway participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Participant Demographics Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Metrics</CardTitle>
              <CardDescription>
                Track and analyze conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Metrics Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeText: string;
  icon: React.ElementType;
  iconColor: string;
}

function MetricCard({ title, value, change, changeText, icon: Icon, iconColor }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {change} {changeText}
        </p>
      </CardContent>
    </Card>
  );
} 