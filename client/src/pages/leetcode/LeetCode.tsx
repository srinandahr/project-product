import {
    Trophy,
    Flame,
    RefreshCw,
    ExternalLink,
    Target,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const DifficultyChip = ({ difficulty }: { difficulty: string }) => {
    const styles = {
        Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Hard: "bg-red-500/10 text-red-400 border-red-500/20",
    }[difficulty] || "bg-muted/10 text-muted-foreground border-border/20";

    return (
        <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", styles)}>
            {difficulty}
        </span>
    );
};

const MOCK_PROBLEMS = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', lastAttempted: '2 days ago', status: 'Solved' },
    { id: 2, title: 'LRU Cache', difficulty: 'Medium', lastAttempted: '5 days ago', status: 'Solved' },
    { id: 3, title: 'Merge k Sorted Lists', difficulty: 'Hard', lastAttempted: 'Today', status: 'Attempting' },
];

const DATA = [
    { name: 'Easy', value: 150, color: '#10b981' },
    { name: 'Medium', value: 240, color: '#eab308' },
    { name: 'Hard', value: 62, color: '#ef4444' },
];

export default function LeetCode() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">LeetCode Tracker</h1>
                    <p className="text-muted-foreground mt-1">Consistency is key. Keep the streak alive.</p>
                </div>
                <button className="flex items-center gap-2 bg-card border border-border hover:bg-accent text-muted-foreground px-4 py-2 rounded-lg transition-all font-medium">
                    <RefreshCw size={20} />
                    Sync Profile
                </button>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                    <div className="p-4 bg-orange-500/10 rounded-full text-orange-400">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Solved</p>
                        <p className="text-3xl font-bold text-foreground">452</p>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                    <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                        <Flame size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                        <p className="text-3xl font-bold text-foreground">27 Days</p>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-full text-blue-400">
                        <Target size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Global Ranking</p>
                        <p className="text-3xl font-bold text-foreground">125,402</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-foreground mb-6 w-full text-left">Difficulty Breakdown</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DATA} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={60} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Problems */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                        <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Go to LeetCode <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="space-y-4">
                        {MOCK_PROBLEMS.map((problem) => (
                            <div key={problem.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        problem.status === 'Solved' ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                                    )}>
                                        {problem.status === 'Solved' ? <CheckCircle2 size={20} /> : <RefreshCw size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground group-hover:text-foreground transition-colors">
                                            {problem.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1">Last attempted: {problem.lastAttempted}</p>
                                    </div>
                                </div>
                                <DifficultyChip difficulty={problem.difficulty} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
