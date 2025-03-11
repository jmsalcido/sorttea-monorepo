import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  
  // Add headers to prevent caching in development
  async headers() {
    // Return an array of header objects
    return process.env.NODE_ENV === 'development' 
      ? [
          {
            // Apply these headers to all routes
            source: '/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, max-age=0, must-revalidate',
              },
              {
                key: 'Pragma',
                value: 'no-cache',
              },
              {
                key: 'Expires',
                value: '0',
              },
            ],
          },
          {
            // JavaScript files
            source: '/:path*.js',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, max-age=0, must-revalidate',
              }
            ],
          },
          {
            // CSS files
            source: '/:path*.css',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, max-age=0, must-revalidate',
              }
            ],
          },
        ]
      : []; // No extra headers in production
  },
  
  // Basic cache configuration for development
  onDemandEntries: {
    // Keep pages in memory for development
    maxInactiveAge: 25 * 1000,
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  }
};

export default nextConfig;
