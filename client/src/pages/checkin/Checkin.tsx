import React from 'react';
import {
    CheckCircle2,
    Circle,
    CalendarCheck,
    Save,
    PenLine
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const CHECKLIST_ITEMS = [
    { id: 'jobs', label: 'Applied to jobs', description: 'At least 5 applications sent' },
    { id: 'dsa', label: 'Practiced DSA', description: 'Solved at least 1 LeetCode problem' },
    { id: 'project', label: 'Worked on project', description: 'Committed code to GitHub' },
    { id: 'resume', label: 'Resume updated', description: 'Tweaked resume for a specific role' },
];

export default function Checkin() {
    const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
    const [notes, setNotes] = React.useState('');

    const toggleItem = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
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
                        className="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none transition-all placeholder:text-muted-foreground"
                        placeholder="What went well today? What can be improved?"
                    />
                </div>

                <div className="mt-8 flex justify-end">
                    <button className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-primary-foreground px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-500/20">
                        <Save size={20} />
                        Complete Check-in
                    </button>
                </div>
            </div>
        </div>
    );
}
