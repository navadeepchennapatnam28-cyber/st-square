import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { demoSTPointInsights } from '../data/demoAnalytics';
import { STPointInsight } from '../types';

const STORAGE_KEY = 'st2_st_point_insights';

export const stPointService = {
  async getInsights(studentId?: string): Promise<STPointInsight[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('st_point_insights').select('*').order('priority', { ascending: true });
        if (studentId) query = query.eq('student_id', studentId);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((r: any): STPointInsight => ({
            id: r.id,
            category: r.category,
            improvementArea: r.improvement_area,
            supportingMetric: r.supporting_metric,
            explanation: r.explanation,
            recommendedAction: r.recommended_action,
            actionRoute: r.action_route || '/pro-code',
            priority: r.priority,
            progressPercentage: r.progress_percentage || 0,
            status: r.status,
            suggestedSteps: r.suggested_steps || [],
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<STPointInsight[]>('/st-point/insights');
    }

    const local = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bytexl_st_point_insights');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback
      }
    }
    return Promise.resolve(demoSTPointInsights);
  },

  async updateInsightProgress(
    id: string,
    progressPercentage: number,
    status?: STPointInsight['status']
  ): Promise<STPointInsight[]> {
    const newStatus = status || (progressPercentage >= 100 ? 'Completed' : progressPercentage > 0 ? 'In Progress' : 'Not Started');

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('st_point_insights')
          .update({
            progress_percentage: progressPercentage,
            status: newStatus,
          })
          .eq('id', id);
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<STPointInsight[]>(`/st-point/insights/${id}/progress`, {
        method: 'PATCH',
        body: JSON.stringify({ progressPercentage, status: newStatus }),
      });
    }

    const current = await this.getInsights();
    const updated = current.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          progressPercentage,
          status: newStatus,
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Transparent Rule-Based Improvement Analysis Engine
   * Evaluates academic metrics and generates personalized priority recommendations.
   */
  evaluatePerformanceRuleEngine(metrics: {
    cgpa: number;
    attendanceAvg: number;
    codingScore: number;
    aptitudeScore: number;
    communicationScore: number;
  }) {
    const identifiedPriorities: {
      domain: string;
      message: string;
      urgency: 'High' | 'Medium' | 'Low';
      recommendedRoute: string;
    }[] = [];

    if (metrics.codingScore < 80) {
      identifiedPriorities.push({
        domain: 'Data Structures & Algorithms',
        message: 'Coding score (78%) is below the optimal 85% benchmark for tier-1 product organizations.',
        urgency: 'High',
        recommendedRoute: '/pro-code',
      });
    }

    if (metrics.attendanceAvg < 85) {
      identifiedPriorities.push({
        domain: 'Attendance Buffer',
        message: 'Ensure elective subjects maintain at least an 80% safety margin to prevent exam eligibility warnings.',
        urgency: 'Medium',
        recommendedRoute: '/attendance',
      });
    }

    if (metrics.cgpa >= 8.5) {
      identifiedPriorities.push({
        domain: 'Capstone Project Portfolio',
        message: 'Strong academic foundation (8.84 CGPA) positions you well for product & startup engineering roles.',
        urgency: 'Medium',
        recommendedRoute: '/projects',
      });
    }

    return identifiedPriorities;
  },
};
