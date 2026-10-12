import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PerformanceCharts } from '../components/charts/PerformanceCharts';
import { studentService } from '../services/studentService';
import { SemesterCGPA } from '../types';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  Calculator,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AcademicPage: React.FC = () => {
  const { student, showToast } = useApp();
  const [academics, setAcademics] = useState<SemesterCGPA[]>([]);
  const [targetGPA, setTargetGPA] = useState('9.0');
  const [projectedRequired, setProjectedRequired] = useState<string | null>(null);

  useEffect(() => {
    studentService.getAcademicRecords().then(setAcademics);
  }, []);

  const totalCredits = academics.reduce((acc, curr) => acc + curr.credits, 0);
  const currentCGPA = academics.length ? academics[academics.length - 1].cgpa : 8.84;

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetGPA);
    if (isNaN(target) || target < 8.0 || target > 10.0) {
      showToast('Invalid GPA', 'Please enter a target GPA between 8.0 and 10.0', 'error');
      return;
    }

    const currentWeight = 134 * currentCGPA;
    const requiredSGPA = (target * 174 - currentWeight) / 40;
    setProjectedRequired(requiredSGPA.toFixed(2));
    showToast('Simulation Computed', `Required average SGPA in Sem 7 & 8: ${requiredSGPA.toFixed(2)}`, 'info');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Academic Performance Analytics
            </h1>
            <Badge variant="orange">Verified Transcript</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Official curriculum performance telemetry for {student.name} ({student.id})
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast('Transcript Export', 'Digital grade transcript exported as signed PDF.', 'success')}
          icon={<Download size={14} />}
        >
          Export Grade Card
        </Button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FF7A18]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Cumulative CGPA</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{currentCGPA}</span>
            <span className="text-xs text-[#8F8176]">/ 10.0</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <TrendingUp size={12} /> First Class with Distinction
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FF8C32]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Credits Earned</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{totalCredits}</span>
            <span className="text-xs text-[#8F8176]">/ 160 Total</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            83.7% Degree Completion
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5 border-l-2 border-l-emerald-500">
          <p className="text-xs font-semibold text-[#C5B5A8]">Active Backlogs</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-emerald-400 font-display">0</span>
            <span className="text-xs text-[#8F8176]">Arrears</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> 100% Clear Academic Record
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FFB347]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Batch Percentile</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FF8C32] font-display">Top 8%</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            Rank 28 of 340 CSE Cohort
          </p>
        </GlassCard>
      </div>

      {/* Main Chart */}
      <PerformanceCharts data={academics} />

      {/* Semester Breakdown Table */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">Semester Progression Ledger</h3>
          </div>
          <span className="text-xs text-[#8F8176]">Autonomous University Grading Standard</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,122,24,0.25)] text-[#C5B5A8] font-semibold">
                <th className="pb-3 pl-2">Semester</th>
                <th className="pb-3">Credits</th>
                <th className="pb-3">SGPA</th>
                <th className="pb-3">Cumulative CGPA</th>
                <th className="pb-3">Standing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,248,240,0.06)]">
              {academics.map((row) => (
                <tr key={row.semester} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 pl-2 font-bold text-[#FFF8F0] font-mono">{row.semester}</td>
                  <td className="py-3 text-[#C5B5A8]">{row.credits} Credits</td>
                  <td className="py-3 font-semibold text-[#FF8C32] font-mono">{row.sgpa.toFixed(2)}</td>
                  <td className="py-3 font-bold text-[#FFF8F0] font-mono">{row.cgpa.toFixed(2)}</td>
                  <td className="py-3">
                    <Badge variant={row.sgpa >= 8.5 ? 'green' : 'orange'} size="sm">
                      {row.sgpa >= 9.0 ? 'Elite Distinction' : row.sgpa >= 8.5 ? 'Distinction' : 'First Class'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* What-If CGPA Simulator */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-[#FF7A18]" />
          <h3 className="text-base font-bold text-[#FFF8F0] font-display">What-If CGPA Projection Calculator</h3>
        </div>
        <p className="text-xs text-[#C5B5A8] mb-4">
          Estimate the required SGPA needed in remaining semesters (7 & 8) to reach your target graduation CGPA
        </p>

        <form onSubmit={handleSimulate} className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#C5B5A8] mb-1">
              Desired Final CGPA (out of 10.0)
            </label>
            <input
              type="number"
              step="0.05"
              min="8.0"
              max="10.0"
              value={targetGPA}
              onChange={(e) => setTargetGPA(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18] font-mono w-40"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="mt-5">
            Calculate Projection
          </Button>

          {projectedRequired !== null && (
            <div className="p-3 rounded-xl bg-[#FF7A18]/10 border border-[rgba(255,122,24,0.30)] text-xs mt-4 sm:mt-0 flex-1">
              <span className="text-[#C5B5A8]">Target SGPA Required in Sem 7 & 8: </span>
              <strong className="text-[#FF8C32] font-mono text-sm ml-1">{projectedRequired}</strong>
              <span className="text-[#8F8176] ml-2 text-[11px]">
                {parseFloat(projectedRequired) <= 10.0
                  ? '(Achievable with targeted A / A+ grades)'
                  : '(Mathematically exceeds 10.0 ceiling)'}
              </span>
            </div>
          )}
        </form>
      </GlassCard>
    </div>
  );
};
