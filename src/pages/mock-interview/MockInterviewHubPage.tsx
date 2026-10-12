import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Play,
  Trophy,
  History,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Badge } from '../../components/ui/Badge';
import { InterviewSetupForm } from '../../features/mock-interview/components/InterviewSetupForm';
import { InterviewHistoryList } from '../../features/mock-interview/components/InterviewHistoryList';
import { useInterviewHistory } from '../../features/mock-interview/hooks/useInterviewHistory';
import { useApp } from '../../context/AppContext';

export const MockInterviewHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { student } = useApp();
  const [activeTab, setActiveTab] = useState<'setup' | 'history'>('setup');

  const {
    interviews,
    isLoading,
    filter,
    setFilter,
    deleteInterview,
    stats,
  } = useInterviewHistory();

  return (
    <div className="space-y-6 pb-14 animate-in fade-in duration-300">
      {/* 1. Header & Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              AI Mock Interview Studio
            </h1>
            <Badge variant="orange">ST² Career Engine</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Simulate realistic technical, behavioral, and HR interviews tailored to top companies with instant AI scoring.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#1A120E] border border-[rgba(255,122,24,0.30)] shadow-inner self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'setup'
                ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-[#100D0B] shadow-md'
                : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
            }`}
          >
            <Sparkles size={13} />
            <span>New Interview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-[#100D0B] shadow-md'
                : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
            }`}
          >
            <History size={13} />
            <span>History ({stats.total})</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF7A18]/15 border border-[#FF7A18]/30 flex items-center justify-center text-[#FF8C32] shrink-0">
            <Bot size={20} />
          </div>
          <div>
            <div className="text-lg md:text-xl font-black text-[#FFF8F0] font-mono leading-none">
              {stats.total}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#C5B5A8] mt-1">
              Total Sessions
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Trophy size={20} />
          </div>
          <div>
            <div className="text-lg md:text-xl font-black text-emerald-400 font-mono leading-none">
              {stats.completedCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#C5B5A8] mt-1">
              Completed Audits
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF8C32]/15 border border-[#FF8C32]/30 flex items-center justify-center text-[#FF8C32] shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-lg md:text-xl font-black text-[#FF8C32] font-mono leading-none">
              {stats.inProgressCount}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#C5B5A8] mt-1">
              In-Progress
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFB347]/15 border border-[#FFB347]/30 flex items-center justify-center text-[#FFB347] shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-lg md:text-xl font-black text-[#FFE0A3] font-mono leading-none">
              {stats.avgScore > 0 ? `${stats.avgScore}%` : 'N/A'}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#C5B5A8] mt-1">
              Avg Readiness
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 3. In-Progress Resume Alert Banner (if an interview is currently active) */}
      {stats.latestInProgress && activeTab === 'setup' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#24130D] via-[#1A120E] to-[#100D0B] border border-[#FF7A18]/40 shadow-[0_0_20px_rgba(255,122,24,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF7A18]/20 border border-[#FF7A18]/50 text-[#FF8C32] flex items-center justify-center shrink-0">
              <Play size={16} className="fill-current" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#FFF8F0] flex items-center gap-2">
                <span>Active Session Waiting: {stats.latestInProgress.target_role}</span>
                {stats.latestInProgress.target_company && (
                  <span className="text-[#FFE0A3]">({stats.latestInProgress.target_company})</span>
                )}
              </div>
              <p className="text-[11px] text-[#C5B5A8] mt-0.5">
                Paused at Question {stats.latestInProgress.current_question_number} of {stats.latestInProgress.total_questions}. Your progress is saved.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/mock-interview/session/${stats.latestInProgress!.id}`)}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] hover:brightness-110 text-[#100D0B] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Resume Interview</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* 4. Active Tab Content */}
      {activeTab === 'setup' ? (
        <InterviewSetupForm onSuccess={(id) => navigate(`/mock-interview/session/${id}`)} />
      ) : (
        <GlassCard className="p-6 md:p-8">
          <InterviewHistoryList
            interviews={interviews}
            isLoading={isLoading}
            filter={filter}
            setFilter={setFilter}
            onDelete={deleteInterview}
          />
        </GlassCard>
      )}
    </div>
  );
};
