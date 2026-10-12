import { supabase, isSupabaseConfigured } from './supabaseClient';
import { demoCohortStudents, demoInterventionCases, demoInstitutionalReports } from '../data/demoCohort';
import { CohortStudentItem, InterventionCase, InstitutionalReport } from '../types';

export const facultyService = {
  /**
   * Fetch cohort students, optionally filtered by faculty's assigned department
   */
  async getCohortStudents(department?: string): Promise<CohortStudentItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('profiles').select('*').eq('role', 'student');
        if (department && department !== 'All') {
          query = query.eq('department', department);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((p: any): CohortStudentItem => ({
            id: p.id,
            name: p.full_name || 'Student',
            rollNo: p.student_id || p.id.slice(0, 8),
            department: p.department || 'Computer Science & AI',
            semester: p.semester || 6,
            cgpa: Number(p.cgpa || 8.5),
            attendancePct: Number(p.attendance_pct || 88),
            successScore: Math.round(((Number(p.cgpa || 8.5) / 10) * 50) + ((Number(p.attendance_pct || 88) / 100) * 50)),
            riskLevel: Number(p.attendance_pct || 88) < 75 ? 'High Risk' : Number(p.attendance_pct || 88) < 80 ? 'Moderate' : 'Safe',
            topWeakness: 'Core Algorithms & Complexity Analysis',
            placementStatus: 'Eligible',
            avatar: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          }));
        }
      } catch {
        // Fallback
      }
    }

    return demoCohortStudents;
  },

  /**
   * Fetch intervention cases. Students access only the sanitized view without confidential faculty notes.
   */
  async getInterventions(options?: {
    facultyId?: string;
    isStudent?: boolean;
    studentId?: string;
  }): Promise<InterventionCase[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        if (options?.isStudent) {
          // Use protected view for students
          let query = supabase.from('student_interventions_view').select('*');
          if (options.studentId) query = query.eq('student_id', options.studentId);
          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return data.map((r: any): InterventionCase => ({
              id: r.id,
              studentId: r.student_id,
              studentName: r.student_name,
              department: 'Computer Science & AI',
              area: r.reason,
              riskTrigger: r.reason,
              recommendedAction: r.recommended_action,
              assignedFaculty: 'Assigned Mentor',
              status: r.status,
              priority: r.risk_level as any,
              dateAssigned: new Date(r.created_at).toLocaleDateString(),
            }));
          }
        } else {
          // Faculty / Admin direct table query
          let query = supabase.from('interventions').select('*').order('created_at', { ascending: false });
          if (options?.facultyId) query = query.eq('assigned_faculty_id', options.facultyId);
          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return data.map((r: any): InterventionCase => ({
              id: r.id,
              studentId: r.student_id || r.id,
              studentName: r.student_name,
              department: 'Computer Science & AI',
              area: r.reason,
              riskTrigger: r.reason,
              recommendedAction: r.recommended_action,
              assignedFaculty: 'Course Mentor',
              status: r.status,
              priority: (r.risk_level === 'High Risk' ? 'High' : r.risk_level === 'Moderate' ? 'Medium' : 'Low') as any,
              dateAssigned: new Date(r.created_at).toLocaleDateString(),
            }));
          }
        }
      } catch {
        // Fallback
      }
    }

    return demoInterventionCases;
  },

  /**
   * Create an intervention case with optional confidential notes (visible only to faculty)
   */
  async createIntervention(
    caseData: Omit<InterventionCase, 'id' | 'dateAssigned'>,
    confidentialNotes?: string
  ): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('interventions').insert({
          student_id: caseData.studentId.includes('-') && caseData.studentId.length === 36 ? caseData.studentId : null,
          student_name: caseData.studentName,
          roll_no: caseData.studentId,
          risk_level: caseData.priority === 'High' ? 'High Risk' : caseData.priority === 'Medium' ? 'Moderate' : 'Safe',
          reason: caseData.area || caseData.riskTrigger,
          recommended_action: caseData.recommendedAction,
          status: caseData.status,
          confidential_faculty_notes: confidentialNotes || null,
        });

        await this.recordAuditLog('create_intervention', 'intervention', undefined, {
          studentName: caseData.studentName,
          area: caseData.area,
        });

        return !error;
      } catch {
        return false;
      }
    }
    return true;
  },

  /**
   * Resolve an intervention case
   */
  async resolveIntervention(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('interventions').update({ status: 'Resolved' }).eq('id', id);
        await this.recordAuditLog('resolve_intervention', 'intervention', id);
        return !error;
      } catch {
        return false;
      }
    }
    return true;
  },

  /**
   * Fetch institutional reports
   */
  async getReports(): Promise<InstitutionalReport[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('institutional_reports').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((r: any): InstitutionalReport => ({
            id: r.id,
            title: r.title,
            category: r.report_type as any,
            generatedDate: new Date(r.created_at).toLocaleDateString(),
            period: r.academic_year || 'AY 2026-27',
            format: 'PDF',
            size: '2.4 MB',
            downloads: 14,
            description: `Automated analytical rollup for ${r.title}`,
          }));
        }
      } catch {
        // Fallback
      }
    }
    return demoInstitutionalReports;
  },

  /**
   * Log administrative audit action
   */
  async recordAuditLog(
    action: string,
    resourceType: string,
    resourceId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('audit_logs').insert({
          user_id: user?.id || null,
          action,
          resource_type: resourceType,
          resource_id: resourceId || null,
          details: metadata || {},
        });
      } catch {
        // Ignored
      }
    }
  },

  /**
   * Get Faculty Profile information
   */
  async getFacultyProfile(email?: string): Promise<any> {
    const defaultProfile = {
      id: 'fac-01',
      name: 'Dr. Arvind Subramanian',
      email: email || 'dr.arvind@faculty.st2.edu',
      role: 'faculty',
      department: 'Computer Science & AI',
      designation: 'Professor & Head of Academic Council',
      cabin: 'Academic Block 3, Suite 402',
      officeHours: 'Mon, Wed, Fri • 02:00 PM - 04:30 PM',
      assignedCourses: ['CS601', 'AI604', 'CS605'],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (profile && (profile.role === 'faculty' || profile.role === 'admin')) {
            return {
              ...defaultProfile,
              id: profile.id,
              name: profile.name || defaultProfile.name,
              email: profile.email || defaultProfile.email,
              department: profile.department_name || defaultProfile.department,
              role: profile.role,
              avatarUrl: profile.avatar_url || defaultProfile.avatarUrl,
            };
          }
        }
      } catch {
        // Fallback
      }
    }

    return defaultProfile;
  },

  /**
   * Fetch assigned courses for faculty
   */
  async getAssignedCourses(): Promise<any[]> {
    const defaultCourses = [
      {
        id: 'c-1',
        code: 'CS601',
        name: 'Distributed Systems & Cloud Computing',
        credits: 4,
        semester: 7,
        facultyName: 'Dr. Vikram Ramanathan',
        enrolledStudentsCount: 68,
        syllabusCompletionPct: 68.2,
        avgAttendancePct: 89.4,
      },
      {
        id: 'c-2',
        code: 'AI604',
        name: 'Deep Learning & Computer Vision',
        credits: 4,
        semester: 7,
        facultyName: 'Prof. Meera Deshmukh',
        enrolledStudentsCount: 72,
        syllabusCompletionPct: 78.5,
        avgAttendancePct: 91.2,
      },
      {
        id: 'c-3',
        code: 'CS605',
        name: 'Natural Language Processing',
        credits: 3,
        semester: 7,
        facultyName: 'Prof. Arvind Subramanian',
        enrolledStudentsCount: 64,
        syllabusCompletionPct: 84.0,
        avgAttendancePct: 84.8,
      },
    ];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('courses').select('*').order('code');
        if (!error && data && data.length > 0) {
          return data.map((c: any) => ({
            id: c.id,
            code: c.code,
            name: c.name,
            credits: c.credits || 4,
            semester: c.semester || 7,
            facultyName: c.faculty_name || 'Dr. Arvind Subramanian',
            enrolledStudentsCount: 68,
            syllabusCompletionPct: 75.0,
            avgAttendancePct: 88.5,
          }));
        }
      } catch {
        // Fallback
      }
    }

    return defaultCourses;
  },

  /**
   * Fetch syllabus units and topics
   */
  async getSyllabus(courseCode?: string): Promise<any[]> {
    const initialSyllabus = [
      {
        id: 'syl-1',
        courseCode: 'CS601',
        courseName: 'Distributed Systems & Cloud Computing',
        unitNumber: 1,
        unitTitle: 'Foundations of Distributed Systems & RPC Architecture',
        totalHours: 12,
        completedHours: 12,
        status: 'Completed',
        completionPct: 100,
        topics: [
          { id: 't-1', title: 'System Models: Synchronous vs Asynchronous', completed: true, hours: 3 },
          { id: 't-2', title: 'Remote Procedure Calls (RPC) & gRPC Semantics', completed: true, hours: 4 },
          { id: 't-3', title: 'Message-Oriented Middleware & Kafka Architecture', completed: true, hours: 5 },
        ],
      },
      {
        id: 'syl-2',
        courseCode: 'CS601',
        courseName: 'Distributed Systems & Cloud Computing',
        unitNumber: 2,
        unitTitle: 'Consensus Protocols, Paxos & Raft Simulation',
        totalHours: 14,
        completedHours: 10,
        status: 'In Progress',
        completionPct: 71.4,
        topics: [
          { id: 't-4', title: 'Leader Election & Heartbeat Timers', completed: true, hours: 4 },
          { id: 't-5', title: 'Log Replication & Commit Index Guarantees', completed: true, hours: 4 },
          { id: 't-6', title: 'Safety Verification & Network Partition Failovers', completed: true, hours: 2 },
          { id: 't-7', title: 'Byzantine Fault Tolerance (BFT) Primer', completed: false, hours: 4 },
        ],
      },
      {
        id: 'syl-3',
        courseCode: 'CS601',
        courseName: 'Distributed Systems & Cloud Computing',
        unitNumber: 3,
        unitTitle: 'Distributed Storage, Consistency Models & Dynamo Architecture',
        totalHours: 12,
        completedHours: 4,
        status: 'In Progress',
        completionPct: 33.3,
        topics: [
          { id: 't-8', title: 'CAP Theorem & PACELC Tradeoffs', completed: true, hours: 4 },
          { id: 't-9', title: 'Consistent Hashing & Virtual Nodes', completed: false, hours: 4 },
          { id: 't-10', title: 'Vector Clocks & Quorum Reads/Writes', completed: false, hours: 4 },
        ],
      },
      {
        id: 'syl-4',
        courseCode: 'AI604',
        courseName: 'Deep Learning & Computer Vision',
        unitNumber: 1,
        unitTitle: 'Deep Neural Architecture & Convolutional Operators',
        totalHours: 12,
        completedHours: 12,
        status: 'Completed',
        completionPct: 100,
        topics: [
          { id: 't-11', title: 'Convolution Math, Stride, Padding & Dilations', completed: true, hours: 4 },
          { id: 't-12', title: 'Residual Connections & Highway Networks', completed: true, hours: 4 },
          { id: 't-13', title: 'Batch Normalization & LayerNorm Dynamics', completed: true, hours: 4 },
        ],
      },
      {
        id: 'syl-5',
        courseCode: 'AI604',
        courseName: 'Deep Learning & Computer Vision',
        unitNumber: 2,
        unitTitle: 'Neural Style Transfer, Feature Extraction & ResNet Optimization',
        totalHours: 14,
        completedHours: 8,
        status: 'In Progress',
        completionPct: 57.1,
        topics: [
          { id: 't-14', title: 'Gram Matrix Representations & Content Loss', completed: true, hours: 4 },
          { id: 't-15', title: 'Pretrained Feature Extractor Backbone Optimization', completed: true, hours: 4 },
          { id: 't-16', title: 'Fast Style Transfer via Feedforward Generator Networks', completed: false, hours: 6 },
        ],
      },
    ];

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('course_syllabus').select('*').order('unit_number');
        if (courseCode && courseCode !== 'ALL') {
          query = query.eq('course_code', courseCode);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            courseCode: s.course_code,
            courseName: s.course_name,
            unitNumber: s.unit_number,
            unitTitle: s.unit_title,
            totalHours: s.total_hours,
            completedHours: s.completed_hours,
            status: s.status,
            completionPct: Number(s.completion_pct),
            topics: s.topics || [],
          }));
        }
      } catch {
        // Fallback
      }
    }

    const saved = localStorage.getItem('st2_faculty_syllabus');
    const list = saved ? JSON.parse(saved) : initialSyllabus;
    return courseCode && courseCode !== 'ALL' ? list.filter((s: any) => s.courseCode === courseCode) : list;
  },

  /**
   * Toggle topic completion in syllabus
   */
  async updateTopicStatus(unitId: string, topicId: string, completed: boolean): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: unit } = await supabase.from('course_syllabus').select('*').eq('id', unitId).single();
        if (unit) {
          const updatedTopics = (unit.topics || []).map((t: any) =>
            t.id === topicId ? { ...t, completed } : t
          );
          const completedCount = updatedTopics.filter((t: any) => t.completed).length;
          const completedHours = updatedTopics.reduce((acc: number, t: any) => acc + (t.completed ? t.hours || 3 : 0), 0);
          const completionPct = Math.round((completedCount / updatedTopics.length) * 100);
          const status = completionPct === 100 ? 'Completed' : completionPct > 0 ? 'In Progress' : 'Not Started';

          await supabase.from('course_syllabus').update({
            topics: updatedTopics,
            completed_hours: completedHours,
            completion_pct: completionPct,
            status,
            updated_at: new Date().toISOString(),
          }).eq('id', unitId);

          return true;
        }
      } catch {
        // Fallback
      }
    }

    // Local storage fallback
    const all = await this.getSyllabus('ALL');
    const updated = all.map((unit: any) => {
      if (unit.id === unitId) {
        const updatedTopics = (unit.topics || []).map((t: any) =>
          t.id === topicId ? { ...t, completed } : t
        );
        const completedCount = updatedTopics.filter((t: any) => t.completed).length;
        const completionPct = Math.round((completedCount / (updatedTopics.length || 1)) * 100);
        return {
          ...unit,
          topics: updatedTopics,
          completionPct,
          status: completionPct === 100 ? 'Completed' : 'In Progress',
        };
      }
      return unit;
    });
    localStorage.setItem('st2_faculty_syllabus', JSON.stringify(updated));
    return true;
  },

  /**
   * Fetch announcements
   */
  async getAnnouncements(): Promise<any[]> {
    const defaultAnnouncements = [
      {
        id: 'ann-1',
        title: 'Mid-Semester Examination Schedule & Lab Hall Ticket Clearance',
        content: 'Mid-term assessments begin Oct 24. Students must maintain >= 75% attendance in each registered subject to sit for examinations without remediation clearances.',
        authorName: 'Dr. Arvind Subramanian',
        authorRole: 'Head of Academic Council',
        department: 'Computer Science & AI',
        targetAudience: 'students',
        priority: 'Urgent',
        pinned: true,
        createdAt: 'Oct 11, 2026',
      },
      {
        id: 'ann-2',
        title: 'CS601 Distributed Systems Project Phase 1 Submission Deadline',
        content: 'The simulation module for Raft leader election is due Oct 18. Please push code repositories with full test suites verifying split-brain edge cases.',
        authorName: 'Dr. Vikram Ramanathan',
        authorRole: 'Course Faculty',
        department: 'Computer Science & AI',
        targetAudience: 'students',
        priority: 'High',
        pinned: false,
        createdAt: 'Oct 09, 2026',
      },
      {
        id: 'ann-3',
        title: 'Industry Guest Lecture: Generative AI in Production Systems',
        content: 'Special guest session on deploying quantized neural models with ONNX Runtime this Friday at 3:30 PM in Auditorium 2.',
        authorName: 'Prof. Meera Deshmukh',
        authorRole: 'Associate Professor',
        department: 'Computer Science & AI',
        targetAudience: 'all',
        priority: 'Normal',
        pinned: false,
        createdAt: 'Oct 08, 2026',
      },
    ];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            title: a.title,
            content: a.content,
            authorName: a.author_name,
            authorRole: a.author_role,
            department: a.department,
            targetAudience: a.target_audience,
            priority: a.priority,
            pinned: a.pinned,
            createdAt: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }));
        }
      } catch {
        // Fallback
      }
    }

    const saved = localStorage.getItem('st2_faculty_announcements');
    return saved ? JSON.parse(saved) : defaultAnnouncements;
  },

  /**
   * Post a new announcement
   */
  async createAnnouncement(announcement: {
    title: string;
    content: string;
    targetAudience: 'all' | 'students' | 'faculty' | 'department';
    priority: 'Normal' | 'High' | 'Urgent';
  }): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('announcements').insert({
          title: announcement.title,
          content: announcement.content,
          author_name: 'Dr. Arvind Subramanian',
          author_role: 'faculty',
          department: 'Computer Science & AI',
          target_audience: announcement.targetAudience,
          priority: announcement.priority,
          pinned: announcement.priority === 'Urgent',
        });
        if (!error) return true;
      } catch {
        // Fallback
      }
    }

    const current = await this.getAnnouncements();
    const newEntry = {
      id: `ann-${Date.now()}`,
      title: announcement.title,
      content: announcement.content,
      authorName: 'Dr. Arvind Subramanian',
      authorRole: 'faculty',
      department: 'Computer Science & AI',
      targetAudience: announcement.targetAudience,
      priority: announcement.priority,
      pinned: announcement.priority === 'Urgent',
      createdAt: 'Just now',
    };
    localStorage.setItem('st2_faculty_announcements', JSON.stringify([newEntry, ...current]));
    return true;
  },

  /**
   * Record batch class attendance
   */
  async recordAttendance(records: {
    studentId: string;
    studentName: string;
    subjectCode: string;
    subjectName: string;
    attended: boolean;
  }[]): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        for (const r of records) {
          const { data: existing } = await supabase
            .from('attendance_records')
            .select('*')
            .eq('student_id', r.studentId)
            .eq('subject_code', r.subjectCode)
            .maybeSingle();

          if (existing) {
            const newTotal = (existing.total || 0) + 1;
            const newAttended = (existing.attended || 0) + (r.attended ? 1 : 0);
            await supabase
              .from('attendance_records')
              .update({
                total: newTotal,
                attended: newAttended,
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);
          } else {
            await supabase.from('attendance_records').insert({
              student_id: r.studentId,
              subject_code: r.subjectCode,
              subject_name: r.subjectName,
              faculty_name: 'Dr. Arvind Subramanian',
              attended: r.attended ? 1 : 0,
              total: 1,
            });
          }
        }
        return true;
      } catch {
        // Fallback
      }
    }
    return true;
  },

  /**
   * Create an assignment from faculty desk
   */
  async createAssignment(data: {
    courseCode: string;
    courseName: string;
    title: string;
    description: string;
    totalMarks: number;
    dueDate: string;
    tags: string[];
  }): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('assignments').insert({
          course_code: data.courseCode,
          course_name: data.courseName,
          faculty_name: 'Dr. Arvind Subramanian',
          title: data.title,
          description: data.description,
          total_marks: data.totalMarks,
          due_date: new Date(data.dueDate).toISOString(),
          tags: data.tags,
        });
        if (!error) return true;
      } catch {
        // Fallback
      }
    }
    return true;
  },

  /**
   * Fetch submissions for grading
   */
  async getAssignmentSubmissions(assignmentId?: string): Promise<any[]> {
    const defaultSubmissions = [
      {
        id: 'sub-1',
        assignmentId: 'asg-01',
        studentId: 'st-01',
        studentName: 'Aarav Sharma',
        rollNo: 'ST-2024-8842',
        submissionLink: 'https://github.com/aarav-sharma/raft-consensus-sim',
        notes: 'Implemented leader election, RPC log sync, and heartbeats with Go channels.',
        status: 'submitted',
        obtainedMarks: null,
        totalMarks: 100,
        submissionDate: 'Oct 12, 2026 • 09:15 PM',
        facultyFeedback: '',
      },
      {
        id: 'sub-2',
        assignmentId: 'asg-01',
        studentId: 'st-02',
        studentName: 'Diya Patel',
        rollNo: 'ST-2024-8819',
        submissionLink: 'https://github.com/diya-patel/distributed-raft',
        notes: 'Includes full unit tests for partition healing and term counter increments.',
        status: 'graded',
        obtainedMarks: 98,
        totalMarks: 100,
        submissionDate: 'Oct 11, 2026 • 04:30 PM',
        facultyFeedback: 'Flawless term increment handling and benchmark suite. Exceptional work!',
      },
      {
        id: 'sub-3',
        assignmentId: 'asg-01',
        studentId: 'st-03',
        studentName: 'Rohan Deshmukh',
        rollNo: 'ST-2024-8833',
        submissionLink: 'https://github.com/rohan-deshmukh/raft-go',
        notes: 'Basic heartbeat works; log compaction pending.',
        status: 'submitted',
        obtainedMarks: null,
        totalMarks: 100,
        submissionDate: 'Oct 12, 2026 • 11:42 PM',
        facultyFeedback: '',
      },
    ];

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('assignment_submissions').select('*, profiles:student_id(name, student_id)');
        if (assignmentId) query = query.eq('assignment_id', assignmentId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            assignmentId: s.assignment_id,
            studentId: s.student_id,
            studentName: s.profiles?.name || 'Student Scholar',
            rollNo: s.profiles?.student_id || s.student_id?.slice(0, 8),
            submissionLink: s.submission_link,
            notes: s.notes,
            status: s.status,
            obtainedMarks: s.obtained_marks,
            totalMarks: 100,
            submissionDate: new Date(s.submission_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            facultyFeedback: s.faculty_feedback,
          }));
        }
      } catch {
        // Fallback
      }
    }

    return defaultSubmissions;
  },

  /**
   * Grade a submission
   */
  async gradeSubmission(submissionId: string, marks: number, feedback: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('assignment_submissions')
          .update({
            obtained_marks: marks,
            faculty_feedback: feedback,
            status: 'graded',
            graded_at: new Date().toISOString(),
          })
          .eq('id', submissionId);
        if (!error) return true;
      } catch {
        // Fallback
      }
    }
    return true;
  },
};
