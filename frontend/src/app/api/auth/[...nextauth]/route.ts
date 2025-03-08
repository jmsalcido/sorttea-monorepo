import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { NextAuthOptions } from "next-auth";

// Match the same API URL format used in the API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
    async signIn({ user, account, profile }) {
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
    async jwt({ token, account, profile }) {
      // Add access_token to the token right after sign in
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 