import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    RefreshCw,
    Layers,
    Save,
    X,
    Trash2,
    MoreVertical,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    Calendar,
    Pencil,
    Image as ImageIcon,
    Filter
} from 'lucide-react';
import categoryService from '../../../models/categoryService';

// Items per page options
const LIMIT_OPTIONS = [5, 10, 20, 50];

const Category = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, limit: 10, total_items: 0, total_pages: 1 });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        beforeImage: '',
        afterImage: '',
        is_active: true,
        seq_num: 1
    });
    const [editFormData, setEditFormData] = useState({
        name: '',
        beforeImage: '',
        afterImage: '',
        is_active: true,
        seq_num: 1
    });

    const fetchCategories = useCallback(async (p = page, l = limit) => {
        setLoading(true);
        try {
            const response = await categoryService.getCategories(p, l);
            if (response && response.success) {
                setCategories(response.data || []);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchCategories(page, limit);
    }, [fetchCategories, page, limit]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const response = await categoryService.addCategory(categoryFormData);
            if (response.success) {
                alert('Category added successfully');
                setIsAddModalOpen(false);
                setCategoryFormData({ name: '', beforeImage: '', afterImage: '', is_active: true, seq_num: 1 });
                fetchCategories(1, limit); // Refresh list
            }
        } catch (error) {
            alert('Failed to add category: ' + (error.response?.data?.message || error.message));
        } finally {
            setAdding(false);
        }
    };

    const handleView = async (id) => {
        setLoading(true);
        try {
            const response = await categoryService.getCategoryById(id);
            if (response.success) {
                setSelectedCategory(response.data);
                setIsViewModalOpen(true);
            }
        } catch (error) {
            alert('Failed to fetch category details');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setEditFormData({
            id: category.id,
            name: category.name,
            beforeImage: category.beforeImage,
            afterImage: category.afterImage,
            is_active: category.is_active,
            seq_num: category.seq_num
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        setUpdating(true);
        try {
            const { id, ...dataToUpdate } = editFormData;
            const response = await categoryService.patchCategory(id, dataToUpdate);
            if (response.success) {
                alert('Category updated successfully');
                setIsEditModalOpen(false);
                fetchCategories(page, limit);
            }
        } catch (error) {
            alert('Failed to update category: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to kill this category? This will terminate all associated neural links.')) return;

        setLoading(true);
        try {
            const response = await categoryService.deleteCategory(id);
            if (response.success) {
                alert('Category deleted successfully');
                fetchCategories(page, limit);
            }
        } catch (error) {
            alert('Failed to delete category: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // ── Pagination helpers ───────────────────────────────────────
    const goToPage = (p) => {
        const clamped = Math.max(1, Math.min(p, pagination.total_pages));
        setPage(clamped);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const formatDate = (str) => {
        if (!str) return '—';
        try { return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch { return str; }
    };

    // Page number buttons
    const pageNumbers = () => {
        const total = pagination.total_pages;
        const current = pagination.current_page;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
        return [...pages].sort((a, b) => a - b);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category Matrix</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage image collection categories for Aesthetic AI.
                        {pagination.total_items > 0 && (
                            <span className="ml-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                {pagination.total_items} items total
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchCategories(page, limit)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all font-semibold text-sm text-zinc-600 dark:text-zinc-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all font-semibold shadow-lg shadow-emerald-500/20 active:scale-95 text-sm text-white"
                    >
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Units', value: pagination.total_items || categories.length, icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Active Matrix', value: categories.filter(c => c.is_active).length, icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Total Pages', value: pagination.total_pages || 1, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map(stat => {
                    const StatIcon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                <StatIcon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Table Card ────────────────────────────────────────── */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">

                {/* Toolbar */}
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search current page..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-emerald-500/50 focus:outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                    </div>
                    {/* Per-page selector */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="uppercase tracking-widest font-bold hidden sm:block">Per page</span>
                        <div className="flex gap-1">
                            {LIMIT_OPTIONS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => handleLimitChange(l)}
                                    className={`w-9 h-8 rounded-lg font-bold transition-colors ${limit === l
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent text-zinc-500'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-10">Seq</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Name / Metadata</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-48">Transformation</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-32">Date</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-24 text-center">Status</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                            {loading && categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Syncing Matrix...
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <Layers className="w-10 h-10 text-emerald-500" />
                                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">Matrix Registry Empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((cat, idx) => {
                                    return (
                                        <tr key={cat.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                                            {/* Row # */}
                                            <td className="px-5 py-4 font-mono text-xs text-zinc-400 dark:text-zinc-600 w-10">{cat.seq_num || idx + 1}</td>

                                            {/* Name + ID snippet */}
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug mb-1 uppercase tracking-tight">
                                                    {cat.name}
                                                </p>
                                                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 leading-relaxed uppercase">
                                                    UUID: {cat.id}
                                                </p>
                                            </td>

                                            {/* Preview Transformation */}
                                            <td className="px-5 py-4 w-48">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 relative group/img">
                                                        <img src={cat.beforeImage} className="w-full h-full object-cover" alt="pre" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                            <ImageIcon className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-zinc-300" />
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-500/20 ring-4 ring-emerald-500/5 bg-emerald-50 relative group/img">
                                                        <img src={cat.afterImage} className="w-full h-full object-cover" alt="post" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                            <ImageIcon className="w-3 h-3 text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-5 py-4 w-32">
                                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono whitespace-nowrap">
                                                    <Calendar className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                                                    {formatDate(cat.updatedAt || cat.createdAt)}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4 w-24 text-center">
                                                <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${cat.is_active ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'} px-2 py-0.5 rounded-full uppercase tracking-widest`}>
                                                    {cat.is_active ? 'Active' : 'Offline'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right w-52">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button
                                                        onClick={() => handleView(cat.id)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20 uppercase tracking-widest"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(cat)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors border border-amber-500/20 uppercase tracking-widest"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors border border-rose-500/20 uppercase tracking-widest"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Kill
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination Bar ──────────────────────────────────── */}
                {!loading && pagination.total_pages > 0 && (
                    <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/30 dark:bg-zinc-950/10">
                        {/* Info */}
                        <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                            Showing Unit <span className="font-bold text-zinc-700 dark:text-zinc-300">{(pagination.current_page - 1) * pagination.limit + 1}–{Math.min(pagination.current_page * pagination.limit, pagination.total_items)}</span> of <span className="font-bold text-zinc-700 dark:text-zinc-300">{pagination.total_items}</span> Total
                        </p>

                        {/* Page buttons */}
                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            {/* First */}
                            <button
                                onClick={() => goToPage(1)}
                                disabled={page <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>
                            {/* Prev */}
                            <button
                                onClick={() => goToPage(page - 1)}
                                disabled={page <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page number buttons */}
                            {pageNumbers().map((p, i, arr) => (
                                <React.Fragment key={p}>
                                    {i > 0 && arr[i - 1] !== p - 1 && (
                                        <span className="w-8 text-center text-zinc-400 text-sm">…</span>
                                    )}
                                    <button
                                        onClick={() => goToPage(p)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === p
                                            ? 'bg-emerald-600 text-white shadow shadow-emerald-500/20'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            ))}

                            {/* Next */}
                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= pagination.total_pages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {/* Last */}
                            <button
                                onClick={() => goToPage(pagination.total_pages)}
                                disabled={page >= pagination.total_pages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* ── Add Category Modal ─────────────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsAddModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Add New Category</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Initialize Registry Entry</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCategory} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={categoryFormData.name}
                                        onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                        placeholder="e.g. Cinematic Portraits"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                {/* Seq Num */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Number</label>
                                    <input
                                        required
                                        type="number"
                                        value={categoryFormData.seq_num}
                                        onChange={e => setCategoryFormData({ ...categoryFormData, seq_num: parseInt(e.target.value) })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-bold font-mono"
                                    />
                                </div>
                                {/* Before Image */}
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Before Image URL</label>
                                    <input
                                        required
                                        type="url"
                                        value={categoryFormData.beforeImage}
                                        onChange={e => setCategoryFormData({ ...categoryFormData, beforeImage: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-semibold"
                                    />
                                </div>
                                {/* After Image */}
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">After Image URL</label>
                                    <input
                                        required
                                        type="url"
                                        value={categoryFormData.afterImage}
                                        onChange={e => setCategoryFormData({ ...categoryFormData, afterImage: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-semibold"
                                    />
                                </div>
                                {/* Status */}
                                <div className="flex items-center gap-4 py-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setCategoryFormData({ ...categoryFormData, is_active: !categoryFormData.is_active })}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${categoryFormData.is_active
                                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                            : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                                            }`}
                                    >
                                        {categoryFormData.is_active ? 'Active' : 'Offline'}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-[1.5rem] font-bold transition-all text-xs uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="flex-[2] px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Commit Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ── View Category Detail Modal ───────────────────────── */}
            {isViewModalOpen && selectedCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsViewModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">{selectedCategory.name}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Node Detailed View</p>
                                </div>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            {/* Matrix Previews */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Input Matrix (Before)</label>
                                    <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 group/img">
                                        <img src={selectedCategory.beforeImage} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="Before" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Output Matrix (After)</label>
                                    <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden border-2 border-emerald-500/20 bg-emerald-50/10 group/img">
                                        <img src={selectedCategory.afterImage} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="After" />
                                    </div>
                                </div>
                            </div>

                            {/* Node Metadata */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Sequence Rank</p>
                                    <p className="text-lg font-mono font-bold text-emerald-600">#{selectedCategory.seq_num || '0'}</p>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Status Vector</p>
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${selectedCategory.is_active ? 'text-emerald-600' : 'text-rose-600'} uppercase tracking-widest`}>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        {selectedCategory.is_active ? 'Active Node' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="col-span-2 bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Neural ID</p>
                                        <p className="text-xs font-mono text-zinc-400 truncate max-w-[200px]">{selectedCategory.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Initialization</p>
                                        <p className="text-xs font-mono text-zinc-400">{formatDate(selectedCategory.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="w-full py-4 bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-500 text-white rounded-[1.5rem] font-bold transition-all shadow-xl shadow-emerald-500/10 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                Close Terminal
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Edit Category Modal ──────────────────────────────── */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600">
                                    <Pencil className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Edit Category Node</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Modify Neural Parameters</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Node Identity (Name)</label>
                                    <input
                                        required
                                        type="text"
                                        value={editFormData.name}
                                        onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold"
                                        placeholder="Enter category name..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Rank</label>
                                    <input
                                        required
                                        type="number"
                                        value={editFormData.seq_num}
                                        onChange={e => setEditFormData({ ...editFormData, seq_num: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Before Matrix URL</label>
                                    <input
                                        required
                                        type="url"
                                        value={editFormData.beforeImage}
                                        onChange={e => setEditFormData({ ...editFormData, beforeImage: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">After Matrix URL</label>
                                    <input
                                        required
                                        type="url"
                                        value={editFormData.afterImage}
                                        onChange={e => setEditFormData({ ...editFormData, afterImage: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${editFormData.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-tight">Active Protocol</p>
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Toggle production visibility</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditFormData({ ...editFormData, is_active: !editFormData.is_active })}
                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${editFormData.is_active ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-300 dark:bg-zinc-800'}`}
                                >
                                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${editFormData.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-[1.5rem] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-xs uppercase tracking-widest"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-[2] px-6 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-[1.5rem] font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update Node
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FileText = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

export default Category;
