/**
 * Start Voting API Endpoint
 *
 * PATCH /api/proposals/[id]/start-voting
 * Change proposal status from DRAFT to VOTING
 *
 * Response:
 * - 200: Voting started successfully
 * - 401: Unauthorized
 * - 403: Forbidden (only ADMIN can start voting)
 * - 404: Proposal not found
 * - 400: Proposal not in DRAFT status
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Необхідна авторизація" },
        { status: 401 }
      );
    }

    // Only ADMIN can start voting
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Тільки адміністратор може розпочати голосування" },
        { status: 403 }
      );
    }

    const proposalId = params.id;

    // Check if proposal exists
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Пропозицію не знайдено" },
        { status: 404 }
      );
    }

    // Check if proposal is in DRAFT status
    if (proposal.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Можна розпочати голосування тільки для чернеток" },
        { status: 400 }
      );
    }

    // Update proposal status to VOTING
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: "VOTING",
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            organization: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        proposal: updatedProposal,
        message: "Голосування розпочато",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Start voting error:", error);

    return NextResponse.json(
      { error: "Виникла помилка при запуску голосування" },
      { status: 500 }
    );
  }
}
