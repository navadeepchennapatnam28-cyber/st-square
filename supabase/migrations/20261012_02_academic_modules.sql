-- ============================================================================
-- MIGRATION: 20261012_02_academic_modules.sql
-- DESCRIPTION: Academic Records, Attendance, Leaves, LMS, Assignments & Submissions
-- ============================================================================

-- 1. TABLE: courses
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    credits INT NOT NULL DEFAULT 4,
    semester INT NOT NULL DEFAULT 7,
    faculty_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Initial Courses matching existing dashboard telemetry
INSERT INTO public.courses (code, name, credits, semester, faculty_name)
VALUES 
    ('CS601', 'Distributed Systems & Cloud Computing', 4, 7, 'Dr. Vikram Ramanathan'),
    ('CS602', 'Compiler Design & Code Generation', 4, 7, 'Dr. M. Venkat'),
    ('CS605', 'Natural Language Processing', 3, 7, 'Prof. Arvind Subramanian'),
    ('AI604', 'Deep Learning & Computer Vision', 4, 7, 'Prof. Meera Deshmukh'),
    ('PE608', 'Product Engineering & DevOps', 3, 7, 'Prof. Ananya Ghosh')
ON CONFLICT (code) DO NOTHING;

-- 2. TABLE: student_academic_records
CREATE TABLE IF NOT EXISTS public.student_academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester TEXT NOT NULL,
    semester_label TEXT,
    semester_number INT NOT NULL DEFAULT 1,
    sgpa NUMERIC(4, 2) NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL,
    credits_earned INT NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, semester)
);

CREATE INDEX IF NOT EXISTS idx_academic_student_id ON public.student_academic_records(student_id);

-- 3. TABLE: attendance_records
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    faculty_name TEXT,
    attended INT NOT NULL DEFAULT 0,
    total INT NOT NULL DEFAULT 0,
    percentage NUMERIC(5, 2) GENERATED ALWAYS AS (
        CASE WHEN total > 0 THEN ROUND((attended::numeric / total::numeric) * 100, 2) ELSE 0 END
    ) STORED,
    status TEXT NOT NULL DEFAULT 'safe' CHECK (status IN ('safe', 'warning', 'critical')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, subject_code)
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance_records(student_id);

-- 4. TABLE: attendance_leaves
CREATE TABLE IF NOT EXISTS public.attendance_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    leave_date DATE NOT NULL,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leaves_student_id ON public.attendance_leaves(student_id);

-- 5. TABLE: lms_course_activities
CREATE TABLE IF NOT EXISTS public.lms_course_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    completed_modules INT NOT NULL DEFAULT 0,
    total_modules INT NOT NULL DEFAULT 10,
    assignment_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    last_active TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, course_code)
);

CREATE INDEX IF NOT EXISTS idx_lms_student_id ON public.lms_course_activities(student_id);

-- 6. TABLE: assignments
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    faculty_name TEXT NOT NULL,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    total_marks INT NOT NULL DEFAULT 100,
    due_date TIMESTAMPTZ NOT NULL,
    tags TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(course_code, title)
);

-- Seed initial assignments
INSERT INTO public.assignments (course_code, course_name, faculty_name, title, description, total_marks, due_date, tags)
VALUES
    ('CS601', 'Distributed Systems & Cloud Computing', 'Dr. Vikram Ramanathan', 'Distributed Consensus & Raft Protocol Simulation', 'Implement a leader election and log replication module using Python/Go. Ensure heartbeats and split-brain election timeouts are handled gracefully.', 100, now() + interval '6 days', ARRAY['Distributed Systems', 'Python', 'Consensus']),
    ('AI604', 'Deep Learning & Computer Vision', 'Prof. Meera Deshmukh', 'Neural Style Transfer & ResNet Feature Optimization', 'Train a VGG19/ResNet network to transfer artistic textures from impressionist paintings to high-resolution landscape images with Gram matrix loss optimization.', 50, now() + interval '10 days', ARRAY['Deep Learning', 'PyTorch', 'ResNet']),
    ('CS602', 'Compiler Design & Code Generation', 'Dr. M. Venkat', 'B-Tree Indexing Engine for Micro-Databases', 'Build an on-disk B+ tree index structure with concurrency-friendly page latches and node splitting algorithms.', 100, now() + interval '14 days', ARRAY['Compilers', 'Storage Engines', 'C++']),
    ('PE608', 'Product Engineering & DevOps', 'Prof. Ananya Ghosh', 'Multi-Stage Docker CI/CD Pipeline & Kubernetes Ingress', 'Construct an automated deployment pipeline utilizing GitHub Actions, Docker multi-stage builds, and Minikube ingress controllers.', 75, now() - interval '2 days', ARRAY['DevOps', 'Docker', 'Kubernetes']),
    ('CS605', 'Natural Language Processing', 'Prof. Arvind Subramanian', 'Fine-Tuning TinyLlama on Domain Legal QA Datasets', 'Execute parameter-efficient fine-tuning (LoRA) on legal question-answering datasets and evaluate ROUGE scores.', 100, now() - interval '5 days', ARRAY['NLP', 'LLM', 'LoRA'])
ON CONFLICT (course_code, title) DO NOTHING;

-- 7. TABLE: assignment_submissions
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_link TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'late')),
    obtained_marks NUMERIC(5, 2),
    faculty_feedback TEXT,
    submission_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    graded_at TIMESTAMPTZ,
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON public.assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON public.assignment_submissions(student_id);

-- 8. TABLE: engagement_items
CREATE TABLE IF NOT EXISTS public.engagement_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Hackathon', 'Club', 'Workshop', 'Certification', 'Tech Fest')),
    role_or_result TEXT NOT NULL,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    badge TEXT NOT NULL DEFAULT 'Honorable Mention',
    verification_status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (verification_status IN ('Verified', 'Pending Review')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_engagement_student_id ON public.engagement_items(student_id);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_course_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_items ENABLE ROW LEVEL SECURITY;

-- Courses: Authenticated read
DROP POLICY IF EXISTS "Courses read" ON public.courses;
CREATE POLICY "Courses read" ON public.courses FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Courses admin manage" ON public.courses;
CREATE POLICY "Courses admin manage" ON public.courses FOR ALL TO authenticated USING (public.is_admin());

-- Academics: Student read own, Faculty read cohort, Admin all
DROP POLICY IF EXISTS "Academics student read" ON public.student_academic_records;
CREATE POLICY "Academics student read" ON public.student_academic_records FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Academics admin manage" ON public.student_academic_records;
CREATE POLICY "Academics admin manage" ON public.student_academic_records FOR ALL TO authenticated
USING (public.is_admin());

-- Attendance: Student read own, Faculty/Admin read
DROP POLICY IF EXISTS "Attendance student read" ON public.attendance_records;
CREATE POLICY "Attendance student read" ON public.attendance_records FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Attendance manage" ON public.attendance_records;
CREATE POLICY "Attendance manage" ON public.attendance_records FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin());

-- Leaves: Student insert/read own; Faculty update status
DROP POLICY IF EXISTS "Leaves student select" ON public.attendance_leaves;
CREATE POLICY "Leaves student select" ON public.attendance_leaves FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Leaves student insert" ON public.attendance_leaves;
CREATE POLICY "Leaves student insert" ON public.attendance_leaves FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Leaves faculty update" ON public.attendance_leaves;
CREATE POLICY "Leaves faculty update" ON public.attendance_leaves FOR UPDATE TO authenticated
USING (public.is_faculty() OR public.is_admin());

-- LMS: Student read own; Faculty read
DROP POLICY IF EXISTS "LMS student read" ON public.lms_course_activities;
CREATE POLICY "LMS student read" ON public.lms_course_activities FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "LMS admin manage" ON public.lms_course_activities;
CREATE POLICY "LMS admin manage" ON public.lms_course_activities FOR ALL TO authenticated
USING (public.is_admin());

-- Assignments: Authenticated read; Faculty/Admin manage
DROP POLICY IF EXISTS "Assignments read" ON public.assignments;
CREATE POLICY "Assignments read" ON public.assignments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Assignments faculty manage" ON public.assignments;
CREATE POLICY "Assignments faculty manage" ON public.assignments FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin());

-- Submissions: Student insert/select own; Faculty view & grade
DROP POLICY IF EXISTS "Submissions student view" ON public.assignment_submissions;
CREATE POLICY "Submissions student view" ON public.assignment_submissions FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Submissions student insert" ON public.assignment_submissions;
CREATE POLICY "Submissions student insert" ON public.assignment_submissions FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Submissions student update" ON public.assignment_submissions;
CREATE POLICY "Submissions student update" ON public.assignment_submissions FOR UPDATE TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin())
WITH CHECK (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

-- Engagement items
DROP POLICY IF EXISTS "Engagement select" ON public.engagement_items;
CREATE POLICY "Engagement select" ON public.engagement_items FOR SELECT TO authenticated
USING (student_id = auth.uid() OR public.is_faculty() OR public.is_admin());

DROP POLICY IF EXISTS "Engagement insert" ON public.engagement_items;
CREATE POLICY "Engagement insert" ON public.engagement_items FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid() OR public.is_admin());
