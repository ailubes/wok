import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const roleLabels = {
  ADMIN: "Адміністратор",
  MEMBER: "Учасник",
  OBSERVER: "Спостерігач",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Налаштування</h1>
        <p className="text-muted-foreground">Керуйте своїм профілем та налаштуваннями</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Профіль</CardTitle>
          <CardDescription>Інформація про ваш обліковий запис</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Повне ім&apos;я</label>
              <p className="text-foreground">{user.fullName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Роль</label>
              <div className="mt-1">
                <Badge variant="secondary">{roleLabels[user.role as keyof typeof roleLabels]}</Badge>
              </div>
            </div>
            {user.organization && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Організація</label>
                <p className="text-foreground">{user.organization}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дозволи</CardTitle>
          <CardDescription>Ваші можливості в системі</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Перегляд законопроєктів
            </li>
            {(user.role === "ADMIN" || user.role === "MEMBER") && (
              <>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Створення пропозицій
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Голосування за пропозиції
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Коментування
                </li>
              </>
            )}
            {user.role === "ADMIN" && (
              <>
                <Separator className="my-2" />
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Керування користувачами
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Створення законопроєктів
                </li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
