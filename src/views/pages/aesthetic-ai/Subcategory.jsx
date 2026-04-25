import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    RefreshCw,
    Sparkles,
    Image as ImageIcon,
    ChevronRight,
    Calendar,
    Pencil,
    Trash2,
    Eye,
    X,
    Filter,
    CheckCircle2,
    ChevronsLeft,
    ChevronsRight,
    ChevronLeft,
    Target
} from 'lucide-react';
import subcategoryService from '../../../models/subcategoryService';
import categoryService from '../../../models/categoryService';
import ConfirmationModal from '../../../components/ConfirmationModal';

// Items per page options
const LIMIT_OPTIONS = [5, 10, 20, 50];

const Subcategory = () => {
    const [loading, setLoading] = useState(false);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]); // for potential future use or display
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [subFormData, setSubFormData] = useState({
        CategoryId: '',
        name: '',
        refImage: '',
        prompt: '',
        is_active: true,
        seq_num: 1
    });
    const [editFormData, setEditFormData] = useState({
        CategoryId: '',
        name: '',
        refImage: '',
        prompt: '',
        is_active: true,
        seq_num: 1
    });

    const [catSearchQuery, setCatSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ current_page: 1, limit: 10, total_items: 0, total_pages: 1 });

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const fetchSubcategories = useCallback(async (p = page, l = limit) => {
        setLoading(true);
        try {
            const response = await subcategoryService.getSubcategories(p, l);
            if (response && response.success) {
                setSubcategories(response.data || []);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
            }
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
            setSubcategories([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    const fetchDropdownCategories = async () => {
        try {
            const response = await categoryService.getCategories(1, 100);
            if (response && response.success) {
                setCategories(response.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch categories for dropdown:', error);
        }
    };

    useEffect(() => {
        fetchSubcategories(page, limit);
        fetchDropdownCategories();
    }, [fetchSubcategories, page, limit]);

    const executeAddSubcategory = async () => {
        setAdding(true);
        try {
            const response = await subcategoryService.addSubcategory(subFormData);
            if (response.success) {
                setIsAddModalOpen(false);
                setSubFormData({ CategoryId: '', name: '', refImage: '', prompt: '', is_active: true, seq_num: 1 });
                fetchSubcategories(1, limit);
            }
        } catch (error) {
            alert('Failed to add sub-category: ' + (error.response?.data?.message || error.message));
        } finally {
            setAdding(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleAddSubcategory = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'success',
            title: 'Initialize Neural Node',
            message: 'Are you sure you want to deploy this sub-matrix node to the network?',
            onConfirm: executeAddSubcategory
        });
    };

    const executeDelete = async (id) => {
        setLoading(true);
        try {
            const response = await subcategoryService.deleteSubcategory(id);
            if (response.success) {
                fetchSubcategories(page, limit);
            }
        } catch (error) {
            alert('Failed to delete sub-category: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleDelete = (id) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Drop Neural Node',
            message: 'Are you sure you want to drop this node? This action cannot be undone.',
            onConfirm: () => executeDelete(id)
        });
    };

    const handleEdit = (sub) => {
        setEditFormData({
            id: sub.id,
            CategoryId: sub.CategoryId,
            name: sub.name,
            refImage: sub.refImage,
            prompt: sub.prompt,
            is_active: sub.is_active,
            seq_num: sub.seq_num
        });
        setIsEditModalOpen(true);
    };

    const executeUpdate = async () => {
        setUpdating(true);
        try {
            const { id, ...dataToUpdate } = editFormData;
            const response = await subcategoryService.patchSubcategory(id, dataToUpdate);
            if (response.success) {
                setIsEditModalOpen(false);
                fetchSubcategories(page, limit);
            }
        } catch (error) {
            alert('Failed to update sub-category: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleUpdate = (e) => {
        if (e) e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Update Neural Params',
            message: 'Is this final? Modification will affect generative outputs immediately.',
            onConfirm: executeUpdate
        });
    };

    const handleView = async (id) => {
        setLoading(true);
        try {
            const response = await subcategoryService.getSubcategoryById(id);
            if (response.success) {
                setSelectedSubcategory(response.data);
                setIsViewModalOpen(true);
            }
        } catch (error) {
            alert('Failed to fetch sub-category details');
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
                    <h1 className="text-3xl font-bold tracking-tight">Sub-Matrix Registry</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Configure specific AI personas and generative prompts.
                        {pagination.total_items > 0 && (
                            <span className="ml-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                {pagination.total_items} nodes
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchSubcategories(page, limit)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all font-semibold text-sm text-zinc-600 dark:text-zinc-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all font-semibold shadow-lg shadow-emerald-500/20 active:scale-95 text-sm text-white"
                    >
                        <Plus className="w-5 h-5" />
                        Create Node
                    </button>
                </div>
            </div>

            {/* ── Add Sub-Category Modal ─────────────────────────────── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Create Sub-Matrix Node</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Initialize Neural Entry</p>
                                </div>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddSubcategory} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Parent Category - Custom Searchable Dropdown */}
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Parent Category</label>
                                    <div className="relative">
                                        <div
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-bold cursor-pointer flex items-center justify-between group"
                                        >
                                            <span className={subFormData.CategoryId ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
                                                {categories.find(c => c.id === subFormData.CategoryId)?.name || 'Select Category...'}
                                            </span>
                                            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : ''}`} />
                                        </div>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Filter categories..."
                                                            autoFocus
                                                            value={catSearchQuery}
                                                            onChange={(e) => setCatSearchQuery(e.target.value)}
                                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-[11px] focus:border-emerald-500/50 outline-none transition-all font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
                                                    {categories
                                                        .filter(c => c.name.toLowerCase().includes(catSearchQuery.toLowerCase()))
                                                        .map(cat => (
                                                            <div
                                                                key={cat.id}
                                                                onClick={() => {
                                                                    setSubFormData({ ...subFormData, CategoryId: cat.id });
                                                                    setIsDropdownOpen(false);
                                                                    setCatSearchQuery('');
                                                                }}
                                                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${subFormData.CategoryId === cat.id
                                                                    ? 'bg-emerald-500/10 text-emerald-600'
                                                                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                                                    }`}
                                                            >
                                                                {cat.name}
                                                                {subFormData.CategoryId === cat.id && <CheckCircle2 className="w-3 h-3" />}
                                                            </div>
                                                        ))}
                                                    {categories.filter(c => c.name.toLowerCase().includes(catSearchQuery.toLowerCase())).length === 0 && (
                                                        <div className="py-4 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest opacity-50">
                                                            No matches found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Seq Num */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Position</label>
                                    <input
                                        required
                                        type="number"
                                        value={subFormData.seq_num}
                                        onChange={e => setSubFormData({ ...subFormData, seq_num: parseInt(e.target.value) })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-bold font-mono"
                                    />
                                </div>
                                {/* Name */}
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Node Name / Persona</label>
                                    <input
                                        required
                                        type="text"
                                        value={subFormData.name}
                                        onChange={e => setSubFormData({ ...subFormData, name: e.target.value })}
                                        placeholder="e.g. Vintage Film Look"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                {/* Ref Image */}
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Reference Image URL</label>
                                    <input
                                        required
                                        type="url"
                                        value={subFormData.refImage}
                                        onChange={e => setSubFormData({ ...subFormData, refImage: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-emerald-500 outline-none transition-all font-semibold"
                                    />
                                </div>
                                {/* Prompt */}
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Generative AI Prompt</label>
                                    <textarea
                                        required
                                        value={subFormData.prompt}
                                        onChange={e => setSubFormData({ ...subFormData, prompt: e.target.value })}
                                        placeholder="Enter high-fidelity prompt instructions..."
                                        rows={4}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-xs focus:border-emerald-500 outline-none transition-all font-medium leading-relaxed resize-none"
                                    />
                                </div>
                                {/* Status */}
                                <div className="flex items-center gap-4 py-2 col-span-1 md:col-span-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Live Status</label>
                                    <button
                                        type="button"
                                        onClick={() => setSubFormData({ ...subFormData, is_active: !subFormData.is_active })}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subFormData.is_active
                                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                            : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                                            }`}
                                    >
                                        {subFormData.is_active ? 'Active' : 'Offline'}
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
                                    {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Deploy Node
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Total Nodes', value: pagination.total_items || subcategories.length, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Prompt Models', value: subcategories.filter(s => s.prompt).length, icon: Sparkles, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Active Channels', value: subcategories.filter(s => s.is_active).length, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
                            placeholder="Search sub-registry..."
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
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-10">#</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Node / Category</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Reference Preview</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-32">Sync Date</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-24 text-center">Status</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                            {loading && subcategories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Synchronizing sub-registry...
                                        </div>
                                    </td>
                                </tr>
                            ) : subcategories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <Sparkles className="w-10 h-10 text-emerald-500" />
                                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">No sub-nodes found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                subcategories.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((sub, idx) => {
                                    const row = (pagination.current_page - 1) * pagination.limit + idx + 1;
                                    return (
                                        <tr key={sub.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                                            <td className="px-5 py-4 font-mono text-xs text-zinc-400 dark:text-zinc-600 w-10">{sub.seq_num || row}</td>

                                            <td className="px-5 py-4">
                                                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug mb-1 uppercase tracking-tight">
                                                    {sub.name}
                                                </p>
                                                <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 leading-relaxed uppercase truncate max-w-[200px]">
                                                    Parent: {categories.find(c => c.id === sub.CategoryId)?.name || sub.CategoryId}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 relative group/img shadow-sm">
                                                        <img src={sub.refImage} className="w-full h-full object-cover" alt="ref" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                            <ImageIcon className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] text-zinc-400 uppercase font-black mb-1">AI Prompt Snippet</p>
                                                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 italic line-clamp-1 max-w-[300px]">
                                                            "{sub.prompt}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 w-32 text-[11px] text-zinc-500 font-mono">
                                                {formatDate(sub.updatedAt || sub.createdAt)}
                                            </td>

                                            <td className="px-5 py-4 w-24 text-center">
                                                <span className={`inline-flex items-center gap-1 text-[9px] font-bold ${sub.is_active ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'} px-2 py-0.5 rounded-full uppercase tracking-widest`}>
                                                    {sub.is_active ? 'Active' : 'Offline'}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-right w-52">
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <button
                                                        onClick={() => handleView(sub.id)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20 uppercase tracking-widest"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(sub)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors border border-amber-500/20 uppercase tracking-widest"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(sub.id)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors border border-rose-500/20 uppercase tracking-widest"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Drop
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
                        <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                            Displaying Node <span className="font-bold text-zinc-700 dark:text-zinc-300">{(pagination.current_page - 1) * pagination.limit + 1}–{Math.min(pagination.current_page * pagination.limit, pagination.total_items)}</span> of <span className="font-bold text-zinc-700 dark:text-zinc-300">{pagination.total_items}</span> Registry Entries
                        </p>

                        <div className="flex items-center gap-1 flex-wrap justify-center">
                            <button onClick={() => goToPage(1)} disabled={page <= 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                                <ChevronsLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>

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

                            <button onClick={() => goToPage(page + 1)} disabled={page >= pagination.total_pages} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button onClick={() => goToPage(pagination.total_pages)} disabled={page >= pagination.total_pages} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition-colors">
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-0.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-400">Registry Terminal</p>
                <div className="h-0.5 w-8 bg-zinc-100 dark:bg-zinc-800 rounded-full"></div>
            </div>
            {/* ── View Sub-Category Detail Modal ──────────────────── */}
            {isViewModalOpen && selectedSubcategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsViewModalOpen(false)} />
                    <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">{selectedSubcategory.name}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Node Detailed View</p>
                                </div>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Side: Preview */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Reference Matrix (Neural Input)</label>
                                    <div className="aspect-square rounded-[2rem] overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 group/img shadow-inner">
                                        <img src={selectedSubcategory.refImage} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt="Reference" />
                                    </div>
                                </div>

                                {/* Right Side: Details */}
                                <div className="space-y-6">
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-6 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Generative AI Protocol</p>
                                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic border-l-2 border-emerald-500/30 pl-4 py-1">
                                            "{selectedSubcategory.prompt}"
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 text-center">Rank Index</p>
                                            <p className="text-lg font-mono font-bold text-emerald-600 text-center">#{selectedSubcategory.seq_num || '0'}</p>
                                        </div>
                                        <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 text-center">Status Vector</p>
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${selectedSubcategory.is_active ? 'text-emerald-600' : 'text-rose-600'} uppercase tracking-widest`}>
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {selectedSubcategory.is_active ? 'Online' : 'Offline'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">System Trace</p>
                                        <div className="space-y-2 font-mono text-[10px]">
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">PARENT_ID</span>
                                                <span className="text-zinc-500 text-right truncate ml-4 max-w-[150px]">{selectedSubcategory.CategoryId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">INIT_DATE</span>
                                                <span className="text-zinc-500">{formatDate(selectedSubcategory.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-zinc-400">LAST_SYNC</span>
                                                <span className="text-zinc-500">{formatDate(selectedSubcategory.updatedAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-100 dark:border-zinc-800">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="w-full py-4 bg-zinc-900 dark:bg-emerald-600 hover:bg-zinc-800 dark:hover:bg-emerald-500 text-white rounded-[1.5rem] font-bold transition-all shadow-xl shadow-emerald-500/10 active:scale-95 text-xs uppercase tracking-widest border border-zinc-700/50"
                            >
                                Close Terminal
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Edit Sub-Category Modal ──────────────────────────────── */}
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
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Edit Sub-Matrix Node</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Modify Neural Entry</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Parent Category - Edit Mode */}
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Parent Category</label>
                                    <select
                                        required
                                        value={editFormData.CategoryId}
                                        onChange={e => setEditFormData({ ...editFormData, CategoryId: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold appearance-none"
                                    >
                                        <option value="">Select Category...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Node Identity (Name)</label>
                                    <input
                                        required
                                        type="text"
                                        value={editFormData.name}
                                        onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Reference Matrix URL</label>
                                    <input
                                        required
                                        type="url"
                                        value={editFormData.refImage}
                                        onChange={e => setEditFormData({ ...editFormData, refImage: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm focus:border-amber-500 outline-none transition-all font-bold"
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
                                <div className="col-span-full space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Generative Persona Prompt</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={editFormData.prompt}
                                        onChange={e => setEditFormData({ ...editFormData, prompt: e.target.value })}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] px-5 py-4 text-xs focus:border-amber-500 outline-none transition-all font-bold italic"
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
                                    Update Neural Node
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* ── Confirmation Modal ─────────────────────────────────── */}
            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
            />
        </div>
    );
};

export default Subcategory;
