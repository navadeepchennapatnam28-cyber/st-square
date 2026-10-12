import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../ui/GlassCard';
import {
  TrendingUp,
  ArrowUpRight,
  GraduationCap,
  CalendarCheck,
  Briefcase,
  Cpu,
  Users,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { MetricCardData } from '../../types';

interface MetricCardProps {
  data: MetricCardData;
}

export const MetricCard: React.FC<MetricCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const cardColor = data.color || '#FF7A18';

  const getIcon = (id: string) => {
    switch (id) {
      case 'total-students':
        return <Users className="w-5 h-5 text-[#FF7A18]" />;
      case 'at-risk':
        return <ShieldAlert className="w-5 h-5 text-[#FF8C32]" />;
      case 'success-score':
        return <Sparkles className="w-5 h-5 text-[#FFB347]" />;
      case 'internships':
      case 'placement':
        return <Briefcase className="w-5 h-5 text-[#FF8C32]" />;
      case 'cgpa':
        return <GraduationCap className="w-5 h-5 text-[#FF7A18]" />;
      case 'attendance':
        return <CalendarCheck className="w-5 h-5 text-[#FFB347]" />;
      case 'tech-score':
      default:
        return <Cpu className="w-5 h-5 text-[#FF8C32]" />;
    }
  };

  const chartData = data.sparkline.map((val, idx) => ({ i: idx, val }));

  return (
    <GlassCard
      variant="default"
      onClick={() => navigate(data.route)}
      className="p-5 flex flex-col justify-between group hover:border-[#FF7A18]/60 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(255,122,24,0.22)] transition-all duration-300 cursor-pointer relative overflow-hidden"
    >
      {/* Top subtle highlight border corresponding to the card color */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: cardColor }}
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full bg-[#100D0B] border border-[rgba(255,122,24,0.30)] flex items-center justify-center group-hover:scale-105 group-hover:border-[#FF7A18] transition-all shadow-inner shrink-0"
          >
            {getIcon(data.id)}
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#C5B5A8] group-hover:text-[#FFF8F0] transition-colors">
              {data.title}
            </h3>
            <p className="text-[11px] text-[#8F8176]">{data.subtitle}</p>
          </div>
        </div>

        <button
          className="p-1.5 rounded-lg text-[#C5B5A8] group-hover:text-[#FF8C32] group-hover:bg-white/5 transition-all"
          aria-label={`View detailed ${data.title} analytics`}
        >
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Main Metric Value & Sparkline */}
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display tracking-tight">
              {data.value}
            </span>
            {data.unit && (
              <span className="text-xs font-semibold text-[#C5B5A8]">{data.unit}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-400">
            <TrendingUp size={13} />
            <span>{data.change}</span>
          </div>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="w-24 h-11 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="val"
                stroke={cardColor}
                strokeWidth={2.2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
};
