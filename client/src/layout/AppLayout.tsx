import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import {
    LayoutDashboard,
    Briefcase,
    FolderGit2,
    FileText,
    Code2,
    CalendarCheck,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Sparkles
} from 'lucide-react';
import { useThemeStore } from '../store/theme.store';
import { cn } from '../lib/utils';

export default function AppLayout() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const ThemeToggle = () => {
        const { theme, toggleTheme } = useThemeStore();
        return (
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-yellow-400 transition-all"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        );
    };

    const navItems = [
        { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/app/jobs', label: 'Jobs', icon: Briefcase },
        { to: '/app/projects', label: 'Projects', icon: FolderGit2 },
        { to: '/app/resumes', label: 'Resumes', icon: FileText },
        { to: '/app/leetcode', label: 'LeetCode', icon: Code2 },
        { to: '/app/recommendations', label: 'Recommended', icon: Sparkles },
        { to: '/app/checkin', label: 'Check-in', icon: CalendarCheck },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                        Project Product
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-4 py-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                        <ThemeToggle />
                        <button onClick={handleLogout} className="hover:text-red-400 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                        Project Product
                    </h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-muted-foreground">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm p-4">
                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-3 px-4 py-4 rounded-lg text-lg",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-accent"
                                    )}
                                >
                                    <item.icon size={24} />
                                    {item.label}
                                </NavLink>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-lg text-red-400 hover:bg-red-500/10 mt-4"
                            >
                                <LogOut size={24} />
                                Logout
                            </button>
                        </nav>
                    </div>
                )}

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
