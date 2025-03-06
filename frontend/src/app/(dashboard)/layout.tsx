"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileMenuOpen} setMobileOpen={setIsMobileMenuOpen} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 