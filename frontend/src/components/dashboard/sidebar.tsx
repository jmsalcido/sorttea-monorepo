"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Gift, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  X,
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  isActive: boolean;
}

const NavItem = ({ href, icon: Icon, title, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
      isActive 
        ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400" 
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
    )}
  >
    <Icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "")} />
    {title}
  </Link>
);

export function Sidebar({ isMobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const routes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      title: "Dashboard",
    },
    {
      href: "/giveaways",
      icon: Gift,
      title: "Giveaways",
    },
    // Analytics page hidden temporarily
    // {
    //   href: "/analytics",
    //   icon: BarChart3,
    //   title: "Analytics",
    // },
    {
      href: "/participants",
      icon: Users,
      title: "Participants",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-transform duration-300 md:sticky md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold text-xl">SortTea</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto py-4 px-3">
          <div className="mb-4 px-3 md:hidden">
            <Button
              className="w-full justify-start"
              onClick={() => {
                router.push('/giveaways/create');
                setMobileOpen(false);
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Giveaway
            </Button>
          </div>
          
          <nav className="grid gap-1">
            {routes.map((route) => (
              <NavItem
                key={route.href}
                href={route.href}
                icon={route.icon}
                title={route.title}
                isActive={pathname === route.href || pathname.startsWith(`${route.href}/`)}
              />
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Link
              href="/help"
              className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
} 