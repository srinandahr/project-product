import React from 'react';
import { useAuthStore } from '../../store/auth.store';
import api from '../../lib/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Briefcase,
    Code2,
    Flame,
    CheckCircle2,
    TrendingUp,
    Mic
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-card border border-border p-6 rounded-xl hover:border-muted-foreground/25 transition-all">
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-lg bg-opacity-10 text-white", color)}>
                <Icon size={24} className="text-inherit" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                    <TrendingUp size={16} />
                    {trend}
                </div>
            )}
        </div>
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
);

const CheckInItem = ({ label, checked }: { label: string; checked: boolean }) => (
    <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all",
        checked ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/50 border border-border"
    )}>
        <div className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border transition-all",
            checked
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "border-muted-foreground/30 group-hover:border-muted-foreground"
        )}>
            {checked && <CheckCircle2 size={14} />}
        </div>
        <span className={cn("font-medium", checked ? "text-emerald-400" : "text-muted-foreground")}>
            {label}
        </span>
    </div>
);



export default function Dashboard() {
    const { user, token } = useAuthStore();
    const [stats, setStats] = React.useState<any>(null);

    React.useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard/overview');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good morning', icon: '☀️' };
        if (hour < 18) return { text: 'Good afternoon', icon: '🌤️' };
        return { text: 'Good evening', icon: '🌙' };
    };

    const greeting = getGreeting();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    {greeting.text}, {user?.name?.split(' ')[0] || 'Dev'}! {greeting.icon}
                </h1>
                <p className="text-muted-foreground mt-2">Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Applications"
                    value={stats?.jobStats?.total || 0}
                    icon={Briefcase}
                    trend={stats?.jobStats?.applied > 0 ? `+${stats.jobStats.applied} active` : undefined}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Interviews"
                    value={stats?.jobStats?.interviews || 0}
                    icon={Mic}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="LeetCode Solved"
                    value={stats?.leetcode?.totalSolved || 0}
                    icon={Code2}
                    trend={stats?.leetcode?.streak > 0 ? `${stats.streak} day streak` : undefined}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Current Streak"
                    value={`${stats?.checkinStreak || 0} Days`}
                    icon={Flame}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                    <h2 className="text-lg font-bold text-foreground mb-6">Activity Overview</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.activityData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                                />
                                <Line type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="leetcode" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Check-in Widget */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-foreground">Daily Check-in</h2>
                        <span className="text-sm text-muted-foreground">{format(new Date(), 'MMM d, yyyy')}</span>
                    </div>

                    <div className="space-y-4">
                        <CheckInItem label="Applied to jobs" checked={stats?.todayCheckin?.applied_jobs || false} />
                        <CheckInItem label="Practiced DSA" checked={stats?.todayCheckin?.practiced_dsa || false} />
                        <CheckInItem label="Worked on project" checked={stats?.todayCheckin?.worked_on_project || false} />
                        <CheckInItem label="Resume updated" checked={stats?.todayCheckin?.resume_updated || false} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Today's Notes</h3>
                        <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground italic">
                            {stats?.todayCheckin?.notes ? `"${stats.todayCheckin.notes}"` : "No notes for today."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
