import { InterviewType, DifficultyLevel } from '../types/mockInterview.types';

export const TARGET_ROLES = [
  'Software Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'UI/UX Designer',
  'Business Analyst',
  'Digital Marketing',
] as const;

export const INTERVIEW_TYPE_DETAILS: Record<
  InterviewType,
  { label: string; description: string; icon: string; focus: string }
> = {
  hr: {
    label: 'HR & Cultural Fit',
    description: 'Introduction, career aspirations, strengths, weaknesses, work ethic, and culture alignment.',
    icon: 'UserCheck',
    focus: 'Self-awareness, leadership qualities, teamwork, emotional intelligence',
  },
  technical: {
    label: 'Technical Deep-Dive',
    description: 'Core concepts, algorithms, frameworks, problem-solving architectures, and debugging.',
    icon: 'Code2',
    focus: 'Technical accuracy, clarity of technical explanation, edge-case analysis',
  },
  aptitude: {
    label: 'Aptitude & Logic',
    description: 'Quantitative logic, estimation puzzles, critical reasoning, and fast mental models.',
    icon: 'BrainCircuit',
    focus: 'Structured reasoning, step-by-step breakdown, numeracy precision',
  },
  behavioral: {
    label: 'Behavioral (STAR)',
    description: 'Handling conflict, overcoming failure, team dynamics, and past project challenges.',
    icon: 'Compass',
    focus: 'Situation, Task, Action, and quantifiable Results (STAR method)',
  },
  group_discussion: {
    label: 'Case & Discussion',
    description: 'Strategic topics, market sizing, technology disruption, and articulating consensus.',
    icon: 'Users',
    focus: 'Structured perspective, balanced arguments, collaborative tone',
  },
};

export const DIFFICULTY_DETAILS: Record<
  DifficultyLevel,
  { label: string; description: string; badgeColor: string }
> = {
  beginner: {
    label: 'Beginner',
    description: 'Foundational concepts, basic project review, and straightforward problem solving.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'Practical scenario handling, performance trade-offs, and in-depth conceptual rigor.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
  advanced: {
    label: 'Advanced',
    description: 'System design, edge cases, distributed bottlenecks, high-stakes decision framing.',
    badgeColor: 'border-[#FF7A18]/40 text-[#FF8C32] bg-[#FF7A18]/15',
  },
};

export const QUESTION_COUNT_OPTIONS = [5, 8, 10] as const;

export const PRESET_COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'Deloitte',
  'TCS',
  'Meta',
  'Apple',
  'McKinsey',
  'NVIDIA',
  'Startup / Early Stage',
];

export const ROLE_KEY_AREAS: Record<string, string[]> = {
  'Software Developer': ['DSA & Time Complexity', 'OOP Design Patterns', 'REST API Architecture', 'Database Normalization & SQL', 'Concurrency & Git'],
  'Data Analyst': ['SQL Window Functions & Joins', 'Data Cleaning & Wrangling', 'Power BI / Tableau Storytelling', 'Statistical Hypothesis Testing', 'KPI Metrics Definition'],
  'AI/ML Engineer': ['Model Evaluation (Precision/Recall/F1)', 'Overfitting & Regularization', 'Supervised vs Unsupervised ML', 'Deep Learning & Transformers', 'MLOps & Deployment Ethics'],
  'UI/UX Designer': ['Design Systems & Tokens', 'User Research & Personas', 'Accessibility (WCAG)', 'Information Architecture', 'Usability Testing & Micro-interactions'],
  'Business Analyst': ['Requirement Gathering (BRD/FRD)', 'SWOT & Root Cause Analysis', 'Agile Scrum & User Stories', 'Stakeholder Negotiation', 'Process Flow Diagrams (BPMN)'],
  'Digital Marketing': ['CAC, LTV & ROAS Metrics', 'SEO Keyword Strategy', 'A/B Testing Funnel Optimization', 'Social Media Analytics', 'Email Automation & Retargeting'],
};
