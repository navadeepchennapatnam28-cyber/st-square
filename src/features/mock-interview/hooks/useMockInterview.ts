import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MockInterview,
  MockInterviewQuestion,
  MockInterviewAnswer,
  AnswerEvaluationResult,
} from '../types/mockInterview.types';
import { mockInterviewService } from '../services/mockInterviewService';
import { useApp } from '../../../context/AppContext';

export const useMockInterview = (interviewId: string) => {
  const { student, showToast } = useApp();
  const navigate = useNavigate();

  const [interview, setInterview] = useState<MockInterview | null>(null);
  const [questions, setQuestions] = useState<MockInterviewQuestion[]>([]);
  const [answers, setAnswers] = useState<MockInterviewAnswer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<MockInterviewQuestion | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active answer text for the current question
  const [answerText, setAnswerText] = useState('');

  // Immediate feedback card state
  const [showingFeedback, setShowFeedback] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState<AnswerEvaluationResult | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // Timer states (elapsed time in seconds)
  const [questionTimerSeconds, setQuestionTimerSeconds] = useState(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load session data
  const loadSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await mockInterviewService.getSessionData(interviewId, student.id);
      if (!data) {
        setError('Interview session not found or you do not have permission to access it.');
        setIsLoading(false);
        return;
      }

      setInterview(data.interview);
      setQuestions(data.questions);
      setAnswers(data.answers);

      // Determine active question
      const answeredQIds = new Set(data.answers.map((a) => a.question_id));
      const nextUnanswered = data.questions.find((q) => !answeredQIds.has(q.id));

      if (nextUnanswered) {
        setCurrentQuestion(nextUnanswered);
        setShowFeedback(false);
      } else if (data.interview.status === 'completed') {
        // Already completed, navigate to report
        navigate(`/mock-interview/report/${interviewId}`, { replace: true });
        return;
      } else if (data.questions.length > 0) {
        // All existing loaded questions answered but not marked completed yet
        setCurrentQuestion(data.questions[data.questions.length - 1]);
      }
    } catch {
      setError('Could not load interview session.');
    } finally {
      setIsLoading(false);
    }
  }, [interviewId, student.id, navigate]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Timer interval effect
  useEffect(() => {
    if (isLoading || showingFeedback || isTimerPaused || interview?.status === 'completed') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setQuestionTimerSeconds((prev) => prev + 1);
      setTotalTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, showingFeedback, isTimerPaused, interview?.status]);

  // Submit answer
  const submitAnswer = async () => {
    if (!currentQuestion || !interview) return;
    if (!answerText.trim() || answerText.trim().length < 15) {
      showToast('Answer Too Brief', 'Please provide a more detailed response (at least 15 characters).', 'error');
      return;
    }

    setIsEvaluating(true);
    try {
      const result = await mockInterviewService.submitAnswer({
        interview_id: interview.id,
        question_id: currentQuestion.id,
        student_id: student.id,
        answer_text: answerText,
      });

      // Update local state
      setAnswers((prev) => [...prev, result.answer]);
      setInterview(result.updatedInterview);
      setLatestFeedback(result.evaluation);
      setShowFeedback(true);
      setIsFinishing(result.isFinished);

      if (result.nextQuestion) {
        setQuestions((prev) => [...prev, result.nextQuestion!]);
      }

      showToast(
        'Answer Evaluated',
        `Score: ${result.evaluation.answer_score}/10 — Review AI feedback below.`,
        'success'
      );
    } catch {
      showToast('Evaluation Error', 'Failed to evaluate answer. Please try again.', 'error');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Move to next question or report
  const proceedNext = () => {
    if (isFinishing) {
      navigate(`/mock-interview/report/${interviewId}`);
      return;
    }

    // Find next unanswered question
    const answeredQIds = new Set(answers.map((a) => a.question_id));
    const nextQ = questions.find((q) => !answeredQIds.has(q.id) && q.id !== currentQuestion?.id);

    if (nextQ) {
      setCurrentQuestion(nextQ);
      setAnswerText('');
      setQuestionTimerSeconds(0);
      setShowFeedback(false);
      setLatestFeedback(null);
    } else {
      // Completed!
      navigate(`/mock-interview/report/${interviewId}`);
    }
  };

  // Abandon session
  const abandonSession = async () => {
    if (!interview) return;
    try {
      await mockInterviewService.abandonInterview(interview.id, student.id);
      showToast('Interview Abandoned', 'Session saved to your history archive.', 'info');
      navigate('/mock-interview');
    } catch {
      showToast('Error', 'Could not abandon session.', 'error');
    }
  };

  return {
    interview,
    questions,
    answers,
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
    totalTimerSeconds,
    isTimerPaused,
    togglePauseTimer: () => setIsTimerPaused((prev) => !prev),
    submitAnswer,
    proceedNext,
    abandonSession,
  };
};
