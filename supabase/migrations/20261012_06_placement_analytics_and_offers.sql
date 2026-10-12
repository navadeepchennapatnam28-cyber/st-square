-- ============================================================================
-- MIGRATION: 20261012_06_placement_analytics_and_offers.sql
-- DESCRIPTION: Student Placement Offers, Internship Records & Institutional Placement Analytics
-- ============================================================================

-- 1. TABLE: student_placement_offers
CREATE TABLE IF NOT EXISTS public.student_placement_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    department TEXT NOT NULL,
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    package_lpa NUMERIC(6, 2) NOT NULL,
    offer_type TEXT NOT NULL DEFAULT 'Full Time' CHECK (offer_type IN ('Full Time', 'Internship + PPO', 'Internship', 'Contract')),
    status TEXT NOT NULL DEFAULT 'Offered' CHECK (status IN ('Offered', 'Accepted', 'Declined', 'Under Review')),
    offer_date DATE NOT NULL DEFAULT CURRENT_DATE,
    academic_year TEXT NOT NULL DEFAULT '2026-27',
    batch TEXT NOT NULL DEFAULT '2022 - 2026',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_placement_offers_student ON public.student_placement_offers(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_offers_dept ON public.student_placement_offers(department);
CREATE INDEX IF NOT EXISTS idx_placement_offers_company ON public.student_placement_offers(company_name);
CREATE INDEX IF NOT EXISTS idx_placement_offers_year ON public.student_placement_offers(academic_year);

-- 2. TABLE: student_internships
CREATE TABLE IF NOT EXISTS public.student_internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    department TEXT NOT NULL,
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    stipend_pm NUMERIC(10, 2) NOT NULL DEFAULT 0,
    duration_months INT NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'Completed' CHECK (status IN ('Ongoing', 'Completed', 'Upcoming')),
    has_ppo BOOLEAN NOT NULL DEFAULT false,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internships_student ON public.student_internships(student_id);
CREATE INDEX IF NOT EXISTS idx_internships_dept ON public.student_internships(department);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.student_placement_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_internships ENABLE ROW LEVEL SECURITY;

-- Placement Offers: Authenticated faculty/admins can view all; students view their own
DROP POLICY IF EXISTS "Offers select policy" ON public.student_placement_offers;
CREATE POLICY "Offers select policy" ON public.student_placement_offers FOR SELECT TO authenticated
USING (
    public.is_faculty() OR
    public.is_admin() OR
    student_id = auth.uid() OR
    roll_no = (SELECT student_id FROM public.profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Offers faculty manage policy" ON public.student_placement_offers;
CREATE POLICY "Offers faculty manage policy" ON public.student_placement_offers FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin())
WITH CHECK (public.is_faculty() OR public.is_admin());

-- Internships: Authenticated faculty/admins view all; students view their own
DROP POLICY IF EXISTS "Internships select policy" ON public.student_internships;
CREATE POLICY "Internships select policy" ON public.student_internships FOR SELECT TO authenticated
USING (
    public.is_faculty() OR
    public.is_admin() OR
    student_id = auth.uid() OR
    roll_no = (SELECT student_id FROM public.profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Internships faculty manage policy" ON public.student_internships;
CREATE POLICY "Internships faculty manage policy" ON public.student_internships FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin())
WITH CHECK (public.is_faculty() OR public.is_admin());
