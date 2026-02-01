import React, { useState } from 'react';
import {
    FolderGit2,
    ExternalLink,
    Github,
    Plus,
    Clock,
    CheckCircle2,
    X,
    Code2,
    Globe,
    MoreVertical,
    Trash2,
    Pencil
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useProjectsStore } from '../../store/projects.store';

export default function Projects() {
    const { projects, fetchProjects, addProject, updateProject, deleteProject, isLoading } = useProjectsStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    // Form state
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        tech: '', // Comma separated string for input
        status: 'Not Started',
        github: '',
        live: ''
    });

    React.useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    React.useEffect(() => {
        const handleClickOutside = () => setActiveActionId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const resetForm = () => {
        setNewProject({
            title: '',
            description: '',
            tech: '',
            status: 'Not Started',
            github: '',
            live: ''
        });
        setEditingId(null);
        setIsModalOpen(false);
    };

    const handleEditClick = (project: any) => {
        setNewProject({
            title: project.title,
            description: project.description,
            tech: project.tech.join(', '),
            status: project.status,
            github: project.github || '',
            live: project.live || ''
        });
        setEditingId(project.id);
        setIsModalOpen(true);
        setActiveActionId(null);
    };

    const handleDeleteClick = (id: string) => {
        setProjectToDelete(id);
        setActiveActionId(null);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            await deleteProject(projectToDelete);
            setProjectToDelete(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const projectData = {
                title: newProject.title,
                description: newProject.description,
                tech: newProject.tech.split(',').map(t => t.trim()).filter(Boolean),
                status: newProject.status as 'Not Started' | 'In Progress' | 'Completed',
                github: newProject.github || undefined,
                live: newProject.live || undefined,
            };

            if (editingId) {
                await updateProject(editingId, projectData);
            } else {
                await addProject({
                    ...projectData,
                    startDate: new Date().toISOString()
                });
            }
            resetForm();
        } catch (error) {
            console.error("Failed to save project", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1">Showcase what you've built.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && projects.length === 0 ? (
                    <div className="col-span-full h-64 flex items-center justify-center text-muted-foreground">
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-card/50">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                            <FolderGit2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">No projects yet</h3>
                        <p className="text-muted-foreground mt-1 mb-6">Start building your portfolio today.</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="text-primary font-medium hover:underline"
                        >
                            Create your first project
                        </button>
                    </div>
                ) : (
                    <>
                        {projects.map((project) => (
                            <div key={project.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all group flex flex-col h-full relative">
                                <div className="absolute right-4 top-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveActionId(activeActionId === project.id ? null : project.id);
                                        }}
                                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100 data-[active=true]:opacity-100 cursor-pointer"
                                        data-active={activeActionId === project.id}
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {activeActionId === project.id && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border shadow-lg rounded-lg py-1 z-10 animate-in fade-in zoom-in duration-200">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(project);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                                            >
                                                <Pencil size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(project.id);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start justify-between mb-4 pr-8">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                                        <FolderGit2 size={24} />
                                    </div>
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5",
                                        project.status === 'Completed'
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                            : project.status === 'In Progress'
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                                    )}>
                                        {project.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                    {project.description}
                                </p>

                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tech.map((tech) => (
                                            <span key={tech} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground border border-border">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium transition-all">
                                                <Github size={16} /> Code
                                            </a>
                                        )}
                                        {project.live && (
                                            <a href={project.live} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground text-sm font-medium transition-all">
                                                <ExternalLink size={16} /> Live
                                            </a>
                                        )}
                                        {(!project.github && !project.live) && (
                                            <span className="text-xs text-muted-foreground italic w-full text-center py-2">No links available</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add Project Card/Button */}
                        <button
                            onClick={() => {
                                resetForm();
                                setIsModalOpen(true);
                            }}
                            className="bg-card/30 border border-dashed border-border rounded-xl p-6 hover:border-primary/50 hover:bg-card/50 transition-all flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary min-h-[300px]"
                        >
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <Plus size={32} />
                            </div>
                            <span className="font-medium">Create New Project</span>
                        </button>
                    </>
                )}
            </div>

            {/* Add/Edit Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                            <button
                                onClick={resetForm}
                                className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Project Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newProject.title}
                                        onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="e.g. E-Commerce Platform"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <textarea
                                        required
                                        value={newProject.description}
                                        onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[100px]"
                                        placeholder="Describe your project..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Tech Stack (comma separated)</label>
                                    <div className="relative">
                                        <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={newProject.tech}
                                            onChange={e => setNewProject({ ...newProject, tech: e.target.value })}
                                            className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                            placeholder="React, Node.js, TypeScript"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <select
                                        value={newProject.status}
                                        onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                                        className="w-full bg-background border border-border rounded-lg py-2.5 px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">GitHub URL</label>
                                        <div className="relative">
                                            <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="url"
                                                value={newProject.github}
                                                onChange={e => setNewProject({ ...newProject, github: e.target.value })}
                                                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">Live URL</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                            <input
                                                type="url"
                                                value={newProject.live}
                                                onChange={e => setNewProject({ ...newProject, live: e.target.value })}
                                                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                placeholder="https://myapp.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-indigo-600 text-white font-medium py-3 rounded-lg transition-all"
                                    >
                                        {editingId ? 'Update Project' : 'Create Project'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {projectToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-xl p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Delete Project?</h3>
                                <p className="text-muted-foreground mt-2">
                                    Are you sure you want to delete this project? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full mt-2">
                                <button
                                    onClick={() => setProjectToDelete(null)}
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
        </div>
    );
}
