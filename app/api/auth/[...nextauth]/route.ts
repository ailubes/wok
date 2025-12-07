/**
 * NextAuth.js v5 API Route Handler
 *
 * This file exports the GET and POST handlers for NextAuth.js v5.
 * All authentication routes (/api/auth/*) are handled by these handlers.
 *
 * Routes handled:
 * - /api/auth/signin - Sign in page
 * - /api/auth/signout - Sign out
 * - /api/auth/callback/* - OAuth callbacks
 * - /api/auth/session - Get current session
 * - /api/auth/csrf - CSRF token
 * - /api/auth/providers - List providers
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
