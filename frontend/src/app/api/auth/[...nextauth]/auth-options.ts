import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";

// Match the same API URL format used in the API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-jwt-secret";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    // }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Skip backend registration if no user email (shouldn't happen with Google/Facebook)
        if (!user.email || !account) {
          console.error("No email found in user profile or account is missing");
          return false;
        }
        
        // Register user with the backend
        const response = await fetch(`${API_URL}/accounts/register-sso/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name || '',
            provider: account.provider,
            providerId: account.providerAccountId || '',
            accessToken: account.access_token || '',
            profileImage: user.image || ''
          }),
        });
        
        if (!response.ok) {
          console.error("Failed to register user with backend:", await response.text());
          return false; // Block sign-in if backend registration fails
        }
        
        return true;
      } catch (error) {
        console.error("Error during backend registration:", error);
        return false; // Block sign-in on error
      }
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        // Create a custom JWT with user information
        const customToken = jwt.sign({
          email: user.email,
          name: user.name,
          picture: user.image,
          provider: account.provider,
          sub: account.providerAccountId,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        }, JWT_SECRET);
        
        token.customToken = customToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Use the custom token for API requests
      session.accessToken = token.customToken as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
}; 