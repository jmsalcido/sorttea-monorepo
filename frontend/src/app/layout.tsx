import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import { QueryClientProvider } from "@/components/query-client-provider";
import Script from "next/script";

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

const cacheBuster = process.env.NODE_ENV === 'development' 
  ? `?v=${Date.now()}` 
  : '';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <>
            <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />
            <link 
              rel="stylesheet" 
              href={`/_next/static/css/app/layout.css${cacheBuster}`} 
              precedence="high"
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryClientProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </QueryClientProvider>
        </AuthProvider>
        
        {process.env.NODE_ENV === 'development' && (
          <Script id="force-css-reload" strategy="afterInteractive">
            {`
              (function() {
                function reloadStylesheets() {
                  const links = document.getElementsByTagName('link');
                  for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    if (link.rel === 'stylesheet') {
                      const href = link.href.split('?')[0];
                      link.href = href + '?reload=' + new Date().getTime();
                    }
                  }
                }
                
                window.addEventListener('load', reloadStylesheets);
                
                const originalPushState = history.pushState;
                history.pushState = function() {
                  originalPushState.apply(this, arguments);
                  setTimeout(reloadStylesheets, 100);
                };
                
                window.addEventListener('popstate', function() {
                  setTimeout(reloadStylesheets, 100);
                });
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
