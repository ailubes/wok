import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function BillNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-6 bg-muted rounded-full">
            <FileQuestion className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Законопроєкт не знайдено
        </h1>

        <p className="text-lg text-muted-foreground max-w-md">
          На жаль, ми не змогли знайти законопроєкт за вказаним ідентифікатором.
          Можливо, він був видалений або переміщений.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/bills">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Повернутися до списку
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            На головну
          </Button>
        </Link>
      </div>
    </div>
  );
}
