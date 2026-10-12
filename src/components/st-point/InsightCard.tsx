import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { STPointInsight } from '../../types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ListTodo,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { stPointService } from '../../services/stPointService';

interface InsightCardProps {
  insight: STPointInsight;
  onUpdate?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onUpdate }) => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);

  const priorityBadgeVariant = {
    High: 'rose',
    Medium: 'orange',
    Low: 'amber',
  } as const;

  const handleStartImproving = () => {
    navigate(insight.actionRoute);
  };

  const handleAdvanceProgress = async () => {
    setIsUpdating(true);
    const newProgress = Math.min(100, insight.progressPercentage + 25);
    try {
      await stPointService.updateInsightProgress(insight.id, newProgress);
      showToast(
        'Action Progress Recorded',
        `Progress increased to ${newProgress}%. Keep going!`,
        'success'
      );
      if (onUpdate) onUpdate();
    } finally {
      setIsUpdating(false);
    }
  };

  const isCompleted = insight.status === 'Completed';

  return (
    <GlassCard variant="default" className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 transition-all">
      <div>
        {/* Header Badge Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={priorityBadgeVariant[insight.priority]} size="sm">
              {insight.priority} Priority
            </Badge>
            <span className="text-xs font-semibold text-[#C5B5A8] font-mono">
              {insight.category}
            </span>
          </div>

          <span className={`text-[11px] font-semibold flex items-center gap-1 ${
            isCompleted ? 'text-emerald-400' : 'text-[#FF8C32]'
          }`}>
            {isCompleted ? (
              <><CheckCircle2 size={13} /> Completed</>
            ) : (
              <><Clock size={13} /> {insight.status}</>
            )}
          </span>
        </div>

        {/* Improvement Area Title */}
        <h3 className="text-base font-bold text-[#FFF8F0] font-display mb-1.5 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#FF7A18] shrink-0 mt-1" />
          <span>{insight.improvementArea}</span>
        </h3>

        {/* Supporting Metric Pill */}
        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-[rgba(255,248,240,0.08)] my-2.5 text-xs">
          <span className="text-[#C5B5A8] font-medium">Diagnostic Signal: </span>
          <span className="text-[#FFB347] font-semibold">{insight.supportingMetric}</span>
        </div>

        {/* Explanation */}
        <p className="text-xs text-[#C5B5A8] leading-relaxed mb-3">
          {insight.explanation}
        </p>

        {/* Recommended Action */}
        <div className="p-3 rounded-xl bg-[#FF7A18]/10 border border-[rgba(255,122,24,0.30)] mb-4">
          <p className="text-[11px] font-bold text-[#FF8C32] uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertCircle size={12} /> Strategic Recommendation
          </p>
          <p className="text-xs text-[#FFF8F0] font-medium leading-normal">
            {insight.recommendedAction}
          </p>
        </div>

        {/* Suggested Steps Checklist */}
        {insight.suggestedSteps && insight.suggestedSteps.length > 0 && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-[#C5B5A8] mb-2 flex items-center gap-1.5">
              <ListTodo size={13} /> Recommended Milestones
            </p>
            <ul className="space-y-1.5">
              {insight.suggestedSteps.map((step, idx) => (
                <li key={idx} className="text-xs text-[#C5B5A8] flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A18] mt-1.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Progress Bar & Actions */}
      <div className="pt-3 border-t border-[rgba(255,248,240,0.08)]">
        <div className="flex items-center justify-between text-xs text-[#C5B5A8] mb-1.5">
          <span>Remediation Progress</span>
          <span className="font-bold text-[#FFF8F0]">{insight.progressPercentage}%</span>
        </div>

        {/* Progress Tracker Bar */}
        <div className="w-full h-2 rounded-full bg-[#100D0B] border border-[rgba(255,248,240,0.08)] overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] transition-all duration-500"
            style={{ width: `${insight.progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartImproving}
            className="flex-1"
            icon={<ArrowRight size={14} />}
          >
            Start Improving
          </Button>

          {insight.progressPercentage < 100 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAdvanceProgress}
              isLoading={isUpdating}
              title="Record practice milestone (+25%)"
            >
              +25%
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
