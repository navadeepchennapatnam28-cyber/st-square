import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { demoInterventionCases } from '../data/demoCohort';
import { demoTopAtRiskAreas, demoInterventionImpact } from '../data/demoDashboard';
import { InterventionCase } from '../types';
import { facultyService } from '../services/facultyService';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  TrendingUp,
  Plus,
  Filter,
  Search,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const InterventionsPage: React.FC = () => {
  const { showToast, userRole, userSession, student } = useApp();
  const [cases, setCases] = useState<InterventionCase[]>(demoInterventionCases);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCaseModalOpen, setNewCaseModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<InterventionCase | null>(null);
  const [resolutionModalOpen, setResolutionModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    facultyService.getInterventions({
      isStudent: userRole === 'student',
      studentId: userSession?.id || student?.id,
    }).then((data: InterventionCase[]) => {
      if (isMounted) setCases(data);
    });
    return () => {
      isMounted = false;
    };
  }, [userRole, userSession, student]);

  // New Case Form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newDepartment, setNewDepartment] = useState('Computer Science & AI');
  const [newArea, setNewArea] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newFaculty, setNewFaculty] = useState('Prof. Arvind Subramanian');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  const filteredCases = cases.filter((c) => {
    const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || c.priority === filterPriority;
    const matchesSearch =
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedFaculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.riskTrigger.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleResolveCase = (caseItem: InterventionCase) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === caseItem.id ? { ...c, status: 'Resolved' as const } : c
      )
    );
    showToast(
      'Intervention Resolved',
      `Case #${caseItem.id} for ${caseItem.studentName} marked as successfully resolved.`,
      'success'
    );
    setResolutionModalOpen(false);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newArea.trim()) {
      showToast('Validation Error', 'Please specify student name and target area.', 'error');
      return;
    }

    const created: InterventionCase = {
      id: `int-${Date.now().toString().slice(-4)}`,
      studentId: `st-${Math.floor(Math.random() * 900 + 100)}`,
      studentName: newStudentName,
      department: newDepartment,
      area: newArea,
      riskTrigger: newTrigger || 'Diagnostic threshold deviation detected by ST² AI',
      recommendedAction: newAction || 'Weekly mentor consultation & practice modules',
      assignedFaculty: newFaculty,
      status: 'In Progress',
      priority: newPriority,
      dateAssigned: 'Today',
    };

    setCases([created, ...cases]);
    showToast(
      'Case Created',
      `New intervention case #${created.id} initiated for ${created.studentName}.`,
      'success'
    );
    setNewCaseModalOpen(false);
    setNewStudentName('');
    setNewArea('');
    setNewTrigger('');
    setNewAction('');
  };

  const impactChartData = [
    { category: 'Attendance Defaulters', resolved: 52, active: 14, color: '#FF6A00' },
    { category: 'Coding Speed / DSA', resolved: 44, active: 12, color: '#FF8500' },
    { category: 'Lab Unit Submissions', resolved: 28, active: 7, color: '#FFB347' },
    { category: 'Aptitude Cutoffs', resolved: 18, active: 5, color: '#FFAA33' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(255,122,24,0.25)] bg-gradient-to-r from-[#1A120E] via-[#24130D] to-[#100D0B] p-6 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF7A18]/20 border border-[#FF7A18]/40 text-[#FF7A18]">
                <ShieldAlert size={16} />
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#FF8C32]">
                Academic Risk Management
              </span>
              <Badge variant="orange" size="sm">48 Active Alerts</Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#FFF8F0] font-display tracking-tight">
              Interventions & Remediation Hub
            </h1>
            <p className="text-sm text-[#C5B5A8] max-w-2xl mt-1">
              Track student early-warning triggers, assign actionable mentor remediation plans, and measure intervention resolution rates.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setNewCaseModalOpen(true)}
          >
            Create Intervention Case
          </Button>
        </div>

        {/* Ambient lighting orb */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF7A18]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Intervention Impact Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-l-2 border-l-[#FF7A18]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Total Interventions</span>
            <ShieldAlert size={16} className="text-[#FF7A18]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">
            {demoInterventionImpact.totalInterventions}
          </p>
          <p className="text-[11px] text-[#8F8176] mt-1">Across 6 Semesters</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#10B981]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Resolved Cases</span>
            <CheckCircle2 size={16} className="text-[#10B981]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">
            {demoInterventionImpact.resolvedSuccessfully}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#10B981]">
            <TrendingUp size={12} />
            <span>{demoInterventionImpact.successRate}% Success Rate</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FF8C32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Active Cases</span>
            <Clock size={16} className="text-[#FF8C32]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">
            {demoInterventionImpact.currentlyActive}
          </p>
          <p className="text-[11px] text-[#FF8C32] mt-1">Under Mentor Guidance</p>
        </GlassCard>

        <GlassCard className="p-4 border-l-2 border-l-[#FFB347]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#C5B5A8]">Avg Resolution Time</span>
            <Sparkles size={16} className="text-[#FFB347]" />
          </div>
          <p className="text-2xl font-black text-[#FFF8F0] font-display mt-2">
            {demoInterventionImpact.averageDaysToResolve} Days
          </p>
          <p className="text-[11px] text-[#10B981] mt-1">-1.4 days vs Last Year</p>
        </GlassCard>
      </div>

      {/* Top At-Risk Areas & Impact Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top At-Risk Focus Areas */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-[#FF8C32]" />
              <h3 className="text-base font-bold text-[#FFF8F0] font-display">
                Top At-Risk Areas in Cohort
              </h3>
            </div>
            <Badge variant="orange" size="sm">High Priority</Badge>
          </div>

          <div className="space-y-3">
            {demoTopAtRiskAreas.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.07)] hover:bg-[rgba(255,248,240,0.06)] transition-all flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#FFF8F0]">{item.area}</span>
                    <Badge variant={item.urgency === 'High' ? 'rose' : 'orange'} size="sm">
                      {item.urgency}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#8F8176]">
                    Department: <span className="text-[#C5B5A8]">{item.department}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-[#FF8C32] font-mono">
                    {item.affectedStudents}
                  </span>
                  <p className="text-[10px] text-[#8F8176]">Scholars</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Resolution by Category Chart */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#FFF8F0] font-display">
                Intervention Resolution Distribution
              </h3>
              <p className="text-xs text-[#8F8176]">Resolved vs Active Cases by Focus Area</p>
            </div>
            <Badge variant="orange" size="sm">91.4% Overall</Badge>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactChartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,248,240,0.06)" />
                <XAxis
                  dataKey="category"
                  stroke="#8F8176"
                  fontSize={10}
                  tickLine={false}
                />
                <YAxis
                  dataKey="resolved"
                  stroke="#8F8176"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A120E',
                    borderColor: 'rgba(255,122,24,0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#FFF8F0',
                  }}
                />
                <Bar dataKey="resolved" name="Resolved" fill="#FF7A18" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" name="Active" fill="#FFB347" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Case Management Filter & Table */}
      <GlassCard className="p-4 space-y-4">
        <div className="flex flex-col sm:row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8176]"
            />
            <input
              type="text"
              placeholder="Search case by student, area, or assigned faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl pl-9 pr-4 py-2 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#8F8176] shrink-0">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All" className="bg-[#1A120E] text-[#FFF8F0]">All Statuses</option>
              <option value="Open" className="bg-[#1A120E] text-[#FFF8F0]">Open</option>
              <option value="In Progress" className="bg-[#1A120E] text-[#FFF8F0]">In Progress</option>
              <option value="Resolved" className="bg-[#1A120E] text-[#FFF8F0]">Resolved</option>
            </select>

            <span className="text-[11px] font-semibold text-[#8F8176] shrink-0 ml-2">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-lg px-2.5 py-1.5 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All" className="bg-[#1A120E] text-[#FFF8F0]">All Priorities</option>
              <option value="High" className="bg-[#1A120E] text-[#FFF8F0]">High</option>
              <option value="Medium" className="bg-[#1A120E] text-[#FFF8F0]">Medium</option>
              <option value="Low" className="bg-[#1A120E] text-[#FFF8F0]">Low</option>
            </select>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-3">
          {filteredCases.map((c) => {
            const isResolved = c.status === 'Resolved';
            return (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[rgba(255,248,240,0.02)] border border-[rgba(255,248,240,0.07)] hover:bg-[rgba(255,248,240,0.05)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#FFF8F0] font-mono">{c.id}</span>
                    <h4 className="text-sm font-semibold text-[#FFF8F0]">{c.studentName}</h4>
                    <span className="text-xs text-[#8F8176]">({c.department})</span>
                    <Badge
                      variant={
                        c.priority === 'High'
                          ? 'rose'
                          : c.priority === 'Medium'
                            ? 'orange'
                            : 'amber'
                      }
                      size="sm"
                    >
                      {c.priority} Priority
                    </Badge>
                    <Badge
                      variant={
                        c.status === 'Resolved'
                          ? 'green'
                          : c.status === 'In Progress'
                            ? 'orange'
                            : 'amber'
                      }
                      size="sm"
                    >
                      {c.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#C5B5A8]">
                    <strong className="text-[#FF8C32]">Risk Trigger:</strong> {c.riskTrigger}
                  </p>

                  <p className="text-xs text-[#8F8176]">
                    <strong className="text-[#FFF8F0]">Remediation Action:</strong> {c.recommendedAction}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-[#8F8176] pt-1">
                    <span>Assigned Faculty: <strong className="text-[#C5B5A8]">{c.assignedFaculty}</strong></span>
                    <span>Date Assigned: <strong className="text-[#C5B5A8]">{c.dateAssigned}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {!isResolved ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<CheckCircle2 size={13} />}
                      onClick={() => {
                        setSelectedCase(c);
                        setResolutionModalOpen(true);
                      }}
                    >
                      Mark Resolved
                    </Button>
                  ) : (
                    <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Resolution Confirmation Modal */}
      <Modal
        isOpen={resolutionModalOpen}
        onClose={() => setResolutionModalOpen(false)}
        title="Confirm Intervention Resolution"
      >
        {selectedCase && (
          <div className="space-y-4">
            <p className="text-xs text-[#C5B5A8] leading-relaxed">
              Are you sure you want to resolve case <strong className="text-[#FFF8F0]">#{selectedCase.id}</strong> for <strong className="text-[#FFF8F0]">{selectedCase.studentName}</strong>?
            </p>
            <div className="p-3 rounded-xl bg-[rgba(255,248,240,0.03)] border border-[rgba(255,248,240,0.08)] text-xs text-[#C5B5A8] space-y-1">
              <p><strong>Remediation Target:</strong> {selectedCase.area}</p>
              <p><strong>Faculty:</strong> {selectedCase.assignedFaculty}</p>
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[rgba(255,248,240,0.08)]">
              <Button variant="outline" size="sm" onClick={() => setResolutionModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 size={14} />}
                onClick={() => handleResolveCase(selectedCase)}
              >
                Confirm Resolution
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Case Creation Modal */}
      <Modal
        isOpen={newCaseModalOpen}
        onClose={() => setNewCaseModalOpen(false)}
        title="Initiate New Intervention Case"
      >
        <form onSubmit={handleCreateCase} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">
              Student Full Name & Roll Number
            </label>
            <input
              type="text"
              required
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="e.g., Ananya Verma (ST-2024-8990)"
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-3 py-2 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">Department</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-2.5 py-2 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
              >
                <option value="Computer Science & AI">Computer Science & AI</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Data Science & Analytics">Data Science & Analytics</option>
                <option value="Electronics & Computing">Electronics & Computing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-2.5 py-2 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">
              At-Risk Area / Diagnostic Focus
            </label>
            <input
              type="text"
              required
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              placeholder="e.g., CS605 Attendance Deficit or Dynamic Programming Speed"
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-3 py-2 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">
              Risk Trigger & Supporting Observation
            </label>
            <input
              type="text"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="e.g., Attendance fell to 72% across 3 consecutive weeks"
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl px-3 py-2 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C5B5A8] mb-1">
              Prescribed Remediation Action
            </label>
            <textarea
              rows={2}
              value={newAction}
              onChange={(e) => setNewAction(e.target.value)}
              placeholder="e.g., Mandatory weekend lab makeups and 5 Kadane algorithmic challenges"
              className="w-full bg-[#1A120E] border border-[rgba(255,248,240,0.12)] rounded-xl p-2.5 text-xs text-[#FFF8F0] placeholder-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[rgba(255,248,240,0.08)]">
            <Button variant="outline" size="sm" type="button" onClick={() => setNewCaseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit & Assign Faculty
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
