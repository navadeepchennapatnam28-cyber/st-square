import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StartupIdea } from '../../types';
import { useApp } from '../../context/AppContext';
import { startupService } from '../../services/startupService';
import { Sparkles, AlertCircle } from 'lucide-react';

interface SubmitIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaCreated: () => void;
}

export const SubmitIdeaModal: React.FC<SubmitIdeaModalProps> = ({
  isOpen,
  onClose,
  onIdeaCreated,
}) => {
  const { student, showToast } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    proposedSolution: '',
    domain: 'EdTech' as StartupIdea['domain'],
    stage: 'Ideation' as StartupIdea['stage'],
    skillsString: '',
    teamRequirements: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError('Please provide an Idea Title');
      return;
    }
    if (!formData.problemStatement.trim()) {
      setError('Please explain the Problem Statement');
      return;
    }
    if (!formData.proposedSolution.trim()) {
      setError('Please describe your Proposed Solution');
      return;
    }
    if (!formData.skillsString.trim()) {
      setError('Please list at least 1-2 required skills (comma separated)');
      return;
    }
    if (!formData.teamRequirements.trim()) {
      setError('Please specify team requirements or roles needed');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedSkills = formData.skillsString
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await startupService.createIdea({
        title: formData.title.trim(),
        problemStatement: formData.problemStatement.trim(),
        proposedSolution: formData.proposedSolution.trim(),
        domain: formData.domain,
        stage: formData.stage,
        requiredSkills: parsedSkills,
        teamRequirements: formData.teamRequirements.trim(),
        founderName: student.name,
        founderEmail: student.email,
        collaboratorsNeeded: 2,
      });

      showToast('Startup Idea Published!', `"${formData.title}" is now visible to student collaborators.`, 'success');
      onIdeaCreated();
      onClose();
      // Reset form
      setFormData({
        title: '',
        problemStatement: '',
        proposedSolution: '',
        domain: 'EdTech',
        stage: 'Ideation',
        skillsString: '',
        teamRequirements: '',
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to submit idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit a Startup Venture"
      subtitle="Pitch your innovative project to discover co-founders and apply for catalyst grants"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
            Idea Title <span className="text-[#FF7A18]">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. EcoCharge: Solar Smart Bench on Campus"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40"
          />
        </div>

        {/* Domain & Stage in 2 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
              Domain <span className="text-[#FF7A18]">*</span>
            </label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40"
            >
              <option value="EdTech" className="bg-[#1A120E] text-[#FFF8F0]">EdTech</option>
              <option value="AI & SaaS" className="bg-[#1A120E] text-[#FFF8F0]">AI & SaaS</option>
              <option value="FinTech" className="bg-[#1A120E] text-[#FFF8F0]">FinTech</option>
              <option value="CleanTech" className="bg-[#1A120E] text-[#FFF8F0]">CleanTech</option>
              <option value="HealthTech" className="bg-[#1A120E] text-[#FFF8F0]">HealthTech</option>
              <option value="Campus Life" className="bg-[#1A120E] text-[#FFF8F0]">Campus Life</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
              Current Development Stage <span className="text-[#FF7A18]">*</span>
            </label>
            <select
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40"
            >
              <option value="Ideation" className="bg-[#1A120E] text-[#FFF8F0]">Ideation (Problem Validated)</option>
              <option value="Prototype" className="bg-[#1A120E] text-[#FFF8F0]">Prototype (In Progress)</option>
              <option value="Validation" className="bg-[#1A120E] text-[#FFF8F0]">Validation (User Testing)</option>
              <option value="MVP Ready" className="bg-[#1A120E] text-[#FFF8F0]">MVP Ready (Deployed)</option>
            </select>
          </div>
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
            Problem Statement <span className="text-[#FF7A18]">*</span>
          </label>
          <textarea
            name="problemStatement"
            rows={2}
            value={formData.problemStatement}
            onChange={handleChange}
            placeholder="What specific campus, engineering, or societal friction does this resolve?"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40 resize-none"
          />
        </div>

        {/* Proposed Solution */}
        <div>
          <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
            Proposed Solution <span className="text-[#FF7A18]">*</span>
          </label>
          <textarea
            name="proposedSolution"
            rows={2}
            value={formData.proposedSolution}
            onChange={handleChange}
            placeholder="How does your architecture or prototype solve the above problem?"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40 resize-none"
          />
        </div>

        {/* Required Skills */}
        <div>
          <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
            Required Skills (Comma separated) <span className="text-[#FF7A18]">*</span>
          </label>
          <input
            type="text"
            name="skillsString"
            value={formData.skillsString}
            onChange={handleChange}
            placeholder="e.g. React, FastAPI, Docker, UI/UX, OpenCV"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40"
          />
        </div>

        {/* Team Requirements */}
        <div>
          <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
            Team Requirements <span className="text-[#FF7A18]">*</span>
          </label>
          <input
            type="text"
            name="teamRequirements"
            value={formData.teamRequirements}
            onChange={handleChange}
            placeholder="e.g. Looking for 1 Frontend engineer and 1 Cloud/DevOps lead"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A120E] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0] text-xs placeholder:text-[#8F8176]/50 focus:outline-none focus:border-[#FF7A18]/70 focus:ring-1 focus:ring-[#FF7A18]/40"
          />
        </div>

        {/* Submit Buttons */}
        <div className="pt-3 border-t border-[rgba(255,248,240,0.08)] flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={<Sparkles size={14} />}
          >
            Publish Startup Idea
          </Button>
        </div>
      </form>
    </Modal>
  );
};
