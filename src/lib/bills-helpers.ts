import type { ArticleStatus } from "@prisma/client";

/**
 * Calculate article statistics from raw article data
 */
export function calculateArticleStats(articles: Array<{ status: ArticleStatus }>) {
  const stats = {
    total: articles.length,
    notProcessed: 0,
    inDiscussion: 0,
    approved: 0,
    rejected: 0,
  };

  articles.forEach((article) => {
    switch (article.status) {
      case "NOT_PROCESSED":
        stats.notProcessed++;
        break;
      case "IN_DISCUSSION":
        stats.inDiscussion++;
        break;
      case "APPROVED":
        stats.approved++;
        break;
      case "REJECTED":
        stats.rejected++;
        break;
    }
  });

  return stats;
}
