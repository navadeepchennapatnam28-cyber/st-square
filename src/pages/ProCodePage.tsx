import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProblemCard } from '../components/pro-code/ProblemCard';
import { codingService } from '../services/codingService';
import { CodingProblem } from '../types';
import {
  Code2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  Layers,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProCodePage: React.FC = () => {
  const { searchQuery, setSearchQuery } = useApp();
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');

  const loadProblems = async () => {
    const list = await codingService.getProblems();
    setProblems(list);
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const topics = ['All', 'Arrays & Dynamic Programming', 'Hash Map & Arrays', 'Sliding Window & Two Pointers', 'Two Pointers & Monotonic Stack'];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'All' || p.topic === selectedTopic;
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Solved' && p.solved) ||
      (statusFilter === 'Unsolved' && !p.solved);

    return matchesSearch && matchesDiff && matchesTopic && matchesStatus;
  });

  const solvedCount = problems.filter(p => p.solved).length;
  const attemptedCount = problems.filter(p => p.attempted && !p.solved).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Pro Code — Placement Algorithmic Arena
            </h1>
            <Badge variant="orange">DSA Practice Hub</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Master multi-approach algorithmic design across Brute Force, Optimized, and Kadane's paradigms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF7A18]/15 border border-[rgba(255,122,24,0.30)] text-[#FF8C32] text-xs font-bold shadow-[0_0_12px_rgba(255,122,24,0.20)]">
            <Flame size={15} className="text-[#FF7A18]" /> 12 Day DSA Streak
          </span>
        </div>
      </div>

      {/* Progress Cockpit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="orange" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">Problems Solved</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{solvedCount}</span>
            <span className="text-xs text-[#8F8176]">/ {problems.length} Curated</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> +100 XP Earned
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">In Progress / Attempted</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FF8C32] font-display">{attemptedCount}</span>
            <span className="text-xs text-[#8F8176]">Active</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            Ready for optimal approach review
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">Average Acceptance</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">50.7%</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            Across campus test platforms
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5">
          <p className="text-xs font-semibold text-[#C5B5A8]">Language Coverage</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-extrabold text-[#FFF8F0] font-display">Java • Python • C++</span>
          </div>
          <p className="text-[11px] text-[#FF8C32] mt-2 font-mono">
            3 Standard Code Implementations
          </p>
        </GlassCard>
      </div>

      {/* Filter and Search Panel */}
      <GlassCard variant="default" className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8176]" />
            <input
              type="text"
              placeholder="Search problems by name, topic, algorithm (Kadane, Two Pointers)..."
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

          {/* Status selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.25)] self-start md:self-auto text-xs">
            {(['All', 'Solved', 'Unsolved'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-black font-bold shadow-[0_0_12px_rgba(255,122,24,0.4)]'
                    : 'text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(255,122,24,0.15)] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#C5B5A8] font-semibold mr-1">Difficulty:</span>
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-black font-bold shadow-[0_0_10px_rgba(255,122,24,0.4)]'
                    : 'bg-[#100D0B] border border-[rgba(255,122,24,0.20)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#C5B5A8] font-semibold mr-1">Topic:</span>
            {topics.map((top) => (
              <button
                key={top}
                onClick={() => setSelectedTopic(top)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedTopic === top
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-black font-bold shadow-[0_0_10px_rgba(255,122,24,0.4)]'
                    : 'bg-[#100D0B] border border-[rgba(255,122,24,0.20)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {top === 'All' ? 'All Topics' : top.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Problems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProblems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </div>
  );
};
