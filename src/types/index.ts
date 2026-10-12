export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface StudentProfile {
  name: string;
  id: string;
  program: string;
  semester: number;
  avatarUrl: string;
  email: string;
  department: string;
  batch: string;
  phone?: string;
}

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
  sparkline: number[];
  route: string;
  color: string;
}

export interface SemesterCGPA {
  semester: string;
  cgpa: number;
  sgpa: number;
  credits: number;
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  attended: number;
  total: number;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
  faculty: string;
}

export interface LMSCourseActivity {
  courseName: string;
  courseCode: string;
  completedModules: number;
  totalModules: number;
  assignmentScore: number;
  lastActive: string;
}

export interface EngagementItem {
  id: string;
  title: string;
  type: 'Hackathon' | 'Club' | 'Workshop' | 'Certification' | 'Tech Fest';
  roleOrResult: string;
  date: string;
  badge: string;
  verificationStatus: 'Verified' | 'Pending Review';
}

export interface PlacementBreakdown {
  readinessScore: number; // 0 - 100
  aptitudeScore: number;
  codingScore: number;
  communicationScore: number;
  resumeScore: number;
  mockInterviewsCompleted: number;
  targetRole: string;
  eligibleCompaniesCount: number;
  companiesList: {
    name: string;
    role: string;
    packageLPA: string;
    eligibilityStatus: 'Eligible' | 'Needs 75%+ Att' | 'Target CGPA 8.5+';
    testDate: string;
  }[];
}

export interface SkillScore {
  name: string;
  score: number; // 0 - 100
  fullMark: number;
  category: 'Technical' | 'Core' | 'Soft Skills';
}

export interface STPointInsight {
  id: string;
  category: 'Coding' | 'Academic' | 'Placement' | 'Attendance' | 'Communication';
  improvementArea: string;
  supportingMetric: string;
  explanation: string;
  recommendedAction: string;
  actionRoute: string;
  priority: 'High' | 'Medium' | 'Low';
  progressPercentage: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  suggestedSteps: string[];
}

export interface CodeApproach {
  name: string; // e.g. "Brute Force", "Optimized", "Kadane's Algorithm"
  explanation: string;
  algorithmSteps: string[];
  timeComplexity: string;
  spaceComplexity: string;
  codeSnippets: {
    java: string;
    python: string;
    cpp: string;
  };
}

export interface CodingProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: DifficultyLevel;
  topic: string;
  acceptanceRate: string;
  solved: boolean;
  attempted: boolean;
  description: string;
  constraints: string[];
  sampleCases: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  hints: string[];
  approaches: CodeApproach[];
  starterCode: {
    java: string;
    python: string;
    cpp: string;
  };
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  difficulty: DifficultyLevel;
  category: 'Full Stack' | 'AI & ML' | 'IoT / Mobile' | 'System & Cloud';
  technologyStack: string[];
  skillsLearned: string[];
  estimatedDuration: string;
  progressPercentage: number;
  saved: boolean;
  status: 'Not Started' | 'In Progress' | 'Completed';
  githubRepo?: string;
  features: string[];
  milestones: ProjectMilestone[];
  learningResources: {
    title: string;
    type: 'Documentation' | 'Video Guide' | 'API Spec' | 'Tutorial';
    url: string;
  }[];
}

export interface StartupIdea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  domain: 'EdTech' | 'FinTech' | 'HealthTech' | 'AI & SaaS' | 'CleanTech' | 'Campus Life';
  requiredSkills: string[];
  stage: 'Ideation' | 'Prototype' | 'Validation' | 'MVP Ready';
  teamRequirements: string;
  founderName: string;
  founderEmail: string;
  saved: boolean;
  createdAt: string;
  upvotes: number;
  collaboratorsNeeded: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
  link?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}

export interface CohortStudentItem {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: number;
  cgpa: number;
  attendancePct: number;
  successScore: number;
  riskLevel: 'Safe' | 'Moderate' | 'High Risk';
  topWeakness: string;
  placementStatus: 'Eligible' | 'Needs Attendance' | 'In Preparation';
  avatar: string;
}

export interface InterventionCase {
  id: string;
  studentId: string;
  studentName: string;
  department: string;
  area: string;
  riskTrigger: string;
  recommendedAction: string;
  assignedFaculty: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  dateAssigned: string;
}

export interface InstitutionalReport {
  id: string;
  title: string;
  category: 'Academic' | 'Attendance' | 'Placement' | 'Interventions' | 'Accreditation';
  generatedDate: string;
  period: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  size: string;
  downloads: number;
  description: string;
}

export interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  role: 'faculty' | 'admin';
  department: string;
  designation: string;
  cabin: string;
  officeHours: string;
  assignedCourses: string[];
  avatarUrl: string;
}

export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
  hours: number;
  notes?: string;
}

export interface SyllabusUnit {
  id: string;
  courseCode: string;
  courseName: string;
  unitNumber: number;
  unitTitle: string;
  topics: SyllabusTopic[];
  totalHours: number;
  completedHours: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  completionPct: number;
  assignedFacultyName?: string;
}

export interface CourseManagementItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  facultyName: string;
  enrolledStudentsCount: number;
  syllabusCompletionPct: number;
  avgAttendancePct: number;
}

export interface AnnouncementItem {
  id: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  courseCode?: string;
  department: string;
  targetAudience: 'all' | 'students' | 'faculty' | 'department';
  priority: 'Normal' | 'High' | 'Urgent';
  pinned: boolean;
  createdAt: string;
}

export interface StudentPlacementOffer {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  branch?: string;
  companyName: string;
  role: string;
  packageLPA: number;
  offerType: 'Full Time' | 'Internship + PPO' | 'Internship' | 'Contract';
  status: 'Offered' | 'Accepted' | 'Declined' | 'Under Review';
  offerDate: string;
  academicYear: string;
  batch: string;
}

export interface StudentInternshipRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  department: string;
  companyName: string;
  role: string;
  stipendPM: number;
  durationMonths: number;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  hasPPO: boolean;
  startDate: string;
  endDate: string;
}

export interface PlacementStatistics {
  totalRegistered: number;
  totalEligible: number;
  totalPlaced: number;
  totalUnplaced: number;
  placementPercentage: number;
  totalOffers: number;
  multipleOffersCount: number;
  highestPackageLPA: number;
  averagePackageLPA: number;
  medianPackageLPA: number;
  totalInternships: number;
  ppoConversionsCount: number;
  averageStipendPM: number;
  departmentWiseStats: {
    department: string;
    eligible: number;
    placed: number;
    percentage: number;
    highestPackage: number;
    averagePackage: number;
  }[];
  companyWiseStats: {
    companyName: string;
    offersCount: number;
    highestPackage: number;
    roles: string[];
  }[];
  batchComparisons: {
    academicYear: string;
    totalEligible: number;
    placed: number;
    percentage: number;
    highestLPA: number;
    averageLPA: number;
  }[];
}

export interface AcademicAnalyticsOverview {
  totalStudents: number;
  departmentDistribution: { department: string; count: number; avgCGPA: number; avgAttendance: number }[];
  semesterDistribution: { semester: number; count: number }[];
  performanceDistribution: { gradeRange: string; count: number; percentage: number }[];
  attendanceMetrics: { overallAverage: number; above75: number; below75AtRisk: number };
  assignmentMetrics: { totalAssignments: number; totalSubmissions: number; completionRatePct: number; pendingGrading: number };
  studentsRequiringAttention: {
    id: string;
    name: string;
    rollNo: string;
    department: string;
    cgpa: number;
    attendancePct: number;
    failedCoursesCount: number;
    trend: 'Declining' | 'Critical' | 'Stable';
    recommendedIntervention: string;
  }[];
}

