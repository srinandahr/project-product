import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    const response = await fetch(`http://127.0.0.1:5000/api/leetcode/${username}`);
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error || 'Failed to fetch stats');
                    }
                    const data = await response.json();
                    set({ stats: data, isLoading: false });
                } catch (error: any) {
                    set({ error: error.message, isLoading: false });
                }
            }
        }),
        {
            name: 'leetcode-storage',
            partialize: (state) => ({ username: state.username }),
        }
    )
);
