// =====================================================================
// SCI-COM ACADEMY — Persistent PostgreSQL Database Layer
// Supports dual mode: Supabase Cloud & In-Browser PGlite (Real PostgreSQL)
// =====================================================================

import { PGlite } from '@electric-sql/pglite';
import { supabase, isSupabaseConfigured } from './supabase';
import type {
  User,
  Course,
  CourseCategory,
  Enrollment,
  LessonProgress,
  StudentProject,
  LabProgress,
  PortfolioProfile,
  UserAchievement,
  ProgrammingChallenge,
} from '../types';

// Import versioned SQL migrations and authentic curriculum seed
import initialSchemaSql from '../../supabase/migrations/20261013000001_initial_schema.sql?raw';
import foreignKeysSql from '../../supabase/migrations/20261013000002_foreign_keys_indexes.sql?raw';
import functionsSql from '../../supabase/migrations/20261013000003_functions_triggers.sql?raw';
import rlsPoliciesSql from '../../supabase/migrations/20261013000004_rls_policies.sql?raw';
import seedSql from '../../supabase/seed.sql?raw';

export interface DatabaseStatus {
  isReady: boolean;
  provider: 'Supabase PostgreSQL' | 'PGlite (Local PostgreSQL IndexedDB)';
  isSupabaseConnected: boolean;
  tablesCount: number;
  lastSyncAt: string | null;
  error?: string | null;
}

// Singleton database instance
let pgInstance: PGlite | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

let currentStatus: DatabaseStatus = {
  isReady: false,
  provider: isSupabaseConfigured ? 'Supabase PostgreSQL' : 'PGlite (Local PostgreSQL IndexedDB)',
  isSupabaseConnected: isSupabaseConfigured,
  tablesCount: 0,
  lastSyncAt: null,
  error: null,
};

/**
 * Initialize the persistent PostgreSQL database
 */
export async function initDatabase(): Promise<DatabaseStatus> {
  if (currentStatus.isReady && (pgInstance || isSupabaseConfigured)) {
    return currentStatus;
  }

  if (isInitializing && initPromise) {
    await initPromise;
    return currentStatus;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        // Verify remote Supabase connection
        const { error } = await supabase.from('courses').select('id').limit(1);
        if (!error) {
          currentStatus = {
            isReady: true,
            provider: 'Supabase PostgreSQL',
            isSupabaseConnected: true,
            tablesCount: 33,
            lastSyncAt: new Date().toISOString(),
            error: null,
          };
          console.log('✅ Connected to live Supabase PostgreSQL backend');
          return;
        } else {
          console.warn('⚠️ Supabase returned an error, falling back to local persistent PostgreSQL:', error.message);
        }
      }

      // Initialize persistent PGlite PostgreSQL using IndexedDB storage
      if (!pgInstance) {
        // 'idb://scicom-academy-postgres-v2' ensures persistence across browser restarts
        pgInstance = new PGlite('idb://scicom-academy-postgres-v2');
        await pgInstance.waitReady;
      }

      // Check if schema already migrated
      const checkTables = await pgInstance.query<{ count: number }>(`
        SELECT count(*)::int as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `);

      const count = checkTables.rows[0]?.count || 0;
      if (count < 10) {
        console.log('🚀 First-time database boot: Running PostgreSQL migrations...');
        // Execute migrations in order
        await pgInstance.exec(initialSchemaSql);
        await pgInstance.exec(foreignKeysSql);
        await pgInstance.exec(functionsSql);
        await pgInstance.exec(rlsPoliciesSql);

        console.log('🌱 Seeding curriculum data into PostgreSQL...');
        await pgInstance.exec(seedSql);
      }

      // Ensure custom_challenges table exists
      await pgInstance.exec(`
        CREATE TABLE IF NOT EXISTS public.custom_challenges (
          id text PRIMARY KEY,
          category text NOT NULL,
          category_label text NOT NULL,
          title text NOT NULL,
          grade text NOT NULL,
          difficulty text NOT NULL,
          description text NOT NULL,
          input_description text,
          output_description text,
          sample_input text,
          sample_output text,
          hint text,
          test_cases text,
          initial_js_code text,
          initial_cpp_code text,
          created_by text,
          created_at timestamptz DEFAULT now()
        );
      `);

      // Purge any legacy demo test accounts that may have been cached previously
      try {
        await pgInstance.query(`
          DELETE FROM public.profiles 
          WHERE email IN ('teacher.nattapon@scicom.ac.th', 'student.somchai@scicom.ac.th', 'student.kanya@scicom.ac.th')
             OR id IN ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444');
        `);

        // Ensure Admin account "น่าน" (username: admin) exists
        await pgInstance.query(`
          INSERT INTO public.profiles (id, email, display_name, role, level, xp, streak, bio) VALUES
          ('00000000-0000-0000-0000-000000000001', 'admin@scicom.ac.th', 'น่าน', 'admin', 'ม.6', 2500, 15, 'ผู้ดูแลระบบ (Admin) น่าน')
          ON CONFLICT (id) DO UPDATE SET
            display_name = 'น่าน',
            email = 'admin@scicom.ac.th',
            role = 'admin',
            level = 'ม.6';
        `);
      } catch {}

      // Re-count tables
      const finalCount = await pgInstance.query<{ count: number }>(`
        SELECT count(*)::int as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `);

      currentStatus = {
        isReady: true,
        provider: 'PGlite (Local PostgreSQL IndexedDB)',
        isSupabaseConnected: false,
        tablesCount: finalCount.rows[0]?.count || 33,
        lastSyncAt: new Date().toISOString(),
        error: null,
      };

      console.log(`✅ PostgreSQL database ready with ${currentStatus.tablesCount} tables`);
    } catch (err: any) {
      console.error('❌ Database initialization error:', err);
      currentStatus = {
        isReady: false,
        provider: 'PGlite (Local PostgreSQL IndexedDB)',
        isSupabaseConnected: false,
        tablesCount: 0,
        lastSyncAt: null,
        error: err.message || 'Unknown database error',
      };
    } finally {
      isInitializing = false;
    }
  })();

  await initPromise;
  return currentStatus;
}

/**
 * Get current database status
 */
export function getDatabaseStatus(): DatabaseStatus {
  return currentStatus;
}

/**
 * Execute raw SQL query (for SQL Lab and diagnostics)
 */
export async function executeRawQuery(sql: string): Promise<{
  columns: string[];
  rows: any[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}> {
  await initDatabase();
  const start = performance.now();

  try {
    if (!pgInstance) {
      throw new Error('PostgreSQL database is not initialized');
    }

    const res = await pgInstance.query(sql);
    const duration = Math.round((performance.now() - start) * 100) / 100;

    const rows = res.rows || [];
    const columns = res.fields 
      ? res.fields.map((f: any) => f.name) 
      : (rows.length > 0 && typeof rows[0] === 'object' && rows[0] !== null ? Object.keys(rows[0] as Record<string, unknown>) : []);

    return {
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: duration,
    };
  } catch (err: any) {
    const duration = Math.round((performance.now() - start) * 100) / 100;
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: duration,
      error: err.message || 'Failed to execute query',
    };
  }
}

// =====================================================================
// DATA REPOSITORY METHODS
// =====================================================================

/**
 * Load or initialize user profile
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  await initDatabase();
  if (pgInstance) {
    try {
      const res = await pgInstance.query<any>(
        `SELECT id, email, display_name, avatar_url, role, level, xp, streak, created_at 
         FROM public.profiles 
         WHERE id::text = $1 
            OR email ILIKE $1 
            OR email ILIKE ($1 || '@scicom.ac.th')
            OR split_part(email, '@', 1) ILIKE $1
         LIMIT 1;`,
        [userId]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email || '',
          displayName: row.display_name,
          avatar: row.avatar_url,
          role: row.role,
          level: row.level,
          xp: row.xp,
          streak: row.streak,
          createdAt: row.created_at,
        };
      }
    } catch (err) {
      console.warn('Error fetching profile from SQL:', err);
    }
  }
  return null;
}

/**
 * Upsert user profile in PostgreSQL
 */
export async function upsertUserProfile(user: User): Promise<void> {
  // Guest profiles are ephemeral and must never be saved in persistent database
  if (!user || user.role === 'guest' || user.id.startsWith('guest')) {
    return;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      // Validate UUID or generate valid UUID for SQL compatibility
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(user.id);
      if (isValidUuid) {
        await pgInstance.query(
          `INSERT INTO public.profiles (id, email, display_name, role, level, xp, streak, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, now())
           ON CONFLICT (id) DO UPDATE SET
             display_name = EXCLUDED.display_name,
             email = EXCLUDED.email,
             role = EXCLUDED.role,
             level = EXCLUDED.level,
             xp = EXCLUDED.xp,
             streak = EXCLUDED.streak,
             updated_at = now();`,
          [user.id, user.email, user.displayName, user.role, user.level, user.xp, user.streak]
        );
      }
    } catch (err) {
      console.warn('Failed to upsert profile in SQL:', err);
    }
  }
}

/**
 * Fetch course enrollments from PostgreSQL
 */
export async function getEnrollmentsFromDb(userId: string): Promise<Enrollment[]> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return []; // Guest has no persistent database enrollments
  }

  await initDatabase();
  if (pgInstance) {
    try {
      const query = `SELECT user_id, course_id, progress, completed_lessons, enrolled_at, last_accessed_at, last_lesson_id 
         FROM public.enrollments 
         WHERE user_id = $1;`;

      const res = await pgInstance.query<any>(query, [userId]);
      return res.rows.map(r => ({
        userId: r.user_id,
        courseId: r.course_id,
        progress: r.progress,
        completedLessons: Array.isArray(r.completed_lessons) ? r.completed_lessons : [],
        enrolledAt: r.enrolled_at,
        lastAccessedAt: r.last_accessed_at,
        lastLessonId: r.last_lesson_id || undefined,
      }));
    } catch (err) {
      console.warn('Failed to query enrollments from SQL:', err);
    }
  }
  return [];
}

/**
 * Persist course enrollment in PostgreSQL
 */
export async function saveEnrollmentToDb(enrollment: Enrollment): Promise<void> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(enrollment.userId);
  // Guest enrollments are session-only and never saved in persistent database
  if (!isValidUuid || enrollment.userId.startsWith('guest')) {
    return;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.enrollments (user_id, course_id, progress, completed_lessons, enrolled_at, last_accessed_at, last_lesson_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (user_id, course_id) DO UPDATE SET
           progress = EXCLUDED.progress,
           completed_lessons = EXCLUDED.completed_lessons,
           last_accessed_at = EXCLUDED.last_accessed_at,
           last_lesson_id = EXCLUDED.last_lesson_id;`,
        [
          enrollment.userId,
          enrollment.courseId,
          enrollment.progress,
          enrollment.completedLessons,
          enrollment.enrolledAt,
          enrollment.lastAccessedAt,
          enrollment.lastLessonId || null,
        ]
      );
    } catch (err) {
      console.warn('Failed to persist enrollment in SQL:', err);
    }
  }
}

/**
 * Fetch lesson progress from PostgreSQL
 */
export async function getLessonProgressFromDb(userId: string): Promise<LessonProgress[]> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return []; // Guest has no persistent database progress
  }

  await initDatabase();
  if (pgInstance) {
    try {
      const query = `SELECT user_id, lesson_id, course_id, completed, completed_at, quiz_score, time_spent 
         FROM public.lesson_progress 
         WHERE user_id = $1;`;

      const res = await pgInstance.query<any>(query, [userId]);
      return res.rows.map(r => ({
        userId: r.user_id,
        lessonId: r.lesson_id,
        courseId: r.course_id,
        completed: r.completed,
        completedAt: r.completed_at || undefined,
        quizScore: r.quiz_score !== null ? r.quiz_score : undefined,
        timeSpent: r.time_spent || 0,
      }));
    } catch (err) {
      console.warn('Failed to query lesson progress from SQL:', err);
    }
  }
  return [];
}

/**
 * Save lesson progress to PostgreSQL
 */
export async function saveLessonProgressToDb(progress: LessonProgress): Promise<void> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(progress.userId);
  // Guest progress is session-only and never saved in persistent database
  if (!isValidUuid || progress.userId.startsWith('guest')) {
    return;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.lesson_progress (user_id, lesson_id, course_id, completed, completed_at, quiz_score, time_spent, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, now())
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET
           completed = EXCLUDED.completed,
           completed_at = EXCLUDED.completed_at,
           quiz_score = EXCLUDED.quiz_score,
           time_spent = EXCLUDED.time_spent,
           updated_at = now();`,
        [
          progress.userId,
          progress.lessonId,
          progress.courseId,
          progress.completed,
          progress.completedAt || null,
          progress.quizScore !== undefined ? progress.quizScore : null,
          progress.timeSpent || 0,
        ]
      );
    } catch (err) {
      console.warn('Failed to save lesson progress in SQL:', err);
    }
  }
}

/**
 * Backend Quiz Evaluation via PostgreSQL Stored Procedure
 */
export async function evaluateQuizOnPostgres(
  quizId: string,
  answers: Record<string, string>,
  userId: string
): Promise<{
  attemptId: string;
  score: number;
  passed: boolean;
  totalPoints: number;
  earnedPoints: number;
  passingScore: number;
  breakdown: Array<{
    questionId: string;
    question: string;
    isCorrect: boolean;
    earnedPoints: number;
    explanation: string;
  }>;
}> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    throw new Error('Guest mode uses client-side evaluation without saving to database');
  }

  await initDatabase();
  if (!pgInstance) {
    throw new Error('Database not connected');
  }

  const res = await pgInstance.query<{ result: any }>(
    `SELECT public.submit_quiz_attempt($1, $2::jsonb, $3::uuid) as result;`,
    [quizId, JSON.stringify(answers), userId]
  );

  return res.rows[0].result;
}

/**
 * Student Projects CRUD in PostgreSQL
 */
export async function getStudentProjectsFromDb(): Promise<StudentProject[]> {
  await initDatabase();
  if (pgInstance) {
    try {
      const res = await pgInstance.query<any>(`
        SELECT id, user_id, title, description, category, difficulty, tags, demo_url, repo_url, skills, created_at, updated_at
        FROM public.student_projects
        ORDER BY created_at DESC;
      `);
      return res.rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        title: r.title,
        description: r.description || '',
        category: r.category,
        difficulty: r.difficulty,
        tags: Array.isArray(r.tags) ? r.tags : [],
        demoUrl: r.demo_url || undefined,
        repoUrl: r.repo_url || undefined,
        skills: Array.isArray(r.skills) ? r.skills : [],
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    } catch (err) {
      console.warn('Failed to fetch student projects from SQL:', err);
    }
  }
  return [];
}

export async function saveStudentProjectToDb(proj: StudentProject): Promise<void> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(proj.userId);
  // Guest projects are session-only and never saved in persistent database
  if (!isValidUuid || proj.userId.startsWith('guest')) {
    return;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.student_projects (id, user_id, title, description, category, difficulty, tags, demo_url, repo_url, skills, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           category = EXCLUDED.category,
           difficulty = EXCLUDED.difficulty,
           tags = EXCLUDED.tags,
           demo_url = EXCLUDED.demo_url,
           repo_url = EXCLUDED.repo_url,
           skills = EXCLUDED.skills,
           updated_at = now();`,
        [
          proj.id,
          proj.userId,
          proj.title,
          proj.description,
          proj.category,
          proj.difficulty,
          proj.tags,
          proj.demoUrl || null,
          proj.repoUrl || null,
          proj.skills,
          proj.createdAt,
          proj.updatedAt,
        ]
      );
    } catch (err) {
      console.warn('Failed to persist student project to SQL:', err);
    }
  }
}

export async function deleteStudentProjectFromDb(projectId: string): Promise<void> {
  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(`DELETE FROM public.student_projects WHERE id = $1;`, [projectId]);
    } catch (err) {
      console.warn('Failed to delete student project from SQL:', err);
    }
  }
}

/**
 * Practical Lab Progress CRUD in PostgreSQL
 */
export async function getLabProgressFromDb(userId: string): Promise<LabProgress[]> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return [];
  }

  await initDatabase();
  if (pgInstance) {
    try {
      const query = `SELECT user_id, lesson_id, course_id, completed, quiz_score, completed_at 
         FROM public.lesson_progress 
         WHERE user_id = $1 AND lesson_id LIKE 'lab-%';`;

      const res = await pgInstance.query<any>(query, [userId]);
      return res.rows.map(r => {
        const parts = r.lesson_id.split('-');
        const labId = parts[1] || 'general';
        const exerciseId = parts.slice(2).join('-') || r.lesson_id;
        return {
          userId: r.user_id,
          labId,
          exerciseId,
          completed: r.completed,
          score: r.quiz_score !== null ? r.quiz_score : undefined,
          completedAt: r.completed_at || undefined,
        };
      });
    } catch (err) {
      console.warn('Failed to query lab progress from SQL:', err);
    }
  }
  return [];
}

export async function saveLabProgressToDb(labProg: LabProgress): Promise<void> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(labProg.userId);
  // Guest lab progress is session-only and never saved in persistent database
  if (!isValidUuid || labProg.userId.startsWith('guest')) {
    return;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      const syntheticLessonId = `lab-${labProg.labId}-${labProg.exerciseId}`;
      const syntheticCourseId = `lab-${labProg.labId}`;

      await pgInstance.query(
        `INSERT INTO public.lesson_progress (user_id, lesson_id, course_id, completed, completed_at, quiz_score, time_spent, updated_at)
         VALUES ($1, $2, $3, $4, now(), $5, 120, now())
         ON CONFLICT (user_id, lesson_id) DO UPDATE SET
           completed = EXCLUDED.completed,
           completed_at = now(),
           quiz_score = EXCLUDED.quiz_score,
           updated_at = now();`,
        [labProg.userId, syntheticLessonId, syntheticCourseId, labProg.completed, labProg.score !== undefined ? labProg.score : 100]
      );
    } catch (err) {
      console.warn('Failed to persist lab progress in SQL:', err);
    }
  }
}

/**
 * Portfolio Settings in PostgreSQL
 */
export async function getPortfolioSettingsFromDb(userId: string): Promise<PortfolioProfile | null> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return null;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      const res = await pgInstance.query<any>(
        `SELECT bio, is_public, theme, contact_email, github_url, custom_skills 
         FROM public.portfolio_settings 
         WHERE user_id = $1 
         LIMIT 1;`,
        [userId]
      );
      if (res.rows.length > 0) {
        const r = res.rows[0];
        return {
          bio: r.bio || '',
          isPublic: r.is_public,
          theme: r.theme,
          contactEmail: r.contact_email || undefined,
          githubUrl: r.github_url || undefined,
          customSkills: Array.isArray(r.custom_skills) ? r.custom_skills : [],
        };
      }
    } catch (err) {
      console.warn('Failed to query portfolio settings from SQL:', err);
    }
  }
  return null;
}

export async function savePortfolioSettingsToDb(userId: string, settings: PortfolioProfile): Promise<void> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.portfolio_settings (user_id, bio, is_public, theme, contact_email, github_url, custom_skills, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, now())
         ON CONFLICT (user_id) DO UPDATE SET
           bio = EXCLUDED.bio,
           is_public = EXCLUDED.is_public,
           theme = EXCLUDED.theme,
           contact_email = EXCLUDED.contact_email,
           github_url = EXCLUDED.github_url,
           custom_skills = EXCLUDED.custom_skills,
           updated_at = now();`,
        [
          userId,
          settings.bio,
          settings.isPublic,
          settings.theme,
          settings.contactEmail || null,
          settings.githubUrl || null,
          settings.customSkills,
        ]
      );
    } catch (err) {
      console.warn('Failed to save portfolio settings in SQL:', err);
    }
  }
}

function genUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface CourseCompletionResult {
  verified: boolean;
  completed: boolean;
  justCompleted: boolean;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  completedAt?: string;
}

/**
 * Trusted backend course completion verification
 * 100% is only granted when every mandatory published lesson has a verified completion record
 */
export async function verifyAndUpdateCourseProgress(
  userId: string,
  courseId: string,
  fallbackTotalLessons?: number
): Promise<CourseCompletionResult> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return {
      verified: false,
      completed: false,
      justCompleted: false,
      progress: 0,
      totalLessons: fallbackTotalLessons || 1,
      completedLessons: 0,
    };
  }

  await initDatabase();
  if (pgInstance) {
    try {
      // 1. Get total published lessons in course from PostgreSQL
      const totalRes = await pgInstance.query<any>(
        `SELECT COUNT(*) as count FROM public.lessons WHERE course_id = $1 AND status = 'published';`,
        [courseId]
      );
      let totalLessons = parseInt(totalRes.rows[0]?.count || '0', 10);
      if (totalLessons === 0 && fallbackTotalLessons) {
        totalLessons = fallbackTotalLessons;
      }

      // 2. Count lessons completed by this user
      const compRes = await pgInstance.query<any>(
        `SELECT COUNT(*) as count, array_agg(lesson_id) as lessons
         FROM public.lesson_progress 
         WHERE user_id = $1 AND course_id = $2 AND completed = true;`,
        [userId, courseId]
      );
      const completedLessons = parseInt(compRes.rows[0]?.count || '0', 10);
      const completedIds: string[] = Array.isArray(compRes.rows[0]?.lessons) ? compRes.rows[0]?.lessons : [];

      // 3. Determine verified progress
      const targetTotal = Math.max(1, totalLessons);
      const progress = Math.min(100, Math.floor((completedLessons / targetTotal) * 100));
      const isCompleted = totalLessons > 0 && completedLessons >= totalLessons;

      // 4. Check existing enrollment progress
      const enrolRes = await pgInstance.query<any>(
        `SELECT progress FROM public.enrollments WHERE user_id = $1 AND course_id = $2;`,
        [userId, courseId]
      );
      const prevProgress = enrolRes.rows[0]?.progress || 0;
      const justCompleted = isCompleted && prevProgress < 100;
      const completedAt = isCompleted ? new Date().toISOString() : undefined;

      // 5. Update enrollment in PostgreSQL
      await pgInstance.query(
        `INSERT INTO public.enrollments (user_id, course_id, progress, completed_lessons, enrolled_at, last_accessed_at)
         VALUES ($1, $2, $3, $4, now(), now())
         ON CONFLICT (user_id, course_id) DO UPDATE SET
           progress = $3,
           completed_lessons = $4,
           last_accessed_at = now();`,
        [userId, courseId, progress, completedIds]
      );

      // 6. Award completion XP if just completed
      if (justCompleted) {
        await pgInstance.query(
          `UPDATE public.profiles SET xp = xp + 100, updated_at = now() WHERE id = $1;`,
          [userId]
        );
      }

      return {
        verified: true,
        completed: isCompleted,
        justCompleted,
        progress,
        totalLessons,
        completedLessons,
        completedAt,
      };
    } catch (err) {
      console.warn('Failed to verify course completion in SQL:', err);
    }
  }

  return {
    verified: false,
    completed: false,
    justCompleted: false,
    progress: 0,
    totalLessons: fallbackTotalLessons || 1,
    completedLessons: 0,
  };
}

/**
 * Fetch verified completion record from PostgreSQL
 */
export async function getCourseCompletionStatus(
  userId: string,
  courseId: string
): Promise<{ completed: boolean; progress: number; completedAt?: string } | null> {
  const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
  if (!isValidUuid || userId.startsWith('guest')) {
    return null;
  }

  await initDatabase();
  if (pgInstance) {
    try {
      const res = await pgInstance.query<any>(
        `SELECT progress, last_accessed_at FROM public.enrollments WHERE user_id = $1 AND course_id = $2 LIMIT 1;`,
        [userId, courseId]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          completed: row.progress >= 100,
          progress: row.progress,
          completedAt: row.last_accessed_at,
        };
      }
    } catch (err) {
      console.warn('Failed to query completion status from SQL:', err);
    }
  }
  return null;
}

/**
 * User Accounts Management in PostgreSQL (For Admin CMS)
 */
export async function getAllProfilesFromDb(): Promise<User[]> {
  await initDatabase();
  if (pgInstance) {
    try {
      const res = await pgInstance.query<any>(
        `SELECT id, email, display_name, avatar_url, role, level, xp, streak, created_at 
         FROM public.profiles 
         ORDER BY created_at ASC;`
      );
      return res.rows.map(row => ({
        id: row.id,
        email: row.email || '',
        displayName: row.display_name,
        avatar: row.avatar_url,
        role: row.role,
        level: row.level,
        xp: row.xp,
        streak: row.streak,
        createdAt: row.created_at,
      }));
    } catch (err) {
      console.warn('Failed to query all profiles from SQL:', err);
    }
  }
  return [];
}

export async function updateUserRoleInDb(
  adminUserId: string,
  targetUserId: string,
  newRole: User['role']
): Promise<boolean> {
  await initDatabase();
  if (pgInstance) {
    try {
      // Verify admin privileges
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adminUserId);
      if (isValidUuid) {
        const adminCheck = await pgInstance.query<any>(
          `SELECT role FROM public.profiles WHERE id = $1 LIMIT 1;`,
          [adminUserId]
        );
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
          throw new Error('สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเปลี่ยนบทบาทผู้ใช้ได้');
        }
      }

      await pgInstance.query(
        `UPDATE public.profiles SET role = $1, updated_at = now() WHERE id::text = $2;`,
        [newRole, targetUserId]
      );
      return true;
    } catch (err) {
      console.error('Failed to update role in DB:', err);
      throw err;
    }
  }
  return false;
}

export async function deleteUserProfileFromDb(
  adminUserId: string,
  targetUserId: string
): Promise<boolean> {
  await initDatabase();
  if (pgInstance) {
    try {
      // 1. Verify admin privileges
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adminUserId);
      if (isValidUuid) {
        const adminCheck = await pgInstance.query<any>(
          `SELECT role FROM public.profiles WHERE id = $1 LIMIT 1;`,
          [adminUserId]
        );
        if (adminCheck.rows.length === 0 || adminCheck.rows[0].role !== 'admin') {
          throw new Error('สิทธิ์ไม่เพียงพอ: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถลบบัญชีผู้ใช้ได้');
        }
      }

      // 2. Prevent deleting the primary admin account
      if (targetUserId === '00000000-0000-0000-0000-000000000001' || targetUserId === adminUserId) {
        throw new Error('ไม่อนุญาตให้ลบบัญชีผู้ดูแลระบบหลัก (Admin) ของตนเอง');
      }

      // 3. Clean up associated student records
      try {
        await pgInstance.query(`DELETE FROM public.lesson_progress WHERE user_id = $1;`, [targetUserId]);
      } catch {}
      try {
        await pgInstance.query(`DELETE FROM public.enrollments WHERE user_id = $1;`, [targetUserId]);
      } catch {}
      try {
        await pgInstance.query(`DELETE FROM public.student_projects WHERE user_id = $1;`, [targetUserId]);
      } catch {}
      try {
        await pgInstance.query(`DELETE FROM public.portfolio_settings WHERE user_id = $1;`, [targetUserId]);
      } catch {}

      // 4. Delete profile
      await pgInstance.query(`DELETE FROM public.profiles WHERE id::text = $1;`, [targetUserId]);

      return true;
    } catch (err) {
      console.error('Failed to delete user profile from DB:', err);
      throw err;
    }
  }
  return false;
}

export async function createProfileInDb(profile: {
  email: string;
  displayName: string;
  role: User['role'];
  level: User['level'];
}): Promise<User> {
  await initDatabase();
  const id = genUuid();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.profiles (id, email, display_name, role, level, xp, streak, updated_at)
         VALUES ($1, $2, $3, $4, $5, 0, 0, now());`,
        [id, profile.email, profile.displayName, profile.role, profile.level]
      );
    } catch (err) {
      console.warn('Failed to insert new profile in SQL:', err);
    }
  }
  return {
    id,
    email: profile.email,
    displayName: profile.displayName,
    role: profile.role,
    level: profile.level,
    xp: 0,
    streak: 0,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Course and Module Management in PostgreSQL
 */
export async function saveCourseToDb(course: Course): Promise<void> {
  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.courses (id, category_id, title, title_en, description, level, difficulty, estimated_hours, objectives, status, tags, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now())
         ON CONFLICT (id) DO UPDATE SET
           category_id = EXCLUDED.category_id,
           title = EXCLUDED.title,
           title_en = EXCLUDED.title_en,
           description = EXCLUDED.description,
           level = EXCLUDED.level,
           difficulty = EXCLUDED.difficulty,
           estimated_hours = EXCLUDED.estimated_hours,
           objectives = EXCLUDED.objectives,
           status = EXCLUDED.status,
           tags = EXCLUDED.tags,
           updated_at = now();`,
        [
          course.id,
          course.categoryId,
          course.title,
          course.titleEn || null,
          course.description,
          course.level,
          course.difficulty,
          course.estimatedHours,
          course.objectives,
          course.status,
          course.tags,
        ]
      );

      for (const mod of course.modules) {
        await pgInstance.query(
          `INSERT INTO public.course_modules (id, course_id, title, description, order_index, updated_at)
           VALUES ($1, $2, $3, $4, $5, now())
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             description = EXCLUDED.description,
             order_index = EXCLUDED.order_index,
             updated_at = now();`,
          [mod.id, course.id, mod.title, mod.description || null, mod.order]
        );

        for (const les of mod.lessons) {
          await pgInstance.query(
            `INSERT INTO public.lessons (id, module_id, course_id, title, type, content, estimated_minutes, order_index, status, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, now())
             ON CONFLICT (id) DO UPDATE SET
               title = EXCLUDED.title,
               type = EXCLUDED.type,
               content = EXCLUDED.content,
               estimated_minutes = EXCLUDED.estimated_minutes,
               order_index = EXCLUDED.order_index,
               status = EXCLUDED.status,
               updated_at = now();`,
            [
              les.id,
              mod.id,
              course.id,
              les.title,
              les.type,
              JSON.stringify(les.content || { sections: [] }),
              les.estimatedMinutes || 15,
              les.order,
              les.status || 'published',
            ]
          );
        }
      }
    } catch (err) {
      console.warn('Failed to save course to DB:', err);
    }
  }
}

export async function deleteCourseFromDb(courseId: string): Promise<void> {
  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(`DELETE FROM public.courses WHERE id = $1;`, [courseId]);
    } catch (err) {
      console.warn('Failed to delete course from DB:', err);
    }
  }
}

/**
 * Exercise & Quiz Management in PostgreSQL
 */
export async function saveQuizToDb(quiz: {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions: Array<{
    id: string;
    question: string;
    type: string;
    points: number;
    explanation?: string;
    options: Array<{ id: string; optionText: string; isCorrect: boolean }>;
  }>;
}): Promise<void> {
  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(
        `INSERT INTO public.quizzes (id, course_id, lesson_id, title, passing_score, updated_at)
         VALUES ($1, $2, $3, $4, $5, now())
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           passing_score = EXCLUDED.passing_score,
           updated_at = now();`,
        [quiz.id, quiz.courseId, quiz.lessonId, quiz.title, quiz.passingScore]
      );

      for (let i = 0; i < quiz.questions.length; i++) {
        const q = quiz.questions[i];
        await pgInstance.query(
          `INSERT INTO public.quiz_questions (id, quiz_id, question, type, explanation, points, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             question = EXCLUDED.question,
             explanation = EXCLUDED.explanation,
             points = EXCLUDED.points;`,
          [q.id, quiz.id, q.question, q.type || 'multiple-choice', q.explanation || null, q.points || 10, i + 1]
        );

        for (let j = 0; j < q.options.length; j++) {
          const opt = q.options[j];
          await pgInstance.query(
            `INSERT INTO public.quiz_options (id, question_id, option_text, is_correct, order_index)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO UPDATE SET
               option_text = EXCLUDED.option_text,
               is_correct = EXCLUDED.is_correct;`,
            [opt.id, q.id, opt.optionText, opt.isCorrect, j + 1]
          );
        }
      }
    } catch (err) {
      console.warn('Failed to save quiz to DB:', err);
    }
  }
}

/**
 * Custom Challenges / Lab Exercises Management
 */
export async function getCustomChallengesFromDb(): Promise<ProgrammingChallenge[]> {
  await initDatabase();
  if (pgInstance) {
    try {
      const res = await pgInstance.query<any>(`
        SELECT * FROM public.custom_challenges ORDER BY created_at ASC;
      `);
      return res.rows.map(r => ({
        id: r.id,
        category: r.category,
        categoryLabel: r.category_label,
        title: r.title,
        grade: r.grade,
        difficulty: r.difficulty,
        description: r.description,
        inputDescription: r.input_description || '',
        outputDescription: r.output_description || '',
        sampleInput: r.sample_input || '',
        sampleOutput: r.sample_output || '',
        hint: r.hint || '',
        testCases: r.test_cases ? JSON.parse(r.test_cases) : [],
        initialJsCode: r.initial_js_code || '',
        initialCppCode: r.initial_cpp_code || '',
        createdBy: r.created_by,
        createdAt: r.created_at,
      }));
    } catch (err) {
      console.warn('Failed to get custom challenges from DB:', err);
    }
  }
  return [];
}

export async function saveCustomChallengeToDb(ch: ProgrammingChallenge): Promise<void> {
  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(`
        INSERT INTO public.custom_challenges (
          id, category, category_label, title, grade, difficulty, description,
          input_description, output_description, sample_input, sample_output,
          hint, test_cases, initial_js_code, initial_cpp_code, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, now())
        ON CONFLICT (id) DO UPDATE SET
          category = EXCLUDED.category,
          category_label = EXCLUDED.category_label,
          title = EXCLUDED.title,
          grade = EXCLUDED.grade,
          difficulty = EXCLUDED.difficulty,
          description = EXCLUDED.description,
          input_description = EXCLUDED.input_description,
          output_description = EXCLUDED.output_description,
          sample_input = EXCLUDED.sample_input,
          sample_output = EXCLUDED.sample_output,
          hint = EXCLUDED.hint,
          test_cases = EXCLUDED.test_cases,
          initial_js_code = EXCLUDED.initial_js_code,
          initial_cpp_code = EXCLUDED.initial_cpp_code;
      `, [
        ch.id,
        ch.category,
        ch.categoryLabel,
        ch.title,
        ch.grade,
        ch.difficulty,
        ch.description,
        ch.inputDescription || '',
        ch.outputDescription || '',
        ch.sampleInput || '',
        ch.sampleOutput || '',
        ch.hint || '',
        JSON.stringify(ch.testCases || []),
        ch.initialJsCode || '',
        ch.initialCppCode || '',
        ch.createdBy || 'teacher'
      ]);
    } catch (err) {
      console.warn('Failed to save custom challenge to DB:', err);
    }
  }
}

export async function deleteCustomChallengeFromDb(id: string): Promise<void> {
  await initDatabase();
  if (pgInstance) {
    try {
      await pgInstance.query(`DELETE FROM public.custom_challenges WHERE id = $1;`, [id]);
    } catch (err) {
      console.warn('Failed to delete custom challenge from DB:', err);
    }
  }
}

