import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "student" | "manager" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    role?: "student" | "manager" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "student" | "manager" | "admin";
  }
}
