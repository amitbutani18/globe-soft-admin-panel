import React from 'react';
import { Construction } from 'lucide-react';

/**
 * Shared placeholder for Kali Linux sub-pages not yet fully implemented.
 * Replace this content with the real implementation when the API is ready.
 */
const KaliPage = ({ title, description, icon: Icon, accent = 'green' }) => {
    const colors = {
        green: {
            badge: 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20',
            icon: 'text-green-500',
            glow: 'shadow-green-500/10',
            border: 'border-green-500/20',
            bg: 'bg-green-500/5',
        },
    };
    const c = colors[accent] ?? colors.green;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${c.badge}`}>
                    Coming Soon
                </span>
            </div>

            {/* Placeholder card */}
            <div className={`flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed ${c.border} ${c.bg}`}>
                <div className={`p-5 rounded-2xl ${c.bg} border ${c.border} mb-6 shadow-xl ${c.glow}`}>
                    {Icon
                        ? <Icon className={`w-10 h-10 ${c.icon}`} />
                        : <Construction className={`w-10 h-10 ${c.icon}`} />
                    }
                </div>
                <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-2">{title}</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm leading-relaxed">
                    This section is under construction. Connect a backend API and replace this placeholder with the real implementation.
                </p>
            </div>
        </div>
    );
};

export default KaliPage;
