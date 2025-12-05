import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["student", "teacher", "coordinator", "principal", "admin"]).default("student").notNull(),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false).notNull(),
  twoFactorSecret: varchar("twoFactorSecret", { length: 255 }),
  twoFactorBackupCodes: text("twoFactorBackupCodes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Students table - Representa os alunos da plataforma
 * Cada aluno está vinculado a um usuário através do campo userId
 */
export const students = mysqlTable("students", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  registrationNumber: varchar("registrationNumber", { length: 50 }).notNull().unique(),
  dateOfBirth: timestamp("dateOfBirth"),
  enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
  status: mysqlEnum("status", ["active", "inactive", "graduated"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Grades table - Notas dos alunos
 * Armazena as notas por disciplina e período
 */
export const grades = mysqlTable("grades", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  grade: decimal("grade", { precision: 5, scale: 2 }).notNull(),
  period: varchar("period", { length: 50 }).notNull(),
  semester: int("semester").notNull(),
  year: int("year").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = typeof grades.$inferInsert;

/**
 * Attendance table - Frequência/Faltas dos alunos
 * Registra a presença ou ausência do aluno em cada dia
 */
export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull(),
  date: timestamp("date").notNull(),
  present: boolean("present").default(false).notNull(),
  justifiedAbsence: boolean("justifiedAbsence").default(false),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = typeof attendance.$inferInsert;

/**
 * StudentProfile table - Currículo do Aluno
 * Consolidação de informações, conquistas e atividades extracurriculares
 */
export const studentProfiles = mysqlTable("studentProfiles", {
  id: int("id").autoincrement().primaryKey(),
  studentId: int("studentId").notNull().unique(),
  bio: text("bio"),
  achievements: text("achievements"),
  extracurricularActivities: text("extracurricularActivities"),
  teacherNotes: text("teacherNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = typeof studentProfiles.$inferInsert;

/**
 * Announcements table - Mural de Avisos
 * Notificações e avisos importantes da escola
 */
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdBy: int("createdBy").notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  students: many(students),
  announcements: many(announcements),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  grades: many(grades),
  attendance: many(attendance),
  profile: one(studentProfiles),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
}));

export const studentProfilesRelations = relations(studentProfiles, ({ one }) => ({
  student: one(students, {
    fields: [studentProfiles.studentId],
    references: [students.id],
  }),
}));

export const announcementsRelations = relations(announcements, ({ one }) => ({
  creator: one(users, {
    fields: [announcements.createdBy],
    references: [users.id],
  }),
}));

/**
 * TwoFactorLogs table - Registro de tentativas de autenticação 2FA
 * Útil para auditoria e detecção de atividades suspeitas
 */
export const twoFactorLogs = mysqlTable("twoFactorLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  success: boolean("success").notNull(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TwoFactorLog = typeof twoFactorLogs.$inferSelect;
export type InsertTwoFactorLog = typeof twoFactorLogs.$inferInsert;

export const twoFactorLogsRelations = relations(twoFactorLogs, ({ one }) => ({
  user: one(users, {
    fields: [twoFactorLogs.userId],
    references: [users.id],
  }),
}));
