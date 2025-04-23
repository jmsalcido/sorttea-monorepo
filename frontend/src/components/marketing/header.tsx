import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function MarketingHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/sorttea-logo.svg" 
          alt="SortTea Logo" 
          width={40} 
          height={40}
          priority
        />
        <span className="font-bold text-xl">SortTea</span>
      </Link>
      <nav className="hidden md:flex gap-6">
        <Link href="/#features" className="text-sm font-medium hover:underline underline-offset-4">
          Features
        </Link>
        <Link href="/#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
          How It Works
        </Link>
        <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
          Pricing
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/auth/signin">
          <Button variant="outline" size="sm">Sign In</Button>
        </Link>
        <Link href="/auth/signin">
          <Button size="sm">Get Started</Button>
        </Link>
      </div>
    </header>
  );
} 