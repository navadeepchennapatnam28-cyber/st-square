export type InterviewType = 'hr' | 'technical' | 'aptitude' | 'behavioral' | 'group_discussion';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type InterviewStatus = 'setup' | 'in_progress' | 'completed' | 'abandoned';

export type ReadinessAssessment = 'Not Ready' | 'Needs Practice' | 'Interview Ready';

export interface MockInterview {
  id: string;
  student_id: string;
  target_role: string;
  target_company?: string | null;
  interview_type: InterviewType;
  difficulty: DifficultyLevel;
  total_questions: number;
  current_question_number: number;
  status: InterviewStatus;
  overall_score?: number | null;
  communication_score?: number | null;
  technical_score?: number | null;
  confidence_score?: number | null;
  strengths: string[];
  weaknesses: string[];
  final_feedback?: string | null;
  started_at: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MockInterviewQuestion {
  id: string;
  interview_id: string;
  question_number: number;
  question_text: string;
  question_category: string;
  expected_topics: string[];
  created_at: string;
}

export interface MockInterviewAnswer {
  id: string;
  interview_id: string;
  question_id: string;
  student_id: string;
  answer_text: string;
  answer_score: number; // 0-10
  communication_score: number; // 0-10
  technical_score: number; // 0-10
  confidence_score: number; // 0-10
  feedback: string;
  what_was_good?: string;
  what_could_improve?: string;
  improved_answer: string;
  created_at: string;
}

export interface InterviewSetupPayload {
  target_role: string;
  target_company?: string;
  interview_type: InterviewType;
  difficulty: DifficultyLevel;
  total_questions: number;
  is_demo?: boolean;
}

export interface AnswerEvaluationResult {
  answer_score: number; // 0-10
  communication_score: number; // 0-10
  technical_score: number; // 0-10
  confidence_score: number; // 0-10
  what_was_good: string;
  what_could_improve: string;
  improved_answer: string;
  feedback: string;
}

export interface FinalReportSummary {
  overall_score: number; // 0-100
  communication_score: number; // 0-100
  technical_score: number; // 0-100
  confidence_score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  frequently_repeated_mistakes: string[];
  readiness_assessment: ReadinessAssessment;
  next_step_plan: string[];
  recommended_topics: string[];
  final_feedback: string;
}

export interface CompleteInterviewSessionData {
  interview: MockInterview;
  questions: MockInterviewQuestion[];
  answers: MockInterviewAnswer[];
  report?: FinalReportSummary;
}
