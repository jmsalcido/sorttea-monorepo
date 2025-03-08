import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { ApiClient } from "@/lib/api";

// Define the expected response type
interface InstagramAuthResponse {
  auth_url: string;
  [key: string]: any;
}

// API route to get Instagram auth URL
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be signed in to connect Instagram' },
        { status: 401 }
      );
    }
    
    if (!session.accessToken) {
      return NextResponse.json(
        { error: 'Missing access token in session', sessionInfo: JSON.stringify(session, null, 2) },
        { status: 401 }
      );
    }
    
    // Debug info
    console.log('Session token found:', session.accessToken.substring(0, 10) + '...');
    console.log('Provider:', session.provider);
    
    try {
      // Create a direct fetch request with the token from session
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      
      // Log the full request URL and headers for debugging
      console.log('Requesting Instagram auth URL from:', `${baseUrl}/instagram/auth/`);
      
      // Try fetching with a Django REST Framework token format
      const response = await fetch(`${baseUrl}/instagram/auth/`, {
        headers: {
          // Try standard Bearer format
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json'
        },
        // Ensure credentials are included
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status}`, errorText);
        
        // If the first attempt failed with 403, try an alternative token format
        if (response.status === 403) {
          console.log('First attempt failed with 403, trying alternative token format...');
          
          // Try Django's common token format instead
          const altResponse = await fetch(`${baseUrl}/instagram/auth/`, {
            headers: {
              'Authorization': `Token ${session.accessToken}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });
          
          if (altResponse.ok) {
            const data = await altResponse.json();
            console.log('Alternative token format worked!');
            if (!data.auth_url) {
              return NextResponse.json(
                { error: 'Backend returned incomplete data: missing auth_url' },
                { status: 500 }
              );
            }
            return NextResponse.json(data);
          } else {
            const altErrorText = await altResponse.text();
            console.error('Alternative token format also failed:', altErrorText);
          }
        }
        
        return NextResponse.json(
          { 
            error: `Backend returned error ${response.status}: ${errorText || 'Unknown error'}`,
            statusCode: response.status,
            sessionProvider: session.provider,
            hasToken: !!session.accessToken,
            tokenStart: session.accessToken ? session.accessToken.substring(0, 5) + '...' : 'none'
          },
          { status: response.status }
        );
      }
      
      // Parse the JSON response
      const data = await response.json();
      
      // Verify that auth_url exists in the response
      if (!data.auth_url) {
        return NextResponse.json(
          { error: 'Backend returned incomplete data: missing auth_url' },
          { status: 500 }
        );
      }
      
      // Return the auth URL to the frontend
      return NextResponse.json(data);
    } catch (apiError: any) {
      // Specific error for backend API issues
      console.error('Backend API error:', apiError);
      return NextResponse.json(
        { 
          error: `Backend error: ${apiError.message || 'Unknown API error'}`,
          stack: apiError.stack,
          sessionInfo: {
            provider: session.provider,
            hasToken: !!session.accessToken
          }
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    // General error handler
    console.error('Error getting Instagram auth URL:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to get Instagram auth URL' },
      { status: 500 }
    );
  }
} 