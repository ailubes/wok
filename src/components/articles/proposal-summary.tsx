import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, User } from "lucide-react";
import { VotingPanel } from "@/components/articles/voting-panel";
import type { ProposalStatus, VoteValue } from "@prisma/client";

interface ProposalSummaryProps {
  proposal: {
    id: string;
    proposedText: string;
    justification: string | null;
    status: ProposalStatus;
    author: {
      id: string;
      fullName: string;
      organization: string | null;
    };
    _count: {
      votes: number;
    };
    votes: Array<{
      value: VoteValue;
      user: {
        fullName: string;
      };
    }>;
  };
  userVote?: {
    value: VoteValue;
  } | null;
  userRole?: "ADMIN" | "MEMBER" | "OBSERVER";
  isAdmin?: boolean;
  onViewFull?: () => void;
  onVote?: () => void;
}

export function ProposalSummary({
  proposal,
  userVote,
  userRole = "OBSERVER",
  isAdmin = false,
  onViewFull,
  onVote,
}: ProposalSummaryProps) {
  const approveCount = proposal.votes.filter((v) => v.value === "APPROVE").length;
  const rejectCount = proposal.votes.filter((v) => v.value === "REJECT").length;
  const abstainCount = proposal.votes.filter((v) => v.value === "ABSTAIN").length;

  const statusConfig = {
    APPROVED: {
      label: "Затверджена пропозиція",
      variant: "default" as const,
      icon: CheckCircle,
      color: "text-primary",
    },
    VOTING: {
      label: "Голосування",
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600",
    },
    DRAFT: {
      label: "Чернетка",
      variant: "outline" as const,
      icon: User,
      color: "text-muted-foreground",
    },
    REJECTED: {
      label: "Відхилено",
      variant: "destructive" as const,
      icon: CheckCircle,
      color: "text-destructive",
    },
  };

  const config = statusConfig[proposal.status];
  const Icon = config.icon;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Пропозиція робочої групи
          </CardTitle>
          <Badge variant={config.variant} className="gap-1 whitespace-nowrap">
            <Icon className="w-3 h-3" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Proposed Text */}
        <div className="prose prose-sm prose-slate max-w-none p-4 bg-primary/5 rounded-md border border-primary/10">
          <div className="whitespace-pre-wrap break-words text-foreground font-serif text-[15px] leading-relaxed">
            {proposal.proposedText}
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="font-medium">Автор:</span>
          <span className="text-foreground">{proposal.author.fullName}</span>
          {proposal.author.organization && (
            <>
              <span className="text-muted-foreground">•</span>
              <span>{proposal.author.organization}</span>
            </>
          )}
        </div>

        {/* Justification */}
        {proposal.justification && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Обґрунтування:
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {proposal.justification}
            </p>
          </div>
        )}

        {/* Vote Counts (for VOTING and APPROVED statuses) */}
        {(proposal.status === "VOTING" || proposal.status === "APPROVED") &&
          proposal._count.votes > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">
                  За: <span className="font-semibold text-foreground">{approveCount}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive"></div>
                <span className="text-sm text-muted-foreground">
                  Проти: <span className="font-semibold text-foreground">{rejectCount}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                <span className="text-sm text-muted-foreground">
                  Утримались: <span className="font-semibold text-foreground">{abstainCount}</span>
                </span>
              </div>
            </div>
          )}

        {/* Voting Panel */}
        <VotingPanel
          proposal={proposal}
          userVote={userVote}
          voteCounts={{
            approve: approveCount,
            reject: rejectCount,
            abstain: abstainCount,
            total: proposal._count.votes,
          }}
          userRole={userRole}
          isAdmin={isAdmin}
        />

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {onViewFull && (
            <Button variant="outline" size="sm" onClick={onViewFull}>
              Переглянути повністю
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
