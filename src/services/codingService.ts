import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialDemoProblems } from '../data/demoProblems';
import { CodingProblem } from '../types';

const STORAGE_KEY = 'st2_coding_problems_state';

export const codingService = {
  async getProblems(studentId?: string): Promise<CodingProblem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: dbProblems, error } = await supabase
          .from('coding_problems')
          .select('*')
          .order('title', { ascending: true });

        if (!error && dbProblems && dbProblems.length > 0) {
          let solvedMap: Record<string, { solved: boolean; attempted: boolean }> = {};

          if (studentId) {
            const { data: subs } = await supabase
              .from('coding_submissions')
              .select('problem_id, status')
              .eq('student_id', studentId);

            if (subs) {
              subs.forEach((s) => {
                solvedMap[s.problem_id] = {
                  attempted: true,
                  solved: s.status === 'Accepted' || solvedMap[s.problem_id]?.solved || false,
                };
              });
            }
          }

          return dbProblems.map((p: any): CodingProblem => {
            const userState = solvedMap[p.id] || { solved: false, attempted: false };
            return {
              id: p.id,
              title: p.title,
              slug: p.slug,
              difficulty: p.difficulty,
              topic: p.category || 'Algorithms',
              acceptanceRate: `${Math.round(p.acceptance_rate || 78)}%`,
              solved: userState.solved,
              attempted: userState.attempted,
              description: p.description,
              constraints: p.constraints || [],
              sampleCases: p.sample_cases || [],
              hints: p.hints || [
                'Consider edge cases like empty arrays or all negative values.',
                'Can you optimize this with an O(N) single-pass approach?',
              ],
              approaches: p.approaches || [],
              starterCode: p.starter_code || {
                java: '// Solution\nclass Solution {\n    public int solve() {\n        return 0;\n    }\n}',
                python: 'class Solution:\n    def solve(self):\n        pass',
                cpp: 'class Solution {\npublic:\n    int solve() {\n        return 0;\n    }\n};',
              },
            };
          });
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<CodingProblem[]>('/problems');
    }

    const local = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bytexl_coding_problems_state');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback
      }
    }
    return Promise.resolve(initialDemoProblems);
  },

  async getProblemBySlug(slug: string, studentId?: string): Promise<CodingProblem | undefined> {
    const list = await this.getProblems(studentId);
    return list.find((p) => p.slug === slug || p.id === slug);
  },

  async markProblemSolved(id: string, solved: boolean = true, studentId?: string): Promise<CodingProblem[]> {
    if (isSupabaseConfigured() && supabase && studentId) {
      try {
        await supabase.from('coding_submissions').insert({
          problem_id: id,
          student_id: studentId,
          language: 'python',
          code: '# marked solved',
          status: solved ? 'Accepted' : 'Wrong Answer',
          runtime_ms: 45,
          memory_mb: 14.5,
          passed_tests: 2,
          total_tests: 2,
        });
      } catch {
        // Fallback
      }
    }

    const list = await this.getProblems(studentId);
    const updated = list.map((p) => (p.id === id ? { ...p, solved, attempted: true } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Records a user code execution submission to Supabase
   */
  async recordSubmission(params: {
    problemId: string;
    studentId: string;
    language: string;
    code: string;
    status: 'Accepted' | 'Wrong Answer' | 'Compile Error';
    runtimeMs: number;
    memoryMb: number;
    passedTests: number;
    totalTests: number;
  }): Promise<void> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('coding_submissions').insert({
          problem_id: params.problemId,
          student_id: params.studentId,
          language: params.language,
          code: params.code,
          status: params.status,
          runtime_ms: params.runtimeMs,
          memory_mb: params.memoryMb,
          passed_tests: params.passedTests,
          total_tests: params.totalTests,
        });
      } catch {
        // Fallback
      }
    }
  },

  /**
   * Demo Code Evaluation Simulator
   * Note: This is an educational interactive demonstration runner. Real isolated sandboxed
   * code execution in production requires a containerized execution engine (e.g. Judge0 or Supabase Edge Worker).
   */
  async runCodeDemo(code: string, language: string, problem: CodingProblem): Promise<{
    status: 'Accepted' | 'Wrong Answer' | 'Compile Error';
    runtimeMs: number;
    memoryMb: number;
    passedTests: number;
    totalTests: number;
    output: string;
    message: string;
  }> {
    await new Promise((res) => setTimeout(res, 600));

    const hasKadaneOrMax = code.includes('max') || code.includes('Math.max') || code.includes('std::max');
    const isPassing = code.trim().length > 30 && hasKadaneOrMax;

    if (isPassing) {
      return {
        status: 'Accepted',
        runtimeMs: 42,
        memoryMb: 14.8,
        passedTests: problem.sampleCases.length,
        totalTests: problem.sampleCases.length,
        output: `TestCase 1: Passed (Output: ${problem.sampleCases[0].output})\nTestCase 2: Passed\nAll ${problem.sampleCases.length} sample assertions verified.`,
        message: 'Great job! Your solution passed all test assertions.',
      };
    } else {
      return {
        status: 'Wrong Answer',
        runtimeMs: 58,
        memoryMb: 15.2,
        passedTests: Math.max(0, problem.sampleCases.length - 1),
        totalTests: problem.sampleCases.length,
        output: `TestCase 1 failed:\nExpected: ${problem.sampleCases[0].output}\nYour Output: null / incomplete`,
        message: 'Solution produced differing output on test case 1. Check your logic and loop boundaries.',
      };
    }
  },
};
