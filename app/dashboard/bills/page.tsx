import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BillsList } from "@/components/dashboard/bills-list";
import { BillsFilters } from "@/components/dashboard/bills-filters";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { Prisma, BillStatus } from "@prisma/client";

type BillFilterStatus = "all" | BillStatus;
type BillSortOption = "newest" | "oldest" | "title";

interface BillsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: BillFilterStatus;
    sort?: BillSortOption;
  }>;
}

export default async function BillsPage({ searchParams }: BillsPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const { search, status, sort } = params;

  const whereClause: Prisma.BillWhereInput = {};

  if (status && status !== "all") {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { registrationNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderByClause: Prisma.BillOrderByWithRelationInput = { createdAt: "desc" };

  if (sort === "oldest") {
    orderByClause = { createdAt: "asc" };
  } else if (sort === "title") {
    orderByClause = { title: "asc" };
  }

  const bills = await prisma.bill.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { articles: true },
      },
      articles: {
        select: {
          _count: {
            select: { proposals: true },
          },
        },
      },
    },
    orderBy: orderByClause,
  });
  const isAdmin = session.user.role === "ADMIN";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Законопроєкти
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Перегляд та голосування за законопроєкти аграрного сектору
          </p>
        </div>

        {isAdmin && (
          <Link href="/dashboard/bills/new">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Новий законопроєкт
            </Button>
          </Link>
        )}
      </div>

      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <BillsFilters />
      </div>

      <BillsList bills={bills} />

      {bills.length > 0 && (
        <div className="text-center text-sm text-muted-foreground pt-6 border-t border-border">
          Знайдено законопроєктів:{" "}
          <span className="font-semibold text-foreground">
            {bills.length}
          </span>
        </div>
      )}
    </div>
  );
}
