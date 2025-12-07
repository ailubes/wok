"use client";

import { useState } from "react";
import { DashboardNav } from "./dashboard-nav";
import { DashboardHeader } from "./dashboard-header";
import type { UserRole } from "@prisma/client";

interface DashboardLayoutWrapperProps {
  user: {
    fullName: string;
    email: string;
    role: UserRole;
    organization?: string;
  };
  children: React.ReactNode;
}

export function DashboardLayoutWrapper({ user, children }: DashboardLayoutWrapperProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        user={user}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <div className="lg:pl-64">
        <DashboardHeader onMenuToggle={() => setIsMobileNavOpen(true)} />

        <main className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
