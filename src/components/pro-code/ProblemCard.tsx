import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { CodingProblem } from '../../types';
import { CheckCircle2, ArrowRight, Code, Clock } from 'lucide-react';

interface ProblemCardProps {
  problem: CodingProblem;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem }) => {
  const navigate = useNavigate();

  const difficultyVariant = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'rose',
  } as const;

  return (
    <GlassCard
      variant="default"
      onClick={() => navigate(`/pro-code/${problem.slug}`)}
      className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 hover:shadow-[0_8px_25px_rgba(255,122,24,0.20)] cursor-pointer transition-all"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant={difficultyVariant[problem.difficulty]} size="sm">
            {problem.difficulty}
          </Badge>
          <span className="text-[11px] text-[#8F8176] font-mono">
            Acceptance: {problem.acceptanceRate}
          </span>
        </div>

        <h3 className="text-base font-bold text-[#FFF8F0] font-display group-hover:text-[#FF8C32] transition-colors flex items-center justify-between">
          <span>{problem.title}</span>
          <ArrowRight size={15} className="text-[#8F8176] group-hover:text-[#FF8C32] group-hover:translate-x-1 transition-all" />
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-[#C5B5A8] bg-white/5 px-2 py-0.5 rounded-md font-medium">
            {problem.topic}
          </span>
          <span className="text-xs text-[#8F8176] bg-white/5 px-2 py-0.5 rounded-md">
            {problem.approaches.length} Approaches
          </span>
        </div>

        <p className="text-xs text-[#C5B5A8] line-clamp-2 mt-3 leading-relaxed">
          {problem.description}
        </p>
      </div>

      <div className="pt-3 mt-4 border-t border-[rgba(255,248,240,0.08)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          {problem.solved ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> Solved
            </span>
          ) : problem.attempted ? (
            <span className="text-[#FFB347] font-semibold flex items-center gap-1">
              <Clock size={13} /> Attempted
            </span>
          ) : (
            <span className="text-[#8F8176] font-medium flex items-center gap-1">
              <Code size={13} /> Unsolved
            </span>
          )}
        </div>

        <span className="text-xs text-[#FF7A18] group-hover:text-[#FF8C32] font-semibold transition-colors">
          View Approaches & Code &rarr;
        </span>
      </div>
    </GlassCard>
  );
};
