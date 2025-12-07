"use client";

import { useState } from "react";
import { TextColumn } from "./text-column";
import { ProposalSummary } from "./proposal-summary";
import { CreateProposalModal } from "./create-proposal-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProposalStatus, UserRole, VoteValue } from "@prisma/client";

type ProposalWithDetails = {
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

interface ThreeColumnLayoutProps {
  currentLawText: string | null;
  draftBillText: string;
  approvedProposal?: ProposalWithDetails | null;
  votingProposal?: ProposalWithDetails;
  draftProposals?: ProposalWithDetails[];
  userRole: UserRole;
  articleId: string;
}

export function ThreeColumnLayout({
  currentLawText,
  draftBillText,
  approvedProposal,
  votingProposal,
  draftProposals = [],
  userRole,
  articleId,
}: ThreeColumnLayoutProps) {
  const [mobileView, setMobileView] = useState<"current" | "draft" | "proposal">("draft");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canCreateProposal = userRole === "ADMIN" || userRole === "MEMBER";
  const hasProposal = approvedProposal || votingProposal;

  // Desktop: 3-column layout
  const DesktopLayout = () => (
    <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-[calc(100vh-300px)] min-h-[600px]">
      {/* Column A: Current Law */}
      <TextColumn
        title="Чинна норма закону"
        content={currentLawText}
        bgColor="bg-muted"
        emptyMessage="Текст чинної норми не вказано"
      />

      {/* Column B: Draft Bill */}
      <TextColumn
        title="Пропонована норма (законопроєкт)"
        content={draftBillText}
        bgColor="bg-card"
      />

      {/* Column C: Group Proposal */}
      <TextColumn
        title="Пропозиція робочої групи"
        content={null}
        bgColor={hasProposal ? "bg-primary/5" : "bg-card"}
        emptyMessage=""
      >
        {hasProposal ? (
          <ProposalSummary proposal={approvedProposal || votingProposal!} />
        ) : draftProposals && draftProposals.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Є {draftProposals.length} чернетк{draftProposals.length === 1 ? "а" : "и"} пропозиц{draftProposals.length === 1 ? "ія" : "ій"}:
            </p>
            <div className="space-y-3">
              {draftProposals.map((proposal) => (
                <div
                  key={proposal!.id}
                  className="p-3 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">{proposal!.author.fullName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {proposal!.proposedText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6">
            <p className="text-muted-foreground text-sm italic">
              Пропозицій ще немає.
              {canCreateProposal
                ? " Будьте першим хто запропонує зміни!"
                : " Очікуйте на пропозиції від членів робочої групи."}
            </p>
            {canCreateProposal && (
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Створити пропозицію
              </Button>
            )}
          </div>
        )}
      </TextColumn>
    </div>
  );

  // Mobile/Tablet: Tabbed layout
  const MobileLayout = () => (
    <div className="lg:hidden">
      <Tabs value={mobileView} onValueChange={(v) => setMobileView(v as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="current">Чинна норма</TabsTrigger>
          <TabsTrigger value="draft">Законопроєкт</TabsTrigger>
          <TabsTrigger value="proposal">Пропозиція</TabsTrigger>
        </TabsList>

        <div className="min-h-[500px]">
          <TabsContent value="current" className="mt-0">
            <TextColumn
              title="Чинна норма закону"
              content={currentLawText}
              bgColor="bg-muted"
              emptyMessage="Текст чинної норми не вказано"
            />
          </TabsContent>

          <TabsContent value="draft" className="mt-0">
            <TextColumn
              title="Пропонована норма (законопроєкт)"
              content={draftBillText}
              bgColor="bg-card"
            />
          </TabsContent>

          <TabsContent value="proposal" className="mt-0">
            <TextColumn
              title="Пропозиція робочої групи"
              content={null}
              bgColor={hasProposal ? "bg-primary/5" : "bg-card"}
              emptyMessage=""
            >
              {hasProposal ? (
                <ProposalSummary proposal={approvedProposal || votingProposal!} />
              ) : draftProposals && draftProposals.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Є {draftProposals.length} чернетк{draftProposals.length === 1 ? "а" : "и"} пропозиц{draftProposals.length === 1 ? "ія" : "ій"}:
                  </p>
                  <div className="space-y-3">
                    {draftProposals.map((proposal) => (
                      <div
                        key={proposal!.id}
                        className="p-3 bg-card rounded-lg border border-border shadow-sm"
                      >
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium text-foreground">{proposal!.author.fullName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {proposal!.proposedText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-6 py-12">
                  <p className="text-muted-foreground text-sm italic">
                    Пропозицій ще немає.
                    {canCreateProposal
                      ? " Будьте першим хто запропонує зміни!"
                      : " Очікуйте на пропозиції від членів робочої групи."}
                  </p>
                  {canCreateProposal && (
                    <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Створити пропозицію
                    </Button>
                  )}
                </div>
              )}
            </TextColumn>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />

      {/* Create Proposal Modal */}
      <CreateProposalModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        articleId={articleId}
        draftText={draftBillText}
      />
    </>
  );
}
