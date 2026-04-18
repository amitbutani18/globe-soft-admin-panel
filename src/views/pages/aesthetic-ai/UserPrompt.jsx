import React, { useState, useCallback } from 'react';
import {
    Fingerprint,
    Plus,
    Save,
    Search,
    Trash2,
    Sparkles,
    Clock,
    MoreVertical,
    CheckCircle2,
} from 'lucide-react';

const SAMPLE_PROMPTS = [
    "Hyper-realistic architectural photography, 8k resolution, cinematic atmosphere, unreal engine 5 render...",
    "Studio portrait lighting, bokeh background, professional DSLR, 50mm lens, golden hour...",
];

const UserPrompt = () => {
    const [loading, setLoading] = useState(false);
    const [promptsList, setPromptsList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newPrompt, setNewPrompt] = useState('');

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!newPrompt.trim()) return;
        setLoading(true);
        try {
            // await promptService.addPrompt({ promts: newPrompt });
            alert('User Prompt added successfully!');
            setNewPrompt('');
            // Refresh list: setPromptsList(await promptService.getPrompts());
        } catch {
            alert('Failed to add User Prompt.');
        } finally {
            setLoading(false);
        }
    }, [newPrompt]);

    const filteredPrompts = promptsList.filter(p =>
        p.promts?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isEmpty = promptsList.length === 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Prompts</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage base prompts for mixing with sub-category content.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Card */}
                <div className="lg:col-span-1 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm shadow-indigo-500/5">
                        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Plus className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold uppercase tracking-tight">Add New Prompt</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Prompt Content</label>
                                <textarea
                                    value={newPrompt}
                                    onChange={e => setNewPrompt(e.target.value)}
                                    rows={8}
                                    placeholder="Enter base prompt styles (e.g. 8k, masterpiece, cinematic lighting...)"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-4 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 leading-relaxed font-medium"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !newPrompt.trim()}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Prompt'}
                            </button>
                        </div>
                    </form>

                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3 text-emerald-500">
                            <CheckCircle2 className="w-5 h-5" />
                            <h3 className="text-xs font-black uppercase tracking-widest">Efficiency Tip</h3>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            These prompts are mixed with sub-category prompts for non-premium users to maintain quality.
                        </p>
                    </div>
                </div>

                {/* List Card */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Fingerprint className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-lg font-bold uppercase tracking-tight">Active Prompts Repository</h2>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="p-4 space-y-3 custom-scrollbar overflow-y-auto max-h-[600px] flex-1">
                        {isEmpty ? (
                            <>
                                <div className="flex flex-col items-center justify-center py-10 text-zinc-400 opacity-30 gap-4">
                                    <Sparkles className="w-12 h-12" />
                                    <p className="text-sm font-black uppercase tracking-widest">No Prompts Found</p>
                                    <p className="text-[10px] w-48 text-center leading-relaxed">Add your first base prompt in the left panel.</p>
                                </div>
                                {/* Sample data placeholders */}
                                {SAMPLE_PROMPTS.map((text, i) => (
                                    <div key={i} className="p-6 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl opacity-40 grayscale">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-3 flex-1">
                                                <span className="text-[10px] font-black text-zinc-400 bg-zinc-400/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Sample Data</span>
                                                <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">"{text}"</p>
                                            </div>
                                            <button disabled className="p-2 text-zinc-300">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            filteredPrompts.map((item, idx) => (
                                <div key={item.id || idx} className="p-6 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60 rounded-2xl group relative hover:border-indigo-500/30 transition-all duration-300">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                    ID: {item.id?.substring(0, 8) || 'N/A'}...
                                                </span>
                                                <Clock className="w-3 h-3 text-zinc-400" />
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Added Recently</span>
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed italic line-clamp-3">
                                                "{item.promts}"
                                            </p>
                                        </div>
                                        <button className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPrompt;
