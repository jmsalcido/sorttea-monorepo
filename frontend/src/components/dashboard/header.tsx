"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  PlusCircle 
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useUserProfile } from "@/hooks/use-user";
import Link from "next/link";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export function Header({ toggleMobileMenu }: HeaderProps) {
  const { data: session } = useSession();
  const { data: profile } = useUserProfile();
  const router = useRouter();
  
  // Extract profile image URL, with fallbacks
  const profileImageUrl = 
    profile?.profile?.provider_image_url || 
    session?.user?.image || 
    "";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileMenu}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex"
          onClick={() => router.push('/giveaways/create')}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Giveaway
        </Button>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative opacity-70 hover:opacity-100 transition-opacity"
            disabled
            title="Notifications coming soon"
          >
            <Bell className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-medium text-gray-500 dark:text-gray-400">
              0
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileImageUrl} alt={session?.user?.name || "User"} />
                <AvatarFallback>{session?.user?.name ? getInitials(session.user.name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/settings" className="w-full">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/settings" className="w-full">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 