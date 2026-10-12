import React, { useState } from 'react';
import {
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Badge } from '../../../components/ui/Badge';
import { AnswerEvaluationResult } from '../types/mockInterview.types';

interface InterviewFeedbackCardProps {
  evaluation: AnswerEvaluationResult;
  isFinishing: boolean;
  onProceed: () => void;
}

export const InterviewFeedbackCard: React.FC<InterviewFeedbackCardProps> = ({
  evaluation,
  isFinishing,
  onProceed,
}) => {
  const [modelAnswerExpanded, setModelAnswerExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 7.0) return 'text-[#FF8C32] border-[#FF7A18]/30 bg-[#FF7A18]/10';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  };

  return (
    <GlassCard variant="orange" className="p-6 md:p-8 mt-6 border-[#FF7A18]/40 shadow-[0_0_30px_rgba(255,122,24,0.18)]">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(255,248,240,0.10)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="orange" size="sm">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF8C32]" />
              AI EVALUATION COMPLETE
            </Badge>
            <span className="text-[11px] text-[#C5B5A8] font-medium">Rubric Breakdown</span>
          </div>
          <h3 className="text-xl font-black text-[#FFF8F0] tracking-tight">
            Performance Breakdown & Coaching
          </h3>
        </div>

        {/* Proceed Action Button */}
        <button
          type="button"
          onClick={onProceed}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] hover:brightness-110 active:scale-[0.98] text-[#100D0B] font-extrabold text-xs shadow-[0_0_18px_rgba(255,122,24,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isFinishing ? 'View Final Report' : 'Proceed to Next Question'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 4 Score Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <div className={`p-4 rounded-xl border text-center ${getScoreColor(evaluation.answer_score)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5B5A8] mb-1">
            Overall Answer
          </div>
          <div className="text-2xl font-black">{evaluation.answer_score} <span className="text-xs font-normal opacity-75">/ 10</span></div>
        </div>

        <div className={`p-4 rounded-xl border text-center ${getScoreColor(evaluation.technical_score)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5B5A8] mb-1">
            Technical Depth
          </div>
          <div className="text-2xl font-black">{evaluation.technical_score} <span className="text-xs font-normal opacity-75">/ 10</span></div>
        </div>

        <div className={`p-4 rounded-xl border text-center ${getScoreColor(evaluation.communication_score)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5B5A8] mb-1">
            Communication
          </div>
          <div className="text-2xl font-black">{evaluation.communication_score} <span className="text-xs font-normal opacity-75">/ 10</span></div>
        </div>

        <div className={`p-4 rounded-xl border text-center ${getScoreColor(evaluation.confidence_score)}`}>
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#C5B5A8] mb-1">
            Confidence
          </div>
          <div className="text-2xl font-black">{evaluation.confidence_score} <span className="text-xs font-normal opacity-75">/ 10</span></div>
        </div>
      </div>

      {/* Feedback Panels: What went well + What could improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths / What was good */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
          <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ThumbsUp size={14} />
            <span>What Was Good</span>
          </div>
          <p className="text-xs text-[#FFF8F0]/90 leading-relaxed">
            {evaluation.what_was_good}
          </p>
        </div>

        {/* Constructive / What could improve */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={14} />
            <span>What Could Improve</span>
          </div>
          <p className="text-xs text-[#FFF8F0]/90 leading-relaxed">
            {evaluation.what_could_improve}
          </p>
        </div>
      </div>

      {/* Model Answer Accordion */}
      <div className="mt-5 pt-4 border-t border-[rgba(255,248,240,0.08)]">
        <button
          type="button"
          onClick={() => setModelAnswerExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] hover:border-[#FF7A18]/50 text-xs font-bold text-[#FFE0A3] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-[#FF8C32]" />
            <span>Exemplary Model Response (Recommended Benchmark)</span>
          </div>
          {modelAnswerExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {modelAnswerExpanded && (
          <div className="mt-2.5 p-4 rounded-xl bg-[#100D0B] border border-[rgba(255,248,240,0.10)] text-xs text-[#FFF8F0] leading-relaxed whitespace-pre-line animate-fadeIn">
            {evaluation.improved_answer}
          </div>
        )}
      </div>

      {/* Bottom Proceed Action for easy mobile access */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onProceed}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] hover:brightness-110 active:scale-[0.98] text-[#100D0B] font-extrabold text-xs shadow-[0_0_20px_rgba(255,122,24,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isFinishing ? 'Finish & View Comprehensive Report' : 'Proceed to Next Question'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </GlassCard>
  );
};
