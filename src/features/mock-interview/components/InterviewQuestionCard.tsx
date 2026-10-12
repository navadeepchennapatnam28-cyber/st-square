import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Tag,
  Lightbulb,
} from 'lucide-react';
import { GlassCard } from '../../../components/ui/GlassCard';
import { Badge } from '../../../components/ui/Badge';
import { MockInterviewQuestion } from '../types/mockInterview.types';

interface InterviewQuestionCardProps {
  question: MockInterviewQuestion;
  totalQuestions: number;
}

export const InterviewQuestionCard: React.FC<InterviewQuestionCardProps> = ({
  question,
  totalQuestions,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(question.question_text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(question.question_text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <GlassCard variant="orange" className="p-6 md:p-8 relative overflow-hidden">
      {/* Ambient decorative glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#FF7A18]/12 via-[#FFB347]/05 to-transparent blur-3xl pointer-events-none" />

      {/* Top Meta Line */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="orange" size="md">
            QUESTION {String(question.question_number).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
          </Badge>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#100D0B] border border-[rgba(255,248,240,0.12)] text-[#FFE0A3] flex items-center gap-1.5">
            <Tag size={12} className="text-[#FF8C32]" />
            {question.question_category}
          </span>
        </div>

        {/* Audio Speech & Copy Question Controls */}
        <div className="flex items-center gap-1.5">
          {'speechSynthesis' in window && (
            <button
              type="button"
              onClick={handleSpeak}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-[#FF7A18]/25 border-[#FF7A18] text-[#FFE0A3] animate-pulse'
                  : 'bg-white/5 border-white/10 text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/10'
              }`}
              title={isSpeaking ? 'Stop Audio Read-Aloud' : 'Read Question Aloud'}
            >
              {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#C5B5A8] hover:text-[#FFF8F0] hover:bg-white/10 transition-all cursor-pointer"
            title="Copy Question"
          >
            {hasCopied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="my-3">
        <h3 className="text-lg md:text-2xl font-black text-[#FFF8F0] tracking-tight leading-snug">
          "{question.question_text}"
        </h3>
      </div>

      {/* Expected Topics / Rubric Guidance Chips */}
      {question.expected_topics && question.expected_topics.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[rgba(255,248,240,0.08)]">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C5B5A8] uppercase tracking-wider mb-2">
            <Lightbulb size={13} className="text-[#FFB347]" />
            <span>Key Evaluation Pillars to Cover:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.expected_topics.map((topic, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFE0A3] font-medium"
              >
                • {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
};
