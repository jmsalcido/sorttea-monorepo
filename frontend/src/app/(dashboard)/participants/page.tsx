"use client";

import { useState } from "react";
import { ParticipantsList } from "@/components/dashboard/participants-list";
import { useAllParticipants } from "@/hooks/use-participants";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

export default function ParticipantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const { 
    data, 
    isLoading, 
    error 
  } = useAllParticipants({ 
    page: currentPage, 
    limit: pageSize 
  });
  
  // Calculate total pages
  const totalPages = data?.totalPages || 1;
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Participants</h1>
        <p className="text-muted-foreground">
          View and manage all the participants across your giveaways.
        </p>
      </div>
      
      <ParticipantsList 
        participants={data?.participants || []} 
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
      />
      
      {/* Pagination */}
      {!isLoading && !error && data?.total !== undefined && data.total > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              // Show current page, first, last, and neighbors
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              
              // Show ellipsis for gaps
              if (
                (pageNumber === 2 && currentPage > 3) || 
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink href="#" disabled>...</PaginationLink>
                  </PaginationItem>
                );
              }
              
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
} 