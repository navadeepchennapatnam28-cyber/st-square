import React, { useState, useMemo, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { demoCohortStudents } from '../data/demoCohort';
import { CohortStudentItem } from '../types';
import { facultyService } from '../services/facultyService';
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Download,
  Mail,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { showToast } = useApp();
  const [students, setStudents] = useState<CohortStudentItem[]>(demoCohortStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedPlacement, setSelectedPlacement] = useState<string>('All');
  const [activeStudent, setActiveStudent] = useState<CohortStudentItem | null>(null);
  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [interventionNote, setInterventionNote] = useState('');

  useEffect(() => {
    let isMounted = true;
    facultyService.getCohortStudents(selectedDept).then((data) => {
      if (isMounted) setStudents(data);
    });
    return () => {
      isMounted = false;
    };
  }, [selectedDept]);

  // Department options
  const departments = [
    'All',
    'Computer Science & AI',
    'Information Technology',
    'Data Science & Analytics',
    'Electronics & Computing',
  ];

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.topWeakness.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = selectedDept === 'All' || s.department === selectedDept;
      const matchesRisk = selectedRisk === 'All' || s.riskLevel === selectedRisk;
      const matchesPlacement = selectedPlacement === 'All' || s.placementStatus === selectedPlacement;

      return matchesSearch && matchesDept && matchesRisk && matchesPlacement;
    });
  }, [students, searchTerm, selectedDept, selectedRisk, selectedPlacement]);

  const handleCreateIntervention = async () => {
    if (!activeStudent) return;
    await facultyService.createIntervention({
      studentId: activeStudent.id,
      studentName: activeStudent.name,
      department: activeStudent.department,
      area: activeStudent.topWeakness || 'Academic Support',
      riskTrigger: `${activeStudent.riskLevel} - Attendance ${activeStudent.attendancePct}%, CGPA ${activeStudent.cgpa}`,
      recommendedAction: 'Targeted mentor consultation and milestone tracking',
      assignedFaculty: 'Assigned Mentor',
      status: 'In Progress',
      priority: activeStudent.riskLevel === 'High Risk' ? 'High' : activeStudent.riskLevel === 'Moderate' ? 'Medium' : 'Low',
    }, interventionNote);
    showToast(
      'Intervention Created',
      `Assigned remedial action plan to ${activeStudent.name} (${activeStudent.rollNo}). Mentor notified.`,
      'success'
    );
    setInterventionModalOpen(false);
    setInterventionNote('');
  };

  const handleSendNotice = () => {
    if (!activeStudent) return;
    showToast(
      'Notice Dispatched',
      `Attendance compliance and academic advisory sent to ${activeStudent.name}.`,
      'info'
    );
    setNoticeModalOpen(false);
  };

  const handleExportData = () => {
    showToast(
      'Export Initiated',
      'Exporting active cohort dataset (2,840 records) to XLSX with audit hashes.',
      'success'
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,122,24,0.30)] bg-gradient-to-r from-[#1A120E] via-[#24130D] to-[#100D0B] p-6 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF7A18]/20 border border-[rgba(255,122,24,0.30)] text-[#FF8C32]">
                <Users size={16} />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#FF8C32]">
                Cohort Intelligence
              </span>
              <Badge variant="orange" size="sm">2,840 Active</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#FFF8F0] font-display tracking-tight">
              Student Cohort Directory
            </h1>
            <p className="text-sm text-[#C5B5A8] max-w-2xl mt-1">
              Search, filter, and inspect institutional student metrics, multi-factor risk profiles, and placement preparedness scores in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleExportData}
            >
              Export Registry
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<ShieldAlert size={14} />}
              onClick={() => {
                const atRisk = students.find((s) => s.riskLevel === 'High Risk');
                if (atRisk) {
                  setActiveStudent(atRisk);
                  setInterventionModalOpen(true);
                }
              }}
            >
              Fast-Track Intervention
            </Button>
          </div>
        </div>

        {/* Subtle ambient light orb */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF7A18]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Cohort KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-l-2 border-l-[#FF7A18]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Total Cohort Size</span>
            <Users size={16} className="text-[#FF8C32]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">2,840</p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
            <TrendingUp size={12} />
            <span>+8.4% YoY Academic Growth</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">At-Risk Students</span>
            <ShieldAlert size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">48</p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#FFB347]">
            <span>1.7% of total cohort flagged</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FF8C32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Avg Success Score</span>
            <Sparkles size={16} className="text-[#FF8C32]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">84.6%</p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-400">
            <span>+3.2% vs Previous Term</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FFB347]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Placement Ready</span>
            <GraduationCap size={16} className="text-[#FFB347]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">82.0%</p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8F8176]">
            <span>182 Offers Recorded</span>
          </div>
        </GlassCard>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]"
            />
            <input
              type="text"
              placeholder="Search by student name, roll number (ST-2024-xxxx), weakness, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#100D0B] border border-[rgba(255,122,24,0.30)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18] focus:ring-1 focus:ring-[#FF7A18]/30 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#C5B5A8] hover:text-[#FFF8F0]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[11px] font-semibold text-[#C5B5A8] shrink-0 flex items-center gap-1">
              <Filter size={12} />
              Dept:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#100D0B] border border-[rgba(255,122,24,0.30)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="bg-[#1A120E] text-[#FFF8F0]">
                  {d}
                </option>
              ))}
            </select>

            {/* Risk Filter */}
            <span className="text-[11px] font-semibold text-[#C5B5A8] shrink-0 ml-2">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-[#100D0B] border border-[rgba(255,122,24,0.30)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All" className="bg-[#1A120E] text-[#FFF8F0]">All Standing</option>
              <option value="Safe" className="bg-[#1A120E] text-[#FFF8F0]">Safe Only</option>
              <option value="Moderate" className="bg-[#1A120E] text-[#FFF8F0]">Moderate Watch</option>
              <option value="High Risk" className="bg-[#1A120E] text-[#FFF8F0]">High Risk</option>
            </select>

            {/* Placement Filter */}
            <span className="text-[11px] font-semibold text-[#C5B5A8] shrink-0 ml-2">Placement:</span>
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="bg-[#100D0B] border border-[rgba(255,122,24,0.30)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All" className="bg-[#1A120E] text-[#FFF8F0]">All Statuses</option>
              <option value="Eligible" className="bg-[#1A120E] text-[#FFF8F0]">Eligible</option>
              <option value="In Preparation" className="bg-[#1A120E] text-[#FFF8F0]">In Prep</option>
              <option value="Needs Attendance" className="bg-[#1A120E] text-[#FFF8F0]">Needs Attendance</option>
            </select>
          </div>
        </div>

        {/* Quick count indicator */}
        <div className="flex items-center justify-between text-[11px] text-[#C5B5A8] pt-2 border-t border-[rgba(255,248,240,0.06)]">
          <span>
            Showing <strong className="text-[#FFF8F0]">{filteredStudents.length}</strong> of{' '}
            <strong className="text-[#FFF8F0]">{students.length}</strong> cohort records
          </span>
          {(searchTerm || selectedDept !== 'All' || selectedRisk !== 'All' || selectedPlacement !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
                setSelectedRisk('All');
                setSelectedPlacement('All');
              }}
              className="text-[#FF8C32] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      </GlassCard>

      {/* Students Data Grid / Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A120E]/95 border-b border-[rgba(255,122,24,0.25)] text-[11px] uppercase tracking-wider text-[#C5B5A8]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Scholar Info</th>
                <th className="py-3.5 px-4 font-semibold">Academic Dept</th>
                <th className="py-3.5 px-4 font-semibold">CGPA</th>
                <th className="py-3.5 px-4 font-semibold">Attendance</th>
                <th className="py-3.5 px-4 font-semibold">Success Score</th>
                <th className="py-3.5 px-4 font-semibold">Risk Standing</th>
                <th className="py-3.5 px-4 font-semibold">Primary Focus Area</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,248,240,0.06)]">
              {filteredStudents.map((st) => {
                const isSafe = st.riskLevel === 'Safe';
                const isMod = st.riskLevel === 'Moderate';
                const isHigh = st.riskLevel === 'High Risk';

                return (
                  <tr
                    key={st.id}
                    className="hover:bg-white/[0.04] transition-colors group"
                  >
                    {/* Student Avatar & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-[#FFF8F0] group-hover:text-[#FF8C32] transition-colors">
                            {st.name}
                          </p>
                          <p className="text-[11px] text-[#8F8176] font-mono">
                            {st.rollNo} • Sem {st.semester}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 text-[#C5B5A8]">
                      {st.department}
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#FFF8F0] text-sm">
                        {st.cgpa.toFixed(2)}
                      </span>
                    </td>

                    {/* Attendance % with progress bar */}
                    <td className="py-3 px-4">
                      <div className="space-y-1 w-28">
                        <div className="flex items-center justify-between text-[11px]">
                          <span
                            className={`font-semibold ${
                              st.attendancePct < 75
                                ? 'text-rose-400'
                                : st.attendancePct < 80
                                ? 'text-[#FFB347]'
                                : 'text-[#FF8C32]'
                            }`}
                          >
                            {st.attendancePct}%
                          </span>
                          {st.attendancePct < 75 && (
                            <span className="text-[9px] text-rose-400 uppercase font-bold">
                              Defaulter
                            </span>
                          )}
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.attendancePct < 75
                                ? 'bg-rose-500'
                                : st.attendancePct < 80
                                ? 'bg-[#FFB347]'
                                : 'bg-[#FF7A18]'
                            }`}
                            style={{ width: `${Math.min(100, st.attendancePct)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Success Score */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#FF8C32]">
                        {st.successScore}%
                      </span>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-4">
                      {isSafe && <Badge variant="green" size="sm">Safe Standing</Badge>}
                      {isMod && <Badge variant="orange" size="sm">Moderate Watch</Badge>}
                      {isHigh && <Badge variant="rose" size="sm">Critical Risk</Badge>}
                    </td>

                    {/* Focus Area */}
                    <td className="py-3 px-4 text-[#C5B5A8] max-w-xs truncate">
                      {st.topWeakness}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Mail size={13} />}
                          title="Dispatch Advisory Notice"
                          onClick={() => {
                            setActiveStudent(st);
                            setNoticeModalOpen(true);
                          }}
                        />
                        <Button
                          variant={isHigh ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setActiveStudent(st);
                            setInterventionModalOpen(true);
                          }}
                        >
                          Intervention
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Intervention Modal */}
      <Modal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        title={`Initiate Intervention — ${activeStudent?.name ?? ''}`}
      >
        {activeStudent && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/8 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5B5A8]">Roll No:</span>
                <span className="text-[#FFF8F0] font-mono font-semibold">{activeStudent.rollNo}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5B5A8]">Risk Level:</span>
                <Badge
                  variant={
                    activeStudent.riskLevel === 'High Risk'
                      ? 'rose'
                      : activeStudent.riskLevel === 'Moderate'
                      ? 'orange'
                      : 'green'
                  }
                  size="sm"
                >
                  {activeStudent.riskLevel}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5B5A8]">Diagnostic Trigger:</span>
                <span className="text-[#FFB347] font-medium">{activeStudent.topWeakness}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#FFF8F0] mb-1.5">
                Faculty Mentor Prescription & Remediation Protocol
              </label>
              <textarea
                rows={3}
                value={interventionNote}
                onChange={(e) => setInterventionNote(e.target.value)}
                placeholder="Specify required milestones (e.g., Mandatory weekend lab makeups, 5 algorithmic challenges in Pro Code, mentor check-in every Thursday)..."
                className="w-full bg-[#100D0B] border border-[rgba(255,122,24,0.30)] rounded-xl p-3 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInterventionModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 size={14} />}
                onClick={handleCreateIntervention}
              >
                Assign & Notify Student
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notice Modal */}
      <Modal
        isOpen={noticeModalOpen}
        onClose={() => setNoticeModalOpen(false)}
        title={`Dispatch Official Academic Advisory`}
      >
        {activeStudent && (
          <div className="space-y-4">
            <p className="text-xs text-[#C5B5A8] leading-relaxed">
              Send an automated institutional notice to <strong className="text-[#FFF8F0]">{activeStudent.name}</strong> ({activeStudent.rollNo}) regarding attendance and semester criteria compliance.
            </p>

            <div className="p-3 rounded-xl bg-[#FF7A18]/10 border border-[rgba(255,122,24,0.30)] text-xs text-[#FFB347]">
              Notice template includes biometric attendance transcript, remaining eligible classes, and condonation regulations.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNoticeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Mail size={14} />}
                onClick={handleSendNotice}
              >
                Send Official Advisory
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
