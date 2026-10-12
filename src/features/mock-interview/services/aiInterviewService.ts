import {
  InterviewType,
  DifficultyLevel,
  MockInterviewQuestion,
  AnswerEvaluationResult,
} from '../types/mockInterview.types';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

/**
 * Question Repository curated by role, type, and difficulty.
 * Used for instant, ultra-reliable fallback generation when server-side AI endpoints are unavailable.
 */
interface QuestionTemplate {
  text: string;
  category: string;
  expectedTopics: string[];
  difficulty: DifficultyLevel;
  type: InterviewType;
  roles?: string[];
}

const QUESTION_BANK: QuestionTemplate[] = [
  // --- SOFTWARE DEVELOPER TECHNICAL ---
  {
    text: 'Can you explain the difference between a process and a thread, and how context switching impacts CPU cache performance?',
    category: 'Operating Systems & Concurrency',
    expectedTopics: ['Address space isolation', 'PCB vs TCB', 'Cache invalidation / TLB misses', 'Multithreading overhead'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['Software Developer'],
  },
  {
    text: 'How would you design a rate limiter for a public REST API? What algorithm (e.g. Token Bucket, Leaky Bucket) would you select and why?',
    category: 'System Design & APIs',
    expectedTopics: ['Token Bucket vs Leaky Bucket', 'Distributed state in Redis', 'HTTP 429 Too Many Requests', 'Race conditions / Concurrency'],
    difficulty: 'advanced',
    type: 'technical',
    roles: ['Software Developer'],
  },
  {
    text: 'Explain the four core principles of Object-Oriented Programming (OOP) and give a practical example where Inheritance should be favored over Composition, or vice versa.',
    category: 'Object-Oriented Programming',
    expectedTopics: ['Encapsulation, Abstraction, Inheritance, Polymorphism', 'Composition over Inheritance', 'Liskov Substitution Principle', 'Coupling reduction'],
    difficulty: 'beginner',
    type: 'technical',
    roles: ['Software Developer'],
  },
  {
    text: 'Walk me through how database indexing works using B+ Trees. Why do databases rarely use Hash indices for range queries?',
    category: 'Databases & DBMS',
    expectedTopics: ['B+ Tree node structure', 'Sorted sequential pointers', 'O(log N) lookups', 'Hash table inability to do range scans'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['Software Developer'],
  },
  {
    text: 'Describe a complex bug or production incident you encountered in one of your recent projects. How did you isolate, debug, and prevent recurrence?',
    category: 'Project Debugging & Quality',
    expectedTopics: ['Root Cause Analysis (RCA)', 'Logging/APM telemetry', 'Unit & regression testing', 'Post-mortem prevention'],
    difficulty: 'beginner',
    type: 'technical',
    roles: ['Software Developer'],
  },
  {
    text: 'What is the difference between synchronous and asynchronous I/O? How does an event loop handle non-blocking operations without spawning new OS threads?',
    category: 'Runtimes & Asynchronous Architecture',
    expectedTopics: ['Event loop queue', 'epoll / kqueue primitives', 'Call stack vs Task queue', 'Non-blocking I/O multiplexing'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['Software Developer'],
  },

  // --- DATA ANALYST TECHNICAL ---
  {
    text: 'What is the difference between RANK(), DENSE_RANK(), and ROW_NUMBER() in SQL? Provide a business scenario where DENSE_RANK() is required over ROW_NUMBER().',
    category: 'SQL & Window Functions',
    expectedTopics: ['Tied values handling', 'Partition By & Order By', 'Sales compensation / Leaderboard tiers', 'Gaps in sequential ranking'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['Data Analyst'],
  },
  {
    text: 'How do you handle severe missingness (e.g. 35% null values) in a numerical column within a customer churn dataset? When is mean imputation dangerous?',
    category: 'Data Wrangling & Cleaning',
    expectedTopics: ['MCAR vs MAR vs MNAR', 'Distortion of variance / standard deviation', 'Median or KNN imputation', 'Indicator dummy variables'],
    difficulty: 'beginner',
    type: 'technical',
    roles: ['Data Analyst'],
  },
  {
    text: 'If a company’s overall conversion rate increases while both mobile and desktop individual conversion rates decrease, what statistical phenomenon is occurring and how do you explain it to leadership?',
    category: 'Applied Statistics',
    expectedTopics: ['Simpson’s Paradox', 'Confounding variable / Traffic mix shift', 'Weighted averages across sub-populations', 'Segment-level attribution'],
    difficulty: 'advanced',
    type: 'technical',
    roles: ['Data Analyst'],
  },
  {
    text: 'Walk me through how you structure an interactive Power BI or Tableau dashboard for non-technical executive stakeholders. How do you decide what NOT to include?',
    category: 'BI & Executive Storytelling',
    expectedTopics: ['Top-down visual hierarchy', 'North Star KPI cards', 'Cognitive load reduction', 'Actionable drill-down filters'],
    difficulty: 'beginner',
    type: 'technical',
    roles: ['Data Analyst'],
  },
  {
    text: 'Explain how you would calculate Customer Lifetime Value (LTV) and Customer Acquisition Cost (CAC) payback period using SQL transactional tables.',
    category: 'Business Metrics & Modeling',
    expectedTopics: ['Average Revenue Per User (ARPU)', 'Churn rate denominator', 'Cohort cohort analysis', 'Marketing spend attribution'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['Data Analyst'],
  },

  // --- AI / ML ENGINEER TECHNICAL ---
  {
    text: 'How do you diagnose and resolve high variance (overfitting) versus high bias (underfitting) in a gradient-boosted decision tree model?',
    category: 'Machine Learning Fundamentals',
    expectedTopics: ['Train vs Validation loss curves', 'L1/L2 regularization & max depth', 'Subsampling / Learning rate tuning', 'Feature pruning'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['AI/ML Engineer'],
  },
  {
    text: 'In an imbalanced classification problem like rare fraud detection (99.8% negative, 0.2% positive), why is Accuracy misleading, and which evaluation metric would you optimize?',
    category: 'Model Evaluation Metrics',
    expectedTopics: ['Precision vs Recall vs PR-AUC', 'Cost matrix / False Negative business impact', 'F-beta score', 'Class weighting / SMOTE'],
    difficulty: 'beginner',
    type: 'technical',
    roles: ['AI/ML Engineer'],
  },
  {
    text: 'Explain the mechanism of Multi-Head Self-Attention in Transformer models. What is the mathematical purpose of scaling the dot product by sqrt(d_k)?',
    category: 'Deep Learning & Transformers',
    expectedTopics: ['Query, Key, Value matrices', 'Softmax gradient vanishing in high dimensions', 'Parallel representation subspaces', 'Contextual token embeddings'],
    difficulty: 'advanced',
    type: 'technical',
    roles: ['AI/ML Engineer'],
  },
  {
    text: 'What is data leakage in an ML pipeline, and how do you prevent target leakage during feature engineering and cross-validation?',
    category: 'ML Engineering & Pipeline Integrity',
    expectedTopics: ['Fit scaler/encoder only on training folds', 'Future data temporal leakage', 'Pipeline abstraction', 'GroupKFold for correlated entities'],
    difficulty: 'intermediate',
    type: 'technical',
    roles: ['AI/ML Engineer'],
  },
  {
    text: 'How do you monitor a production ML model for Data Drift and Concept Drift after deployment?',
    category: 'MLOps & Governance',
    expectedTopics: ['KS-Test / Population Stability Index (PSI)', 'Ground truth lag', 'Model retraining triggers', 'Fairness & demographic bias metrics'],
    difficulty: 'advanced',
    type: 'technical',
    roles: ['AI/ML Engineer'],
  },

  // --- GENERAL HR & CULTURE FIT (Applies to all roles) ---
  {
    text: 'Tell me about yourself, highlighting key academic accomplishments, technical projects, and why you are targeting this specific role.',
    category: 'Introduction & Trajectory',
    expectedTopics: ['Chronological elevator pitch', 'Key milestone projects', 'Relevance to target company/role', 'Passion and growth mindset'],
    difficulty: 'beginner',
    type: 'hr',
  },
  {
    text: 'Describe a situation where you had a significant disagreement with a teammate or project partner. How did you navigate the conversation to reach an agreement?',
    category: 'Conflict Resolution & Empathy',
    expectedTopics: ['Active listening', 'Decoupling ego from project outcome', 'Objective data-driven compromise', 'Maintaining team cohesion'],
    difficulty: 'intermediate',
    type: 'hr',
  },
  {
    text: 'What is one major constructive criticism or piece of feedback you have received in the past year, and what tangible steps did you take to improve?',
    category: 'Self-Awareness & Humility',
    expectedTopics: ['Honest vulnerability', 'Immediate action plan', 'Measurable progress or outcome', 'Ongoing monitoring habit'],
    difficulty: 'beginner',
    type: 'hr',
  },
  {
    text: 'Where do you envision yourself professionally in 3 to 5 years, and how does joining our organization accelerate that growth plan?',
    category: 'Career Vision & Alignment',
    expectedTopics: ['Technical craftsmanship depth', 'Leadership / mentorship goals', 'Domain alignment with company mission', 'Mutual value creation'],
    difficulty: 'intermediate',
    type: 'hr',
  },
  {
    text: 'Tell me about a high-pressure deadline where requirements changed late in the sprint. How did you prioritize deliverables without sacrificing quality?',
    category: 'Adaptability & Prioritization',
    expectedTopics: ['Triage methodology (Must-have vs Nice-to-have)', 'Proactive stakeholder communication', 'Pacing and burnout mitigation', 'Delivery milestone integrity'],
    difficulty: 'intermediate',
    type: 'hr',
  },

  // --- BEHAVIORAL (STAR METHOD) ---
  {
    text: 'Describe a time you failed to meet an objective or made a serious error in a project. Walk me through the Situation, Task, Action you took, and quantifiable Result.',
    category: 'Resilience & Ownership (STAR)',
    expectedTopics: ['Clear STAR breakdown', 'Extreme ownership (no external blaming)', 'Immediate remediation', 'Systemic preventive safeguards created'],
    difficulty: 'intermediate',
    type: 'behavioral',
  },
  {
    text: 'Give an example of a time you had to learn an unfamiliar technology or framework under tight time constraints to complete a project.',
    category: 'Rapid Learning & Autonomy',
    expectedTopics: ['Structured learning roadmap', 'Documentation reading & prototyping', 'Delivery under deadline', 'Sharing learnings with team'],
    difficulty: 'beginner',
    type: 'behavioral',
  },

  // --- APTITUDE & PROBLEM SOLVING ---
  {
    text: 'A product manager requests adding a feature that would double database read latency for 10% of users while increasing overall daily active users by 15%. How would you evaluate this trade-off?',
    category: 'Product Trade-offs & Logic',
    expectedTopics: ['P99 latency impact vs user growth', 'Caching & architectural mitigation', 'A/B testing cohort segmentation', 'Business ROI framework'],
    difficulty: 'intermediate',
    type: 'aptitude',
  },
  {
    text: 'Estimate the daily storage capacity required to store all text search queries processed by a major e-commerce platform in India.',
    category: 'Fermi Estimation & Numbers',
    expectedTopics: ['Population & DAU assumption', 'Queries per user assumption', 'Average bytes per query + metadata', 'Compression & redundancy multiplier'],
    difficulty: 'intermediate',
    type: 'aptitude',
  },

  // --- GROUP DISCUSSION / CASE ---
  {
    text: 'In your view, should engineering teams prioritize rapid MVP feature velocity over architectural code quality and automated testing in early-stage products?',
    category: 'Strategic Perspective & Debate',
    expectedTopics: ['Technical debt accrual vs time-to-market', 'Product-market fit milestones', 'Minimum viable testing (smoke + unit)', 'Refactoring inflection points'],
    difficulty: 'intermediate',
    type: 'group_discussion',
  },
];

export const aiInterviewService = {
  /**
   * Generates a relevant question for the active interview.
   * If a secure server-side endpoint or Supabase Edge Function is configured, calls it.
   * Otherwise uses the robust fallback bank tailored to the exact role and context.
   */
  async generateQuestion(params: {
    target_role: string;
    target_company?: string | null;
    interview_type: InterviewType;
    difficulty: DifficultyLevel;
    question_number: number;
    total_questions: number;
    existing_questions?: string[];
  }): Promise<Omit<MockInterviewQuestion, 'id' | 'interview_id' | 'created_at'>> {
    const {
      target_role,
      target_company,
      interview_type,
      difficulty,
      question_number,
      existing_questions = [],
    } = params;

    // Check if Supabase Edge Function is available
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('mock-interview-ai', {
          body: {
            action: 'generate_question',
            target_role,
            target_company,
            interview_type,
            difficulty,
            question_number,
            existing_questions,
          },
        });

        if (!error && data?.question_text) {
          return {
            question_number,
            question_text: data.question_text,
            question_category: data.question_category || `${target_role} Core`,
            expected_topics: data.expected_topics || ['Fundamentals', 'Communication', 'Application'],
          };
        }
      } catch {
        // Fallback to local deterministic AI generator
      }
    }

    // Filter matching questions from bank
    const candidates = QUESTION_BANK.filter((q) => {
      // Type match is primary
      const typeMatch = q.type === interview_type;
      // Role match or general question
      const roleMatch = !q.roles || q.roles.includes(target_role);
      // Not already asked
      const notAsked = !existing_questions.some(
        (existing) => existing.toLowerCase().includes(q.text.slice(0, 30).toLowerCase())
      );
      return typeMatch && roleMatch && notAsked;
    });

    // If candidate found, customize with company name if provided
    if (candidates.length > 0) {
      // Pick best matching or cycling based on question number
      const picked = candidates[(question_number - 1) % candidates.length];
      let customizedText = picked.text;
      if (target_company && (interview_type === 'hr' || interview_type === 'behavioral')) {
        customizedText = customizedText.replace(
          'our organization',
          `${target_company}`
        ).replace(
          'this specific role',
          `this ${target_role} role at ${target_company}`
        );
      }

      return {
        question_number,
        question_text: customizedText,
        question_category: picked.category,
        expected_topics: picked.expectedTopics,
      };
    }

    // Dynamic tailored synthesis fallback
    const companyContext = target_company ? ` at ${target_company}` : '';
    const dynamicTopics = [
      'Problem definition',
      'Architectural reasoning',
      'Trade-off justification',
      'Execution metrics',
    ];

    if (interview_type === 'technical') {
      return {
        question_number,
        question_text: `For a ${target_role} position${companyContext}, how would you approach building a highly scalable, fault-tolerant solution for Question #${question_number}? Highlight architectural choices and edge-case handling.`,
        question_category: `${target_role} Architecture & Problem Solving`,
        expected_topics: dynamicTopics,
      };
    }

    return {
      question_number,
      question_text: `As an aspiring ${target_role}${companyContext}, describe how your past technical work and problem-solving habits prepare you for high-impact contributions in this domain.`,
      question_category: `${target_role} Professional Alignment`,
      expected_topics: ['Core competencies', 'Past project impact', 'Continuous learning', 'Collaboration'],
    };
  },

  /**
   * Evaluates the student's answer and generates rubric scores, feedback, and improved model answer.
   */
  async evaluateAnswer(params: {
    question_text: string;
    question_category: string;
    expected_topics: string[];
    answer_text: string;
    target_role: string;
    interview_type: InterviewType;
    difficulty: DifficultyLevel;
  }): Promise<AnswerEvaluationResult> {
    const {
      question_text,
      question_category,
      expected_topics,
      answer_text,
      target_role,
      interview_type,
    } = params;

    // Check if Supabase Edge Function is available
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('mock-interview-ai', {
          body: {
            action: 'evaluate_answer',
            question_text,
            question_category,
            expected_topics,
            answer_text,
            target_role,
            interview_type,
          },
        });

        if (!error && data?.answer_score !== undefined) {
          return {
            answer_score: Number(data.answer_score),
            communication_score: Number(data.communication_score),
            technical_score: Number(data.technical_score),
            confidence_score: Number(data.confidence_score),
            what_was_good: data.what_was_good || 'Good direct answer.',
            what_could_improve: data.what_could_improve || 'Add more concrete metrics.',
            improved_answer: data.improved_answer || 'See structured model answer.',
            feedback: data.feedback || `${data.what_was_good} ${data.what_could_improve}`,
          };
        }
      } catch {
        // Fallback to local heuristic evaluation engine
      }
    }

    // Heuristic evaluation engine for Demo/Offline mode:
    const trimmed = answer_text.trim();
    const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
    const lower = trimmed.toLowerCase();

    // 1. Length & depth score
    let baseScore = 6.0;
    if (wordCount >= 90) baseScore += 2.0;
    else if (wordCount >= 45) baseScore += 1.0;
    else if (wordCount < 20) baseScore -= 2.0;

    // 2. Keyword relevance
    let matchedTopics = 0;
    expected_topics.forEach((topic) => {
      const keywords = topic.toLowerCase().split(/\s+/);
      if (keywords.some((kw) => kw.length > 3 && lower.includes(kw))) {
        matchedTopics++;
      }
    });

    const topicBonus = Math.min(2.0, matchedTopics * 0.7);
    baseScore += topicBonus;

    // 3. Hedging / Confidence detection
    const hedgingPhrases = ['i think maybe', 'probably', 'not sure', 'i guess', 'i might be wrong'];
    const hasHedging = hedgingPhrases.some((hp) => lower.includes(hp));
    const confidencePenalty = hasHedging ? 1.5 : 0;

    // 4. Metric scores out of 10
    const rawAnswerScore = Math.min(9.6, Math.max(3.0, baseScore));
    const technicalScore = Math.min(
      9.8,
      Math.max(3.0, baseScore + (matchedTopics >= 2 ? 0.6 : -0.5))
    );
    const commScore = Math.min(
      9.7,
      Math.max(3.5, 6.0 + (wordCount >= 50 && wordCount <= 220 ? 2.5 : 0.8))
    );
    const confScore = Math.min(
      9.5,
      Math.max(3.0, 7.5 - confidencePenalty + (wordCount >= 60 ? 1.0 : 0))
    );

    // Round to 1 decimal place
    const answer_score = Math.round(rawAnswerScore * 10) / 10;
    const technical_score = Math.round(technicalScore * 10) / 10;
    const communication_score = Math.round(commScore * 10) / 10;
    const confidence_score = Math.round(confScore * 10) / 10;

    // Qualitative Feedback
    let what_was_good = '';
    let what_could_improve = '';

    if (wordCount >= 60) {
      what_was_good = `Addressed the question with structured reasoning and covered relevant core ideas in ${question_category}. Clear professional voice.`;
    } else {
      what_was_good = `Direct and concise opening statement that captures the high-level intent of the question.`;
    }

    if (hasHedging) {
      what_could_improve = `Avoid tentative phrasing like "I think" or "maybe". State your solutions with declarative confidence.`;
    } else if (matchedTopics < 2) {
      what_could_improve = `Incorporate concrete industry terminology (${expected_topics.slice(0, 2).join(', ')}) and cite measurable performance or trade-off outcomes.`;
    } else {
      what_could_improve = `Provide a real-world edge case example or quantify the outcome to elevate this from a good answer to an executive-level response.`;
    }

    // Improved Model Answer
    const sampleTopicsJoined = expected_topics.slice(0, 3).join(', ');
    const improved_answer = `To address this effectively for a ${target_role} position:
"In my experience, approaching this requires balancing ${sampleTopicsJoined}. 

First, I establish the structural constraints and baseline objectives. Next, I apply established industry best practices—specifically addressing key edge cases and isolating bottlenecks. Finally, I validate the outcome with quantifiable metrics (e.g. latency, error budgets, or user conversion) to guarantee sustained performance."`;

    const feedback = `${what_was_good} ${what_could_improve}`;

    return {
      answer_score,
      communication_score,
      technical_score,
      confidence_score,
      what_was_good,
      what_could_improve,
      improved_answer,
      feedback,
    };
  },
};
