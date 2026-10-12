import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Building2,
  Briefcase,
  Layers,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Play,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  InterviewType,
  DifficultyLevel,
  InterviewSetupPayload,
} from '../types/mockInterview.types';
import {
  TARGET_ROLES,
  INTERVIEW_TYPE_DETAILS,
  DIFFICULTY_DETAILS,
  QUESTION_COUNT_OPTIONS,
  PRESET_COMPANIES,
} from '../utils/constants';
import { mockInterviewService } from '../services/mockInterviewService';
import { useApp } from '../../../context/AppContext';

interface InterviewSetupFormProps {
  onSuccess?: (interviewId: string) => void;
}

export const InterviewSetupForm: React.FC<InterviewSetupFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { student, showToast } = useApp();

  const [selectedRole, setSelectedRole] = useState<string>('Software Developer');
  const [customRole, setCustomRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('technical');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCustomRole = selectedRole === 'Custom';
  const effectiveRole = isCustomRole ? customRole.trim() : selectedRole;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isCustomRole && !customRole.trim()) {
      setError('Please specify your custom target role.');
      return;
    }

    setIsLoading(true);
    try {
      const payload: InterviewSetupPayload = {
        target_role: effectiveRole,
        target_company: targetCompany.trim() || undefined,
        interview_type: interviewType,
        difficulty,
        total_questions: questionCount,
      };

      const result = await mockInterviewService.createInterview(student.id, payload);
      showToast(
        'Session Initialized',
        `Starting ${effectiveRole} mock interview (${questionCount} questions).`,
        'success'
      );

      if (onSuccess) {
        onSuccess(result.interview.id);
      } else {
        navigate(`/mock-interview/session/${result.interview.id}`);
      }
    } catch {
      setError('Failed to initialize mock interview. Please try again.');
      showToast('Error', 'Could not create interview session.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchQuickDemo = async () => {
    setIsLoading(true);
    try {
      mockInterviewService.ensureSeedData(student.id);
      // Navigate to the in-progress AI/ML interview
      showToast('Demo Loaded', 'Resuming pre-configured AI/ML Technical Interview demo session.', 'info');
      navigate('/mock-interview/session/interview-seed-aiml-03');
    } catch {
      showToast('Error', 'Could not launch demo session.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard variant="orange" className="p-6 md:p-8 relative overflow-hidden">
      {/* Ambient background bloom */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF7A18]/15 via-[#FF8C32]/05 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,248,240,0.10)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="orange" size="sm">
              <Bot className="w-3.5 h-3.5 mr-1 text-[#FF8C32]" />
              AI SIMULATION STUDIO
            </Badge>
            <span className="text-[11px] text-[#C5B5A8] font-medium">Adaptive Question Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#FFF8F0] tracking-tight">
            Configure Your Mock Interview
          </h2>
          <p className="text-xs text-[#C5B5A8] mt-1 max-w-xl">
            Select your target career parameters. ST² generates adaptive, company-tailored questions, records your responses, and scores your technical depth and communication.
          </p>
        </div>

        {/* Quick Demo Option for Judges / Testers */}
        <button
          type="button"
          onClick={handleLaunchQuickDemo}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18]/20 via-[#FF8C32]/15 to-[#FFB347]/10 border border-[#FF7A18]/40 hover:border-[#FF8C32] text-xs font-bold text-[#FFE0A3] hover:text-white transition-all shadow-sm flex items-center gap-2 group cursor-pointer"
        >
          <Zap className="w-4 h-4 text-[#FFB347] group-hover:scale-110 transition-transform" />
          <span>Launch Demo Session</span>
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* 1. Target Role & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Role */}
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#FF7A18]" />
              1. Target Career Role <span className="text-[#FF7A18]">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,248,240,0.15)] text-[#FFF8F0] text-sm focus:outline-none focus:border-[#FF7A18] focus:ring-1 focus:ring-[#FF7A18]/30 transition-all cursor-pointer"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role} className="bg-[#100D0B] text-[#FFF8F0]">
                  {role}
                </option>
              ))}
              <option value="Custom" className="bg-[#100D0B] text-[#FFE0A3]">
                + Other / Custom Role...
              </option>
            </select>

            {isCustomRole && (
              <input
                type="text"
                placeholder="Enter custom role title (e.g. Cloud Security Engineer)..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="mt-2.5 w-full px-4 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] placeholder:text-[#C5B5A8]/50 text-xs focus:outline-none focus:border-[#FF7A18] focus:ring-1 focus:ring-[#FF7A18]/30 transition-all"
              />
            )}
          </div>

          {/* Target Company (Optional) */}
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF8C32]" />
              2. Target Organization <span className="text-[11px] font-normal text-[#C5B5A8]">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Google, Deloitte, Microsoft, or Tech Startup..."
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,248,240,0.15)] text-[#FFF8F0] placeholder:text-[#C5B5A8]/50 text-sm focus:outline-none focus:border-[#FF7A18] focus:ring-1 focus:ring-[#FF7A18]/30 transition-all"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-[#8F8176] self-center mr-1">Popular:</span>
              {PRESET_COMPANIES.slice(0, 5).map((comp) => (
                <button
                  type="button"
                  key={comp}
                  onClick={() => setTargetCompany(comp)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    targetCompany === comp
                      ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-[#FFE0A3]'
                      : 'bg-white/5 border-white/10 text-[#C5B5A8] hover:text-[#FFF8F0] hover:border-white/20'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Interview Type */}
        <div>
          <label className="block text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#FFB347]" />
            3. Interview Pillar & Type <span className="text-[#FF7A18]">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(INTERVIEW_TYPE_DETAILS) as [InterviewType, typeof INTERVIEW_TYPE_DETAILS[InterviewType]][]).map(
              ([typeKey, detail]) => {
                const isSelected = interviewType === typeKey;
                return (
                  <div
                    key={typeKey}
                    onClick={() => setInterviewType(typeKey)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#24130D] via-[#1A120E] to-[#100D0B] border-[#FF7A18] shadow-[0_0_16px_rgba(255,122,24,0.25)]'
                        : 'bg-[#100D0B]/70 border-[rgba(255,248,240,0.10)] hover:border-[rgba(255,248,240,0.20)] hover:bg-[#1A120E]/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#FF7A18] shadow-[0_0_8px_#FF7A18]" />
                    )}
                    <h4 className="text-xs font-bold text-[#FFF8F0] mb-1">{detail.label}</h4>
                    <p className="text-[11px] text-[#C5B5A8] leading-relaxed line-clamp-2">
                      {detail.description}
                    </p>
                    <div className="mt-2 pt-2 border-t border-white/5 text-[10px] text-[#8F8176]">
                      Focus: <span className="text-[#FFE0A3]">{detail.focus}</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* 3. Difficulty Level & Question Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF7A18]" />
              4. Rigor & Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(DIFFICULTY_DETAILS) as [DifficultyLevel, typeof DIFFICULTY_DETAILS[DifficultyLevel]][]).map(
                ([diffKey, diff]) => {
                  const isSelected = difficulty === diffKey;
                  return (
                    <button
                      type="button"
                      key={diffKey}
                      onClick={() => setDifficulty(diffKey)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-[#FFE0A3] shadow-sm font-bold'
                          : 'bg-[#100D0B] border-[rgba(255,248,240,0.12)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                      }`}
                    >
                      <div className="text-xs font-bold capitalize">{diff.label}</div>
                      <div className="text-[10px] opacity-75 mt-0.5 hidden sm:block">
                        {diffKey === 'beginner' ? 'Foundational' : diffKey === 'intermediate' ? 'Balanced' : 'High Stakes'}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF8C32]" />
              5. Session Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUESTION_COUNT_OPTIONS.map((count) => {
                const isSelected = questionCount === count;
                return (
                  <button
                    type="button"
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-[#FFE0A3] shadow-sm font-bold'
                        : 'bg-[#100D0B] border-[rgba(255,248,240,0.12)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                    }`}
                  >
                    <div className="text-xs font-bold">{count} Questions</div>
                    <div className="text-[10px] opacity-75 mt-0.5">
                      ~{count * 3} Mins
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-[rgba(255,248,240,0.10)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#C5B5A8]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Progress automatically saves after every question. Resumable anytime.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] hover:brightness-110 active:scale-[0.98] text-[#100D0B] font-extrabold text-sm shadow-[0_0_24px_rgba(255,122,24,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#100D0B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                <span>Initialize AI Interview</span>
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </GlassCard>
  );
};
