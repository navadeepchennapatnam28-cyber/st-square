import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { facultyService } from '../services/facultyService';
import {
  Users,
  BookOpen,
  Layers,
  CalendarCheck,
  Bell,
  ShieldAlert,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Check,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  Send,
  UserCheck,
  Briefcase,
  SlidersHorizontal,
} from 'lucide-react';
import { FacultyOverviewCockpit } from '../components/faculty/FacultyOverviewCockpit';
import { PlacementAnalyticsView } from '../components/faculty/PlacementAnalyticsView';
import { AcademicPerformanceView } from '../components/faculty/AcademicPerformanceView';

export const FacultyDashboardPage: React.FC = () => {
  const { showToast, logout } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // State Management
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [syllabus, setSyllabus] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('ALL');

  // Modals
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [activeStudent, setActiveStudent] = useState<any>(null);

  // Form states
  const [newAssignment, setNewAssignment] = useState({
    courseCode: 'CS601',
    courseName: 'Distributed Systems & Cloud Computing',
    title: '',
    description: '',
    totalMarks: 100,
    dueDate: '',
    tags: 'Distributed Systems, Python',
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    targetAudience: 'students' as 'all' | 'students' | 'faculty' | 'department',
    priority: 'Normal' as 'Normal' | 'High' | 'Urgent',
  });

  const [gradeInput, setGradeInput] = useState({ marks: 90, feedback: '' });
  const [interventionInput, setInterventionInput] = useState({ reason: '', confidentialNotes: '', action: 'Mandatory 1-on-1 counseling session' });

  // Attendance ledger state
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceSubject, setAttendanceSubject] = useState<string>('CS601');
  const [attendanceRoster, setAttendanceRoster] = useState<Record<string, boolean>>({});

  // Filters for student tab
  const [studentSearch, setStudentSearch] = useState('');
  const [studentRiskFilter, setStudentRiskFilter] = useState('All');

  // Load initial backend telemetry
  useEffect(() => {
    let isMounted = true;

    facultyService.getFacultyProfile().then((p) => {
      if (isMounted) setProfile(p);
    });

    facultyService.getAssignedCourses().then((c) => {
      if (isMounted) setCourses(c);
    });

    facultyService.getSyllabus().then((s) => {
      if (isMounted) setSyllabus(s);
    });

    facultyService.getAnnouncements().then((a) => {
      if (isMounted) setAnnouncements(a);
    });

    facultyService.getCohortStudents().then((st) => {
      if (isMounted) {
        setStudents(st);
        const roster: Record<string, boolean> = {};
        st.forEach((s: any) => {
          roster[s.id] = true; // default present
        });
        setAttendanceRoster(roster);
      }
    });

    facultyService.getAssignmentSubmissions().then((sub) => {
      if (isMounted) setSubmissions(sub);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered syllabus
  const filteredSyllabus = useMemo(() => {
    if (selectedCourseCode === 'ALL') return syllabus;
    return syllabus.filter((s) => s.courseCode === selectedCourseCode);
  }, [syllabus, selectedCourseCode]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(studentSearch.toLowerCase());
      const matchRisk = studentRiskFilter === 'All' || s.riskLevel === studentRiskFilter;
      return matchSearch && matchRisk;
    });
  }, [students, studentSearch, studentRiskFilter]);

  // Handlers
  const handleToggleTopic = async (unitId: string, topicId: string, currentStatus: boolean) => {
    const success = await facultyService.updateTopicStatus(unitId, topicId, !currentStatus);
    if (success) {
      const refreshed = await facultyService.getSyllabus(selectedCourseCode);
      setSyllabus(refreshed);
      showToast('Syllabus Updated', 'Topic coverage status saved successfully.', 'success');
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate) {
      showToast('Validation Error', 'Please complete title and deadline.', 'error');
      return;
    }

    const success = await facultyService.createAssignment({
      ...newAssignment,
      tags: newAssignment.tags.split(',').map((t) => t.trim()),
    });

    if (success) {
      setAssignmentModalOpen(false);
      setNewAssignment({
        courseCode: 'CS601',
        courseName: 'Distributed Systems & Cloud Computing',
        title: '',
        description: '',
        totalMarks: 100,
        dueDate: '',
        tags: 'Distributed Systems, Python',
      });
      showToast('Assignment Deployed', 'New assignment published to student portal.', 'success');
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) {
      showToast('Validation Error', 'Title and announcement message required.', 'error');
      return;
    }

    const success = await facultyService.createAnnouncement(newAnnouncement);
    if (success) {
      setAnnouncementModalOpen(false);
      setNewAnnouncement({
        title: '',
        content: '',
        targetAudience: 'students',
        priority: 'Normal',
      });
      const updated = await facultyService.getAnnouncements();
      setAnnouncements(updated);
      showToast('Notice Published', 'Broadcasted across student feeds.', 'success');
    }
  };

  const handleGradeSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    const success = await facultyService.gradeSubmission(
      activeSubmission.id,
      gradeInput.marks,
      gradeInput.feedback
    );

    if (success) {
      setGradingModalOpen(false);
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === activeSubmission.id
            ? { ...s, status: 'graded', obtainedMarks: gradeInput.marks, facultyFeedback: gradeInput.feedback }
            : s
        )
      );
      showToast('Submission Evaluated', `Grade recorded (${gradeInput.marks}/100) for ${activeSubmission.studentName}.`, 'success');
    }
  };

  const handleSaveAttendance = async () => {
    const records = students.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      subjectCode: attendanceSubject,
      subjectName: courses.find((c) => c.code === attendanceSubject)?.name || 'Engineering Subject',
      attended: !!attendanceRoster[s.id],
    }));

    const success = await facultyService.recordAttendance(records);
    if (success) {
      showToast('Attendance Persisted', `Batch records saved for ${attendanceDate} (${attendanceSubject}).`, 'success');
    }
  };

  const handleLogIntervention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudent) return;

    const success = await facultyService.createIntervention(
      {
        studentId: activeStudent.id,
        studentName: activeStudent.name,
        department: activeStudent.department,
        area: interventionInput.reason || 'Academic Performance & Attendance Margin',
        riskTrigger: interventionInput.reason || 'Attendance < 75% Alert',
        recommendedAction: interventionInput.action,
        assignedFaculty: profile?.name || 'Dr. Arvind Subramanian',
        status: 'Open',
        priority: activeStudent.riskLevel === 'High Risk' ? 'High' : 'Medium',
      },
      interventionInput.confidentialNotes
    );

    if (success) {
      setInterventionModalOpen(false);
      setInterventionInput({ reason: '', confidentialNotes: '', action: 'Mandatory 1-on-1 counseling session' });
      showToast('Intervention Logged', `Case initialized for ${activeStudent.name}.`, 'success');
    }
  };

  const toggleAllAttendance = (present: boolean) => {
    const updated: Record<string, boolean> = {};
    students.forEach((s) => {
      updated[s.id] = present;
    });
    setAttendanceRoster(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ==================================================
          1. HEADER & FACULTY PROFILE CARD
          ================================================== */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={profile?.name || 'Faculty Member'}
                className="w-18 h-18 rounded-2xl object-cover border-2 border-[#FF7A18]/60 shadow-[0_0_25px_rgba(255,122,24,0.35)]"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-[#1A120E] rounded-full border border-[#FF7A18]/40">
                <ShieldCheck size={14} className="text-[#FF8C32]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold text-[#FFF8F0] font-display">
                  {profile?.name || 'Dr. Arvind Subramanian'}
                </h1>
                <Badge variant="orange" size="sm">FACULTY MENTOR</Badge>
                <Badge variant="amber" size="sm">ACADEMIC COUNCIL</Badge>
              </div>
              <p className="text-xs text-[#C5B5A8] font-medium">
                {profile?.designation || 'Professor & Head of Academic Council'} • {profile?.department || 'Computer Science & AI'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-[#A69B91]">
                <span>📍 {profile?.cabin || 'Academic Block 3, Suite 402'}</span>
                <span>⏰ {profile?.officeHours || 'Mon, Wed, Fri • 02:00 PM - 04:30 PM'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAnnouncementModalOpen(true)}
              className="gap-1.5"
            >
              <Bell size={14} /> Broadcast Notice
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAssignmentModalOpen(true)}
              className="gap-1.5"
            >
              <Plus size={14} /> New Assignment
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setTab('attendance')}
              className="gap-1.5"
            >
              <CalendarCheck size={14} /> Take Attendance
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* ==================================================
          2. KPI SUMMARY METRICS
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <GlassCard className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Assigned Scholars</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#FFF8F0] font-display">204</span>
            <span className="text-[11px] text-[#FF8C32]">3 Sections</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">CSE & Data Science Cohorts</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Avg Attendance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-display">88.6%</span>
            <span className="text-[11px] text-emerald-400/80">+2.1% MoM</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">Across 3 Lecture Modules</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Active Interventions</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#FF8C32] font-display">14</span>
            <span className="text-[11px] text-rose-400">8 High Risk</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">Awaiting Remediation Review</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Pending Grading</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#FFB347] font-display">28</span>
            <span className="text-[11px] text-[#FFB347]/80">Submissions</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">Raft Protocol & Style Transfer</p>
        </GlassCard>

        <GlassCard className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Syllabus Coverage</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#FFF8F0] font-display">78.4%</span>
            <span className="text-[11px] text-emerald-400">On Schedule</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">Target 80% Before Midterms</p>
        </GlassCard>
      </div>

      {/* ==================================================
          3. MODULE NAVIGATION TABS
          ================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[rgba(255,122,24,0.20)] no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Cockpit', icon: Sparkles },
          { id: 'placement', label: 'Placement Analytics', icon: Briefcase },
          { id: 'analytics', label: 'Academic Performance', icon: TrendingUp },
          { id: 'students', label: 'Student Cohort', icon: Users },
          { id: 'syllabus', label: 'Syllabus Manager', icon: BookOpen },
          { id: 'courses', label: 'Course Desk', icon: Layers },
          { id: 'assignments', label: 'Assignments & Grading', icon: FileSpreadsheet },
          { id: 'attendance', label: 'Attendance Ledger', icon: CalendarCheck },
          { id: 'announcements', label: 'Notices & Broadcasts', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF7A18]/25 via-[#FF8C32]/20 to-transparent text-[#FFE0A3] border border-[rgba(255,140,50,0.45)] shadow-[0_0_20px_rgba(255,122,24,0.25)]'
                  : 'text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/5'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-[#FF8C32]' : 'text-[#8F8176]'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================================================
          4. TAB: OVERVIEW & COCKPIT
          ================================================== */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <FacultyOverviewCockpit
            onOpenIntervention={(student) => {
              setActiveStudent(student);
              setInterventionModalOpen(true);
            }}
            onNavigateTab={(tab) => setTab(tab)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-[rgba(255,122,24,0.18)]">
          {/* Assigned Courses Overview */}
          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#FFF8F0] flex items-center gap-2">
                  <BookOpen size={18} className="text-[#FF8C32]" /> Assigned Course Modules
                </h3>
                <span className="text-xs text-[#C5B5A8]">Fall 2026 Academic Term</span>
              </div>

              <div className="space-y-3">
                {courses.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl bg-[#140F0C] border border-[rgba(255,106,0,0.2)] hover:border-[#FF7A18]/50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#FF8C32]">{c.code}</span>
                          <span className="text-xs text-[#8F8176]">•</span>
                          <span className="text-xs text-[#A69B91]">Semester {c.semester}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#FFF8F0] mt-0.5">{c.name}</h4>
                      </div>
                      <Badge variant="orange" size="sm">{c.credits} Credits</Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-[11px]">
                      <div>
                        <span className="text-[#8F8176]">Enrolled:</span>
                        <p className="font-bold text-[#FFF8F0]">{c.enrolledStudentsCount} Scholars</p>
                      </div>
                      <div>
                        <span className="text-[#8F8176]">Syllabus Covered:</span>
                        <p className="font-bold text-[#FFB347]">{c.syllabusCompletionPct}%</p>
                      </div>
                      <div>
                        <span className="text-[#8F8176]">Avg Attendance:</span>
                        <p className="font-bold text-emerald-400">{c.avgAttendancePct}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Broadcast Announcements */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#FFF8F0] flex items-center gap-2">
                  <Bell size={18} className="text-[#FF8C32]" /> Recent Broadcasts
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setTab('announcements')}>
                  View All &rarr;
                </Button>
              </div>

              <div className="space-y-3">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[#FFF8F0]">{a.title}</span>
                      <Badge variant={a.priority === 'Urgent' ? 'red' : 'amber'} size="sm">{a.priority}</Badge>
                    </div>
                    <p className="text-[11px] text-[#C5B5A8] line-clamp-2">{a.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-[#8F8176]">
                      <span>{a.createdAt}</span>
                      <span>•</span>
                      <span>Audience: {a.targetAudience}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* At-Risk Intervention Watchlist */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#FFF8F0] flex items-center gap-2">
                  <ShieldAlert size={18} className="text-rose-400" /> High-Risk Intervention Watchlist
                </h3>
                <span className="text-xs text-rose-300 font-mono">Immediate Action</span>
              </div>

              <div className="space-y-3">
                {students
                  .filter((s) => s.riskLevel === 'High Risk' || s.attendancePct < 75)
                  .slice(0, 5)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold text-[#FFF8F0]">{s.name}</p>
                            <p className="text-[10px] text-[#8F8176] font-mono">{s.rollNo}</p>
                          </div>
                        </div>
                        <Badge variant="red" size="sm">{s.attendancePct}% Att</Badge>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-rose-500/10 text-[11px]">
                        <span className="text-[#C5B5A8] truncate max-w-[180px]">{s.topWeakness}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveStudent(s);
                            setInterventionModalOpen(true);
                          }}
                          className="text-[#FF8C32] hover:text-[#FFE0A3]"
                        >
                          Log Case &rarr;
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      )}

      {/* ==================================================
          TAB: PLACEMENT ANALYTICS
          ================================================== */}
      {currentTab === 'placement' && (
        <PlacementAnalyticsView />
      )}

      {/* ==================================================
          TAB: ACADEMIC PERFORMANCE
          ================================================== */}
      {currentTab === 'analytics' && (
        <AcademicPerformanceView
          onOpenIntervention={(student) => {
            setActiveStudent(student);
            setInterventionModalOpen(true);
          }}
        />
      )}

      {/* ==================================================
          5. TAB: STUDENT COHORT
          ================================================== */}
      {currentTab === 'students' && (
        <GlassCard className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#FFF8F0]">Student Academic Registry</h3>
              <p className="text-xs text-[#C5B5A8]">Live monitoring across enrolled engineering cohorts.</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F8176]" />
                <input
                  type="text"
                  placeholder="Search scholar or roll no..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
                />
              </div>

              <select
                value={studentRiskFilter}
                onChange={(e) => setStudentRiskFilter(e.target.value)}
                className="py-1.5 px-3 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:outline-none"
              >
                <option value="All">All Risk Levels</option>
                <option value="Safe">Safe</option>
                <option value="Moderate">Moderate</option>
                <option value="High Risk">High Risk</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#8F8176] uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Scholar</th>
                  <th className="py-3 px-3">Roll Number</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">CGPA</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3 text-right">Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 flex items-center gap-2.5">
                      <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span className="font-bold text-[#FFF8F0]">{s.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#C5B5A8]">{s.rollNo}</td>
                    <td className="py-3 px-3 text-[#A69B91]">{s.department}</td>
                    <td className="py-3 px-3 font-bold text-[#FFF8F0]">{s.cgpa}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${
                          s.attendancePct >= 85
                            ? 'text-emerald-400'
                            : s.attendancePct >= 75
                            ? 'text-[#FFB347]'
                            : 'text-rose-400'
                        }`}
                      >
                        {s.attendancePct}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={s.riskLevel === 'Safe' ? 'green' : s.riskLevel === 'Moderate' ? 'amber' : 'red'}
                        size="sm"
                      >
                        {s.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setActiveStudent(s);
                          setInterventionModalOpen(true);
                        }}
                      >
                        Log Intervention
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* ==================================================
          6. TAB: SYLLABUS MANAGER
          ================================================== */}
      {currentTab === 'syllabus' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#FFF8F0]">Syllabus Coverage & Lecture Tracker</h3>
                <p className="text-xs text-[#C5B5A8]">Update unit topic completion to automatically sync faculty telemetry.</p>
              </div>

              {/* Course Selector Tabs */}
              <div className="flex items-center gap-2 bg-[#140F0C] p-1.5 rounded-xl border border-[rgba(255,106,0,0.25)]">
                {['ALL', 'CS601', 'AI604', 'CS605'].map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedCourseCode(code)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCourseCode === code
                        ? 'bg-[#FF7A18] text-white shadow-md'
                        : 'text-[#C5B5A8] hover:text-white'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>

            {/* Units Grid */}
            <div className="space-y-4">
              {filteredSyllabus.map((unit) => (
                <div
                  key={unit.id}
                  className="p-5 rounded-2xl bg-[#140F0C]/90 border border-[rgba(255,106,0,0.25)] shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#FF7A18]/15 border border-[#FF7A18]/30 flex items-center justify-center font-bold text-xs text-[#FF8C32]">
                        U{unit.unitNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#FF8C32]">{unit.courseCode}</span>
                          <span className="text-xs text-[#8F8176]">•</span>
                          <span className="text-xs font-bold text-[#FFF8F0]">{unit.unitTitle}</span>
                        </div>
                        <p className="text-[11px] text-[#A69B91] mt-0.5">
                          {unit.completedHours} of {unit.totalHours} Lecture Hours Completed ({unit.completionPct}%)
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={unit.status === 'Completed' ? 'green' : 'orange'}
                      size="sm"
                    >
                      {unit.status}
                    </Badge>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] transition-all duration-500 rounded-full"
                      style={{ width: `${unit.completionPct}%` }}
                    />
                  </div>

                  {/* Topics List with Interactive Toggles */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {unit.topics.map((t: any) => (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTopic(unit.id, t.id, t.completed)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          t.completed
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-[#FFF8F0]'
                            : 'bg-white/[0.02] border-white/5 text-[#C5B5A8] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              t.completed
                                ? 'bg-emerald-500 border-emerald-400 text-black'
                                : 'border-[#8F8176]'
                            }`}
                          >
                            {t.completed && <Check size={13} strokeWidth={3} />}
                          </div>
                          <span className={`text-xs ${t.completed ? 'line-through text-[#8F8176]' : 'font-medium'}`}>
                            {t.title}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono text-[#8F8176]">{t.hours} hrs</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ==================================================
          7. TAB: COURSE DESK
          ================================================== */}
      {currentTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <GlassCard key={course.code} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold text-[#FF8C32] px-2.5 py-1 rounded-lg bg-[#FF7A18]/10 border border-[#FF7A18]/30">
                    {course.code}
                  </span>
                  <Badge variant="amber" size="sm">{course.credits} Credits</Badge>
                </div>
                <h3 className="text-base font-bold text-[#FFF8F0] mb-2">{course.name}</h3>
                <p className="text-xs text-[#C5B5A8]">Semester {course.semester} • Core Engineering Track</p>

                <div className="my-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8F8176]">Enrolled Scholars:</span>
                    <span className="font-bold text-[#FFF8F0]">{course.enrolledStudentsCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8F8176]">Syllabus Coverage:</span>
                    <span className="font-bold text-[#FFB347]">{course.syllabusCompletionPct}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8F8176]">Cohort Attendance:</span>
                    <span className="font-bold text-emerald-400">{course.avgAttendancePct}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setSelectedCourseCode(course.code);
                    setTab('syllabus');
                  }}
                >
                  Manage Syllabus
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    setAttendanceSubject(course.code);
                    setTab('attendance');
                  }}
                >
                  Attendance Ledger
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ==================================================
          8. TAB: ASSIGNMENTS & GRADING
          ================================================== */}
      {currentTab === 'assignments' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#FFF8F0]">Assignment Submissions Ledger</h3>
                <p className="text-xs text-[#C5B5A8]">Review, inspect repositories, and grade student submissions.</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setAssignmentModalOpen(true)}
                className="gap-1.5"
              >
                <Plus size={14} /> Create Assignment
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#8F8176] uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Roll No</th>
                    <th className="py-3 px-3">Submitted Repository</th>
                    <th className="py-3 px-3">Submission Date</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#FFF8F0]">{sub.studentName}</td>
                      <td className="py-3 px-3 font-mono text-[#C5B5A8]">{sub.rollNo}</td>
                      <td className="py-3 px-3">
                        <a
                          href={sub.submissionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#FF8C32] hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          View Artifact <ExternalLink size={12} />
                        </a>
                      </td>
                      <td className="py-3 px-3 text-[#A69B91]">{sub.submissionDate}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={sub.status === 'graded' ? 'green' : 'amber'}
                          size="sm"
                        >
                          {sub.status === 'graded' ? 'Graded' : 'Pending Review'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-bold">
                        {sub.obtainedMarks !== null && sub.obtainedMarks !== undefined ? (
                          <span className="text-emerald-400">{sub.obtainedMarks}/100</span>
                        ) : (
                          <span className="text-[#8F8176]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setActiveSubmission(sub);
                            setGradeInput({ marks: sub.obtainedMarks || 92, feedback: sub.facultyFeedback || '' });
                            setGradingModalOpen(true);
                          }}
                        >
                          {sub.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ==================================================
          9. TAB: ATTENDANCE LEDGER
          ================================================== */}
      {currentTab === 'attendance' && (
        <GlassCard className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-[#FFF8F0]">Daily Class Attendance Ledger</h3>
              <p className="text-xs text-[#C5B5A8]">Record session presence for accreditation compliance.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8F8176] mb-1">Subject</label>
                <select
                  value={attendanceSubject}
                  onChange={(e) => setAttendanceSubject(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#8F8176] mb-1">Date</label>
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="py-1.5 px-3 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => toggleAllAttendance(true)}>
                  All Present
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleAllAttendance(false)}>
                  All Absent
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveAttendance}>
                  Save Attendance
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((st) => {
              const isPresent = !!attendanceRoster[st.id];
              return (
                <div
                  key={st.id}
                  onClick={() =>
                    setAttendanceRoster((prev) => ({
                      ...prev,
                      [st.id]: !prev[st.id],
                    }))
                  }
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isPresent
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-[#FFF8F0]'
                      : 'bg-rose-500/10 border-rose-500/30 text-[#C5B5A8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold leading-tight">{st.name}</p>
                      <p className="text-[10px] font-mono text-[#8F8176]">{st.rollNo}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      isPresent
                        ? 'bg-emerald-500 text-black'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {isPresent ? 'PRESENT' : 'ABSENT'}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* ==================================================
          10. TAB: NOTICES & BROADCASTS
          ================================================== */}
      {currentTab === 'announcements' && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-lg font-bold text-[#FFF8F0]">Institutional Faculty Broadcasts</h3>
              <p className="text-xs text-[#C5B5A8]">Direct communications to scholar portals and department boards.</p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setAnnouncementModalOpen(true)}
              className="gap-1.5"
            >
              <Plus size={14} /> New Broadcast
            </Button>
          </div>

          <div className="space-y-4">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="p-5 rounded-2xl bg-[#140F0C] border border-[rgba(255,106,0,0.2)] space-y-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FF8C32]">{a.authorName}</span>
                      <span className="text-xs text-[#8F8176]">•</span>
                      <span className="text-[11px] text-[#A69B91]">{a.authorRole}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#FFF8F0] mt-1">{a.title}</h4>
                  </div>
                  <Badge variant={a.priority === 'Urgent' ? 'red' : 'amber'} size="sm">
                    {a.priority}
                  </Badge>
                </div>

                <p className="text-xs text-[#C5B5A8] leading-relaxed pt-1">{a.content}</p>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8F8176]">
                  <span>Audience: {a.targetAudience.toUpperCase()}</span>
                  <span>Published {a.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* ==================================================
          MODAL: CREATE ASSIGNMENT
          ================================================== */}
      <Modal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title="Create New Subject Assignment"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Course Code</label>
            <select
              value={newAssignment.courseCode}
              onChange={(e) => {
                const c = courses.find((item) => item.code === e.target.value);
                setNewAssignment({
                  ...newAssignment,
                  courseCode: e.target.value,
                  courseName: c?.name || '',
                });
              }}
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            >
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              placeholder="e.g. Distributed Consensus & Raft Protocol Simulation"
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Instructions / Description</label>
            <textarea
              rows={3}
              required
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Detail required milestones, grading criteria, and repository delivery requirements..."
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Total Marks</label>
              <input
                type="number"
                value={newAssignment.totalMarks}
                onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Due Date</label>
              <input
                type="date"
                required
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAssignmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==================================================
          MODAL: GRADE SUBMISSION
          ================================================== */}
      <Modal
        isOpen={gradingModalOpen}
        onClose={() => setGradingModalOpen(false)}
        title={`Grade Submission — ${activeSubmission?.studentName || ''}`}
      >
        <form onSubmit={handleGradeSubmission} className="space-y-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
            <p className="text-[#8F8176]">Repository Link:</p>
            <a
              href={activeSubmission?.submissionLink}
              target="_blank"
              rel="noreferrer"
              className="text-[#FF8C32] font-mono break-all hover:underline"
            >
              {activeSubmission?.submissionLink}
            </a>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Marks Obtained (Out of 100)</label>
            <input
              type="number"
              min={0}
              max={100}
              required
              value={gradeInput.marks}
              onChange={(e) => setGradeInput({ ...gradeInput, marks: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Faculty Feedback & Review</label>
            <textarea
              rows={3}
              value={gradeInput.feedback}
              onChange={(e) => setGradeInput({ ...gradeInput, feedback: e.target.value })}
              placeholder="Explain grading rationale, edge case handling, and recommendations for improvement..."
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setGradingModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Grade
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==================================================
          MODAL: POST ANNOUNCEMENT
          ================================================== */}
      <Modal
        isOpen={announcementModalOpen}
        onClose={() => setAnnouncementModalOpen(false)}
        title="Broadcast Institutional Notice"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Notice Heading</label>
            <input
              type="text"
              required
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              placeholder="e.g. Mid-Semester Lab Assessment Schedule"
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Broadcast Content</label>
            <textarea
              rows={3}
              required
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              placeholder="Enter announcement text to display on student dashboards..."
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Audience</label>
              <select
                value={newAnnouncement.targetAudience}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
              >
                <option value="students">All Enrolled Students</option>
                <option value="department">Department Only</option>
                <option value="all">Campus Wide</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Priority</label>
              <select
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value as any })}
                className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent Alert</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setAnnouncementModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Post Broadcast
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==================================================
          MODAL: LOG REMEDIATION INTERVENTION
          ================================================== */}
      <Modal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        title={`Log Intervention Case — ${activeStudent?.name || ''}`}
      >
        <form onSubmit={handleLogIntervention} className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#FFE0A3] space-y-1">
            <p className="font-bold">Confidential Remediation Record</p>
            <p className="text-[11px] text-[#C5B5A8]">
              Intervention reason will be visible to student. Confidential notes remain restricted to faculty and dean.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Intervention Reason / Risk Area</label>
            <input
              type="text"
              required
              value={interventionInput.reason}
              onChange={(e) => setInterventionInput({ ...interventionInput, reason: e.target.value })}
              placeholder="e.g. Critical attendance shortage (<75%) in CS605"
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">Recommended Action</label>
            <input
              type="text"
              required
              value={interventionInput.action}
              onChange={(e) => setInterventionInput({ ...interventionInput, action: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] mb-1">
              Confidential Faculty Notes (Hidden from Student)
            </label>
            <textarea
              rows={3}
              value={interventionInput.confidentialNotes}
              onChange={(e) => setInterventionInput({ ...interventionInput, confidentialNotes: e.target.value })}
              placeholder="Private observations, counselor recommendations, and institutional remarks..."
              className="w-full p-2.5 rounded-xl bg-[#140F0C] border border-white/10 text-xs text-[#FFF8F0]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setInterventionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Intervention Case
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyDashboardPage;
