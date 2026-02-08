import { create } from 'zustand';
import api from '../lib/api';

interface Job {
    id: string;
    company: string;
    title: string;
    location: string;
    job_url: string;
    score: number;
    recommended_date: string;
}

interface RecommendationsState {
    jobs: Job[];
    loading: boolean;
    error: string | null;
    fetchRecommendations: () => Promise<void>;
}

export const useRecommendationsStore = create<RecommendationsState>((set) => ({
    jobs: [],
    loading: false,
    error: null,
    fetchRecommendations: async () => {
        set({ loading: true, error: null });
        try {
            // Updated to match the backend route structure
            const response = await api.get('/recommendations');
            set({ jobs: response.data, loading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch recommendations',
                loading: false
            });
        }
    },
}));
