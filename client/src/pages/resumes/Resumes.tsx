
import {
    FileText,
    Upload,
    Download,
    Trash2,
    Eye,
    CheckCircle2,
    Tag
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const MOCK_RESUMES = [
    {
        id: '1',
        title: 'Amazon SDE Resume v3',
        fileUrl: '#',
        tags: ['Backend', 'Java', 'Distributed Systems'],
        isActive: true,
        createdAt: new Date('2024-01-15')
    },
    {
        id: '2',
        title: 'Frontend React Resume',
        fileUrl: '#',
        tags: ['Frontend', 'React', 'TypeScript'],
        isActive: false,
        createdAt: new Date('2023-12-10')
    },
    {
        id: '3',
        title: 'General Fullstack Resume',
        fileUrl: '#',
        tags: ['Node', 'React', 'Postgres'],
        isActive: false,
        createdAt: new Date('2023-11-20')
    }
];

export default function Resumes() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Resumes</h1>
                    <p className="text-muted-foreground mt-1">Manage versions for different roles.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium">
                    <Upload size={20} />
                    Upload Resume
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-4">
                    {MOCK_RESUMES.map((resume) => (
                        <div key={resume.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-muted-foreground/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-12 h-12 rounded-lg flex items-center justify-center",
                                    resume.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-muted text-muted-foreground"
                                )}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-foreground">{resume.title}</h3>
                                        {resume.isActive && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                                                Active <CheckCircle2 size={10} />
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                        <span>Uploaded {format(resume.createdAt, 'MMM d, yyyy')}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Tag size={12} />
                                            {resume.tags.join(', ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="View">
                                    <Eye size={18} />
                                </button>
                                <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Download">
                                    <Download size={18} />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="font-bold text-foreground mb-4">Quick Tips</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                Tailor your resume for each role type (Backend vs Frontend).
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                Keep it under 1 page if you have less than 5 years experience.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary">•</span>
                                Use metrics! "Improved latency by 20%" &gt; "Optimized API".
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
