import { BillCard } from "./bill-card";

interface BillsListProps {
  bills: Array<{
    id: string;
    title: string;
    registrationNumber: string | null;
    description: string | null;
    status: "ACTIVE" | "ARCHIVED";
    createdAt: Date;
    _count: {
      articles: number;
    };
    articles: Array<{
      _count: {
        proposals: number;
      };
    }>;
  }>;
}

export function BillsList({ bills }: BillsListProps) {
  if (bills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Законопроєкти не знайдено</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bills.map((bill) => {
        const proposalCount = bill.articles.reduce(
          (sum, article) => sum + article._count.proposals,
          0
        );

        return (
          <BillCard
            key={bill.id}
            id={bill.id}
            title={bill.title}
            registrationNumber={bill.registrationNumber || ""}
            description={bill.description}
            status={bill.status}
            articleCount={bill._count.articles}
            proposalCount={proposalCount}
            createdAt={bill.createdAt}
          />
        );
      })}
    </div>
  );
}
