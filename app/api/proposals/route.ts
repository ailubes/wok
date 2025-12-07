/**
 * Proposal Creation API Endpoint
 *
 * POST /api/proposals
 * Creates a new proposal for an article
 *
 * Request body:
 * - articleId: string (required)
 * - proposedText: string (required, min 10 chars, max 10000 chars)
 * - justification: string (required, min 20 chars, max 2000 chars)
 *
 * Response:
 * - 201: Proposal created successfully
 * - 400: Validation error
 * - 401: Unauthorized
 * - 403: Forbidden (not Member or Admin)
 * - 404: Article not found
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for proposal creation
const proposalSchema = z.object({
  articleId: z.string().uuid("ID статті має бути валідним UUID"),
  proposedText: z
    .string()
    .min(10, "Текст пропозиції має містити щонайменше 10 символів")
    .max(10000, "Текст пропозиції не може перевищувати 10000 символів"),
  justification: z
    .string()
    .min(20, "Обґрунтування має містити щонайменше 20 символів")
    .max(2000, "Обґрунтування не може перевищувати 2000 символів"),
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

    // Check user role (only MEMBER and ADMIN can create proposals)
    if (session.user.role !== "MEMBER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Тільки члени робочої групи можуть створювати пропозиції" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = proposalSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { articleId, proposedText, justification } = validationResult.data;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        status: true,
        billId: true
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Статтю не знайдено" },
        { status: 404 }
      );
    }

    // Create proposal and update article status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the proposal
      const proposal = await tx.proposal.create({
        data: {
          articleId,
          authorId: session.user.id,
          proposedText,
          justification,
          status: "DRAFT",
        },
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              organization: true,
            },
          },
        },
      });

      // Update article status to IN_DISCUSSION if it's NOT_PROCESSED
      if (article.status === "NOT_PROCESSED") {
        await tx.article.update({
          where: { id: articleId },
          data: { status: "IN_DISCUSSION" },
        });
      }

      return proposal;
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        proposal: result,
        message: "Пропозицію успішно створено",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Proposal creation error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Невірний ID статті або користувача" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Виникла помилка при створенні пропозиції" },
      { status: 500 }
    );
  }
}
