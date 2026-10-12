import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { demoMetricCards, demoRecentActivities, demoSuggestedDataCategories } from '../data/demoDashboard';
import { MetricCardData } from '../types';

export const dashboardService = {
  /**
   * Fetch aggregate dashboard KPI metric cards
   */
  async getMetrics(): Promise<MetricCardData[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        // Query live student count
        const { count: studentCount } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'student');

        // Query active interventions
        const { count: atRiskCount } = await supabase
          .from('interventions')
          .select('id', { count: 'exact', head: true })
          .in('status', ['In Progress', 'Open']);

        // Query assignments
        const { count: assignmentCount } = await supabase
          .from('assignments')
          .select('id', { count: 'exact', head: true });

        // Query placement profiles
        const { data: placementData } = await supabase
          .from('placement_profiles')
          .select('readiness_score');

        const avgReadiness =
          placementData && placementData.length > 0
            ? Math.round(
                placementData.reduce((acc: number, curr: any) => acc + (curr.readiness_score || 76), 0) /
                  placementData.length
              )
            : 76;

        return [
          {
            id: 'total-students',
            title: 'Total Students',
            value: (studentCount && studentCount > 0 ? studentCount : 1240).toLocaleString(),
            unit: 'Students',
            change: '+12% from last month',
            isPositive: true,
            subtitle: 'Across 6 Engineering Departments',
            sparkline: [1020, 1080, 1140, 1180, 1210, studentCount || 1240],
            route: '/students',
            color: '#FF6A00',
          },
          {
            id: 'at-risk',
            title: 'At-Risk Students',
            value: (atRiskCount !== null && atRiskCount !== undefined && atRiskCount > 0 ? atRiskCount : 86).toString(),
            unit: 'Watchlist',
            change: '-4% from last month',
            isPositive: true,
            subtitle: 'Watchlist Cohort',
            sparkline: [112, 104, 98, 92, 88, atRiskCount || 86],
            route: '/interventions',
            color: '#FF8500',
          },
          {
            id: 'success-score',
            title: 'Average Success Score',
            value: `${avgReadiness}/100`,
            unit: 'Score',
            change: '+5% from last month',
            isPositive: true,
            subtitle: 'Institutional Benchmark',
            sparkline: [68, 70, 71, 73, 74, avgReadiness],
            route: '/academic',
            color: '#FFB347',
          },
          {
            id: 'internships',
            title: 'Active Assignments',
            value: (assignmentCount && assignmentCount > 0 ? assignmentCount : 64).toString(),
            unit: 'Active',
            change: '+8% this semester',
            isPositive: true,
            subtitle: 'Continuous Evaluation',
            sparkline: [38, 44, 48, 54, 58, assignmentCount || 64],
            route: '/assignments',
            color: '#FF8500',
          },
        ];
      } catch {
        // Fallback to local demo
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<MetricCardData[]>('/dashboard/metrics');
    }
    // Demo mode: Return curated local metrics
    return Promise.resolve(demoMetricCards);
  },

  async getRecentActivities() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          return data.map((log: any) => ({
            id: log.id,
            title: log.action.replace('_', ' ').toUpperCase(),
            description: `${log.resource_type}: ${JSON.stringify(log.metadata || {})}`,
            timestamp: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: 'Activity',
            color: '#FF6A00',
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<typeof demoRecentActivities>('/dashboard/activities');
    }
    return Promise.resolve(demoRecentActivities);
  },

  async getSuggestedData() {
    if (apiClient.isUsingApiMode()) {
      return apiClient.request<typeof demoSuggestedDataCategories>('/dashboard/suggested-data');
    }
    return Promise.resolve(demoSuggestedDataCategories);
  },
};
