import React from 'react';
import {
  Clock,
  Pause,
  Play,
  Briefcase,
  Building2,
  Layers,
  LogOut,
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { MockInterview } from '../types/mockInterview.types';
import { DIFFICULTY_DETAILS, INTERVIEW_TYPE_DETAILS } from '../utils/constants';

interface InterviewProgressProps {
  interview: MockInterview;
  currentQuestionNumber: number;
  totalQuestions: number;
  timerSeconds: number;
  isTimerPaused: boolean;
  onToggleTimer: () => void;
  onExit: () => void;
}

export const InterviewProgress: React.FC<InterviewProgressProps> = ({
  interview,
  currentQuestionNumber,
  totalQuestions,
  timerSeconds,
  isTimerPaused,
  onToggleTimer,
  onExit,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const percent = Math.min(
    100,
    Math.round(((currentQuestionNumber - 1) / totalQuestions) * 100)
  );

  const diffInfo = DIFFICULTY_DETAILS[interview.difficulty];
  const typeInfo = INTERVIEW_TYPE_DETAILS[interview.interview_type];

  return (
    <div className="w-full glass-panel p-4 md:p-5 rounded-2xl mb-6 border border-[rgba(255,122,24,0.25)] shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Role and Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="orange" size="md">
            <Briefcase className="w-3.5 h-3.5 mr-1 text-[#FF8C32]" />
            {interview.target_role}
          </Badge>

          {interview.target_company && (
            <Badge variant="gray" size="md">
              <Building2 className="w-3.5 h-3.5 mr-1 text-[#C5B5A8]" />
              {interview.target_company}
            </Badge>
          )}

          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${diffInfo.badgeColor}`}
          >
            {diffInfo.label}
          </span>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#C5B5A8] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#FFB347]" />
            {typeInfo.label}
          </span>
        </div>

        {/* Right: Timer & Safe Exit */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Question Timer */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#100D0B] border border-[rgba(255,248,240,0.12)]">
            <div
              className={`w-2 h-2 rounded-full ${
                isTimerPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <Clock className="w-3.5 h-3.5 text-[#C5B5A8]" />
            <span className="font-mono text-xs font-bold text-[#FFF8F0]">
              {formatTime(timerSeconds)}
            </span>
            <button
              type="button"
              onClick={onToggleTimer}
              className="text-[#8F8176] hover:text-[#FFF8F0] ml-1 p-0.5 rounded cursor-pointer transition-colors"
              title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {isTimerPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          </div>

          {/* Save & Exit Button */}
          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-xs font-semibold text-[#C5B5A8] hover:text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Save & Exit</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="mt-4 pt-3 border-t border-[rgba(255,248,240,0.08)]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-[#FFF8F0]">
            Question {currentQuestionNumber} of {totalQuestions}
          </span>
          <span className="text-[11px] text-[#FF8C32] font-semibold">
            {percent}% Completed
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#100D0B] overflow-hidden border border-[rgba(255,248,240,0.08)]">
          <div
            className="h-full bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] transition-all duration-500 rounded-full"
            style={{ width: `${Math.max(6, percent)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
