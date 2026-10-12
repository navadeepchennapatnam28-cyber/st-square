import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SkillsRadarChart } from '../components/charts/SkillsRadarChart';
import { studentService } from '../services/studentService';
import { SkillScore } from '../types';
import {
  Layers,
  MessageSquare,
  Award,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SkillsPage: React.FC = () => {
  const { showToast } = useApp();
  const [skills, setSkills] = useState<SkillScore[]>([]);

  useEffect(() => {
    studentService.getSkillScores().then(setSkills);
  }, []);

  const facultyEndorsements = [
    {
      faculty: 'Dr. Ramesh Sundaram',
      designation: 'Professor & Head, Algorithms Division',
      subject: 'Design & Analysis of Algorithms',
      comment: 'Demonstrates exceptional clarity on Divide-and-Conquer and Dynamic Programming paradigms. Fast debugging aptitude during lab sessions.',
      rating: 5,
    },
    {
      faculty: 'Prof. Ananya Ghosh',
      designation: 'Associate Professor, Cloud Systems',
      subject: 'Cloud Computing & Distributed Systems',
      comment: 'Constructed an impressive multi-container Docker cluster for project work. Highly recommended for cloud backend engineering roles.',
      rating: 5,
    },
    {
      faculty: 'Dr. M. Venkat',
      designation: 'Senior Assistant Professor',
      subject: 'Compiler Design',
      comment: 'Consistent attendance and strong theoretical grounding in finite automata and lexical tokenization pipelines.',
      rating: 4,
    },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Skills Matrix & Faculty Feedback
            </h1>
            <Badge variant="orange">360° Competency Profile</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Standardized technical diagnostics, systems thinking benchmarks, and verified faculty endorsements
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast('Skill Assessment', 'New diagnostic assessment scheduled for this weekend.', 'info')}
          icon={<Sparkles size={14} className="text-[#FF8C32]" />}
        >
          Request Skill Re-Assessment
        </Button>
      </div>

      {/* Radar Matrix & Progress Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <SkillsRadarChart data={skills} />
        </div>

        <div className="lg:col-span-6">
          <GlassCard variant="default" className="p-6">
            <h3 className="text-base font-bold text-[#FFF8F0] font-display mb-4">
              Pillar Proficiency Breakdown
            </h3>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#FFF8F0]">{skill.name}</span>
                    <span className="text-[#FF8C32] font-mono font-bold">
                      {skill.score} <span className="text-[#8F8176] font-normal">/ {skill.fullMark}</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#100D0B] border border-[rgba(255,122,24,0.18)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF7A18] to-[#FF8C32] transition-all shadow-[0_0_8px_rgba(255,122,24,0.4)]"
                      style={{ width: `${(skill.score / skill.fullMark) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Faculty Endorsements & Feedback */}
      <GlassCard variant="default" className="p-6 border-l-2 border-l-[#FF7A18]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">
              Faculty Endorsements & Mentor Notes
            </h3>
          </div>
          <Badge variant="green" size="sm">3 Verified Mentors</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {facultyEndorsements.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#100D0B]/80 border border-[rgba(255,122,24,0.18)] hover:border-[rgba(255,122,24,0.30)] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[#FFB347] mb-2">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-[#FFB347]" />
                  ))}
                </div>
                <p className="text-xs text-[#FFF8F0] italic leading-relaxed mb-4">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[rgba(255,122,24,0.15)]">
                <p className="text-xs font-bold text-[#FFF8F0]">{item.faculty}</p>
                <p className="text-[10px] text-[#C5B5A8]">{item.designation}</p>
                <p className="text-[10px] text-[#FF8C32] font-mono mt-0.5">{item.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
