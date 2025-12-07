"use client";

import { useState } from "react";
import { ArticleTreeItem } from "./article-tree-item";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArticleStatus } from "@prisma/client";

interface Article {
  id: string;
  number: string;
  title: string;
  status: ArticleStatus;
  _count: {
    proposals: number;
    comments: number;
  };
}

interface ArticleTreeProps {
  billId: string;
  articles: Article[];
}

export function ArticleTree({ billId, articles }: ArticleTreeProps) {
  const [view, setView] = useState<"all" | "status">("all");

  const sortedArticles = [...articles].sort((a, b) => {
    const numA = parseInt(a.number) || 0;
    const numB = parseInt(b.number) || 0;
    return numA - numB;
  });

  const articlesByStatus = sortedArticles.reduce((acc, article) => {
    if (!acc[article.status]) {
      acc[article.status] = [];
    }
    acc[article.status].push(article);
    return acc;
  }, {} as Record<ArticleStatus, Article[]>);

  const statusLabels: Record<ArticleStatus, string> = {
    NOT_PROCESSED: "Не опрацьовано",
    IN_DISCUSSION: "В обговоренні",
    APPROVED: "Затверджено",
    REJECTED: "Відхилено",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Статті ({articles.length})</h2>
        <Tabs value={view} onValueChange={(v) => setView(v as "all" | "status")}>
          <TabsList>
            <TabsTrigger value="all">Усі</TabsTrigger>
            <TabsTrigger value="status">За статусом</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "all" ? (
        <div className="space-y-1">
          {sortedArticles.map((article) => (
            <ArticleTreeItem
              key={article.id}
              billId={billId}
              article={article}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.keys(statusLabels) as ArticleStatus[]).map((status) => {
            const statusArticles = articlesByStatus[status] || [];
            if (statusArticles.length === 0) return null;

            return (
              <div key={status}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {statusLabels[status]} ({statusArticles.length})
                </h3>
                <div className="space-y-1">
                  {statusArticles.map((article) => (
                    <ArticleTreeItem
                      key={article.id}
                      billId={billId}
                      article={article}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
