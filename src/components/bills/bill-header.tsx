import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import type { BillStatus } from "@prisma/client";

interface BillHeaderProps {
  id: string;
  title: string;
  registrationNumber: string;
  description: string | null;
  status: BillStatus;
  createdAt: Date;
  updatedAt: Date;
}

const statusConfig: Record<BillStatus, { label: string; variant: "default" | "secondary" }> = {
  ACTIVE: { label: "Активний", variant: "default" },
  ARCHIVED: { label: "Архівовано", variant: "secondary" },
};

export function BillHeader({
  title,
  registrationNumber,
  description,
  status,
  createdAt,
}: BillHeaderProps) {
  const config = statusConfig[status];

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/bills">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад до списку
        </Link>
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">{registrationNumber}</span>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && (
            <p className="text-muted-foreground max-w-3xl">{description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>Створено: {new Date(createdAt).toLocaleDateString("uk-UA")}</span>
        </div>
      </div>
    </div>
  );
}
