import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Vote, Shield } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Законопроєкти",
    description: "Перегляд та аналіз законодавчих ініціатив у зручному форматі",
  },
  {
    icon: Users,
    title: "Співпраця",
    description: "Колективне обговорення та пропозиції змін до статей",
  },
  {
    icon: Vote,
    title: "Голосування",
    description: "Демократичне прийняття рішень щодо пропозицій",
  },
  {
    icon: Shield,
    title: "Прозорість",
    description: "Відкритий процес формування законодавства",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-foreground">AgroLaw Vote</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Увійти</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Реєстрація</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Платформа для колективного
            <br />
            <span className="text-primary">опрацювання законопроєктів</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Сучасний інструмент для демократичного обговорення та формування
            законодавчих ініціатив у сфері аграрної політики
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Почати роботу</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Увійти в систему</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">Можливості платформи</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="bg-card border-border">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © 2024 AgroLaw Vote. Усі права захищено.
        </div>
      </footer>
    </div>
  );
}
