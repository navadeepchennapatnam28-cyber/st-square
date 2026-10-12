import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Cell,
} from 'recharts';
import { SubjectAttendance } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface AttendanceChartProps {
  data: SubjectAttendance[];
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  return (
    <GlassCard variant="default" className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-display">Subject-wise Attendance Distribution</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#10D9A0]/15 text-[#10D9A0] border border-[#10D9A0]/30 flex items-center gap-1">
              <ShieldCheck size={11} /> 6 of 7 Subjects Above 80%
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Dotted red line marks the university mandatory 75% examination threshold
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[#A3A3A3]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FF8500]" /> Safe ({'>'}80%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FFB347]" /> Caution (75-80%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" /> Risk ({'<'}75%)
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="subjectCode"
              stroke="#A3A3A3"
              fontSize={11}
              interval={0}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,106,0,0.15)' }}
            />
            <YAxis
              domain={[60, 100]}
              stroke="#A3A3A3"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,106,0,0.15)' }}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as SubjectAttendance;
                  const isBelow = item.percentage < 75;
                  return (
                    <div className="bg-[#0A0A0A]/95 border border-[#FF6A00]/30 p-3 rounded-xl shadow-2xl text-xs backdrop-blur-xl">
                      <p className="font-bold text-white">{item.subjectName}</p>
                      <p className="text-[11px] text-[#A3A3A3] font-mono mb-2">{item.subjectCode}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-[#A3A3A3]">Attendance:</span>
                          <span className={`font-bold ${isBelow ? 'text-[#F43F5E]' : 'text-[#FF8500]'}`}>
                            {item.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-[#A3A3A3]">Attended / Total:</span>
                          <span className="text-white font-medium">
                            {item.attended} / {item.total} classes
                          </span>
                        </div>
                        {isBelow && (
                          <p className="text-[#F43F5E] text-[10px] pt-1 border-t border-white/10 flex items-center gap-1 font-semibold">
                            <AlertTriangle size={11} /> Defaulter Threshold Warning
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <ReferenceLine
              y={75}
              stroke="#F43F5E"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: '75% Cutoff',
                position: 'insideTopLeft',
                fill: '#F43F5E',
                fontSize: 10,
              }}
            />

            <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                let fill = '#FF8500';
                if (entry.percentage < 75) fill = '#F43F5E';
                else if (entry.percentage < 80) fill = '#FFB347';
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
