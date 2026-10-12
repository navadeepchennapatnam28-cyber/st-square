import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { studentService } from '../services/studentService';
import { LMSCourseActivity } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LMSPage: React.FC = () => {
  const { showToast } = useApp();
  const [courses, setCourses] = useState<LMSCourseActivity[]>([]);

  useEffect(() => {
    studentService.getLMSActivity().then(setCourses);
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              LMS Learning Portal Telemetry
            </h1>
            <Badge variant="orange">Moodle / Canvas Synced</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Module completion velocity, submission timeliness, and continuous evaluation quiz scores
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast('Redirecting to LMS', 'Opening ST² Learning Management portal.', 'info')}
          icon={<ExternalLink size={14} />}
        >
          Open ST² LMS
        </Button>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="orange" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">Assignment Score Avg</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">85.5%</span>
          </div>
          <p className="text-[11px] text-[#10B981] mt-2 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> +4.2% higher than class mean
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">On-Time Submission</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#10B981] font-display">94%</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            16 of 17 assignments submitted early
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">Learning Portal Streak</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FF8C32] font-display">14</span>
            <span className="text-xs text-[#8F8176]">Days</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2 flex items-center gap-1">
            <Flame size={12} className="text-[#FF7A18]" /> Active daily learner
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">Video Lectures Watched</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">52</span>
            <span className="text-xs text-[#8F8176]">/ 65</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            80% Video Completion Rate
          </p>
        </GlassCard>
      </div>

      {/* Courses Progress List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#FFF8F0] font-display">
          Active Semester 6 Modules & Assignments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => {
            const completionPct = Math.round((course.completedModules / course.totalModules) * 100);
            return (
              <GlassCard key={course.courseCode} variant="default" className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#FFF8F0] font-display">{course.courseName}</h4>
                    <p className="text-[11px] text-[#FF8C32] font-mono mt-0.5">{course.courseCode}</p>
                  </div>
                  <Badge variant={course.assignmentScore >= 85 ? 'green' : 'amber'} size="sm">
                    {course.assignmentScore}% Avg
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#8F8176]">
                    <span>Module Syllabus Progress</span>
                    <span className="text-[#FFF8F0] font-mono font-bold">
                      {course.completedModules} / {course.totalModules} Units ({completionPct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#100D0B] border border-[rgba(255,122,24,0.15)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] transition-all shadow-[0_0_8px_rgba(255,122,24,0.4)]"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-[rgba(255,122,24,0.12)] flex items-center justify-between text-[11px] text-[#8F8176]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#FF7A18]" /> Last active: {course.lastActive}
                  </span>
                  <button
                    onClick={() => showToast('Opening Course Modules', `Accessing ${course.courseName} materials.`, 'info')}
                    className="text-[#FF8C32] hover:text-[#FFB347] font-semibold cursor-pointer"
                  >
                    View Materials &rarr;
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
