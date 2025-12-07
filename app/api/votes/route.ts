/**
 * Vote API Endpoint
 *
 * POST /api/votes
 * Cast or update a vote on a proposal
 *
 * GET /api/votes?proposalId=xxx
 * Get votes for a specific proposal
 *
 * Request body (POST):
 * - proposalId: string (required)
 * - value: "APPROVE" | "REJECT" | "ABSTAIN" (required)
 *
 * Response:
 * - 200: Vote recorded successfully
 * - 400: Validation error
 * - 401: Unauthorized
 * - 403: Forbidden (Observer role cannot vote, or proposal not in VOTING status)
 * - 404: Proposal not found
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { VoteValue, ProposalStatus, ArticleStatus } from "@prisma/client";

// Validation schema for vote submission
const voteSchema = z.object({
  proposalId: z.string().uuid("ID пропозиції має бути валідним UUID"),
  value: z.enum(["APPROVE", "REJECT", "ABSTAIN"]),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    // Check user role (OBSERVER cannot vote)
    if (session.user.role === "OBSERVER") {
      return NextResponse.json(
        { error: "Спостерігачі не можуть голосувати" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = voteSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { proposalId, value } = validationResult.data;

    // Check if proposal exists and is in VOTING status
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        article: {
          select: { id: true },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Пропозицію не знайдено" },
        { status: 404 }
      );
    }

    if (proposal.status !== "VOTING") {
      return NextResponse.json(
        { error: "Голосування доступне тільки для пропозицій у статусі VOTING" },
        { status: 403 }
      );
    }

    // Use transaction to upsert vote and potentially update proposal/article status
    const result = await prisma.$transaction(async (tx) => {
      // Upsert the vote (allows user to change their vote)
      const vote = await tx.vote.upsert({
        where: {
          proposalId_userId: {
            proposalId,
            userId: session.user.id,
          },
        },
        update: {
          value: value as VoteValue,
        },
        create: {
          proposalId,
          userId: session.user.id,
          value: value as VoteValue,
        },
      });

      // Get all votes for this proposal to check threshold
      const allVotes = await tx.vote.findMany({
        where: { proposalId },
        select: { value: true },
      });

      const totalVotes = allVotes.length;
      const approveCount = allVotes.filter((v) => v.value === "APPROVE").length;
      const rejectCount = allVotes.filter((v) => v.value === "REJECT").length;

      let newProposalStatus: ProposalStatus = proposal.status;
      let newArticleStatus: ArticleStatus | null = null;

      // Check if >50% threshold is met
      if (totalVotes > 0) {
        const approvePercentage = (approveCount / totalVotes) * 100;
        const rejectPercentage = (rejectCount / totalVotes) * 100;

        if (approvePercentage > 50) {
          newProposalStatus = "APPROVED";
          newArticleStatus = "APPROVED";
        } else if (rejectPercentage > 50) {
          newProposalStatus = "REJECTED";
          newArticleStatus = "REJECTED";
        }
      }

      // Update proposal status if it changed
      if (newProposalStatus !== proposal.status) {
        await tx.proposal.update({
          where: { id: proposalId },
          data: { status: newProposalStatus },
        });
      }

      // Update article status if needed
      if (newArticleStatus) {
        await tx.article.update({
          where: { id: proposal.article.id },
          data: { status: newArticleStatus },
        });
      }

      return {
        vote,
        voteCounts: {
          approve: approveCount,
          reject: rejectCount,
          abstain: allVotes.filter((v) => v.value === "ABSTAIN").length,
          total: totalVotes,
        },
        proposalStatus: newProposalStatus,
      };
    });

    return NextResponse.json(
      {
        success: true,
        vote: result.vote,
        voteCounts: result.voteCounts,
        proposalStatus: result.proposalStatus,
        message: "Ваш голос зараховано",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Vote submission error:", error);

    return NextResponse.json(
      { error: "Виникла помилка при голосуванні" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    // Get proposalId from query params
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get("proposalId");

    if (!proposalId) {
      return NextResponse.json(
        { error: "Параметр proposalId обов'язковий" },
        { status: 400 }
      );
    }

    // Get all votes for the proposal
    const votes = await prisma.vote.findMany({
      where: { proposalId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            organization: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate vote counts
    const approveCount = votes.filter((v) => v.value === "APPROVE").length;
    const rejectCount = votes.filter((v) => v.value === "REJECT").length;
    const abstainCount = votes.filter((v) => v.value === "ABSTAIN").length;

    return NextResponse.json({
      success: true,
      votes,
      voteCounts: {
        approve: approveCount,
        reject: rejectCount,
        abstain: abstainCount,
        total: votes.length,
      },
    });
  } catch (error) {
    console.error("Vote fetch error:", error);

    return NextResponse.json(
      { error: "Виникла помилка при отриманні голосів" },
      { status: 500 }
    );
  }
}
