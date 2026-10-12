import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { AttendanceChart } from '../components/charts/AttendanceChart';
import { studentService } from '../services/studentService';
import { SubjectAttendance } from '../types';
import {
  CalendarCheck,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  PlusCircle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AttendancePage: React.FC = () => {
  const { student, userSession, showToast } = useApp();
  const studentId = userSession?.id || student.id;
  const [attendance, setAttendance] = useState<SubjectAttendance[]>([]);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    subject: 'CS605 - Natural Language Processing',
    date: '2026-10-14',
    reason: 'Medical Consultation',
    description: '',
  });

  useEffect(() => {
    studentService.getAttendanceRecords(studentId).then(setAttendance);
  }, [studentId]);

  const totalClasses = attendance.reduce((acc, curr) => acc + curr.total, 0);
  const attendedClasses = attendance.reduce((acc, curr) => acc + curr.attended, 0);
  const overallPercentage = totalClasses ? ((attendedClasses / totalClasses) * 100).toFixed(1) : '89.4';

  const safeLeavesOverall = Math.max(0, Math.floor((attendedClasses / 0.75) - totalClasses));

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.description.trim()) {
      showToast('Validation Error', 'Please describe the reason for your leave request.', 'error');
      return;
    }
    await studentService.submitLeaveRequest({
      studentId,
      subjectName: leaveForm.subject,
      leaveDate: leaveForm.date,
      reason: leaveForm.reason,
      description: leaveForm.description,
    });
    setLeaveModalOpen(false);
    showToast('Leave Request Submitted', `Medical leave application forwarded to course faculty for approval.`, 'success');
    setLeaveForm({
      subject: 'CS605 - Natural Language Processing',
      date: '2026-10-14',
      reason: 'Medical Consultation',
      description: '',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              Attendance Telemetry & Leave Safety
            </h1>
            <Badge variant="orange">Biometric Synced</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Real-time biometric attendance tracking and exam eligibility threshold monitor
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setLeaveModalOpen(true)}
          icon={<PlusCircle size={14} />}
        >
          Submit Leave Request
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FF7A18]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Cumulative Attendance</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{overallPercentage}%</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
            <ShieldCheck size={12} /> +14.4% Above 75% Cutoff
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FF8C32]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Safety Buffer Cushion</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FF8C32] font-display">{safeLeavesOverall}</span>
            <span className="text-xs text-[#8F8176]">Sessions</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            Maximum classes you can miss safely
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FFB347]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Sessions Logged</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFF8F0] font-display">{attendedClasses}</span>
            <span className="text-xs text-[#8F8176]">/ {totalClasses}</span>
          </div>
          <p className="text-[11px] text-[#8F8176] mt-2">
            Across 7 registered course subjects
          </p>
        </GlassCard>

        <GlassCard variant="default" className="p-5 border-l-2 border-l-[#FFB347]">
          <p className="text-xs font-semibold text-[#C5B5A8]">Subjects Under Watch</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-[#FFB347] font-display">1</span>
            <span className="text-xs text-[#8F8176]">Elective</span>
          </div>
          <p className="text-[11px] text-[#FFB347] mt-2 font-medium flex items-center gap-1">
            <AlertTriangle size={12} /> CS605 hovering at 77.8%
          </p>
        </GlassCard>
      </div>

      {/* Main Chart */}
      <AttendanceChart data={attendance} />

      {/* Detailed Subject Ledger Table */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#FF7A18]" />
            <h3 className="text-base font-bold text-[#FFF8F0] font-display">Course Attendance Register</h3>
          </div>
          <span className="text-xs text-[#8F8176]">Semester 6 B.Tech CSE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,122,24,0.25)] text-[#C5B5A8] font-semibold">
                <th className="pb-3 pl-2">Subject Code & Name</th>
                <th className="pb-3">Faculty In-Charge</th>
                <th className="pb-3">Attended / Total</th>
                <th className="pb-3">Attendance %</th>
                <th className="pb-3">Margin to 75%</th>
                <th className="pb-3 pr-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,248,240,0.06)]">
              {attendance.map((sub) => {
                const margin = sub.percentage - 75;
                const isWarning = sub.percentage < 80;
                return (
                  <tr key={sub.subjectCode} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-3 pl-2">
                      <p className="font-bold text-[#FFF8F0]">{sub.subjectName}</p>
                      <p className="text-[10px] text-[#FF8C32] font-mono">{sub.subjectCode}</p>
                    </td>
                    <td className="py-3 text-[#C5B5A8]">{sub.faculty}</td>
                    <td className="py-3 font-mono text-[#FFF8F0] font-semibold">{sub.attended} / {sub.total}</td>
                    <td className="py-3 font-mono font-bold text-[#FFF8F0]">{sub.percentage.toFixed(1)}%</td>
                    <td className="py-3 font-mono">
                      <span className={margin >= 5 ? 'text-emerald-400 font-semibold' : 'text-[#FFB347] font-semibold'}>
                        {margin >= 0 ? `+${margin.toFixed(1)}% Safe` : `${margin.toFixed(1)}% Alert`}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {isWarning ? (
                        <Badge variant="orange" size="sm">Caution Watch</Badge>
                      ) : (
                        <Badge variant="green" size="sm">Safe Standing</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Leave Application Modal */}
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Submit Absence Exemption / Leave"
        subtitle="Upload medical certificate or event on-duty participation proof for attendance regularization"
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
              Select Subject
            </label>
            <select
              value={leaveForm.subject}
              onChange={(e) => setLeaveForm(prev => ({ ...prev, subject: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18]"
            >
              {attendance.map(s => (
                <option key={s.subjectCode} value={`${s.subjectCode} - ${s.subjectName}`} className="bg-[#1A120E] text-[#FFF8F0]">
                  {s.subjectCode} - {s.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                Date of Absence
              </label>
              <input
                type="date"
                value={leaveForm.date}
                onChange={(e) => setLeaveForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                Exemption Category
              </label>
              <select
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18]"
              >
                <option value="Medical Consultation" className="bg-[#1A120E] text-[#FFF8F0]">Medical Consultation / Health</option>
                <option value="Hackathon / Tech Event" className="bg-[#1A120E] text-[#FFF8F0]">On-Duty: Hackathon / Competition</option>
                <option value="Placement Drive" className="bg-[#1A120E] text-[#FFF8F0]">Placement Interview / Test</option>
                <option value="Family Emergency" className="bg-[#1A120E] text-[#FFF8F0]">Family Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
              Brief Explanation & Documentation Proof
            </label>
            <textarea
              rows={3}
              value={leaveForm.description}
              onChange={(e) => setLeaveForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="State reason and physician or faculty advisor reference details..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] text-xs focus:outline-none focus:border-[#FF7A18] resize-none placeholder-[#8F8176]"
            />
          </div>

          <div className="pt-3 border-t border-[rgba(255,248,240,0.08)] flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Send size={14} />}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
