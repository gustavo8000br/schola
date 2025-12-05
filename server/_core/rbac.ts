import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./context";

/**
 * Hierarquia de papéis (do menor para o maior privilégio):
 * student < teacher < coordinator < principal < admin
 */
export type Role = "student" | "teacher" | "coordinator" | "principal" | "admin";

export const ROLE_HIERARCHY: Record<Role, number> = {
  student: 1,
  teacher: 2,
  coordinator: 3,
  principal: 4,
  admin: 5,
};

/**
 * Verifica se um usuário tem um papel específico
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Verifica se um usuário tem um dos papéis especificados
 */
export function hasAnyRole(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.some(role => hasRole(userRole, role));
}

/**
 * Validação de acesso para procedures
 */
export function validateAccess(
  userRole: Role | undefined,
  requiredRole: Role,
  context?: string
): void {
  if (!userRole) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado para acessar este recurso",
    });
  }

  if (!hasRole(userRole, requiredRole)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Acesso negado. Este recurso requer privilégio de ${requiredRole}${context ? ` (${context})` : ""}`,
    });
  }
}

/**
 * Validação de acesso para múltiplos papéis
 */
export function validateAccessAny(
  userRole: Role | undefined,
  requiredRoles: Role[],
  context?: string
): void {
  if (!userRole) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado para acessar este recurso",
    });
  }

  if (!hasAnyRole(userRole, requiredRoles)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Acesso negado. Este recurso requer um dos seguintes papéis: ${requiredRoles.join(", ")}${context ? ` (${context})` : ""}`,
    });
  }
}

/**
 * Descrições dos papéis para UI
 */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  student: "Aluno - Pode visualizar suas notas, frequência e currículo",
  teacher: "Professor - Pode lançar notas, registrar frequência e adicionar observações",
  coordinator: "Coordenador - Pode gerenciar turmas, visualizar relatórios e coordenar atividades",
  principal: "Diretor - Acesso total ao módulo do aluno e gestão administrativa",
  admin: "Administrador - Acesso total com autenticação de dois fatores (2FA)",
};

/**
 * Permissões base por papel
 */
const BASE_PERMISSIONS: Record<Role, string[]> = {
  student: [
    "view_own_grades",
    "view_own_attendance",
    "view_own_profile",
    "view_announcements",
  ],
  teacher: [
    "view_own_grades",
    "view_own_attendance",
    "view_own_profile",
    "view_announcements",
    "edit_student_grades",
    "edit_student_attendance",
    "add_student_observations",
    "view_class_list",
  ],
  coordinator: [
    "view_own_grades",
    "view_own_attendance",
    "view_own_profile",
    "view_announcements",
    "edit_student_grades",
    "edit_student_attendance",
    "add_student_observations",
    "view_class_list",
    "manage_classes",
    "view_reports",
    "manage_schedules",
    "manage_teachers",
    "view_all_students",
  ],
  principal: [
    "view_own_grades",
    "view_own_attendance",
    "view_own_profile",
    "view_announcements",
    "edit_student_grades",
    "edit_student_attendance",
    "add_student_observations",
    "view_class_list",
    "manage_classes",
    "view_reports",
    "manage_schedules",
    "manage_teachers",
    "view_all_students",
    "manage_all_data",
    "manage_users",
    "view_financial_data",
    "create_announcements",
    "manage_school_settings",
  ],
  admin: [
    "view_own_grades",
    "view_own_attendance",
    "view_own_profile",
    "view_announcements",
    "edit_student_grades",
    "edit_student_attendance",
    "add_student_observations",
    "view_class_list",
    "manage_classes",
    "view_reports",
    "manage_schedules",
    "manage_teachers",
    "view_all_students",
    "manage_all_data",
    "manage_users",
    "view_financial_data",
    "create_announcements",
    "manage_school_settings",
    "manage_system",
    "manage_2fa",
    "view_audit_logs",
    "manage_roles",
  ],
};

/**
 * Permissões específicas por papel (com herança)
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = BASE_PERMISSIONS;

/**
 * Verifica se um usuário tem uma permissão específica
 */
export function hasPermission(userRole: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}
