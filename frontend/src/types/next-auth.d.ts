import "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: string;
  }
} 