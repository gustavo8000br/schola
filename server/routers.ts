import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure, teacherProcedure, coordinatorProcedure, principalProcedure } from "./_core/trpc";
import { z } from "zod";
import { getStudentByUserId, getGradesByStudentId, getAttendanceByStudentId, getStudentProfileByStudentId, getPublishedAnnouncements, getAbsenceCountByStudent, updateUserTwoFactor, disableTwoFactor, getTwoFactorLogs, logTwoFactorAttempt } from "./db";
import { generateTOTPSecret, generateBackupCodes, formatTOTPURI, verifyTOTPCode, verifyBackupCode, removeBackupCode } from "./_core/twoFactor";
import { validateAccess, type Role } from "./_core/rbac";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  student: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      const student = await getStudentByUserId(ctx.user.id);
      if (!student) return null;
      
      const profile = await getStudentProfileByStudentId(student.id);
      return { student, profile };
    }),
    
    grades: protectedProcedure.query(async ({ ctx }) => {
      const student = await getStudentByUserId(ctx.user.id);
      if (!student) return [];
      
      return await getGradesByStudentId(student.id);
    }),
    
    attendance: protectedProcedure.query(async ({ ctx }) => {
      const student = await getStudentByUserId(ctx.user.id);
      if (!student) return [];
      
      return await getAttendanceByStudentId(student.id);
    }),
    
    absenceCount: protectedProcedure.query(async ({ ctx }) => {
      const student = await getStudentByUserId(ctx.user.id);
      if (!student) return 0;
      
      return await getAbsenceCountByStudent(student.id);
    }),
  }),
  
  announcements: router({
    list: publicProcedure.query(async () => {
      return await getPublishedAnnouncements();
    }),
  }),

  // Two Factor Authentication (2FA) - Apenas para Admin
  twoFactor: router({
    setup: adminProcedure.mutation(async ({ ctx }) => {
      const secret = generateTOTPSecret();
      const backupCodes = generateBackupCodes();
      const uri = formatTOTPURI(secret, ctx.user.email || ctx.user.name || "user");

      return {
        secret,
        backupCodes,
        uri,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}`,
      };
    }),

    confirm: adminProcedure.input(z.object({
      secret: z.string(),
      code: z.string().length(6),
      backupCodes: z.array(z.string()),
    })).mutation(async ({ ctx, input }) => {
      // Verificar código TOTP
      if (!verifyTOTPCode(input.secret, input.code)) {
        throw new Error("Código TOTP inválido");
      }

      // Armazenar secret e backup codes
      await updateUserTwoFactor(ctx.user.id, input.secret, input.backupCodes, true);

      return {
        success: true,
        message: "Autenticação de dois fatores ativada com sucesso",
      };
    }),

    disable: adminProcedure.input(z.object({
      code: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.twoFactorSecret) {
        throw new Error("2FA não está ativado");
      }

      // Verificar código TOTP ou backup code
      const isValidTOTP = verifyTOTPCode(user.twoFactorSecret, input.code);
      const backupCodes = user.twoFactorBackupCodes ? JSON.parse(user.twoFactorBackupCodes) : [];
      const isValidBackup = verifyBackupCode(input.code, backupCodes);

      if (!isValidTOTP && !isValidBackup) {
        await logTwoFactorAttempt(user.id, false);
        throw new Error("Código inválido");
      }

      // Se foi usado um backup code, remover da lista
      if (isValidBackup) {
        const updatedCodes = removeBackupCode(input.code, backupCodes);
        await updateUserTwoFactor(user.id, user.twoFactorSecret, updatedCodes, true);
      }

      await logTwoFactorAttempt(user.id, true);

      return {
        success: true,
        message: "Autenticação de dois fatores desativada",
      };
    }),

    logs: adminProcedure.query(async ({ ctx }) => {
      return await getTwoFactorLogs(ctx.user.id);
    }),
  }),

  // Role-based access control - Exemplo de procedures por papel
  rbac: router({
    getUserRole: protectedProcedure.query(({ ctx }) => {
      return {
        role: ctx.user.role,
        name: ctx.user.name,
        email: ctx.user.email,
      };
    }),

    // Apenas professores e acima podem acessar
    teacherFeature: teacherProcedure.query(async ({ ctx }) => {
      return {
        message: "Você tem acesso a recursos de professor",
        role: ctx.user.role,
      };
    }),

    // Apenas coordenadores e acima podem acessar
    coordinatorFeature: coordinatorProcedure.query(async ({ ctx }) => {
      return {
        message: "Você tem acesso a recursos de coordenador",
        role: ctx.user.role,
      };
    }),

    // Apenas diretores e acima podem acessar
    principalFeature: principalProcedure.query(async ({ ctx }) => {
      return {
        message: "Você tem acesso a recursos de diretor",
        role: ctx.user.role,
      };
    }),

    // Apenas admin pode acessar
    adminFeature: adminProcedure.query(async ({ ctx }) => {
      return {
        message: "Você tem acesso a recursos de administrador",
        role: ctx.user.role,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
