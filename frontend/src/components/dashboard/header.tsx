"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
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

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export function Header({ toggleMobileMenu }: HeaderProps) {
  const { data: session } = useSession();
  const [notifications] = useState<number>(3); // For demo purposes
  
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
        <Button variant="outline" size="sm" className="hidden md:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Giveaway
        </Button>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notifications}
              </span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                <AvatarFallback>{session?.user?.name ? getInitials(session.user.name) : "U"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
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