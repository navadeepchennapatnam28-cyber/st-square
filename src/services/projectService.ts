import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialDemoProjects } from '../data/demoProjects';
import { ProjectItem, ProjectMilestone } from '../types';

const STORAGE_KEY = 'st2_projects_state';

export const projectService = {
  async getProjects(studentId?: string): Promise<ProjectItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('student_projects').select('*').order('created_at', { ascending: false });
        if (studentId) query = query.eq('student_id', studentId);

        const { data: dbProjects, error } = await query;
        if (!error && dbProjects && dbProjects.length > 0) {
          // Fetch milestones
          const projectIds = dbProjects.map((p: any) => p.id);
          const { data: dbMilestones } = await supabase
            .from('project_milestones')
            .select('*')
            .in('project_id', projectIds)
            .order('order_index', { ascending: true });

          const milestonesByProject: Record<string, ProjectMilestone[]> = {};
          if (dbMilestones) {
            dbMilestones.forEach((m: any) => {
              if (!milestonesByProject[m.project_id]) milestonesByProject[m.project_id] = [];
              milestonesByProject[m.project_id].push({
                id: m.id,
                title: m.title,
                description: m.description || '',
                completed: m.completed,
              });
            });
          }

          return dbProjects.map((p: any): ProjectItem => {
            const milestones = milestonesByProject[p.id] || [
              { id: `m1-${p.id}`, title: 'System Architecture & Schema', description: 'Design database and APIs', completed: true },
              { id: `m2-${p.id}`, title: 'Core Functionality Implementation', description: 'Build features', completed: false },
              { id: `m3-${p.id}`, title: 'Test Bench & CI/CD Deployment', description: 'Run test cases and deploy', completed: false },
            ];
            return {
              id: p.id,
              title: p.title,
              description: p.description,
              problemStatement: p.problem_statement || p.description,
              difficulty: p.difficulty || 'Medium',
              category: p.category || 'Full Stack',
              technologyStack: p.technology_stack || ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
              skillsLearned: p.skills_learned || ['Full-Stack Development', 'Cloud Architecture'],
              estimatedDuration: p.estimated_duration || '4-6 Weeks',
              progressPercentage: p.progress_percentage || 0,
              saved: p.saved || false,
              status: p.status || 'Not Started',
              githubRepo: p.github_repo || undefined,
              features: p.features || ['Modular microservices architecture', 'Real-time telemetry tracking'],
              milestones,
              learningResources: p.learning_resources || [
                { title: 'Project Implementation Guide', type: 'Documentation', url: 'https://docs.st2.internal' },
              ],
            };
          });
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<ProjectItem[]>('/projects');
    }

    const local = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bytexl_projects_state');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback to initial
      }
    }
    return Promise.resolve(initialDemoProjects);
  },

  async getProjectById(id: string, studentId?: string): Promise<ProjectItem | undefined> {
    const list = await this.getProjects(studentId);
    return list.find((p) => p.id === id);
  },

  async toggleSaveProject(id: string, studentId?: string): Promise<ProjectItem[]> {
    const list = await this.getProjects(studentId);
    const target = list.find((p) => p.id === id);
    const newSaved = target ? !target.saved : true;

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('student_projects').update({ saved: newSaved }).eq('id', id);
      } catch {
        // Fallback
      }
    }

    const updated = list.map((p) => (p.id === id ? { ...p, saved: newSaved } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateMilestone(projectId: string, milestoneId: string, completed: boolean): Promise<ProjectItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('project_milestones').update({ completed }).eq('id', milestoneId);
      } catch {
        // Fallback
      }
    }

    const list = await this.getProjects();
    const updated = list.map((p) => {
      if (p.id === projectId) {
        const milestones = p.milestones.map((m) => (m.id === milestoneId ? { ...m, completed } : m));
        const completedCount = milestones.filter((m) => m.completed).length;
        const progressPercentage = Math.round((completedCount / milestones.length) * 100);
        const status: 'Completed' | 'In Progress' | 'Not Started' =
          progressPercentage === 100 ? 'Completed' : progressPercentage > 0 ? 'In Progress' : 'Not Started';

        if (isSupabaseConfigured() && supabase) {
          supabase
            .from('student_projects')
            .update({ progress_percentage: progressPercentage, status })
            .eq('id', projectId)
            .then();
        }

        return {
          ...p,
          milestones,
          progressPercentage,
          status,
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateGithubRepo(projectId: string, repoUrl: string): Promise<ProjectItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('student_projects').update({ github_repo: repoUrl }).eq('id', projectId);
      } catch {
        // Fallback
      }
    }

    const list = await this.getProjects();
    const updated = list.map((p) => (p.id === projectId ? { ...p, githubRepo: repoUrl } : p));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async startProject(projectId: string): Promise<ProjectItem[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('student_projects')
          .update({ status: 'In Progress', progress_percentage: 10 })
          .eq('id', projectId);
      } catch {
        // Fallback
      }
    }

    const list = await this.getProjects();
    const updated = list.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'In Progress' as const,
          progressPercentage: Math.max(p.progressPercentage, 10),
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
