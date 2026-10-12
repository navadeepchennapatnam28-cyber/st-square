-- ============================================================================
-- MIGRATION: 20261012_04_faculty_startup_recommendations.sql
-- DESCRIPTION: Startup Desk, Skills, Endorsements, Interventions, Reports & Notifications
-- ============================================================================

-- 1. TABLE: startup_ideas
CREATE TABLE IF NOT EXISTS public.startup_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    founder_name TEXT NOT NULL,
    founder_email TEXT NOT NULL,
    title TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    domain TEXT NOT NULL CHECK (domain IN ('EdTech', 'FinTech', 'HealthTech', 'AI & SaaS', 'CleanTech', 'Campus Life')),
    stage TEXT NOT NULL CHECK (stage IN ('Ideation', 'Prototype', 'Validation', 'MVP Ready')),
    required_skills TEXT[] DEFAULT '{}'::TEXT[],
    team_requirements TEXT,
    collaborators_needed INT NOT NULL DEFAULT 2,
    upvotes_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_startup_founder ON public.startup_ideas(founder_id);

-- 2. TABLE: startup_upvotes
CREATE TABLE IF NOT EXISTS public.startup_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES public.startup_ideas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(idea_id, user_id)
);

-- Trigger to increment/decrement upvotes_count on startup_ideas
CREATE OR REPLACE FUNCTION public.handle_startup_upvote()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.startup_ideas SET upvotes_count = upvotes_count + 1 WHERE id = NEW.idea_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.startup_ideas SET upvotes_count = GREATEST(0, upvotes_count - 1) WHERE id = OLD.idea_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_startup_upvote ON public.startup_upvotes;
CREATE TRIGGER trigger_startup_upvote
AFTER INSERT OR DELETE ON public.startup_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_startup_upvote();

-- 3. TABLE: student_skills
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Technical', 'Core', 'Soft Skills')),
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    full_mark INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, skill_name)
);

CREATE INDEX IF NOT EXISTS idx_skills_student ON public.student_skills(student_id);

-- 4. TABLE: faculty_endorsements
CREATE TABLE IF NOT EXISTS public.faculty_endorsements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    faculty_name TEXT NOT NULL,
    faculty_designation TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_endorsements_student ON public.faculty_endorsements(student_id);

-- 5. TABLE: interventions
CREATE TABLE IF NOT EXISTS public.interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    department TEXT NOT NULL,
    assigned_faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_faculty_name TEXT NOT NULL,
    area TEXT NOT NULL,
    risk_trigger TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved')),
    priority TEXT NOT NULL DEFAULT 'High' CHECK (priority IN ('High', 'Medium', 'Low')),
    confidential_faculty_notes TEXT, -- Restrict: Inaccessible to students!
    resolution_notes TEXT,
    date_assigned DATE NOT NULL DEFAULT CURRENT_DATE,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interventions_student ON public.interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_status ON public.interventions(status);

-- Secure Student View for Interventions (Hides confidential_faculty_notes from students)
-- Configured with security_barrier = true and row-level student isolation filter
CREATE OR REPLACE VIEW public.student_interventions_view
WITH (security_barrier = true) AS
SELECT
    id,
    student_id,
    student_name,
    department,
    assigned_faculty_id,
    assigned_faculty_name,
    area,
    risk_trigger,
    risk_trigger AS reason,
    recommended_action,
    status,
    priority,
    priority AS risk_level,
    resolution_notes,
    date_assigned,
    resolved_at,
    created_at
FROM public.interventions
WHERE (
    student_id = auth.uid()
    OR public.is_faculty()
    OR public.is_admin()
);

-- Grant access on sanitized view to authenticated students and staff; revoke anon
GRANT SELECT ON public.student_interventions_view TO authenticated;
REVOKE ALL ON public.student_interventions_view FROM anon;

-- 6. TABLE: institutional_reports
CREATE TABLE IF NOT EXISTS public.institutional_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Academic', 'Attendance', 'Placement', 'Interventions', 'Accreditation')),
    period TEXT NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('PDF', 'XLSX', 'CSV')),
    size TEXT NOT NULL DEFAULT '1.4 MB',
    downloads_count INT NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(title)
);

-- Seed initial institutional reports
INSERT INTO public.institutional_reports (title, category, period, format, size, downloads_count, description)
VALUES
    ('B.Tech 2026 Cohort Mid-Semester Academic Performance Audit', 'Academic', 'Semester 7 • Fall 2026', 'PDF', '2.8 MB', 142, 'Comprehensive grade distributions, department SGPA percentiles, and backlog risk projections for NBA accreditation.'),
    ('Subject-Level Attendance Shortage & Hall Ticket Clearance Registry', 'Attendance', 'Oct 2026 Cycle', 'XLSX', '1.1 MB', 89, 'Automated tally of students under 75% attendance threshold with mandatory makeup lecture schedules.'),
    ('Tier-1 Product Placement Drive Eligibility & Skill Gap Telemetry', 'Placement', 'Recruitment 2026', 'PDF', '3.4 MB', 210, 'Coding percentile cross-referenced with CGPA benchmarks for Microsoft, Google, and Amazon campus rounds.'),
    ('Dean''s Caseload Interventions & Retention Impact Analysis', 'Interventions', 'Q3 Academic Year', 'PDF', '1.9 MB', 64, 'Resolution velocity of proactive counselor interventions and attendance recovery rates.')
ON CONFLICT (title) DO NOTHING;

-- 7. TABLE: st_point_insights
CREATE TABLE IF NOT EXISTS public.st_point_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Coding', 'Academic', 'Placement', 'Attendance', 'Communication')),
    improvement_area TEXT NOT NULL,
    supporting_metric TEXT NOT NULL,
    explanation TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    action_route TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    progress_percentage INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    suggested_steps TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_insights_student ON public.st_point_insights(student_id);

-- 8. TABLE: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('alert', 'info', 'success')),
    link TEXT,
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 9. TABLE: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.startup_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startup_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.st_point_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Startup Ideas: Authenticated read; Founder manage
DROP POLICY IF EXISTS "Startup ideas read" ON public.startup_ideas;
CREATE POLICY "Startup ideas read" ON public.startup_ideas FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Startup ideas insert" ON public.startup_ideas;
CREATE POLICY "Startup ideas insert" ON public.startup_ideas FOR INSERT TO authenticated
WITH CHECK (founder_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Startup ideas update" ON public.startup_ideas;
CREATE POLICY "Startup ideas update" ON public.startup_ideas FOR UPDATE TO authenticated
USING (founder_id = auth.uid() OR public.is_admin());

-- Startup Upvotes: Authenticated read & toggle own
DROP POLICY IF EXISTS "Upvotes read" ON public.startup_upvotes;
CREATE POLICY "Upvotes read" ON public.startup_upvotes FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Upvotes insert" ON public.startup_upvotes;
CREATE POLICY "Upvotes insert" ON public.startup_upvotes FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Upvotes delete" ON public.startup_upvotes;
CREATE POLICY "Upvotes delete" ON public.startup_upvotes FOR DELETE TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

-- Student Skills: Student read own; Faculty/Admin read
DROP POLICY IF EXISTS "Skills select" ON public.student_skills;
CREATE POLICY "Skills select" ON public.student_skills FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Skills manage" ON public.student_skills;
CREATE POLICY "Skills manage" ON public.student_skills FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin());

-- Faculty Endorsements: Student read own; Faculty insert
DROP POLICY IF EXISTS "Endorsements select" ON public.faculty_endorsements;
CREATE POLICY "Endorsements select" ON public.faculty_endorsements FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Endorsements faculty insert" ON public.faculty_endorsements;
CREATE POLICY "Endorsements faculty insert" ON public.faculty_endorsements FOR INSERT TO authenticated
WITH CHECK (public.is_faculty() OR public.is_admin());

-- Interventions:
-- Strictly restrict base-table operations (SELECT, INSERT, UPDATE, DELETE) to authorized faculty and admins.
-- Base table public.interventions contains confidential_faculty_notes and MUST NOT be queried directly by students.
-- Students must query the sanitized student_interventions_view instead.
DROP POLICY IF EXISTS "Interventions student view" ON public.interventions;
DROP POLICY IF EXISTS "Interventions faculty all" ON public.interventions;
CREATE POLICY "Interventions faculty all" ON public.interventions FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin())
WITH CHECK (public.is_faculty() OR public.is_admin());

-- Reports: Faculty and Admins only
DROP POLICY IF EXISTS "Reports faculty view" ON public.institutional_reports;
CREATE POLICY "Reports faculty view" ON public.institutional_reports FOR SELECT TO authenticated
USING (public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Reports admin manage" ON public.institutional_reports;
CREATE POLICY "Reports admin manage" ON public.institutional_reports FOR ALL TO authenticated
USING (public.is_admin());

-- ST Point Insights: Student read/update own progress; Faculty read
DROP POLICY IF EXISTS "Insights student view" ON public.st_point_insights;
CREATE POLICY "Insights student view" ON public.st_point_insights FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Insights student update progress" ON public.st_point_insights;
CREATE POLICY "Insights student update progress" ON public.st_point_insights FOR UPDATE TO authenticated
USING (student_id = auth.uid() OR public.is_admin())
WITH CHECK (student_id = auth.uid() OR public.is_admin());

-- Notifications: Strictly user-owned
DROP POLICY IF EXISTS "Notifications select own" ON public.notifications;
CREATE POLICY "Notifications select own" ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Notifications update own" ON public.notifications;
CREATE POLICY "Notifications update own" ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR public.is_admin());

-- Audit logs: Admin view only
DROP POLICY IF EXISTS "Audit logs admin view" ON public.audit_logs;
CREATE POLICY "Audit logs admin view" ON public.audit_logs FOR SELECT TO authenticated
USING (public.is_admin());
