import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { verifyPassword } from "./auth-helpers";
import type { User } from "next-auth";
import { UserRole } from "@prisma/client";

/**
 * NextAuth.js v5 Configuration
 *
 * This configures authentication for the AgroLaw Vote platform with:
 * - Credentials provider (email/password)
 * - JWT session strategy (no adapter needed for JWT)
 * - Custom callbacks for role injection
 * - Manual user lookup in Prisma database
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use JWT for session management (credentials provider uses JWT)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: "/login",
    error: "/login",
  },

  // Authentication providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isValidPassword = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        // Return user object that matches our User type
        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          organization: user.organization ?? undefined,
          role: user.role,
        };
      },
    }),
  ],

  // Callbacks to customize JWT and session behavior
  callbacks: {
    // JWT callback: Add user data to token
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.fullName;
        token.organization = user.organization;
      }

      // Handle session updates
      if (trigger === "update" && session) {
        token.fullName = session.fullName ?? token.fullName;
        token.organization = session.organization ?? token.organization;
      }

      return token;
    },

    // Session callback: Add token data to session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.fullName = token.fullName as string;
        session.user.organization = token.organization as string | undefined;
      }

      return session;
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
});
