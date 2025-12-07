"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

const breadcrumbLabels: Record<string, string> = {
  "/dashboard": "Головна",
  "/dashboard/bills": "Законопроєкти",
  "/dashboard/settings": "Налаштування",
  "/dashboard/admin/users": "Користувачі",
};

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs: { label: string; path: string }[] = [];

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = breadcrumbLabels[currentPath] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  return (
    <header className="sticky top-0 z-30 h-14 bg-card border-b border-border">
      <div className="flex items-center gap-4 px-4 h-full">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-muted-foreground">/</span>}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Пошук..."
              className="w-64 pl-8 h-9 bg-muted border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
