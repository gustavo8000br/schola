import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, students, grades, attendance, studentProfiles, announcements, twoFactorLogs, Student, Grade, Attendance, StudentProfile, Announcement, TwoFactorLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// Student queries
export async function getStudentByUserId(userId: number): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(students).where(eq(students.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getStudentById(studentId: number): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Grade queries
export async function getGradesByStudentId(studentId: number): Promise<Grade[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(grades).where(eq(grades.studentId, studentId)).orderBy(desc(grades.year), desc(grades.semester));
}

export async function getGradesByStudentAndYear(studentId: number, year: number): Promise<Grade[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(grades).where(and(eq(grades.studentId, studentId), eq(grades.year, year)));
}

// Attendance queries
export async function getAttendanceByStudentId(studentId: number, limit: number = 30): Promise<Attendance[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(attendance).where(eq(attendance.studentId, studentId)).orderBy(desc(attendance.date)).limit(limit);
}

export async function getAbsenceCountByStudent(studentId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select().from(attendance).where(and(eq(attendance.studentId, studentId), eq(attendance.present, false)));
  return result.length > 0 ? result.length : 0;
}

// StudentProfile queries
export async function getStudentProfileByStudentId(studentId: number): Promise<StudentProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(studentProfiles).where(eq(studentProfiles.studentId, studentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Announcements queries
export async function getPublishedAnnouncements(limit: number = 10): Promise<Announcement[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(announcements).where(eq(announcements.isPublished, true)).orderBy(desc(announcements.publishedAt)).limit(limit);
}


// Two Factor Authentication queries
export async function logTwoFactorAttempt(
  userId: number,
  success: boolean,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(twoFactorLogs).values({
    userId,
    success,
    ipAddress,
    userAgent,
  });
}

export async function getTwoFactorLogs(userId: number, limit: number = 10): Promise<TwoFactorLog[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(twoFactorLogs).where(eq(twoFactorLogs.userId, userId)).orderBy(desc(twoFactorLogs.createdAt)).limit(limit);
}

export async function updateUserTwoFactor(
  userId: number,
  twoFactorSecret: string,
  twoFactorBackupCodes: string[],
  enabled: boolean = true
): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({
    twoFactorSecret,
    twoFactorBackupCodes: JSON.stringify(twoFactorBackupCodes),
    twoFactorEnabled: enabled,
  }).where(eq(users.id, userId));
}

export async function disableTwoFactor(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({
    twoFactorSecret: null,
    twoFactorBackupCodes: null,
    twoFactorEnabled: false,
  }).where(eq(users.id, userId));
}
