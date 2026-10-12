import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { projectService } from '../services/projectService';
import { ProjectItem } from '../types';
import {
  ArrowLeft,
  Bookmark,
  GitBranch,
  CheckCircle2,
  Circle,
  ExternalLink,
  Save,
  Clock,
  Layers,
  Code2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [githubInput, setGithubInput] = useState('');
  const [isSavingRepo, setIsSavingRepo] = useState(false);

  const loadProject = async () => {
    if (!projectId) return;
    const found = await projectService.getProjectById(projectId);
    if (found) {
      setProject(found);
      setGithubInput(found.githubRepo || '');
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  if (!project) {
    return (
      <div className="p-12 text-center">
        <p className="text-white">Loading project details...</p>
      </div>
    );
  }

  const handleToggleMilestone = async (milestoneId: string, currentCompleted: boolean) => {
    const updated = await projectService.updateMilestone(project.id, milestoneId, !currentCompleted);
    const updatedProj = updated.find(p => p.id === project.id);
    if (updatedProj) setProject(updatedProj);
    showToast(
      !currentCompleted ? 'Milestone Checked!' : 'Milestone Unchecked',
      'Roadmap progress recalculated automatically.',
      'success'
    );
  };

  const handleSaveRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingRepo(true);
    try {
      await projectService.updateGithubRepo(project.id, githubInput.trim());
      showToast('GitHub Link Updated', 'Repository URL attached to your capstone portfolio.', 'success');
      loadProject();
    } finally {
      setIsSavingRepo(false);
    }
  };

  const handleToggleSave = async () => {
    await projectService.toggleSaveProject(project.id);
    showToast(
      project.saved ? 'Removed from Saved' : 'Project Bookmarked',
      `"${project.title}" status updated.`,
      'info'
    );
    loadProject();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-xs font-semibold text-[#8F8176] hover:text-[#FF8C32] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Projects Catalog
        </button>

        <button
          onClick={handleToggleSave}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            project.saved
              ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-[#FF8C32] shadow-[0_0_12px_rgba(255,122,24,0.25)]'
              : 'bg-[#1A120E] border-[rgba(255,122,24,0.2)] text-[#8F8176] hover:text-[#FFF8F0]'
          }`}
        >
          <Bookmark size={14} className={project.saved ? 'fill-[#FF7A18]' : ''} />
          <span>{project.saved ? 'Bookmarked' : 'Save Project'}</span>
        </button>
      </div>

      {/* Hero Overview Glass Card */}
      <GlassCard variant="orange" className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant={project.difficulty === 'Easy' ? 'green' : project.difficulty === 'Medium' ? 'orange' : 'rose'}>
            {project.difficulty}
          </Badge>
          <Badge variant="amber">{project.category}</Badge>
          <span className="text-xs text-[#8F8176] font-mono flex items-center gap-1">
            <Clock size={13} className="text-[#FF8C32]" /> {project.estimatedDuration}
          </span>
          <span className="text-xs text-[#10B981] font-semibold ml-auto">
            Status: {project.status}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display mb-3">
          {project.title}
        </h1>

        <p className="text-sm text-[#C5B5A8] leading-relaxed max-w-3xl mb-6">
          {project.description}
        </p>

        {/* Progress bar */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8F8176] font-medium">Roadmap Completion</span>
            <span className="font-bold text-[#FFF8F0] font-mono">{project.progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#100D0B] border border-[rgba(255,122,24,0.2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] transition-all duration-300 shadow-[0_0_10px_rgba(255,122,24,0.4)]"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>
      </GlassCard>

      {/* Grid: Details & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Statement & Features (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Problem Statement Card */}
          <GlassCard variant="default" className="p-6">
            <h3 className="text-base font-bold text-[#FFF8F0] font-display mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF8C32]" /> Real-World Problem Statement
            </h3>
            <p className="text-xs sm:text-sm text-[#C5B5A8] leading-relaxed">
              {project.problemStatement}
            </p>
          </GlassCard>

          {/* Core Features */}
          <GlassCard variant="default" className="p-6">
            <h3 className="text-base font-bold text-[#FFF8F0] font-display mb-3">
              Core Architectural Features
            </h3>
            <ul className="space-y-2.5">
              {project.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#C5B5A8]">
                  <CheckCircle2 size={15} className="text-[#FF8C32] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Tech Stack & Skills Learned */}
          <GlassCard variant="default" className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-[#8F8176] uppercase tracking-wider mb-2.5">
                  Suggested Tech Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologyStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#100D0B] border border-[rgba(255,122,24,0.25)] text-xs font-mono font-medium text-[#FF8C32]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#8F8176] uppercase tracking-wider mb-2.5">
                  Key Skills Acquired
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.skillsLearned.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#100D0B] border border-[rgba(255,122,24,0.15)] text-xs text-[#FFF8F0]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Learning Resources */}
          <GlassCard variant="default" className="p-6">
            <h3 className="text-base font-bold text-[#FFF8F0] font-display mb-3">
              Curated Documentation & Learning Guides
            </h3>
            <div className="space-y-2">
              {project.learningResources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#1A120E]/80 border border-[rgba(255,122,24,0.15)] hover:border-[rgba(255,122,24,0.3)] transition-all text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF7A18]/15 text-[#FF8C32]">
                      {res.type}
                    </span>
                    <span className="font-semibold text-[#FFF8F0] group-hover:text-[#FF8C32] transition-colors">
                      {res.title}
                    </span>
                  </div>
                  <ExternalLink size={14} className="text-[#8F8176] group-hover:text-[#FFF8F0]" />
                </a>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Milestones Checklist & GitHub Repo (5 cols) */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          {/* GitHub Repo Card */}
          <GlassCard variant="default" className="p-5">
            <h3 className="text-sm font-bold text-[#FFF8F0] font-display flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-[#FF8C32]" /> Project Repository URL
            </h3>
            <p className="text-xs text-[#8F8176] mb-3">
              Link your live GitHub repository for faculty evaluation and recruiter showcase.
            </p>

            <form onSubmit={handleSaveRepo} className="space-y-3">
              <input
                type="url"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="https://github.com/your-username/repo-name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs font-mono placeholder:text-[#8F8176]/50 focus:outline-none focus:border-[#FF8C32] shadow-inner"
              />

              <div className="flex items-center justify-end gap-2">
                {project.githubRepo && (
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#FF8C32] hover:text-[#FFB347] flex items-center gap-1 mr-auto font-semibold"
                  >
                    <ExternalLink size={12} /> Open GitHub
                  </a>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSavingRepo}
                  icon={<Save size={13} />}
                >
                  Save Repo
                </Button>
              </div>
            </form>
          </GlassCard>

          {/* Development Milestones Checklist */}
          <GlassCard variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#FFF8F0] font-display">
                  Development Milestones
                </h3>
                <p className="text-xs text-[#8F8176]">
                  Click to mark steps complete as you build
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#FF8C32]">
                {project.milestones.filter(m => m.completed).length}/{project.milestones.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id, m.completed)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    m.completed
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-[#FFF8F0]'
                      : 'bg-[#100D0B]/80 border-[rgba(255,122,24,0.15)] hover:border-[rgba(255,122,24,0.3)] text-[#8F8176]'
                  }`}
                >
                  <button className="shrink-0 mt-0.5" aria-label="Toggle milestone completion">
                    {m.completed ? (
                      <CheckCircle2 size={16} className="text-[#10B981]" />
                    ) : (
                      <Circle size={16} className="text-[#8F8176]" />
                    )}
                  </button>

                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-tight ${m.completed ? 'text-[#FFF8F0]' : 'text-[#C5B5A8]'}`}>
                      {m.title}
                    </p>
                    <p className="text-[11px] text-[#8F8176] mt-1 leading-normal">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
