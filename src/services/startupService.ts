import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { initialDemoStartupIdeas, demoCollaboratorProfiles, demoIncubatorPrograms } from '../data/demoStartupIdeas';
import { StartupIdea } from '../types';

const STORAGE_KEY = 'st2_startup_ideas_state';

export const startupService = {
  async getIdeas(): Promise<StartupIdea[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('startup_ideas')
          .select('*')
          .order('upvotes_count', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((r: any): StartupIdea => ({
            id: r.id,
            title: r.title,
            problemStatement: r.problem_statement,
            proposedSolution: r.proposed_solution,
            domain: r.domain,
            requiredSkills: r.required_skills || [],
            stage: r.stage,
            teamRequirements: r.team_requirements || '',
            founderName: r.founder_name || 'Founder',
            founderEmail: r.founder_email || 'founder@st2.edu',
            saved: r.saved || false,
            createdAt: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '2026-10-12',
            upvotes: r.upvotes_count || 1,
            collaboratorsNeeded: r.collaborators_needed || 2,
          }));
        }
      } catch {
        // Fallback
      }
    }

    if (apiClient.isUsingApiMode()) {
      return apiClient.request<StartupIdea[]>('/startup/ideas');
    }

    const local = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('bytexl_startup_ideas_state');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback
      }
    }
    return Promise.resolve(initialDemoStartupIdeas);
  },

  async createIdea(
    newIdea: Omit<StartupIdea, 'id' | 'saved' | 'createdAt' | 'upvotes'>,
    founderId?: string
  ): Promise<StartupIdea[]> {
    const ideaId = `idea-${Date.now()}`;

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('startup_ideas').insert({
          id: ideaId,
          founder_id: founderId || null,
          founder_name: newIdea.founderName,
          founder_email: newIdea.founderEmail,
          title: newIdea.title,
          problem_statement: newIdea.problemStatement,
          proposed_solution: newIdea.proposedSolution,
          domain: newIdea.domain,
          required_skills: newIdea.requiredSkills,
          stage: newIdea.stage,
          team_requirements: newIdea.teamRequirements,
          collaborators_needed: newIdea.collaboratorsNeeded,
          upvotes_count: 1,
          saved: false,
        });
      } catch {
        // Fallback
      }
    }

    const list = await this.getIdeas();
    const created: StartupIdea = {
      ...newIdea,
      id: ideaId,
      saved: false,
      createdAt: new Date().toISOString().split('T')[0],
      upvotes: 1,
    };

    const updated = [created, ...list];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async toggleSaveIdea(id: string): Promise<StartupIdea[]> {
    const list = await this.getIdeas();
    const target = list.find((item) => item.id === id);
    const newSaved = target ? !target.saved : true;

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('startup_ideas').update({ saved: newSaved }).eq('id', id);
      } catch {
        // Fallback
      }
    }

    const updated = list.map((item) => (item.id === id ? { ...item, saved: newSaved } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async upvoteIdea(id: string, userId?: string): Promise<StartupIdea[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        if (userId) {
          await supabase.from('startup_upvotes').upsert({
            idea_id: id,
            user_id: userId,
          });
        } else {
          // If no specific user id, directly update count
          const { data } = await supabase.from('startup_ideas').select('upvotes_count').eq('id', id).single();
          if (data) {
            await supabase.from('startup_ideas').update({ upvotes_count: (data.upvotes_count || 0) + 1 }).eq('id', id);
          }
        }
      } catch {
        // Fallback
      }
    }

    const list = await this.getIdeas();
    const updated = list.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async getCollaborators() {
    return Promise.resolve(demoCollaboratorProfiles);
  },

  async getIncubatorPrograms() {
    return Promise.resolve(demoIncubatorPrograms);
  },
};
