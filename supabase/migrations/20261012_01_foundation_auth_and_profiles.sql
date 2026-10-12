-- ============================================================================
-- MIGRATION: 20261012_01_foundation_auth_and_profiles.sql
-- DESCRIPTION: Departments, User Profiles, Auth Provisioning Trigger & RLS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TABLE: departments
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    head_of_department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial departments
INSERT INTO public.departments (code, name, head_of_department)
VALUES 
    ('CSE', 'Computer Science & AI', 'Dr. Arvind Subramanian'),
    ('IT', 'Information Technology', 'Prof. Meera Deshmukh'),
    ('DS', 'Data Science & Analytics', 'Dr. Vikram Ramanathan'),
    ('ECE', 'Electronics & Computing', 'Dr. Ramesh Sundaram')
ON CONFLICT (code) DO NOTHING;

-- 2. TABLE: profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    student_id TEXT UNIQUE, -- Institutional ID (e.g. STU-2024-CS082)
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT DEFAULT 'Computer Science & AI',
    program TEXT DEFAULT 'B.Tech Computer Science & AI',
    batch TEXT DEFAULT '2022 - 2026',
    current_semester INT DEFAULT 7,
    cgpa NUMERIC(4, 2) DEFAULT 8.84,
    attendance_pct NUMERIC(5, 2) DEFAULT 89.4,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON public.profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_profiles_department_id ON public.profiles(department_id);

-- 3. TRIGGER FOR UPDATED_AT & ROLE IMMUTABILITY
CREATE OR REPLACE FUNCTION public.handle_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    -- Guard: Only service_role or verified admins can modify user roles
    IF (NEW.role IS DISTINCT FROM OLD.role) THEN
        IF NOT (
            auth.jwt() ->> 'role' = 'service_role' OR
            (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
            (auth.jwt() ->> 'email' LIKE '%@admin.st2.edu') OR
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        ) THEN
            NEW.role := OLD.role;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_profiles_updated_at();

-- 4. SECURITY & ROLE HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Check app_metadata first (set by admin)
    user_role := auth.jwt() -> 'app_metadata' ->> 'role';
    IF user_role IS NOT NULL THEN
        RETURN user_role;
    END IF;

    -- Query profiles table
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN COALESCE(user_role, 'student');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.jwt() ->> 'role' = 'service_role' OR
        public.get_auth_role() = 'admin' OR
        auth.jwt() ->> 'email' LIKE '%@admin.st2.edu'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        public.is_admin() OR
        public.get_auth_role() = 'faculty' OR
        auth.jwt() ->> 'email' LIKE '%@faculty.st2.edu'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 5. AUTO-PROVISION PROFILE ON AUTH.USERS REGISTRATION
-- Note: New public self-registrations ALWAYS receive the 'student' role.
-- Faculty and admin roles must be explicitly provisioned by administrators.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    dept_id UUID;
    dept_name TEXT;
    roll_no TEXT;
    user_full_name TEXT;
BEGIN
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    dept_name := COALESCE(
        NEW.raw_user_meta_data->>'department',
        'Computer Science & AI'
    );

    SELECT id INTO dept_id FROM public.departments WHERE name = dept_name LIMIT 1;
    IF dept_id IS NULL THEN
        SELECT id, name INTO dept_id, dept_name FROM public.departments LIMIT 1;
    END IF;

    roll_no := COALESCE(
        NEW.raw_user_meta_data->>'student_id',
        'STU-' || to_char(now(), 'YYYY') || '-' || upper(substring(NEW.id::text from 1 for 6))
    );

    INSERT INTO public.profiles (
        id,
        role,
        name,
        email,
        student_id,
        department_id,
        department_name,
        program,
        batch,
        current_semester,
        avatar_url
    ) VALUES (
        NEW.id,
        'student', -- Enforce student role for self-registration
        user_full_name,
        NEW.email,
        roll_no,
        dept_id,
        dept_name,
        COALESCE(NEW.raw_user_meta_data->>'program', 'B.Tech Computer Science & AI'),
        COALESCE(NEW.raw_user_meta_data->>'batch', '2022 - 2026'),
        COALESCE((NEW.raw_user_meta_data->>'semester')::INT, 7),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
        )
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updated_at = now();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Departments RLS
DROP POLICY IF EXISTS "Departments are readable by all authenticated users" ON public.departments;
CREATE POLICY "Departments are readable by all authenticated users"
ON public.departments FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can manage departments" ON public.departments;
CREATE POLICY "Admins can manage departments"
ON public.departments FOR ALL
TO authenticated
USING (public.is_admin());

-- Profiles RLS
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (
    auth.uid() = id OR
    public.is_faculty() OR
    public.is_admin()
);

DROP POLICY IF EXISTS "Users can update own basic profile details" ON public.profiles;
CREATE POLICY "Users can update own basic profile details"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (
    auth.uid() = id OR public.is_admin()
);

DROP POLICY IF EXISTS "Admins can insert or delete profiles" ON public.profiles;
CREATE POLICY "Admins can insert or delete profiles"
ON public.profiles FOR ALL
TO authenticated
USING (public.is_admin());
