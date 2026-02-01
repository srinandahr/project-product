import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface LeetCodeStats {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    recentSubmissions: Array<{
        title: string;
        titleSlug: string;
        timestamp: string;
    }>;
    streak: number;
}

interface LeetCodeState {
    username: string | null;
    stats: LeetCodeStats | null;
    isLoading: boolean;
    error: string | null;
    setUsername: (username: string) => void;
    fetchStats: () => Promise<void>;
    disconnect: () => void;
}

export const useLeetCodeStore = create<LeetCodeState>()(
    persist(
        (set, get) => ({
            username: null,
            stats: null,
            isLoading: false,
            error: null,
            setUsername: (username) => {
                set({ username });
                get().fetchStats();
            },
            disconnect: () => set({ username: null, stats: null, error: null }),
            fetchStats: async () => {
                const { username } = get();
                if (!username) return;

                set({ isLoading: true, error: null });
                try {
                    // Import usage at top, but keeping consistent with existing pattern if needed, 
                    // though importing 'api' usually imports auth store indirectly. 
                    // We'll trust 'api' interceptor to handle token.

                    const response = await api.get(`/leetcode/${username}`);
                    set({ stats: response.data, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch stats', isLoading: false });
                }
            }
        }),
        {
            name: 'leetcode-storage',
            partialize: (state) => ({ username: state.username }),
        }
    )
);
