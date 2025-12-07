import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText } from "lucide-react";
import type { ArticleStatus } from "@prisma/client";

interface ArticleTreeItemProps {
  billId: string;
  article: {
    id: string;
    number: string;
    title: string;
    status: ArticleStatus;
    _count: {
      proposals: number;
      comments: number;
    };
  };
}

const statusConfig: Record<ArticleStatus, { variant: "default" | "secondary" | "destructive" | "outline" }> = {
  NOT_PROCESSED: { variant: "outline" },
  IN_DISCUSSION: { variant: "secondary" },
  APPROVED: { variant: "default" },
  REJECTED: { variant: "destructive" },
};

export function ArticleTreeItem({ billId, article }: ArticleTreeItemProps) {
  const config = statusConfig[article.status];

  return (
    <Link
      href={`/dashboard/bills/${billId}/articles/${article.id}`}
      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-mono text-muted-foreground w-12 flex-shrink-0">
          Ст. {article.number}
        </span>
        <span className="text-sm truncate">{article.title}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {article._count.proposals > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>{article._count.proposals}</span>
          </div>
        )}
        {article._count.comments > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{article._count.comments}</span>
          </div>
        )}
        <Badge variant={config.variant} className="text-xs">
          {article.status === "NOT_PROCESSED" && "Не опрац."}
          {article.status === "IN_DISCUSSION" && "В обговор."}
          {article.status === "APPROVED" && "Затв."}
          {article.status === "REJECTED" && "Відхил."}
        </Badge>
      </div>
    </Link>
  );
}
