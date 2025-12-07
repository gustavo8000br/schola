# Stack Auth (Neon Auth) - Guia de Configuração

Este documento descreve como configurar e usar Stack Auth (Neon Auth) no projeto Schola.

## O que é Stack Auth?

Stack Auth é um serviço de autenticação moderno e seguro para aplicações Next.js. Ele fornece:

- ✅ Autenticação OAuth integrada
- ✅ Gerenciamento de sessões seguro
- ✅ Suporte a múltiplos provedores (Google, GitHub, etc.)
- ✅ 2FA (Autenticação de Dois Fatores)
- ✅ Recuperação de conta
- ✅ Gerenciamento de usuários

## Configuração Inicial

### 1. Criar Projeto no Stack Auth

1. Acesse [app.stack-auth.com](https://app.stack-auth.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Copie as credenciais:
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=seu_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=sua_chave_publica
STACK_SECRET_SERVER_KEY=sua_chave_secreta

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host/database?sslmode=require

# JWT
JWT_SECRET=sua_chave_jwt_secreta

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 3. Instalar Dependências

```bash
pnpm install @stackauth/nextjs
```

### 4. Configurar Middleware

O middleware de Stack Auth deve ser configurado em `server/_core/middleware.ts`:

```typescript
import { stackMiddleware } from "@stackauth/nextjs";

export const middleware = stackMiddleware();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## Integração com tRPC

O usuário autenticado está disponível no contexto tRPC:

```typescript
// server/routers.ts
export const appRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user; // Usuário do Stack Auth
  }),
});
```

## Fluxo de Autenticação

1. **Usuário acessa a aplicação**
   - Middleware do Stack Auth verifica sessão
   - Se não autenticado, redireciona para login

2. **Usuário faz login**
   - Stack Auth autentica via OAuth
   - Sessão é criada e armazenada

3. **Aplicação acessa dados do usuário**
   - Via `ctx.user` no tRPC
   - Via `useAuth()` hook no React

## Segurança

### Boas Práticas

- ✅ Nunca exponha `STACK_SECRET_SERVER_KEY` no frontend
- ✅ Use HTTPS em produção
- ✅ Ative 2FA para contas administrativas
- ✅ Revise regularmente logs de acesso
- ✅ Mantenha dependências atualizadas

### Proteção de Dados

- Stack Auth usa criptografia TLS/SSL
- Senhas não são armazenadas em texto plano
- Sessões são armazenadas de forma segura
- Tokens expiram automaticamente

## Troubleshooting

### Erro: "Cannot find module '@stackauth/nextjs'"

```bash
pnpm install @stackauth/nextjs
pnpm restart
```

### Erro: "Invalid credentials"

- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto existe no Stack Auth
- Regenere as chaves se necessário

### Usuário não está sendo autenticado

- Verifique se o middleware está configurado
- Confirme que a rota está protegida
- Verifique os logs do servidor

## Referências

- [Stack Auth Docs](https://docs.stack-auth.com)
- [Next.js Auth Integration](https://docs.stack-auth.com/integrations/nextjs)
- [Security Best Practices](https://docs.stack-auth.com/security)

## Próximos Passos

1. Configurar provedores OAuth (Google, GitHub, etc.)
2. Implementar 2FA para admins
3. Configurar recuperação de conta
4. Implementar logs de auditoria
