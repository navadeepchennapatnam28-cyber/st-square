-- ============================================================================
-- MIGRATION: 20261012_03_career_and_coding.sql
-- DESCRIPTION: Coding Problems, Submissions, Projects, Milestones & Placement Drives
-- ============================================================================

-- 1. TABLE: coding_problems
CREATE TABLE IF NOT EXISTS public.coding_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    topic TEXT NOT NULL,
    acceptance_rate TEXT NOT NULL DEFAULT '68.4%',
    description TEXT NOT NULL,
    constraints TEXT[] DEFAULT '{}'::TEXT[],
    sample_cases JSONB NOT NULL DEFAULT '[]'::JSONB,
    hints TEXT[] DEFAULT '{}'::TEXT[],
    approaches JSONB NOT NULL DEFAULT '[]'::JSONB,
    starter_code JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed initial coding problem: Maximum Subarray (Kadane's Algorithm)
INSERT INTO public.coding_problems (
    slug, title, difficulty, topic, acceptance_rate, description, constraints, sample_cases, hints, starter_code
) VALUES (
    'maximum-subarray-sum',
    'Maximum Subarray (Kadane’s Algorithm)',
    'Medium',
    'Arrays & Dynamic Programming',
    '64.2%',
    'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
    ARRAY['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    '[{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum 6."}, {"input": "nums = [1]", "output": "1"}, {"input": "nums = [5,4,-1,7,8]", "output": "23"}]'::jsonb,
    ARRAY['Think about Kadane’s algorithm: at each index, you decide whether to extend the previous subarray or start fresh.', 'Keep track of current_max and global_max in O(1) space.'],
    '{"python": "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        # Write Kadanes algorithm here\n        pass", "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Implement solution\n        return 0;\n    }\n}", "cpp": "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Implement solution\n        return 0;\n    }\n};"}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Seed Two Sum
INSERT INTO public.coding_problems (
    slug, title, difficulty, topic, acceptance_rate, description, constraints, sample_cases, hints, starter_code
) VALUES (
    'two-sum-target',
    'Two Sum (Optimal Hash Map)',
    'Easy',
    'Hash Map & Arrays',
    '72.1%',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume exactly one solution exists.',
    ARRAY['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}, {"input": "nums = [3,2,4], target = 6", "output": "[1,2]"}]'::jsonb,
    ARRAY['Store complement (target - num) in a hash map for O(1) lookup.'],
    '{"python": "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass", "java": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}", "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};"}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- 2. TABLE: coding_submissions
CREATE TABLE IF NOT EXISTS public.coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES public.coding_problems(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Accepted', 'Wrong Answer', 'Compile Error', 'Time Limit Exceeded')),
    runtime_ms INT NOT NULL DEFAULT 42,
    memory_mb NUMERIC(5, 2) NOT NULL DEFAULT 14.8,
    passed_tests INT NOT NULL DEFAULT 0,
    total_tests INT NOT NULL DEFAULT 0,
    output_log TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coding_sub_student ON public.coding_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_coding_sub_problem ON public.coding_submissions(problem_id);

-- 3. TABLE: student_projects
CREATE TABLE IF NOT EXISTS public.student_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    category TEXT NOT NULL CHECK (category IN ('Full Stack', 'AI & ML', 'IoT / Mobile', 'System & Cloud')),
    technology_stack TEXT[] DEFAULT '{}'::TEXT[],
    skills_learned TEXT[] DEFAULT '{}'::TEXT[],
    estimated_duration TEXT NOT NULL DEFAULT '3-4 Weeks',
    progress_percentage INT NOT NULL DEFAULT 0,
    saved BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    github_repo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_student_id ON public.student_projects(student_id);

-- 4. TABLE: project_milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON public.project_milestones(project_id);

-- 5. TABLE: placement_drives
CREATE TABLE IF NOT EXISTS public.placement_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    package_lpa NUMERIC(5, 2) NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 7.5,
    min_attendance NUMERIC(5, 2) NOT NULL DEFAULT 75.0,
    drive_date DATE NOT NULL,
    eligibility_criteria TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(company_name, role)
);

-- Seed initial placement drives
INSERT INTO public.placement_drives (company_name, role, package_lpa, min_cgpa, min_attendance, drive_date, eligibility_criteria)
VALUES
    ('Google', 'Associate Software Engineer (L3)', 32.50, 8.50, 75.00, CURRENT_DATE + 38, 'Target CGPA 8.5+ • 85%+ Coding percentile'),
    ('Microsoft', 'Software Development Engineer I', 28.00, 8.00, 75.00, CURRENT_DATE + 45, 'Eligible • Resume review cleared'),
    ('Amazon', 'SDE-1 (AWS Cloud Infrastructure)', 26.50, 7.50, 75.00, CURRENT_DATE + 55, 'Eligible • Online Assessment pending'),
    ('Deloitte', 'Analyst - AI & Analytics Practice', 14.00, 7.00, 75.00, CURRENT_DATE + 20, 'Eligible • Direct interview invite')
ON CONFLICT (company_name, role) DO NOTHING;

-- 6. TABLE: placement_profiles
CREATE TABLE IF NOT EXISTS public.placement_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    readiness_score INT NOT NULL DEFAULT 82 CHECK (readiness_score BETWEEN 0 AND 100),
    aptitude_score INT NOT NULL DEFAULT 88,
    coding_score INT NOT NULL DEFAULT 78,
    communication_score INT NOT NULL DEFAULT 84,
    resume_score INT NOT NULL DEFAULT 91,
    target_role TEXT NOT NULL DEFAULT 'Software Engineer / Full Stack',
    mock_interviews_completed INT NOT NULL DEFAULT 3,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id)
);

CREATE INDEX IF NOT EXISTS idx_placement_student_id ON public.placement_profiles(student_id);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_profiles ENABLE ROW LEVEL SECURITY;

-- Coding Problems: Authenticated read
DROP POLICY IF EXISTS "Problems read" ON public.coding_problems;
CREATE POLICY "Problems read" ON public.coding_problems FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Problems admin manage" ON public.coding_problems;
CREATE POLICY "Problems admin manage" ON public.coding_problems FOR ALL TO authenticated USING (public.is_admin());

-- Coding Submissions: Student insert/read own; Faculty/Admin read
DROP POLICY IF EXISTS "Submissions student view" ON public.coding_submissions;
CREATE POLICY "Submissions student view" ON public.coding_submissions FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Submissions student insert" ON public.coding_submissions;
CREATE POLICY "Submissions student insert" ON public.coding_submissions FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() OR public.is_admin());

-- Student Projects: Student full control; Faculty view cohort
DROP POLICY IF EXISTS "Projects student view" ON public.student_projects;
CREATE POLICY "Projects student view" ON public.student_projects FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Projects student manage" ON public.student_projects;
CREATE POLICY "Projects student manage" ON public.student_projects FOR ALL TO authenticated
USING (student_id = auth.uid() OR public.is_admin())
WITH CHECK (student_id = auth.uid() OR public.is_admin());

-- Milestones: Access controlled via project ownership
DROP POLICY IF EXISTS "Milestones select" ON public.project_milestones;
CREATE POLICY "Milestones select" ON public.project_milestones FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.student_projects
        WHERE student_projects.id = project_milestones.project_id
        AND (student_projects.student_id = auth.uid() OR public.is_faculty() OR public.is_admin())
    )
);

DROP POLICY IF EXISTS "Milestones manage" ON public.project_milestones;
CREATE POLICY "Milestones manage" ON public.project_milestones FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.student_projects
        WHERE student_projects.id = project_milestones.project_id
        AND (student_projects.student_id = auth.uid() OR public.is_admin())
    )
);

-- Placement Drives: Authenticated read
DROP POLICY IF EXISTS "Placement drives read" ON public.placement_drives;
CREATE POLICY "Placement drives read" ON public.placement_drives FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Placement drives admin manage" ON public.placement_drives;
CREATE POLICY "Placement drives admin manage" ON public.placement_drives FOR ALL TO authenticated USING (public.is_admin());

-- Placement Profiles: Student read/update own; Faculty/Admin read
DROP POLICY IF EXISTS "Placement profile select" ON public.placement_profiles;
CREATE POLICY "Placement profile select" ON public.placement_profiles FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Placement profile update" ON public.placement_profiles;
CREATE POLICY "Placement profile update" ON public.placement_profiles FOR ALL TO authenticated
USING (student_id = auth.uid() OR public.is_admin());
