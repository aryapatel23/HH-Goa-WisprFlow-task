import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const googleId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const authProviders: any[] = [];

if (googleId && googleSecret) {
  authProviders.push(
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  );
}

authProviders.push(
  Credentials({
    name: "Email and Demo Login",
    credentials: {
      email: { label: "Email", type: "email" },
      role: { label: "Role", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.email) return null;
      const email = String(credentials.email).toLowerCase().trim();

      // 1. Look up existing user in PostgreSQL
      let user = await prisma.user.findUnique({
        where: { email },
      });

      // 2. If user doesn't exist yet, auto-provision user
      if (!user) {
        const requestedRole = (credentials.role as any) || "student";
        const validRole = ["student", "manager", "admin"].includes(requestedRole)
          ? requestedRole
          : "student";

        user = await prisma.user.create({
          data: {
            email,
            name: email.split("@")[0].replace(/[._]/g, " "),
            role: validRole,
            hostelBlock: validRole === "student" ? "Block B" : "Admin Quarters",
            roomNumber: validRole === "student" ? "B-204" : "M-01",
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as "student" | "manager" | "admin",
      };
    },
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: authProviders,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "student";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.role = (token.role as "student" | "manager" | "admin") || "student";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-key-at-least-32-characters-long",
});
