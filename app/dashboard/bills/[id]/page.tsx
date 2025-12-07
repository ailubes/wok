import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BillHeader } from "@/components/bills/bill-header";
import { ArticleStatsPanel } from "@/components/bills/article-stats-panel";
import { ArticleTree } from "@/components/bills/article-tree";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Edit, Archive } from "lucide-react";
import Link from "next/link";
import type { ArticleStatus } from "@prisma/client";

interface BillDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BillDetailPage({ params }: BillDetailPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Await params to access the id
  const { id } = await params;

  // Fetch bill with articles and counts
  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      articles: {
        include: {
          _count: {
            select: {
              proposals: true,
              comments: true,
            },
          },
        },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  // Handle 404
  if (!bill) {
    notFound();
  }

  // Transform articles data for components
  const articlesData = bill.articles.map((article) => ({
    id: article.id,
    number: article.articleNumber,
    title: article.title || "",
    status: article.status,
    _count: {
      proposals: article._count.proposals,
      comments: article._count.comments,
    },
  }));

  // Check if user is admin
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link href="/dashboard/bills">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад до законопроєктів
        </Button>
      </Link>

      {/* Bill Header */}
      <BillHeader
        id={bill.id}
        title={bill.title}
        registrationNumber={bill.registrationNumber || ""}
        status={bill.status}
        description={bill.description}
        createdAt={bill.createdAt}
        updatedAt={bill.updatedAt}
      />

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/dashboard/bills/${bill.id}/articles/new`}>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Додати статтю
            </Button>
          </Link>
          <Link href={`/dashboard/bills/${bill.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Редагувати
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Archive className="w-4 h-4" />
            Архівувати
          </Button>
        </div>
      )}

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Content: Article Tree */}
        <div className="order-2 lg:order-1">
          <ArticleTree articles={articlesData} billId={bill.id} />
        </div>

        {/* Sidebar: Statistics Panel */}
        <div className="order-1 lg:order-2">
          <ArticleStatsPanel articles={bill.articles} />
        </div>
      </div>
    </div>
  );
}
