import { useState, useEffect } from 'react';
import {
    Trophy,
    Flame,
    RefreshCw,
    ExternalLink,
    Target,
    CheckCircle2,
    UserCircle,
    LogOut
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useLeetCodeStore } from '../../store/leetcode.store';
import { formatDistanceToNow } from 'date-fns';



export default function LeetCode() {
    const { username, stats, isLoading, error, setUsername, fetchStats, disconnect } = useLeetCodeStore();
    const [inputUsername, setInputUsername] = useState('');

    useEffect(() => {
        if (username && !stats) {
            fetchStats();
        }
    }, [username, stats, fetchStats]);

    const handleConnect = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputUsername.trim()) {
            setUsername(inputUsername.trim());
        }
    };

    if (!username) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                        <UserCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Connect LeetCode</h2>
                    <p className="text-muted-foreground mt-2 mb-6">Enter your LeetCode username to verify your profile and fetch stats.</p>

                    <form onSubmit={handleConnect} className="space-y-4">
                        <input
                            type="text"
                            value={inputUsername}
                            onChange={(e) => setInputUsername(e.target.value)}
                            placeholder="username"
                            className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-2.5 rounded-lg transition-all"
                        >
                            Connect Account
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (isLoading && !stats) {
        return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading LeetCode profile...</div>;
    }

    if (error && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-red-400 font-medium">Error: {error}</div>
                <button
                    onClick={disconnect}
                    className="text-primary hover:underline"
                >
                    Try Another Username
                </button>
            </div>
        );
    }

    const chartData = stats ? [
        { name: 'Easy', value: stats.easySolved, color: '#10b981' },
        { name: 'Medium', value: stats.mediumSolved, color: '#eab308' },
        { name: 'Hard', value: stats.hardSolved, color: '#ef4444' },
    ] : [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">LeetCode Tracker</h1>
                    <p className="text-muted-foreground mt-1">
                        Tracking <span className="text-foreground font-medium">{username}</span>'s progress.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchStats()}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-card border border-border hover:bg-accent text-muted-foreground px-4 py-2 rounded-lg transition-all font-medium disabled:opacity-50"
                    >
                        <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
                        Sync Data
                    </button>
                    <button
                        onClick={disconnect}
                        className="flex items-center gap-2 bg-card border border-border hover:bg-red-500/10 text-muted-foreground hover:text-red-400 px-4 py-2 rounded-lg transition-all font-medium"
                        title="Disconnect"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                    <div className="p-4 bg-orange-500/10 rounded-full text-orange-400">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Solved</p>
                        <p className="text-3xl font-bold text-foreground">{stats?.totalSolved}</p>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                    <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                        <Flame size={32} />
                    </div>
                    <div>
                        {/* Show Streak instead of Hard Solved as requested */}
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                        <p className="text-3xl font-bold text-foreground">{stats?.streak ?? 0} Days</p>
                    </div>
                </div>

                <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-full text-blue-400">
                        <Target size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Global Ranking</p>
                        <p className="text-3xl font-bold text-foreground">{stats?.ranking.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <div className="lg:col-span-1 bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-foreground mb-6 w-full text-left">Difficulty Breakdown</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={60} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry, index) => (
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
                        <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Go to LeetCode <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="space-y-4">
                        {stats?.recentSubmissions.length === 0 && (
                            <div className="text-muted-foreground text-center py-4">No recent activity</div>
                        )}
                        {stats?.recentSubmissions.map((problem, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg group hover:bg-muted/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg text-emerald-400 bg-emerald-500/10">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <a href={`https://leetcode.com/problems/${problem.titleSlug}`} target="_blank" rel="noreferrer" className="font-medium text-foreground group-hover:text-primary transition-colors hover:underline">
                                            {problem.title}
                                        </a>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatDistanceToNow(new Date(parseInt(problem.timestamp) * 1000), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                                {/* Difficulty not in recent submission query by default in this endpoint, omitting chip or needing extra query. Omitting for simplicity. */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
