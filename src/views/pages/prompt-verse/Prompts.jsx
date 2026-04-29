import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, Search, Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import promptVerseService from '../../../models/promptVerseService';

const Prompts = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // When you share the exact curl/route, set this to the PromptVerse endpoint path.
    // This particular PromptVerse "Prompts" screen uses the categories registry endpoint.
    const PROMPTS_ENDPOINT_PATH = '/api/v1/categories';

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
    const [refreshTick, setRefreshTick] = useState(0);

    const filteredPrompts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((c) => {
            const name = (c?.name || '').toString().toLowerCase();
            const desc = (c?.description || '').toString().toLowerCase();
            return name.includes(q) || desc.includes(q);
        });
    }, [categories, searchQuery]);

    const goToPage = (p) => {
        setPagination((prev) => ({ ...prev, page: p }));
    };

    const handleLimitChange = (l) => {
        setPagination((prev) => ({ ...prev, limit: l, page: 1 }));
    };

    useEffect(() => {
        if (!PROMPTS_ENDPOINT_PATH) return;

        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const res = await promptVerseService.getPrompts(PROMPTS_ENDPOINT_PATH, {
                    page: pagination.page,
                    limit: pagination.limit,
                    params: { is_active: true }
                });

                if (cancelled) return;

                // Response shape:
                // { success, data: [], meta: { pagination: { total_items, total_pages, current_page, limit } } }
                const items = res?.data || [];
                const metaPagination = res?.meta?.pagination || {};

                setCategories(items);
                setPagination({
                    page: metaPagination.current_page ?? pagination.page,
                    limit: metaPagination.limit ?? pagination.limit,
                    total: metaPagination.total_items ?? (Array.isArray(items) ? items.length : 0),
                    total_pages: metaPagination.total_pages ?? 1
                });
            } catch (e) {
                console.error('PromptVerse categories fetch failed:', e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [PROMPTS_ENDPOINT_PATH, pagination.page, pagination.limit, refreshTick]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase italic">PromptVerse Matrix</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Curated collection of high-performance AI generation keys.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-all font-semibold shadow-lg shadow-pink-500/20 active:scale-95 text-sm">
                        <Plus className="w-5 h-5" />
                        Create Prompt
                    </button>
                </div>
            </div>

            {(!loading && categories.length === 0) ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4 shadow-sm shadow-pink-500/5">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20">
                    <Sparkles className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">Registry Initializing</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                        PromptVerse matrix is currently being synchronized. Connect to production endpoint to see the full registry.
                    </p>
                </div>
            </div>
            ) : null}

            {/* Registry Table (blank until you share curl/response) */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-500">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search prompts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-bold uppercase tracking-widest hidden sm:block">Per page</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-lg gap-1">
                            {[10, 20, 50].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => handleLimitChange(l)}
                                    className={`px-2 py-1 rounded-md font-black transition-all ${
                                        pagination.limit === l
                                            ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                            : 'hover:text-zinc-800 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setRefreshTick((t) => t + 1)}
                            disabled={loading}
                            className="ml-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-50"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Total list size (from server pagination meta) */}
                <div className="px-6 pt-2 pb-1">
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                        Total Items: <span className="text-zinc-900 dark:text-white">{pagination.total || 0}</span>
                    </p>
                </div>

                <div>
                    <table className="w-full table-fixed text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-10 text-center">RID</th>
                                <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">Prompts</th>
                                <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Status</th>
                                <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Operations</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold">
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPrompts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">
                                                No categories found
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPrompts.map((p, idx) => (
                                    <tr
                                        key={p?.id || idx}
                                        className="group hover:bg-indigo-500/[0.02] transition-colors border-b border-zinc-100 dark:border-zinc-800/50 cursor-pointer"
                                        onClick={() => {
                                            if (!p?.id) return;
                                            navigate(`/prompts/category-list/${encodeURIComponent(p.id)}`, {
                                                state: { category: p }
                                            });
                                        }}
                                    >
                                        <td className="px-3 py-2 font-mono text-[10px] text-zinc-400 text-center">{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                                        <td className="px-3 py-2 min-w-0">
                                            <p className="font-black text-zinc-900 dark:text-white text-[12px] tracking-tight truncate">
                                                {p?.name || '—'}
                                            </p>
                                            <p className="text-[9px] text-zinc-400 font-medium truncate uppercase tracking-widest">
                                                {p?.description || '—'}
                                            </p>
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-200/70 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-300">
                                                {p?.prompt_count ?? 0}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right">
                                            <span
                                                className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                    p?.is_active
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                }`}
                                            >
                                                {p?.is_active ? 'active' : 'inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 text-right text-zinc-400">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="px-2 py-1 hover:bg-indigo-500/10 rounded-lg transition-all text-indigo-500 text-[11px] font-black"
                                                    title="View"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="px-2 py-1 hover:bg-amber-500/10 rounded-lg transition-all text-amber-500 text-[11px] font-black"
                                                    title="Edit"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-2 py-1 hover:bg-rose-500/10 rounded-lg transition-all text-rose-500 text-[11px] font-black"
                                                    title="Delete"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 bg-zinc-50/30 dark:bg-zinc-950/20">
                    {(() => {
                        const total = pagination.total || 0;
                        const start = total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
                        const end = total > 0 ? Math.min(pagination.page * pagination.limit, total) : 0;
                        return (
                            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                                Displaying{' '}
                                <span className="text-zinc-900 dark:text-white">{start}</span> —{' '}
                                <span className="text-zinc-900 dark:text-white">{end}</span>
                                <span className="mx-2 opacity-30">|</span>
                                Total Nodes: <span className="text-indigo-600 dark:text-indigo-400">{total}</span>
                            </p>
                        );
                    })()}

                    {/* Page buttons (stack vertically / wrap to avoid horizontal shifts) */}
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        <button
                            onClick={() => goToPage(1)}
                            disabled={pagination.page <= 1}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                            disabled={pagination.page <= 1}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            {'<'}
                        </button>

                        <div className="flex items-center gap-1 mx-1 flex-wrap justify-center">
                            {Array.from({ length: Math.max(1, pagination.total_pages || 1) }).slice(0, 5).map((_, i) => {
                                const p = i + 1;
                                const active = pagination.page === p;
                                return (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`w-6 h-6 rounded-lg text-[9px] font-black transition-all ${
                                            active
                                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg scale-110'
                                                : 'text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => goToPage(Math.min(pagination.total_pages || 1, pagination.page + 1))}
                            disabled={pagination.page >= (pagination.total_pages || 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => goToPage(pagination.total_pages || 1)}
                            disabled={pagination.page >= (pagination.total_pages || 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            {'>>'}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 justify-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">Jump to node</span>
                        <input
                            type="number"
                            min={1}
                            max={pagination.total_pages || 1}
                            defaultValue={pagination.page}
                            onKeyDown={(e) => e.key === 'Enter' && goToPage(Number(e.target.value))}
                            className="w-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 text-[10px] text-center font-black focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prompts;
