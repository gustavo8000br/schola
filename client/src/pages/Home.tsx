import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { BookOpen, BarChart3, Users, Zap } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="border-b border-border bg-background">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
            <Button asChild>
              <Link href="/dashboard">Ir para Dashboard</Link>
            </Button>
          </div>
        </nav>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Bem-vindo ao Schola!</h2>
            <p className="text-muted-foreground mb-8">Acesse seu dashboard para acompanhar seu desempenho acadêmico</p>
            <Button size="lg" asChild>
              <Link href="/dashboard">Acessar Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Seu Currículo Acadêmico, Desde Cedo
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schola é uma plataforma de gestão escolar que ajuda você a acompanhar seu desempenho, 
            notas, frequência e construir um currículo sólido para o futuro.
          </p>
          <Button size="lg" asChild>
            <a href={getLoginUrl()}>Começar Agora</a>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <BookOpen className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Suas Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Acompanhe suas notas por disciplina e período de forma organizada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Frequência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitore sua presença e faltas com registros detalhados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Seu Currículo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Consolide suas conquistas e atividades extracurriculares
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-8 h-8 text-primary mb-2" />
              <CardTitle>Avisos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receba notificações importantes da sua escola
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Pronto para começar sua jornada?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Faça login para acessar seu dashboard e começar a acompanhar seu desempenho acadêmico
          </p>
          <Button size="lg" asChild>
            <a href={getLoginUrl()}>Entrar no Schola</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background/50 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Desenvolvido com 💙 para transformar a gestão escolar</p>
        </div>
      </footer>
    </div>
  );
}
