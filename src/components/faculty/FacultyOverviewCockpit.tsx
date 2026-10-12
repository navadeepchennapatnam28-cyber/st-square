import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { placementAnalyticsService } from '../../services/placementAnalyticsService';
import { AcademicAnalyticsOverview } from '../../types';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  FileCheck,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Layers,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  BarChart3,
  BookOpen,
} from 'lucide-react';

interface Props {
  onOpenIntervention: (student: any) => void;
  onNavigateTab: (tab: string) => void;
}

export const FacultyOverviewCockpit: React.FC<Props> = ({ onOpenIntervention, onNavigateTab }) => {
  const [analytics, setAnalytics] = useState<AcademicAnalyticsOverview | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    placementAnalyticsService
      .getAcademicPerformanceAnalytics({ department: selectedDept })
      .then((data) => {
        setAnalytics(data);
        setIsLoading(false);
      });
  }, [selectedDept]);

  if (isLoading || !analytics) {
    return (
      <div className="p-8 text-center text-[#C5B5A8]">
        <div className="w-8 h-8 mx-auto border-2 border-[#FF7A18] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs">Aggregating institutional student analytics & academic telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ==================================================
          1. TOP SUMMARY KPI STRIP
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Students */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Registered Students</span>
            <Users size={16} className="text-[#FF8C32]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{analytics.totalStudents}</span>
            <span className="text-xs font-semibold text-emerald-400">172 Active</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">6 on Medical / Sabbatical Leave</p>
        </GlassCard>

        {/* Institutional CGPA */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Overall Performance</span>
            <GraduationCap size={16} className="text-[#FFB347]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FFE0A3] font-display">8.58</span>
            <span className="text-xs text-[#8F8176]">/ 10.0 CGPA</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> +0.24 YoY Institutional Growth
          </p>
        </GlassCard>

        {/* Attendance Health */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Attendance Overview</span>
            <CalendarCheck size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{analytics.attendanceMetrics.overallAverage}%</span>
            <span className="text-xs font-semibold text-emerald-400">{analytics.attendanceMetrics.above75} Safe</span>
          </div>
          <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-semibold">
            <AlertTriangle size={12} /> {analytics.attendanceMetrics.below75AtRisk} Students Below 75% Margin
          </p>
        </GlassCard>

        {/* Assignment Submission Rate */}
        <GlassCard className="p-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Assignment Completion</span>
            <FileCheck size={16} className="text-[#FF7A18]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{analytics.assignmentMetrics.completionRatePct}%</span>
            <span className="text-xs text-[#FFB347] font-semibold">{analytics.assignmentMetrics.pendingGrading} to Grade</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1">{analytics.assignmentMetrics.totalSubmissions} Total Evaluated Across 16 Course Units</p>
        </GlassCard>
      </div>

      {/* ==================================================
          2. DEMOGRAPHIC SEGMENTATION & SEMESTER DISTRIBUTION
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Breakdown */}
        <GlassCard className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
                <BarChart3 size={16} className="text-[#FF8C32]" /> Departmental Roster & Academic Metrics
              </h3>
              <p className="text-[11px] text-[#C5B5A8] mt-0.5">Enrollment, average GPA, and attendance by engineering branch</p>
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Electronics & Computing">Electronics & Computing</option>
            </select>
          </div>

          <div className="space-y-3">
            {analytics.departmentDistribution.map((dept) => (
              <div
                key={dept.department}
                className="p-3.5 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.18)] hover:border-[#FF7A18]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-[#FFF8F0]">{dept.department}</p>
                  <p className="text-[10px] text-[#8F8176] mt-0.5">{dept.count} Registered Scholars • Batch 2022-2026</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] text-[#8F8176] block">Average CGPA</span>
                    <span className="font-extrabold text-[#FFE0A3] font-mono">{dept.avgCGPA.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8F8176] block">Attendance</span>
                    <span className={`font-extrabold font-mono ${dept.avgAttendance >= 85 ? 'text-emerald-400' : 'text-[#FF8C32]'}`}>
                      {dept.avgAttendance}%
                    </span>
                  </div>
                  <div className="w-20 hidden sm:block">
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF7A18] to-[#FFB347] rounded-full"
                        style={{ width: `${(dept.count / 62) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Semester & Grade Range Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-6">
            <h3 className="text-sm font-bold text-[#FFF8F0] mb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#FFB347]" /> Academic Grade Spectrum
            </h3>
            <div className="space-y-2.5">
              {analytics.performanceDistribution.map((grade) => (
                <div key={grade.gradeRange}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#C5B5A8] text-[11px] truncate">{grade.gradeRange}</span>
                    <span className="font-bold text-[#FFF8F0] font-mono shrink-0 ml-2">
                      {grade.count} ({grade.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full ${
                        grade.gradeRange.includes('Outstanding')
                          ? 'bg-emerald-400'
                          : grade.gradeRange.includes('Distinction')
                          ? 'bg-[#FF7A18]'
                          : grade.gradeRange.includes('First Class')
                          ? 'bg-[#FFB347]'
                          : grade.gradeRange.includes('Second Class')
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${grade.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Semester Distribution */}
          <GlassCard className="p-4">
            <h4 className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 text-[#8F8176]">
              Active Semester Cohorts
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {analytics.semesterDistribution.map((sem) => (
                <div key={sem.semester} className="p-2.5 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.15)] text-center">
                  <span className="text-[10px] text-[#8F8176] font-bold block">SEM {sem.semester}</span>
                  <span className="text-lg font-extrabold text-[#FFE0A3] font-display">{sem.count}</span>
                  <span className="text-[9px] text-[#C5B5A8] block">Scholars</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ==================================================
          3. STUDENTS REQUIRING ACADEMIC ATTENTION
          ================================================== */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert size={18} className="text-rose-400" />
              <h3 className="text-sm font-bold text-[#FFF8F0]">
                Scholars Requiring Academic & Attendance Attention
              </h3>
              <Badge variant="red" size="sm">
                {analytics.studentsRequiringAttention.length} High Priority Cases
              </Badge>
            </div>
            <p className="text-[11px] text-[#C5B5A8] mt-0.5">
              Identified through predictive multi-factor correlation across attendance margins, assignment deficits, and GPA declines.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('students')}
            className="text-xs gap-1"
          >
            Full Student Registry <ChevronRight size={14} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,122,24,0.18)] text-[10px] uppercase font-bold text-[#8F8176] tracking-wider">
                <th className="py-2.5 px-3">Scholar</th>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">CGPA</th>
                <th className="py-2.5 px-3 text-center">Attendance</th>
                <th className="py-2.5 px-3 text-center">Trajectory</th>
                <th className="py-2.5 px-3">Recommended Faculty Action</th>
                <th className="py-2.5 px-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,122,24,0.08)] text-xs">
              {analytics.studentsRequiringAttention.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#FFF8F0]">{s.name}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#FF8C32]">{s.rollNo}</td>
                  <td className="py-3 px-3 text-[#C5B5A8] text-[11px]">{s.department}</td>
                  <td className="py-3 px-3 text-center font-bold font-mono text-[#FFE0A3]">{s.cgpa.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center font-bold font-mono text-rose-400">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30">
                      {s.attendancePct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <Badge variant={s.trend === 'Critical' ? 'red' : 'amber'} size="sm">
                      {s.trend}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-[#C5B5A8] max-w-xs truncate">
                    {s.recommendedIntervention}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onOpenIntervention(s)}
                      className="text-[11px] py-1 px-2.5 h-auto"
                    >
                      Initiate Action
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
