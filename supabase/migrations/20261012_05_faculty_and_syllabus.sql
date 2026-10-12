-- ============================================================================
-- MIGRATION: 20261012_05_faculty_and_syllabus.sql
-- DESCRIPTION: Course Syllabus Tracking, Unit Topics & Institutional Announcements
-- ============================================================================

-- 1. TABLE: course_syllabus
CREATE TABLE IF NOT EXISTS public.course_syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    course_code TEXT NOT NULL,
    course_name TEXT NOT NULL,
    unit_number INT NOT NULL,
    unit_title TEXT NOT NULL,
    topics JSONB NOT NULL DEFAULT '[]'::JSONB,
    total_hours INT NOT NULL DEFAULT 12,
    completed_hours INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    completion_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    assigned_faculty_name TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(course_code, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_syllabus_course_code ON public.course_syllabus(course_code);

-- Seed initial syllabus units for core engineering courses
INSERT INTO public.course_syllabus (course_code, course_name, unit_number, unit_title, total_hours, completed_hours, status, completion_pct, assigned_faculty_name, topics)
VALUES
    (
        'CS601',
        'Distributed Systems & Cloud Computing',
        1,
        'Foundations of Distributed Systems & RPC Architecture',
        12,
        12,
        'Completed',
        100.00,
        'Dr. Vikram Ramanathan',
        '[
            {"id": "t-1", "title": "System Models: Synchronous vs Asynchronous", "completed": true, "hours": 3},
            {"id": "t-2", "title": "Remote Procedure Calls (RPC) & gRPC Semantics", "completed": true, "hours": 4},
            {"id": "t-3", "title": "Message-Oriented Middleware & Kafka Architecture", "completed": true, "hours": 5}
        ]'::jsonb
    ),
    (
        'CS601',
        'Distributed Systems & Cloud Computing',
        2,
        'Consensus Protocols, Paxos & Raft Simulation',
        14,
        10,
        'In Progress',
        71.43,
        'Dr. Vikram Ramanathan',
        '[
            {"id": "t-4", "title": "Leader Election & Heartbeat Timers", "completed": true, "hours": 4},
            {"id": "t-5", "title": "Log Replication & Commit Index Guarantees", "completed": true, "hours": 4},
            {"id": "t-6", "title": "Safety Verification & Network Partition Failovers", "completed": true, "hours": 2},
            {"id": "t-7", "title": "Byzantine Fault Tolerance (BFT) Primer", "completed": false, "hours": 4}
        ]'::jsonb
    ),
    (
        'CS601',
        'Distributed Systems & Cloud Computing',
        3,
        'Distributed Storage, Consistency Models & Dynamo Architecture',
        12,
        4,
        'In Progress',
        33.33,
        'Dr. Vikram Ramanathan',
        '[
            {"id": "t-8", "title": "CAP Theorem & PACELC Tradeoffs", "completed": true, "hours": 4},
            {"id": "t-9", "title": "Consistent Hashing & Virtual Nodes", "completed": false, "hours": 4},
            {"id": "t-10", "title": "Vector Clocks & Quorum Reads/Writes", "completed": false, "hours": 4}
        ]'::jsonb
    ),
    (
        'AI604',
        'Deep Learning & Computer Vision',
        1,
        'Deep Neural Architecture & Convolutional Operators',
        12,
        12,
        'Completed',
        100.00,
        'Prof. Meera Deshmukh',
        '[
            {"id": "t-11", "title": "Convolution Math, Stride, Padding & Dilations", "completed": true, "hours": 4},
            {"id": "t-12", "title": "Residual Connections & Highway Networks", "completed": true, "hours": 4},
            {"id": "t-13", "title": "Batch Normalization & LayerNorm Dynamics", "completed": true, "hours": 4}
        ]'::jsonb
    ),
    (
        'AI604',
        'Deep Learning & Computer Vision',
        2,
        'Neural Style Transfer, Feature Extraction & ResNet Optimization',
        14,
        8,
        'In Progress',
        57.14,
        'Prof. Meera Deshmukh',
        '[
            {"id": "t-14", "title": "Gram Matrix Representations & Content Loss", "completed": true, "hours": 4},
            {"id": "t-15", "title": "Pretrained Feature Extractor Backbone Optimization", "completed": true, "hours": 4},
            {"id": "t-16", "title": "Fast Style Transfer via Feedforward Generator Networks", "completed": false, "hours": 6}
        ]'::jsonb
    ),
    (
        'CS605',
        'Natural Language Processing',
        1,
        'Sequence Modeling, Attention Mechanisms & Transformers',
        14,
        14,
        'Completed',
        100.00,
        'Prof. Arvind Subramanian',
        '[
            {"id": "t-17", "title": "Word2Vec, GloVe & Static Embedding Bottlenecks", "completed": true, "hours": 4},
            {"id": "t-18", "title": "Scaled Dot-Product & Multi-Head Self-Attention", "completed": true, "hours": 5},
            {"id": "t-19", "title": "Positional Encodings: Sinusoidal vs RoPE", "completed": true, "hours": 5}
        ]'::jsonb
    )
ON CONFLICT (course_code, unit_number) DO NOTHING;

-- 2. TABLE: announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'faculty',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    course_code TEXT,
    department TEXT NOT NULL DEFAULT 'Computer Science & AI',
    target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'faculty', 'department')),
    priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('Normal', 'High', 'Urgent')),
    pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(title)
);

CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);

-- Seed initial faculty announcements
INSERT INTO public.announcements (author_name, author_role, title, content, course_code, department, target_audience, priority, pinned)
VALUES
    (
        'Dr. Arvind Subramanian',
        'faculty',
        'Mid-Semester Examination Schedule & Lab Hall Ticket Clearance',
        'Mid-term theoretical and practical assessments begin Oct 24. Students must maintain >= 75% attendance in each registered subject to sit for examinations without remediation clearances.',
        'ALL',
        'Computer Science & AI',
        'students',
        'Urgent',
        true
    ),
    (
        'Dr. Vikram Ramanathan',
        'faculty',
        'CS601 Distributed Systems Project Phase 1 Submission Deadline',
        'The simulation module for Raft leader election is due Oct 18. Please push code repositories with full test suites verifying split-brain edge cases.',
        'CS601',
        'Computer Science & AI',
        'students',
        'High',
        false
    ),
    (
        'Prof. Meera Deshmukh',
        'faculty',
        'Industry Guest Lecture: Generative AI in Production Systems',
        'Special guest session on deploying quantized neural models with ONNX Runtime this Friday at 3:30 PM in Auditorium 2.',
        'AI604',
        'Computer Science & AI',
        'all',
        'Normal',
        false
    )
ON CONFLICT (title) DO NOTHING;

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.course_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Course Syllabus: Students & faculty can read; Faculty/Admin can modify
DROP POLICY IF EXISTS "Syllabus read" ON public.course_syllabus;
CREATE POLICY "Syllabus read" ON public.course_syllabus FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Syllabus faculty manage" ON public.course_syllabus;
CREATE POLICY "Syllabus faculty manage" ON public.course_syllabus FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin())
WITH CHECK (public.is_faculty() OR public.is_admin());

-- Announcements: All authenticated users can read; Faculty/Admin can publish & manage
DROP POLICY IF EXISTS "Announcements read" ON public.announcements;
CREATE POLICY "Announcements read" ON public.announcements FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Announcements faculty manage" ON public.announcements;
CREATE POLICY "Announcements faculty manage" ON public.announcements FOR ALL TO authenticated
USING (public.is_faculty() OR public.is_admin())
WITH CHECK (public.is_faculty() OR public.is_admin());
