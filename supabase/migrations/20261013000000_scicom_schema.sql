-- =====================================================================
-- SCI-COM ACADEMY — Supabase PostgreSQL Schema & Security Policies
-- =====================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 2. User Profiles Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('guest', 'student', 'teacher', 'admin')) DEFAULT 'student',
    level TEXT NOT NULL CHECK (level IN ('ม.4', 'ม.5', 'ม.6')) DEFAULT 'ม.4',
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 3. Course Categories Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.course_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    course_count INTEGER NOT NULL DEFAULT 0,
    order_index INTEGER NOT NULL DEFAULT 0
);

-- =====================================================================
-- 4. Courses Table
-- =====================================================================
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
    estimated_hours INTEGER NOT NULL DEFAULT 10,
    prerequisites TEXT[] NOT NULL DEFAULT '{}',
    objectives TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 5. Modules Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 6. Lessons Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('reading', 'interactive', 'quiz', 'coding', 'project')) DEFAULT 'reading',
    content JSONB NOT NULL DEFAULT '{"sections":[]}',
    estimated_minutes INTEGER NOT NULL DEFAULT 15,
    order_index INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 7. Quizzes Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT UNIQUE REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER NOT NULL DEFAULT 80,
    time_limit INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 8. Quiz Questions Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'ordering')) DEFAULT 'multiple-choice',
    options JSONB NOT NULL,
    explanation TEXT,
    points INTEGER NOT NULL DEFAULT 10,
    order_index INTEGER NOT NULL DEFAULT 1
);

-- =====================================================================
-- 9. Enrollments Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0,
    completed_lessons TEXT[] NOT NULL DEFAULT '{}',
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_lesson_id TEXT,
    CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

-- =====================================================================
-- 10. Lesson Progress Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    quiz_score INTEGER,
    time_spent INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id)
);

-- =====================================================================
-- 11. Quiz Attempts Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    answers JSONB NOT NULL,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 12. Student Projects Table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.student_projects (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('เริ่มต้น', 'ปานกลาง', 'ขั้นสูง')) DEFAULT 'เริ่มต้น',
    tags TEXT[] NOT NULL DEFAULT '{}',
    demo_url TEXT,
    repo_url TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 13. Discussion Posts & Comments
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.discussion_posts (
    id TEXT PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    likes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.discussion_comments (
    id TEXT PRIMARY KEY,
    post_id TEXT NOT NULL REFERENCES public.discussion_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================================
-- 14. Helper Functions for RBAC
-- =====================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

-- Course Categories RLS
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
    ON public.course_categories FOR SELECT
    USING (true);

CREATE POLICY "Admins and teachers can manage categories"
    ON public.course_categories FOR ALL
    USING (public.is_teacher_or_admin());

-- Courses RLS: Unpublished content is strictly restricted
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published courses"
    ON public.courses FOR SELECT
    USING (
        status = 'published' 
        OR public.is_teacher_or_admin()
    );

CREATE POLICY "Teachers and admins can insert courses"
    ON public.courses FOR INSERT
    WITH CHECK (public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can update courses"
    ON public.courses FOR UPDATE
    USING (public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can delete courses"
    ON public.courses FOR DELETE
    USING (public.is_teacher_or_admin());

-- Modules RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules of viewable courses"
    ON public.modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = modules.course_id
            AND (c.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins can manage modules"
    ON public.modules FOR ALL
    USING (public.is_teacher_or_admin());

-- Lessons RLS: Unpublished lessons are strictly restricted to teachers & admins
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View published lessons in published courses"
    ON public.lessons FOR SELECT
    USING (
        (status = 'published' AND EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = lessons.course_id AND c.status = 'published'
        ))
        OR public.is_teacher_or_admin()
    );

CREATE POLICY "Teachers and admins can insert lessons"
    ON public.lessons FOR INSERT
    WITH CHECK (public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can update lessons"
    ON public.lessons FOR UPDATE
    USING (public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can delete lessons"
    ON public.lessons FOR DELETE
    USING (public.is_teacher_or_admin());

-- Quizzes RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View quizzes for accessible lessons"
    ON public.quizzes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            WHERE l.id = quizzes.lesson_id
            AND (l.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins can manage quizzes"
    ON public.quizzes FOR ALL
    USING (public.is_teacher_or_admin());

-- Quiz Questions RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View questions for accessible quizzes"
    ON public.quiz_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.lessons l ON l.id = q.lesson_id
            WHERE q.id = quiz_questions.quiz_id
            AND (l.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins can manage quiz questions"
    ON public.quiz_questions FOR ALL
    USING (public.is_teacher_or_admin());

-- Enrollments RLS
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
    ON public.enrollments FOR SELECT
    USING (auth.uid() = user_id OR public.is_teacher_or_admin());

CREATE POLICY "Users can create their own enrollment"
    ON public.enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollment"
    ON public.enrollments FOR UPDATE
    USING (auth.uid() = user_id);

-- Lesson Progress RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
    ON public.lesson_progress FOR SELECT
    USING (auth.uid() = user_id OR public.is_teacher_or_admin());

CREATE POLICY "Users can insert/update their own progress"
    ON public.lesson_progress FOR ALL
    USING (auth.uid() = user_id);

-- Quiz Attempts RLS
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts"
    ON public.quiz_attempts FOR SELECT
    USING (auth.uid() = user_id OR public.is_teacher_or_admin());

CREATE POLICY "Users can insert quiz attempts"
    ON public.quiz_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Student Projects RLS
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view student projects"
    ON public.student_projects FOR SELECT
    USING (true);

CREATE POLICY "Users can manage their own projects"
    ON public.student_projects FOR ALL
    USING (auth.uid() = user_id);

-- Discussion RLS
ALTER TABLE public.discussion_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view discussions"
    ON public.discussion_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
    ON public.discussion_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors and admins can update posts"
    ON public.discussion_posts FOR UPDATE USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Public can view comments"
    ON public.discussion_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add comments"
    ON public.discussion_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- =====================================================================
-- 16. SECURE RPC: Calculate Quiz Score & Record Attempt on Backend
-- =====================================================================
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
    p_quiz_id TEXT,
    p_answers JSONB
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_quiz RECORD;
    v_q RECORD;
    v_total_points INT := 0;
    v_earned_points INT := 0;
    v_score_percent INT := 0;
    v_passed BOOLEAN := false;
    v_selected_opt_id TEXT;
    v_correct_opt_id TEXT;
    v_breakdown JSONB := '[]'::JSONB;
    v_is_correct BOOLEAN;
    v_opt JSONB;
    v_xp_reward INT := 25;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to submit quiz attempt';
    END IF;

    -- Fetch quiz info
    SELECT id, lesson_id, course_id, passing_score INTO v_quiz
    FROM public.quizzes
    WHERE id = p_quiz_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Quiz not found: %', p_quiz_id;
    END IF;

    -- Evaluate each question from database truth
    FOR v_q IN 
        SELECT id, question, points, options, explanation
        FROM public.quiz_questions
        WHERE quiz_id = p_quiz_id
        ORDER BY order_index ASC
    LOOP
        v_total_points := v_total_points + v_q.points;
        v_selected_opt_id := p_answers ->> v_q.id;
        
        -- Find the true correct option id
        v_correct_opt_id := NULL;
        FOR v_opt IN SELECT * FROM jsonb_array_elements(v_q.options)
        LOOP
            IF (v_opt ->> 'isCorrect')::BOOLEAN = true THEN
                v_correct_opt_id := v_opt ->> 'id';
            END IF;
        END LOOP;

        v_is_correct := (v_selected_opt_id IS NOT NULL AND v_selected_opt_id = v_correct_opt_id);

        IF v_is_correct THEN
            v_earned_points := v_earned_points + v_q.points;
        END IF;

        v_breakdown := v_breakdown || jsonb_build_object(
            'questionId', v_q.id,
            'question', v_q.question,
            'selectedOptionId', v_selected_opt_id,
            'correctOptionId', v_correct_opt_id,
            'isCorrect', v_is_correct,
            'points', v_q.points,
            'earnedPoints', CASE WHEN v_is_correct THEN v_q.points ELSE 0 END,
            'explanation', v_q.explanation
        );
    END LOOP;

    IF v_total_points > 0 THEN
        v_score_percent := ROUND((v_earned_points::NUMERIC / v_total_points::NUMERIC) * 100);
    ELSE
        v_score_percent := 0;
    END IF;

    v_passed := v_score_percent >= v_quiz.passing_score;

    IF v_score_percent = 100 THEN
        v_xp_reward := 50;
    ELSIF v_passed THEN
        v_xp_reward := 35;
    ELSE
        v_xp_reward := 10;
    END IF;

    -- Insert attempt record
    INSERT INTO public.quiz_attempts (
        user_id, quiz_id, lesson_id, course_id, score, total_points, passed, answers
    ) VALUES (
        v_user_id, p_quiz_id, v_quiz.lesson_id, v_quiz.course_id, v_score_percent, v_total_points, v_passed, p_answers
    );

    -- Upsert lesson progress
    INSERT INTO public.lesson_progress (
        user_id, lesson_id, course_id, completed, completed_at, quiz_score, time_spent
    ) VALUES (
        v_user_id, v_quiz.lesson_id, v_quiz.course_id, v_passed, 
        CASE WHEN v_passed THEN now() ELSE NULL END, 
        v_score_percent, 180
    )
    ON CONFLICT (user_id, lesson_id)
    DO UPDATE SET
        completed = CASE WHEN v_passed THEN true ELSE public.lesson_progress.completed END,
        completed_at = CASE WHEN v_passed THEN now() ELSE public.lesson_progress.completed_at END,
        quiz_score = GREATEST(COALESCE(public.lesson_progress.quiz_score, 0), v_score_percent),
        updated_at = now();

    -- Award XP to profile
    UPDATE public.profiles
    SET xp = xp + v_xp_reward, updated_at = now()
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'quizId', p_quiz_id,
        'lessonId', v_quiz.lesson_id,
        'courseId', v_quiz.course_id,
        'score', v_score_percent,
        'passingScore', v_quiz.passing_score,
        'earnedPoints', v_earned_points,
        'totalPoints', v_total_points,
        'passed', v_passed,
        'xpAwarded', v_xp_reward,
        'breakdown', v_breakdown
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================================
-- 17. Trigger to handle new auth.users -> public.profiles
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, role, level)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        COALESCE(new.raw_user_meta_data->>'level', 'ม.4')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
