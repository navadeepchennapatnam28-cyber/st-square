import { MetricCardData, StudentProfile } from '../types';

export const demoStudentProfile: StudentProfile = {
  name: 'Aarav Sharma',
  id: 'ST-2024-8842',
  program: 'B.Tech Computer Science & Engineering',
  semester: 6,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  email: 'aarav.sharma@st2.edu',
  department: 'School of Computing & AI',
  batch: '2023 - 2027',
};

// Section 8: Top Metric Cards
export const demoMetricCards: MetricCardData[] = [
  {
    id: 'total-students',
    title: 'Total Students',
    value: '1,240',
    unit: 'Students',
    change: '+12% from last month',
    isPositive: true,
    subtitle: 'Across 6 Engineering Departments',
    sparkline: [1020, 1080, 1140, 1180, 1210, 1240],
    route: '/students',
    color: '#FF6A00',
  },
  {
    id: 'at-risk',
    title: 'At-Risk Students',
    value: '86',
    unit: 'Watchlist',
    change: '-4% from last month',
    isPositive: true,
    subtitle: 'Watchlist Cohort',
    sparkline: [112, 104, 98, 92, 88, 86],
    route: '/interventions',
    color: '#FF8500',
  },
  {
    id: 'success-score',
    title: 'Average Success Score',
    value: '76/100',
    unit: 'Score',
    change: '+5% from last month',
    isPositive: true,
    subtitle: 'Institutional Benchmark',
    sparkline: [68, 70, 71, 73, 74, 76],
    route: '/academic',
    color: '#FFB347',
  },
  {
    id: 'internships',
    title: 'Internships Tracked',
    value: '64',
    unit: 'Tracked',
    change: '+12% from last month',
    isPositive: true,
    subtitle: 'Placement Readiness',
    sparkline: [38, 44, 48, 54, 58, 64],
    route: '/placement',
    color: '#FF8500',
  },
];

// Section 9.A: Student Success Score Distribution Doughnut Chart
export const demoSuccessScoreDistributionDoughnut = [
  { name: 'Excellent (80–100)', value: 397, percentage: 32, color: '#FF6A00' },
  { name: 'Good (60–79)', value: 558, percentage: 45, color: '#FFB347' },
  { name: 'Needs Attention (40–59)', value: 198, percentage: 16, color: '#FFFFFF' },
  { name: 'At Risk (0–39)', value: 87, percentage: 7, color: '#665C54' },
];

export const demoSuccessScoreDistribution = [
  { band: '80-100% Excellent', students: 397, percentage: 32 },
  { band: '60-79% Good', students: 558, percentage: 45 },
  { band: '40-59% Attention', students: 198, percentage: 16 },
  { band: '0-39% At Risk', students: 87, percentage: 7 },
];

// Section 9.B: Risk Distribution Across Departments
export const demoRiskByDepartment = [
  { department: 'Computer Science', total: 420, atRisk: 18, riskPct: 4.3, color: '#FF6A00' },
  { department: 'Electronics & Communication', total: 310, atRisk: 34, riskPct: 11.0, color: '#FF8500' },
  { department: 'Mechanical', total: 210, atRisk: 16, riskPct: 7.6, color: '#FFB347' },
  { department: 'Civil Engineering', total: 180, atRisk: 12, riskPct: 6.7, color: '#FFAA33' },
  { department: 'Others', total: 120, atRisk: 6, riskPct: 5.0, color: '#A6A09B' },
];

export const demoRiskDistribution = [
  { name: 'Safe Standing', value: 955, percentage: 77, color: '#10D9A0' },
  { name: 'Moderate Watch', value: 199, percentage: 16, color: '#FFB347' },
  { name: 'At Risk', value: 86, percentage: 7, color: '#F43F5E' },
];

// Section 9.C: Recent Alerts Feed
export const demoRecentAlerts = [
  {
    id: 'alt-1',
    title: 'Low Attendance Triggered',
    desc: 'CS601 Machine Learning attendance dropped below 75% cutoff threshold (currently 71%).',
    student: 'Aarav Sharma (ST-2024-8842)',
    department: 'Computer Science',
    time: '10 mins ago',
    type: 'Low Attendance',
    severity: 'risk',
    category: 'Attendance Risk',
  },
  {
    id: 'alt-2',
    title: 'Low Placement Readiness',
    desc: 'Mock OA technical threshold not cleared in Dynamic Programming practice sprint.',
    student: 'Kavya Patel (ST-2024-7120)',
    department: 'Electronics & Comm',
    time: '1 hour ago',
    type: 'Placement Alert',
    severity: 'risk',
    category: 'Placement',
  },
  {
    id: 'alt-3',
    title: 'Academic Performance Decline',
    desc: 'Mid-term continuous evaluation fell below 7.0 SGPA threshold in 2 theory subjects.',
    student: 'Rohan Verma (ST-2024-6311)',
    department: 'Mechanical',
    time: '3 hours ago',
    type: 'Academic Decline',
    severity: 'warning',
    category: 'Academic',
  },
  {
    id: 'alt-4',
    title: 'High Improvement Logged',
    desc: 'Achieved +18% score jump in DSA algorithmic speed benchmark test.',
    student: 'Ananya Iyer (ST-2024-9041)',
    department: 'Computer Science',
    time: '5 hours ago',
    type: 'High Improvement',
    severity: 'success',
    category: 'Achievement',
  },
];

// Section 10: Key Insights Categories
export const demoKeyInsights = {
  academic: [
    {
      id: 'ins-acad-1',
      title: 'Placement Likelihood in Top Performers',
      explanation: 'Top academic performers (CGPA > 8.5) are 23% more likely to receive Tier-1 engineering offers.',
      metric: '23% More Placed',
      trend: '+4.1% YoY',
      isPositive: true,
    },
    {
      id: 'ins-acad-2',
      title: 'Lab vs Theory Consistency',
      explanation: 'Scholars scoring A+ in lab practicals maintain 92% higher semester subject pass rates.',
      metric: '92% Pass Efficacy',
      trend: '+2.8%',
      isPositive: true,
    },
  ],
  attendance: [
    {
      id: 'ins-att-1',
      title: 'Attendance Risk Threshold',
      explanation: 'Attendance below 75% correlates with a 3.4x higher academic intervention requirement.',
      metric: '< 75% Watchlist',
      trend: '-12% Defaulters',
      isPositive: true,
    },
    {
      id: 'ins-att-2',
      title: 'Morning Session Retention',
      explanation: 'First-period attendance improved by 14% after institutional biometric flex policy.',
      metric: '89.4% Current Avg',
      trend: '+6.2%',
      isPositive: true,
    },
  ],
  lms: [
    {
      id: 'ins-lms-1',
      title: 'Lecture Velocity & Quiz Scores',
      explanation: 'Active daily LMS video lecture completion directly correlates with 18% higher mid-term quiz marks.',
      metric: '+18% Quiz Score',
      trend: '+5.5%',
      isPositive: true,
    },
    {
      id: 'ins-lms-2',
      title: 'Assignment Submission Timeliness',
      explanation: 'On-time homework submission rate across Semester 6 reached 94% institutional high.',
      metric: '94% On-Time',
      trend: '+8.1%',
      isPositive: true,
    },
  ],
  placement: [
    {
      id: 'ins-place-1',
      title: 'Mock Coding Sprint Impact',
      explanation: 'Institutional placement readiness index has improved by 14% following regular Pro Code practice.',
      metric: '76% Cohort Ready',
      trend: '+14% Improvement',
      isPositive: true,
    },
    {
      id: 'ins-place-2',
      title: 'Tier-1 Interview Clearance',
      explanation: '64 student internships currently active with 18 Tier-1 technology companies.',
      metric: '64 Placed',
      trend: '+12% MoM',
      isPositive: true,
    },
  ],
  engagement: [
    {
      id: 'ins-eng-1',
      title: 'Co-Curricular Portfolio Advantage',
      explanation: 'Verified hackathon finalists and open-source project owners secure 2.4x more interview calls.',
      metric: '2.4x Shortlists',
      trend: '+28% Active',
      isPositive: true,
    },
    {
      id: 'ins-eng-2',
      title: 'Technical Leadership Roles',
      explanation: '142 students actively leading departmental technical symposiums and ACM/IEEE chapters.',
      metric: '142 Student Leads',
      trend: '+19% Growth',
      isPositive: true,
    },
  ],
};

// Section 12.A: Student Performance Overview Multi-Line Chart (6 Months)
export const demoPerformanceOverviewMultiLine = [
  { month: 'Nov', cgpa: 7.4, attendance: 82, placement: 58 },
  { month: 'Dec', cgpa: 7.6, attendance: 84, placement: 62 },
  { month: 'Jan', cgpa: 7.7, attendance: 81, placement: 66 },
  { month: 'Feb', cgpa: 7.9, attendance: 85, placement: 71 },
  { month: 'Mar', cgpa: 8.1, attendance: 87, placement: 74 },
  { month: 'Apr', cgpa: 8.2, attendance: 89, placement: 78 },
];

// Section 12.B: Top At-Risk Areas
export const demoTopAtRiskAreasBars = [
  { area: 'Placement Readiness', percentage: 42, affected: 52, urgency: 'High' },
  { area: 'Academic Performance', percentage: 28, affected: 35, urgency: 'High' },
  { area: 'Attendance Deficit', percentage: 21, affected: 26, urgency: 'Medium' },
  { area: 'LMS Engagement', percentage: 16, affected: 20, urgency: 'Medium' },
  { area: 'Others (Electives / Labs)', percentage: 8, affected: 10, urgency: 'Low' },
];

export const demoTopAtRiskAreas = [
  { area: 'Placement Readiness (DSA & OA)', affectedStudents: 52, urgency: 'High', department: 'All Depts' },
  { area: 'Academic Performance (Theory SGPA)', affectedStudents: 35, urgency: 'High', department: 'ECE & Mech' },
  { area: 'Attendance Deficit (< 75% Cutoff)', affectedStudents: 26, urgency: 'Medium', department: 'CSE & Civil' },
  { area: 'LMS Portal Inactivity (< 3 hrs/wk)', affectedStudents: 20, urgency: 'Medium', department: 'IT' },
];

// Section 12.C: Intervention Impact Grouped Comparison
export const demoInterventionImpactGrouped = [
  { metric: 'Attendance', before: 71.2, after: 86.4, gain: '+15.2%' },
  { metric: 'Avg CGPA', before: 6.8, after: 7.9, gain: '+1.1' },
  { metric: 'Placement Score', before: 54.0, after: 78.5, gain: '+24.5%' },
];

export const demoInterventionImpact = {
  totalInterventions: 180,
  resolvedSuccessfully: 142,
  currentlyActive: 38,
  successRate: 91.4,
  averageDaysToResolve: 6.2,
};

// Section 14: Student Segments
export const demoStudentSegments = [
  { segment: 'Excellent (80–100)', count: 397, change: '+18 scholars this month', badge: 'Tier 1', status: 'positive' },
  { segment: 'Good (60–79)', count: 558, change: '+45 stabilized', badge: 'On Track', status: 'orange' },
  { segment: 'Needs Attention (40–59)', count: 198, change: '-14 after advisories', badge: 'Watchlist', status: 'amber' },
  { segment: 'At Risk (0–39)', count: 87, change: '24 in active counseling', badge: 'Critical', status: 'risk' },
];

export const demoSuggestedDataCategories = [
  {
    id: 'academic',
    title: 'Academic Analytics',
    description: 'Semester-wise SGPA, CGPA progression, credit distribution, and theory vs lab grade audit.',
    route: '/academic',
    count: '6 Semesters Logged',
    badge: '8.84 CGPA',
  },
  {
    id: 'attendance',
    title: 'Attendance Records',
    description: 'Subject-wise biometric attendance tracking, margin to 75% cutoff threshold, and leave exemptions.',
    route: '/attendance',
    count: '8 Subjects Monitored',
    badge: '89.4% Avg',
  },
  {
    id: 'lms',
    title: 'LMS Activity',
    description: 'Assignment submission timings, portal engagement streaks, module progress, and quiz metrics.',
    route: '/lms',
    count: '5 Active Modules',
    badge: '94% On-Time',
  },
  {
    id: 'engagement',
    title: 'Campus Engagement',
    description: 'Hackathon podium finishes, technical club leadership, and university symposium credentials.',
    route: '/engagement',
    count: '11 Verified Credentials',
    badge: 'Tier A Leader',
  },
  {
    id: 'placement',
    title: 'Placement Readiness',
    description: 'Coding assessment scores, quantitative aptitude benchmarks, HR mock rubrics, and ATS score.',
    route: '/placement',
    count: '18 Eligible Firms',
    badge: '76% Ready',
  },
  {
    id: 'skills',
    title: 'Skills & Faculty Feedback',
    description: 'Radar assessment of Data Structures, System Design, Communication, and mentorship endorsements.',
    route: '/skills',
    count: '14 Core Competencies',
    badge: '765 / 900',
  },
];

export const demoRecentActivities = [
  {
    id: 'act-1',
    title: "Completed Kadane's Algorithm Practice Sprint",
    category: 'Pro Code',
    timestamp: 'Today, 11:45 AM',
    badge: '+40 Pts',
  },
  {
    id: 'act-2',
    title: 'Biometric Attendance logged: CS601 Distributed Systems',
    category: 'Attendance',
    timestamp: 'Today, 09:30 AM',
    badge: 'Present',
  },
  {
    id: 'act-3',
    title: 'Submitted Capstone Milestone 3 on Capstone Tracker',
    category: 'My Projects',
    timestamp: 'Yesterday, 04:15 PM',
    badge: 'Verified',
  },
  {
    id: 'act-4',
    title: 'Diagnostic Benchmark test in Dynamic Programming',
    category: 'ST Point',
    timestamp: '2 days ago',
    badge: 'Evaluated',
  },
];
