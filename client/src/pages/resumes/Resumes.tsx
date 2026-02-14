
import React, { useState } from 'react';
import {
    FileText,
    Upload,
    Download,
    Trash2,
    Eye,
    CheckCircle2,
    Tag,
    X,
    Link as LinkIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useResumesStore } from '../../store/resumes.store';
import { resumeTips } from '../../lib/resumeTips';

import api from '../../lib/api';

export default function Resumes() {
    const { resumes, fetchResumes, addResume, deleteResume, isLoading } = useResumesStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
    const [viewResumeUrl, setViewResumeUrl] = useState<string | null>(null);
    const [viewResumeTitle, setViewResumeTitle] = useState<string | null>(null);
    const [tips, setTips] = useState<string[]>([]);
    const [viewBlobUrl, setViewBlobUrl] = useState<string | null>(null);

    React.useEffect(() => {
        const shuffled = [...resumeTips].sort(() => 0.5 - Math.random());
        setTips(shuffled.slice(0, 3));
    }, []);

    // Form state
    const [newResume, setNewResume] = useState<{
        title: string;
        fileUrl: string;
        tags: string;
        file?: File;
    }>({
        title: '',
        fileUrl: '',
        tags: '',
        file: undefined
    });

    React.useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const handleAddResume = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addResume({
                title: newResume.title,
                fileUrl: newResume.fileUrl,
                file: newResume.file,
                tags: newResume.tags.split(',').map(t => t.trim()).filter(Boolean)
            });
            setIsModalOpen(false);
            setNewResume({ title: '', fileUrl: '', tags: '', file: undefined });
        } catch (error) {
            console.error("Failed to add resume", error);
        }
    };

    const handleDeleteClick = (id: string) => {
        setResumeToDelete(id);
    };

    const confirmDelete = async () => {
        if (resumeToDelete) {
            await deleteResume(resumeToDelete);
            setResumeToDelete(null);
        }
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            // Use axios api instance to include Auth header
            const response = await api.get(url, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback for public URLs or if auth fails and user wants to try direct
            window.open(url, '_blank');
        }
    };

    const handleViewResume = async (url: string, title: string) => {
        try {
            // Use axios api instance to include Auth header
            const response = await api.get(url, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
            const blobUrl = window.URL.createObjectURL(blob);
            setViewResumeUrl(blobUrl);
            setViewResumeTitle(title);
            setViewBlobUrl(blobUrl); // Track blob URL to revoke later
        } catch (error) {
            console.error('View failed:', error);
            window.open(url, '_blank');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Resumes</h1>
                    <p className="text-muted-foreground mt-1">Manage versions for different roles.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium"
                >
                    <Upload size={20} />
                    Add Resume
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading && resumes.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">Loading resumes...</div>
                    )}

                    {!isLoading && resumes.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-xl bg-card/50 text-center">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No resumes yet</h3>
                            <p className="text-muted-foreground mt-1 mb-4">Upload your first resume to get started.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-primary font-medium hover:underline"
                            >
                                Add Resume
                            </button>
                        </div>
                    )}

                    {resumes.map((resume) => (
                        <div key={resume.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-all">
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
                                        <span>Added {format(new Date(resume.createdAt), 'MMM d, yyyy')}</span>
                                        {resume.tags.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Tag size={12} />
                                                    {resume.tags.join(', ')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleViewResume(resume.fileUrl, resume.title)}
                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                                    title="View"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => handleDownload(resume.fileUrl, resume.title)}
                                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(resume.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-400"
                                    title="Delete"
                                >
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
                            {tips.map((tip, index) => (
                                <li key={index} className="flex gap-2">
                                    <span className="text-primary">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Add Resume Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Add New Resume</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleAddResume} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newResume.title}
                                        onChange={e => setNewResume({ ...newResume, title: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="e.g. Backend Resume 2024"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Resume File (PDF, DOC)</label>
                                    <div className="relative">
                                        <div className="border border-border rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-all border-dashed">
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setNewResume({ ...newResume, fileUrl: '', file });
                                                    }
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="p-3 bg-primary/10 rounded-full text-primary mb-1">
                                                <Upload size={20} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-foreground">
                                                    {newResume.file ? newResume.file.name : "Click to upload or drag and drop"}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PDF, DOC up to 5MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 my-2">
                                        <div className="h-px bg-border flex-1" />
                                        <span className="text-xs text-muted-foreground uppercase">OR</span>
                                        <div className="h-px bg-border flex-1" />
                                    </div>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="url"
                                            value={newResume.fileUrl}
                                            onChange={e => setNewResume({ ...newResume, fileUrl: e.target.value, file: undefined })} // Clear file if URL is typed
                                            className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="Paste external link instead..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Tags (comma separated)</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            value={newResume.tags}
                                            onChange={e => setNewResume({ ...newResume, tags: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="Backend, Java, System Design"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 rounded-lg transition-all"
                                    >
                                        Add Resume
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {resumeToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-xl p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Delete Resume?</h3>
                                <p className="text-muted-foreground mt-2">
                                    Are you sure you want to delete this resume?
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full mt-2">
                                <button
                                    onClick={() => setResumeToDelete(null)}
                                    className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Resume Viewer Modal */}
            {viewResumeUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-4xl h-[85vh] rounded-xl shadow-xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="font-bold text-foreground">Resume Preview</h3>
                            <button
                                onClick={() => {
                                    if (viewBlobUrl) {
                                        window.URL.revokeObjectURL(viewBlobUrl);
                                        setViewBlobUrl(null);
                                    }
                                    setViewResumeUrl(null);
                                    setViewResumeTitle(null);
                                }}
                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 bg-muted/30 relative">
                            <iframe
                                src={viewResumeUrl}
                                className="w-full h-full"
                                title="Resume Viewer"
                            />
                        </div>
                        <div className="p-4 border-t border-border flex justify-end">
                            <a
                                href={viewResumeUrl}
                                download={`${viewResumeTitle || 'resume'}.pdf`}
                                className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium text-sm"
                            >
                                <Download size={16} />
                                Download File
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
