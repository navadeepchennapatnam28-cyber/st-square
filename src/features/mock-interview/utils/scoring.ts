import {
  MockInterviewAnswer,
  FinalReportSummary,
  ReadinessAssessment,
} from '../types/mockInterview.types';
import { ROLE_KEY_AREAS } from './constants';

export const calculateAggregateScores = (
  answers: MockInterviewAnswer[]
): {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  confidence_score: number;
} => {
  if (!answers.length) {
    return {
      overall_score: 0,
      communication_score: 0,
      technical_score: 0,
      confidence_score: 0,
    };
  }

  const avgAnswer =
    answers.reduce((acc, curr) => acc + (curr.answer_score || 0), 0) /
    answers.length;
  const avgComm =
    answers.reduce((acc, curr) => acc + (curr.communication_score || 0), 0) /
    answers.length;
  const avgTech =
    answers.reduce((acc, curr) => acc + (curr.technical_score || 0), 0) /
    answers.length;
  const avgConf =
    answers.reduce((acc, curr) => acc + (curr.confidence_score || 0), 0) /
    answers.length;

  // Convert 0-10 scale to 0-100 scale with rounding
  const communication_score = Math.round(avgComm * 10);
  const technical_score = Math.round(avgTech * 10);
  const confidence_score = Math.round(avgConf * 10);

  // Overall weighted composite (40% Technical, 30% Communication, 20% Confidence, 10% Raw Answer)
  const weighted =
    technical_score * 0.4 +
    communication_score * 0.3 +
    confidence_score * 0.2 +
    avgAnswer * 10 * 0.1;

  const overall_score = Math.min(100, Math.max(0, Math.round(weighted)));

  return {
    overall_score,
    communication_score,
    technical_score,
    confidence_score,
  };
};

export const evaluateReadiness = (overallScore: number): ReadinessAssessment => {
  if (overallScore >= 80) return 'Interview Ready';
  if (overallScore >= 60) return 'Needs Practice';
  return 'Not Ready';
};

export const generateFinalReport = (
  targetRole: string,
  targetCompany: string | null | undefined,
  answers: MockInterviewAnswer[]
): FinalReportSummary => {
  const scores = calculateAggregateScores(answers);
  const readiness = evaluateReadiness(scores.overall_score);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const repeatedMistakes: string[] = [];

  // Communication checks
  if (scores.communication_score >= 80) {
    strengths.push('Articulate and structured delivery with professional tone');
  } else if (scores.communication_score < 65) {
    weaknesses.push('Conciseness and clarity: explanations tend to be verbose or unfocused');
    repeatedMistakes.push('Missing executive summary at the start of answers');
  }

  // Technical checks
  if (scores.technical_score >= 80) {
    strengths.push('Strong grasp of foundational concepts and accurate terminology');
  } else {
    weaknesses.push('Deeper technical justification: need concrete edge cases and quantifiable metrics');
    repeatedMistakes.push('Skipping time/space complexity or system constraints');
  }

  // Confidence checks
  if (scores.confidence_score >= 80) {
    strengths.push('High assertiveness, direct problem handling, and confident decision making');
  } else {
    weaknesses.push('Hedging language (e.g. "I think maybe", "probably") undermines authority');
    repeatedMistakes.push('Hesitant opening statements when encountering novel questions');
  }

  // Fallbacks if lists are empty
  if (strengths.length === 0) {
    strengths.push('Demonstrates solid motivation and willingness to break down complex tasks');
    strengths.push('Understands the business impact of the target role');
  }

  if (weaknesses.length === 0) {
    weaknesses.push('Could incorporate more industry benchmark statistics and architectural trade-offs');
  }

  if (repeatedMistakes.length === 0) {
    repeatedMistakes.push('Could state the STAR framework (Situation, Task, Action, Result) more explicitly');
  }

  // Role-specific recommended topics
  const defaultRoleTopics = ROLE_KEY_AREAS[targetRole] || [
    'System Architecture & Flow',
    'Edge-case Identification',
    'Quantifiable Impact Metrics',
    'Behavioral STAR Scenarios',
  ];

  // 4-Step Next Preparation Plan
  const next_step_plan: string[] = [
    `Review ${defaultRoleTopics[0]} fundamentals and practice 3 live timed verbal drills.`,
    'Adopt the STAR methodology for all scenario-based questions (focus on quantifiable results).',
    scores.technical_score < 75
      ? 'Strengthen core theoretical edge cases and write out step-by-step pseudo solutions before speaking.'
      : 'Conduct a peer mock interview focusing on rapid system architecture design.',
    `Review the specific engineering principles and recent news from ${targetCompany || 'target top-tier tech companies'}.`,
  ];

  const companyMention = targetCompany ? ` for ${targetCompany}` : '';
  const final_feedback =
    scores.overall_score >= 80
      ? `Outstanding performance! You displayed exceptional readiness${companyMention}. Your technical articulation is sharp, confident, and role-ready. Focus on fine-tuning architectural edge cases to secure a top-tier offer.`
      : scores.overall_score >= 60
      ? `Good foundation with demonstrable promise${companyMention}. With focused practice on structural clarity (STAR framework) and eliminating hedging phrases, you will easily reach competitive interview readiness.`
      : `You have completed the interview session, which is a vital first step. Consistent daily drill practice on foundational concepts and structured 2-minute answers will dramatically boost your scores.`;

  return {
    overall_score: scores.overall_score,
    communication_score: scores.communication_score,
    technical_score: scores.technical_score,
    confidence_score: scores.confidence_score,
    strengths,
    weaknesses,
    frequently_repeated_mistakes: repeatedMistakes,
    readiness_assessment: readiness,
    next_step_plan,
    recommended_topics: defaultRoleTopics,
    final_feedback,
  };
};
