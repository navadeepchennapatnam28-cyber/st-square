import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { studentService } from '../services/studentService';
import { EngagementItem } from '../types';
import {
  Trophy,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EngagementPage: React.FC = () => {
  const { showToast } = useApp();
  const [items, setItems] = useState<EngagementItem[]>([]);

  useEffect(() => {
    studentService.getEngagement().then(setItems);
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Campus Engagement & Credentials
            </h1>
            <Badge variant="orange">Co-Curricular Portfolio</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Verified hackathons, technical leadership roles, external industry certifications, and symposiums
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => showToast('Credential Verification', 'Upload certificate PDF for faculty advisor verification.', 'info')}
          icon={<Plus size={14} />}
        >
          Add Credential
        </Button>
      </div>

      {/* Grid of Verified Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <GlassCard key={item.id} variant="default" className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/50 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant={item.type === 'Hackathon' ? 'orange' : item.type === 'Certification' ? 'amber' : 'orange'} size="sm">
                  {item.type}
                </Badge>
                <span className="text-xs font-semibold text-[#10B981] flex items-center gap-1">
                  <CheckCircle2 size={13} /> {item.verificationStatus}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#FFF8F0] font-display group-hover:text-[#FF8C32] transition-colors mb-1">
                {item.title}
              </h3>

              <div className="p-2.5 rounded-xl bg-[#1A120E]/90 border border-[rgba(255,122,24,0.15)] my-2.5 text-xs">
                <span className="text-[#8F8176]">Role / Achievement: </span>
                <span className="text-[#FF8C32] font-semibold">{item.roleOrResult}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[rgba(255,122,24,0.12)] flex items-center justify-between text-xs text-[#8F8176]">
              <span className="flex items-center gap-1.5 font-mono">
                <Calendar size={13} className="text-[#FF7A18]" /> {item.date}
              </span>
              <span className="font-semibold text-[#FFF8F0]">{item.badge}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
