import { create } from 'zustand';
import api from '../lib/api';

export interface Resume {
    id: string;
    title: string;
    fileUrl: string;
    tags: string[];
    isActive: boolean;
    createdAt: string;
}

interface ResumesStore {
    resumes: Resume[];
    isLoading: boolean;
    error: string | null;
    fetchResumes: () => Promise<void>;
    addResume: (resumeData: { title: string; file?: File; fileUrl?: string; tags: string[] }) => Promise<void>;
    deleteResume: (id: string) => Promise<void>;
}

export const useResumesStore = create<ResumesStore>((set, get) => ({
    resumes: [],
    isLoading: false,
    error: null,

    fetchResumes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/resumes');
            // Map backend snake_case to frontend camelCase
            const mappedResumes: Resume[] = response.data.map((r: any) => ({
                id: r.id,
                title: r.title,
                fileUrl: r.file_url,
                tags: r.tags,
                isActive: r.is_active,
                createdAt: r.created_at
            }));
            set({ resumes: mappedResumes, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch resumes', isLoading: false });
        }
    },

    addResume: async (resumeData) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('title', resumeData.title);

            if (resumeData.file instanceof File) {
                formData.append('file', resumeData.file);
            } else if (resumeData.fileUrl) {
                formData.append('file_url', resumeData.fileUrl);
            }

            // Send tags as JSON string
            formData.append('tags', JSON.stringify(resumeData.tags));

            const response = await api.post('/resumes', formData);
            const newBackendResume = response.data;

            // Map back to frontend
            const newResume: Resume = {
                id: newBackendResume.id,
                title: newBackendResume.title,
                fileUrl: newBackendResume.file_url,
                tags: newBackendResume.tags,
                isActive: newBackendResume.is_active,
                createdAt: newBackendResume.created_at
            };

            set((state) => ({
                resumes: [newResume, ...state.resumes],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add resume', isLoading: false });
            throw error;
        }
    },

    deleteResume: async (id) => {
        const previousResumes = get().resumes;
        set((state) => ({
            resumes: state.resumes.filter((r) => r.id !== id),
        }));

        try {
            await api.delete(`/resumes/${id}`);
        } catch (error: any) {
            set({ resumes: previousResumes, error: error.message || 'Failed to delete resume' });
        }
    }
}));
