"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock giveaway data
const mockGiveaways = [
  {
    id: "gv-1",
    title: "Summer Product Launch",
    status: "active",
    participants: 1254,
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 6, 15),
    rules: {
      mustFollow: true,
      mustLike: true,
      mustTag: 3,
    }
  },
  {
    id: "gv-2",
    title: "Holiday Special",
    status: "scheduled",
    participants: 0,
    startDate: new Date(2023, 11, 1),
    endDate: new Date(2023, 11, 25),
    rules: {
      mustFollow: true,
      mustLike: true,
      mustTag: 2,
    }
  },
  {
    id: "gv-3",
    title: "New Follower Bonus",
    status: "active",
    participants: 837,
    startDate: new Date(2023, 4, 1),
    endDate: new Date(2023, 7, 30),
    rules: {
      mustFollow: true,
      mustLike: false,
      mustTag: 0,
    }
  },
  {
    id: "gv-4",
    title: "Spring Collection",
    status: "completed",
    participants: 3219,
    startDate: new Date(2023, 2, 1),
    endDate: new Date(2023, 3, 15),
    rules: {
      mustFollow: true,
      mustLike: true,
      mustTag: 1,
    }
  },
  {
    id: "gv-5",
    title: "Partner Promotion",
    status: "completed",
    participants: 2156,
    startDate: new Date(2023, 1, 10),
    endDate: new Date(2023, 2, 10),
    rules: {
      mustFollow: true,
      mustLike: true,
      mustTag: 1,
    }
  }
];

export default function GiveawaysPage() {
  const [giveaways] = useState(mockGiveaways);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredGiveaways = giveaways.filter(giveaway => 
    giveaway.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Giveaways</h1>
        <Button className="hidden md:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Giveaway
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Giveaways</CardTitle>
          <CardDescription>
            Create, edit, and manage your Instagram giveaways.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search giveaways..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="flex md:hidden">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
              <div className="hidden md:flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  All
                </Button>
                <Button variant="outline" size="sm">
                  Active
                </Button>
                <Button variant="outline" size="sm">
                  Scheduled
                </Button>
                <Button variant="outline" size="sm">
                  Completed
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Giveaway Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Participants</TableHead>
                    <TableHead className="hidden md:table-cell">Date Range</TableHead>
                    <TableHead className="hidden lg:table-cell">Rules</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGiveaways.map((giveaway) => (
                    <TableRow key={giveaway.id}>
                      <TableCell className="font-medium">
                        <Link href={`/giveaways/${giveaway.id}`} className="hover:underline">
                          {giveaway.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(giveaway.status)} variant="outline">
                          {giveaway.status.charAt(0).toUpperCase() + giveaway.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{giveaway.participants}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(giveaway.startDate, { month: 'short', day: 'numeric' })} - {formatDate(giveaway.endDate, { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex gap-2">
                          {giveaway.rules.mustFollow && (
                            <Badge variant="secondary" className="text-xs">Follow</Badge>
                          )}
                          {giveaway.rules.mustLike && (
                            <Badge variant="secondary" className="text-xs">Like</Badge>
                          )}
                          {giveaway.rules.mustTag > 0 && (
                            <Badge variant="secondary" className="text-xs">Tag {giveaway.rules.mustTag}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredGiveaways.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No giveaways found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 