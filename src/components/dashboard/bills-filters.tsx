"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export function BillsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/bills?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Пошук законопроєктів..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        defaultValue={searchParams.get("status") || "all"}
        onValueChange={(value) => updateFilter("status", value)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Усі статуси</SelectItem>
          <SelectItem value="ACTIVE">Активні</SelectItem>
          <SelectItem value="ARCHIVED">Архівовані</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("sort") || "newest"}
        onValueChange={(value) => updateFilter("sort", value)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Сортування" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Найновіші</SelectItem>
          <SelectItem value="oldest">Найстаріші</SelectItem>
          <SelectItem value="title">За назвою</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
