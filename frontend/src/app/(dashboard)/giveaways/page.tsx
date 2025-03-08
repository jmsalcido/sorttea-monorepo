"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  Loader2
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
import { useGiveaways, useDeleteGiveaway } from "@/hooks/use-giveaways";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

// Helper function to safely get date values
const getDateValue = (giveaway: any, fieldName: string): string => {
  if (giveaway[fieldName]) {
    return giveaway[fieldName];
  }
  
  // Try snake_case version
  const snakeCase = fieldName.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  if (giveaway[snakeCase]) {
    return giveaway[snakeCase];
  }
  
  // Default to current date if not found
  return new Date().toISOString();
};

// Add another helper function
const getRules = (giveaway: any): any => {
  // Check if there's already a rules object
  if (giveaway.rules && typeof giveaway.rules === 'object') {
    return giveaway.rules;
  }
  
  // If not, create a rules object from the giveaway properties
  return {
    mustFollow: giveaway.verify_follow || false,
    mustLike: giveaway.verify_like || false,
    mustComment: giveaway.verify_comment || false,
    mustTag: giveaway.required_tag_count || 0
  };
};

export default function GiveawaysPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [debugMode] = useState(true); // Debug flag to help identify issues
  
  const { data, isLoading, isError, error } = useGiveaways({
    status: statusFilter || undefined,
    page: currentPage,
    limit: 10
  });
  
  const { mutate: deleteGiveaway, isPending: isDeleting } = useDeleteGiveaway();

  // Filter giveaways by search query
  const filteredGiveaways = data?.giveaways?.filter(giveaway => 
    giveaway.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this giveaway?")) {
      deleteGiveaway(id);
    }
  };
  
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
  
  // Debug function to log component rendering
  useEffect(() => {
    if (debugMode) {
      console.log('Component rendered with:', { 
        data, 
        filteredGiveaways, 
        statusFilter 
      });
    }
  }, [data, filteredGiveaways, statusFilter, debugMode]);
  
  return (
    <div className="giveaways-page-container">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Giveaways</h1>
          <Button 
            className="hidden md:flex"
            onClick={() => router.push('/giveaways/create')}
          >
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
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="flex md:hidden"
                >
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
                <div className="hidden md:flex gap-2">
                  <Button 
                    variant={statusFilter === null ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter(null)}
                  >
                    All
                  </Button>
                  <Button 
                    variant={statusFilter === "active" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("active")}
                  >
                    Active
                  </Button>
                  <Button 
                    variant={statusFilter === "draft" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("draft")}
                  >
                    Draft
                  </Button>
                  <Button 
                    variant={statusFilter === "paused" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("paused")}
                  >
                    Paused
                  </Button>
                  <Button 
                    variant={statusFilter === "ended" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setStatusFilter("ended")}
                  >
                    Ended
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
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-9 w-9 rounded-full ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-red-500">
                          Error loading giveaways: {(error as Error)?.message || 'Unknown error'}
                        </TableCell>
                      </TableRow>
                    ) : filteredGiveaways.length > 0 ? (
                      filteredGiveaways.map((giveaway) => (
                        <TableRow key={giveaway.id}>
                          <TableCell className="font-medium">
                            <Link href={`/giveaways/${encodeURIComponent(giveaway.id)}`} className="hover:underline">
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
                            {formatDate(new Date(getDateValue(giveaway, 'startDate')), { month: 'short', day: 'numeric' })} - {formatDate(new Date(getDateValue(giveaway, 'endDate')), { month: 'short', day: 'numeric' })}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex gap-2 flex-wrap">
                              {getRules(giveaway).mustFollow && (
                                <Badge variant="secondary" className="text-xs">Follow</Badge>
                              )}
                              {getRules(giveaway).mustLike && (
                                <Badge variant="secondary" className="text-xs">Like</Badge>
                              )}
                              {getRules(giveaway).mustComment && (
                                <Badge variant="secondary" className="text-xs">Comment</Badge>
                              )}
                              {getRules(giveaway).mustTag > 0 && (
                                <Badge variant="secondary" className="text-xs">Tag {getRules(giveaway).mustTag}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={isDeleting}>
                                  {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push(`/giveaways/${encodeURIComponent(giveaway.id)}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/giveaways/${encodeURIComponent(giveaway.id)}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleDelete(giveaway.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No giveaways found. {statusFilter ? `Try changing the filter or ` : ''}create your first giveaway.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Changed the conditional to ensure it always evaluates to a boolean */}
              {Boolean(data?.total && data.total > 10) && (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {Math.ceil((data?.total || 0) / 10)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => page + 1)}
                    disabled={currentPage >= Math.ceil((data?.total || 0) / 10)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Debug information - hidden from UI */}
      {debugMode && (
        <div style={{ display: 'none' }}>
          Debug info: {JSON.stringify({
            totalData: data?.total || 0,
            giveawaysCount: filteredGiveaways?.length || 0,
            statusFilter
          })}
        </div>
      )}
      {/* End of component - nothing should render after this */}
    </div>
  );
}
