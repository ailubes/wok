import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Vote, ArrowRight } from "lucide-react";
import Link from "next/link";

const roleLabels = {
  ADMIN: "Адміністратор",
  MEMBER: "Учасник",
  OBSERVER: "Спостерігач",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                Вітаємо, {user.fullName}!
              </CardTitle>
              <CardDescription className="mt-1">
                {user.organization || "Ваш робочий простір для законопроєктів"}
              </CardDescription>
            </div>
            <Badge variant="secondary">{roleLabels[user.role as keyof typeof roleLabels]}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/dashboard/bills">
                Переглянути законопроєкти
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">Налаштування</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Законопроєкти</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Активних проєктів</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Пропозиції</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">На розгляді</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Голосування</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Очікують голосу</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Швидкі дії</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href="/dashboard/bills">
                <FileText className="mr-3 h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Законопроєкти</div>
                  <div className="text-xs text-muted-foreground">Перегляд усіх проєктів</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-3" asChild>
              <Link href="/dashboard/settings">
                <Vote className="mr-3 h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">Налаштування</div>
                  <div className="text-xs text-muted-foreground">Керування профілем</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
