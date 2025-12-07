/**
 * Comments API Endpoint
 *
 * POST /api/comments
 * Creates a new comment or reply for an article
 *
 * GET /api/comments?articleId=xxx
 * Fetches all comments for an article with nested replies
 *
 * Request body (POST):
 * - articleId: string (required)
 * - text: string (required, min 10 chars, max 2000 chars)
 * - parentId: string (optional, for replies)
 *
 * Response:
 * - 200/201: Success
 * - 400: Validation error
 * - 401: Unauthorized
 * - 403: Forbidden (OBSERVER role)
 * - 404: Article/Parent comment not found
 * - 500: Server error
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for comment creation
const commentSchema = z.object({
  articleId: z.string().uuid("ID статті має бути валідним UUID"),
  text: z
    .string()
    .min(10, "Коментар має містити щонайменше 10 символів")
    .max(2000, "Коментар не може перевищувати 2000 символів"),
  parentId: z.string().uuid("ID батьківського коментаря має бути валідним UUID").optional(),
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

    // Check user role (OBSERVER cannot create comments)
    if (session.user.role === "OBSERVER") {
      return NextResponse.json(
        { error: "Спостерігачі не можуть створювати коментарі" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = commentSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    const { articleId, text, parentId } = validationResult.data;

    // Check if article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Статтю не знайдено" },
        { status: 404 }
      );
    }

    // If parentId provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, articleId: true },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Батьківський коментар не знайдено" },
          { status: 404 }
        );
      }

      // Verify parent comment belongs to the same article
      if (parentComment.articleId !== articleId) {
        return NextResponse.json(
          { error: "Батьківський коментар належить іншій статті" },
          { status: 400 }
        );
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        articleId,
        userId: session.user.id,
        text,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            organization: true,
          },
        },
      },
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        comment,
        message: parentId ? "Відповідь успішно додано" : "Коментар успішно додано",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment creation error:", error);

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
      { error: "Виникла помилка при створенні коментаря" },
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

    // Get articleId from query params
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { error: "Не вказано ID статті" },
        { status: 400 }
      );
    }

    // Fetch comments with nested replies recursively
    // We'll fetch all comments and structure them on the client
    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            organization: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                organization: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    organization: true,
                  },
                },
                replies: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        fullName: true,
                        organization: true,
                      },
                    },
                    replies: {
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
                        createdAt: "asc",
                      },
                    },
                  },
                  orderBy: {
                    createdAt: "asc",
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Comments fetch error:", error);

    return NextResponse.json(
      { error: "Виникла помилка при завантаженні коментарів" },
      { status: 500 }
    );
  }
}
