import React from 'react';
import {
    CheckCircle2,
    Circle,
    CalendarCheck,
    PenLine
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/auth.store';

const CHECKLIST_ITEMS = [
    { id: 'jobs', label: 'Applied to jobs', description: 'At least 5 applications sent' },
    { id: 'dsa', label: 'Practiced DSA', description: 'Solved at least 1 LeetCode problem' },
    { id: 'project', label: 'Worked on project', description: 'Committed code to GitHub' },
    { id: 'resume', label: 'Resume updated', description: 'Tweaked resume for a specific role' },
];

export default function Checkin() {
    const { token } = useAuthStore();
    const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
    const [notes, setNotes] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

    React.useEffect(() => {
        if (token) {
            fetchTodayCheckin();
        }
    }, [token]);

    const fetchTodayCheckin = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://127.0.0.1:5000/api/checkins/today', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data && !data.message) {
                    // Map backend fields to frontend IDs
                    setCheckedItems({
                        jobs: data.applied_jobs,
                        dsa: data.practiced_dsa,
                        project: data.worked_on_project,
                        resume: data.resume_updated,
                    });
                    setNotes(data.notes || '');
                }
            }
        } catch (error) {
            console.error('Failed to fetch checkin', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveCheckin = async (items: Record<string, boolean>, currentNotes: string) => {
        try {
            setIsSaving(true);
            setMessage(null);

            const payload = {
                applied_jobs: items['jobs'] || false,
                practiced_dsa: items['dsa'] || false,
                worked_on_project: items['project'] || false,
                resume_updated: items['resume'] || false,
                notes: currentNotes
            };

            const response = await fetch('http://127.0.0.1:5000/api/checkins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to save');
            }

            // Optional: Don't show success message for every auto-save to avoid noise,
            // or show a subtle "Saved" indicator.
            // For now, keeping it simple but maybe less intrusive?
            setMessage({ type: 'success', text: 'Saved' });
            setTimeout(() => setMessage(null), 2000);

        } catch (error) {
            console.error('Failed to save checkin', error);
            setMessage({ type: 'error', text: 'Failed to save' });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleItem = (id: string) => {
        const newItems = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(newItems);
        // Auto-save on toggle
        saveCheckin(newItems, notes);
    };

    const handleNotesBlur = () => {
        // Auto-save notes on blur
        saveCheckin(checkedItems, notes);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                    Daily Check-in
                </h1>
                <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
                    <CalendarCheck size={18} />
                    {format(new Date(), 'EEEE, MMMM do, yyyy')}
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : (
                <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
                    <div className="space-y-6">
                        {CHECKLIST_ITEMS.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all group",
                                    checkedItems[item.id]
                                        ? "bg-emerald-500/5 border-emerald-500/30"
                                        : "bg-muted/30 border-border hover:border-muted-foreground/30"
                                )}
                            >
                                <div className={cn(
                                    "mt-1 w-6 h-6 rounded-full flex items-center justify-center border transition-all",
                                    checkedItems[item.id]
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "border-muted-foreground/50 group-hover:border-indigo-400"
                                )}>
                                    {checkedItems[item.id] ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </div>

                                <div className="flex-1">
                                    <h3 className={cn(
                                        "font-medium text-lg transition-colors",
                                        checkedItems[item.id] ? "text-emerald-400" : "text-foreground"
                                    )}>
                                        {item.label}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-border">
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground font-medium">
                            <PenLine size={18} />
                            <span>Notes / Reflection</span>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onBlur={handleNotesBlur}
                            className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none transition-all placeholder:text-muted-foreground"
                            placeholder="What went well today? What can be improved?"
                        />
                    </div>

                    <div className="mt-8 flex flex-col items-end gap-2">
                        {message && (
                            <div className={cn(
                                "text-sm font-medium",
                                message.type === 'success' ? "text-emerald-400" : "text-red-400"
                            )}>
                                {message.text}
                            </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                            {isSaving ? 'Saving...' : 'Changes saved automatically'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
