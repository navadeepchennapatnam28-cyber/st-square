import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { InterviewProgress } from '../../features/mock-interview/components/InterviewProgress';
import { InterviewQuestionCard } from '../../features/mock-interview/components/InterviewQuestionCard';
import { AnswerInput } from '../../features/mock-interview/components/AnswerInput';
import { InterviewFeedbackCard } from '../../features/mock-interview/components/InterviewFeedbackCard';
import { useMockInterview } from '../../features/mock-interview/hooks/useMockInterview';

export const MockInterviewSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exitModalOpen, setExitModalOpen] = useState(false);

  const {
    interview,
    currentQuestion,
    answerText,
    setAnswerText,
    isLoading,
    isEvaluating,
    error,
    showingFeedback,
    latestFeedback,
    isFinishing,
    questionTimerSeconds,
    isTimerPaused,
    togglePauseTimer,
    submitAnswer,
    proceedNext,
    abandonSession,
  } = useMockInterview(id || '');

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-12 text-center animate-in fade-in">
        <div className="w-10 h-10 border-3 border-[#FF7A18] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-base font-bold text-[#FFF8F0]">
          Preparing AI Interview Environment...
        </h3>
        <p className="text-xs text-[#C5B5A8]">
          Synthesizing role-tailored technical questions and configuring scoring rubrics.
        </p>
      </div>
    );
  }

  // Error / Unauthorized state
  if (error || !interview || !currentQuestion) {
    return (
      <div className="max-w-xl mx-auto py-16 animate-in fade-in">
        <GlassCard className="p-8 text-center border-rose-500/30">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
            <ShieldAlert size={26} />
          </div>
          <h2 className="text-lg font-black text-[#FFF8F0] mb-2">
            Session Access Denied or Not Found
          </h2>
          <p className="text-xs text-[#C5B5A8] mb-6 leading-relaxed">
            {error || 'You can only access mock interview sessions initiated by your account.'}
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/mock-interview')}
            icon={<ArrowLeft size={14} />}
          >
            Return to Mock Interview Studio
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
      {/* 1. Progress Bar & Active Session Headers */}
      <InterviewProgress
        interview={interview}
        currentQuestionNumber={currentQuestion.question_number}
        totalQuestions={interview.total_questions}
        timerSeconds={questionTimerSeconds}
        isTimerPaused={isTimerPaused}
        onToggleTimer={togglePauseTimer}
        onExit={() => setExitModalOpen(true)}
      />

      {/* 2. Active Question Card */}
      <InterviewQuestionCard
        question={currentQuestion}
        totalQuestions={interview.total_questions}
      />

      {/* 3. Feedback Card (If just submitted) OR Answer Input (If answering) */}
      {showingFeedback && latestFeedback ? (
        <InterviewFeedbackCard
          evaluation={latestFeedback}
          isFinishing={isFinishing}
          onProceed={proceedNext}
        />
      ) : (
        <AnswerInput
          answerText={answerText}
          setAnswerText={setAnswerText}
          onSubmit={submitAnswer}
          isEvaluating={isEvaluating}
          interviewType={interview.interview_type}
        />
      )}

      {/* Exit / Save Modal */}
      <Modal
        isOpen={exitModalOpen}
        onClose={() => setExitModalOpen(false)}
        title="Leave Interview Session?"
      >
        <div className="space-y-4 pt-1">
          <p className="text-xs text-[#C5B5A8] leading-relaxed">
            Your progress on completed questions is safely preserved. You can resume this session anytime from the Mock Interview hub.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[rgba(255,248,240,0.10)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExitModalOpen(false)}
            >
              Continue Interview
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/mock-interview')}
              icon={<LogOut size={13} />}
            >
              Save & Return to Studio
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={abandonSession}
            >
              Abandon Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
