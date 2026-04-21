import React from 'react';
import { Layers, Search, Plus, Filter, LayoutGrid, List, Sparkles } from 'lucide-react';

const Templates = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase italic">Template Repository</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Modular blueprints for structured content generation.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-pink-500/20 active:scale-95 text-sm">
                        <Plus className="w-5 h-5" />
                        New Template
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 shadow-sm shadow-pink-500/5">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
                    <Layers className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Templates offline</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                        Synchronize with the PromptVerse core to access generation templates.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Templates;
