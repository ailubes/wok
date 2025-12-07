"use client";

import { Home, FileText, Settings, Users, X } from "lucide-react";
import { NavItem } from "./nav-item";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@prisma/client";
import { cn } from "@/lib/utils";

interface DashboardNavProps {
  user: {
    fullName: string;
    email: string;
    role: UserRole;
    organization?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { href: "/dashboard", label: "Головна", icon: Home },
  { href: "/dashboard/bills", label: "Законопроєкти", icon: FileText },
  { href: "/dashboard/settings", label: "Налаштування", icon: Settings },
  { href: "/dashboard/admin/users", label: "Користувачі", icon: Users, adminOnly: true },
];

export function DashboardNav({ user, isOpen, onClose }: DashboardNavProps) {
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user.role === "ADMIN"
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64",
          "flex flex-col",
          "bg-card border-r border-border",
          "transform transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">AgroLaw Vote</h1>
              <p className="text-xs text-muted-foreground">Законопроєкти</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-3 border-t border-border">
          <UserMenu user={user} />
        </div>
      </aside>
    </>
  );
}
