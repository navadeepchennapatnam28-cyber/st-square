import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { MetricCard } from '../components/dashboard/MetricCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  GraduationCap,
  CalendarCheck,
  BookOpen,
  Trophy,
  Briefcase,
  CheckCircle2,
  Users,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Plus,
  Code2,
  Rocket,
  ChevronRight,
  Send,
  Zap,
  Activity,
  Filter,
  BarChart3,
  ExternalLink,
  Info,
  Check,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { studentService } from '../services/studentService';
import { stPointService } from '../services/stPointService';
import {
  demoMetricCards,
  demoSuccessScoreDistributionDoughnut,
  demoRiskByDepartment,
  demoRecentAlerts,
  demoKeyInsights,
  demoPerformanceOverviewMultiLine,
  demoTopAtRiskAreasBars,
  demoInterventionImpactGrouped,
  demoStudentSegments,
  demoSuggestedDataCategories,
  demoRecentActivities,
} from '../data/demoDashboard';
import {
  MetricCardData,
  SemesterCGPA,
  SubjectAttendance,
  STPointInsight,
} from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [metrics, setMetrics] = useState<MetricCardData[]>(demoMetricCards);
  const [academics, setAcademics] = useState<SemesterCGPA[]>([]);
  const [attendance, setAttendance] = useState<SubjectAttendance[]>([]);
  const [insights, setInsights] = useState<STPointInsight[]>([]);
  const [activities, setActivities] = useState<any[]>(demoRecentActivities);
  const [suggestedData, setSuggestedData] = useState<any[]>(demoSuggestedDataCategories);
  const [loading, setLoading] = useState(true);

  // Interactive filters
  const [insightsTab, setInsightsTab] = useState<'academic' | 'attendance' | 'lms' | 'placement' | 'engagement'>('academic');
  const [riskDeptFilter, setRiskDeptFilter] = useState('All Departments');
  const [semesterFilter, setSemesterFilter] = useState('Semester 6 (Current)');

  // Modals
  const [selectedAlert, setSelectedAlert] = useState<any | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSendNoticeOpen, setIsSendNoticeOpen] = useState(false);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    id: '',
    department: 'School of Computing & AI',
    semester: '6',
    targetRole: 'Software Development Engineer',
  });

  // Notice Form State
  const [notice, setNotice] = useState({
    title: '',
    cohort: 'All Cohorts (Sem 6)',
    urgency: 'Medium',
    message: '',
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [m, ac, att, ins, act, sug] = await Promise.all([
          dashboardService.getMetrics(),
          studentService.getAcademicRecords(),
          studentService.getAttendanceRecords(),
          stPointService.getInsights(),
          dashboardService.getRecentActivities(),
          dashboardService.getSuggestedData(),
        ]);
        if (m && m.length > 0) setMetrics(m);
        setAcademics(ac);
        setAttendance(att);
        setInsights(ins);
        if (act && act.length > 0) setActivities(act);
        if (sug && sug.length > 0) setSuggestedData(sug);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.id) {
      showToast('Validation Error', 'Student name and ID are required', 'error');
      return;
    }
    setIsAddStudentOpen(false);
    showToast(
      'Student Added',
      `${newStudent.name} (${newStudent.id}) registered into Cohort Directory.`,
      'success'
    );
    setNewStudent({
      name: '',
      id: '',
      department: 'School of Computing & AI',
      semester: '6',
      targetRole: 'Software Development Engineer',
    });
  };

  const handleSendNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notice.title || !notice.message) {
      showToast('Validation Error', 'Title and notice message cannot be empty', 'error');
      return;
    }
    setIsSendNoticeOpen(false);
    showToast(
      'Notice Broadcasted',
      `"${notice.title}" has been dispatched to ${notice.cohort}.`,
      'success'
    );
    setNotice({
      title: '',
      cohort: 'All Cohorts (Sem 6)',
      urgency: 'Medium',
      message: '',
    });
  };

  const handleRunAnalytics = () => {
    showToast(
      'Diagnostic Analysis Initiated',
      'Scanning multi-variable metrics across 1,240 student profiles...',
      'info'
    );
    setTimeout(() => {
      showToast(
        'Diagnostic Completed',
        'Cohort telemetry refreshed. 86 watchlist students flagged for counseling.',
        'success'
      );
    }, 1200);
  };

  const handleExportData = () => {
    showToast(
      'Export Generated',
      'ST2-Cohort-Telemetry-2026.csv prepared and downloaded.',
      'success'
    );
  };

  // Filtered department risk progress bars
  const filteredRiskDept =
    riskDeptFilter === 'All Departments'
      ? demoRiskByDepartment
      : demoRiskByDepartment.filter((d) => d.department === riskDeptFilter);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ==================================================
          SECTION 7: WELCOME BANNER
          ================================================== */}
      <WelcomeBanner />

      {/* ==================================================
          SECTION 8: TOP METRIC CARDS (4 LARGE CARDS IN ONE ROW)
          ================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((card) => (
          <MetricCard key={card.id} data={card} />
        ))}
      </div>

      {/* ==================================================
          SECTION 9: MAIN ANALYTICS SECTION
          A. Student Success Score Distribution (Doughnut Chart)
          B. Risk Distribution (Horizontal Progress Bars & Dept Filter)
          C. Recent Alerts
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Student Success Score Distribution Doughnut Chart (5 cols) */}
        <GlassCard className="p-5 lg:col-span-5 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF8500]" />
                <h3 className="text-base font-bold text-white font-display">
                  Student Success Score Distribution
                </h3>
              </div>
              <Badge variant="orange" size="sm">Cohort Benchmark</Badge>
            </div>
            <p className="text-xs text-[#A6A09B] mb-3">
              Distribution of aggregate diagnostic scores across 1,240 active students
            </p>
          </div>

          {/* Doughnut Chart with center text */}
          <div className="h-56 w-full relative flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demoSuccessScoreDistributionDoughnut}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={92}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {demoSuccessScoreDistributionDoughnut.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#100B08',
                    borderColor: 'rgba(255, 106, 0, 0.40)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}
                  formatter={(val: any, name: any) => [`${val} Students (${Math.round((Number(val)/1240)*100)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total Students Text (Section 9.A) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white font-display tracking-tight">1,240</span>
              <span className="text-[10px] font-bold text-[#A6A09B] uppercase tracking-wider">Total Students</span>
            </div>
          </div>

          {/* Doughnut Breakdown Legend */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
            {demoSuccessScoreDistributionDoughnut.map((item, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium text-[#A6A09B] truncate">{item.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-bold text-white font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* B. Risk Distribution Across Departments (4 cols) */}
        <GlassCard className="p-5 lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#FF8500]" />
                <h3 className="text-base font-bold text-white font-display">
                  Risk Distribution
                </h3>
              </div>
              <Badge variant="rose" size="sm">86 Watchlist</Badge>
            </div>
            <p className="text-xs text-[#A6A09B] mb-3">
              Departmental breakdown of scholars needing academic & placement interventions
            </p>

            {/* Department Filter dropdown */}
            <div className="flex items-center justify-between gap-2 mb-3 px-3 py-1.5 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.25)] text-xs">
              <span className="text-[#A6A09B] text-[11px]">Filter:</span>
              <select
                value={riskDeptFilter}
                onChange={(e) => setRiskDeptFilter(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All Departments" className="bg-[#100B08] text-white">All Departments</option>
                <option value="Computer Science" className="bg-[#100B08] text-white">Computer Science</option>
                <option value="Electronics & Communication" className="bg-[#100B08] text-white">Electronics & Comm</option>
                <option value="Mechanical" className="bg-[#100B08] text-white">Mechanical</option>
                <option value="Civil Engineering" className="bg-[#100B08] text-white">Civil Engineering</option>
                <option value="Others" className="bg-[#100B08] text-white">Others</option>
              </select>
            </div>

            {/* Horizontal progress bars for departments (Section 9.B) */}
            <div className="space-y-3">
              {filteredRiskDept.map((dept, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium truncate max-w-[170px]">{dept.department}</span>
                    <span className="text-[#FFB347] font-mono font-bold text-[11px]">
                      {dept.atRisk} at-risk <span className="text-[#A6A09B]">({dept.riskPct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(dept.riskPct * 5, 100)}%`,
                        backgroundColor: dept.color,
                        boxShadow: `0 0 10px ${dept.color}66`,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-[#A6A09B] flex justify-between">
                    <span>Enrolled: {dept.total} scholars</span>
                    <span>Safe: {dept.total - dept.atRisk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#A6A09B]">Institutional Watchlist: <strong>6.9%</strong></span>
            <button
              onClick={() => navigate('/interventions')}
              className="text-[#FF8500] hover:text-[#FFB347] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              Intervention Hub &rarr;
            </button>
          </div>
        </GlassCard>

        {/* C. Recent Alerts (3 cols) */}
        <GlassCard className="p-5 lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#FF8500]" />
                <h3 className="text-base font-bold text-white font-display">
                  Recent Alerts
                </h3>
              </div>
              <Badge variant="orange" size="sm">Live</Badge>
            </div>
            <p className="text-xs text-[#A6A09B] mb-3">
              Automated threshold notifications
            </p>

            <div className="space-y-2.5">
              {demoRecentAlerts.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => setSelectedAlert(alt)}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[rgba(255,106,0,0.4)] hover:bg-white/[0.04] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          alt.severity === 'risk'
                            ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                            : alt.severity === 'warning'
                            ? 'bg-[#FF8500] shadow-[0_0_8px_rgba(255,133,0,0.6)]'
                            : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                        }`}
                      />
                      <h4 className="text-xs font-bold text-white group-hover:text-[#FF8500] transition-colors truncate max-w-[140px]">
                        {alt.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-[#A6A09B] shrink-0 font-mono">{alt.time}</span>
                  </div>

                  <p className="text-[11px] text-[#A6A09B] line-clamp-2 leading-relaxed">
                    {alt.desc}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-[#FFB347] font-medium truncate">{alt.student.split(' ')[0]} • {alt.department}</span>
                    <span className="text-[#FF8500] group-hover:underline font-semibold shrink-0">View Details &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-white/5 text-center">
            <button
              onClick={() => navigate('/interventions')}
              className="text-[11px] text-[#A6A09B] hover:text-white transition-colors"
            >
              View all 24 active cohort alerts
            </button>
          </div>
        </GlassCard>
      </div>

      {/* ==================================================
          SECTION 10: KEY INSIGHTS (WIDE LIQUID GLASS PANEL WITH TABS)
          ================================================== */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#FF8500]" />
              <h3 className="text-lg font-bold text-white font-display">
                Key Diagnostic Insights
              </h3>
            </div>
            <p className="text-xs text-[#A6A09B] mt-0.5">
              Empirical correlation metrics derived from attendance logs, LMS engagement, and placement performance
            </p>
          </div>

          {/* Interactive Category Tabs (Section 10) */}
          <div className="flex items-center gap-1.5 bg-[#080604] p-1.5 rounded-xl border border-[rgba(255,106,0,0.25)] overflow-x-auto no-scrollbar">
            {(['academic', 'attendance', 'lms', 'placement', 'engagement'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setInsightsTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide capitalize transition-all cursor-pointer ${
                  insightsTab === tab
                    ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF8500] text-white shadow-[0_0_12px_rgba(255,106,0,0.35)]'
                    : 'text-[#A6A09B] hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Insight Cards Grid for the active tab */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoKeyInsights[insightsTab].map((ins) => (
            <div
              key={ins.id}
              className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-[rgba(255,106,0,0.25)] hover:border-[#FF6A00]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FF6A00]/15 border border-[#FF6A00]/30 flex items-center justify-center text-[#FF8500]">
                      {insightsTab === 'academic' && <GraduationCap size={16} />}
                      {insightsTab === 'attendance' && <CalendarCheck size={16} />}
                      {insightsTab === 'lms' && <BookOpen size={16} />}
                      {insightsTab === 'placement' && <Briefcase size={16} />}
                      {insightsTab === 'engagement' && <Trophy size={16} />}
                    </div>
                    <h4 className="text-sm font-bold text-white">{ins.title}</h4>
                  </div>
                  <Badge variant="orange" size="sm">{ins.trend}</Badge>
                </div>
                <p className="text-xs text-[#A6A09B] leading-relaxed mt-2">
                  {ins.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-[#A6A09B]">Diagnostic Value:</span>
                <span className="text-sm font-black text-[#FFB347] font-mono">{ins.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ==================================================
          SECTION 11: AI INSIGHTS PANEL
          ================================================== */}
      <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-r from-[#100B08]/95 via-[#1a120b]/90 to-[#080604]/95 border-[rgba(255,106,0,0.35)] shadow-[0_10px_35px_rgba(255,106,0,0.12)]">
        {/* Glow behind circular icon */}
        <div className="absolute top-1/2 left-8 -translate-y-1/2 w-32 h-32 bg-[#FF6A00]/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start md:items-center gap-4">
            {/* Glowing circular intelligence icon container (Section 11) */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6A00] via-[#FF8500] to-[#FFB347] flex items-center justify-center text-[#080604] shrink-0 shadow-[0_0_30px_rgba(255,106,0,0.5)] animate-pulse">
              <Sparkles size={26} className="fill-[#080604] text-[#080604]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF6A00]/20 text-[#FF8500] border border-[#FF6A00]/40">
                  AI INSIGHTS ENGINE
                </span>
                <span className="text-[10px] text-[#A6A09B] font-mono">
                  Continuous Evaluation Model v4.2
                </span>
                <Badge variant="orange" size="sm">Cohort Telemetry</Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Automated Departmental Risk Diagnosis
              </h3>
              <p className="text-xs sm:text-sm text-[#A6A09B] mt-1 max-w-2xl leading-relaxed">
                "Students in the ECE department show higher risk due to low LMS activity and declining internal marks."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
              onClick={() => navigate('/st-point')}
            >
              View Recommended Actions &rarr;
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* ==================================================
          SECTION 12: LOWER DASHBOARD ANALYTICS (3 PANELS)
          A. Student Performance Overview (Multi-line chart, 6 months)
          B. Top At-Risk Areas (Horizontal progress bars)
          C. Intervention Impact (Grouped bar chart Before/After + semester filter)
          ================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Student Performance Overview (5 cols) */}
        <GlassCard className="p-5 lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-[#FF8500]" />
                <h3 className="text-base font-bold text-white font-display">
                  Student Performance Overview
                </h3>
              </div>
              <Badge variant="orange" size="sm">6-Month Trend</Badge>
            </div>
            <p className="text-xs text-[#A6A09B] mb-4">
              Tracking average CGPA, Attendance, and Placement Readiness across Nov–Apr
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={demoPerformanceOverviewMultiLine}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#A6A09B" fontSize={11} tickLine={false} />
                <YAxis stroke="#A6A09B" fontSize={11} tickLine={false} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#100B08',
                    borderColor: 'rgba(255, 106, 0, 0.40)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance %"
                  stroke="#FF6A00"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#FF6A00' }}
                />
                <Line
                  type="monotone"
                  dataKey="placement"
                  name="Placement %"
                  stroke="#FFB347"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#FFB347' }}
                />
                <Line
                  type="monotone"
                  dataKey="cgpa"
                  name="Avg CGPA (x10)"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#FFFFFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#A6A09B]">
            <span>Average CGPA: <strong className="text-white">8.2 / 10</strong></span>
            <span>Attendance Benchmark: <strong className="text-emerald-400">89%</strong></span>
          </div>
        </GlassCard>

        {/* B. Top At-Risk Areas (3 cols) */}
        <GlassCard className="p-5 lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#FF8500]" />
                <h3 className="text-base font-bold text-white font-display">
                  Top At-Risk Areas
                </h3>
              </div>
              <Badge variant="rose" size="sm">Bottlenecks</Badge>
            </div>
            <p className="text-xs text-[#A6A09B] mb-3">
              Cohort deficit distribution requiring remedial intervention
            </p>

            {/* Horizontal progress bars for risk areas (Section 12.B) */}
            <div className="space-y-3">
              {demoTopAtRiskAreasBars.map((area, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium truncate max-w-[130px]">{area.area}</span>
                    <span className="text-[#FF8500] font-mono font-bold text-[11px]">{area.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF8500]"
                      style={{ width: `${area.percentage}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#A6A09B] flex justify-between">
                    <span>{area.affected} Students</span>
                    <span className={area.urgency === 'High' ? 'text-rose-400 font-semibold' : 'text-[#FFB347]'}>
                      {area.urgency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-white/5">
            <button
              onClick={() => navigate('/interventions')}
              className="text-xs text-[#FF8500] hover:text-[#FFB347] font-semibold w-full text-center block"
            >
              Open Interventions Desk &rarr;
            </button>
          </div>
        </GlassCard>

        {/* C. Intervention Impact (Grouped Bar Chart Before/After + Semester Filter) (4 cols) */}
        <GlassCard className="p-5 lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#10D9A0]" />
                <h3 className="text-base font-bold text-white font-display">
                  Intervention Impact
                </h3>
              </div>
              <Badge variant="green" size="sm">91.4% Success</Badge>
            </div>
            <p className="text-xs text-[#A6A09B] mb-2">
              Comparison before vs after faculty interventions
            </p>

            {/* Semester Filter */}
            <div className="flex items-center justify-between gap-2 mb-3 px-3 py-1.5 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.25)] text-xs">
              <span className="text-[#A6A09B] text-[11px]">Semester Filter:</span>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Semester 6 (Current)" className="bg-[#100B08] text-white">Semester 6 (Current)</option>
                <option value="Semester 5 (Historical)" className="bg-[#100B08] text-white">Semester 5 (Historical)</option>
                <option value="All Semesters" className="bg-[#100B08] text-white">All Semesters</option>
              </select>
            </div>
          </div>

          {/* Grouped Bar Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demoInterventionImpactGrouped}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="metric" stroke="#A6A09B" fontSize={11} tickLine={false} />
                <YAxis stroke="#A6A09B" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#100B08',
                    borderColor: 'rgba(255, 106, 0, 0.40)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                  }}
                  formatter={(val: any, name: any) => [`${val}`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="before" name="Before Remediation" fill="#665C54" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After Remediation" fill="#FF6A00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#A6A09B]">
            <span>Average Resolution: <strong className="text-white font-mono">6.2 days</strong></span>
            <span className="text-emerald-400 font-bold">+18.4% Average Boost</span>
          </div>
        </GlassCard>
      </div>

      {/* ==================================================
          SECTION 13: QUICK ACTIONS (HORIZONTAL GLASS PANEL)
          - Add Student
          - View Reports
          - Run Analytics
          - Send Notice
          - Export Data
          ================================================== */}
      <GlassCard className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#FF8500]" />
              <h3 className="text-base font-bold text-white font-display">
                Quick Actions
              </h3>
            </div>
            <p className="text-xs text-[#A6A09B] mt-0.5">
              Execute cohort administrative workflows, notices, and diagnostic exports
            </p>
          </div>
          <Badge variant="orange" size="sm">Administrative Hub</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Add Student */}
          <Button
            variant="outline"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setIsAddStudentOpen(true)}
            className="w-full justify-center"
          >
            Add Student
          </Button>

          {/* View Reports */}
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet size={14} />}
            onClick={() => navigate('/reports')}
            className="w-full justify-center"
          >
            View Reports
          </Button>

          {/* Run Analytics */}
          <Button
            variant="outline"
            size="sm"
            icon={<Activity size={14} />}
            onClick={handleRunAnalytics}
            className="w-full justify-center"
          >
            Run Analytics
          </Button>

          {/* Send Notice */}
          <Button
            variant="outline"
            size="sm"
            icon={<Send size={14} />}
            onClick={() => setIsSendNoticeOpen(true)}
            className="w-full justify-center"
          >
            Send Notice
          </Button>

          {/* Export Data */}
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExportData}
            className="w-full justify-center"
          >
            Export Data
          </Button>
        </div>
      </GlassCard>

      {/* ==================================================
          SECTION 14: STUDENT SEGMENTS (COMPACT GLASS CARDS)
          - Excellent
          - Good
          - Needs Attention
          - At Risk
          ================================================== */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#FF8500]" />
              <h3 className="text-base font-bold text-white font-display">
                Student Segments
              </h3>
            </div>
            <p className="text-xs text-[#A6A09B] mt-0.5">
              Demographic segmentation by academic performance and placement readiness
            </p>
          </div>
          <Badge variant="orange" size="sm">4 Tiers</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {demoStudentSegments.map((seg, idx) => (
            <GlassCard
              key={idx}
              className="p-4 flex flex-col justify-between group hover:border-[#FF6A00]/50 transition-all cursor-pointer"
              onClick={() => navigate('/students')}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {idx === 0 && <Award size={16} className="text-emerald-400" />}
                    {idx === 1 && <CheckCircle2 size={16} className="text-[#FFB347]" />}
                    {idx === 2 && <AlertTriangle size={16} className="text-[#FF8500]" />}
                    {idx === 3 && <ShieldAlert size={16} className="text-rose-400" />}
                  </div>
                  <Badge
                    variant={
                      seg.status === 'positive'
                        ? 'green'
                        : seg.status === 'orange'
                        ? 'orange'
                        : seg.status === 'amber'
                        ? 'amber'
                        : 'rose'
                    }
                    size="sm"
                  >
                    {seg.badge}
                  </Badge>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8500] transition-colors">
                  {seg.segment}
                </h4>
                <p className="text-2xl font-black text-white font-mono mt-1">
                  {seg.count}
                </p>
                <p className="text-[11px] text-[#A6A09B] mt-0.5">
                  {seg.change}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#FF8500] font-semibold group-hover:text-[#FFB347]">
                <span>View All</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Suggested Data Categories (Preserving all existing domains & routes) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-white font-display">
              Suggested Data Categories
            </h3>
            <p className="text-xs text-[#A6A09B]">
              Granular exploration for specific diagnostic and evaluation pillars
            </p>
          </div>
          <Badge variant="orange" size="sm">6 Domains</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestedData.map((category) => (
            <GlassCard
              key={category.id}
              variant="default"
              onClick={() => navigate(category.route)}
              className="p-4 group hover:border-[#FF6A00]/50 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="orange" size="sm">{category.badge}</Badge>
                  <span className="text-[11px] text-[#A6A09B] font-mono">{category.count}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8500] transition-colors">
                  {category.title}
                </h4>
                <p className="text-xs text-[#A6A09B] mt-1 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#FF8500] font-semibold group-hover:text-[#FFB347] transition-colors">
                <span>Explore Domain</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Live Activity & Milestones Telemetry */}
      <GlassCard variant="default" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF8500]" />
            <h3 className="text-base font-bold text-white font-display">Recent Activity & Milestones</h3>
          </div>
          <span className="text-xs text-[#A6A09B]">Live Telemetry</span>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#FF8500]" />
                <div>
                  <p className="text-xs font-semibold text-white">{act.title}</p>
                  <p className="text-[10px] text-[#A6A09B]">{act.category} • {act.timestamp}</p>
                </div>
              </div>
              <Badge variant="orange" size="sm">{act.badge}</Badge>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* ==================================================
          MODAL: RECENT ALERT DETAILS
          ================================================== */}
      <Modal
        isOpen={Boolean(selectedAlert)}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert?.title || 'Alert Details'}
        subtitle={selectedAlert?.student ? `${selectedAlert.student} • ${selectedAlert.department}` : ''}
        maxWidth="md"
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A6A09B]">Timestamp:</span>
                <span className="text-white font-mono">{selectedAlert.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6A09B]">Category:</span>
                <span className="text-[#FF8500] font-semibold">{selectedAlert.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A6A09B]">Trigger Type:</span>
                <span className="text-white font-mono">{selectedAlert.type}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-xs">
              <h5 className="font-bold text-[#FF8500] mb-1">Diagnostic Log</h5>
              <p className="text-[#A6A09B] leading-relaxed">{selectedAlert.desc}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-2">
              <h5 className="font-bold text-white">Recommended Intervention Protocol</h5>
              <ul className="list-disc list-inside text-[#A6A09B] space-y-1">
                <li>Assign mandatory 1-on-1 counseling session with faculty mentor.</li>
                <li>Issue remedial practice modules on ST Point portal.</li>
                <li>Track continuous evaluation metrics in the next bi-weekly audit.</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAlert(null)}
              >
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedAlert(null);
                  navigate('/interventions');
                }}
                icon={<ShieldAlert size={14} />}
              >
                Initiate Intervention
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================================================
          MODAL: ADD STUDENT (QUICK ACTION)
          ================================================== */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Add Student to Cohort Directory"
        subtitle="Register student credentials, academic standing, and diagnostic profile"
        maxWidth="lg"
      >
        <form onSubmit={handleAddStudentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Full Name <span className="text-[#FF6A00]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Priyanshu Sen"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white placeholder-[#A6A09B]/50 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Roll Number / Student ID <span className="text-[#FF6A00]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ST-2024-9104"
                value={newStudent.id}
                onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white placeholder-[#A6A09B]/50 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Department
              </label>
              <select
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              >
                <option value="School of Computing & AI">School of Computing & AI</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                placeholder="e.g. SDE-1 / Data Scientist"
                value={newStudent.targetRole}
                onChange={(e) => setNewStudent({ ...newStudent, targetRole: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white placeholder-[#A6A09B]/50 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddStudentOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
            >
              Save Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* ==================================================
          MODAL: SEND NOTICE (QUICK ACTION)
          ================================================== */}
      <Modal
        isOpen={isSendNoticeOpen}
        onClose={() => setIsSendNoticeOpen(false)}
        title="Broadcast Cohort Notice"
        subtitle="Send official institutional announcements to students via ST²"
        maxWidth="lg"
      >
        <form onSubmit={handleSendNoticeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Notice Title <span className="text-[#FF6A00]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory Placement Orientation"
                value={notice.title}
                onChange={(e) => setNotice({ ...notice, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white placeholder-[#A6A09B]/50 focus:outline-none focus:border-[#FF6A00]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white mb-1.5">
                Target Cohort
              </label>
              <select
                value={notice.cohort}
                onChange={(e) => setNotice({ ...notice, cohort: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white focus:outline-none focus:border-[#FF6A00]"
              >
                <option value="All Cohorts (Sem 6)">All Cohorts (Sem 6)</option>
                <option value="At-Risk Watchlist Only">At-Risk Watchlist Only</option>
                <option value="Computer Science Dept">Computer Science Dept</option>
                <option value="Placement Registered">Placement Registered</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white mb-1.5">
              Notice Body <span className="text-[#FF6A00]">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Enter comprehensive notice instructions, deadlines, or auditorium details..."
              value={notice.message}
              onChange={(e) => setNotice({ ...notice, message: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#080604] border border-[rgba(255,106,0,0.3)] text-xs text-white placeholder-[#A6A09B]/50 focus:outline-none focus:border-[#FF6A00] resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSendNoticeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send size={14} />}
            >
              Dispatch Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
