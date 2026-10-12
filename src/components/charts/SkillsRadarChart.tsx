import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts';
import { SkillScore } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Cpu } from 'lucide-react';

interface SkillsRadarChartProps {
  data: SkillScore[];
}

export const SkillsRadarChart: React.FC<SkillsRadarChartProps> = ({ data }) => {
  return (
    <GlassCard variant="default" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-display">Competency Radar Matrix</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30 flex items-center gap-1">
              <Cpu size={11} /> 7 Core Pillars
            </span>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-0.5">
            Normalized skill benchmarks across technical, systems, and communication vectors
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="name"
              stroke="#A3A3A3"
              fontSize={10.5}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              stroke="#A3A3A3"
              fontSize={9}
              tick={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as SkillScore;
                  return (
                    <div className="bg-[#0A0A0A]/95 border border-[#FF6A00]/30 p-2.5 rounded-xl shadow-2xl text-xs backdrop-blur-xl">
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[#FF8500] font-bold mt-1">
                        Score: {item.score} / {item.fullMark}
                      </p>
                      <p className="text-[10px] text-[#A3A3A3] mt-0.5">
                        Category: {item.category}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Student Proficiency"
              dataKey="score"
              stroke="#FF8500"
              fill="#FF6A00"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
