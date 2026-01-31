
import {
    FolderGit2,
    ExternalLink,
    Github,
    Plus,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

const MOCK_PROJECTS = [
    {
        id: '1',
        title: 'Project Product',
        description: 'A PERN stack application to track job applications, LeetCode progress, and portfolio projects in one place. Includes dark mode and dashboard.',
        tech: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
        status: 'In Progress',
        github: 'https://github.com/user/project-product',
        live: null
    },
    {
        id: '2',
        title: 'E-Commerce API',
        description: 'Scalable REST API built with NestJS and MongoDB. Features Redis caching, Stripe integration, and advanced search with Elasticsearch.',
        tech: ['NestJS', 'MongoDB', 'Redis', 'Docker'],
        status: 'Completed',
        github: 'https://github.com/user/ecommerce-api',
        live: 'https://api.example.com'
    },
    {
        id: '3',
        title: 'AlgoVisualizer',
        description: 'Interactive sorting algorithm visualizer built with Vanilla JS and CSS animations. Helpful for understanding Bubble, Merge, and Quick sort.',
        tech: ['JavaScript', 'HTML5', 'CSS3'],
        status: 'Completed',
        github: 'https://github.com/user/algoviz',
        live: 'https://algoviz.app'
    }
];

export default function Projects() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1">Showcase what you've built.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-all font-medium">
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_PROJECTS.map((project) => (
                    <div key={project.id} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all group flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                                <FolderGit2 size={24} />
                            </div>
                            <span className={cn(
                                "px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1.5",
                                project.status === 'Completed'
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            )}>
                                {project.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
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
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Project Card */}
                <button className="bg-card/30 border border-dashed border-border rounded-xl p-6 hover:border-primary/50 hover:bg-card/50 transition-all flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary min-h-[300px]">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Plus size={32} />
                    </div>
                    <span className="font-medium">Create New Project</span>
                </button>
            </div>
        </div>
    );
}
