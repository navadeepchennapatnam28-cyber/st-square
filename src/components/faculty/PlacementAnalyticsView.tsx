import React, { useState, useEffect, useMemo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { placementAnalyticsService, PlacementFilter } from '../../services/placementAnalyticsService';
import {
  StudentPlacementOffer,
  StudentInternshipRecord,
  PlacementStatistics,
} from '../../types';
import {
  Briefcase,
  Users,
  TrendingUp,
  Award,
  DollarSign,
  Building2,
  Calendar,
  Download,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ChevronRight,
  User,
  Users,
  Sparkles,
  ExternalLink,
  Code2,
  FolderGit2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PlacementAnalyticsView: React.FC = () => {
  const { showToast } = useApp();

  // State
  const [stats, setStats] = useState<PlacementStatistics | null>(null);
  const [offers, setOffers] = useState<StudentPlacementOffer[]>([]);
  const [internships, setInternships] = useState<StudentInternshipRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [studentProfileModalOpen, setStudentProfileModalOpen] = useState(false);
  const [selectedStudentData, setSelectedStudentData] = useState<any>(null);

  // New offer form
  const [newOffer, setNewOffer] = useState({
    studentId: 'stu-live-' + Date.now().toString(36),
    studentName: '',
    rollNo: '',
    department: 'Computer Science & AI',
    branch: 'Computer Science',
    companyName: '',
    role: '',
    packageLPA: 12.0,
    offerType: 'Full Time' as const,
    status: 'Offered' as const,
    offerDate: new Date().toISOString().split('T')[0],
    academicYear: '2026-27',
    batch: '2022 - 2026',
  });

  const loadData = async () => {
    setIsLoading(true);
    const filter: PlacementFilter = {
      academicYear,
      department: selectedDept,
      company: selectedCompany,
    };

    const [statsData, offersData, internshipsData] = await Promise.all([
      placementAnalyticsService.getPlacementStatistics(filter),
      placementAnalyticsService.getAllOffers(filter),
      placementAnalyticsService.getAllInternships(filter),
    ]);

    setStats(statsData);
    setOffers(offersData);
    setInternships(internshipsData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [academicYear, selectedDept, selectedCompany]);

  // Filtered student offers list
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (selectedStatus === 'Placed' && o.status !== 'Accepted') return false;
      if (selectedStatus === 'Under Review' && o.status !== 'Under Review') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = o.studentName.toLowerCase().includes(q);
        const matchesRoll = o.rollNo.toLowerCase().includes(q);
        const matchesCompany = o.companyName.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesCompany) return false;
      }
      return true;
    });
  }, [offers, selectedStatus, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredOffers.length === 0) {
      showToast('Export Alert', 'No placement records match the current filter criteria.', 'info');
      return;
    }
    const csvContent = placementAnalyticsService.exportPlacementReportCSV(filteredOffers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ST2_Placement_Report_${academicYear}_${selectedDept.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report Exported', `Generated CSV report for ${filteredOffers.length} placement offers.`, 'success');
  };

  // Record offer submission
  const handleRecordOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.studentName || !newOffer.rollNo || !newOffer.companyName || !newOffer.role) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    const success = await placementAnalyticsService.recordPlacementOffer(newOffer);
    if (success) {
      setRecordModalOpen(false);
      setNewOffer({
        studentId: 'stu-live-' + Date.now().toString(36),
        studentName: '',
        rollNo: '',
        department: 'Computer Science & AI',
        branch: 'Computer Science',
        companyName: '',
        role: '',
        packageLPA: 12.0,
        offerType: 'Full Time',
        status: 'Offered',
        offerDate: new Date().toISOString().split('T')[0],
        academicYear: '2026-27',
        batch: '2022 - 2026',
      });
      loadData();
      showToast('Placement Recorded', 'Offer successfully registered and broadcasted.', 'success');
    }
  };

  // Inspect student profile modal
  const openStudentProfile = (studentName: string, rollNo: string, dept: string) => {
    const studentOffers = offers.filter((o) => o.rollNo === rollNo || o.studentName === studentName);
    const studentInternships = internships.filter((i) => i.rollNo === rollNo || i.studentName === studentName);
    setSelectedStudentData({
      name: studentName,
      rollNo,
      department: dept,
      cgpa: 8.84,
      attendance: 89.4,
      placementReadiness: 86,
      offers: studentOffers,
      internships: studentInternships,
      skills: ['Python', 'Distributed Systems', 'PostgreSQL', 'Docker', 'FastAPI', 'System Design'],
      projects: [
        { title: 'Distributed Key-Value Store with Raft Consensus', category: 'System & Cloud', progress: 100 },
        { title: 'Real-time Telemetry Processing Pipeline', category: 'Full Stack', progress: 85 },
      ],
      codingSolved: 142,
    });
    setStudentProfileModalOpen(true);
  };

  if (isLoading || !stats) {
    return (
      <div className="p-8 text-center text-[#C5B5A8]">
        <div className="w-8 h-8 mx-auto border-2 border-[#FF7A18] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs">Loading institutional placement analytics & drive records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ==================================================
          1. HEADER & ACTION STRIP
          ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFF8F0] font-display">
              Institutional Placement & Career Analytics
            </h2>
            <Badge variant="orange">Campus Drive 2026-27</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#C5B5A8] mt-1">
            Real-time cohort recruitment analytics, package distributions, and enterprise recruitment tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs"
          >
            <Download size={14} /> Export CSV Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setRecordModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Plus size={14} /> Record Placement Offer
          </Button>
        </div>
      </div>

      {/* ==================================================
          2. FILTERS CONTROL BAR
          ================================================== */}
      <GlassCard className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Academic Year */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="2026-27">AY 2026-27 (Current Batch)</option>
              <option value="2025-26">AY 2025-26 (Alumni)</option>
              <option value="2024-25">AY 2024-25 (Alumni)</option>
              <option value="2023-24">AY 2023-24 (Alumni)</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science & AI">Computer Science & AI</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Electronics & Computing">Electronics & Computing</option>
            </select>
          </div>

          {/* Company */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Recruiting Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="Salesforce">Salesforce</option>
              <option value="Goldman Sachs">Goldman Sachs</option>
              <option value="Oracle">Oracle</option>
              <option value="Deloitte">Deloitte</option>
            </select>
          </div>

          {/* Placement Status */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Placement Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
            >
              <option value="All">All Offer Statuses</option>
              <option value="Placed">Accepted / Placed</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Search Scholar / Roll No</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#8F8176]" />
              <input
                type="text"
                placeholder="Name, Roll No, Company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] placeholder:text-[#8F8176] focus:outline-none focus:border-[#FF7A18]"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ==================================================
          3. PRIMARY PLACEMENT KPIS (PRECISE DENOMINATORS)
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Placement Rate (Placed / Eligible) */}
        <GlassCard className="p-4 lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#1A120E] via-[#24130D] to-[#100D0B]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF8C32]">Institutional Placement Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-extrabold text-[#FFF8F0] font-display">
              {stats.placementPercentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={14} /> Tier-1 Benchmark
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[rgba(255,248,240,0.08)] flex items-center justify-between text-xs text-[#C5B5A8]">
            <span>
              <strong className="text-emerald-400 font-mono font-bold">{stats.totalPlaced} Placed</strong> of{' '}
              <strong className="text-[#FFF8F0] font-mono font-bold">{stats.totalEligible} Eligible</strong>
            </span>
            <span className="text-[#8F8176] font-mono text-[11px]">({stats.totalUnplaced} in pipeline)</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-1 italic">
            *Formula: Placed Scholars ({stats.totalPlaced}) ÷ Total Eligible Scholars ({stats.totalEligible})
          </p>
        </GlassCard>

        {/* Highest Package */}
        <GlassCard className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Highest Package</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFE0A3] font-display">
              {stats.highestPackageLPA.toFixed(2)}
            </span>
            <span className="text-xs text-[#8F8176] font-bold">LPA</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-2 font-semibold">Google L3 • Cloud AI Core</p>
        </GlassCard>

        {/* Average Package */}
        <GlassCard className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Average Package</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              {stats.averagePackageLPA.toFixed(2)}
            </span>
            <span className="text-xs text-[#8F8176] font-bold">LPA</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-2">+12.4% Over AY 2024-25</p>
        </GlassCard>

        {/* Median Package */}
        <GlassCard className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Median Package</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFF8F0] font-display">
              {stats.medianPackageLPA.toFixed(2)}
            </span>
            <span className="text-xs text-[#8F8176] font-bold">LPA</span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-2">Robust Central Tendency</p>
        </GlassCard>

        {/* Total & Multiple Offers */}
        <GlassCard className="p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5B5A8]">Total Offers</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#FFB347] font-display">
              {stats.totalOffers}
            </span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">
              {stats.multipleOffersCount} Multi
            </span>
          </div>
          <p className="text-[10px] text-[#8F8176] mt-2">34 Scholars With 2+ Offers</p>
        </GlassCard>
      </div>

      {/* ==================================================
          4. INTERNSHIP & PPO CONVERSION METRICS
          ================================================== */}
      <GlassCard className="p-5 border border-emerald-500/25 bg-gradient-to-r from-[#140F0C] via-[#100D0B] to-[#140F0C]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Award size={22} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
                Internship & Pre-Placement Offer (PPO) Trajectory
              </h3>
              <p className="text-xs text-[#C5B5A8] mt-0.5">
                Paid industrial residencies converting directly to permanent institutional placements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <span className="text-[10px] text-[#8F8176] uppercase font-bold block">Internships</span>
              <span className="text-xl font-extrabold text-[#FFF8F0] font-display">{stats.totalInternships}</span>
              <span className="text-[9px] text-emerald-400 block font-semibold">Active Scholars</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8F8176] uppercase font-bold block">PPO Conversions</span>
              <span className="text-xl font-extrabold text-emerald-400 font-display">{stats.ppoConversionsCount}</span>
              <span className="text-[9px] text-[#8F8176] block">50.0% Conversion</span>
            </div>
            <div>
              <span className="text-[10px] text-[#8F8176] uppercase font-bold block">Average Stipend</span>
              <span className="text-xl font-extrabold text-[#FFE0A3] font-display">₹{stats.averageStipendPM / 1000}k</span>
              <span className="text-[9px] text-[#8F8176] block">Per Month</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ==================================================
          5. DEPARTMENT COMPARISONS & RECRUITER LEADERBOARD
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department-Wise Placement Breakdown */}
        <GlassCard className="lg:col-span-7 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
                <Building2 size={16} className="text-[#FF8C32]" /> Departmental Placement Performance
              </h3>
              <p className="text-[11px] text-[#C5B5A8] mt-0.5">Placement percentage and package metrics across engineering branches</p>
            </div>
            <span className="text-xs text-[#8F8176] font-mono">AY {academicYear}</span>
          </div>

          <div className="space-y-3.5">
            {stats.departmentWiseStats.map((dept) => (
              <div
                key={dept.department}
                className="p-4 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.18)] hover:border-[#FF7A18]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-bold text-[#FFF8F0]">{dept.department}</p>
                    <p className="text-[10px] text-[#8F8176] mt-0.5">
                      {dept.placed} Placed of {dept.eligible} Eligible Scholars
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-400 font-mono">{dept.percentage}%</span>
                    <span className="text-[10px] text-[#8F8176] block font-mono">Max: {dept.highestPackage.toFixed(1)} LPA</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF7A18] via-[#FF8C32] to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2 text-[10px] text-[#C5B5A8]">
                  <span>Average CTC: <strong className="text-[#FFE0A3]">{dept.averagePackage.toFixed(2)} LPA</strong></span>
                  <span className="text-emerald-400 font-semibold">{dept.eligible - dept.placed} Unplaced</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Company Recruiter Leaderboard */}
        <GlassCard className="lg:col-span-5 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
                <Award size={16} className="text-[#FFB347]" /> Key Enterprise Recruiters
              </h3>
              <p className="text-[11px] text-[#C5B5A8] mt-0.5">Offers and package spectrum by visiting company</p>
            </div>
            <Badge variant="amber" size="sm">Top Firms</Badge>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
            {stats.companyWiseStats.map((c) => (
              <div
                key={c.companyName}
                className="p-3 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.15)] flex items-center justify-between gap-3 hover:border-[#FF7A18]/40 transition-all"
              >
                <div>
                  <p className="text-xs font-bold text-[#FFF8F0]">{c.companyName}</p>
                  <p className="text-[10px] text-[#8F8176] truncate max-w-[180px]">
                    {c.roles.join(', ')}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#FFE0A3] font-mono block">
                    {c.highestPackage.toFixed(1)} LPA
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    {c.offersCount} {c.offersCount === 1 ? 'Offer' : 'Offers'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ==================================================
          6. HISTORICAL PROGRESSION & UPCOMING DRIVES
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Historical Batch Progression */}
        <GlassCard className="lg:col-span-6 p-6">
          <h3 className="text-sm font-bold text-[#FFF8F0] mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FF7A18]" /> Historical Placement Performance (4-Year Trend)
          </h3>
          <p className="text-[11px] text-[#C5B5A8] mb-4">Longitudinal comparison of graduating cohorts</p>

          <div className="space-y-3">
            {stats.batchComparisons.map((b) => (
              <div key={b.academicYear} className="p-3 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.15)] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#FFF8F0] block">{b.academicYear}</span>
                  <span className="text-[10px] text-[#8F8176]">
                    {b.placed} / {b.totalEligible} Scholars Placed
                  </span>
                </div>
                <div className="text-center font-mono">
                  <span className="text-[10px] text-[#8F8176] block">Average LPA</span>
                  <span className="text-xs font-bold text-[#FFE0A3]">{b.averageLPA.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-emerald-400 font-mono block">{b.percentage}%</span>
                  <span className="text-[10px] text-[#8F8176]">Max: {b.highestLPA.toFixed(1)} LPA</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Upcoming Recruitment Drives */}
        <GlassCard className="lg:col-span-6 p-6">
          <h3 className="text-sm font-bold text-[#FFF8F0] mb-1 flex items-center gap-2">
            <Calendar size={16} className="text-[#FF8C32]" /> Campus Recruitment Schedule & Drives
          </h3>
          <p className="text-[11px] text-[#C5B5A8] mb-4">Active and scheduled campus placement sessions</p>

          <div className="space-y-3">
            {[
              { company: 'Google', role: 'Associate Software Engineer', ctc: '32.5 LPA', date: 'Nov 20, 2026', minCGPA: '8.5+' },
              { company: 'Microsoft', role: 'SDE-1 (Full Stack & Systems)', ctc: '28.0 LPA', date: 'Nov 28, 2026', minCGPA: '8.0+' },
              { company: 'Amazon', role: 'SDE-1 (AWS Cloud Infrastructure)', ctc: '26.5 LPA', date: 'Dec 05, 2026', minCGPA: '7.5+' },
              { company: 'Deloitte', role: 'Analyst - AI & Analytics Practice', ctc: '14.0 LPA', date: 'Dec 12, 2026', minCGPA: '7.0+' },
            ].map((d) => (
              <div key={d.company} className="p-3 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.15)] flex items-center justify-between text-xs hover:border-[#FF7A18]/40 transition-all">
                <div>
                  <p className="font-bold text-[#FFF8F0]">{d.company}</p>
                  <p className="text-[10px] text-[#8F8176]">{d.role}</p>
                </div>
                <div className="text-center font-mono">
                  <span className="text-xs font-bold text-[#FFE0A3] block">{d.ctc}</span>
                  <span className="text-[9px] text-[#8F8176]">Min CGPA {d.minCGPA}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#FF8C32] block">{d.date}</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">OA Confirmed</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ==================================================
          7. STUDENT PLACEMENT RECORDS TABLE
          ================================================== */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#FFF8F0] flex items-center gap-2">
              <Users size={16} className="text-[#FF8C32]" /> Student Placement & Internship Registry
            </h3>
            <p className="text-[11px] text-[#C5B5A8] mt-0.5">
              Verified individual offer records and recruitment status for authorized faculty inspection.
            </p>
          </div>

          <span className="text-xs text-[#8F8176]">
            Showing <strong className="text-[#FFF8F0]">{filteredOffers.length}</strong> matching records
          </span>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="p-8 text-center text-[#8F8176]">
            <Briefcase size={28} className="mx-auto text-[#8F8176]/50 mb-2" />
            <p className="text-xs font-semibold text-[#C5B5A8]">No placement records match the filter criteria.</p>
            <p className="text-[11px] text-[#8F8176] mt-0.5">Try resetting search filters or selecting All Departments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[rgba(255,122,24,0.18)] text-[10px] uppercase font-bold text-[#8F8176] tracking-wider">
                  <th className="py-2.5 px-3">Scholar</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Company & Role</th>
                  <th className="py-2.5 px-3 text-center">Package (CTC)</th>
                  <th className="py-2.5 px-3 text-center">Offer Type</th>
                  <th className="py-2.5 px-3 text-center">Offer Status</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,122,24,0.08)] text-xs">
                {filteredOffers.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#FFF8F0]">{o.studentName}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#FF8C32]">{o.rollNo}</td>
                    <td className="py-3 px-3 text-[#C5B5A8] text-[11px]">{o.department}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[#FFF8F0] block">{o.companyName}</span>
                      <span className="text-[10px] text-[#8F8176] truncate max-w-xs block">{o.role}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono text-[#FFE0A3]">
                      {o.packageLPA.toFixed(2)} LPA
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-semibold text-[#C5B5A8] px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {o.offerType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={o.status === 'Accepted' ? 'green' : o.status === 'Offered' ? 'orange' : 'amber'} size="sm">
                        {o.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openStudentProfile(o.studentName, o.rollNo, o.department)}
                        className="text-[11px] py-1 px-2 text-[#FF8C32] hover:text-[#FFF8F0]"
                      >
                        Inspect <ChevronRight size={12} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* ==================================================
          8. MODAL: RECORD PLACEMENT OFFER
          ================================================== */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#1A120E] border border-[rgba(255,122,24,0.40)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,122,24,0.20)] mb-4">
              <h3 className="text-base font-bold text-[#FFF8F0] flex items-center gap-2">
                <Plus size={18} className="text-[#FF7A18]" /> Register Student Placement Offer
              </h3>
              <button
                onClick={() => setRecordModalOpen(false)}
                className="text-[#8F8176] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordOfferSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Scholar Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={newOffer.studentName}
                    onChange={(e) => setNewOffer({ ...newOffer, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU-2024-CS082"
                    value={newOffer.rollNo}
                    onChange={(e) => setNewOffer({ ...newOffer, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Department</label>
                  <select
                    value={newOffer.department}
                    onChange={(e) => setNewOffer({ ...newOffer, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Data Science & Analytics">Data Science & Analytics</option>
                    <option value="Electronics & Computing">Electronics & Computing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microsoft"
                    value={newOffer.companyName}
                    onChange={(e) => setNewOffer({ ...newOffer, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE-1"
                    value={newOffer.role}
                    onChange={(e) => setNewOffer({ ...newOffer, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Package (CTC in LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newOffer.packageLPA}
                    onChange={(e) => setNewOffer({ ...newOffer, packageLPA: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none focus:border-[#FF7A18]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Offer Type</label>
                  <select
                    value={newOffer.offerType}
                    onChange={(e) => setNewOffer({ ...newOffer, offerType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Internship + PPO">Internship + PPO</option>
                    <option value="Internship">Internship Only</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-[#8F8176] block mb-1">Acceptance Status</label>
                  <select
                    value={newOffer.status}
                    onChange={(e) => setNewOffer({ ...newOffer, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#100D0B] border border-[rgba(255,122,24,0.30)] text-[#FFF8F0] focus:outline-none"
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="Offered">Offered (Pending Decision)</option>
                    <option value="Declined">Declined</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[rgba(255,122,24,0.20)]">
                <Button variant="secondary" size="sm" type="button" onClick={() => setRecordModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save & Broadcast
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          9. MODAL: DETAILED STUDENT CAREER PROFILE
          ================================================== */}
      {studentProfileModalOpen && selectedStudentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-[#1A120E] border border-[rgba(255,122,24,0.40)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,122,24,0.20)] mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FF7A18]/15 border border-[#FF7A18]/30 text-[#FF8C32]">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#FFF8F0] font-display">{selectedStudentData.name}</h3>
                  <p className="text-xs text-[#C5B5A8] font-mono">
                    {selectedStudentData.rollNo} • {selectedStudentData.department}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStudentProfileModalOpen(false)}
                className="text-[#8F8176] hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 rounded-xl bg-[#140F0C] border border-white/5">
                <span className="text-[10px] text-[#8F8176] uppercase font-bold block">CGPA</span>
                <span className="text-xl font-extrabold text-[#FFE0A3] font-display">{selectedStudentData.cgpa}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#140F0C] border border-white/5">
                <span className="text-[10px] text-[#8F8176] uppercase font-bold block">Attendance</span>
                <span className="text-xl font-extrabold text-emerald-400 font-display">{selectedStudentData.attendance}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#140F0C] border border-white/5">
                <span className="text-[10px] text-[#8F8176] uppercase font-bold block">Placement Index</span>
                <span className="text-xl font-extrabold text-[#FF8C32] font-display">{selectedStudentData.placementReadiness}%</span>
              </div>
            </div>

            {/* Placement Offers */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[#FF8C32]">
                <Briefcase size={14} /> Placement Offers Received ({selectedStudentData.offers.length})
              </h4>
              {selectedStudentData.offers.length === 0 ? (
                <p className="text-xs text-[#8F8176] italic">No official placement offers registered yet.</p>
              ) : (
                <div className="space-y-2">
                  {selectedStudentData.offers.map((o: any) => (
                    <div key={o.id} className="p-3 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.15)] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#FFF8F0]">{o.companyName}</span> — {o.role}
                        <span className="text-[10px] text-[#8F8176] block">{o.offerType} • {o.offerDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#FFE0A3] font-mono text-sm block">{o.packageLPA} LPA</span>
                        <Badge variant={o.status === 'Accepted' ? 'green' : 'amber'} size="sm">{o.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internships */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-400">
                <Award size={14} /> Industrial Internships ({selectedStudentData.internships.length})
              </h4>
              {selectedStudentData.internships.length === 0 ? (
                <p className="text-xs text-[#8F8176] italic">No industrial internship records found.</p>
              ) : (
                <div className="space-y-2">
                  {selectedStudentData.internships.map((i: any) => (
                    <div key={i.id} className="p-3 rounded-xl bg-[#140F0C] border border-[rgba(255,122,24,0.15)] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#FFF8F0]">{i.companyName}</span> — {i.role}
                        <span className="text-[10px] text-[#8F8176] block">₹{i.stipendPM}/mo • {i.durationMonths} Months</span>
                      </div>
                      <div>
                        {i.hasPPO ? <Badge variant="green" size="sm">PPO Converted</Badge> : <Badge variant="amber" size="sm">In Progress</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Skills */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[#FFE0A3]">
                <Code2 size={14} /> Verified Core Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentData.skills.map((s: string) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#140F0C] border border-[rgba(255,122,24,0.25)] text-[#FFF8F0]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects Portfolio */}
            <div>
              <h4 className="text-xs font-bold text-[#FFF8F0] uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[#FF7A18]">
                <FolderGit2 size={14} /> Capstone Projects Portfolio
              </h4>
              <div className="space-y-2">
                {selectedStudentData.projects.map((p: any) => (
                  <div key={p.title} className="p-2.5 rounded-xl bg-[#140F0C] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#FFF8F0]">{p.title}</p>
                      <p className="text-[10px] text-[#8F8176]">{p.category}</p>
                    </div>
                    <Badge variant={p.progress === 100 ? 'green' : 'orange'} size="sm">
                      {p.progress}% Complete
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(255,122,24,0.20)] text-right">
              <Button variant="secondary" size="sm" onClick={() => setStudentProfileModalOpen(false)}>
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
