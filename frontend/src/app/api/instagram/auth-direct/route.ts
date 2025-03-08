import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// API route for direct Instagram authorization
export async function GET(request: NextRequest) {
  try {
    // Use the Django backend URL directly
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    // Use the existing auth endpoint that we know exists on the backend
    // Instead of auth-direct which doesn't exist
    const redirectUrl = `${baseUrl}/api/v1/instagram/auth/`;
    
    console.log('Redirecting to backend endpoint:', redirectUrl);
    
    // Return a redirect response to the backend
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Error redirecting to Instagram auth:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to initiate Instagram authorization' },
      { status: 500 }
    );
  }
} 