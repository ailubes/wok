import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Calendar } from "lucide-react";
import type { BillStatus } from "@prisma/client";

interface BillCardProps {
  id: string;
  title: string;
  registrationNumber: string;
  description: string | null;
  status: BillStatus;
  articleCount: number;
  proposalCount: number;
  createdAt: Date;
}

const statusConfig: Record<BillStatus, { label: string; variant: "default" | "secondary" }> = {
  ACTIVE: { label: "Активний", variant: "default" },
  ARCHIVED: { label: "Архівовано", variant: "secondary" },
};

export function BillCard({
  id,
  title,
  registrationNumber,
  description,
  status,
  articleCount,
  proposalCount,
  createdAt,
}: BillCardProps) {
  const config = statusConfig[status];

  return (
    <Link href={`/dashboard/bills/${id}`}>
      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <p className="text-xs font-mono text-muted-foreground">{registrationNumber}</p>
              <CardTitle className="text-base leading-tight">{title}</CardTitle>
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {description && (
            <CardDescription className="line-clamp-2 mb-4">
              {description}
            </CardDescription>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{articleCount} статей</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{proposalCount} пропозицій</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(createdAt).toLocaleDateString("uk-UA")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
