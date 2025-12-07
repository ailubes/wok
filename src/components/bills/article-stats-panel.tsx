import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ArticleStatus } from "@prisma/client";

interface ArticleStatsPanelProps {
  articles: {
    status: ArticleStatus;
  }[];
}

const statusConfig: Record<ArticleStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  NOT_PROCESSED: { label: "Не опрацьовано", variant: "outline" },
  IN_DISCUSSION: { label: "В обговоренні", variant: "secondary" },
  APPROVED: { label: "Затверджено", variant: "default" },
  REJECTED: { label: "Відхилено", variant: "destructive" },
};

export function ArticleStatsPanel({ articles }: ArticleStatsPanelProps) {
  const stats = articles.reduce((acc, article) => {
    acc[article.status] = (acc[article.status] || 0) + 1;
    return acc;
  }, {} as Record<ArticleStatus, number>);

  const total = articles.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Статистика статей</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(Object.keys(statusConfig) as ArticleStatus[]).map((status) => {
            const count = stats[status] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const config = statusConfig[status];

            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={config.variant} className="text-xs">
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{count}</span>
                  <span className="text-muted-foreground">({percentage}%)</span>
                </div>
              </div>
            );
          })}
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Всього</span>
              <span className="font-medium">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
