import {
  MockInterview,
  MockInterviewQuestion,
  MockInterviewAnswer,
  InterviewSetupPayload,
  CompleteInterviewSessionData,
  AnswerEvaluationResult,
} from '../types/mockInterview.types';
import { aiInterviewService } from './aiInterviewService';
import { generateFinalReport } from '../utils/scoring';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

const STORAGE_INTERVIEWS = 'st2_mock_interviews';
const STORAGE_QUESTIONS = 'st2_mock_interview_questions';
const STORAGE_ANSWERS = 'st2_mock_interview_answers';

export const mockInterviewService = {
  // Initialize seed data for offline / demo mode
  ensureSeedData(studentId: string) {
    const existing = localStorage.getItem(STORAGE_INTERVIEWS);
    if (existing && JSON.parse(existing).length > 0) {
      return;
    }

    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const yesterday = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();

    // 1. Completed Software Developer Technical Interview
    const id1 = 'interview-seed-swe-01';
    const interview1: MockInterview = {
      id: id1,
      student_id: studentId,
      target_role: 'Software Developer',
      target_company: 'Google',
      interview_type: 'technical',
      difficulty: 'intermediate',
      total_questions: 5,
      current_question_number: 5,
      status: 'completed',
      overall_score: 86,
      communication_score: 84,
      technical_score: 88,
      confidence_score: 86,
      strengths: [
        'Articulate and structured delivery with professional tone',
        'Strong grasp of foundational concepts and accurate terminology',
        'High assertiveness, direct problem handling, and confident decision making',
      ],
      weaknesses: [
        'Could incorporate more industry benchmark statistics and architectural trade-offs',
      ],
      final_feedback:
        'Outstanding performance! You displayed exceptional readiness for Google. Your technical articulation is sharp, confident, and role-ready. Focus on fine-tuning architectural edge cases to secure a top-tier offer.',
      started_at: twoDaysAgo,
      completed_at: new Date(new Date(twoDaysAgo).getTime() + 25 * 60 * 1000).toISOString(),
      created_at: twoDaysAgo,
      updated_at: twoDaysAgo,
    };

    const questions1: MockInterviewQuestion[] = [
      {
        id: 'q-swe-1',
        interview_id: id1,
        question_number: 1,
        question_text:
          'Explain the four core principles of Object-Oriented Programming (OOP) and give a practical example where Inheritance should be favored over Composition, or vice versa.',
        question_category: 'Object-Oriented Programming',
        expected_topics: ['Encapsulation, Abstraction, Inheritance, Polymorphism', 'Composition over Inheritance', 'Coupling reduction'],
        created_at: twoDaysAgo,
      },
      {
        id: 'q-swe-2',
        interview_id: id1,
        question_number: 2,
        question_text:
          'Walk me through how database indexing works using B+ Trees. Why do databases rarely use Hash indices for range queries?',
        question_category: 'Databases & DBMS',
        expected_topics: ['B+ Tree node structure', 'Sorted sequential pointers', 'O(log N) lookups', 'Hash table inability to do range scans'],
        created_at: twoDaysAgo,
      },
      {
        id: 'q-swe-3',
        interview_id: id1,
        question_number: 3,
        question_text:
          'Can you explain the difference between a process and a thread, and how context switching impacts CPU cache performance?',
        question_category: 'Operating Systems & Concurrency',
        expected_topics: ['Address space isolation', 'PCB vs TCB', 'Cache invalidation / TLB misses', 'Multithreading overhead'],
        created_at: twoDaysAgo,
      },
      {
        id: 'q-swe-4',
        interview_id: id1,
        question_number: 4,
        question_text:
          'How would you design a rate limiter for a public REST API? What algorithm (e.g. Token Bucket, Leaky Bucket) would you select and why?',
        question_category: 'System Design & APIs',
        expected_topics: ['Token Bucket vs Leaky Bucket', 'Distributed state in Redis', 'HTTP 429 Too Many Requests'],
        created_at: twoDaysAgo,
      },
      {
        id: 'q-swe-5',
        interview_id: id1,
        question_number: 5,
        question_text:
          'Describe a complex bug or production incident you encountered in one of your recent projects. How did you isolate, debug, and prevent recurrence?',
        question_category: 'Project Debugging & Quality',
        expected_topics: ['Root Cause Analysis (RCA)', 'Logging/APM telemetry', 'Unit & regression testing'],
        created_at: twoDaysAgo,
      },
    ];

    const answers1: MockInterviewAnswer[] = [
      {
        id: 'ans-swe-1',
        interview_id: id1,
        question_id: 'q-swe-1',
        student_id: studentId,
        answer_text:
          'The 4 pillars are Encapsulation (bundling data and restricting direct access), Abstraction (hiding implementation details), Inheritance (reusing characteristics), and Polymorphism (handling different types via a common interface). Composition is favored over inheritance when relationships are "has-a" rather than strict "is-a", which prevents fragile base class issues and keeps coupling low.',
        answer_score: 9.0,
        communication_score: 9.0,
        technical_score: 9.2,
        confidence_score: 8.8,
        what_was_good: 'Crisp articulation of the four OOP pillars and clear rationale on why composition reduces coupling.',
        what_could_improve: 'Could mention the Liskov Substitution Principle (LSP) to round out the inheritance explanation.',
        improved_answer:
          'Encapsulation bundles state with methods. Abstraction exposes only necessary contracts. Polymorphism allows uniform invocation of derived behaviors. We favor composition over inheritance ("has-a" vs "is-a") because inheritance creates tight compile-time coupling that can violate LSP when base behaviors drift.',
        feedback: 'Excellent response with strong theoretical understanding.',
        created_at: twoDaysAgo,
      },
      {
        id: 'ans-swe-2',
        interview_id: id1,
        question_id: 'q-swe-2',
        student_id: studentId,
        answer_text:
          'B+ trees maintain balanced, shallow tree heights with high fanout. Internal nodes store keys for routing, while all actual data pointers reside in leaf nodes. Because leaf nodes are linked via double-linked pointers in sequential sorted order, range scans (e.g. BETWEEN 10 AND 50) take O(log N) to find the first key, then O(K) sequential disk/memory pointer iteration. Hash indexes use hash functions that scatter values pseudo-randomly, destroying any ordering, which makes range scans impossible without a full table scan.',
        answer_score: 9.2,
        communication_score: 8.8,
        technical_score: 9.5,
        confidence_score: 9.0,
        what_was_good: 'Superb breakdown of linked leaf nodes in B+ trees and explanation of why hashing destroys key order.',
        what_could_improve: 'Mention SSD page block alignment and cache-line friendliness.',
        improved_answer:
          'B+ trees store all records in leaf nodes connected by a linked list, enabling O(log N) search plus sequential scan for range queries. Hash indexes scatter keys across buckets based on hash digest, requiring an O(N) full table scan for any inequalities.',
        feedback: 'Outstanding technical depth on relational storage engines.',
        created_at: twoDaysAgo,
      },
      {
        id: 'ans-swe-3',
        interview_id: id1,
        question_id: 'q-swe-3',
        student_id: studentId,
        answer_text:
          'A process is an isolated execution environment with its own dedicated virtual memory space, file descriptors, and PCB. A thread is a lightweight unit of execution within a process that shares the heap, global memory, and open handles with peer threads, but possesses its own stack and registers. Context switching between processes requires invalidating the Translation Lookaside Buffer (TLB) and flushing CPU caches, which incurs significant overhead. Thread switching within the same process retains the virtual memory mapping, minimizing cache pollution.',
        answer_score: 8.5,
        communication_score: 8.2,
        technical_score: 8.8,
        confidence_score: 8.4,
        what_was_good: 'Accurately highlighted virtual memory isolation and the impact on the TLB.',
        what_could_improve: 'Could highlight user-level vs kernel-level threading contexts.',
        improved_answer:
          'Processes own isolated address spaces; switching between them forces CPU TLB flushes and cold cache reloads. Threads share the virtual address space, making their context switch orders of magnitude cheaper.',
        feedback: 'Solid operating systems knowledge.',
        created_at: twoDaysAgo,
      },
      {
        id: 'ans-swe-4',
        interview_id: id1,
        question_id: 'q-swe-4',
        student_id: studentId,
        answer_text:
          'I would implement the Token Bucket algorithm backed by Redis for distributed rate limiting. In Token Bucket, tokens accumulate at a fixed rate up to a capacity limit. When a request arrives, we execute an atomic Lua script in Redis that checks if a token is available and decrements it. If exhausted, we return HTTP 429 with a Retry-After header. Token Bucket gracefully accommodates bursts of traffic while enforcing a strict steady-state throughput cap.',
        answer_score: 8.8,
        communication_score: 8.5,
        technical_score: 9.0,
        confidence_score: 8.7,
        what_was_good: 'Correctly proposed Redis Lua scripts for atomic operations and highlighted burst tolerance.',
        what_could_improve: 'Discuss fallback strategies if the Redis cluster experiences network partitions.',
        improved_answer:
          'Use Redis-backed Token Bucket with atomic Lua scripts to avoid race conditions. Token bucket permits legitimate traffic bursts up to capacity while guaranteeing steady refill rates and issuing 429 Too Many Requests.',
        feedback: 'Very practical and production-grade architecture answer.',
        created_at: twoDaysAgo,
      },
      {
        id: 'ans-swe-5',
        interview_id: id1,
        question_id: 'q-swe-5',
        student_id: studentId,
        answer_text:
          'In my semester capstone, we experienced race conditions during simultaneous user checkouts that resulted in negative inventory quantities. I reproduced it using JMeter load tests, isolated the issue to uncommitted read isolation levels, and resolved it by implementing pessimistic database locking with SELECT FOR UPDATE inside an explicit transaction. We also added automated concurrent integration tests in CI/CD.',
        answer_score: 8.4,
        communication_score: 8.3,
        technical_score: 8.5,
        confidence_score: 8.5,
        what_was_good: 'Real-world incident breakdown with load testing reproduction and transaction locking remediation.',
        what_could_improve: 'Contrast pessimistic locking with optimistic locking (version numbers) for read-heavy workloads.',
        improved_answer:
          'Identified inventory race condition under load. Replicated via concurrency tests, converted to transactional SELECT FOR UPDATE (with optimistic version fallback for low contention), and added automated CI concurrency tests.',
        feedback: 'Great ownership and engineering discipline.',
        created_at: twoDaysAgo,
      },
    ];

    // 2. Completed Data Analyst HR Interview
    const id2 = 'interview-seed-da-02';
    const interview2: MockInterview = {
      id: id2,
      student_id: studentId,
      target_role: 'Data Analyst',
      target_company: 'Deloitte',
      interview_type: 'hr',
      difficulty: 'beginner',
      total_questions: 5,
      current_question_number: 5,
      status: 'completed',
      overall_score: 92,
      communication_score: 94,
      technical_score: 90,
      confidence_score: 92,
      strengths: [
        'Articulate and structured delivery with professional tone',
        'Strong grasp of foundational concepts and accurate terminology',
        'High assertiveness, direct problem handling, and confident decision making',
      ],
      weaknesses: [
        'Could incorporate more industry benchmark statistics and architectural trade-offs',
      ],
      final_feedback:
        'Outstanding performance! You displayed exceptional readiness for Deloitte. Your articulation is crisp, empathetic, and culturally aligned. Excellent STAR storytelling.',
      started_at: yesterday,
      completed_at: new Date(new Date(yesterday).getTime() + 20 * 60 * 1000).toISOString(),
      created_at: yesterday,
      updated_at: yesterday,
    };

    const questions2: MockInterviewQuestion[] = [
      {
        id: 'q-da-1',
        interview_id: id2,
        question_number: 1,
        question_text:
          'Tell me about yourself, highlighting your academic analytics journey and why you want to join Deloitte as a Data Analyst.',
        question_category: 'Introduction & Trajectory',
        expected_topics: ['Chronological elevator pitch', 'Key milestone projects', 'Relevance to target company/role', 'Growth mindset'],
        created_at: yesterday,
      },
      {
        id: 'q-da-2',
        interview_id: id2,
        question_number: 2,
        question_text:
          'Describe a situation where non-technical stakeholders doubted your analytical findings. How did you build trust and convey the insight?',
        question_category: 'Stakeholder Communication & Influence',
        expected_topics: ['Simplifying statistics', 'Visual dashboard demonstration', 'Business impact translation', 'Empathy'],
        created_at: yesterday,
      },
      {
        id: 'q-da-3',
        interview_id: id2,
        question_number: 3,
        question_text:
          'What is one major piece of constructive criticism you have received, and how did you act upon it?',
        question_category: 'Self-Awareness & Growth',
        expected_topics: ['Honest vulnerability', 'Concrete action taken', 'Measurable outcome'],
        created_at: yesterday,
      },
      {
        id: 'q-da-4',
        interview_id: id2,
        question_number: 4,
        question_text:
          'How do you manage deadlines when multiple business units request urgent ad-hoc data reports simultaneously?',
        question_category: 'Prioritization & Client Management',
        expected_topics: ['Impact vs Urgency matrix', 'Proactive communication', 'Template automation', 'Managing expectations'],
        created_at: yesterday,
      },
      {
        id: 'q-da-5',
        interview_id: id2,
        question_number: 5,
        question_text:
          'Where do you see yourself in 3 years within our consulting analytics practice?',
        question_category: 'Career Vision',
        expected_topics: ['Consulting mastery', 'Domain specialization', 'Mentoring junior analysts'],
        created_at: yesterday,
      },
    ];

    const answers2: MockInterviewAnswer[] = [
      {
        id: 'ans-da-1',
        interview_id: id2,
        question_id: 'q-da-1',
        student_id: studentId,
        answer_text:
          'I am a final-year student specializing in Computer Science with a core focus on Business Intelligence. Over the past two years, I built automated Power BI telemetry dashboards for campus placement tracking and analyzed student performance data using SQL and Python. I admire Deloitte’s legacy in enterprise digital transformation, and I am excited to translate complex raw data into decisive strategic value for global clients.',
        answer_score: 9.3,
        communication_score: 9.5,
        technical_score: 9.0,
        confidence_score: 9.2,
        what_was_good: 'Clear narrative arc linking academic projects directly to Deloitte’s consulting practice.',
        what_could_improve: 'Mention a specific Deloitte industry sector (e.g. healthcare, financial services) that excites you.',
        improved_answer:
          'I combine technical data engineering skills with commercial curiosity. Having delivered automated SQL and Power BI pipelines that increased reporting efficiency by 40%, I look forward to applying this rigor to Deloitte’s enterprise analytics client engagements.',
        feedback: 'Polished, confident, and professional opening.',
        created_at: yesterday,
      },
      {
        id: 'ans-da-2',
        interview_id: id2,
        question_id: 'q-da-2',
        student_id: studentId,
        answer_text:
          'During an internship, our department heads were skeptical of a 14% drop in student engagement. Rather than presenting p-values and regression outputs, I built an interactive cohort drill-down visual that clearly showed the drop was isolated to mobile users after a site redesign. By framing the data around the user journey and dollar impact, leadership immediately approved our remediation plan.',
        answer_score: 9.4,
        communication_score: 9.6,
        technical_score: 9.1,
        confidence_score: 9.4,
        what_was_good: 'Outstanding translation of statistical data into an intuitive visual story.',
        what_could_improve: 'Explicitly state how you acknowledged their initial skepticism with empathy.',
        improved_answer:
          'Recognizing stakeholder skepticism, I replaced technical jargon with an executive dashboard demonstrating segment attribution. This converted doubt into alignment and unlocked immediate action.',
        feedback: 'Top-tier consulting response demonstrating empathy and visual clarity.',
        created_at: yesterday,
      },
      {
        id: 'ans-da-3',
        interview_id: id2,
        question_id: 'q-da-3',
        student_id: studentId,
        answer_text:
          'Early in my capstone project, my mentor noted that I spent too much time perfecting SQL query syntax before verifying the underlying business assumptions. Taking this feedback, I instituted a mandatory 15-minute alignment call with stakeholders before writing a single line of code. This cut our dashboard iteration cycles in half.',
        answer_score: 9.1,
        communication_score: 9.3,
        technical_score: 8.9,
        confidence_score: 9.2,
        what_was_good: 'Authentic example with a concrete habit change and quantifiable time savings.',
        what_could_improve: 'Could highlight how you documented this practice as a reusable team checklist.',
        improved_answer:
          'Feedback revealed I was optimizing technical execution before business validation. I introduced pre-sprint requirement alignment checklists, reducing rework by 50%.',
        feedback: 'Superb self-awareness and proactive problem-solving.',
        created_at: yesterday,
      },
      {
        id: 'ans-da-4',
        interview_id: id2,
        question_id: 'q-da-4',
        student_id: studentId,
        answer_text:
          'I prioritize requests using an Impact vs. Urgency matrix. I immediately acknowledge every incoming request with an estimated delivery window. For recurring ad-hoc requests, I build self-serve parameterized SQL views in Power BI so stakeholders can query their own numbers instantaneously, freeing up bandwidth for high-complexity analyses.',
        answer_score: 9.2,
        communication_score: 9.4,
        technical_score: 9.1,
        confidence_score: 9.1,
        what_was_good: 'Great balance of immediate stakeholder communication with long-term self-serve automation.',
        what_could_improve: 'Mention how you escalate conflicting high-priority requests to team leads.',
        improved_answer:
          'Prioritize via an impact matrix, maintain transparent delivery SLAs, and convert repeat queries into self-serve dashboards to permanently reduce ad-hoc overhead.',
        feedback: 'Practical and structured operational approach.',
        created_at: yesterday,
      },
      {
        id: 'ans-da-5',
        interview_id: id2,
        question_id: 'q-da-5',
        student_id: studentId,
        answer_text:
          'In three years, I see myself as a Senior Consultant leading cross-functional analytics engagements, mentoring junior analysts, and spearheading predictive forecasting models for enterprise clients. I want to be known as the bridge between technical data engineering and executive decision-making.',
        answer_score: 9.0,
        communication_score: 9.2,
        technical_score: 8.9,
        confidence_score: 9.0,
        what_was_good: 'Clear ambition aligned with Deloitte’s career progression ladders.',
        what_could_improve: 'Mention certification goals like dbt, Snowflake, or AWS Data Analytics.',
        improved_answer:
          'Advance to Senior Analyst guiding enterprise BI deployments, mastering predictive modeling, and mentoring new cohorts in the practice.',
        feedback: 'Inspiring and focused closing answer.',
        created_at: yesterday,
      },
    ];

    // 3. In-Progress AI/ML Engineer Interview (Currently on Question 3 of 5!)
    const id3 = 'interview-seed-aiml-03';
    const interview3: MockInterview = {
      id: id3,
      student_id: studentId,
      target_role: 'AI/ML Engineer',
      target_company: 'Microsoft',
      interview_type: 'technical',
      difficulty: 'advanced',
      total_questions: 5,
      current_question_number: 3,
      status: 'in_progress',
      strengths: ['Strong grasp of foundational concepts and accurate terminology'],
      weaknesses: ['Add deeper mathematical derivations for backpropagation'],
      started_at: threeHoursAgo,
      created_at: threeHoursAgo,
      updated_at: threeHoursAgo,
    };

    const questions3: MockInterviewQuestion[] = [
      {
        id: 'q-aiml-1',
        interview_id: id3,
        question_number: 1,
        question_text:
          'How do you diagnose and resolve high variance (overfitting) versus high bias (underfitting) in a gradient-boosted decision tree model?',
        question_category: 'Machine Learning Fundamentals',
        expected_topics: ['Train vs Validation loss curves', 'L1/L2 regularization & max depth', 'Subsampling / Learning rate tuning'],
        created_at: threeHoursAgo,
      },
      {
        id: 'q-aiml-2',
        interview_id: id3,
        question_number: 2,
        question_text:
          'In an imbalanced classification problem like rare fraud detection (99.8% negative, 0.2% positive), why is Accuracy misleading, and which evaluation metric would you optimize?',
        question_category: 'Model Evaluation Metrics',
        expected_topics: ['Precision vs Recall vs PR-AUC', 'Cost matrix / False Negative business impact', 'F-beta score'],
        created_at: threeHoursAgo,
      },
      {
        id: 'q-aiml-3',
        interview_id: id3,
        question_number: 3,
        question_text:
          'Explain the mechanism of Multi-Head Self-Attention in Transformer models. What is the mathematical purpose of scaling the dot product by sqrt(d_k)?',
        question_category: 'Deep Learning & Transformers',
        expected_topics: ['Query, Key, Value matrices', 'Softmax gradient vanishing in high dimensions', 'Parallel representation subspaces'],
        created_at: threeHoursAgo,
      },
    ];

    const answers3: MockInterviewAnswer[] = [
      {
        id: 'ans-aiml-1',
        interview_id: id3,
        question_id: 'q-aiml-1',
        student_id: studentId,
        answer_text:
          'High variance is diagnosed when training loss is near zero but validation loss diverges significantly. For XGBoost/LightGBM, I mitigate this by reducing max_depth, increasing min_child_weight, adding L1/L2 regularization (alpha/lambda), and introducing subsample and colsample_bytree randomizations. High bias occurs when both training and validation losses plateau at an unacceptably high error, which I resolve by engineering richer interaction features and increasing tree capacity.',
        answer_score: 9.1,
        communication_score: 8.8,
        technical_score: 9.4,
        confidence_score: 9.0,
        what_was_good: 'Comprehensive hyperparameter knowledge and distinct separation of bias vs variance remedies.',
        what_could_improve: 'Mention early stopping on an independent holdout evaluation set.',
        improved_answer:
          'Diagnose divergence between train and validation learning curves. Remedy high variance via tree pruning (lower max_depth), L1/L2 penalties, and feature subsampling. Fix high bias with feature crosses and higher model capacity.',
        feedback: 'Very thorough and accurate gradient boosting answer.',
        created_at: threeHoursAgo,
      },
      {
        id: 'ans-aiml-2',
        interview_id: id3,
        question_id: 'q-aiml-2',
        student_id: studentId,
        answer_text:
          'A trivial model predicting the majority class exclusively would achieve 99.8% accuracy while detecting zero fraud, proving accuracy is useless under severe skew. In financial fraud, False Negatives carry massive financial liability, so I optimize Recall at a strict Precision threshold, analyzing the Precision-Recall AUC rather than ROC-AUC. Depending on stakeholder risk tolerance, we tune decision thresholds using the F2-score to weight recall twice as heavily as precision.',
        answer_score: 9.4,
        communication_score: 9.2,
        technical_score: 9.6,
        confidence_score: 9.3,
        what_was_good: 'Correctly contrasted PR-AUC with ROC-AUC and demonstrated mastery of F2-score weighting.',
        what_could_improve: 'Could discuss threshold calibration via expected value cost-benefit matrix.',
        improved_answer:
          'Accuracy masks class imbalance because predicting all-negatives yields 99.8% accuracy. I optimize PR-AUC and tune decision thresholds using the F2-score to heavily penalize high-cost False Negatives.',
        feedback: 'Flawless evaluation metrics answer.',
        created_at: threeHoursAgo,
      },
    ];

    const allInterviews = [interview1, interview2, interview3];
    const allQuestions = [...questions1, ...questions2, ...questions3];
    const allAnswers = [...answers1, ...answers2, ...answers3];

    localStorage.setItem(STORAGE_INTERVIEWS, JSON.stringify(allInterviews));
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(allQuestions));
    localStorage.setItem(STORAGE_ANSWERS, JSON.stringify(allAnswers));
  },

  // List all interviews belonging to current student
  async listInterviews(studentId: string): Promise<MockInterview[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('mock_interviews')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as MockInterview[];
        }
      } catch {
        // Fallback to local storage
      }
    }

    this.ensureSeedData(studentId);
    const local = localStorage.getItem(STORAGE_INTERVIEWS);
    if (!local) return [];
    const parsed: MockInterview[] = JSON.parse(local);
    return parsed
      .filter((i) => i.student_id === studentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // Get single interview by ID with ownership verification
  async getInterview(id: string, studentId: string): Promise<MockInterview | null> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('mock_interviews')
          .select('*')
          .eq('id', id)
          .eq('student_id', studentId)
          .single();

        if (!error && data) {
          return data as MockInterview;
        }
      } catch {
        // Fallback to local storage
      }
    }

    this.ensureSeedData(studentId);
    const local = localStorage.getItem(STORAGE_INTERVIEWS);
    if (!local) return null;
    const parsed: MockInterview[] = JSON.parse(local);
    const found = parsed.find((i) => i.id === id);
    if (!found || found.student_id !== studentId) {
      return null;
    }
    return found;
  },

  // Create a new interview session and generate the first question
  async createInterview(
    studentId: string,
    payload: InterviewSetupPayload
  ): Promise<{ interview: MockInterview; firstQuestion: MockInterviewQuestion }> {
    const interviewId = `interview-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newInterview: MockInterview = {
      id: interviewId,
      student_id: studentId,
      target_role: payload.target_role,
      target_company: payload.target_company || null,
      interview_type: payload.interview_type,
      difficulty: payload.difficulty,
      total_questions: payload.total_questions,
      current_question_number: 1,
      status: 'in_progress',
      strengths: [],
      weaknesses: [],
      started_at: now,
      created_at: now,
      updated_at: now,
    };

    // Generate first question
    const qData = await aiInterviewService.generateQuestion({
      target_role: payload.target_role,
      target_company: payload.target_company,
      interview_type: payload.interview_type,
      difficulty: payload.difficulty,
      question_number: 1,
      total_questions: payload.total_questions,
    });

    const firstQuestion: MockInterviewQuestion = {
      id: `q-${Date.now()}-1`,
      interview_id: interviewId,
      question_number: 1,
      question_text: qData.question_text,
      question_category: qData.question_category,
      expected_topics: qData.expected_topics,
      created_at: now,
    };

    // Save to Supabase if configured
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('mock_interviews').insert(newInterview);
        await supabase.from('mock_interview_questions').insert(firstQuestion);
      } catch {
        // Fallback to local storage
      }
    }

    // Always mirror to local storage
    this.ensureSeedData(studentId);
    const localInterviews = JSON.parse(localStorage.getItem(STORAGE_INTERVIEWS) || '[]');
    localInterviews.unshift(newInterview);
    localStorage.setItem(STORAGE_INTERVIEWS, JSON.stringify(localInterviews));

    const localQuestions = JSON.parse(localStorage.getItem(STORAGE_QUESTIONS) || '[]');
    localQuestions.push(firstQuestion);
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(localQuestions));

    return { interview: newInterview, firstQuestion };
  },

  // Get all session data (interview, questions, answers)
  async getSessionData(
    interviewId: string,
    studentId: string
  ): Promise<CompleteInterviewSessionData | null> {
    const interview = await this.getInterview(interviewId, studentId);
    if (!interview) return null;

    let questions: MockInterviewQuestion[] = [];
    let answers: MockInterviewAnswer[] = [];

    if (isSupabaseConfigured() && supabase) {
      try {
        const [qRes, aRes] = await Promise.all([
          supabase
            .from('mock_interview_questions')
            .select('*')
            .eq('interview_id', interviewId)
            .order('question_number', { ascending: true }),
          supabase
            .from('mock_interview_answers')
            .select('*')
            .eq('interview_id', interviewId)
            .order('created_at', { ascending: true }),
        ]);

        if (!qRes.error && qRes.data) questions = qRes.data as MockInterviewQuestion[];
        if (!aRes.error && aRes.data) answers = aRes.data as MockInterviewAnswer[];
      } catch {
        // Fallback to local storage
      }
    }

    if (questions.length === 0) {
      const localQ = JSON.parse(localStorage.getItem(STORAGE_QUESTIONS) || '[]');
      questions = localQ
        .filter((q: MockInterviewQuestion) => q.interview_id === interviewId)
        .sort((a: MockInterviewQuestion, b: MockInterviewQuestion) => a.question_number - b.question_number);
    }

    if (answers.length === 0) {
      const localA = JSON.parse(localStorage.getItem(STORAGE_ANSWERS) || '[]');
      answers = localA.filter((a: MockInterviewAnswer) => a.interview_id === interviewId);
    }

    return {
      interview,
      questions,
      answers,
    };
  },

  // Submit student answer, evaluate, save, and prep next question or finalize
  async submitAnswer(params: {
    interview_id: string;
    question_id: string;
    student_id: string;
    answer_text: string;
  }): Promise<{
    answer: MockInterviewAnswer;
    evaluation: AnswerEvaluationResult;
    nextQuestion?: MockInterviewQuestion;
    isFinished: boolean;
    updatedInterview: MockInterview;
  }> {
    const { interview_id, question_id, student_id, answer_text } = params;

    const session = await this.getSessionData(interview_id, student_id);
    if (!session) {
      throw new Error('Interview session not found or unauthorized.');
    }

    const { interview, questions, answers } = session;
    const currentQ = questions.find((q) => q.id === question_id);
    if (!currentQ) {
      throw new Error('Active question record not found.');
    }

    // 1. Evaluate answer via AI service
    const evaluation = await aiInterviewService.evaluateAnswer({
      question_text: currentQ.question_text,
      question_category: currentQ.question_category,
      expected_topics: currentQ.expected_topics,
      answer_text,
      target_role: interview.target_role,
      interview_type: interview.interview_type,
      difficulty: interview.difficulty,
    });

    const now = new Date().toISOString();
    const answerRecord: MockInterviewAnswer = {
      id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      interview_id,
      question_id,
      student_id,
      answer_text,
      answer_score: evaluation.answer_score,
      communication_score: evaluation.communication_score,
      technical_score: evaluation.technical_score,
      confidence_score: evaluation.confidence_score,
      feedback: evaluation.feedback,
      what_was_good: evaluation.what_was_good,
      what_could_improve: evaluation.what_could_improve,
      improved_answer: evaluation.improved_answer,
      created_at: now,
    };

    const updatedAnswers = [...answers, answerRecord];
    const isFinished = currentQ.question_number >= interview.total_questions;

    let nextQuestion: MockInterviewQuestion | undefined;
    let updatedInterview: MockInterview = { ...interview, updated_at: now };

    if (!isFinished) {
      // Generate and save next question
      const nextNum = currentQ.question_number + 1;
      const existingTexts = questions.map((q) => q.question_text);
      const nextQData = await aiInterviewService.generateQuestion({
        target_role: interview.target_role,
        target_company: interview.target_company,
        interview_type: interview.interview_type,
        difficulty: interview.difficulty,
        question_number: nextNum,
        total_questions: interview.total_questions,
        existing_questions: existingTexts,
      });

      nextQuestion = {
        id: `q-${Date.now()}-${nextNum}`,
        interview_id,
        question_number: nextNum,
        question_text: nextQData.question_text,
        question_category: nextQData.question_category,
        expected_topics: nextQData.expected_topics,
        created_at: now,
      };

      updatedInterview = {
        ...updatedInterview,
        current_question_number: nextNum,
      };
    } else {
      // Finalize interview and generate final report
      const report = generateFinalReport(
        interview.target_role,
        interview.target_company,
        updatedAnswers
      );

      updatedInterview = {
        ...updatedInterview,
        status: 'completed',
        overall_score: report.overall_score,
        communication_score: report.communication_score,
        technical_score: report.technical_score,
        confidence_score: report.confidence_score,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        final_feedback: report.final_feedback,
        completed_at: now,
      };
    }

    // Persist to Supabase if available
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('mock_interview_answers').insert(answerRecord);
        if (nextQuestion) {
          await supabase.from('mock_interview_questions').insert(nextQuestion);
        }
        await supabase
          .from('mock_interviews')
          .update(updatedInterview)
          .eq('id', interview_id);
      } catch {
        // Fallback to local storage
      }
    }

    // Persist to local storage
    const allAnswers = JSON.parse(localStorage.getItem(STORAGE_ANSWERS) || '[]');
    allAnswers.push(answerRecord);
    localStorage.setItem(STORAGE_ANSWERS, JSON.stringify(allAnswers));

    if (nextQuestion) {
      const allQuestions = JSON.parse(localStorage.getItem(STORAGE_QUESTIONS) || '[]');
      allQuestions.push(nextQuestion);
      localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(allQuestions));
    }

    const allInterviews = JSON.parse(localStorage.getItem(STORAGE_INTERVIEWS) || '[]');
    const idx = allInterviews.findIndex((i: MockInterview) => i.id === interview_id);
    if (idx !== -1) {
      allInterviews[idx] = updatedInterview;
      localStorage.setItem(STORAGE_INTERVIEWS, JSON.stringify(allInterviews));
    }

    return {
      answer: answerRecord,
      evaluation,
      nextQuestion,
      isFinished,
      updatedInterview,
    };
  },

  // Abandon an interview session
  async abandonInterview(interviewId: string, studentId: string): Promise<void> {
    const interview = await this.getInterview(interviewId, studentId);
    if (!interview) return;

    const updated = {
      ...interview,
      status: 'abandoned' as const,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('mock_interviews')
          .update({ status: 'abandoned', updated_at: updated.updated_at })
          .eq('id', interviewId);
      } catch {
        // Fallback
      }
    }

    const allInterviews = JSON.parse(localStorage.getItem(STORAGE_INTERVIEWS) || '[]');
    const idx = allInterviews.findIndex((i: MockInterview) => i.id === interviewId);
    if (idx !== -1) {
      allInterviews[idx] = updated;
      localStorage.setItem(STORAGE_INTERVIEWS, JSON.stringify(allInterviews));
    }
  },

  // Delete an interview session and all related records
  async deleteInterview(interviewId: string, studentId: string): Promise<void> {
    const interview = await this.getInterview(interviewId, studentId);
    if (!interview) return;

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('mock_interviews').delete().eq('id', interviewId);
      } catch {
        // Fallback
      }
    }

    const allInterviews = JSON.parse(localStorage.getItem(STORAGE_INTERVIEWS) || '[]');
    const filteredI = allInterviews.filter((i: MockInterview) => i.id !== interviewId);
    localStorage.setItem(STORAGE_INTERVIEWS, JSON.stringify(filteredI));

    const allQ = JSON.parse(localStorage.getItem(STORAGE_QUESTIONS) || '[]');
    const filteredQ = allQ.filter((q: MockInterviewQuestion) => q.interview_id !== interviewId);
    localStorage.setItem(STORAGE_QUESTIONS, JSON.stringify(filteredQ));

    const allA = JSON.parse(localStorage.getItem(STORAGE_ANSWERS) || '[]');
    const filteredA = allA.filter((a: MockInterviewAnswer) => a.interview_id !== interviewId);
    localStorage.setItem(STORAGE_ANSWERS, JSON.stringify(filteredA));
  },
};
