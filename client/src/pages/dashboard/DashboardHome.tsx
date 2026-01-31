import { useAuthStore } from '../../store/auth.store';
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
    CheckCircle2,
    Flame,
    TrendingUp,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <div className="bg-card border border-border p-6 rounded-xl hover:border-muted-foreground/25 transition-all">
        <div className="flex items-center justify-between mb-4">
            <div className={cn("p-3 rounded-lg bg-opacity-10", color)}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
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

const activityData = [
    { day: 'Mon', applications: 4, leetcode: 2 },
    { day: 'Tue', applications: 6, leetcode: 3 },
    { day: 'Wed', applications: 2, leetcode: 5 },
    { day: 'Thu', applications: 8, leetcode: 1 },
    { day: 'Fri', applications: 5, leetcode: 4 },
    { day: 'Sat', applications: 1, leetcode: 6 },
    { day: 'Sun', applications: 0, leetcode: 2 },
];

export default function Dashboard() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Good morning, {user?.name?.split(' ')[0] || 'Dev'}! ☀️
                </h1>
                <p className="text-muted-foreground mt-2">Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Applications"
                    value="124"
                    icon={Briefcase}
                    trend="+12 this week"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Interviews"
                    value="8"
                    icon={MoreHorizontal}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="LeetCode Solved"
                    value="452"
                    icon={Code2}
                    trend="+5 today"
                    color="bg-orange-500"
                />
                <StatCard
                    title="Current Streak"
                    value="27 Days"
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
                            <LineChart data={activityData}>
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
                        <CheckInItem label="Applied to jobs" checked={true} />
                        <CheckInItem label="Practiced DSA" checked={true} />
                        <CheckInItem label="Worked on project" checked={false} />
                        <CheckInItem label="Resume updated" checked={false} />
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Today's Notes</h3>
                        <div className="bg-muted/50 rounded-lg p-4 text-sm text-foreground italic">
                            "Solved Two Sum II (Medium). Applied to Stripe and Netflix."
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
