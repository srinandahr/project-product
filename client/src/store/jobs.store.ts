import { create } from 'zustand';
import api from '../lib/api';

export interface Job {
    id: string;
    company: string;
    role: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    appliedDate: string | Date;
    location: string;
    logo?: string;
}

interface JobsStore {
    jobs: Job[];
    isLoading: boolean;
    error: string | null;
    fetchJobs: () => Promise<void>;
    addJob: (jobData: Omit<Job, 'id' | 'logo'>) => Promise<void>;
    deleteJob: (id: string) => Promise<void>;
}

export const useJobsStore = create<JobsStore>((set, get) => ({
    jobs: [],
    isLoading: false,
    error: null,

    fetchJobs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/jobs');
            // Map backend snake_case to frontend camelCase
            const mappedJobs: Job[] = response.data.map((job: any) => ({
                id: job.id,
                company: job.company_name,
                role: job.role,
                status: job.status === 'Interviewing' ? 'Interview' : job.status,
                appliedDate: job.applied_date,
                location: job.location,
                logo: job.logo // Assuming backend might have it or not
            }));
            set({ jobs: mappedJobs, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch jobs', isLoading: false });
        }
    },

    addJob: async (jobData) => {
        set({ isLoading: true, error: null });
        try {
            // Map frontend camelCase to backend snake_case
            const payload = {
                company_name: jobData.company,
                role: jobData.role,
                location: jobData.location,
                status: jobData.status === 'Interview' ? 'Interviewing' : jobData.status,
                applied_date: new Date(jobData.appliedDate).toISOString(),
                // Default required fields
                job_type: 'Full-time',
                source: 'Other',
                notes: ''
            };

            const response = await api.post('/jobs', payload);
            const newBackendJob = response.data;

            // Map back the response to frontend format
            const newJob: Job = {
                id: newBackendJob.id,
                company: newBackendJob.company_name,
                role: newBackendJob.role,
                status: newBackendJob.status === 'Interviewing' ? 'Interview' : newBackendJob.status,
                appliedDate: newBackendJob.applied_date,
                location: newBackendJob.location,
                logo: newBackendJob.logo
            };

            set((state) => ({
                jobs: [newJob, ...state.jobs],
                isLoading: false
            }));
        } catch (error: any) {
            set({ error: error.message || 'Failed to add job', isLoading: false });
            throw error;
        }
    },

    deleteJob: async (id) => {
        // Optimistic update
        const previousJobs = get().jobs;
        set((state) => ({
            jobs: state.jobs.filter((job) => job.id !== id),
        }));

        try {
            await api.delete(`/jobs/${id}`);
        } catch (error: any) {
            // Revert on failure
            set({ jobs: previousJobs, error: error.message || 'Failed to delete job' });
        }
    },
}));
