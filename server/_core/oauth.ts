/**
 * Autenticação com Stack Auth (Neon Auth)
 * 
 * Stack Auth é integrado diretamente no Next.js via middleware
 * Este arquivo é mantido como referência para futuras extensões
 * 
 * Configuração necessária em .env.local:
 * - NEXT_PUBLIC_STACK_PROJECT_ID
 * - NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
 * - STACK_SECRET_SERVER_KEY
 */

export function setupStackAuth() {
  // Stack Auth é configurado via middleware no Next.js
  // Veja: server/_core/middleware.ts
  
  console.log('✅ Stack Auth configurado');
  
  return {
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  };
}

/**
 * Tipos para usuários autenticados via Stack Auth
 */
export interface StackAuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'admin' | 'principal' | 'coordinator' | 'teacher' | 'student';
  createdAt: Date;
  lastSignedIn: Date;
}

/**
 * Função auxiliar para extrair informações do usuário do contexto
 */
export function getAuthUserFromContext(context: any): StackAuthUser | null {
  // Stack Auth fornece o usuário via ctx.user no tRPC
  return context?.user || null;
}
