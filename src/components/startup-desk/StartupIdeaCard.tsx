import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { StartupIdea } from '../../types';
import {
  Rocket,
  Bookmark,
  ThumbsUp,
  Users,
  Target,
  Sparkles,
  Mail,
} from 'lucide-react';
import { startupService } from '../../services/startupService';
import { useApp } from '../../context/AppContext';

interface StartupIdeaCardProps {
  idea: StartupIdea;
  onUpdate?: () => void;
  onContactFounder?: (idea: StartupIdea) => void;
}

export const StartupIdeaCard: React.FC<StartupIdeaCardProps> = ({
  idea,
  onUpdate,
  onContactFounder,
}) => {
  const { showToast } = useApp();

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await startupService.upvoteIdea(idea.id);
    showToast('Upvote Registered!', `Upvoted "${idea.title}"`, 'success');
    if (onUpdate) onUpdate();
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await startupService.toggleSaveIdea(idea.id);
    showToast(
      idea.saved ? 'Removed from Saved' : 'Idea Bookmarked',
      `"${idea.title}" ${idea.saved ? 'removed from' : 'saved to'} bookmarks`,
      'info'
    );
    if (onUpdate) onUpdate();
  };

  const domainVariants = {
    EdTech: 'orange',
    FinTech: 'amber',
    HealthTech: 'orange',
    'AI & SaaS': 'orange',
    CleanTech: 'amber',
    'Campus Life': 'orange',
  } as const;

  return (
    <GlassCard variant="default" className="p-5 flex flex-col justify-between group hover:border-[rgba(255,122,24,0.40)] hover:shadow-[0_8px_25px_rgba(255,122,24,0.15)] transition-all">
      <div>
        {/* Header tags & save button */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={domainVariants[idea.domain] || 'orange'} size="sm">
              {idea.domain}
            </Badge>
            <span className="text-[11px] font-semibold text-[#8F8176] font-mono bg-[rgba(255,248,240,0.05)] px-2 py-0.5 rounded-md border border-[rgba(255,248,240,0.06)]">
              Stage: {idea.stage}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUpvote}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FF7A18]/10 border border-[#FF7A18]/30 text-[#FF8C32] hover:bg-[#FF7A18]/20 transition-all cursor-pointer font-medium"
            >
              <ThumbsUp size={12} />
              <span>{idea.upvotes}</span>
            </button>

            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                idea.saved
                  ? 'bg-[#FF7A18]/20 border-[#FF7A18]/50 text-[#FF8C32]'
                  : 'bg-[rgba(255,248,240,0.05)] border-[rgba(255,248,240,0.10)] text-[#8F8176] hover:text-[#FFF8F0]'
              }`}
              aria-label={idea.saved ? 'Unsave idea' : 'Save idea'}
            >
              <Bookmark size={14} className={idea.saved ? 'fill-[#FF8C32]' : ''} />
            </button>
          </div>
        </div>

        {/* Idea Title */}
        <h3 className="text-base font-bold text-[#FFF8F0] font-display group-hover:text-[#FF8C32] transition-colors mb-2">
          {idea.title}
        </h3>

        {/* Problem Statement Box */}
        <div className="p-2.5 rounded-xl bg-[rgba(255,248,240,0.02)] border border-[rgba(255,248,240,0.06)] mb-2.5 text-xs">
          <span className="text-[#8F8176] font-semibold">Problem: </span>
          <span className="text-[#C5B5A8]">{idea.problemStatement}</span>
        </div>

        {/* Proposed Solution Box */}
        <div className="p-2.5 rounded-xl bg-[#FF7A18]/10 border border-[#FF7A18]/25 mb-3 text-xs">
          <span className="text-[#FF8C32] font-semibold">Solution: </span>
          <span className="text-[#C5B5A8]">{idea.proposedSolution}</span>
        </div>

        {/* Required Skills */}
        <div className="mb-3">
          <p className="text-[10px] font-bold text-[#8F8176] uppercase tracking-wider mb-1.5">
            Required Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {idea.requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#100D0B] border border-[#FF7A18]/20 text-[#FFB347]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Team Requirements Pill */}
        <div className="p-2.5 rounded-xl bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.06)] text-xs text-[#8F8176]">
          <p className="font-semibold text-[#FFF8F0] flex items-center gap-1.5 mb-0.5">
            <Users size={13} className="text-[#FF7A18]" /> Team Requirements:
          </p>
          <p className="text-[11px] leading-relaxed">{idea.teamRequirements}</p>
        </div>
      </div>

      {/* Footer / Connect */}
      <div className="mt-4 pt-3 border-t border-[rgba(255,248,240,0.06)] flex items-center justify-between">
        <div className="text-xs">
          <p className="text-[#FFF8F0] font-semibold">{idea.founderName}</p>
          <p className="text-[10px] text-[#8F8176]">{idea.createdAt}</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onContactFounder ? onContactFounder(idea) : undefined}
          icon={<Mail size={13} />}
        >
          Join Team
        </Button>
      </div>
    </GlassCard>
  );
};
