import { create } from 'zustand';
import api from '../lib/api';

export interface Project {
    id: string;
    title: string;
    description: string;
    tech: string[];
    status: 'Not Started' | 'In Progress' | 'Completed';
    github?: string;
    live?: string;
    startDate?: string;
    endDate?: string;
}

interface ProjectsStore {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
    fetchProjects: () => Promise<void>;
    addProject: (projectData: Omit<Project, 'id'>) => Promise<void>;
    updateProject: (id: string, projectData: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
    projects: [],
    isLoading: false,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/projects');
            // Map backend snake_case to frontend camelCase
            const mappedProjects: Project[] = response.data.map((p: any) => ({
                id: p.id,
                title: p.title,
                description: p.description,
                tech: p.tech_stack,
                status: p.status,
                github: p.repo_url,
                live: p.live_url,
                startDate: p.start_date,
                endDate: p.end_date
            }));
            set({ projects: mappedProjects, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch projects', isLoading: false });
        }
    },

    addProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
            // Map frontend camelCase to backend snake_case
            const payload = {
                title: projectData.title,
                description: projectData.description,
                tech_stack: projectData.tech,
                status: projectData.status,
                repo_url: projectData.github || null,
                live_url: projectData.live || null,
                start_date: projectData.startDate ? new Date(projectData.startDate).toISOString() : null,
                end_date: projectData.endDate ? new Date(projectData.endDate).toISOString() : null,
            };

            const response = await api.post('/projects', payload);
            const newBackendProject = response.data;

            // Map back the response to frontend format
            const newProject: Project = {
                id: newBackendProject.id,
                title: newBackendProject.title,
                description: newBackendProject.description,
                tech: newBackendProject.tech_stack,
                status: newBackendProject.status,
                github: newBackendProject.repo_url,
                live: newBackendProject.live_url,
                startDate: newBackendProject.start_date,
                endDate: newBackendProject.end_date
            };

            set((state) => ({
                projects: [newProject, ...state.projects],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add project', isLoading: false });
            throw error;
        }
    },

    deleteProject: async (id) => {
        const previousProjects = get().projects;
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
        }));

        try {
            await api.delete(`/projects/${id}`);
        } catch (error: any) {
            set({ projects: previousProjects, error: error.message || 'Failed to delete project' });
        }
    },

    updateProject: async (id, projectData) => {
        set({ isLoading: true, error: null });
        try {
            // Map frontend camelCase to backend snake_case
            const payload: any = {};
            if (projectData.title !== undefined) payload.title = projectData.title;
            if (projectData.description !== undefined) payload.description = projectData.description;
            if (projectData.tech !== undefined) payload.tech_stack = projectData.tech;
            if (projectData.status !== undefined) payload.status = projectData.status;
            if (projectData.github !== undefined) payload.repo_url = projectData.github || null;
            if (projectData.live !== undefined) payload.live_url = projectData.live || null;
            if (projectData.startDate !== undefined) payload.start_date = projectData.startDate ? new Date(projectData.startDate).toISOString() : null;
            if (projectData.endDate !== undefined) payload.end_date = projectData.endDate ? new Date(projectData.endDate).toISOString() : null;

            await api.patch(`/projects/${id}`, payload);

            // Refresh projects to get the latest state (simplest verification)
            // Or manually update the local state for speed
            set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === id ? { ...p, ...projectData } : p
                ),
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to update project', isLoading: false });
            throw error;
        }
    }
}));
