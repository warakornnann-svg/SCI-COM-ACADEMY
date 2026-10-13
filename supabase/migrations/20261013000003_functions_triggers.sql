-- =====================================================================
-- Migration 03: Database Functions, Stored Procedures & Triggers
-- Sci-Com Academy — Complete SQL Relational Database
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. RBAC HELPER FUNCTIONS (Security Definier)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID,
        auth.uid()
    );
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    uid UUID := public.current_user_id();
BEGIN
    IF uid IS NULL THEN
        RETURN false;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = uid AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher_or_admin()
RETURNS BOOLEAN AS $$
DECLARE
    uid UUID := public.current_user_id();
BEGIN
    IF uid IS NULL THEN
        RETURN false;
    END IF;
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = uid AND role IN ('admin', 'teacher')
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 2. SECURE QUIZ GRADING & ATTEMPT RECORDING RPC
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
    p_quiz_id TEXT,
    p_answers JSONB,
    p_user_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := COALESCE(p_user_id, public.current_user_id());
    v_quiz RECORD;
    v_q RECORD;
    v_opt RECORD;
    v_total_points INT := 0;
    v_earned_points INT := 0;
    v_score_percent INT := 0;
    v_passed BOOLEAN := false;
    v_attempt_id UUID := gen_random_uuid();
    v_selected_opt_id TEXT;
    v_correct_opt_id TEXT;
    v_is_correct BOOLEAN;
    v_breakdown JSONB := '[]'::JSONB;
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

    -- Iterate over quiz questions from PostgreSQL
    FOR v_q IN 
        SELECT id, question, points, explanation
        FROM public.quiz_questions
        WHERE quiz_id = p_quiz_id
        ORDER BY order_index ASC
    LOOP
        v_total_points := v_total_points + v_q.points;
        v_selected_opt_id := p_answers ->> v_q.id;
        
        -- Find true correct option from normalized quiz_options table
        SELECT id INTO v_correct_opt_id
        FROM public.quiz_options
        WHERE question_id = v_q.id AND is_correct = true
        LIMIT 1;

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

    -- Calculate final score
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

    -- 1. Insert Quiz Attempt Record
    INSERT INTO public.quiz_attempts (
        id, user_id, quiz_id, lesson_id, course_id, score, total_points, passed, attempted_at
    ) VALUES (
        v_attempt_id, v_user_id, p_quiz_id, v_quiz.lesson_id, v_quiz.course_id, v_score_percent, v_total_points, v_passed, now()
    );

    -- 2. Insert Granular Quiz Answers
    FOR v_q IN 
        SELECT id, points FROM public.quiz_questions WHERE quiz_id = p_quiz_id
    LOOP
        v_selected_opt_id := p_answers ->> v_q.id;
        SELECT id INTO v_correct_opt_id FROM public.quiz_options WHERE question_id = v_q.id AND is_correct = true LIMIT 1;
        v_is_correct := (v_selected_opt_id IS NOT NULL AND v_selected_opt_id = v_correct_opt_id);

        INSERT INTO public.quiz_answers (
            attempt_id, question_id, selected_option_id, is_correct, points_awarded
        ) VALUES (
            v_attempt_id, v_q.id, v_selected_opt_id, v_is_correct, CASE WHEN v_is_correct THEN v_q.points ELSE 0 END
        );
    END LOOP;

    -- 3. Upsert Lesson Progress
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

    -- 4. Record Experience Transaction
    INSERT INTO public.experience_transactions (
        user_id, amount, source, reference_id, description
    ) VALUES (
        v_user_id,
        v_xp_reward,
        CASE WHEN v_score_percent = 100 THEN 'quiz_perfect' WHEN v_passed THEN 'quiz_passed' ELSE 'lesson_completion' END,
        p_quiz_id,
        'ทำแบบทดสอบ: ' || v_quiz.id || ' ได้คะแนน ' || v_score_percent || '%'
    );

    -- 5. Update Profile XP
    UPDATE public.profiles
    SET xp = xp + v_xp_reward, updated_at = now()
    WHERE id = v_user_id;

    RETURN jsonb_build_object(
        'attemptId', v_attempt_id,
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

-- ---------------------------------------------------------------------
-- 3. ROLE ELEVATION PROTECTION TRIGGER
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.check_profile_role_elevation()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        -- Only existing admins can change roles
        IF NOT public.is_admin() THEN
            RAISE EXCEPTION 'Security Violation: Only system administrators are authorized to change user roles.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_elevation ON public.profiles;
CREATE TRIGGER trg_prevent_role_elevation
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.check_profile_role_elevation();

-- ---------------------------------------------------------------------
-- 4. NEW USER SYNC TRIGGER (For auth.users integration)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, role, level)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'student', -- Always default new signups to student to prevent privilege escalation
        COALESCE(NEW.raw_user_meta_data->>'level', 'ม.4')
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.portfolio_settings (user_id, bio, is_public)
    VALUES (NEW.id, 'นักเรียนสายวิทย์-คอมพิวเตอร์', true)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
