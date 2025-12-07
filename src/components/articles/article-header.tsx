"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { ArticleStatus } from "@prisma/client";

interface ArticleHeaderProps {
  bill: {
    id: string;
    title: string;
    registrationNumber: string | null;
  };
  article: {
    id: string;
    articleNumber: string;
    title: string | null;
    status: ArticleStatus;
  };
  activeTab?: "view" | "proposals" | "comments";
  onTabChange?: (tab: "view" | "proposals" | "comments") => void;
}

const statusConfig: Record<
  ArticleStatus,
  { label: string; className: string }
> = {
  NOT_PROCESSED: {
    label: "Не опрацьовано",
    className: "bg-muted text-muted-foreground border-border",
  },
  IN_DISCUSSION: {
    label: "Обговорюється",
    className: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  APPROVED: {
    label: "Затверджено",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  REJECTED: {
    label: "Відхилено",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function ArticleHeader({
  bill,
  article,
  activeTab = "view",
  onTabChange,
}: ArticleHeaderProps) {
  const statusStyle = statusConfig[article.status];

  return (
    <div className="space-y-6 bg-card border-b border-border pb-6">
      {/* Back Button */}
      <Link href={`/dashboard/bills/${bill.id}`}>
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад до законопроєкту
        </Button>
      </Link>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Панель керування
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href="/dashboard/bills"
          className="hover:text-foreground transition-colors"
        >
          Законопроєкти
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/dashboard/bills/${bill.id}`}
          className="hover:text-foreground transition-colors max-w-[200px] truncate"
          title={bill.title}
        >
          {bill.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">
          Стаття {article.articleNumber}
        </span>
      </nav>

      <Separator />

      {/* Article Title & Status */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-foreground">
                Стаття {article.articleNumber}
              </h1>
              <Badge variant="outline" className={statusStyle.className}>
                {statusStyle.label}
              </Badge>
            </div>
            {article.title && (
              <p className="text-lg text-muted-foreground">{article.title}</p>
            )}
          </div>
        </div>

        {/* Bill Reference */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Законопроєкт:</span>{" "}
          {bill.registrationNumber && (
            <span className="text-foreground">№ {bill.registrationNumber} • </span>
          )}
          <span className="text-foreground">{bill.title}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={onTabChange as any}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="view">Перегляд</TabsTrigger>
          <TabsTrigger value="proposals">Пропозиції</TabsTrigger>
          <TabsTrigger value="comments">Коментарі</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
