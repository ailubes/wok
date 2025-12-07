import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { DashboardLayoutWrapper } from "@/components/layout/dashboard-layout-wrapper";

/**
 * Dashboard Layout
 *
 * Full-featured dashboard layout with:
 * - Server-side authentication check
 * - Sidebar navigation
 * - Top header with breadcrumbs
 * - Mobile responsive with collapsible menu
 * - Role-based navigation
 * - User menu with profile and logout
 */
interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  // Verify session exists (server-side)
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutWrapper
      user={{
        fullName: session.user.fullName,
        email: session.user.email,
        role: session.user.role,
        organization: session.user.organization,
      }}
    >
      {children}
    </DashboardLayoutWrapper>
  );
}
