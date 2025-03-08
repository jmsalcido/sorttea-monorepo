import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only add no-cache headers in development environment
  if (process.env.NODE_ENV === 'development') {
    const response = NextResponse.next();
    
    // Set cache control headers for CSS and JS files
    if (
      request.nextUrl.pathname.endsWith('.css') || 
      request.nextUrl.pathname.endsWith('.js')
    ) {
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  }
  
  return NextResponse.next();
}

// Only run this middleware on specific paths
// Next.js middleware matchers have strict syntax requirements
export const config = {
  matcher: [
    // Match routes except for specific system routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Use separate simple matchers for JS and CSS files
    '/(.*).js',
    '/(.*).css'
  ],
}; 