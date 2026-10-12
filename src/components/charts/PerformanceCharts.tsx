import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { SemesterCGPA } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp } from 'lucide-react';

interface PerformanceChartsProps {
  data: SemesterCGPA[];
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ data }) => {
  const [filterRange, setFilterRange] = useState<'all' | 'recent'>('all');

  const filteredData = filterRange === 'recent' ? data.slice(-3) : data;

  return (
    <GlassCard variant="default" className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-display">Academic GPA Progression</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10D9A0]/15 text-[#10D9A0] border border-[#10D9A0]/30 flex items-center gap-1">
              <TrendingUp size={11} /> +0.64 CGPA Growth
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Semester Grade Point Average (SGPA) vs Cumulative GPA (CGPA) on a 10.0 scale
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0A] border border-[#FF6A00]/20 self-start sm:self-auto">
          <button
            onClick={() => setFilterRange('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterRange === 'all'
                ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF8500] text-[#050505] font-bold shadow-md shadow-[#FF6A00]/20'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            All Semesters
          </button>
          <button
            onClick={() => setFilterRange('recent')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterRange === 'recent'
                ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF8500] text-[#050505] font-bold shadow-md shadow-[#FF6A00]/20'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Last 3 Sems
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cgpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#FF6A00" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="sgpaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB347" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#FFB347" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="semester"
              stroke="#A3A3A3"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,106,0,0.15)' }}
            />
            <YAxis
              domain={[7.0, 10.0]}
              stroke="#A3A3A3"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,106,0,0.15)' }}
              tickFormatter={(v) => `${v.toFixed(1)}`}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0A0A0A]/95 border border-[#FF6A00]/30 p-3 rounded-xl shadow-2xl text-xs backdrop-blur-xl">
                      <p className="font-bold text-white mb-1.5">{label}</p>
                      <div className="space-y-1">
                        <p className="text-[#FF6A00] flex justify-between gap-4">
                          <span>CGPA:</span>
                          <span className="font-bold">{payload[0]?.value}</span>
                        </p>
                        <p className="text-[#FFB347] flex justify-between gap-4">
                          <span>SGPA:</span>
                          <span className="font-bold">{payload[1]?.value}</span>
                        </p>
                        {payload[0]?.payload?.credits && (
                          <p className="text-[#A3A3A3] flex justify-between gap-4 pt-1 border-t border-white/10">
                            <span>Credits Earned:</span>
                            <span className="font-semibold text-white">{payload[0].payload.credits}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              wrapperStyle={{ paddingTop: '14px', fontSize: '12px' }}
              formatter={(val) => <span className="text-[#A3A3A3]">{val}</span>}
            />

            <Area
              type="monotone"
              dataKey="cgpa"
              name="Cumulative GPA (CGPA)"
              stroke="#FF6A00"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#cgpaGradient)"
            />
            <Area
              type="monotone"
              dataKey="sgpa"
              name="Semester GPA (SGPA)"
              stroke="#FFB347"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#sgpaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
