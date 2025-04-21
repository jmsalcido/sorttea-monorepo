import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import { QueryClientProvider } from "@/components/query-client-provider";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SortTea - Instagram Giveaway Verification Platform",
  description: "Manage and verify Instagram giveaway entries with ease",
};

// Development-only error boundary
const DevErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  if (process.env.NODE_ENV === 'development') {
    return (
      <Suspense fallback={null}>
        {children}
      </Suspense>
    );
  }
  return <>{children}</>;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DevErrorBoundary>
          <AuthProvider>
            <QueryClientProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster position="bottom-right" />
              </ThemeProvider>
            </QueryClientProvider>
          </AuthProvider>
        </DevErrorBoundary>
      </body>
    </html>
  );
}
