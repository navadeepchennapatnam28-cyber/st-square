import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { demoStudentProfile } from '../data/demoDashboard';
import {
  demoSemesterCGPA,
  demoSubjectAttendance,
  demoLMSCourses,
  demoEngagementItems,
  demoPlacementBreakdown,
  demoSkillScores,
} from '../data/demoAnalytics';
import {
  EngagementItem,
  LMSCourseActivity,
  PlacementBreakdown,
  SemesterCGPA,
  SkillScore,
  StudentProfile,
  SubjectAttendance,
} from '../types';

export const studentService = {
  async getProfile(studentId?: string): Promise<StudentProfile> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('profiles').select('*');
        if (studentId) {
          query = query.eq('id', studentId);
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) query = query.eq('id', user.id);
        }
        const { data, error } = await query.maybeSingle();
        if (!error && data) {
          return {
            name: data.full_name || demoStudentProfile.name,
            id: data.student_id || data.id || demoStudentProfile.id,
            program: data.program || demoStudentProfile.program,
            semester: data.semester || demoStudentProfile.semester,
            avatarUrl: data.avatar_url || demoStudentProfile.avatarUrl,
            email: data.email || demoStudentProfile.email,
            department: data.department || demoStudentProfile.department,
            batch: data.batch || demoStudentProfile.batch,
          };
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<StudentProfile>('/student/profile');
    }
    return Promise.resolve(demoStudentProfile);
  },

  async getAcademicRecords(studentId?: string): Promise<SemesterCGPA[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('student_academic_records').select('*').order('created_at', { ascending: true });
        if (studentId) query = query.eq('student_id', studentId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            semester: r.semester,
            cgpa: Number(r.cgpa),
            sgpa: Number(r.sgpa),
            credits: r.credits_earned || 24,
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<SemesterCGPA[]>('/student/academics');
    }
    return Promise.resolve(demoSemesterCGPA);
  },

  async getAttendanceRecords(studentId?: string): Promise<SubjectAttendance[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('attendance_records').select('*').order('subject_code', { ascending: true });
        if (studentId) query = query.eq('student_id', studentId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((r: any) => {
            const pct = Number(r.percentage);
            return {
              subjectCode: r.subject_code,
              subjectName: r.subject_name,
              attended: r.attended_classes,
              total: r.total_classes,
              percentage: pct,
              status: pct >= 85 ? 'safe' : pct >= 75 ? 'warning' : 'critical',
              faculty: r.faculty_name,
            };
          });
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<SubjectAttendance[]>('/student/attendance');
    }
    return Promise.resolve(demoSubjectAttendance);
  },

  async submitLeaveRequest(params: {
    studentId: string;
    subjectName: string;
    leaveDate: string;
    reason: string;
    description: string;
  }): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('attendance_leaves').insert({
          student_id: params.studentId,
          subject_name: params.subjectName,
          leave_date: params.leaveDate,
          reason: params.reason,
          description: params.description,
          status: 'pending',
        });
        return !error;
      } catch {
        return false;
      }
    }
    return true;
  },

  async getLMSActivity(studentId?: string): Promise<LMSCourseActivity[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('lms_course_activities').select('*').order('last_accessed_at', { ascending: false });
        if (studentId) query = query.eq('student_id', studentId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            courseName: r.course_name,
            courseCode: r.course_code,
            completedModules: r.completed_modules,
            totalModules: r.total_modules,
            assignmentScore: r.progress_pct,
            lastActive: r.last_accessed_at
              ? new Date(r.last_accessed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent',
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<LMSCourseActivity[]>('/student/lms');
    }
    return Promise.resolve(demoLMSCourses);
  },

  async getEngagement(studentId?: string): Promise<EngagementItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('engagement_items').select('*').order('logged_at', { ascending: false });
        if (studentId) query = query.eq('student_id', studentId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            id: r.id,
            title: r.title,
            type: (r.category as any) || 'Hackathon',
            roleOrResult: r.impact_level || 'Participant',
            date: new Date(r.logged_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            }),
            badge: `+${r.points || 50} Pts`,
            verificationStatus: 'Verified',
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<EngagementItem[]>('/student/engagement');
    }
    return Promise.resolve(demoEngagementItems);
  },

  async getPlacementBreakdown(studentId?: string): Promise<PlacementBreakdown> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('placement_profiles').select('*');
        if (studentId) query = query.eq('student_id', studentId);

        const { data: profile, error } = await query.maybeSingle();
        if (!error && profile) {
          // Fetch drives count or list
          const { data: drives } = await supabase.from('placement_drives').select('*');
          const companiesList = (drives && drives.length > 0)
            ? drives.map((d: any) => ({
                name: d.company_name,
                role: d.role,
                packageLPA: d.package_lpa,
                eligibilityStatus: 'Eligible' as const,
                testDate: new Date(d.drive_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              }))
            : demoPlacementBreakdown.companiesList;

          return {
            readinessScore: profile.readiness_score || demoPlacementBreakdown.readinessScore,
            aptitudeScore: profile.aptitude_score || demoPlacementBreakdown.aptitudeScore,
            codingScore: profile.dsa_score || demoPlacementBreakdown.codingScore,
            communicationScore: profile.soft_skills_score || demoPlacementBreakdown.communicationScore,
            resumeScore: profile.interview_score || demoPlacementBreakdown.resumeScore,
            mockInterviewsCompleted: 6,
            targetRole: profile.target_role || demoPlacementBreakdown.targetRole,
            eligibleCompaniesCount: profile.eligible_companies_count || companiesList.length,
            companiesList,
          };
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<PlacementBreakdown>('/student/placement');
    }
    return Promise.resolve(demoPlacementBreakdown);
  },

  async getSkillScores(studentId?: string): Promise<SkillScore[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('student_skills').select('*').order('proficiency_pct', { ascending: false });
        if (studentId) query = query.eq('student_id', studentId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((r: any) => ({
            name: r.skill_name,
            score: r.proficiency_pct,
            fullMark: 100,
            category: (r.category as any) || 'Technical',
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<SkillScore[]>('/student/skills');
    }
    return Promise.resolve(demoSkillScores);
  },
};
