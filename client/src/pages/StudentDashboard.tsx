import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { AlertCircle, BookOpen, Calendar, Award } from "lucide-react";

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  
  const studentProfile = trpc.student.profile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const grades = trpc.student.grades.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const attendance = trpc.student.attendance.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const absenceCount = trpc.student.absenceCount.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  const announcements = trpc.announcements.list.useQuery();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Bem-vindo ao Schola</CardTitle>
            <CardDescription>
              Faça login para acessar seu currículo e acompanhar seu desempenho acadêmico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/login">Fazer Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">Acompanhe seu progresso acadêmico e currículo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total de Notas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Disciplinas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {grades.data ? new Set(grades.data.map(g => g.subject)).size : 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Disciplinas cursadas</p>
            </CardContent>
          </Card>

          {/* Média Geral */}
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
              <p className="text-xs text-muted-foreground mt-1">Seu desempenho</p>
            </CardContent>
          </Card>

          {/* Faltas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Faltas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{absenceCount.data || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Dias ausentes</p>
            </CardContent>
          </Card>

          {/* Presença */}
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
              <p className="text-xs text-muted-foreground mt-1">Taxa de presença</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Notas e Frequência */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notas Recentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Notas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {grades.isLoading ? (
                  <p className="text-muted-foreground">Carregando notas...</p>
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
                  <p className="text-muted-foreground">Nenhuma nota registrada ainda</p>
                )}
              </CardContent>
            </Card>

            {/* Frequência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Frequência Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendance.isLoading ? (
                  <p className="text-muted-foreground">Carregando frequência...</p>
                ) : attendance.data && attendance.data.length > 0 ? (
                  <div className="space-y-2">
                    {attendance.data.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex justify-between items-center p-2">
                        <p className="text-sm">{new Date(record.date).toLocaleDateString("pt-BR")}</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.present 
                            ? "bg-green-100 text-green-800" 
                            : record.justifiedAbsence
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {record.present ? "Presente" : record.justifiedAbsence ? "Falta Justificada" : "Falta"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum registro de frequência</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Avisos e Currículo */}
          <div className="space-y-6">
            {/* Avisos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Avisos Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.isLoading ? (
                  <p className="text-muted-foreground text-sm">Carregando avisos...</p>
                ) : announcements.data && announcements.data.length > 0 ? (
                  <div className="space-y-3">
                    {announcements.data.slice(0, 3).map((announcement) => (
                      <div key={announcement.id} className="p-3 bg-muted rounded-lg border-l-4 border-primary">
                        <p className="font-medium text-sm">{announcement.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum aviso no momento</p>
                )}
              </CardContent>
            </Card>

            {/* Currículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Seu Currículo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {studentProfile.isLoading ? (
                  <p className="text-muted-foreground text-sm">Carregando currículo...</p>
                ) : studentProfile.data?.profile ? (
                  <div className="space-y-3">
                    {studentProfile.data.profile.achievements && (
                      <div>
                        <p className="text-sm font-medium">Conquistas</p>
                        <p className="text-xs text-muted-foreground mt-1">{studentProfile.data.profile.achievements}</p>
                      </div>
                    )}
                    {studentProfile.data.profile.extracurricularActivities && (
                      <div>
                        <p className="text-sm font-medium">Atividades Extracurriculares</p>
                        <p className="text-xs text-muted-foreground mt-1">{studentProfile.data.profile.extracurricularActivities}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Seu currículo ainda não foi preenchido</p>
                )}
              </CardContent>
            </Card>

            {/* Action Button */}
            <Button className="w-full" variant="outline" asChild>
              <Link href="/curriculum">Ver Currículo Completo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
