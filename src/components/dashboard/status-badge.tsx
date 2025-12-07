import { Badge } from "@/components/ui/badge";
import { BillStatus, ArticleStatus } from "@prisma/client";

const billStatusConfig: Record<BillStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ACTIVE: { label: "Активний", variant: "default" },
  ARCHIVED: { label: "Архівовано", variant: "secondary" },
};

const articleStatusConfig: Record<ArticleStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  NOT_PROCESSED: { label: "Не опрацьовано", variant: "outline" },
  IN_DISCUSSION: { label: "В обговоренні", variant: "secondary" },
  APPROVED: { label: "Затверджено", variant: "default" },
  REJECTED: { label: "Відхилено", variant: "destructive" },
};

interface StatusBadgeProps {
  status: BillStatus | ArticleStatus;
  type: "bill" | "article";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const config = type === "bill"
    ? billStatusConfig[status as BillStatus]
    : articleStatusConfig[status as ArticleStatus];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
