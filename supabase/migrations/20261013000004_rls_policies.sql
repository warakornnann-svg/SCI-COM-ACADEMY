-- =====================================================================
-- Migration 04: Row Level Security (RLS) Policies
-- Sci-Com Academy — Complete SQL Relational Database
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ---------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- 2. USERS AND AUTH POLICIES
-- ---------------------------------------------------------------------

-- Profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT WITH CHECK (id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (id = public.current_user_id() OR public.is_admin());

-- Roles & User Roles
CREATE POLICY "Roles are viewable by everyone"
    ON public.roles FOR SELECT USING (true);

CREATE POLICY "Admins manage roles"
    ON public.roles FOR ALL USING (public.is_admin());

CREATE POLICY "User roles viewable by everyone"
    ON public.user_roles FOR SELECT USING (true);

CREATE POLICY "Admins manage user roles"
    ON public.user_roles FOR ALL USING (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. COURSES AND LESSONS POLICIES
-- ---------------------------------------------------------------------

-- Course Categories
CREATE POLICY "Anyone can view categories"
    ON public.course_categories FOR SELECT USING (true);

CREATE POLICY "Teachers and admins manage categories"
    ON public.course_categories FOR ALL USING (public.is_teacher_or_admin());

-- Courses: Draft/archived restricted to teachers & admins
CREATE POLICY "Public can view published courses"
    ON public.courses FOR SELECT
    USING (status = 'published' OR public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can insert courses"
    ON public.courses FOR INSERT WITH CHECK (public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can update courses"
    ON public.courses FOR UPDATE USING (public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins can delete courses"
    ON public.courses FOR DELETE USING (public.is_teacher_or_admin());

-- Course Modules
CREATE POLICY "View modules of viewable courses"
    ON public.course_modules FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = course_modules.course_id
            AND (c.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins manage modules"
    ON public.course_modules FOR ALL USING (public.is_teacher_or_admin());

-- Lessons
CREATE POLICY "View published lessons in published courses"
    ON public.lessons FOR SELECT
    USING (
        (status = 'published' AND EXISTS (
            SELECT 1 FROM public.courses c
            WHERE c.id = lessons.course_id AND c.status = 'published'
        ))
        OR public.is_teacher_or_admin()
    );

CREATE POLICY "Teachers and admins manage lessons"
    ON public.lessons FOR ALL USING (public.is_teacher_or_admin());

-- Lesson Resources
CREATE POLICY "View resources for accessible lessons"
    ON public.lesson_resources FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            WHERE l.id = lesson_resources.lesson_id
            AND (l.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins manage resources"
    ON public.lesson_resources FOR ALL USING (public.is_teacher_or_admin());

-- Enrollments: Private to student
CREATE POLICY "Users view own enrollments"
    ON public.enrollments FOR SELECT
    USING (user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Users insert own enrollment"
    ON public.enrollments FOR INSERT
    WITH CHECK (user_id = public.current_user_id());

CREATE POLICY "Users update own enrollment"
    ON public.enrollments FOR UPDATE
    USING (user_id = public.current_user_id());

-- Lesson Progress: Private to student
CREATE POLICY "Users view own progress"
    ON public.lesson_progress FOR SELECT
    USING (user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Users manage own progress"
    ON public.lesson_progress FOR ALL
    USING (user_id = public.current_user_id());

-- ---------------------------------------------------------------------
-- 4. ASSESSMENTS POLICIES
-- ---------------------------------------------------------------------

-- Quizzes
CREATE POLICY "View quizzes for accessible lessons"
    ON public.quizzes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            WHERE l.id = quizzes.lesson_id
            AND (l.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins manage quizzes"
    ON public.quizzes FOR ALL USING (public.is_teacher_or_admin());

-- Quiz Questions
CREATE POLICY "View quiz questions"
    ON public.quiz_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quizzes q
            JOIN public.lessons l ON l.id = q.lesson_id
            WHERE q.id = quiz_questions.quiz_id
            AND (l.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins manage quiz questions"
    ON public.quiz_questions FOR ALL USING (public.is_teacher_or_admin());

-- Quiz Options
CREATE POLICY "View quiz options"
    ON public.quiz_options FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quiz_questions qq
            JOIN public.quizzes q ON q.id = qq.quiz_id
            JOIN public.lessons l ON l.id = q.lesson_id
            WHERE qq.id = quiz_options.question_id
            AND (l.status = 'published' OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Teachers and admins manage quiz options"
    ON public.quiz_options FOR ALL USING (public.is_teacher_or_admin());

-- Quiz Attempts: Private to student
CREATE POLICY "Users view own attempts"
    ON public.quiz_attempts FOR SELECT
    USING (user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Users insert own attempts"
    ON public.quiz_attempts FOR INSERT
    WITH CHECK (user_id = public.current_user_id());

-- Quiz Answers: Private to student
CREATE POLICY "Users view own answers"
    ON public.quiz_answers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = quiz_answers.attempt_id
            AND (qa.user_id = public.current_user_id() OR public.is_teacher_or_admin())
        )
    );

CREATE POLICY "Users insert own answers"
    ON public.quiz_answers FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.quiz_attempts qa
            WHERE qa.id = quiz_answers.attempt_id
            AND qa.user_id = public.current_user_id()
        )
    );

-- ---------------------------------------------------------------------
-- 5. PROGRAMMING PRACTICE POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Public can view coding challenges"
    ON public.coding_challenges FOR SELECT USING (true);

CREATE POLICY "Teachers and admins manage coding challenges"
    ON public.coding_challenges FOR ALL USING (public.is_teacher_or_admin());

CREATE POLICY "Public can view non-hidden test cases"
    ON public.challenge_test_cases FOR SELECT
    USING (is_hidden = false OR public.is_teacher_or_admin());

CREATE POLICY "Teachers and admins manage test cases"
    ON public.challenge_test_cases FOR ALL USING (public.is_teacher_or_admin());

CREATE POLICY "Users view own submissions"
    ON public.challenge_submissions FOR SELECT
    USING (user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Users submit challenges"
    ON public.challenge_submissions FOR INSERT
    WITH CHECK (user_id = public.current_user_id());

-- ---------------------------------------------------------------------
-- 6. PROJECTS AND PORTFOLIO POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Anyone can view project templates"
    ON public.projects FOR SELECT USING (true);

CREATE POLICY "Teachers and admins manage project templates"
    ON public.projects FOR ALL USING (public.is_teacher_or_admin());

CREATE POLICY "View published student projects"
    ON public.student_projects FOR SELECT
    USING (status = 'published' OR status = 'featured' OR user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Users manage own student projects"
    ON public.student_projects FOR ALL
    USING (user_id = public.current_user_id());

CREATE POLICY "Public view project resources"
    ON public.project_resources FOR SELECT USING (true);

CREATE POLICY "Teachers and admins manage project resources"
    ON public.project_resources FOR ALL USING (public.is_teacher_or_admin());

-- Portfolio Settings: Public if is_public = true, otherwise private
CREATE POLICY "View public portfolio settings"
    ON public.portfolio_settings FOR SELECT
    USING (is_public = true OR user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Users manage own portfolio settings"
    ON public.portfolio_settings FOR ALL
    USING (user_id = public.current_user_id());

-- ---------------------------------------------------------------------
-- 7. GAMIFICATION POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Public view achievements"
    ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Teachers and admins manage achievements"
    ON public.achievements FOR ALL USING (public.is_teacher_or_admin());

CREATE POLICY "Public view user achievements"
    ON public.user_achievements FOR SELECT USING (true);

CREATE POLICY "Users insert earned achievements"
    ON public.user_achievements FOR INSERT
    WITH CHECK (user_id = public.current_user_id());

CREATE POLICY "Users view own XP transactions"
    ON public.experience_transactions FOR SELECT
    USING (user_id = public.current_user_id() OR public.is_teacher_or_admin());

CREATE POLICY "Public view daily challenges"
    ON public.daily_challenges FOR SELECT USING (true);

-- ---------------------------------------------------------------------
-- 8. CLASSROOM MANAGEMENT POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "View authorized classes"
    ON public.classes FOR SELECT
    USING (
        teacher_id = public.current_user_id()
        OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = classes.id AND cm.student_id = public.current_user_id())
        OR public.is_admin()
    );

CREATE POLICY "Teachers and admins manage classes"
    ON public.classes FOR ALL
    USING (teacher_id = public.current_user_id() OR public.is_admin());

CREATE POLICY "View class members"
    ON public.class_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = class_members.class_id
            AND (c.teacher_id = public.current_user_id() OR class_members.student_id = public.current_user_id() OR public.is_admin())
        )
    );

CREATE POLICY "Teachers manage class members"
    ON public.class_members FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_members.class_id AND (c.teacher_id = public.current_user_id() OR public.is_admin()))
    );

CREATE POLICY "View class assignments"
    ON public.assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            WHERE c.id = assignments.class_id
            AND (
                c.teacher_id = public.current_user_id()
                OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = c.id AND cm.student_id = public.current_user_id())
                OR public.is_admin()
            )
        )
    );

CREATE POLICY "Teachers manage assignments"
    ON public.assignments FOR ALL
    USING (
        EXISTS (SELECT 1 FROM public.classes c WHERE c.id = assignments.class_id AND (c.teacher_id = public.current_user_id() OR public.is_admin()))
    );

CREATE POLICY "View assignment submissions"
    ON public.assignment_submissions FOR SELECT
    USING (
        student_id = public.current_user_id()
        OR EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classes c ON c.id = a.class_id
            WHERE a.id = assignment_submissions.assignment_id
            AND (c.teacher_id = public.current_user_id() OR public.is_admin())
        )
    );

CREATE POLICY "Students submit own assignments"
    ON public.assignment_submissions FOR INSERT
    WITH CHECK (student_id = public.current_user_id());

CREATE POLICY "Students update own submission before grading"
    ON public.assignment_submissions FOR UPDATE
    USING (student_id = public.current_user_id() OR public.is_teacher_or_admin());

-- ---------------------------------------------------------------------
-- 9. COMMUNITY POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Public view active discussions"
    ON public.discussions FOR SELECT
    USING (status = 'active' OR author_id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Authenticated users create discussions"
    ON public.discussions FOR INSERT
    WITH CHECK (author_id = public.current_user_id());

CREATE POLICY "Authors and admins update discussions"
    ON public.discussions FOR UPDATE
    USING (author_id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Authors and admins delete discussions"
    ON public.discussions FOR DELETE
    USING (author_id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Public view comments"
    ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users create comments"
    ON public.comments FOR INSERT
    WITH CHECK (author_id = public.current_user_id());

CREATE POLICY "Authors and admins update comments"
    ON public.comments FOR UPDATE
    USING (author_id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Authors and admins delete comments"
    ON public.comments FOR DELETE
    USING (author_id = public.current_user_id() OR public.is_admin());

CREATE POLICY "Authenticated users submit content reports"
    ON public.content_reports FOR INSERT
    WITH CHECK (reporter_id = public.current_user_id());

CREATE POLICY "Teachers and admins view and manage reports"
    ON public.content_reports FOR ALL
    USING (public.is_teacher_or_admin());
