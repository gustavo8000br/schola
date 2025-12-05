import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { AlertCircle, BookOpen, Calendar, Award, Users, BarChart3, Settings, LogOut } from "lucide-react";

// Componente do Dashboard do Aluno
function StudentDashboard() {
  const { user } = useAuth();
  const grades = trpc.student.grades.useQuery();
  const attendance = trpc.student.attendance.useQuery();
  const absenceCount = trpc.student.absenceCount.useQuery();
  const studentProfile = trpc.student.profile.useQuery();
  const announcements = trpc.announcements.list.useQuery();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bem-vindo, {user?.name}!</h2>
        <p className="text-muted-foreground">Acompanhe seu progresso acadêmico</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.data ? new Set(grades.data.map(g => g.subject)).size : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {grades.data && grades.data.length > 0
                ? (grades.data.reduce((sum, g) => sum + parseFloat(g.grade.toString()), 0) / grades.data.length).toFixed(1)
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{absenceCount.data || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Presença</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {attendance.data
                ? ((attendance.data.filter(a => a.present).length / attendance.data.length) * 100).toFixed(0)
                : "N/A"}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Notas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {grades.isLoading ? (
                <p className="text-muted-foreground">Carregando...</p>
              ) : grades.data && grades.data.length > 0 ? (
                <div className="space-y-3">
                  {grades.data.slice(0, 5).map((grade) => (
                    <div key={grade.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{grade.subject}</p>
                        <p className="text-sm text-muted-foreground">{grade.period} - {grade.year}</p>
                      </div>
                      <div className="text-lg font-bold text-primary">{grade.grade}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhuma nota registrada</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Avisos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.isLoading ? (
                <p className="text-muted-foreground text-sm">Carregando...</p>
              ) : announcements.data && announcements.data.length > 0 ? (
                <div className="space-y-3">
                  {announcements.data.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-3 bg-muted rounded-lg border-l-4 border-primary">
                      <p className="font-medium text-sm">{announcement.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum aviso</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente do Dashboard do Professor
function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bem-vindo, Professor(a) {user?.name}!</h2>
        <p className="text-muted-foreground">Gerencie suas turmas e notas dos alunos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Turmas atribuídas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground mt-1">Total de alunos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <p className="text-xs text-muted-foreground mt-1">Para lançar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Minhas Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Matemática - 1º Ano A</p>
                <p className="text-sm text-muted-foreground">30 alunos</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Matemática - 1º Ano B</p>
                <p className="text-sm text-muted-foreground">28 alunos</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Matemática - 2º Ano</p>
                <p className="text-sm text-muted-foreground">27 alunos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Lançar Notas
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Registrar Frequência
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Ver Lista de Alunos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente do Dashboard do Coordenador
function CoordinatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bem-vindo, Coordenador(a) {user?.name}!</h2>
        <p className="text-muted-foreground">Gerencie turmas, professores e relatórios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Presença</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Desempenho por Turma
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Frequência Geral
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Desempenho por Disciplina
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gerenciamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Gerenciar Turmas
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Gerenciar Professores
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Horários
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente do Dashboard do Diretor
function PrincipalDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Bem-vindo, Diretor(a) {user?.name}!</h2>
        <p className="text-muted-foreground">Visão geral completa da instituição</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Professores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 125k</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Relatórios Executivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Desempenho Geral
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Financeiro
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Recursos Humanos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gerenciamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Usuários
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Configurações
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Auditoria
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Escola
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Calendário
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Políticas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente do Dashboard do Admin
function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Painel de Administração</h2>
        <p className="text-muted-foreground">Bem-vindo, {user?.name}! Você tem acesso total ao sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">389</div>
            <p className="text-xs text-muted-foreground mt-1">Ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">2FA Ativado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-muted-foreground mt-1">Admin(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saúde do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground mt-1">Operacional</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Últimas 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Logins</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gerenciamento de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Listar Usuários
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Criar Usuário
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Gerenciar Papéis
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              Configurações
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Backup
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Logs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline">
              2FA
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Logs de Auditoria
            </Button>
            <Button className="w-full justify-start" variant="outline">
              Tentativas de Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dashboard Principal - Adaptativo por Papel
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar autenticado para acessar o dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/">Voltar para Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-background sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Schola</h1>
            <p className="text-sm text-muted-foreground">
              {user.role === "student" && "Portal do Aluno"}
              {user.role === "teacher" && "Portal do Professor"}
              {user.role === "coordinator" && "Portal do Coordenador"}
              {user.role === "principal" && "Portal do Diretor"}
              {user.role === "admin" && "Painel de Administração"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {user.role === "student" && <StudentDashboard />}
        {user.role === "teacher" && <TeacherDashboard />}
        {user.role === "coordinator" && <CoordinatorDashboard />}
        {user.role === "principal" && <PrincipalDashboard />}
        {user.role === "admin" && <AdminDashboard />}
      </main>
    </div>
  );
}
