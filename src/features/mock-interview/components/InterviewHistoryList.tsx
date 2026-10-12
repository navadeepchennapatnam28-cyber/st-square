import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Play,
  FileText,
  Trash2,
  Clock,
  Briefcase,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Badge } from '../../../components/ui/Badge';
import { MockInterview } from '../types/mockInterview.types';
import { DIFFICULTY_DETAILS, INTERVIEW_TYPE_DETAILS } from '../utils/constants';

interface InterviewHistoryListProps {
  interviews: MockInterview[];
  isLoading: boolean;
  filter: 'all' | 'completed' | 'in_progress';
  setFilter: (f: 'all' | 'completed' | 'in_progress') => void;
  onDelete: (id: string) => void;
}

export const InterviewHistoryList: React.FC<InterviewHistoryListProps> = ({
  interviews,
  isLoading,
  filter,
  setFilter,
  onDelete,
}) => {
  const navigate = useNavigate();

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(255,248,240,0.10)]">
        <div className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider">
          Past Interview History ({interviews.length})
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#100D0B] border border-[rgba(255,248,240,0.10)] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/40 shadow-sm'
                : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'completed'
                ? 'bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/40 shadow-sm'
                : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'in_progress'
                ? 'bg-[#FF7A18]/20 text-[#FFE0A3] border border-[#FF7A18]/40 shadow-sm'
                : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#C5B5A8] flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-[#FF7A18] border-t-transparent rounded-full animate-spin" />
          <span>Loading student interview archives...</span>
        </div>
      ) : interviews.length === 0 ? (
        /* Empty State */
        <GlassCard className="p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FF7A18]/15 border border-[#FF7A18]/30 flex items-center justify-center mx-auto mb-3 text-[#FF8C32]">
            <HelpCircle size={24} />
          </div>
          <h4 className="text-sm font-bold text-[#FFF8F0] mb-1">
            No Interview Records Found
          </h4>
          <p className="text-xs text-[#C5B5A8] max-w-sm mx-auto">
            You haven't initiated any mock interviews under this filter yet. Configure a target role above to begin.
          </p>
        </GlassCard>
      ) : (
        /* List of Interview Cards */
        <div className="grid grid-cols-1 gap-3.5">
          {interviews.map((item) => {
            const isCompleted = item.status === 'completed';
            const diffInfo = DIFFICULTY_DETAILS[item.difficulty];
            const typeInfo = INTERVIEW_TYPE_DETAILS[item.interview_type];

            return (
              <GlassCard
                key={item.id}
                className="p-4 md:p-5 hover:border-[rgba(255,122,24,0.40)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Left: Metadata & Role */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm md:text-base font-black text-[#FFF8F0] flex items-center gap-1.5">
                      <Briefcase size={15} className="text-[#FF7A18]" />
                      {item.target_role}
                    </span>

                    {item.target_company && (
                      <span className="text-xs text-[#FFE0A3] font-bold px-2 py-0.5 rounded-md bg-[#100D0B] border border-white/10 flex items-center gap-1">
                        <Building2 size={12} className="text-[#FF8C32]" />
                        {item.target_company}
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diffInfo.badgeColor}`}
                    >
                      {diffInfo.label}
                    </span>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#C5B5A8]">
                      {typeInfo.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#C5B5A8]">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#8F8176]" />
                      {formatDate(item.created_at)}
                    </span>
                    <span>•</span>
                    <span>
                      {isCompleted
                        ? `${item.total_questions} Questions Answered`
                        : `Question ${item.current_question_number} of ${item.total_questions}`}
                    </span>
                  </div>
                </div>

                {/* Right: Scores & Actions */}
                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  {/* Score badge for completed */}
                  {isCompleted && item.overall_score !== null && item.overall_score !== undefined && (
                    <div className="text-right mr-1">
                      <div className="text-lg md:text-xl font-black text-emerald-400 font-mono leading-none">
                        {item.overall_score}%
                      </div>
                      <div className="text-[9px] uppercase font-bold text-[#8F8176] mt-0.5">
                        Readiness
                      </div>
                    </div>
                  )}

                  {/* Resume or View Report button */}
                  {isCompleted ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/mock-interview/report/${item.id}`)}
                      className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#FFF8F0] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={13} className="text-[#FF8C32]" />
                      <span>View Report</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(`/mock-interview/session/${item.id}`)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] hover:brightness-110 text-[#100D0B] font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play size={13} className="fill-current" />
                      <span>Resume Session</span>
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-xl text-[#8F8176] hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
