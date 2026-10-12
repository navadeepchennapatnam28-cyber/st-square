import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { studentService } from '../services/studentService';
import { PlacementBreakdown } from '../types';
import {
  Briefcase,
  CheckCircle2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const PlacementPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [placement, setPlacement] = useState<PlacementBreakdown | null>(null);

  useEffect(() => {
    studentService.getPlacementBreakdown().then(setPlacement);
  }, []);

  if (!placement) return null;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Placement Readiness Cockpit
            </h1>
            <Badge variant="orange">Campus Recruitment 2026</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Target Role: <strong className="text-[#FFF8F0]">{placement.targetRole}</strong> • Eligible Companies: <strong className="text-[#FF8C32]">{placement.eligibleCompaniesCount} Firms</strong>
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/pro-code')}
          icon={<ArrowRight size={14} />}
        >
          Practice for OA Tests
        </Button>
      </div>

      {/* Main Readiness Score Banner */}
      <GlassCard variant="default" className="p-6 relative overflow-hidden bg-gradient-to-r from-[#1A120E] via-[#24130D] to-[#100D0B] border border-[rgba(255,122,24,0.30)]">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FF7A18]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-[#FF8C32]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#FF8C32] uppercase tracking-wider">
              Composite Readiness Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-[#FFF8F0] font-display">
                {placement.readinessScore}%
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingUp size={14} /> Tier-1 Product Company Ready
              </span>
            </div>
            <p className="text-xs text-[#C5B5A8] mt-2 max-w-xl">
              Calculated across technical DSA coding speed, quantitative aptitude accuracy, HR communication fluency, and verified resume ATS keywords.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[#100D0B]/60 border border-[rgba(255,248,240,0.08)]">
              <span className="text-[10px] text-[#8F8176] uppercase font-bold">Mocks Finished</span>
              <p className="text-xl font-extrabold text-[#FFF8F0] font-display mt-0.5">
                {placement.mockInterviewsCompleted} <span className="text-xs text-[#8F8176]">Rounds</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#100D0B]/60 border border-[rgba(255,248,240,0.08)]">
              <span className="text-[10px] text-[#8F8176] uppercase font-bold">Resume ATS</span>
              <p className="text-xl font-extrabold text-emerald-400 font-display mt-0.5">
                {placement.resumeScore} <span className="text-xs text-[#8F8176]">/ 100</span>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillar Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[rgba(255,248,240,0.08)]">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#C5B5A8]">DSA Coding</span>
              <span className="font-bold text-[#FF7A18] font-mono">{placement.codingScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#FF7A18]" style={{ width: `${placement.codingScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#C5B5A8]">Quantitative Aptitude</span>
              <span className="font-bold text-[#FF8C32] font-mono">{placement.aptitudeScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#FF8C32]" style={{ width: `${placement.aptitudeScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#C5B5A8]">Communication</span>
              <span className="font-bold text-emerald-400 font-mono">{placement.communicationScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${placement.communicationScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#C5B5A8]">Resume ATS Match</span>
              <span className="font-bold text-[#FFB347] font-mono">{placement.resumeScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-[#FFB347]" style={{ width: `${placement.resumeScore}%` }} />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Eligible Recruiting Companies */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">
              Upcoming Tier-1 Campus Recruitment Drives
            </h3>
          </div>
          <Badge variant="orange" size="sm">Campus Placement Drive 2026</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,122,24,0.25)] text-[#C5B5A8] font-semibold">
                <th className="pb-3 pl-2">Company & Role</th>
                <th className="pb-3">Compensation CTC</th>
                <th className="pb-3">Online Assessment Date</th>
                <th className="pb-3">Eligibility Requirement</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,248,240,0.06)]">
              {placement.companiesList.map((comp) => (
                <tr key={comp.name} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-3 pl-2">
                    <p className="font-bold text-[#FFF8F0] text-sm">{comp.name}</p>
                    <p className="text-[11px] text-[#8F8176]">{comp.role}</p>
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{comp.packageLPA}</td>
                  <td className="py-3 font-mono text-[#C5B5A8]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#FF8C32]" /> {comp.testDate}
                    </span>
                  </td>
                  <td className="py-3">
                    <Badge variant={comp.eligibilityStatus === 'Eligible' ? 'green' : 'orange'} size="sm">
                      {comp.eligibilityStatus}
                    </Badge>
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast('Drive Registered', `Saved reminder for ${comp.name} assessment.`, 'success')}
                    >
                      Prepare &rarr;
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
