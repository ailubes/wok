import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function ArticleNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
      <div className="flex flex-col items-center space-y-4">
        <FileQuestion className="w-20 h-20 text-slate-300" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Статтю не знайдено
          </h1>
          <p className="text-lg text-slate-600 max-w-md">
            Вибачте, але стаття, яку ви шукаєте, не існує або була видалена.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/bills">
          <Button variant="default">Повернутися до законопроєктів</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Повернутися до панелі керування</Button>
        </Link>
      </div>
    </div>
  );
}
