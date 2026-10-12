import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { StartupIdeaCard } from '../components/startup-desk/StartupIdeaCard';
import { SubmitIdeaModal } from '../components/startup-desk/SubmitIdeaModal';
import { startupService } from '../services/startupService';
import { StartupIdea } from '../types';
import {
  Rocket,
  PlusCircle,
  Users,
  Search,
  Filter,
  Award,
  Sparkles,
  Mail,
  Send,
  Calendar,
  DollarSign,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StartupDeskPage: React.FC = () => {
  const { student, showToast } = useApp();
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [incubatorPrograms, setIncubatorPrograms] = useState<any[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Contact team modal
  const [contactModalIdea, setContactModalIdea] = useState<StartupIdea | null>(null);
  const [pitchMessage, setPitchMessage] = useState('');

  const loadData = async () => {
    const [ideList, colList, incList] = await Promise.all([
      startupService.getIdeas(),
      startupService.getCollaborators(),
      startupService.getIncubatorPrograms(),
    ]);
    setIdeas(ideList);
    setCollaborators(colList);
    setIncubatorPrograms(incList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const domains = ['All', 'EdTech', 'AI & SaaS', 'FinTech', 'CleanTech', 'Campus Life'];
  const stages = ['All', 'Ideation', 'Prototype', 'Validation', 'MVP Ready'];

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = !searchQuery.trim() ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain = selectedDomain === 'All' || idea.domain === selectedDomain;
    const matchesStage = selectedStage === 'All' || idea.stage === selectedStage;

    return matchesSearch && matchesDomain && matchesStage;
  });

  const handleSendPitch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchMessage.trim()) {
      showToast('Validation Error', 'Please write a brief intro about what skills you bring to the team.', 'error');
      return;
    }
    showToast('Application Sent!', `Your collaboration request has been dispatched to ${contactModalIdea?.founderName}.`, 'success');
    setContactModalIdea(null);
    pitchMessage && setPitchMessage('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <GlassCard variant="default" className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-r from-[#24130D]/95 via-[#1A120E]/90 to-[#100D0B]/95 border border-[rgba(255,122,24,0.25)] shadow-[0_0_25px_rgba(255,122,24,0.08)]">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#FF8C32]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-60 h-60 bg-[#FF7A18]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF7A18]/15 border border-[rgba(255,122,24,0.3)] text-[#FF8C32] text-xs font-bold uppercase tracking-wider mb-3 shadow-[0_0_10px_rgba(255,122,24,0.2)]">
              <Rocket size={13} /> Campus Venture Foundry
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#FFF8F0] font-display tracking-tight">
              Have an idea? <span className="bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-[#FFB347] bg-clip-text text-transparent">Build it!</span>
            </h1>
            <p className="text-sm text-[#C5B5A8] mt-2 leading-relaxed">
              Explore student-founded initiatives, pitch early-stage capstone concepts, discover multidisciplinary co-founders, and secure ST² catalyst grants.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsSubmitModalOpen(true)}
            icon={<PlusCircle size={18} />}
            className="shrink-0 self-start md:self-auto"
          >
            Submit an Idea
          </Button>
        </div>
      </GlassCard>

      {/* Filter and Search Bar */}
      <GlassCard variant="default" className="p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8F8176]" />
            <input
              type="text"
              placeholder="Search startup ventures by keyword, problem statement, or required skills (React, IoT)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176]/70 focus:outline-none focus:border-[#FF8C32] shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8F8176]">
            <span>Showing <strong className="text-[#FFF8F0]">{filteredIdeas.length}</strong> Ideas</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[rgba(255,122,24,0.12)] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#8F8176] font-semibold mr-1">Domain:</span>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedDomain === dom
                    ? 'bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] text-black font-bold shadow-[0_0_10px_rgba(255,122,24,0.4)]'
                    : 'bg-[#1A120E] border border-[rgba(255,122,24,0.15)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {dom}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#8F8176] font-semibold mr-1">Stage:</span>
            {stages.map((stg) => (
              <button
                key={stg}
                onClick={() => setSelectedStage(stg)}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedStage === stg
                    ? 'bg-gradient-to-r from-[#FF8C32] to-[#FFB347] text-black font-bold shadow-[0_0_10px_rgba(255,122,24,0.4)]'
                    : 'bg-[#1A120E] border border-[rgba(255,122,24,0.15)] text-[#C5B5A8] hover:text-[#FFF8F0]'
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Startup Ideas Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF8C32]" />
            <h3 className="text-lg font-bold text-[#FFF8F0] font-display">Active Campus Ventures</h3>
          </div>
          <Badge variant="orange" size="sm">Live Idea Incubator</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredIdeas.map((idea) => (
            <StartupIdeaCard
              key={idea.id}
              idea={idea}
              onUpdate={loadData}
              onContactFounder={(targetIdea) => setContactModalIdea(targetIdea)}
            />
          ))}
        </div>
      </div>

      {/* Find Collaborators by Skill Section */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">
              Find Student Co-Founders & Collaborators
            </h3>
          </div>
          <span className="text-xs text-[#8F8176]">Peer Skill Directory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collaborators.map((collab) => (
            <div key={collab.id} className="p-4 rounded-xl bg-[#1A120E]/80 border border-[rgba(255,122,24,0.15)] hover:border-[rgba(255,122,24,0.3)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={collab.avatar}
                    alt={collab.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#FF7A18]/30"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#FFF8F0]">{collab.name}</h4>
                    <p className="text-[10px] text-[#8F8176] font-mono">{collab.batch}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {collab.skills.map((s: string, idx: number) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#100D0B] border border-[rgba(255,122,24,0.2)] text-[#FF8C32]">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[#8F8176] line-clamp-2 leading-relaxed">
                  Looking for: <span className="text-[#FFF8F0] font-medium">{collab.lookingFor}</span>
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[rgba(255,122,24,0.12)] flex items-center justify-between">
                <span className="text-[10px] text-[#8F8176]">{collab.availability}</span>
                <button
                  onClick={() => showToast('Invitation Sent', `Invitation sent to ${collab.name} via campus email.`, 'success')}
                  className="text-xs text-[#FF8C32] hover:text-[#FFB347] font-semibold cursor-pointer"
                >
                  Invite to Team &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Catalyst Incubator Grants & Programs */}
      <GlassCard variant="default" className="p-6 border-l-2 border-l-[#FF7A18]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">
              Collegiate Incubation & Grant Programs
            </h3>
          </div>
          <Badge variant="green" size="sm">Fall 2026 Deadlines</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incubatorPrograms.map((prog) => (
            <div key={prog.id} className="p-4 rounded-xl bg-[#1A120E]/80 border border-[rgba(255,122,24,0.15)] hover:border-[rgba(255,122,24,0.3)] transition-all">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-[#FFF8F0]">{prog.title}</h4>
                <Badge variant="orange" size="sm">{prog.grantAmount}</Badge>
              </div>
              <p className="text-xs text-[#8F8176] mt-1.5 leading-relaxed">
                {prog.eligibility}
              </p>
              <div className="pt-3 mt-3 border-t border-[rgba(255,122,24,0.12)] flex items-center justify-between text-xs text-[#8F8176]">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar size={12} className="text-[#FF7A18]" /> Deadline: {prog.deadline}
                </span>
                <button
                  onClick={() => showToast('Application Started', `Drafting application for ${prog.title}.`, 'info')}
                  className="text-xs font-semibold text-[#FF8C32] hover:text-[#FFB347] hover:underline cursor-pointer"
                >
                  Apply Now &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Submit Idea Modal */}
      <SubmitIdeaModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onIdeaCreated={loadData}
      />

      {/* Join Team Pitch Modal */}
      {contactModalIdea && (
        <Modal
          isOpen={!!contactModalIdea}
          onClose={() => setContactModalIdea(null)}
          title={`Join Team: ${contactModalIdea.title}`}
          subtitle={`Send a pitch directly to founder ${contactModalIdea.founderName}`}
        >
          <form onSubmit={handleSendPitch} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.15)] text-xs text-[#8F8176]">
              <p className="text-[#FFF8F0] font-semibold">Team Requirement:</p>
              <p className="mt-0.5">{contactModalIdea.teamRequirements}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                Your Intro & Skills Pitch
              </label>
              <textarea
                rows={3}
                value={pitchMessage}
                onChange={(e) => setPitchMessage(e.target.value)}
                placeholder="Mention your relevant tech stack, availability, and why you want to build this..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF8C32] resize-none placeholder-[#8F8176]/50 shadow-inner"
              />
            </div>

            <div className="pt-3 border-t border-[rgba(255,122,24,0.12)] flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setContactModalIdea(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<Send size={14} />}>
                Send Pitch
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
