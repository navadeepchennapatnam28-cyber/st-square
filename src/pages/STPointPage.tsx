import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { InsightCard } from '../components/st-point/InsightCard';
import { stPointService } from '../services/stPointService';
import { STPointInsight } from '../types';
import {
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const STPointPage: React.FC = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<STPointInsight[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const loadData = async () => {
    const list = await stPointService.getInsights();
    setInsights(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInsights = filterCategory === 'All'
    ? insights
    : insights.filter(i => i.category === filterCategory);

  const cohortComparisonData = [
    { metric: 'Academic CGPA', studentScore: 88.4, cohortMedian: 81.2 },
    { metric: 'DSA Coding Speed', studentScore: 78.0, cohortMedian: 72.5 },
    { metric: 'Quantitative Aptitude', studentScore: 85.0, cohortMedian: 76.0 },
    { metric: 'Verbal Communication', studentScore: 88.0, cohortMedian: 79.4 },
    { metric: 'Project Readiness', studentScore: 86.0, cohortMedian: 68.0 },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              ST Point — Personal Improvement Engine
            </h1>
            <Badge variant="orange">Rule-Based Diagnostic Intelligence</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Algorithmic gap analysis evaluating your academic, coding, and placement metrics to build a personalized growth roadmap
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/pro-code')}
          icon={<Code2 size={14} />}
        >
          Practice Top Priority (DSA)
        </Button>
      </div>

      {/* Engine Overview Glass Banner */}
      <GlassCard variant="default" className="p-6 relative overflow-hidden bg-gradient-to-r from-[#1A120E]/95 via-[#24130D]/90 to-[#100D0B]/95 border border-[rgba(255,122,24,0.30)] shadow-[0_0_25px_rgba(255,122,24,0.10)]">
        {/* Subtle warm orange ambient light at far right edge */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FF7A18]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-[#FF8C32]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF8C32] uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Diagnostic Executive Summary
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#FFF8F0] font-display leading-snug">
              "Your coding score (78%) is slightly lower than your other assessed skills (88%)."
            </h2>
            <p className="text-xs sm:text-sm text-[#C5B5A8] mt-2 leading-relaxed">
              Transparent Rule Signal: Students targeting Tier-1 Product Engineering SDE roles benefit from an 85%+ DSA assessment score. Regular 45-minute daily practice on Medium Dynamic Programming problems will close this gap before placement season.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 size={12} /> Strong Theoretical Standing (8.84 CGPA)
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#FF7A18]/15 border border-[rgba(255,122,24,0.30)] text-[#FF8C32] font-medium flex items-center gap-1">
                <ShieldCheck size={12} /> Safe Attendance Buffer (89.4%)
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#FFB347]/15 border border-[rgba(255,179,71,0.30)] text-[#FFB347] font-medium flex items-center gap-1">
                <Zap size={12} /> Primary Action: Pro Code DSA Sprint
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#100D0B]/90 border border-[rgba(255,122,24,0.25)] shrink-0 text-center lg:w-56 shadow-inner">
            <p className="text-[11px] text-[#8F8176] uppercase font-bold tracking-wider">Improvement Quotient</p>
            <p className="text-3xl font-extrabold text-[#FF8C32] font-display mt-1">84.2</p>
            <p className="text-[10px] text-emerald-400 mt-1 font-semibold">+6.4 pts this month</p>
            <div className="mt-3 pt-3 border-t border-[rgba(255,122,24,0.15)] text-[11px] text-[#C5B5A8]">
              <strong className="text-[#FFF8F0]">{insights.filter(i => i.status === 'Completed').length}</strong> of {insights.length} Actions Completed
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Cohort Comparison Benchmark Chart */}
      <GlassCard variant="default" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#FFF8F0] font-display">Student Performance vs Batch Cohort</h3>
              <Badge variant="orange" size="sm">Percentile Benchmark</Badge>
            </div>
            <p className="text-xs text-[#C5B5A8] mt-0.5">
              Normalized comparison of your performance (0-100 scale) against the 6th Semester CSE batch median
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#FFF8F0] font-semibold">
              <span className="w-3 h-3 rounded-sm bg-[#FF7A18]" /> Your Score
            </span>
            <span className="flex items-center gap-1.5 text-[#C5B5A8]">
              <span className="w-3 h-3 rounded-sm bg-[#FFB347]/30 border border-[#FFB347]/50" /> Batch Median
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cohortComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,122,24,0.08)" />
              <XAxis dataKey="metric" stroke="#8F8176" fontSize={11} tickLine={false} />
              <YAxis domain={[50, 100]} stroke="#8F8176" fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#100D0B] border border-[rgba(255,122,24,0.30)] p-3 rounded-xl shadow-2xl text-xs backdrop-blur-xl">
                        <p className="font-bold text-[#FFF8F0] mb-1.5">{d.metric}</p>
                        <p className="text-[#FF8C32] flex justify-between gap-4 font-bold">
                          <span>Your Score:</span> {d.studentScore}%
                        </p>
                        <p className="text-[#C5B5A8] flex justify-between gap-4">
                          <span>Batch Median:</span> {d.cohortMedian}%
                        </p>
                        <p className="text-emerald-400 text-[10px] mt-1 pt-1 border-t border-[rgba(255,122,24,0.15)]">
                          +{ (d.studentScore - d.cohortMedian).toFixed(1) }% ahead of peer average
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="studentScore" name="Your Score" fill="#FF7A18" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cohortMedian" name="Batch Median" fill="rgba(255, 179, 71, 0.35)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Filter Tabs for Action Items */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#FFF8F0] font-display">
              Personalized Actionable Priorities
            </h3>
            <p className="text-xs text-[#C5B5A8]">
              Every priority contains transparent signals, suggested milestones, and direct deep links
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.25)]">
            {['All', 'Coding', 'Attendance', 'Placement', 'Academic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-black font-bold shadow-[0_0_12px_rgba(255,122,24,0.4)]'
                    : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Actionable Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onUpdate={loadData}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
