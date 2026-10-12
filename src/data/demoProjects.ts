import { ProjectItem } from '../types';

export const initialDemoProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Student Attendance Analytics Dashboard',
    description: 'A responsive full-stack telemetry portal calculating margin to 75% cutoff and predicting attendance drop risk.',
    problemStatement: 'Students often struggle to track minimum 75% attendance across multiple theory and laboratory subjects, risking exam debarment without timely predictive alerts.',
    difficulty: 'Medium',
    category: 'Full Stack',
    technologyStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Recharts'],
    skillsLearned: ['Data Visualization', 'JWT Authentication', 'Relational Modeling', 'Threshold Alerts'],
    estimatedDuration: '3 - 4 Weeks',
    progressPercentage: 65,
    saved: true,
    status: 'In Progress',
    githubRepo: 'https://github.com/aarav-st2/attendance-analytics-hub',
    features: [
      'Interactive semester calendar with color-coded absence logs',
      'Smart margin calculator showing safe leaves remaining',
      'Automated medical leave request workflow with document attachment',
      'Exportable attendance PDF summary for HOD approvals'
    ],
    milestones: [
      { id: 'm-1', title: 'Database schema design for subjects, students & daily logs', description: 'Normalized PostgreSQL schema with indexes on student_id and date', completed: true },
      { id: 'm-2', title: 'REST API endpoints for log ingestion and margin computation', description: 'Express.js backend with validation middleware and role guard', completed: true },
      { id: 'm-3', title: 'Responsive analytics dashboard UI with glassmorphic cards', description: 'React dashboard with subject breakdown and alert banners', completed: true },
      { id: 'm-4', title: 'Automated email alerts when attendance dips below 78%', description: 'Nodemailer background cron job evaluating attendance triggers', completed: false },
      { id: 'm-5', title: 'End-to-end testing and deployment to Cloud platform', description: 'Docker containerization and deploy on cloud VM with HTTPS', completed: false }
    ],
    learningResources: [
      { title: 'PostgreSQL Relational Schema Design Patterns', type: 'Documentation', url: 'https://www.postgresql.org/docs/' },
      { title: 'Building Interactive Recharts Dashboards in React', type: 'Tutorial', url: 'https://recharts.org/en-US/guide' },
      { title: 'Designing RESTful Microservices with Express', type: 'Video Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs' }
    ]
  },
  {
    id: 'proj-2',
    title: 'Placement Preparation Tracker',
    description: 'A comprehensive readiness cockpit tracking DSA problems, mock interviews, aptitude drills, and company test deadlines.',
    problemStatement: 'Campus recruitment involves tracking hundreds of coding questions, aptitude sections, and company-specific cutoffs without unified progress visibility.',
    difficulty: 'Hard',
    category: 'Full Stack',
    technologyStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'],
    skillsLearned: ['State Architecture', 'Complex Filtering', 'Kanban Workflow', 'Progress Analytics'],
    estimatedDuration: '4 - 5 Weeks',
    progressPercentage: 40,
    saved: true,
    status: 'In Progress',
    githubRepo: 'https://github.com/aarav-st2/placement-prep-tracker',
    features: [
      'Curated DSA roadmap categorized by Striver, LeetCode 75 and NeetCode',
      'Company application pipeline tracker (Applied, OA, Technical 1, HR)',
      'Timed quantitative and verbal reasoning practice simulator',
      'Interactive STAR-method resume bullet points builder'
    ],
    milestones: [
      { id: 'm-201', title: 'User authentication and profile target definition', description: 'Role-based access for students and placement cell coordinators', completed: true },
      { id: 'm-202', title: 'Problem bank schema and tagging system', description: 'Prisma model for coding challenges, topics, difficulty, and companies', completed: true },
      { id: 'm-203', title: 'Kanban application tracker for recruitment rounds', description: 'Drag-and-drop board managing company applications', completed: false },
      { id: 'm-204', title: 'Readiness score algorithm combining coding, aptitude & mock interview metrics', description: 'Weighted scoring pipeline updating upon activity completion', completed: false }
    ],
    learningResources: [
      { title: 'Next.js 14 App Router Architecture Guide', type: 'Documentation', url: 'https://nextjs.org/docs' },
      { title: 'Prisma ORM with TypeScript Crash Course', type: 'Tutorial', url: 'https://www.prisma.io/docs' }
    ]
  },
  {
    id: 'proj-3',
    title: 'Campus Event Finder',
    description: 'Centralized hub for college clubs, hackathons, guest lectures, and cultural fest ticket registration.',
    problemStatement: 'Campus notifications are scattered across WhatsApp groups, noticeboards, and emails, leading to missed hackathon registrations and workshop deadlines.',
    difficulty: 'Easy',
    category: 'Full Stack',
    technologyStack: ['React', 'Vite', 'Firebase', 'Tailwind CSS', 'QR Code API'],
    skillsLearned: ['Real-time Firestore', 'QR Code Ticket Generation', 'Media Uploads'],
    estimatedDuration: '2 Weeks',
    progressPercentage: 90,
    saved: false,
    status: 'In Progress',
    features: [
      'Filterable event catalog by category (Tech, Cultural, Sports, Workshop)',
      'Single-click student registration generating dynamic QR pass',
      'Club lead admin portal for scanning check-ins via mobile camera',
      'Calendar export (iCal and Google Calendar sync)'
    ],
    milestones: [
      { id: 'm-301', title: 'Event catalog UI and responsive search & filtering', description: 'Clean responsive grid with tags and date range filters', completed: true },
      { id: 'm-302', title: 'Firebase Firestore schema and security rules', description: 'Collections for events, registrations, and club profiles', completed: true },
      { id: 'm-303', title: 'QR code pass generation and check-in scanner', description: 'Client-side QR rendering and html5-qrcode scanner', completed: true },
      { id: 'm-304', title: 'Push notifications for upcoming events', description: 'FCM push reminders 2 hours prior to scheduled event', completed: false }
    ],
    learningResources: [
      { title: 'Firebase Web v10 Modular SDK Guide', type: 'Documentation', url: 'https://firebase.google.com/docs/web/setup' },
      { title: 'QR Code Generation & Camera Scanning in React', type: 'Tutorial', url: 'https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia' }
    ]
  },
  {
    id: 'proj-4',
    title: 'College Bus Tracking System',
    description: 'Real-time GPS vehicle location tracking, route arrival ETA, and emergency breakdown alerts for commuter students.',
    problemStatement: 'College transit buses face irregular traffic delays, causing students to wait in extreme weather without knowing live bus coordinates or delay estimates.',
    difficulty: 'Medium',
    category: 'IoT / Mobile',
    technologyStack: ['React', 'Leaflet / OpenStreetMap', 'Node.js', 'WebSockets', 'Tailwind CSS'],
    skillsLearned: ['Geospatial Coordinates', 'WebSocket Stream Processing', 'Mapping APIs', 'ETA Math'],
    estimatedDuration: '3 Weeks',
    progressPercentage: 20,
    saved: false,
    status: 'In Progress',
    features: [
      'Interactive live campus bus map showing all running vehicles',
      'Estimated Time of Arrival (ETA) to the student’s pickup stop',
      'Notification triggers when bus is 2 stops away',
      'Driver dashboard for one-tap breakdown or route detour alerts'
    ],
    milestones: [
      { id: 'm-401', title: 'Route coordinate polyline mapping for campus transit routes', description: 'GeoJSON coordinate tracks for 12 suburban college routes', completed: true },
      { id: 'm-402', title: 'WebSocket server broadcasting mock GPS coordinates', description: 'Socket.io broadcast server feeding real-time bus lat/long telemetry', completed: false },
      { id: 'm-403', title: 'Student mobile view with interactive map and stop ETA countdown', description: 'Leaflet map with custom bus markers and route overlays', completed: false }
    ],
    learningResources: [
      { title: 'Building Real-time Maps with Leaflet and React', type: 'Tutorial', url: 'https://leafletjs.com/' },
      { title: 'Socket.io Bidirectional Event Streaming', type: 'Documentation', url: 'https://socket.io/docs/v4/' }
    ]
  },
  {
    id: 'proj-5',
    title: 'Student Skill Assessment Platform',
    description: 'Adaptive diagnostic testing engine assessing algorithmic thinking, aptitude, and verbal skills with automated code evaluation.',
    problemStatement: 'Self-assessment requires standardized testing benchmarks with instant score breakdown, question-level analytics, and tailored practice recommendations.',
    difficulty: 'Hard',
    category: 'AI & ML',
    technologyStack: ['React', 'Python FastAPI', 'Docker Sandbox', 'PostgreSQL', 'Tailwind CSS'],
    skillsLearned: ['Secure Code Execution', 'Adaptive Testing Algorithms', 'Score Analytics'],
    estimatedDuration: '5 Weeks',
    progressPercentage: 15,
    saved: true,
    status: 'In Progress',
    features: [
      'Timed assessment interface with full-screen proctoring warning',
      'Multi-language code submission sandbox with test case assertions',
      'Skill radar generation comparing peer cohort percentiles',
      'Weakness remediation pathway linked directly to ST² practice modules'
    ],
    milestones: [
      { id: 'm-501', title: 'Question bank model and category scoring matrix', description: 'Tag-based taxonomy covering Easy, Medium, Hard problems', completed: true },
      { id: 'm-502', title: 'Sandboxed code execution engine with memory and CPU bounds', description: 'Isolated worker executing user code against edge cases', completed: false },
      { id: 'm-503', title: 'Interactive student assessment cockpit', description: 'Timer, question palette, and instant feedback card', completed: false }
    ],
    learningResources: [
      { title: 'FastAPI High Performance Async Microservices', type: 'Documentation', url: 'https://fastapi.tiangolo.com/' },
      { title: 'Building Secure Sandboxed Execution Environments', type: 'Tutorial', url: 'https://docs.docker.com/engine/security/' }
    ]
  },
  {
    id: 'proj-6',
    title: 'Personal Portfolio Website',
    description: 'High-performance interactive developer portfolio showcasing projects, live GitHub activity, certifications, and contact form.',
    problemStatement: 'Engineers need a standout personal website reflecting technical craft, design sensibilities, and demonstrable code repos to impress recruiters.',
    difficulty: 'Easy',
    category: 'Full Stack',
    technologyStack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'EmailJS'],
    skillsLearned: ['Modern UI/UX', 'SEO Optimization', 'Micro-interactions', 'Lighthouse 100/100'],
    estimatedDuration: '1 - 2 Weeks',
    progressPercentage: 100,
    saved: false,
    status: 'Completed',
    githubRepo: 'https://github.com/aarav-st2/portfolio-v2',
    features: [
      'Liquid glass dark aesthetics with glowing orange accents',
      'Dynamic GitHub pinned repositories with live stars and commit counts',
      'Downloadable resume button with tracking analytics',
      'Interactive project modal windows with preview videos'
    ],
    milestones: [
      { id: 'm-601', title: 'Design system, color tokens, and responsive mobile layout', description: 'Modern dark aesthetic with typography hierarchy', completed: true },
      { id: 'm-602', title: 'Projects showcases and interactive skill tags', description: 'Filterable portfolio cards with live links', completed: true },
      { id: 'm-603', title: 'Contact form integration with EmailJS and toast feedback', description: 'Direct email delivery without dedicated backend server', completed: true }
    ],
    learningResources: [
      { title: 'Web Vitals & Performance Optimization', type: 'Documentation', url: 'https://web.dev/vitals/' }
    ]
  },
  {
    id: 'proj-7',
    title: 'Student Expense Tracker',
    description: 'Splitwise-style expense sharing and budget guardian for hostel roommates and college club project budgets.',
    problemStatement: 'Roommates and group project teams struggle to calculate who owes whom across rent, groceries, and shared project hardware, resulting in friction.',
    difficulty: 'Medium',
    category: 'Full Stack',
    technologyStack: ['React', 'TypeScript', 'Express', 'MongoDB', 'Tailwind CSS'],
    skillsLearned: ['Graph Debt Simplification Algorithm', 'PDF Receipt Export', 'Multi-user State'],
    estimatedDuration: '3 Weeks',
    progressPercentage: 50,
    saved: false,
    status: 'In Progress',
    features: [
      'Multi-currency and UPI expense splitting between hostel friends',
      'Greedy debt simplification algorithm minimizing total transactions',
      'Monthly category spending breakdown (Food, Books, Travel, Gadgets)',
      'Receipt image upload and instant expense extraction'
    ],
    milestones: [
      { id: 'm-701', title: 'Expense schema and group membership architecture', description: 'Models for groups, transactions, splits, and settlements', completed: true },
      { id: 'm-702', title: 'Debt settlement algorithm implementation in TypeScript', description: 'O(N log N) greedy debt clearing algorithm', completed: true },
      { id: 'm-703', title: 'Interactive settlement UI with UPI deep-link triggers', description: 'One-click pay through UPI mobile apps', completed: false }
    ],
    learningResources: [
      { title: 'Understanding Debt Simplification Algorithms', type: 'Tutorial', url: 'https://en.wikipedia.org/wiki/Shortest_path_problem' }
    ]
  },
  {
    id: 'proj-8',
    title: 'AI-Powered Study Planner',
    description: 'Intelligent revision scheduler generating personalized spaced-repetition schedules based on syllabus complexity and exam dates.',
    problemStatement: 'Students cram before semester exams without structured topic pacing, leading to burnout and poor retention of foundational engineering principles.',
    difficulty: 'Medium',
    category: 'AI & ML',
    technologyStack: ['React', 'Python', 'OpenAI/Gemini API', 'SQLite', 'Tailwind CSS'],
    skillsLearned: ['Prompt Engineering', 'Spaced Repetition Algorithms', 'Calendar API Sync'],
    estimatedDuration: '3 - 4 Weeks',
    progressPercentage: 0,
    saved: true,
    status: 'Not Started',
    features: [
      'Syllabus PDF parser extracting modules, chapters, and key concepts',
      'Personalized study calendar allocating daily 45-minute focus blocks',
      'Spaced repetition flashcards with automated recall intervals',
      'Exam readiness confidence meter for every unit'
    ],
    milestones: [
      { id: 'm-801', title: 'Subject and topic syllabus breakdown form', description: 'Configurable units with difficulty weights and exam deadlines', completed: false },
      { id: 'm-802', title: 'AI schedule generator integrating SuperMemo SM-2 algorithm', description: 'Dynamic spaced repetition calculation', completed: false },
      { id: 'm-803', title: 'Daily study dashboard with checkable tasks and timer', description: 'Pomodoro timer integration with progress bar', completed: false }
    ],
    learningResources: [
      { title: 'SuperMemo-2 Spaced Repetition Algorithm Mathematics', type: 'Documentation', url: 'https://www.supermemo.com/en/archives1990-2015/english/ol/sm2' },
      { title: 'Integrating Gemini AI for Structured Schedule Generation', type: 'Tutorial', url: 'https://ai.google.dev/' }
    ]
  }
];
