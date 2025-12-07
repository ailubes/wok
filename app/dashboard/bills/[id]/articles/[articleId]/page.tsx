import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleHeader } from "@/components/articles/article-header";
import { ThreeColumnLayout } from "@/components/articles/three-column-layout";
import { CommentsSection } from "@/components/articles/comments-section";

interface ArticleWorkspacePageProps {
  params: Promise<{
    id: string;
    articleId: string;
  }>;
}

export default async function ArticleWorkspacePage({
  params,
}: ArticleWorkspacePageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Await params to access the ids
  const { id: billId, articleId } = await params;

  // Fetch article with all related data
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      bill: {
        select: {
          id: true,
          title: true,
          registrationNumber: true,
        },
      },
      proposals: {
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              organization: true,
            },
          },
          votes: {
            include: {
              user: {
                select: {
                  fullName: true,
                },
              },
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      comments: {
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
        where: {
          parentId: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  // Handle 404
  if (!article) {
    notFound();
  }

  // Verify article belongs to the bill
  if (article.billId !== billId) {
    notFound();
  }

  // Separate proposals by status
  const approvedProposal = article.proposals.find(
    (p) => p.status === "APPROVED"
  );
  const votingProposal = article.proposals.find((p) => p.status === "VOTING");
  const draftProposals = article.proposals.filter((p) => p.status === "DRAFT");

  // Determine if user can comment (not OBSERVER)
  const canComment = session.user.role !== "OBSERVER";

  return (
    <div className="space-y-6 pb-8">
      {/* Article Header */}
      <ArticleHeader
        bill={article.bill}
        article={{
          id: article.id,
          articleNumber: article.articleNumber,
          title: article.title,
          status: article.status,
        }}
      />

      {/* Three-Column Layout */}
      <div className="container mx-auto px-4">
        <ThreeColumnLayout
          currentLawText={article.currentLawText}
          draftBillText={article.draftBillText}
          approvedProposal={approvedProposal || null}
          votingProposal={votingProposal}
          draftProposals={draftProposals}
          userRole={session.user.role}
          articleId={article.id}
        />
      </div>

      {/* Comments Section */}
      <div className="container mx-auto px-4">
        <CommentsSection
          articleId={article.id}
          comments={article.comments}
          canComment={canComment}
        />
      </div>
    </div>
  );
}
