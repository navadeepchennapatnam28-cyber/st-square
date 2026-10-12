import {
  EngagementItem,
  LMSCourseActivity,
  PlacementBreakdown,
  SemesterCGPA,
  SkillScore,
  STPointInsight,
  SubjectAttendance,
} from '../types';

export const demoSemesterCGPA: SemesterCGPA[] = [
  { semester: 'Sem 1', sgpa: 8.20, cgpa: 8.20, credits: 21 },
  { semester: 'Sem 2', sgpa: 8.50, cgpa: 8.35, credits: 22 },
  { semester: 'Sem 3', sgpa: 8.56, cgpa: 8.42, credits: 23 },
  { semester: 'Sem 4', sgpa: 8.95, cgpa: 8.60, credits: 22 },
  { semester: 'Sem 5', sgpa: 8.70, cgpa: 8.62, credits: 24 },
  { semester: 'Sem 6', sgpa: 9.20, cgpa: 8.84, credits: 20 },
];

export const demoSubjectAttendance: SubjectAttendance[] = [
  {
    subjectCode: 'CS601',
    subjectName: 'Design & Analysis of Algorithms',
    attended: 42,
    total: 45,
    percentage: 93.3,
    status: 'safe',
    faculty: 'Dr. Ramesh Sundaram',
  },
  {
    subjectCode: 'CS602',
    subjectName: 'Cloud Computing & Distributed Systems',
    attended: 38,
    total: 42,
    percentage: 90.5,
    status: 'safe',
    faculty: 'Prof. Ananya Ghosh',
  },
  {
    subjectCode: 'CS603',
    subjectName: 'Compiler Design',
    attended: 31,
    total: 38,
    percentage: 81.6,
    status: 'safe',
    faculty: 'Dr. M. Venkat',
  },
  {
    subjectCode: 'CS604',
    subjectName: 'Object Oriented Software Engineering',
    attended: 34,
    total: 40,
    percentage: 85.0,
    status: 'safe',
    faculty: 'Prof. Sunita Pillai',
  },
  {
    subjectCode: 'CS605',
    subjectName: 'Natural Language Processing Elective',
    attended: 28,
    total: 36,
    percentage: 77.8,
    status: 'warning',
    faculty: 'Dr. Siddharth Sen',
  },
  {
    subjectCode: 'CS606L',
    subjectName: 'Advanced Algorithms Lab',
    attended: 14,
    total: 14,
    percentage: 100.0,
    status: 'safe',
    faculty: 'Dr. Ramesh Sundaram',
  },
  {
    subjectCode: 'CS607L',
    subjectName: 'Cloud Infrastructure Lab',
    attended: 12,
    total: 14,
    percentage: 85.7,
    status: 'safe',
    faculty: 'Prof. Ananya Ghosh',
  },
];

export const demoLMSCourses: LMSCourseActivity[] = [
  {
    courseName: 'Design & Analysis of Algorithms',
    courseCode: 'CS601',
    completedModules: 18,
    totalModules: 20,
    assignmentScore: 94,
    lastActive: 'Today at 10:15 AM',
  },
  {
    courseName: 'Cloud Computing & Distributed Systems',
    courseCode: 'CS602',
    completedModules: 14,
    totalModules: 16,
    assignmentScore: 88,
    lastActive: 'Yesterday',
  },
  {
    courseName: 'Compiler Design',
    courseCode: 'CS603',
    completedModules: 11,
    totalModules: 15,
    assignmentScore: 78,
    lastActive: '3 days ago',
  },
  {
    courseName: 'Natural Language Processing',
    courseCode: 'CS605',
    completedModules: 9,
    totalModules: 14,
    assignmentScore: 82,
    lastActive: '4 days ago',
  },
];

export const demoEngagementItems: EngagementItem[] = [
  {
    id: 'eng-1',
    title: 'ST² National Collegiate Hackathon 2026',
    type: 'Hackathon',
    roleOrResult: 'Runner Up (2nd Place)',
    date: 'Aug 2026',
    badge: '🏆 Silver Award',
    verificationStatus: 'Verified',
  },
  {
    id: 'eng-2',
    title: 'ACM Student Chapter Developer Lead',
    type: 'Club',
    roleOrResult: 'Technical Lead & Workshop Instructor',
    date: '2025 - 2026',
    badge: '👑 Club Leadership',
    verificationStatus: 'Verified',
  },
  {
    id: 'eng-3',
    title: 'AWS Certified Cloud Practitioner',
    type: 'Certification',
    roleOrResult: 'Scored 885 / 1000',
    date: 'May 2026',
    badge: '☁️ Industry Credential',
    verificationStatus: 'Verified',
  },
  {
    id: 'eng-4',
    title: 'Docker & Kubernetes Microservices Workshop',
    type: 'Workshop',
    roleOrResult: 'Completed 24 Hours Hands-On Labs',
    date: 'Jul 2026',
    badge: '📜 Hands-On Certified',
    verificationStatus: 'Verified',
  },
];

export const demoPlacementBreakdown: PlacementBreakdown = {
  readinessScore: 82,
  aptitudeScore: 85,
  codingScore: 78,
  communicationScore: 88,
  resumeScore: 92,
  mockInterviewsCompleted: 6,
  targetRole: 'Software Development Engineer (SDE-1)',
  eligibleCompaniesCount: 18,
  companiesList: [
    {
      name: 'Google',
      role: 'Software Engineer (Campus)',
      packageLPA: '32.0 LPA',
      eligibilityStatus: 'Eligible',
      testDate: 'Nov 20, 2026',
    },
    {
      name: 'Microsoft',
      role: 'Associate Software Engineer',
      packageLPA: '28.5 LPA',
      eligibilityStatus: 'Eligible',
      testDate: 'Nov 28, 2026',
    },
    {
      name: 'Amazon',
      role: 'SDE-1 (Graduate)',
      packageLPA: '26.0 LPA',
      eligibilityStatus: 'Eligible',
      testDate: 'Dec 05, 2026',
    },
    {
      name: 'Oracle',
      role: 'Server Technologies Engineer',
      packageLPA: '21.0 LPA',
      eligibilityStatus: 'Eligible',
      testDate: 'Dec 12, 2026',
    },
    {
      name: 'Salesforce',
      role: 'Member of Technical Staff',
      packageLPA: '24.0 LPA',
      eligibilityStatus: 'Target CGPA 8.5+',
      testDate: 'Dec 18, 2026',
    },
    {
      name: 'Goldman Sachs',
      role: 'Engineering Analyst',
      packageLPA: '25.0 LPA',
      eligibilityStatus: 'Needs 75%+ Att',
      testDate: 'Dec 22, 2026',
    },
  ],
};

export const demoSkillScores: SkillScore[] = [
  { name: 'Data Structures & Algorithms', score: 78, fullMark: 100, category: 'Technical' },
  { name: 'System Design & OS', score: 85, fullMark: 100, category: 'Core' },
  { name: 'Web Dev & APIs', score: 92, fullMark: 100, category: 'Technical' },
  { name: 'Database & SQL', score: 88, fullMark: 100, category: 'Core' },
  { name: 'Quantitative Aptitude', score: 85, fullMark: 100, category: 'Technical' },
  { name: 'Verbal & Communication', score: 88, fullMark: 100, category: 'Soft Skills' },
  { name: 'Problem Solving & Logic', score: 82, fullMark: 100, category: 'Technical' },
];

export const demoSTPointInsights: STPointInsight[] = [
  {
    id: 'insight-1',
    category: 'Coding',
    improvementArea: 'Dynamic Programming & Graph Algorithmic Speed',
    supportingMetric: '78% score in coding assessments (Target: 85%+ for Tier 1)',
    explanation: 'Your coding score is lower than your other assessed skills. You excel at Arrays and Two-Pointers, but mock assessments revealed longer turnaround times on multi-stage DP and graph traversal problems.',
    recommendedAction: 'Practice Dynamic Programming patterns regularly, complete medium-difficulty tree challenges, and attempt timed mock coding assessments.',
    actionRoute: '/pro-code',
    priority: 'High',
    progressPercentage: 45,
    status: 'In Progress',
    suggestedSteps: [
      'Solve 5 medium Dynamic Programming problems on Pro Code',
      'Review Kadane’s algorithm and sliding window optimal approaches',
      'Take 1 full 90-minute timed mock placement coding contest'
    ]
  },
  {
    id: 'insight-2',
    category: 'Attendance',
    improvementArea: 'NLP Elective Attendance Threshold',
    supportingMetric: '77.8% in CS605 (Only 1 safe leave remaining before 75%)',
    explanation: 'While your overall attendance is a stellar 89.4%, CS605 Natural Language Processing is hovering dangerously close to the 75% exam eligibility cutoff.',
    recommendedAction: 'Attend the next 4 consecutive scheduled theory sessions to boost your cushion to 82% margin.',
    actionRoute: '/attendance',
    priority: 'Medium',
    progressPercentage: 30,
    status: 'In Progress',
    suggestedSteps: [
      'Confirm upcoming Tuesday & Thursday lecture timings',
      'Submit lab report for pending credit clearance',
      'Monitor attendance margin weekly on the Attendance tab'
    ]
  },
  {
    id: 'insight-3',
    category: 'Placement',
    improvementArea: 'System Design Mock Rounds',
    supportingMetric: 'Completed 6 DSA mocks, but 0 System Design or LLD mocks',
    explanation: 'Top-tier tech firms (Amazon, Salesforce) require Low-Level Design (LLD) and OOP object modeling questions for campus SDE candidates.',
    recommendedAction: 'Work through project architecture milestones on your Attendance Analytics Dashboard and schedule a faculty peer mock interview.',
    actionRoute: '/projects',
    priority: 'Medium',
    progressPercentage: 60,
    status: 'In Progress',
    suggestedSteps: [
      'Complete Milestone 4 on Student Attendance Analytics Dashboard',
      'Document database indexing strategies on GitHub repo',
      'Review SOLID design principles and architectural patterns'
    ]
  },
  {
    id: 'insight-4',
    category: 'Academic',
    improvementArea: 'Compiler Design Assignment Scores',
    supportingMetric: '78% assignment average in CS603 compared to 94% in DAA',
    explanation: 'Grammar parsing and Lex/Yacc assignments in CS603 have slightly pulled down your continuous internal evaluation average for this semester.',
    recommendedAction: 'Revise bottom-up shift-reduce parsing modules on LMS and consult Prof. Venkat during office hours.',
    actionRoute: '/lms',
    priority: 'Low',
    progressPercentage: 80,
    status: 'Completed',
    suggestedSteps: [
      'Complete Module 4 LR Parsing exercises on LMS',
      'Review previous semester internal question paper archive',
      'Submit assignment 5 before the upcoming Friday deadline'
    ]
  }
];
