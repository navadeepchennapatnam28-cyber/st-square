import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProjectCard } from '../components/projects/ProjectCard';
import { projectService } from '../services/projectService';
import { ProjectItem } from '../types';
import {
  FolderGit2,
  Search,
  Filter,
  Bookmark,
  Sparkles,
  Layers,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProjectsPage: React.FC = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'progress' | 'title' | 'duration'>('progress');

  const loadProjects = async () => {
    const list = await projectService.getProjects();
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const categories = ['All', 'Full Stack', 'AI & ML', 'IoT / Mobile', 'System & Cloud'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filteredProjects = projects
    .filter(p => {
      // Search filter
      const matchesSearch = !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologyStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;

      // Difficulty filter
      const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      // Saved only filter
      const matchesSaved = !showSavedOnly || p.saved;

      return matchesSearch && matchesCat && matchesDiff && matchesSaved;
    })
    .sort((a, b) => {
      if (sortBy === 'progress') return b.progressPercentage - a.progressPercentage;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return a.estimatedDuration.localeCompare(b.estimatedDuration);
    });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Curated Projects & Capstone Tracker
            </h1>
            <Badge variant="orange">{projects.length} Portfolios</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Build production-grade systems from real-world campus problem statements to elevate your resume
          </p>
        </div>

        <button
          onClick={() => setShowSavedOnly(prev => !prev)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showSavedOnly
              ? 'bg-[#FF7A18]/20 border-[#FF7A18] text-[#FF8C32] shadow-[0_0_12px_rgba(255,122,24,0.25)]'
              : 'bg-[#100D0B] border-[rgba(255,122,24,0.25)] text-[#C5B5A8] hover:text-[#FFF8F0]'
          }`}
        >
          <Bookmark size={14} className={showSavedOnly ? 'fill-[#FF7A18]' : ''} />
          <span>Saved Projects ({projects.filter(p => p.saved).length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <GlassCard variant="default" className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8176]" />
            <input
              type="text"
              placeholder="Search projects by title, stack (React, Node, IoT, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176] focus:outline-none focus:border-[#FF7A18] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C5B5A8] hover:text-[#FFF8F0]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#C5B5A8] flex items-center gap-1">
              <ArrowUpDown size={12} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="progress" className="bg-[#1A120E] text-[#FFF8F0]">Highest Progress</option>
              <option value="title" className="bg-[#1A120E] text-[#FFF8F0]">Alphabetical (A-Z)</option>
              <option value="duration" className="bg-[#1A120E] text-[#FFF8F0]">Duration</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Rows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(255,122,24,0.15)] text-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#C5B5A8] font-semibold mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-black font-bold shadow-[0_0_10px_rgba(255,122,24,0.4)]'
                    : 'bg-[#100D0B] border border-[rgba(255,122,24,0.20)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#C5B5A8] font-semibold mr-1">Difficulty:</span>
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-gradient-to-r from-[#FF8C32] to-[#FFB347] text-black font-bold shadow-[0_0_10px_rgba(255,140,50,0.4)]'
                    : 'bg-[#100D0B] border border-[rgba(255,122,24,0.20)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#100D0B] border border-[rgba(255,122,24,0.25)]">
          <FolderGit2 className="w-12 h-12 text-[#8F8176]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#FFF8F0] font-display">No Projects Found</h3>
          <p className="text-xs text-[#C5B5A8] mt-1 max-w-sm mx-auto">
            No projects matched your active filters or search terms. Try clearing the search or category filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDifficulty('All');
              setShowSavedOnly(false);
              setSearchQuery('');
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={loadProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
};
