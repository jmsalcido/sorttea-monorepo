import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Create the handler with the imported options
const handler = NextAuth(authOptions);

// Export the GET and POST handlers
export { handler as GET, handler as POST };