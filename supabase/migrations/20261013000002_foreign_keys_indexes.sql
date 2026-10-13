-- =====================================================================
-- Migration 02: Foreign Keys, Integrity Constraints & Performance Indexes
-- Sci-Com Academy — Complete SQL Relational Database
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. FOREIGN KEY CONSTRAINTS (Cascades and Deletion Restrictions)
-- ---------------------------------------------------------------------

-- User Roles
ALTER TABLE public.user_roles
    DROP CONSTRAINT IF EXISTS fk_user_roles_user,
    ADD CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles
    DROP CONSTRAINT IF EXISTS fk_user_roles_role,
    ADD CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles
    DROP CONSTRAINT IF EXISTS fk_user_roles_assigner,
    ADD CONSTRAINT fk_user_roles_assigner
        FOREIGN KEY (assigned_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Courses
ALTER TABLE public.courses
    DROP CONSTRAINT IF EXISTS fk_courses_category,
    ADD CONSTRAINT fk_courses_category
        FOREIGN KEY (category_id) REFERENCES public.course_categories(id) ON DELETE SET NULL;

ALTER TABLE public.courses
    DROP CONSTRAINT IF EXISTS fk_courses_creator,
    ADD CONSTRAINT fk_courses_creator
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Course Modules
ALTER TABLE public.course_modules
    DROP CONSTRAINT IF EXISTS fk_modules_course,
    ADD CONSTRAINT fk_modules_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Lessons
ALTER TABLE public.lessons
    DROP CONSTRAINT IF EXISTS fk_lessons_module,
    ADD CONSTRAINT fk_lessons_module
        FOREIGN KEY (module_id) REFERENCES public.course_modules(id) ON DELETE CASCADE;

ALTER TABLE public.lessons
    DROP CONSTRAINT IF EXISTS fk_lessons_course,
    ADD CONSTRAINT fk_lessons_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Lesson Resources
ALTER TABLE public.lesson_resources
    DROP CONSTRAINT IF EXISTS fk_resources_lesson,
    ADD CONSTRAINT fk_resources_lesson
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

-- Enrollments
ALTER TABLE public.enrollments
    DROP CONSTRAINT IF EXISTS fk_enrollments_user,
    ADD CONSTRAINT fk_enrollments_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.enrollments
    DROP CONSTRAINT IF EXISTS fk_enrollments_course,
    ADD CONSTRAINT fk_enrollments_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.enrollments
    DROP CONSTRAINT IF EXISTS fk_enrollments_last_lesson,
    ADD CONSTRAINT fk_enrollments_last_lesson
        FOREIGN KEY (last_lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL;

-- Lesson Progress
ALTER TABLE public.lesson_progress
    DROP CONSTRAINT IF EXISTS fk_progress_user,
    ADD CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_progress
    DROP CONSTRAINT IF EXISTS fk_progress_lesson,
    ADD CONSTRAINT fk_progress_lesson
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_progress
    DROP CONSTRAINT IF EXISTS fk_progress_course,
    ADD CONSTRAINT fk_progress_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Quizzes
ALTER TABLE public.quizzes
    DROP CONSTRAINT IF EXISTS fk_quizzes_lesson,
    ADD CONSTRAINT fk_quizzes_lesson
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

ALTER TABLE public.quizzes
    DROP CONSTRAINT IF EXISTS fk_quizzes_course,
    ADD CONSTRAINT fk_quizzes_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Quiz Questions
ALTER TABLE public.quiz_questions
    DROP CONSTRAINT IF EXISTS fk_questions_quiz,
    ADD CONSTRAINT fk_questions_quiz
        FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

-- Quiz Options
ALTER TABLE public.quiz_options
    DROP CONSTRAINT IF EXISTS fk_options_question,
    ADD CONSTRAINT fk_options_question
        FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;

-- Quiz Attempts
ALTER TABLE public.quiz_attempts
    DROP CONSTRAINT IF EXISTS fk_attempts_user,
    ADD CONSTRAINT fk_attempts_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts
    DROP CONSTRAINT IF EXISTS fk_attempts_quiz,
    ADD CONSTRAINT fk_attempts_quiz
        FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts
    DROP CONSTRAINT IF EXISTS fk_attempts_lesson,
    ADD CONSTRAINT fk_attempts_lesson
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts
    DROP CONSTRAINT IF EXISTS fk_attempts_course,
    ADD CONSTRAINT fk_attempts_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- Quiz Answers
ALTER TABLE public.quiz_answers
    DROP CONSTRAINT IF EXISTS fk_answers_attempt,
    ADD CONSTRAINT fk_answers_attempt
        FOREIGN KEY (attempt_id) REFERENCES public.quiz_attempts(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_answers
    DROP CONSTRAINT IF EXISTS fk_answers_question,
    ADD CONSTRAINT fk_answers_question
        FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_answers
    DROP CONSTRAINT IF EXISTS fk_answers_option,
    ADD CONSTRAINT fk_answers_option
        FOREIGN KEY (selected_option_id) REFERENCES public.quiz_options(id) ON DELETE SET NULL;

-- Challenge Test Cases
ALTER TABLE public.challenge_test_cases
    DROP CONSTRAINT IF EXISTS fk_testcases_challenge,
    ADD CONSTRAINT fk_testcases_challenge
        FOREIGN KEY (challenge_id) REFERENCES public.coding_challenges(id) ON DELETE CASCADE;

-- Challenge Submissions
ALTER TABLE public.challenge_submissions
    DROP CONSTRAINT IF EXISTS fk_submissions_challenge,
    ADD CONSTRAINT fk_submissions_challenge
        FOREIGN KEY (challenge_id) REFERENCES public.coding_challenges(id) ON DELETE CASCADE;

ALTER TABLE public.challenge_submissions
    DROP CONSTRAINT IF EXISTS fk_submissions_user,
    ADD CONSTRAINT fk_submissions_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Student Projects
ALTER TABLE public.student_projects
    DROP CONSTRAINT IF EXISTS fk_student_projects_project,
    ADD CONSTRAINT fk_student_projects_project
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

ALTER TABLE public.student_projects
    DROP CONSTRAINT IF EXISTS fk_student_projects_user,
    ADD CONSTRAINT fk_student_projects_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Project Resources
ALTER TABLE public.project_resources
    DROP CONSTRAINT IF EXISTS fk_resources_project,
    ADD CONSTRAINT fk_resources_project
        FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Portfolio Settings
ALTER TABLE public.portfolio_settings
    DROP CONSTRAINT IF EXISTS fk_portfolio_user,
    ADD CONSTRAINT fk_portfolio_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- User Achievements
ALTER TABLE public.user_achievements
    DROP CONSTRAINT IF EXISTS fk_achievements_user,
    ADD CONSTRAINT fk_achievements_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_achievements
    DROP CONSTRAINT IF EXISTS fk_achievements_achievement,
    ADD CONSTRAINT fk_achievements_achievement
        FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;

-- Experience Transactions
ALTER TABLE public.experience_transactions
    DROP CONSTRAINT IF EXISTS fk_transactions_user,
    ADD CONSTRAINT fk_transactions_user
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Classroom Management (Restricting deletion to protect academic records)
ALTER TABLE public.classes
    DROP CONSTRAINT IF EXISTS fk_classes_teacher,
    ADD CONSTRAINT fk_classes_teacher
        FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.class_members
    DROP CONSTRAINT IF EXISTS fk_class_members_class,
    ADD CONSTRAINT fk_class_members_class
        FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE public.class_members
    DROP CONSTRAINT IF EXISTS fk_class_members_student,
    ADD CONSTRAINT fk_class_members_student
        FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.assignments
    DROP CONSTRAINT IF EXISTS fk_assignments_class,
    ADD CONSTRAINT fk_assignments_class
        FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE CASCADE;

ALTER TABLE public.assignments
    DROP CONSTRAINT IF EXISTS fk_assignments_course,
    ADD CONSTRAINT fk_assignments_course
        FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;

ALTER TABLE public.assignments
    DROP CONSTRAINT IF EXISTS fk_assignments_lesson,
    ADD CONSTRAINT fk_assignments_lesson
        FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE SET NULL;

ALTER TABLE public.assignments
    DROP CONSTRAINT IF EXISTS fk_assignments_creator,
    ADD CONSTRAINT fk_assignments_creator
        FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE RESTRICT;

ALTER TABLE public.assignment_submissions
    DROP CONSTRAINT IF EXISTS fk_submissions_assignment,
    ADD CONSTRAINT fk_submissions_assignment
        FOREIGN KEY (assignment_id) REFERENCES public.assignments(id) ON DELETE CASCADE;

ALTER TABLE public.assignment_submissions
    DROP CONSTRAINT IF EXISTS fk_submissions_student,
    ADD CONSTRAINT fk_submissions_student
        FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.assignment_submissions
    DROP CONSTRAINT IF EXISTS fk_submissions_grader,
    ADD CONSTRAINT fk_submissions_grader
        FOREIGN KEY (graded_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Community
ALTER TABLE public.discussions
    DROP CONSTRAINT IF EXISTS fk_discussions_author,
    ADD CONSTRAINT fk_discussions_author
        FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.comments
    DROP CONSTRAINT IF EXISTS fk_comments_discussion,
    ADD CONSTRAINT fk_comments_discussion
        FOREIGN KEY (discussion_id) REFERENCES public.discussions(id) ON DELETE CASCADE;

ALTER TABLE public.comments
    DROP CONSTRAINT IF EXISTS fk_comments_author,
    ADD CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.content_reports
    DROP CONSTRAINT IF EXISTS fk_reports_reporter,
    ADD CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.content_reports
    DROP CONSTRAINT IF EXISTS fk_reports_reviewer,
    ADD CONSTRAINT fk_reports_reviewer
        FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------
-- 2. PERFORMANCE INDEXES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_courses_category_status ON public.courses(category_id, status);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON public.course_modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON public.lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_course_status ON public.lessons(course_id, status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_course ON public.lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_order ON public.quiz_questions(quiz_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quiz_options_question ON public.quiz_options(question_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt ON public.quiz_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_student_projects_user ON public.student_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_user_created ON public.experience_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON public.discussions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_discussion ON public.comments(discussion_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignment_submissions_student ON public.assignment_submissions(student_id);
