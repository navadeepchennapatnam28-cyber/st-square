import React from 'react';
import { NavLink } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, ArrowRight, Code2, Rocket, Target, ShieldAlert, Users, LineChart, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const WelcomeBanner: React.FC = () => {
  const { student, isDemoMode } = useApp();

  return (
    <GlassCard variant="default" className="p-6 md:p-8 relative overflow-hidden mb-6 border-[rgba(255,122,24,0.30)] bg-gradient-to-r from-[#24130D]/95 via-[#1A120E]/90 to-[#100D0B]/95 shadow-[0_12px_40px_rgba(255,122,24,0.12)]">
      {/* Subtle warm orange ambient light at far right edge */}
      <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#FF7A18]/15 rounded-full blur-3xl pointer-events-none" />
      {/* Amber ambient light at bottom left */}
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-[#FF8C32]/12 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          {/* Tag row */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FF8C32] text-xs font-bold tracking-wide">
              <Sparkles size={12} className="text-[#FFB347]" />
              ST² COCKPIT
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFB347]/15 border border-[#FFB347]/30 text-[#FFB347] text-xs font-semibold">
              Sem 6 · School of Computing & AI
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldAlert size={12} />
              LIVE COHORT TELEMETRY
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFF8F0] font-display tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-[#FFF8F0] via-[#FFE0A3] to-[#FF8C32] bg-clip-text text-transparent">{student.name}</span> ☀️
          </h1>

          <p className="text-sm sm:text-base text-[#C5B5A8] mt-1.5 max-w-2xl font-normal">
            "Continuous growth through precise diagnostic analytics and proactive interventions."
          </p>
          <p className="text-xs text-[#C5B5A8] mt-1">
            Target Role: <span className="text-[#FFF8F0] font-medium">Software Development Engineer</span> • Placement Season: <span className="text-[#FFB347] font-medium">Winter 2026</span> • Student ID: <span className="text-[#FFF8F0] font-mono font-medium">ST-2024-8842</span>
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <NavLink to="/st-point">
            <Button variant="primary" size="sm" icon={<Sparkles size={15} />}>
              ST Point AI
            </Button>
          </NavLink>
          <NavLink to="/students">
            <Button variant="secondary" size="sm" icon={<Users size={15} />}>
              Cohort Directory
            </Button>
          </NavLink>
          <NavLink to="/reports">
            <Button variant="outline" size="sm" icon={<FileSpreadsheet size={15} />}>
              Audit Reports
            </Button>
          </NavLink>
        </div>
      </div>
    </GlassCard>
  );
};
