import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    LayoutGrid,
    List,
    RefreshCw,
    Sparkles,
    Eye,
    Pencil,
    Trash2,
    ArrowLeft
} from 'lucide-react';
import promptVerseService from '../../../models/promptVerseService';

const LIMITS = [10, 20, 50];

const CategoryListPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { categoryId } = useParams();

    const passedCategory = state?.category || null;
    const displayName = passedCategory?.name || categoryId || 'Category';

    const [viewMode, setViewMode] = useState('card'); // 'card' | 'list'
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState('');
    const [items, setItems] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        total_pages: 1
    });

    const [refreshTick, setRefreshTick] = useState(0);

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((it) => {
            const title = (it?.title || '').toString().toLowerCase();
            const desc = (it?.description || '').toString().toLowerCase();
            return title.includes(q) || desc.includes(q);
        });
    }, [items, query]);

    useEffect(() => {
        if (!categoryId) return;

        let cancelled = false;
        const load = async () => {
            setLoading(true);
            try {
                const res = await promptVerseService.getPrompts('/api/v1/category-list', {
                    page: pagination.page,
                    limit: pagination.limit,
                    params: { CategoryId: categoryId }
                });

                if (cancelled) return;

                const nextItems = res?.data || [];
                const metaPagination = res?.meta?.pagination || {};

                setItems(nextItems);
                setPagination({
                    page: metaPagination.current_page ?? pagination.page,
                    limit: metaPagination.limit ?? pagination.limit,
                    total: metaPagination.total_items ?? (Array.isArray(nextItems) ? nextItems.length : 0),
                    total_pages: metaPagination.total_pages ?? 1
                });
            } catch (e) {
                console.error('PromptVerse category-list fetch failed:', e);
                if (!cancelled) setItems([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, pagination.page, pagination.limit, refreshTick]);

    const goToPage = (p) => {
        setPagination((prev) => ({ ...prev, page: p }));
    };

    const handleLimitChange = (l) => {
        setPagination((prev) => ({ ...prev, limit: l, page: 1 }));
    };

    const start = pagination.total > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0;
    const end = pagination.total > 0 ? Math.min(pagination.page * pagination.limit, pagination.total) : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/prompts')}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:scale-105 transition-all"
                        title="Back"
                    >
                        <ArrowLeft className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                    </button>

                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                            <Sparkles className="w-4 h-4 text-pink-500" />
                            PromptVerse
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
                            {displayName}
                        </h1>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium italic">
                            Total Items: {pagination.total || 0}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-3 py-1.5 text-xs w-44 focus:border-pink-500/50 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 border rounded-xl transition-all ${
                                viewMode === 'card'
                                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400'
                                    : 'bg-white/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-white dark:hover:bg-zinc-900'
                            }`}
                            title="Card view"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 border rounded-xl transition-all ${
                                viewMode === 'list'
                                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400'
                                    : 'bg-white/50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-white dark:hover:bg-zinc-900'
                            }`}
                            title="List view"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRefreshTick((t) => t + 1)}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Controls + pagination summary */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-500">
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                        <span className="font-bold uppercase tracking-widest hidden sm:block">Per page</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-lg gap-1">
                            {LIMITS.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => handleLimitChange(l)}
                                    className={`px-2 py-1 rounded-md font-black text-[11px] transition-all ${
                                        pagination.limit === l
                                            ? 'bg-white dark:bg-zinc-800 text-pink-600 dark:text-pink-400 shadow-sm'
                                            : 'hover:text-zinc-800 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                        Displaying{' '}
                        <span className="text-zinc-900 dark:text-white">{start}</span> —{' '}
                        <span className="text-zinc-900 dark:text-white">{end}</span>
                        <span className="mx-2 opacity-30">|</span>
                        Total Nodes: <span className="text-pink-500 dark:text-pink-400">{pagination.total || 0}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="py-10 flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 animate-spin text-zinc-400" />
                        </div>
                    ) : viewMode === 'card' ? (
                        filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 opacity-40">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                                <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black mt-3">
                                    No items found
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredItems.map((it, idx) => (
                                    <div
                                        key={it?.id || idx}
                                        className="bg-white/60 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-sm hover:border-pink-500/30 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                                                    {it?.image_url ? (
                                                        <img src={it.image_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-zinc-400">
                                                            NO_IMG
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-zinc-900 dark:text-white text-[13px] tracking-tight truncate">
                                                        {it?.title || '—'}
                                                    </p>
                                                    <p className="text-[10px] text-zinc-400 font-medium truncate uppercase tracking-widest">
                                                        {it?.is_active ? 'active' : 'inactive'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    className="px-2 py-1 rounded-lg border border-pink-500/20 bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[11px] font-black hover:bg-pink-500/15"
                                                    title="View"
                                                    onClick={() => {}}
                                                >
                                                    <Eye className="w-3.5 h-3.5 inline-block mr-1" />
                                                    View
                                                </button>
                                                <button
                                                    className="px-2 py-1 rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-black hover:bg-amber-500/15"
                                                    title="Edit"
                                                    onClick={() => {}}
                                                >
                                                    <Pencil className="w-3.5 h-3.5 inline-block mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    className="px-2 py-1 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-black hover:bg-rose-500/15"
                                                    title="Delete"
                                                    onClick={() => {}}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 inline-block mr-1" />
                                                    Drop
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                                                {it?.description || '—'}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-black text-zinc-600 dark:text-zinc-300">
                                                Views: {it?.view_count ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div>
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead>
                                    <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                        <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-10 text-center">RID</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Title</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-24 text-right">Views</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-24 text-right">Status</th>
                                        <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-32 text-right">Ops</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                                    {filteredItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-16 text-center">
                                                <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">
                                                    No items found
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredItems.map((it, idx) => (
                                            <tr key={it?.id || idx} className="border-b border-zinc-100 dark:border-zinc-800/50">
                                                <td className="px-3 py-2 font-mono text-[10px] text-zinc-400 text-center">
                                                    {(pagination.page - 1) * pagination.limit + idx + 1}
                                                </td>
                                                <td className="px-3 py-2 min-w-0">
                                                    <p className="font-black text-zinc-900 dark:text-white text-[12px] truncate">
                                                        {it?.title || '—'}
                                                    </p>
                                                    <p className="text-[9px] text-zinc-400 font-medium truncate uppercase tracking-widest">
                                                        {it?.description || ''}
                                                    </p>
                                                </td>
                                                <td className="px-3 py-2 text-right text-zinc-400">
                                                    {it?.view_count ?? 0}
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                            it?.is_active
                                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                        }`}
                                                    >
                                                        {it?.is_active ? 'active' : 'inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 hover:bg-pink-500/15"
                                                            title="View"
                                                            onClick={() => {}}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15"
                                                            title="Edit"
                                                            onClick={() => {}}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
                                                            title="Delete"
                                                            onClick={() => {}}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && pagination.total_pages > 0 && (
                    <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/20">
                        <div className="flex flex-col gap-4 items-center">
                            <div className="flex items-center gap-1 flex-wrap justify-center">
                                <button
                                    onClick={() => goToPage(1)}
                                    disabled={pagination.page <= 1}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-pink-200 dark:hover:border-pink-600"
                                >
                                    {'<<'}
                                </button>
                                <button
                                    onClick={() => goToPage(Math.max(1, pagination.page - 1))}
                                    disabled={pagination.page <= 1}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-pink-200 dark:hover:border-pink-600"
                                >
                                    {'<'}
                                </button>

                                <div className="flex items-center gap-1 mx-1 flex-wrap justify-center">
                                    {Array.from({ length: Math.max(1, pagination.total_pages || 1) })
                                        .slice(0, 5)
                                        .map((_, i) => {
                                            const p = i + 1;
                                            const active = pagination.page === p;
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => goToPage(p)}
                                                    className={`w-6 h-6 rounded-lg text-[9px] font-black transition-all ${
                                                        active
                                                            ? 'bg-pink-600 text-white shadow shadow-pink-500/20'
                                                            : 'text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-pink-200 dark:hover:border-pink-600'
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
                                    className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-pink-200 dark:hover:border-pink-600"
                                >
                                    {'>'}
                                </button>
                                <button
                                    onClick={() => goToPage(pagination.total_pages || 1)}
                                    disabled={pagination.page >= (pagination.total_pages || 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-pink-200 dark:hover:border-pink-600"
                                >
                                    {'>>'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryListPage;

