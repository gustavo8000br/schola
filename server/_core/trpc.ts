import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

import { validateAccess, type Role } from "./rbac";

/**
 * Cria um procedure protegido que requer um papel específico
 */
export function createRoleProcedure(requiredRole: Role) {
  return t.procedure.use(
    t.middleware(async opts => {
      const { ctx, next } = opts;
      validateAccess(ctx.user?.role as Role | undefined, requiredRole);

      return next({
        ctx: {
          ...ctx,
          user: ctx.user!,
        },
      });
    }),
  );
}

// Procedures específicos por papel
export const studentProcedure = createRoleProcedure("student");
export const teacherProcedure = createRoleProcedure("teacher");
export const coordinatorProcedure = createRoleProcedure("coordinator");
export const principalProcedure = createRoleProcedure("principal");
