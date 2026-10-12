import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Home,
  Printer,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Building2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Layers,
  Target,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  MockInterview,
  MockInterviewQuestion,
  MockInterviewAnswer,
  FinalReportSummary,
} from '../types/mockInterview.types';
import { generateFinalReport } from '../utils/scoring';

interface InterviewReportProps {
  interview: MockInterview;
  questions: MockInterviewQuestion[];
  answers: MockInterviewAnswer[];
}

export const InterviewReport: React.FC<InterviewReportProps> = ({
  interview,
  questions,
  answers,
}) => {
  const navigate = useNavigate();
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Generate or read final report summary
  const report: FinalReportSummary = generateFinalReport(
    interview.target_role,
    interview.target_company,
    answers
  );

  const getReadinessBadge = () => {
    switch (report.readiness_assessment) {
      case 'Interview Ready':
        return (
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-extrabold text-xs shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            INTERVIEW READY
          </span>
        );
      case 'Needs Practice':
        return (
          <span className="px-3.5 py-1.5 rounded-full bg-[#FF7A18]/20 border border-[#FF7A18]/50 text-[#FF8C32] font-extrabold text-xs shadow-[0_0_15px_rgba(255,122,24,0.25)] flex items-center gap-1.5">
            <TrendingUp size={13} />
            NEEDS PRACTICE
          </span>
        );
      default:
        return (
          <span className="px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 font-extrabold text-xs flex items-center gap-1.5">
            <AlertTriangle size={13} />
            NOT READY
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <GlassCard variant="orange" className="p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF7A18]/20 via-[#FF8C32]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,248,240,0.10)]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="orange" size="md">
                <Trophy className="w-3.5 h-3.5 mr-1 text-[#FF8C32]" />
                COMPREHENSIVE AUDIT REPORT
              </Badge>
              {getReadinessBadge()}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#FFF8F0] tracking-tight">
              {interview.target_role} Simulation Results
            </h1>
            <p className="text-xs text-[#C5B5A8] mt-1 flex flex-wrap items-center gap-2">
              {interview.target_company && (
                <span className="text-[#FFE0A3] font-bold flex items-center gap-1">
                  <Building2 size={13} />
                  Target: {interview.target_company}
                </span>
              )}
              <span>•</span>
              <span className="capitalize">{interview.interview_type} Pillar</span>
              <span>•</span>
              <span className="capitalize">{interview.difficulty} Rigor</span>
              <span>•</span>
              <span>{answers.length} Questions Evaluated</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#FFF8F0] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/mock-interview')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] hover:brightness-110 text-[#100D0B] font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle size={14} />
              <span>Start New Interview</span>
            </button>
          </div>
        </div>

        {/* 2. Top Metric Score Ring & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
          {/* Main Composite Score */}
          <div className="lg:col-span-1 p-5 rounded-2xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8] mb-2">
              Composite Readiness Score
            </div>
            <div className="relative my-2">
              <div className="w-24 h-24 rounded-full border-4 border-[#FF7A18]/30 border-t-[#FF7A18] border-r-[#FF8C32] flex items-center justify-center shadow-[0_0_24px_rgba(255,122,24,0.25)]">
                <span className="text-3xl font-black text-[#FFF8F0] font-mono">
                  {report.overall_score}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#FFE0A3] mt-1">
              Score out of 100
            </span>
          </div>

          {/* 3 Pillar Bars */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Technical */}
            <div className="p-4 rounded-xl bg-[#1A120E] border border-[rgba(255,248,240,0.10)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#FFF8F0]">Technical / Content</span>
                  <span className="font-mono font-bold text-[#FF8C32]">{report.technical_score}%</span>
                </div>
                <p className="text-[10px] text-[#C5B5A8] mb-3">Accuracy, edge cases & algorithmic depth</p>
              </div>
              <div className="w-full h-2 rounded-full bg-[#100D0B] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] rounded-full"
                  style={{ width: `${report.technical_score}%` }}
                />
              </div>
            </div>

            {/* Communication */}
            <div className="p-4 rounded-xl bg-[#1A120E] border border-[rgba(255,248,240,0.10)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#FFF8F0]">Communication</span>
                  <span className="font-mono font-bold text-emerald-400">{report.communication_score}%</span>
                </div>
                <p className="text-[10px] text-[#C5B5A8] mb-3">Structure, clarity, and concise tone</p>
              </div>
              <div className="w-full h-2 rounded-full bg-[#100D0B] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${report.communication_score}%` }}
                />
              </div>
            </div>

            {/* Confidence */}
            <div className="p-4 rounded-xl bg-[#1A120E] border border-[rgba(255,248,240,0.10)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#FFF8F0]">Confidence</span>
                  <span className="font-mono font-bold text-[#FFB347]">{report.confidence_score}%</span>
                </div>
                <p className="text-[10px] text-[#C5B5A8] mb-3">Assertive delivery & lack of hedging</p>
              </div>
              <div className="w-full h-2 rounded-full bg-[#100D0B] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFB347] to-amber-300 rounded-full"
                  style={{ width: `${report.confidence_score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="mt-5 p-4 rounded-xl bg-[#1A120E]/70 border border-[rgba(255,122,24,0.20)] text-xs text-[#FFF8F0]/90 leading-relaxed">
          <strong className="text-[#FFE0A3]">Executive Summary: </strong>
          {report.final_feedback}
        </div>
      </GlassCard>

      {/* 3. Strengths, Weaknesses & Frequently Repeated Mistakes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strengths */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>Key Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-[#FFF8F0]/90">
            {report.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/25 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle size={16} />
            <span>Areas for Improvement</span>
          </div>
          <ul className="space-y-2 text-xs text-[#FFF8F0]/90">
            {report.weaknesses.map((weak, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Repeated Mistakes */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/25 bg-rose-500/5">
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <Target size={16} />
            <span>Frequent Anti-Patterns</span>
          </div>
          <ul className="space-y-2 text-xs text-[#FFF8F0]/90">
            {report.frequently_repeated_mistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Actionable 4-Step Next Plan & Study Topics */}
      <GlassCard variant="orange" className="p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="orange" size="sm">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#FF8C32]" />
            PERSONALIZED GROWTH ROADMAP
          </Badge>
          <span className="text-xs text-[#C5B5A8]">Targeted for {interview.target_role}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 4-Step Action Plan */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#FFF8F0] uppercase tracking-wider">
              Immediate Action Items
            </h4>
            {report.next_step_plan.map((step, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#100D0B] border border-[rgba(255,248,240,0.10)] flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FFE0A3] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs text-[#FFF8F0] leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>

          {/* Recommended Topics */}
          <div>
            <h4 className="text-sm font-bold text-[#FFF8F0] uppercase tracking-wider mb-3">
              Recommended Study Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.recommended_topics.map((topic, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.30)] text-[#FFE0A3] text-xs font-semibold flex items-center gap-1.5"
                >
                  <BookOpen size={12} className="text-[#FF8C32]" />
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* 5. Full Question-by-Question Detailed Review Accordion */}
      <GlassCard className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[rgba(255,248,240,0.10)]">
          <div>
            <h3 className="text-lg font-black text-[#FFF8F0] tracking-tight">
              Detailed Question & Answer Audit
            </h3>
            <p className="text-xs text-[#C5B5A8] mt-0.5">
              Review your submitted responses alongside evaluation scores and exemplary benchmark answers.
            </p>
          </div>
          <span className="text-xs font-bold text-[#FF8C32]">{answers.length} Entries</span>
        </div>

        <div className="space-y-4">
          {questions.map((q, index) => {
            const ans = answers.find((a) => a.question_id === q.id);
            const isExpanded = expandedQuestionId === q.id || (!expandedQuestionId && index === 0);

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-[rgba(255,248,240,0.12)] bg-[#100D0B] overflow-hidden transition-all"
              >
                {/* Header bar */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedQuestionId(isExpanded && expandedQuestionId === q.id ? null : q.id)
                  }
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FFE0A3] font-bold text-xs flex items-center justify-center shrink-0">
                      {q.question_number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#FFF8F0] line-clamp-1">
                        {q.question_text}
                      </h4>
                      <span className="text-[11px] text-[#C5B5A8]">
                        Category: {q.question_category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {ans && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#FF7A18]/15 border border-[#FF7A18]/30 text-[#FFE0A3] font-mono text-xs font-bold">
                        {ans.answer_score} / 10
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && ans && (
                  <div className="p-4 md:p-6 border-t border-[rgba(255,248,240,0.08)] bg-[#1A120E]/50 space-y-4">
                    {/* Student Answer */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8] mb-1.5">
                        Your Submitted Response:
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#100D0B] border border-white/5 text-xs text-[#FFF8F0] leading-relaxed whitespace-pre-line">
                        {ans.answer_text}
                      </div>
                    </div>

                    {/* Feedback Breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                        <strong className="text-emerald-400 block mb-1">What went well:</strong>
                        <span className="text-[#FFF8F0]/90">{ans.what_was_good || ans.feedback}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                        <strong className="text-amber-400 block mb-1">Room for improvement:</strong>
                        <span className="text-[#FFF8F0]/90">{ans.what_could_improve || 'Incorporate more concrete metrics.'}</span>
                      </div>
                    </div>

                    {/* Model Answer */}
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFE0A3] mb-1.5 flex items-center gap-1.5">
                        <Trophy size={13} className="text-[#FF8C32]" />
                        <span>Recommended Model Benchmark:</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#100D0B] border border-[#FF7A18]/25 text-xs text-[#FFE0A3] leading-relaxed whitespace-pre-line">
                        {ans.improved_answer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* 6. Navigation Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A120E] border border-[rgba(255,122,24,0.30)]">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#FFF8F0] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home size={14} />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate('/mock-interview')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#FFE0A3] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Try Another Role</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/mock-interview')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] hover:brightness-110 text-[#100D0B] font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Start New Interview</span>
          </button>
        </div>
      </div>
    </div>
  );
};
