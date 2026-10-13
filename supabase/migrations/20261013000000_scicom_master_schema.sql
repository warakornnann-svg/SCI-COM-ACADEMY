-- =====================================================================
-- MASTER MIGRATION: Sci-Com Academy Complete Relational Database
-- Contains 33 Normalized Tables, Constraints, Functions, RLS & Seed
-- =====================================================================

-- 1. Enable Required Extensions safely across PostgreSQL environments
DO $$
BEGIN
    BEGIN
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
    BEGIN
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    EXCEPTION WHEN OTHERS THEN
        NULL;
    END;
END $$;

-- =====================================================================
-- SECTION 1: USERS AND AUTHENTICATION
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('guest', 'student', 'teacher', 'admin')) DEFAULT 'student',
    level TEXT NOT NULL CHECK (level IN ('ม.4', 'ม.5', 'ม.6')) DEFAULT 'ม.4',
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    streak INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    CONSTRAINT unique_user_role UNIQUE (user_id, role_id)
);

-- =====================================================================
-- SECTION 2: COURSES AND LESSONS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.course_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    course_count INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.course_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    title_en TEXT,
    description TEXT NOT NULL,
    thumbnail TEXT,
    icon TEXT NOT NULL DEFAULT 'BookOpen',
    level TEXT NOT NULL CHECK (level IN ('ม.4', 'ม.5', 'ม.6', 'ทุกระดับ')) DEFAULT 'ทุกระดับ',
    difficulty TEXT NOT NULL CHECK (difficulty IN ('เริ่มต้น', 'ปานกลาง', 'ขั้นสูง')) DEFAULT 'เริ่มต้น',
    estimated_hours INTEGER NOT NULL DEFAULT 10 CHECK (estimated_hours > 0),
    prerequisites TEXT[] NOT NULL DEFAULT '{}',
    objectives TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reading', 'interactive', 'quiz', 'coding', 'project')) DEFAULT 'reading',
    content JSONB NOT NULL DEFAULT '{"sections":[]}',
    estimated_minutes INTEGER NOT NULL DEFAULT 15 CHECK (estimated_minutes > 0),
    order_index INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lesson_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('link', 'pdf', 'slide', 'code', 'video')) DEFAULT 'link',
    file_size INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_lessons TEXT[] NOT NULL DEFAULT '{}',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    quiz_score INTEGER CHECK (quiz_score IS NULL OR (quiz_score >= 0 AND quiz_score <= 100)),
    time_spent INTEGER NOT NULL DEFAULT 0 CHECK (time_spent >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- =====================================================================
-- SECTION 3: ASSESSMENTS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT UNIQUE REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER NOT NULL DEFAULT 80 CHECK (passing_score >= 0 AND passing_score <= 100),
    time_limit INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'ordering')) DEFAULT 'multiple-choice',
    explanation TEXT,
    points INTEGER NOT NULL DEFAULT 10 CHECK (points > 0),
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_options (
    id TEXT PRIMARY KEY,
    question_id TEXT NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    total_points INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    selected_option_id TEXT REFERENCES public.quiz_options(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- SECTION 4: PROGRAMMING PRACTICE
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.coding_challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('cpp', 'javascript', 'python', 'html', 'sql')) DEFAULT 'cpp',
    difficulty TEXT NOT NULL CHECK (difficulty IN ('ง่าย', 'ปานกลาง', 'ยาก')) DEFAULT 'ง่าย',
    starter_code TEXT NOT NULL,
    solution_code TEXT,
    xp_reward INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenge_test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id TEXT NOT NULL REFERENCES public.coding_challenges(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_hidden BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id TEXT NOT NULL REFERENCES public.coding_challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded')),
    passed_test_cases INTEGER NOT NULL DEFAULT 0,
    total_test_cases INTEGER NOT NULL DEFAULT 0,
    execution_time_ms INTEGER,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- SECTION 5: PROJECTS AND PORTFOLIO
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('เริ่มต้น', 'ปานกลาง', 'ขั้นสูง')) DEFAULT 'เริ่มต้น',
    estimated_hours INTEGER NOT NULL DEFAULT 10,
    skills TEXT[] NOT NULL DEFAULT '{}',
    objectives TEXT[] NOT NULL DEFAULT '{}',
    steps JSONB NOT NULL DEFAULT '[]',
    thumbnail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.student_projects (
    id TEXT PRIMARY KEY,
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('เริ่มต้น', 'ปานกลาง', 'ขั้นสูง')) DEFAULT 'เริ่มต้น',
    tags TEXT[] NOT NULL DEFAULT '{}',
    demo_url TEXT,
    repo_url TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'featured')) DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('link', 'github', 'demo', 'doc', 'zip')) DEFAULT 'link',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    theme TEXT NOT NULL CHECK (theme IN ('slate', 'cyber', 'minimal')) DEFAULT 'slate',
    contact_email TEXT,
    github_url TEXT,
    custom_skills TEXT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- SECTION 6: GAMIFICATION
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.experience_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('lesson_completion', 'quiz_perfect', 'quiz_passed', 'challenge_solved', 'achievement', 'daily_challenge', 'typing_practice', 'project_submission', 'bonus')),
    reference_id TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('typing', 'coding', 'quiz', 'design')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('ง่าย', 'ปานกลาง', 'ยาก')),
    xp_reward INTEGER NOT NULL DEFAULT 50,
    estimated_minutes INTEGER NOT NULL DEFAULT 10,
    active_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- SECTION 7: CLASSROOM MANAGEMENT
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    level TEXT NOT NULL CHECK (level IN ('ม.4', 'ม.5', 'ม.6')),
    academic_year TEXT NOT NULL DEFAULT '2569',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_class_student UNIQUE (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
    lesson_id TEXT REFERENCES public.lessons(id) ON DELETE SET NULL,
    due_date TIMESTAMPTZ NOT NULL,
    max_points INTEGER NOT NULL DEFAULT 100,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    attachment_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'graded', 'returned')) DEFAULT 'submitted',
    grade INTEGER CHECK (grade IS NULL OR grade >= 0),
    feedback TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    CONSTRAINT unique_assignment_student UNIQUE (assignment_id, student_id)
);

-- =====================================================================
-- SECTION 8: COMMUNITY
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.discussions (
    id TEXT PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'closed', 'hidden')) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY,
    discussion_id TEXT NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'comment', 'project', 'profile')),
    target_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'dismissed', 'action_taken')) DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ
);
