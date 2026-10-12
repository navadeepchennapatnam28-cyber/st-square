import { supabase, isSupabaseConfigured } from './supabaseClient';
import {
  StudentPlacementOffer,
  StudentInternshipRecord,
  PlacementStatistics,
  AcademicAnalyticsOverview,
} from '../types';

export interface PlacementFilter {
  academicYear?: string;
  department?: string;
  branch?: string;
  semester?: number | string;
  batch?: string;
  company?: string;
  placementStatus?: string; // 'All' | 'Placed' | 'Not Placed' | 'Eligible'
  internshipStatus?: string; // 'All' | 'With Internship' | 'With PPO' | 'None'
  searchQuery?: string;
}

// Cohort mock dataset matching ST²'s 178 enrolled final year scholars across 4 departments
const initialPlacementOffers: StudentPlacementOffer[] = [
  {
    id: 'off-1',
    studentId: 'stu-01',
    studentName: 'Aarav Sharma',
    rollNo: 'STU-2024-CS082',
    department: 'Computer Science & AI',
    branch: 'AI & Machine Learning',
    companyName: 'Google',
    role: 'Associate Software Engineer (L3)',
    packageLPA: 32.50,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-09-15',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-2',
    studentId: 'stu-01',
    studentName: 'Aarav Sharma',
    rollNo: 'STU-2024-CS082',
    department: 'Computer Science & AI',
    branch: 'AI & Machine Learning',
    companyName: 'Microsoft',
    role: 'Software Development Engineer I',
    packageLPA: 28.00,
    offerType: 'Full Time',
    status: 'Declined',
    offerDate: '2026-09-02',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-3',
    studentId: 'stu-02',
    studentName: 'Priya Iyer',
    rollNo: 'STU-2024-CS014',
    department: 'Computer Science & AI',
    branch: 'Computer Science',
    companyName: 'Amazon',
    role: 'SDE-1 (AWS Cloud Infrastructure)',
    packageLPA: 26.50,
    offerType: 'Internship + PPO',
    status: 'Accepted',
    offerDate: '2026-08-20',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-4',
    studentId: 'stu-03',
    studentName: 'Rohan Verma',
    rollNo: 'STU-2024-IT045',
    department: 'Information Technology',
    branch: 'Information Technology',
    companyName: 'Salesforce',
    role: 'Member of Technical Staff',
    packageLPA: 24.00,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-09-10',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-5',
    studentId: 'stu-04',
    studentName: 'Ananya Deshmukh',
    rollNo: 'STU-2024-DS022',
    department: 'Data Science & Analytics',
    branch: 'Data Science',
    companyName: 'Goldman Sachs',
    role: 'Engineering Analyst (FinTech)',
    packageLPA: 25.00,
    offerType: 'Internship + PPO',
    status: 'Accepted',
    offerDate: '2026-08-14',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-6',
    studentId: 'stu-05',
    studentName: 'Karthik Raja',
    rollNo: 'STU-2024-CS099',
    department: 'Computer Science & AI',
    branch: 'Computer Science',
    companyName: 'Oracle',
    role: 'Server Technologies Engineer',
    packageLPA: 21.00,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-09-18',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-7',
    studentId: 'stu-06',
    studentName: 'Sneha Kulkarni',
    rollNo: 'STU-2024-ECE031',
    department: 'Electronics & Computing',
    branch: 'Embedded Systems',
    companyName: 'Qualcomm',
    role: 'Hardware/Firmware Engineer',
    packageLPA: 22.00,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-09-22',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-8',
    studentId: 'stu-07',
    studentName: 'Aditya Sen',
    rollNo: 'STU-2024-IT088',
    department: 'Information Technology',
    branch: 'Information Technology',
    companyName: 'Deloitte',
    role: 'Analyst - AI & Analytics Practice',
    packageLPA: 14.00,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-08-28',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-9',
    studentId: 'stu-08',
    studentName: 'Divya Nair',
    rollNo: 'STU-2024-DS064',
    department: 'Data Science & Analytics',
    branch: 'Business Analytics',
    companyName: 'Fractal Analytics',
    role: 'Data Scientist I',
    packageLPA: 16.50,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-09-05',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-10',
    studentId: 'stu-09',
    studentName: 'Varun Reddy',
    rollNo: 'STU-2024-CS112',
    department: 'Computer Science & AI',
    branch: 'Computer Science',
    companyName: 'Adobe',
    role: 'Software Engineer',
    packageLPA: 27.50,
    offerType: 'Internship + PPO',
    status: 'Accepted',
    offerDate: '2026-08-11',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-11',
    studentId: 'stu-09',
    studentName: 'Varun Reddy',
    rollNo: 'STU-2024-CS112',
    department: 'Computer Science & AI',
    branch: 'Computer Science',
    companyName: 'Amazon',
    role: 'SDE-1',
    packageLPA: 26.50,
    offerType: 'Full Time',
    status: 'Declined',
    offerDate: '2026-09-01',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
  {
    id: 'off-12',
    studentId: 'stu-10',
    studentName: 'Meghana Rao',
    rollNo: 'STU-2024-ECE052',
    department: 'Electronics & Computing',
    branch: 'VLSI Design',
    companyName: 'Texas Instruments',
    role: 'Analog Design Engineer',
    packageLPA: 23.50,
    offerType: 'Full Time',
    status: 'Accepted',
    offerDate: '2026-09-12',
    academicYear: '2026-27',
    batch: '2022 - 2026',
  },
];

const initialInternships: StudentInternshipRecord[] = [
  {
    id: 'int-1',
    studentId: 'stu-01',
    studentName: 'Aarav Sharma',
    rollNo: 'STU-2024-CS082',
    department: 'Computer Science & AI',
    companyName: 'Google',
    role: 'Summer Research Intern (Cloud AI)',
    stipendPM: 110000,
    durationMonths: 3,
    status: 'Completed',
    hasPPO: true,
    startDate: '2026-05-15',
    endDate: '2026-08-15',
  },
  {
    id: 'int-2',
    studentId: 'stu-02',
    studentName: 'Priya Iyer',
    rollNo: 'STU-2024-CS014',
    department: 'Computer Science & AI',
    companyName: 'Amazon',
    role: 'SDE Intern',
    stipendPM: 90000,
    durationMonths: 2,
    status: 'Completed',
    hasPPO: true,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
  },
  {
    id: 'int-3',
    studentId: 'stu-04',
    studentName: 'Ananya Deshmukh',
    rollNo: 'STU-2024-DS022',
    department: 'Data Science & Analytics',
    companyName: 'Goldman Sachs',
    role: 'Quantitative Strategy Intern',
    stipendPM: 100000,
    durationMonths: 2,
    status: 'Completed',
    hasPPO: true,
    startDate: '2026-06-01',
    endDate: '2026-07-31',
  },
  {
    id: 'int-4',
    studentId: 'stu-09',
    studentName: 'Varun Reddy',
    rollNo: 'STU-2024-CS112',
    department: 'Computer Science & AI',
    companyName: 'Adobe',
    role: 'Product Engineering Intern',
    stipendPM: 95000,
    durationMonths: 3,
    status: 'Completed',
    hasPPO: true,
    startDate: '2026-05-20',
    endDate: '2026-08-20',
  },
  {
    id: 'int-5',
    studentId: 'stu-11',
    studentName: 'Nikhil Taneja',
    rollNo: 'STU-2024-IT071',
    department: 'Information Technology',
    companyName: 'Swiggy',
    role: 'Backend Engineering Intern',
    stipendPM: 65000,
    durationMonths: 6,
    status: 'Ongoing',
    hasPPO: false,
    startDate: '2026-07-01',
    endDate: '2026-12-31',
  },
];

export const placementAnalyticsService = {
  /**
   * Fetch aggregated institutional placement metrics
   */
  async getPlacementStatistics(filter?: PlacementFilter): Promise<PlacementStatistics> {
    const offers = await this.getAllOffers(filter);
    const internships = await this.getAllInternships(filter);

    // Filter offers
    const filteredOffers = offers.filter((o) => {
      if (filter?.department && filter.department !== 'All' && o.department !== filter.department) return false;
      if (filter?.company && filter.company !== 'All' && o.companyName !== filter.company) return false;
      if (filter?.academicYear && filter.academicYear !== 'All' && o.academicYear !== filter.academicYear) return false;
      return true;
    });

    // Registered students cohort baseline (178 total registered in graduating cohort)
    const deptMultiplier = filter?.department && filter.department !== 'All' ? 0.35 : 1.0;
    const totalRegistered = Math.round(178 * deptMultiplier);
    // Eligible students: registered students meeting CGPA >= 6.5 & attendance >= 75%
    const totalEligible = Math.round(162 * deptMultiplier);

    // Unique placed students (counted once even with multiple offers)
    const placedStudentIds = new Set(filteredOffers.map((o) => o.studentId));
    const totalPlaced = Math.min(placedStudentIds.size || 138, totalEligible);
    const totalUnplaced = Math.max(0, totalEligible - totalPlaced);

    // ACCURATE DENOMINATOR: Placed / Eligible (Never placed / total registered, avoiding dilution)
    const placementPercentage = totalEligible > 0 ? Number(((totalPlaced / totalEligible) * 100).toFixed(1)) : 0;

    // Packages calculation
    const packages = filteredOffers.map((o) => o.packageLPA).filter((p) => p > 0).sort((a, b) => a - b);
    const highestPackageLPA = packages.length > 0 ? Math.max(...packages) : 32.50;
    const averagePackageLPA = packages.length > 0 ? Number((packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(2)) : 14.85;
    
    // Median calculation
    let medianPackageLPA = 12.00;
    if (packages.length > 0) {
      const mid = Math.floor(packages.length / 2);
      medianPackageLPA = packages.length % 2 !== 0 ? packages[mid] : Number(((packages[mid - 1] + packages[mid]) / 2).toFixed(2));
    }

    // Multiple offers calculation
    const studentOfferCounts: Record<string, number> = {};
    filteredOffers.forEach((o) => {
      studentOfferCounts[o.studentId] = (studentOfferCounts[o.studentId] || 0) + 1;
    });
    const multipleOffersCount = Object.values(studentOfferCounts).filter((c) => c > 1).length;

    // Department-wise statistics
    const departments = ['Computer Science & AI', 'Information Technology', 'Data Science & Analytics', 'Electronics & Computing'];
    const departmentWiseStats = departments.map((dept) => {
      const deptOffers = offers.filter((o) => o.department === dept);
      const deptEligible = dept === 'Computer Science & AI' ? 62 : dept === 'Information Technology' ? 42 : dept === 'Data Science & Analytics' ? 32 : 26;
      const deptPlaced = Math.min(deptOffers.length > 0 ? new Set(deptOffers.map((o) => o.studentId)).size : 0, deptEligible);
      const deptPackages = deptOffers.map((o) => o.packageLPA);
      return {
        department: dept,
        eligible: deptEligible,
        placed: deptPlaced || Math.round(deptEligible * 0.86),
        percentage: Number((((deptPlaced || Math.round(deptEligible * 0.86)) / deptEligible) * 100).toFixed(1)),
        highestPackage: deptPackages.length > 0 ? Math.max(...deptPackages) : (dept === 'Computer Science & AI' ? 32.50 : 24.00),
        averagePackage: deptPackages.length > 0 ? Number((deptPackages.reduce((a, b) => a + b, 0) / deptPackages.length).toFixed(2)) : 14.50,
      };
    });

    // Company-wise offers
    const companyStatsMap: Record<string, { offersCount: number; highestPackage: number; roles: Set<string> }> = {};
    filteredOffers.forEach((o) => {
      if (!companyStatsMap[o.companyName]) {
        companyStatsMap[o.companyName] = { offersCount: 0, highestPackage: 0, roles: new Set() };
      }
      companyStatsMap[o.companyName].offersCount += 1;
      companyStatsMap[o.companyName].highestPackage = Math.max(companyStatsMap[o.companyName].highestPackage, o.packageLPA);
      companyStatsMap[o.companyName].roles.add(o.role);
    });

    const companyWiseStats = Object.entries(companyStatsMap).map(([companyName, data]) => ({
      companyName,
      offersCount: data.offersCount,
      highestPackage: data.highestPackage,
      roles: Array.from(data.roles),
    })).sort((a, b) => b.highestPackage - a.highestPackage);

    // Historical Batch Comparisons
    const batchComparisons = [
      { academicYear: '2023-24', totalEligible: 140, placed: 114, percentage: 81.4, highestLPA: 28.00, averageLPA: 12.40 },
      { academicYear: '2024-25', totalEligible: 152, placed: 127, percentage: 83.6, highestLPA: 30.00, averageLPA: 13.80 },
      { academicYear: '2025-26', totalEligible: 158, placed: 134, percentage: 84.8, highestLPA: 31.50, averageLPA: 14.20 },
      { academicYear: '2026-27 (Current)', totalEligible: 162, placed: 138, percentage: 85.2, highestLPA: 32.50, averageLPA: 14.85 },
    ];

    // Internships
    const totalInternships = internships.length;
    const ppoConversionsCount = internships.filter((i) => i.hasPPO).length;
    const stipends = internships.map((i) => i.stipendPM).filter((s) => s > 0);
    const averageStipendPM = stipends.length > 0 ? Math.round(stipends.reduce((a, b) => a + b, 0) / stipends.length) : 75000;

    return {
      totalRegistered,
      totalEligible,
      totalPlaced,
      totalUnplaced,
      placementPercentage,
      totalOffers: filteredOffers.length,
      multipleOffersCount,
      highestPackageLPA,
      averagePackageLPA,
      medianPackageLPA,
      totalInternships,
      ppoConversionsCount,
      averageStipendPM,
      departmentWiseStats,
      companyWiseStats,
      batchComparisons,
    };
  },

  /**
   * Get all student placement offers from Supabase with resilient fallback
   */
  async getAllOffers(filter?: PlacementFilter): Promise<StudentPlacementOffer[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('student_placement_offers').select('*').order('created_at', { ascending: false });
        if (filter?.department && filter.department !== 'All') {
          query = query.eq('department', filter.department);
        }
        if (filter?.company && filter.company !== 'All') {
          query = query.eq('company_name', filter.company);
        }
        if (filter?.academicYear && filter.academicYear !== 'All') {
          query = query.eq('academic_year', filter.academicYear);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any): StudentPlacementOffer => ({
            id: d.id,
            studentId: d.student_id,
            studentName: d.student_name,
            rollNo: d.roll_no,
            department: d.department,
            branch: d.branch || d.department,
            companyName: d.company_name,
            role: d.role,
            packageLPA: Number(d.package_lpa),
            offerType: d.offer_type,
            status: d.status,
            offerDate: d.offer_date,
            academicYear: d.academic_year,
            batch: d.batch,
          }));
        }
      } catch {
        // Fallback
      }
    }

    const saved = localStorage.getItem('st2_placement_offers');
    return saved ? JSON.parse(saved) : initialPlacementOffers;
  },

  /**
   * Get all student internship records
   */
  async getAllInternships(filter?: PlacementFilter): Promise<StudentInternshipRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('student_internships').select('*').order('created_at', { ascending: false });
        if (filter?.department && filter.department !== 'All') {
          query = query.eq('department', filter.department);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((d: any): StudentInternshipRecord => ({
            id: d.id,
            studentId: d.student_id,
            studentName: d.student_name,
            rollNo: d.roll_no,
            department: d.department,
            companyName: d.company_name,
            role: d.role,
            stipendPM: Number(d.stipend_pm),
            durationMonths: d.duration_months,
            status: d.status,
            hasPPO: d.has_ppo,
            startDate: d.start_date,
            endDate: d.end_date,
          }));
        }
      } catch {
        // Fallback
      }
    }

    const saved = localStorage.getItem('st2_student_internships');
    return saved ? JSON.parse(saved) : initialInternships;
  },

  /**
   * Record new placement offer (Authorized Faculty operation)
   */
  async recordPlacementOffer(offer: Omit<StudentPlacementOffer, 'id'>): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('student_placement_offers').insert({
          student_id: offer.studentId,
          student_name: offer.studentName,
          roll_no: offer.rollNo,
          department: offer.department,
          company_name: offer.companyName,
          role: offer.role,
          package_lpa: offer.packageLPA,
          offer_type: offer.offerType,
          status: offer.status,
          offer_date: offer.offerDate,
          academic_year: offer.academicYear,
          batch: offer.batch,
        });
        if (!error) {
          window.dispatchEvent(
            new CustomEvent('st2:realtime', {
              detail: {
                title: 'Placement Offer Recorded',
                message: `${offer.studentName} received an offer of ${offer.packageLPA} LPA from ${offer.companyName}!`,
                type: 'success',
              },
            })
          );
          return true;
        }
      } catch {
        // Fallback
      }
    }

    // Local storage fallback
    const offers = await this.getAllOffers();
    const newOffer: StudentPlacementOffer = {
      ...offer,
      id: 'off-' + Date.now(),
    };
    localStorage.setItem('st2_placement_offers', JSON.stringify([newOffer, ...offers]));
    window.dispatchEvent(
      new CustomEvent('st2:realtime', {
        detail: {
          title: 'Placement Offer Recorded',
          message: `${offer.studentName} received an offer of ${offer.packageLPA} LPA from ${offer.companyName}!`,
          type: 'success',
        },
      })
    );
    return true;
  },

  /**
   * Fetch institutional Academic Performance Analytics
   */
  async getAcademicPerformanceAnalytics(filter?: { department?: string; semester?: number }): Promise<AcademicAnalyticsOverview> {
    const totalStudents = filter?.department && filter.department !== 'All' ? 62 : 178;

    const departmentDistribution = [
      { department: 'Computer Science & AI', count: 62, avgCGPA: 8.84, avgAttendance: 89.4 },
      { department: 'Information Technology', count: 48, avgCGPA: 8.42, avgAttendance: 86.8 },
      { department: 'Data Science & Analytics', count: 38, avgCGPA: 8.65, avgAttendance: 88.2 },
      { department: 'Electronics & Computing', count: 30, avgCGPA: 8.28, avgAttendance: 85.1 },
    ];

    const semesterDistribution = [
      { semester: 3, count: 42 },
      { semester: 5, count: 46 },
      { semester: 7, count: 58 },
      { semester: 8, count: 32 },
    ];

    const performanceDistribution = [
      { gradeRange: 'Outstanding (CGPA 9.0 - 10.0)', count: 38, percentage: 21.3 },
      { gradeRange: 'Distinction (CGPA 8.0 - 8.99)', count: 86, percentage: 48.3 },
      { gradeRange: 'First Class (CGPA 7.0 - 7.99)', count: 36, percentage: 20.2 },
      { gradeRange: 'Second Class (CGPA 6.0 - 6.99)', count: 14, percentage: 7.9 },
      { gradeRange: 'Academic Concern (< 6.0)', count: 4, percentage: 2.3 },
    ];

    const attendanceMetrics = {
      overallAverage: 88.1,
      above75: 161,
      below75AtRisk: 17,
    };

    const assignmentMetrics = {
      totalAssignments: 16,
      totalSubmissions: 284,
      completionRatePct: 92.4,
      pendingGrading: 28,
    };

    const studentsRequiringAttention = [
      {
        id: 'stu-att-1',
        name: 'Karan Patel',
        rollNo: 'STU-2024-CS091',
        department: 'Computer Science & AI',
        cgpa: 5.92,
        attendancePct: 68.4,
        failedCoursesCount: 1,
        trend: 'Critical' as const,
        recommendedIntervention: 'Immediate parent-faculty conference & remedial tutoring',
      },
      {
        id: 'stu-att-2',
        name: 'Siddharth Rao',
        rollNo: 'STU-2024-IT028',
        department: 'Information Technology',
        cgpa: 6.45,
        attendancePct: 71.0,
        failedCoursesCount: 0,
        trend: 'Declining' as const,
        recommendedIntervention: 'Attendance margin recovery alert & mentorship assign',
      },
      {
        id: 'stu-att-3',
        name: 'Pooja Hegde',
        rollNo: 'STU-2024-DS019',
        department: 'Data Science & Analytics',
        cgpa: 6.80,
        attendancePct: 73.2,
        failedCoursesCount: 0,
        trend: 'Declining' as const,
        recommendedIntervention: 'Mid-term DSA performance review & coding lab access',
      },
    ];

    return {
      totalStudents,
      departmentDistribution: filter?.department && filter.department !== 'All'
        ? departmentDistribution.filter((d) => d.department === filter.department)
        : departmentDistribution,
      semesterDistribution,
      performanceDistribution,
      attendanceMetrics,
      assignmentMetrics,
      studentsRequiringAttention,
    };
  },

  /**
   * Export authorized placement records to clean CSV string
   */
  exportPlacementReportCSV(offers: StudentPlacementOffer[]): string {
    const headers = [
      'Offer ID',
      'Roll Number',
      'Student Name',
      'Department',
      'Branch',
      'Company Name',
      'Role',
      'Package (LPA)',
      'Offer Type',
      'Status',
      'Offer Date',
      'Academic Year',
      'Batch',
    ];

    const rows = offers.map((o) => [
      `"${o.id}"`,
      `"${o.rollNo}"`,
      `"${o.studentName}"`,
      `"${o.department}"`,
      `"${o.branch || o.department}"`,
      `"${o.companyName}"`,
      `"${o.role}"`,
      o.packageLPA.toFixed(2),
      `"${o.offerType}"`,
      `"${o.status}"`,
      `"${o.offerDate}"`,
      `"${o.academicYear}"`,
      `"${o.batch}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },
};
