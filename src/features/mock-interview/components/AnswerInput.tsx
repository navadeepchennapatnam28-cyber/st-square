import React from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';

interface AnswerInputProps {
  answerText: string;
  setAnswerText: (val: string) => void;
  onSubmit: () => void;
  isEvaluating: boolean;
  interviewType: string;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  answerText,
  setAnswerText,
  onSubmit,
  isEvaluating,
  interviewType,
}) => {
  const words = answerText.trim() ? answerText.trim().split(/\s+/).length : 0;
  const chars = answerText.length;
  const isTooShort = words < 8;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter submits
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isEvaluating && !isTooShort) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <GlassCard className="p-6 md:p-8 mt-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A18]" />
          Your Verbal / Textual Response
        </label>

        {/* Counter and status */}
        <div className="flex items-center gap-3 text-xs">
          <span className={`font-mono ${isTooShort ? 'text-amber-400' : 'text-emerald-400 font-semibold'}`}>
            {words} Words
          </span>
          <span className="text-[#8F8176]">|</span>
          <span className="font-mono text-[#C5B5A8]">{chars} Characters</span>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={7}
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isEvaluating}
          placeholder="Type your detailed answer here. Focus on clear structure, professional vocabulary, and concrete technical or situational details... (Tip: Press Ctrl+Enter to submit)"
          className="w-full p-4 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] focus:border-[#FF8C32] focus:ring-1 focus:ring-[#FF7A18]/40 text-[#FFF8F0] placeholder:text-[#8F8176] text-sm leading-relaxed transition-all resize-y min-h-[160px] disabled:opacity-50"
        />
      </div>

      {/* Coaching tip box */}
      <div className="mt-3 p-3 rounded-xl bg-[#1A120E] border border-[rgba(255,248,240,0.08)] flex items-start gap-2.5 text-xs text-[#C5B5A8]">
        <HelpCircle className="w-4 h-4 text-[#FFB347] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {interviewType === 'hr' || interviewType === 'behavioral' ? (
            <span>
              <strong className="text-[#FFE0A3]">Pro Tip:</strong> Structure your story using the{' '}
              <strong className="text-white">STAR</strong> framework (Situation, Task, Action, and quantifiable Result) to demonstrate extreme ownership.
            </span>
          ) : (
            <span>
              <strong className="text-[#FFE0A3]">Pro Tip:</strong> State your high-level approach first, highlight space/time trade-offs or constraints, and explain how you would handle edge cases.
            </span>
          )}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mt-5 pt-4 border-t border-[rgba(255,248,240,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setAnswerText('')}
          disabled={isEvaluating || !answerText}
          className="text-xs text-[#8F8176] hover:text-[#C5B5A8] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
        >
          <RotateCcw size={13} />
          <span>Clear Response</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isEvaluating || isTooShort}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] hover:brightness-110 active:scale-[0.98] text-[#100D0B] font-extrabold text-sm shadow-[0_0_20px_rgba(255,122,24,0.35)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEvaluating ? (
            <>
              <div className="w-4 h-4 border-2 border-[#100D0B] border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Technical Rigor...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              <span>Submit Answer & Evaluate</span>
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
};
