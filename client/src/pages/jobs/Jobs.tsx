import React from 'react';
import {
    Plus,
    Search,
    ListFilter,
    MoreVertical,
    MapPin,
    X,
    Briefcase,
    Building2,
    Calendar
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useJobsStore } from '../../store/jobs.store';

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Interview: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        Offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    }[status] || "bg-muted/10 text-muted-foreground border-border/20";

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", styles)}>
            {status}
        </span>
    );
};

export default function Jobs() {
    // Local UI state
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [activeActionId, setActiveActionId] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);

    const [newJob, setNewJob] = React.useState({
        company: '',
        role: '',
        location: '',
        status: 'Applied',
        appliedDate: format(new Date(), 'yyyy-MM-dd'),
    });

    // Global state
    const { jobs, fetchJobs, addJob, deleteJob, isLoading } = useJobsStore();

    // Derived state
    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter ? job.status === statusFilter : true;
        return matchesSearch && matchesFilter;
    });

    React.useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    React.useEffect(() => {
        const handleClickOutside = () => {
            setActiveActionId(null);
            setIsFilterOpen(false);
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDeleteJob = async (id: string) => {
        await deleteJob(id);
        setActiveActionId(null);
    };

    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addJob({
                ...newJob,
                status: newJob.status as any,
                appliedDate: new Date(newJob.appliedDate) // Backend likely expects Date object or ISO string
            });
            setIsModalOpen(false);
            setNewJob({
                company: '',
                role: '',
                location: '',
                status: 'Applied',
                appliedDate: format(new Date(), 'yyyy-MM-dd'),
            });
        } catch (error) {
            console.error("Failed to add job", error);
        }
    };

    const toggleFilter = (status: string | null) => {
        setStatusFilter(status === statusFilter ? null : status);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Job Applications</h1>
                    <p className="text-muted-foreground mt-1">Track your pipeline efficiently.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium"
                >
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search roles or companies..."
                        className="w-full bg-card border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    />
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFilterOpen(!isFilterOpen);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 bg-card border rounded-lg transition-all min-w-[120px] justify-between",
                            statusFilter ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <ListFilter size={20} />
                            <span>{statusFilter || 'Filter'}</span>
                        </div>
                        {statusFilter && <X size={14} onClick={(e) => {
                            e.stopPropagation();
                            setStatusFilter(null);
                        }} className="hover:text-red-500" />}
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-lg rounded-lg py-1 z-20 animate-in fade-in zoom-in duration-200">
                            {['Applied', 'Interview', 'Offer', 'Rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => toggleFilter(status)}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between",
                                        statusFilter === status ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                                    )}
                                >
                                    {status}
                                    {statusFilter === status && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* List View */}
            <div className="bg-card border border-border rounded-xl overflow-hidden min-h-[400px]">
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
                            {isLoading && jobs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        Loading jobs...
                                    </td>
                                </tr>
                            ) : filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                                                <ListFilter size={24} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {jobs.length === 0 ? "No jobs found" : "No matching jobs"}
                                                </p>
                                                <p className="text-sm mt-1">
                                                    {jobs.length === 0 ? "Get started by adding your first application." : "Try adjusting your search or filters."}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-muted/30 transition-colors group relative">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                    {job.logo || job.company.charAt(0).toUpperCase()}
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
                                            {format(new Date(job.appliedDate), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveActionId(activeActionId === job.id ? null : job.id);
                                                }}
                                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 data-[active=true]:opacity-100"
                                                data-active={activeActionId === job.id}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {activeActionId === job.id && (
                                                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 bg-card border border-border shadow-lg rounded-lg py-1 z-10 animate-in fade-in zoom-in duration-200">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteJob(job.id);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Job Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Add New Application</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddJob} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Company</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={newJob.company}
                                        onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                                        placeholder="e.g. Netflix"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Role</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={newJob.role}
                                        onChange={e => setNewJob({ ...newJob, role: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                                        placeholder="e.g. Frontend Engineer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={newJob.location}
                                        onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                                        placeholder="e.g. Remote, NYC"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <select
                                        value={newJob.status}
                                        onChange={e => setNewJob({ ...newJob, status: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Interview">Interview</option>
                                        <option value="Offer">Offer</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Date Applied</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="date"
                                            required
                                            value={newJob.appliedDate}
                                            onChange={e => setNewJob({ ...newJob, appliedDate: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 rounded-lg transition-all"
                                >
                                    Add Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
