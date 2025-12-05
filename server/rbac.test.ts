import { describe, expect, it } from "vitest";
import { hasRole, hasAnyRole, validateAccess, validateAccessAny, hasPermission, ROLE_HIERARCHY, ROLE_PERMISSIONS } from "./_core/rbac";
import { TRPCError } from "@trpc/server";

describe("RBAC - Role-Based Access Control", () => {
  describe("Role Hierarchy", () => {
    it("should have correct hierarchy values", () => {
      expect(ROLE_HIERARCHY.student).toBe(1);
      expect(ROLE_HIERARCHY.teacher).toBe(2);
      expect(ROLE_HIERARCHY.coordinator).toBe(3);
      expect(ROLE_HIERARCHY.principal).toBe(4);
      expect(ROLE_HIERARCHY.admin).toBe(5);
    });

    it("student should not have teacher privileges", () => {
      expect(hasRole("student", "teacher")).toBe(false);
    });

    it("teacher should have student privileges", () => {
      expect(hasRole("teacher", "student")).toBe(true);
    });

    it("admin should have all privileges", () => {
      expect(hasRole("admin", "student")).toBe(true);
      expect(hasRole("admin", "teacher")).toBe(true);
      expect(hasRole("admin", "coordinator")).toBe(true);
      expect(hasRole("admin", "principal")).toBe(true);
      expect(hasRole("admin", "admin")).toBe(true);
    });
  });

  describe("hasAnyRole", () => {
    it("should return true if user has one of the required roles", () => {
      expect(hasAnyRole("teacher", ["student", "teacher"])).toBe(true);
      expect(hasAnyRole("coordinator", ["teacher", "coordinator", "principal"])).toBe(true);
    });

    it("should return false if user doesn't have any of the required roles", () => {
      expect(hasAnyRole("student", ["teacher", "coordinator"])).toBe(false);
    });

    it("should work with higher hierarchy roles", () => {
      expect(hasAnyRole("admin", ["student", "teacher"])).toBe(true);
    });
  });

  describe("validateAccess", () => {
    it("should throw UNAUTHORIZED if user is undefined", () => {
      expect(() => validateAccess(undefined, "student")).toThrow(TRPCError);
    });

    it("should throw FORBIDDEN if user doesn't have required role", () => {
      expect(() => validateAccess("student", "teacher")).toThrow(TRPCError);
    });

    it("should not throw if user has required role", () => {
      expect(() => validateAccess("teacher", "student")).not.toThrow();
      expect(() => validateAccess("admin", "teacher")).not.toThrow();
    });

    it("should include context in error message if provided", () => {
      try {
        validateAccess("student", "teacher", "editing grades");
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.message).toContain("editing grades");
        }
      }
    });
  });

  describe("validateAccessAny", () => {
    it("should throw UNAUTHORIZED if user is undefined", () => {
      expect(() => validateAccessAny(undefined, ["student"])).toThrow(TRPCError);
    });

    it("should throw FORBIDDEN if user doesn't have any of the required roles", () => {
      expect(() => validateAccessAny("student", ["teacher", "coordinator"])).toThrow(TRPCError);
    });

    it("should not throw if user has one of the required roles", () => {
      expect(() => validateAccessAny("teacher", ["student", "teacher"])).not.toThrow();
      expect(() => validateAccessAny("coordinator", ["teacher", "principal"])).not.toThrow();
    });
  });

  describe("Permissions", () => {
    it("should have permissions defined for all roles", () => {
      expect(ROLE_PERMISSIONS.student).toBeDefined();
      expect(ROLE_PERMISSIONS.teacher).toBeDefined();
      expect(ROLE_PERMISSIONS.coordinator).toBeDefined();
      expect(ROLE_PERMISSIONS.principal).toBeDefined();
      expect(ROLE_PERMISSIONS.admin).toBeDefined();
    });

    it("student should have basic permissions", () => {
      expect(hasPermission("student", "view_own_grades")).toBe(true);
      expect(hasPermission("student", "view_own_attendance")).toBe(true);
      expect(hasPermission("student", "view_announcements")).toBe(true);
    });

    it("student should not have edit permissions", () => {
      expect(hasPermission("student", "edit_student_grades")).toBe(false);
      expect(hasPermission("student", "manage_classes")).toBe(false);
    });

    it("teacher should have edit permissions", () => {
      expect(hasPermission("teacher", "edit_student_grades")).toBe(true);
      expect(hasPermission("teacher", "edit_student_attendance")).toBe(true);
    });

    it("admin should have all permissions", () => {
      expect(hasPermission("admin", "manage_system")).toBe(true);
      expect(hasPermission("admin", "manage_2fa")).toBe(true);
      expect(hasPermission("admin", "view_audit_logs")).toBe(true);
      expect(hasPermission("admin", "manage_roles")).toBe(true);
    });

    it("permissions should be inherited from lower roles", () => {
      const studentPerms = ROLE_PERMISSIONS.student;
      const teacherPerms = ROLE_PERMISSIONS.teacher;
      
      // Teacher should have all student permissions
      studentPerms.forEach(perm => {
        expect(teacherPerms).toContain(perm);
      });
    });
  });
});
