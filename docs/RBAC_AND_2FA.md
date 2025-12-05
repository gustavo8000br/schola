# Sistema de Controle de Acesso (RBAC) e Autenticação de Dois Fatores (2FA)

## Visão Geral

O Schola implementa um sistema robusto de **Controle de Acesso Baseado em Papéis (RBAC)** com uma hierarquia clara de permissões e **Autenticação de Dois Fatores (2FA)** para usuários administradores.

## Hierarquia de Papéis

Os papéis no Schola seguem uma hierarquia linear, onde cada papel superior herda todas as permissões dos papéis inferiores:

```
Aluno (1) < Professor (2) < Coordenador (3) < Diretor (4) < Admin (5)
```

### Descrição dos Papéis

| Papel | Nível | Descrição | Permissões Principais |
| :--- | :--- | :--- | :--- |
| **Aluno** | 1 | Visualiza seus próprios dados acadêmicos | Visualizar notas, frequência, currículo e avisos |
| **Professor** | 2 | Gerencia dados dos alunos em suas turmas | Editar notas, frequência, adicionar observações |
| **Coordenador** | 3 | Gerencia múltiplas turmas e relatórios | Gerenciar turmas, visualizar relatórios, gerenciar horários |
| **Diretor** | 4 | Acesso total ao módulo do aluno e gestão | Gerenciar todos os dados, usuários, dados financeiros |
| **Admin** | 5 | Acesso total com 2FA obrigatório | Gerenciar sistema, 2FA, logs de auditoria, papéis |

## Implementação no Código

### Verificação de Papéis

```typescript
import { hasRole, validateAccess } from "@/server/_core/rbac";

// Verificar se um usuário tem um papel específico
if (hasRole(user.role, "teacher")) {
  // Usuário é professor ou superior
}

// Validar acesso (lança erro se não autorizado)
validateAccess(user.role, "coordinator", "gerenciar turmas");
```

### Procedures tRPC com RBAC

Cada papel tem um procedure específico que valida automaticamente o acesso:

```typescript
import { teacherProcedure, coordinatorProcedure, adminProcedure } from "@/server/_core/trpc";

// Apenas professores e superiores podem acessar
export const editGrades = teacherProcedure.mutation(async ({ ctx, input }) => {
  // Implementação segura
});

// Apenas coordenadores e superiores podem acessar
export const manageClasses = coordinatorProcedure.mutation(async ({ ctx, input }) => {
  // Implementação segura
});

// Apenas admins podem acessar
export const manageSystem = adminProcedure.mutation(async ({ ctx, input }) => {
  // Implementação segura
});
```

### Permissões Granulares

Além da hierarquia de papéis, o sistema também suporta permissões granulares:

```typescript
import { hasPermission } from "@/server/_core/rbac";

if (hasPermission(user.role, "edit_student_grades")) {
  // Usuário pode editar notas
}
```

## Autenticação de Dois Fatores (2FA)

### Visão Geral

A autenticação de dois fatores é **obrigatória para usuários administradores** e oferece proteção adicional contra acessos não autorizados.

O sistema implementa:

- **TOTP (Time-based One-Time Password):** Códigos de 6 dígitos gerados a cada 30 segundos
- **Backup Codes:** 8 códigos de recuperação de 8 dígitos cada
- **Logs de Auditoria:** Registro de todas as tentativas de autenticação 2FA

### Setup de 2FA

Um administrador pode ativar 2FA através do seguinte fluxo:

```typescript
// 1. Gerar secret e backup codes
const { secret, backupCodes, uri, qrCodeUrl } = await trpc.twoFactor.setup.mutate();

// 2. Exibir QR code ao usuário (usando qrCodeUrl)
// 3. Usuário escaneia com seu autenticador (Google Authenticator, Authy, etc.)

// 4. Confirmar com código TOTP
await trpc.twoFactor.confirm.mutate({
  secret,
  code: "123456", // Código de 6 dígitos do autenticador
  backupCodes,
});
```

### Verificação de 2FA no Login

Quando um usuário admin tenta fazer login, o sistema valida o 2FA:

```typescript
// Após autenticação OAuth bem-sucedida
if (user.role === "admin" && user.twoFactorEnabled) {
  // Solicitar código TOTP ou backup code
  const isValid = verifyTOTPCode(user.twoFactorSecret, userProvidedCode);
  
  if (!isValid) {
    // Registrar tentativa falhada
    await logTwoFactorAttempt(user.id, false, ipAddress, userAgent);
    throw new Error("Código 2FA inválido");
  }
  
  // Registrar tentativa bem-sucedida
  await logTwoFactorAttempt(user.id, true, ipAddress, userAgent);
}
```

### Backup Codes

Se o usuário perder acesso ao seu autenticador, ele pode usar um dos 8 códigos de backup:

```typescript
// Verificar se o código é um backup code
if (verifyBackupCode(userProvidedCode, user.twoFactorBackupCodes)) {
  // Remover o código da lista (pode ser usado apenas uma vez)
  const updatedCodes = removeBackupCode(userProvidedCode, user.twoFactorBackupCodes);
  await updateUserTwoFactor(user.id, user.twoFactorSecret, updatedCodes, true);
}
```

## Banco de Dados

### Schema de Usuários

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role ENUM('student', 'teacher', 'coordinator', 'principal', 'admin') DEFAULT 'student',
  twoFactorEnabled BOOLEAN DEFAULT FALSE,
  twoFactorSecret VARCHAR(255),
  twoFactorBackupCodes TEXT, -- JSON array de strings
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela de Logs de 2FA

```sql
CREATE TABLE twoFactorLogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  success BOOLEAN NOT NULL,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## Melhores Práticas

### Para Desenvolvedores

1. **Sempre valide o papel do usuário** antes de executar operações sensíveis
2. **Use os procedures específicos por papel** (`teacherProcedure`, `adminProcedure`, etc.)
3. **Registre operações sensíveis** nos logs de auditoria
4. **Nunca armazene secrets em texto plano** - use hash ou criptografia
5. **Implemente rate limiting** para tentativas de 2FA

### Para Administradores

1. **Ative 2FA imediatamente** após criar a conta admin
2. **Guarde os backup codes em local seguro** (cofre, gestor de senhas, etc.)
3. **Revise regularmente os logs de 2FA** para detectar atividades suspeitas
4. **Altere a senha regularmente** e regenere o secret de 2FA periodicamente
5. **Não compartilhe credenciais** de admin com outros usuários

## Fluxo de Autorização Típico

```
1. Usuário faz login via OAuth
2. Sistema verifica o papel do usuário
3. Se admin e 2FA ativado:
   a. Solicitar código TOTP ou backup code
   b. Validar código
   c. Registrar tentativa (sucesso/falha)
4. Se validado, criar sessão
5. Todas as requisições subsequentes verificam o papel
6. Procedures tRPC validam automaticamente o acesso
```

## Exemplos de Uso

### Exemplo 1: Aluno visualizando suas notas

```typescript
// Frontend
const { data: grades } = trpc.student.grades.useQuery();

// Backend (server/routers.ts)
student: router({
  grades: protectedProcedure.query(async ({ ctx }) => {
    // Qualquer usuário autenticado pode acessar
    const student = await getStudentByUserId(ctx.user.id);
    return await getGradesByStudentId(student.id);
  }),
})
```

### Exemplo 2: Professor editando notas

```typescript
// Backend
editGrades: teacherProcedure.input(z.object({
  studentId: z.number(),
  gradeId: z.number(),
  newGrade: z.number(),
})).mutation(async ({ ctx, input }) => {
  // Apenas professores e superiores chegam aqui
  // Validar que o professor ensina essa turma
  // Atualizar nota
});
```

### Exemplo 3: Admin gerenciando usuários

```typescript
// Backend
manageUsers: adminProcedure.input(z.object({
  userId: z.number(),
  newRole: z.enum(['student', 'teacher', 'coordinator', 'principal', 'admin']),
})).mutation(async ({ ctx, input }) => {
  // Apenas admins chegam aqui
  // Atualizar papel do usuário
  // Registrar mudança nos logs
});
```

## Testes

O sistema RBAC possui testes unitários abrangentes em `server/rbac.test.ts`:

```bash
pnpm test rbac.test.ts
```

Os testes cobrem:

- Hierarquia de papéis
- Validação de acesso
- Permissões granulares
- Herança de permissões

## Próximos Passos

1. Implementar middleware de 2FA no login OAuth
2. Criar UI para setup e gerenciamento de 2FA
3. Implementar rate limiting para tentativas de 2FA
4. Adicionar suporte a WebAuthn/FIDO2 como alternativa ao TOTP
5. Criar dashboard de auditoria para admins
