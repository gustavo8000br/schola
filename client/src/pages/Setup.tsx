import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Database, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Setup() {
  const [setupMode, setSetupMode] = useState<"demo" | "clean" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: "",
    adminName: "",
    adminEmail: "",
    principalName: "",
    principalEmail: "",
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    // Database
    dbHost: "localhost",
    dbPort: "5432",
    dbUser: "postgres",
    dbPassword: "",
    dbName: "schola",
    // Stack Auth
    stackProjectId: "",
    stackPublishableKey: "",
    stackSecretKey: "",
    // Security
    jwtSecret: "",
    // URLs
    appUrl: "http://localhost:3000",
    apiUrl: "http://localhost:3000/api",
    // Other
    timezone: "America/Sao_Paulo",
    language: "pt-BR",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDemoSetup = async () => {
    setIsLoading(true);
    try {
      // Chamar API para popular com dados aleatórios
      const response = await fetch("/api/setup/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Redirecionar para login
        window.location.href = "/";
      } else {
        alert("Erro ao configurar modo demo");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao configurar modo demo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/setup/clean", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirecionar para login
        window.location.href = "/";
      } else {
        alert("Erro ao configurar instituição");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao configurar instituição");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdvancedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdvancedSettings(prev => ({ ...prev, [name]: value }));
  };

  const generateJwtSecret = () => {
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setAdvancedSettings(prev => ({ ...prev, jwtSecret: secret }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎓 Schola</h1>
          <p className="text-lg text-gray-600">Plataforma de Gestão Escolar</p>
          <p className="text-sm text-gray-500 mt-2">Escolha como você deseja começar</p>
        </div>

        {/* Setup Mode Selection */}
        {!setupMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo Mode Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500"
              onClick={() => setSetupMode("demo")}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-6 h-6 text-blue-600" />
                  <CardTitle>Modo Demonstração</CardTitle>
                </div>
                <CardDescription>
                  Teste a plataforma com dados aleatórios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Usuários fictícios pré-configurados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Dados aleatórios de alunos e notas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Perfeito para explorar funcionalidades
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Pode ser resetado a qualquer momento
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                  Começar com Demo
                </Button>
              </CardContent>
            </Card>

            {/* Clean Setup Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-indigo-500"
              onClick={() => setSetupMode("clean")}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <CardTitle>Setup Limpo</CardTitle>
                </div>
                <CardDescription>
                  Configure sua instituição do zero
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Banco de dados vazio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Configure nome da instituição
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Crie admin e diretor
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Pronto para produção
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">
                  Setup Limpo
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : setupMode === "demo" ? (
          /* Demo Setup */
          <Card>
            <CardHeader>
              <CardTitle>Modo Demonstração</CardTitle>
              <CardDescription>
                Carregando dados de teste...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você será redirecionado para a tela de login com usuários de teste pré-configurados.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-sm">Usuários de Teste Disponíveis:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Admin:</strong> gustavo@schola.local</p>
                  <p><strong>Professor:</strong> fernanda.silva@schola.local</p>
                  <p><strong>Coordenador:</strong> maria.oliveira@schola.local</p>
                  <p><strong>Diretor:</strong> carlos.mendes@schola.local</p>
                  <p><strong>Aluno:</strong> ana.ferreira@schola.local</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSetupMode(null)}
                  disabled={isLoading}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleDemoSetup}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Configurando..." : "Confirmar e Continuar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Clean Setup Form */
          <Card>
            <CardHeader>
              <CardTitle>Setup da Instituição</CardTitle>
              <CardDescription>
                Configure os dados básicos da sua instituição de ensino
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCleanSetup} className="space-y-6">
                {/* Institution Name */}
                <div className="space-y-2">
                  <Label htmlFor="institutionName">Nome da Instituição *</Label>
                  <Input
                    id="institutionName"
                    name="institutionName"
                    placeholder="Ex: Escola Municipal de Ensino Fundamental"
                    value={formData.institutionName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Admin Info */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Administrador
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminName">Nome do Admin *</Label>
                      <Input
                        id="adminName"
                        name="adminName"
                        placeholder="Ex: João Silva"
                        value={formData.adminName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email do Admin *</Label>
                      <Input
                        id="adminEmail"
                        name="adminEmail"
                        type="email"
                        placeholder="admin@escola.com"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Principal Info */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Diretor(a)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="principalName">Nome do Diretor(a) *</Label>
                      <Input
                        id="principalName"
                        name="principalName"
                        placeholder="Ex: Maria Santos"
                        value={formData.principalName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="principalEmail">Email do Diretor(a) *</Label>
                      <Input
                        id="principalEmail"
                        name="principalEmail"
                        type="email"
                        placeholder="diretor@escola.com"
                        value={formData.principalEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    As senhas serão geradas automaticamente e enviadas por email.
                  </AlertDescription>
                </Alert>

                {/* Advanced Settings Toggle */}
                <div className="border-t pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
                  >
                    <span className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>▶</span>
                    Configurações Avançadas
                  </button>

                  {showAdvanced && (
                    <div className="space-y-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {/* Database Settings */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <Database className="w-4 h-4" />
                          Banco de Dados (PostgreSQL)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="dbHost" className="text-xs">Host</Label>
                            <Input
                              id="dbHost"
                              name="dbHost"
                              placeholder="localhost"
                              value={advancedSettings.dbHost}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="dbPort" className="text-xs">Porta</Label>
                            <Input
                              id="dbPort"
                              name="dbPort"
                              placeholder="5432"
                              value={advancedSettings.dbPort}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="dbUser" className="text-xs">Usuário</Label>
                            <Input
                              id="dbUser"
                              name="dbUser"
                              placeholder="postgres"
                              value={advancedSettings.dbUser}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="dbPassword" className="text-xs">Senha</Label>
                            <Input
                              id="dbPassword"
                              name="dbPassword"
                              type="password"
                              placeholder="Sua senha"
                              value={advancedSettings.dbPassword}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <Label htmlFor="dbName" className="text-xs">Nome do Banco</Label>
                            <Input
                              id="dbName"
                              name="dbName"
                              placeholder="schola"
                              value={advancedSettings.dbName}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stack Auth Settings */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-3">Stack Auth (Neon Auth)</h4>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="stackProjectId" className="text-xs">Project ID</Label>
                            <Input
                              id="stackProjectId"
                              name="stackProjectId"
                              placeholder="seu_project_id"
                              value={advancedSettings.stackProjectId}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="stackPublishableKey" className="text-xs">Publishable Key</Label>
                            <Input
                              id="stackPublishableKey"
                              name="stackPublishableKey"
                              placeholder="sua_chave_publica"
                              value={advancedSettings.stackPublishableKey}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="stackSecretKey" className="text-xs">Secret Key</Label>
                            <Input
                              id="stackSecretKey"
                              name="stackSecretKey"
                              type="password"
                              placeholder="sua_chave_secreta"
                              value={advancedSettings.stackSecretKey}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Security Settings */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-3">Segurança</h4>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="jwtSecret" className="text-xs">JWT Secret</Label>
                              <button
                                type="button"
                                onClick={generateJwtSecret}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Gerar
                              </button>
                            </div>
                            <Input
                              id="jwtSecret"
                              name="jwtSecret"
                              placeholder="Deixe em branco para gerar automaticamente"
                              value={advancedSettings.jwtSecret}
                              onChange={handleAdvancedChange}
                              className="text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* URLs */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-3">URLs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="appUrl" className="text-xs">App URL</Label>
                            <Input
                              id="appUrl"
                              name="appUrl"
                              placeholder="http://localhost:3000"
                              value={advancedSettings.appUrl}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="apiUrl" className="text-xs">API URL</Label>
                            <Input
                              id="apiUrl"
                              name="apiUrl"
                              placeholder="http://localhost:3000/api"
                              value={advancedSettings.apiUrl}
                              onChange={handleAdvancedChange}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Localization */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-sm mb-3">Localização</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="timezone" className="text-xs">Fuso Horário</Label>
                            <select
                              id="timezone"
                              name="timezone"
                              value={advancedSettings.timezone}
                              onChange={handleAdvancedChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                              <option value="America/Brasilia">Brasília (GMT-3)</option>
                              <option value="America/Manaus">Manaus (GMT-4)</option>
                              <option value="America/Anchorage">UTC-8</option>
                              <option value="UTC">UTC</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="language" className="text-xs">Idioma</Label>
                            <select
                              id="language"
                              name="language"
                              value={advancedSettings.language}
                              onChange={handleAdvancedChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="pt-BR">Português (Brasil)</option>
                              <option value="pt-PT">Português (Portugal)</option>
                              <option value="en-US">English (US)</option>
                              <option value="es-ES">Español</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Essas configurações só podem ser alteradas durante a instalação inicial. Guarde essas informações com segurança.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSetupMode(null)}
                    disabled={isLoading}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? "Configurando..." : "Criar Instituição"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Desenvolvido com 💙 para transformar a gestão escolar</p>
        </div>
      </div>
    </div>
  );
}
