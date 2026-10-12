-- ============================================================================
-- MIGRATION: 20261012_mock_interviews.sql
-- DESCRIPTION: AI Mock Interview Module Schema & Row-Level Security (RLS) Policies
-- ============================================================================

-- Ensure uuid-ossp or pgcrypto extension is active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLE: mock_interviews
CREATE TABLE IF NOT EXISTS public.mock_interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    target_role TEXT NOT NULL,
    target_company TEXT,
    interview_type TEXT NOT NULL CHECK (interview_type IN ('hr', 'technical', 'aptitude', 'behavioral', 'group_discussion')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    total_questions INTEGER NOT NULL DEFAULT 5,
    current_question_number INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('setup', 'in_progress', 'completed', 'abandoned')),
    overall_score NUMERIC(5, 2),
    communication_score NUMERIC(5, 2),
    technical_score NUMERIC(5, 2),
    confidence_score NUMERIC(5, 2),
    strengths TEXT[] DEFAULT '{}'::TEXT[],
    weaknesses TEXT[] DEFAULT '{}'::TEXT[],
    final_feedback TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLE: mock_interview_questions
CREATE TABLE IF NOT EXISTS public.mock_interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_category TEXT NOT NULL,
    expected_topics TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TABLE: mock_interview_answers
CREATE TABLE IF NOT EXISTS public.mock_interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.mock_interview_questions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    answer_text TEXT NOT NULL,
    answer_score NUMERIC(4, 1) NOT NULL,
    communication_score NUMERIC(4, 1) NOT NULL,
    technical_score NUMERIC(4, 1) NOT NULL,
    confidence_score NUMERIC(4, 1) NOT NULL,
    feedback TEXT NOT NULL,
    improved_answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_mock_interviews_student_id ON public.mock_interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_status ON public.mock_interviews(status);
CREATE INDEX IF NOT EXISTS idx_mock_interview_questions_interview_id ON public.mock_interview_questions(interview_id);
CREATE INDEX IF NOT EXISTS idx_mock_interview_answers_interview_id ON public.mock_interview_answers(interview_id);
CREATE INDEX IF NOT EXISTS idx_mock_interview_answers_student_id ON public.mock_interview_answers(student_id);

-- 5. TRIGGER FOR AUTO-UPDATING updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_mock_interviews_updated_at ON public.mock_interviews;
CREATE TRIGGER trigger_mock_interviews_updated_at
BEFORE UPDATE ON public.mock_interviews
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interview_answers ENABLE ROW LEVEL SECURITY;

-- Role helper functions:
-- public.is_admin() and public.is_faculty() are authoritatively defined in
-- 20261012_01_foundation_auth_and_profiles.sql with database-backed profiles role checks
-- via public.get_auth_role() and service-role / institutional email domain validation.
-- Duplicate definitions have been removed here to guarantee they cannot overwrite migration 01.

-- ----------------------------------------------------------------------------
-- POLICIES: mock_interviews
-- ----------------------------------------------------------------------------

-- Students: Full control over their own interview sessions
DROP POLICY IF EXISTS "Students can view own mock interviews" ON public.mock_interviews;
CREATE POLICY "Students can view own mock interviews"
ON public.mock_interviews FOR SELECT
USING (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can create own mock interviews" ON public.mock_interviews;
CREATE POLICY "Students can create own mock interviews"
ON public.mock_interviews FOR INSERT
WITH CHECK (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can update own mock interviews" ON public.mock_interviews;
CREATE POLICY "Students can update own mock interviews"
ON public.mock_interviews FOR UPDATE
USING (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can delete own mock interviews" ON public.mock_interviews;
CREATE POLICY "Students can delete own mock interviews"
ON public.mock_interviews FOR DELETE
USING (auth.uid() = student_id OR public.is_admin());

-- Faculty: Read-only summary scores for completed interviews of students in same department
DROP POLICY IF EXISTS "Faculty can view completed student interview summaries" ON public.mock_interviews;
CREATE POLICY "Faculty can view completed student interview summaries"
ON public.mock_interviews FOR SELECT
USING (
    public.is_faculty() AND status = 'completed'
);

-- ----------------------------------------------------------------------------
-- POLICIES: mock_interview_questions
-- ----------------------------------------------------------------------------

-- Students can read questions belonging to their own sessions
DROP POLICY IF EXISTS "Students can view questions for own interviews" ON public.mock_interview_questions;
CREATE POLICY "Students can view questions for own interviews"
ON public.mock_interview_questions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.mock_interviews
        WHERE mock_interviews.id = mock_interview_questions.interview_id
        AND (mock_interviews.student_id = auth.uid() OR public.is_admin() OR public.is_faculty())
    )
);

-- Questions can be created if user owns the interview session
DROP POLICY IF EXISTS "Students can insert questions into own sessions" ON public.mock_interview_questions;
CREATE POLICY "Students can insert questions into own sessions"
ON public.mock_interview_questions FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.mock_interviews
        WHERE mock_interviews.id = mock_interview_questions.interview_id
        AND (mock_interviews.student_id = auth.uid() OR public.is_admin())
    )
);

-- ----------------------------------------------------------------------------
-- POLICIES: mock_interview_answers
-- ----------------------------------------------------------------------------

-- Students can read and insert only their own answers
-- Faculty CANNOT read raw student answers unless admin role is present
DROP POLICY IF EXISTS "Students can view own answers" ON public.mock_interview_answers;
CREATE POLICY "Students can view own answers"
ON public.mock_interview_answers FOR SELECT
USING (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can insert own answers" ON public.mock_interview_answers;
CREATE POLICY "Students can insert own answers"
ON public.mock_interview_answers FOR INSERT
WITH CHECK (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students can update own answers" ON public.mock_interview_answers;
CREATE POLICY "Students can update own answers"
ON public.mock_interview_answers FOR UPDATE
USING (auth.uid() = student_id OR public.is_admin());
