import React, { useState, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  TrendingUp,
  TrendingDown,
  BookOpen,
  CalendarCheck,
  FileCheck,
  Clock,
  AlertTriangle,
  Award,
  Filter,
  Search,
  ChevronRight,
  Download,
  BarChart3,
  SlidersHorizontal,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface CoursePerformance {
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  enrolledStudents: number;
  averageMarks: number;
  passPercentage: number;
  topGradeCount: number; // A+/A
  attendanceAverage: number;
  pendingSubmissionsCount: number;
}

interface AssessmentItem {
  id: string;
  courseCode: string;
  title: string;
  type: 'Midterm Examination' | 'Continuous Assessment' | 'Lab Practical' | 'Capstone Defense';
  conductedDate: string;
  totalMarks: number;
  classAverage: number;
  highestMarks: number;
  passingRate: number;
}

interface DecliningStudent {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: number;
  previousCGPA: number;
  currentCGPA: number;
  cgpaDelta: number;
  attendancePct: number;
  backlogsCount: number;
  riskSeverity: 'Critical' | 'Moderate' | 'Watchlist';
  flaggedSubject: string;
}

const COURSES_DATA: CoursePerformance[] = [
  {
    code: 'CS601',
    name: 'Distributed Systems & Cloud Computing',
    department: 'Computer Science & AI',
    semester: 7,
    credits: 4,
    enrolledStudents: 68,
    averageMarks: 82.4,
    passPercentage: 97.1,
    topGradeCount: 29,
    attendanceAverage: 89.2,
    pendingSubmissionsCount: 14,
  },
  {
    code: 'AI702',
    name: 'Deep Learning & Neural Architectures',
    department: 'Computer Science & AI',
    semester: 7,
    credits: 4,
    enrolledStudents: 64,
    averageMarks: 79.8,
    passPercentage: 93.8,
    topGradeCount: 22,
    attendanceAverage: 86.5,
    pendingSubmissionsCount: 18,
  },
  {
    code: 'IT503',
    name: 'High Performance Database Engines',
    department: 'Information Technology',
    semester: 5,
    credits: 3,
    enrolledStudents: 52,
    averageMarks: 76.5,
    passPercentage: 90.4,
    topGradeCount: 15,
    attendanceAverage: 84.1,
    pendingSubmissionsCount: 9,
  },
  {
    code: 'DS401',
    name: 'Applied Statistical Learning & Inference',
    department: 'Data Science & Analytics',
    semester: 5,
    credits: 4,
    enrolledStudents: 48,
    averageMarks: 84.2,
    passPercentage: 97.9,
    topGradeCount: 24,
    attendanceAverage: 91.0,
    pendingSubmissionsCount: 6,
  },
  {
    code: 'EC602',
    name: 'Embedded Edge AI & IoT Firmware',
    department: 'Electronics & Computing',
    semester: 7,
    credits: 3,
    enrolledStudents: 38,
    averageMarks: 78.1,
    passPercentage: 92.1,
    topGradeCount: 12,
    attendanceAverage: 85.8,
    pendingSubmissionsCount: 11,
  },
];

const ASSESSMENTS_DATA: AssessmentItem[] = [
  {
    id: 'asm-1',
    courseCode: 'CS601',
    title: 'Midterm Evaluation: Consensus Algorithms & Raft',
    type: 'Midterm Examination',
    conductedDate: '2026-09-28',
    totalMarks: 50,
    classAverage: 41.2,
    highestMarks: 50,
    passingRate: 98.5,
  },
  {
    id: 'asm-2',
    courseCode: 'AI702',
    title: 'Lab Practical: PyTorch Vision Transformer Benchmark',
    type: 'Lab Practical',
    conductedDate: '2026-10-04',
    totalMarks: 30,
    classAverage: 24.8,
    highestMarks: 30,
    passingRate: 95.3,
  },
  {
    id: 'asm-3',
    courseCode: 'DS401',
    title: 'Continuous Assessment: Monte Carlo Simulation Suite',
    type: 'Continuous Assessment',
    conductedDate: '2026-10-08',
    totalMarks: 20,
    classAverage: 17.6,
    highestMarks: 20,
    passingRate: 100.0,
  },
  {
    id: 'asm-4',
    courseCode: 'IT503',
    title: 'Midterm Exam: LSM-Tree Storage Engine Architecture',
    type: 'Midterm Examination',
    conductedDate: '2026-09-30',
    totalMarks: 50,
    classAverage: 37.4,
    highestMarks: 48,
    passingRate: 90.4,
  },
];

const DECLINING_STUDENTS_DATA: DecliningStudent[] = [
  {
    id: 'dec-1',
    name: 'Karan Patel',
    rollNo: 'STU-2024-CS091',
    department: 'Computer Science & AI',
    semester: 7,
    previousCGPA: 7.24,
    currentCGPA: 5.92,
    cgpaDelta: -1.32,
    attendancePct: 68.4,
    backlogsCount: 1,
    riskSeverity: 'Critical',
    flaggedSubject: 'Distributed Systems & Cloud Computing',
  },
  {
    id: 'dec-2',
    name: 'Siddharth Rao',
    rollNo: 'STU-2024-IT028',
    department: 'Information Technology',
    semester: 5,
    previousCGPA: 7.40,
    currentCGPA: 6.45,
    cgpaDelta: -0.95,
    attendancePct: 71.0,
    backlogsCount: 0,
    riskSeverity: 'Moderate',
    flaggedSubject: 'Database Engines',
  },
  {
    id: 'dec-3',
    name: 'Pooja Hegde',
    rollNo: 'STU-2024-DS019',
    department: 'Data Science & Analytics',
    semester: 5,
    previousCGPA: 7.65,
    currentCGPA: 6.80,
    cgpaDelta: -0.85,
    attendancePct: 73.2,
    backlogsCount: 0,
    riskSeverity: 'Moderate',
    flaggedSubject: 'Applied Statistical Learning',
  },
  {
    id: 'dec-4',
    name: 'Vikram Joshi',
    rollNo: 'STU-2024-EC044',
    department: 'Electronics & Computing',
    semester: 7,
    previousCGPA: 8.10,
    currentCGPA: 7.20,
    cgpaDelta: -0.90,
    attendancePct: 74.5,
    backlogsCount: 0,
    riskSeverity: 'Watchlist',
    flaggedSubject: 'Embedded Edge AI',
  },
];

interface Props {
  onOpenIntervention: (student: any) => void;
}

export const AcademicPerformanceView: React.FC<Props> = ({ onOpenIntervention }) => {
  // Filter States
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2026-27');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return COURSES_DATA.filter((c) => {
      const matchDept = selectedDept === 'All' || c.department === selectedDept;
      const matchSem = selectedSemester === 'All' || c.semester.toString() === selectedSemester;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSem && matchSearch;
    });
  }, [selectedDept, selectedSemester, searchQuery]);

  // Filtered Declining Scholars
  const filteredDeclining = useMemo(() => {
    return DECLINING_STUDENTS_DATA.filter((s) => {
      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchSem = selectedSemester === 'All' || s.semester.toString() === selectedSemester;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSem && matchSearch;
    });
  }, [selectedDept, selectedSemester, searchQuery]);

  // Aggregate stats
  const totalEnrolled = useMemo(() => {
    return filteredCourses.reduce((acc, c) => acc + c.enrolledStudents, 0);
  }, [filteredCourses]);

  const avgClassMarks = useMemo(() => {
    if (filteredCourses.length === 0) return 0;
    const sum = filteredCourses.reduce((acc, c) => acc + c.averageMarks, 0);
    return Number((sum / filteredCourses.length).toFixed(1));
  }, [filteredCourses]);

  const avgAttendance = useMemo(() => {
    if (filteredCourses.length === 0) return 0;
    const sum = filteredCourses.reduce((acc, c) => acc + c.attendanceAverage, 0);
    return Number((sum / filteredCourses.length).toFixed(1));
  }, [filteredCourses]);

  const totalPendingGrading = useMemo(() => {
    return filteredCourses.reduce((acc, c) => acc + c.pendingSubmissionsCount, 0);
  }, [filteredCourses]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ==================================================
          1. HEADER & CONTROLS
          ================================================== */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-[#FF7A18]/20 text-[#FF8C32] border border-[#FF7A18]/30">
                <BarChart3 size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-[#FFF8F0] font-display">
                Academic Performance Analytics
              </h2>
              <Badge variant="orange" size="sm">LIVE EVALUATION ENGINE</Badge>
            </div>
            <p className="text-xs text-[#C5B5A8]">
              Subject-wise grade distributions, attendance telemetry, assessment pass metrics, and early academic intervention triggers.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-[#8F8176]">Term: {selectedAcademicYear}</span>
            <Badge variant="amber" size="sm">FALL SEMESTER</Badge>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[rgba(255,122,24,0.18)]">
          {/* Department */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C5B5A8] mb-1.5">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:border-[#FF7A18] outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Electronics & Computing">Electronics & Computing</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C5B5A8] mb-1.5">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:border-[#FF7A18] outline-none"
            >
              <option value="All">All Semesters</option>
              <option value="3">Semester 3 (Sophomore)</option>
              <option value="5">Semester 5 (Junior)</option>
              <option value="7">Semester 7 (Senior)</option>
              <option value="8">Semester 8 (Final)</option>
            </select>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C5B5A8] mb-1.5">
              Academic Year
            </label>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] focus:border-[#FF7A18] outline-none"
            >
              <option value="2026-27">AY 2026-27 (Current)</option>
              <option value="2025-26">AY 2025-26</option>
              <option value="2024-25">AY 2024-25</option>
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C5B5A8] mb-1.5">
              Search Course / Scholar
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8F8176]" />
              <input
                type="text"
                placeholder="Code, subject, roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#140F0C] border border-[rgba(255,106,0,0.25)] text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:border-[#FF7A18] outline-none"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ==================================================
          2. SUMMARY KPI STRIP
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class Average */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Class Average Score</span>
            <Award size={16} className="text-[#FFB347]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FFE0A3] font-display">{avgClassMarks}</span>
            <span className="text-xs text-[#8F8176]">/ 100 Marks</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp size={12} /> 94.2% Overall Passing Ratio
          </p>
        </GlassCard>

        {/* Attendance Index */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Subject Attendance</span>
            <CalendarCheck size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{avgAttendance}%</span>
            <span className="text-xs text-[#8F8176]">Cohort Mean</span>
          </div>
          <p className="text-[10px] text-[#C5B5A8] mt-1">Institutional Safe Threshold: ≥ 75%</p>
        </GlassCard>

        {/* Assignment Queue */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Pending Submissions</span>
            <Clock size={16} className="text-[#FF8C32]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FF8C32] font-display">{totalPendingGrading}</span>
            <span className="text-xs text-[#8F8176]">Awaiting Evaluation</span>
          </div>
          <p className="text-[10px] text-[#C5B5A8] mt-1">From 4 Ongoing Course Tracks</p>
        </GlassCard>

        {/* Academic Attention */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Declining Performers</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-rose-400 font-display">{filteredDeclining.length}</span>
            <span className="text-xs text-[#8F8176]">Scholars</span>
          </div>
          <p className="text-[10px] text-rose-400/90 mt-1 font-semibold">Immediate Intervention Recommended</p>
        </GlassCard>
      </div>

      {/* ==================================================
          3. SUBJECT-WISE & SEMESTER-WISE PERFORMANCE
          ================================================== */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#FFF8F0] flex items-center gap-2">
              <BookOpen size={18} className="text-[#FF8C32]" /> Subject-Wise & Semester-Wise Evaluation Matrix
            </h3>
            <p className="text-xs text-[#C5B5A8]">
              Comprehensive performance breakdown across curriculum modules, credits, pass percentages, and grading queues.
            </p>
          </div>
          <span className="text-xs text-[#8F8176]">{filteredCourses.length} Modules Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,122,24,0.18)] text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">
                <th className="py-3 px-3">Course Code</th>
                <th className="py-3 px-3">Course Name</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Sem</th>
                <th className="py-3 px-3">Enrolled</th>
                <th className="py-3 px-3">Avg Score</th>
                <th className="py-3 px-3">Pass Rate</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Pending Grading</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,122,24,0.1)]">
              {filteredCourses.map((c) => (
                <tr key={c.code} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="font-mono font-bold text-[#FF8C32] bg-[#FF7A18]/10 px-2 py-0.5 rounded-md border border-[#FF7A18]/25">
                      {c.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#FFF8F0]">
                    {c.name}
                    <span className="block text-[10px] text-[#8F8176] font-normal">{c.credits} Credits</span>
                  </td>
                  <td className="py-3.5 px-3 text-[#C5B5A8]">{c.department}</td>
                  <td className="py-3.5 px-3 text-[#FFF8F0] font-mono">Sem {c.semester}</td>
                  <td className="py-3.5 px-3 font-mono text-[#FFF8F0]">{c.enrolledStudents}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#FFE0A3] font-mono">{c.averageMarks}/100</span>
                      <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF7A18] to-emerald-400 rounded-full"
                          style={{ width: `${c.averageMarks}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <Badge variant={c.passPercentage >= 95 ? 'success' : 'amber'} size="sm">
                      {c.passPercentage}%
                    </Badge>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[#FFF8F0]">
                    <span className={c.attendanceAverage >= 85 ? 'text-emerald-400 font-semibold' : 'text-[#FFB347]'}>
                      {c.attendanceAverage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono">
                    {c.pendingSubmissionsCount > 0 ? (
                      <span className="text-[#FF8C32] font-semibold flex items-center gap-1">
                        <Clock size={12} /> {c.pendingSubmissionsCount}
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> All Graded
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* ==================================================
          4. RECENT ASSESSMENT RESULTS
          ================================================== */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-[#FFF8F0] flex items-center gap-2">
              <Award size={18} className="text-[#FFB347]" /> Proctored Assessments & Examination Outcomes
            </h3>
            <p className="text-xs text-[#C5B5A8]">
              Standardized examination performance, class marks spread, and highest benchmark scores.
            </p>
          </div>
          <Badge variant="orange" size="sm">AY 2026-27 EVALUATIONS</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ASSESSMENTS_DATA.map((asm) => (
            <div
              key={asm.id}
              className="p-4 rounded-2xl bg-[#140F0C] border border-[rgba(255,106,0,0.2)] hover:border-[#FF7A18]/50 transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-[#FF8C32]">{asm.courseCode}</span>
                    <Badge variant="neutral" size="sm">{asm.type}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-[#FFF8F0]">{asm.title}</h4>
                </div>
                <span className="text-[10px] text-[#8F8176] shrink-0 font-mono">📅 {asm.conductedDate}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-[#8F8176] block">Class Mean</span>
                  <span className="text-sm font-extrabold text-[#FFE0A3] font-mono">
                    {asm.classAverage} <span className="text-[10px] font-normal text-[#8F8176]">/{asm.totalMarks}</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-[#8F8176] block">Top Benchmark</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    {asm.highestMarks} <span className="text-[10px] font-normal text-[#8F8176]">/{asm.totalMarks}</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02]">
                  <span className="text-[10px] text-[#8F8176] block">Passing Ratio</span>
                  <span className="text-sm font-extrabold text-[#FFF8F0] font-mono">
                    {asm.passingRate}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ==================================================
          5. STUDENTS WITH DECLINING ACADEMIC PERFORMANCE
          ================================================== */}
      <GlassCard className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle size={18} /> Scholars with Declining Academic Trajectory
            </h3>
            <p className="text-xs text-[#C5B5A8]">
              Automated institutional telemetry flagging students experiencing ≥ 0.5 CGPA drop, attendance margins &lt; 75%, or subject struggle.
            </p>
          </div>
          <Badge variant="danger" size="sm">
            {filteredDeclining.length} AT-RISK SCHOLARS
          </Badge>
        </div>

        {filteredDeclining.length === 0 ? (
          <div className="p-8 text-center text-[#8F8176]">
            <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2 opacity-80" />
            <p className="text-xs">No scholars currently match the declining risk threshold under the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(255,122,24,0.18)] text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Roll Number</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Previous CGPA</th>
                  <th className="py-3 px-3">Current CGPA</th>
                  <th className="py-3 px-3">Delta</th>
                  <th className="py-3 px-3">Attendance</th>
                  <th className="py-3 px-3">Flagged Module</th>
                  <th className="py-3 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,122,24,0.1)]">
                {filteredDeclining.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-[#FFF8F0]">{s.name}</td>
                    <td className="py-3.5 px-3 font-mono text-[#8F8176]">{s.rollNo}</td>
                    <td className="py-3.5 px-3 text-[#C5B5A8]">{s.department}</td>
                    <td className="py-3.5 px-3 font-mono text-[#C5B5A8]">{s.previousCGPA.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-rose-400">{s.currentCGPA.toFixed(2)}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-xs font-bold text-rose-400 flex items-center gap-1">
                        <TrendingDown size={14} /> {s.cgpaDelta.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400">{s.attendancePct}%</td>
                    <td className="py-3.5 px-3 text-xs text-[#C5B5A8]">{s.flaggedSubject}</td>
                    <td className="py-3.5 px-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          onOpenIntervention({
                            id: s.id,
                            name: s.name,
                            rollNo: s.rollNo,
                            department: s.department,
                            riskLevel: s.riskSeverity === 'Critical' ? 'High Risk' : 'Medium Risk',
                          })
                        }
                        className="gap-1 text-[11px] py-1 border-rose-500/30 hover:border-rose-500/60 text-rose-300"
                      >
                        Intervene <ChevronRight size={12} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
