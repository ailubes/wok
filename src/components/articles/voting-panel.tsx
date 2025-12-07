"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThumbsUp, ThumbsDown, Minus, CheckCircle, XCircle } from "lucide-react";
import type { ProposalStatus, VoteValue } from "@prisma/client";

interface VotingPanelProps {
  proposal: {
    id: string;
    status: ProposalStatus;
  };
  userVote?: {
    value: VoteValue;
  } | null;
  voteCounts: {
    approve: number;
    reject: number;
    abstain: number;
    total: number;
  };
  userRole: "ADMIN" | "MEMBER" | "OBSERVER";
  isAdmin: boolean;
}

export function VotingPanel({
  proposal,
  userVote,
  voteCounts,
  userRole,
  isAdmin,
}: VotingPanelProps) {
  const router = useRouter();
  const [isVoting, setIsVoting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const canVote = userRole !== "OBSERVER" &&
    (proposal.status === "VOTING");

  const isFinalized = proposal.status === "APPROVED" ||
    proposal.status === "REJECTED";

  const handleVote = async (value: VoteValue) => {
    if (!canVote) return;

    setIsVoting(true);

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposalId: proposal.id,
          value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Помилка при голосуванні");
        return;
      }

      toast.success(data.message || "Ваш голос зараховано");
      router.refresh();
    } catch (error) {
      console.error("Vote error:", error);
      toast.error("Виникла помилка при голосуванні");
    } finally {
      setIsVoting(false);
    }
  };

  const handleStartVoting = async () => {
    setIsStarting(true);

    try {
      const response = await fetch(`/api/proposals/${proposal.id}/start-voting`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Помилка при запуску голосування");
        return;
      }

      toast.success(data.message || "Голосування розпочато");
      router.refresh();
    } catch (error) {
      console.error("Start voting error:", error);
      toast.error("Виникла помилка при запуску голосування");
    } finally {
      setIsStarting(false);
    }
  };

  // Calculate percentages for progress bars
  const total = voteCounts.total || 1; // Avoid division by zero
  const approvePercent = (voteCounts.approve / total) * 100;
  const rejectPercent = (voteCounts.reject / total) * 100;
  const abstainPercent = (voteCounts.abstain / total) * 100;

  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Голосування</h3>
        {proposal.status === "APPROVED" && (
          <Badge variant="default" className="gap-1 bg-primary">
            <CheckCircle className="w-3 h-3" />
            Схвалено
          </Badge>
        )}
        {proposal.status === "REJECTED" && (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Відхилено
          </Badge>
        )}
        {proposal.status === "VOTING" && (
          <Badge variant="secondary" className="gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            Голосування активне
          </Badge>
        )}
      </div>

      {/* Draft state - only show Start Voting button for admin */}
      {proposal.status === "DRAFT" && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">
            Пропозиція знаходиться у статусі чернетки
          </p>
          {isAdmin && (
            <Button
              onClick={handleStartVoting}
              disabled={isStarting}
              size="sm"
            >
              {isStarting ? "Запуск..." : "Розпочати голосування"}
            </Button>
          )}
        </div>
      )}

      {/* Voting buttons - show when proposal is in VOTING status and user can vote */}
      {proposal.status === "VOTING" && canVote && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground mb-2">Ваш голос:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleVote("APPROVE")}
              disabled={isVoting}
              variant={userVote?.value === "APPROVE" ? "default" : "outline"}
              className={
                userVote?.value === "APPROVE"
                  ? "bg-primary hover:bg-primary/90"
                  : "border-primary/50 text-primary hover:bg-primary/10"
              }
              size="sm"
            >
              <ThumbsUp className="w-4 h-4" />
              Схвалити
            </Button>
            <Button
              onClick={() => handleVote("REJECT")}
              disabled={isVoting}
              variant={userVote?.value === "REJECT" ? "destructive" : "outline"}
              className={
                userVote?.value === "REJECT"
                  ? ""
                  : "border-destructive/50 text-destructive hover:bg-destructive/10"
              }
              size="sm"
            >
              <ThumbsDown className="w-4 h-4" />
              Відхилити
            </Button>
            <Button
              onClick={() => handleVote("ABSTAIN")}
              disabled={isVoting}
              variant={userVote?.value === "ABSTAIN" ? "secondary" : "outline"}
              className={
                userVote?.value === "ABSTAIN"
                  ? ""
                  : "border-border text-muted-foreground hover:bg-muted"
              }
              size="sm"
            >
              <Minus className="w-4 h-4" />
              Утриматися
            </Button>
          </div>
        </div>
      )}

      {/* Vote counts and results - show if there are votes or proposal is finalized */}
      {(voteCounts.total > 0 || isFinalized) && (
        <div className="space-y-3">
          <div className="space-y-2">
            {/* Approve votes */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">За схвалення</span>
                <span className="text-foreground font-semibold">
                  {voteCounts.approve} ({approvePercent.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${approvePercent}%` }}
                />
              </div>
            </div>

            {/* Reject votes */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Проти</span>
                <span className="text-foreground font-semibold">
                  {voteCounts.reject} ({rejectPercent.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-destructive transition-all duration-300"
                  style={{ width: `${rejectPercent}%` }}
                />
              </div>
            </div>

            {/* Abstain votes */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Утримались</span>
                <span className="text-foreground font-semibold">
                  {voteCounts.abstain} ({abstainPercent.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground/50 transition-all duration-300"
                  style={{ width: `${abstainPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total votes */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Всього голосів: <span className="font-semibold text-foreground">{voteCounts.total}</span>
            </p>
          </div>
        </div>
      )}

      {/* Observer message */}
      {userRole === "OBSERVER" && proposal.status === "VOTING" && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground italic">
            Спостерігачі не можуть голосувати
          </p>
        </div>
      )}
    </div>
  );
}
