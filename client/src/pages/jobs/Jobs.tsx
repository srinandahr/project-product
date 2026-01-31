import {
    Plus,
    Search,
    ListFilter,
    MoreVertical,
    MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const MOCK_JOBS = [
    {
        id: '1',
        company: 'Amazon',
        role: 'SDE II',
        status: 'Interview',
        appliedDate: new Date('2024-01-12'),
        location: 'Seattle (Remote)',
        logo: 'A'
    },
    {
        id: '2',
        company: 'Stripe',
        role: 'Backend Engineer',
        status: 'Applied',
        appliedDate: new Date('2024-01-15'),
        location: 'San Francisco',
        logo: 'S'
    },
    {
        id: '3',
        company: 'Netflix',
        role: 'Senior Engineer',
        status: 'Rejected',
        appliedDate: new Date('2024-01-10'),
        location: 'Los Gatos',
        logo: 'N'
    },
    {
        id: '4',
        company: 'Google',
        role: 'L4 SWE',
        status: 'Offer',
        appliedDate: new Date('2023-12-20'),
        location: 'Sunnyvale',
        logo: 'G'
    }
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Interview: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    }[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles)}>
            {status}
        </span>
    );
};

export default function Jobs() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Job Applications</h1>
                    <p className="text-muted-foreground mt-1">Track your pipeline efficiently.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium">
                    <Plus size={20} />
                    Add Job
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search roles or companies..."
                        className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
                    <ListFilter size={20} />
                    Filter
                </button>
            </div>

            {/* List View */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 text-muted-foreground text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Company</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Applied</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {MOCK_JOBS.map((job) => (
                                <tr key={job.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                {job.logo}
                                            </div>
                                            <span className="font-medium text-foreground">{job.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-foreground">{job.role}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin size={12} /> {job.location}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={job.status} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-sm">
                                        {format(job.appliedDate, 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
