import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { codingService } from '../services/codingService';
import { CodingProblem } from '../types';
import { CodeWorkspace } from '../components/pro-code/CodeWorkspace';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ProblemDetailsPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<CodingProblem | null>(null);

  const loadProblem = async () => {
    if (!problemId) return;
    const found = await codingService.getProblemBySlug(problemId);
    if (found) setProblem(found);
  };

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  if (!problem) {
    return (
      <div className="p-12 text-center text-[#A1A7B3]">
        <p>Loading problem workspace...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/pro-code')}
          className="flex items-center gap-2 text-xs font-semibold text-[#8F8176] hover:text-[#FF8C32] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Coding Problems Arena
        </button>

        <span className="text-xs text-[#8F8176] font-mono">
          ID: {problem.slug}
        </span>
      </div>

      {/* Main Multi-Approach & Code Sandbox Workspace */}
      <CodeWorkspace problem={problem} onStatusChange={loadProblem} />
    </div>
  );
};
