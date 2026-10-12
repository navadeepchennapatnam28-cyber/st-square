import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProjectItem } from '../../types';
import {
  Bookmark,
  Clock,
  Code2,
  FolderGit2,
  ArrowRight,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { useApp } from '../../context/AppContext';

interface ProjectCardProps {
  project: ProjectItem;
  onUpdate?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdate }) => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await projectService.toggleSaveProject(project.id);
    showToast(
      project.saved ? 'Removed from Saved' : 'Saved to Favorites',
      `"${project.title}" ${project.saved ? 'removed from' : 'added to'} saved projects`,
      'info'
    );
    if (onUpdate) onUpdate();
  };

  const handleStartProject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await projectService.startProject(project.id);
    showToast('Project Initiated!', `Started "${project.title}". Opening detailed roadmap.`, 'success');
    if (onUpdate) onUpdate();
    navigate(`/projects/${project.id}`);
  };

  const difficultyVariant = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'rose',
  } as const;

  return (
    <GlassCard
      variant="default"
      onClick={() => navigate(`/projects/${project.id}`)}
      className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 hover:shadow-[0_8px_25px_rgba(255,122,24,0.20)] cursor-pointer transition-all"
    >
      <div>
        {/* Top Badges & Save Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={difficultyVariant[project.difficulty]} size="sm">
              {project.difficulty}
            </Badge>
            <span className="text-xs text-[#C5B5A8] font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {project.category}
            </span>
          </div>

          <button
            onClick={handleToggleSave}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              project.saved
                ? 'bg-[#FF7A18]/20 border-[#FF7A18]/50 text-[#FF8C32]'
                : 'bg-white/5 border-white/10 text-[#8F8176] hover:text-[#FFF8F0] hover:bg-white/10'
            }`}
            aria-label={project.saved ? 'Unsave project' : 'Save project'}
            title={project.saved ? 'Saved project' : 'Save project'}
          >
            <Bookmark size={15} className={project.saved ? 'fill-[#FF8C32]' : ''} />
          </button>
        </div>

        {/* Project Title */}
        <h3 className="text-base font-bold text-[#FFF8F0] font-display group-hover:text-[#FF8C32] transition-colors leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#C5B5A8] line-clamp-2 mt-2 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.technologyStack.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#100D0B] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0]"
            >
              {tech}
            </span>
          ))}
          {project.technologyStack.length > 4 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 text-[#8F8176]">
              +{project.technologyStack.length - 4}
            </span>
          )}
        </div>

        {/* Skills Learned preview */}
        <div className="mt-3 pt-3 border-t border-[rgba(255,248,240,0.08)] flex items-center justify-between text-xs text-[#C5B5A8]">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#FF8C32]" /> {project.estimatedDuration}
          </span>
          <span className="font-semibold text-[#FFF8F0]">
            {project.skillsLearned[0]}
          </span>
        </div>
      </div>

      {/* Progress Bar & Actions */}
      <div className="mt-4 pt-3 border-t border-[rgba(255,248,240,0.08)]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#C5B5A8]">Roadmap Progress</span>
          <span className="font-bold text-[#FFF8F0]">{project.progressPercentage}%</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-[#100D0B] border border-[rgba(255,248,240,0.08)] overflow-hidden mb-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] transition-all"
            style={{ width: `${project.progressPercentage}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleStartProject}
            icon={project.status === 'Completed' ? <CheckCircle2 size={13} /> : <Play size={13} />}
          >
            {project.status === 'Completed' ? 'Review' : project.status === 'In Progress' ? 'Resume' : 'Start'}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};
