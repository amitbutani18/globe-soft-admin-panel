import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    RefreshCw,
    BookOpen,
    Save,
    X,
    Trash2,
    MoreVertical,
    HelpCircle,
    FileText,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Eye,
    Calendar,
    Pencil,
    Activity,
    Zap
} from 'lucide-react';
import ConfirmationModal from '../../../components/ConfirmationModal';
import dailyBlogService from '../../../models/dailyBlogService';

const emptyQuestion = () => ({
    question: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
});

// Items per page options
const LIMIT_OPTIONS = [5, 10, 20, 50];

const DailyBlogs = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importJson, setImportJson] = useState('');
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editFormData, setEditFormData] = useState({ id: '', title: '', date: '', date_sort: '', created_at: '', updated_at: '', content: '', quiz: [emptyQuestion()] });
    const [editLoading, setEditLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [viewLoading, setViewLoading] = useState(null); // stores blog.id while loading
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    // Form state — API only accepts: title, content, quiz
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        date: '',
        date_sort: '',
        created_at: '',
        updated_at: '',
        content: '',
        quiz: [emptyQuestion()],
    });

    const fetchBlogs = async (p = page, l = limit) => {
        setLoading(true);
        try {
            const { blogs: data, pagination: meta } = await dailyBlogService.getBlogs(p, l);
            setBlogs(data);
            setPagination(meta);
        } catch (error) {
            console.error('Failed to fetch daily blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs(page, limit);
    }, [page, limit]);

    // ── View (fetch by ID) ────────────────────────────────
    const openView = async (blog) => {
        setViewLoading(blog.id);
        try {
            const fresh = await dailyBlogService.getBlogById(blog.id);
            setSelectedBlog(fresh ?? blog); // fallback to list data if API fails
            setIsDetailOpen(true);
        } catch {
            // fallback: show cached list data
            setSelectedBlog(blog);
            setIsDetailOpen(true);
        } finally {
            setViewLoading(null);
        }
    };

    // ── Form Field Handlers ──────────────────────────────────────────
    const handleField = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // ── Quiz Handlers ────────────────────────────────────────────
    const addQuestion = () => setFormData(prev => ({ ...prev, quiz: [...prev.quiz, emptyQuestion()] }));

    const removeQuestion = (qi) =>
        setFormData(prev => ({ ...prev, quiz: prev.quiz.filter((_, i) => i !== qi) }));

    const handleQuizField = (qi, field, value) =>
        setFormData(prev => ({
            ...prev,
            quiz: prev.quiz.map((q, i) => i === qi ? { ...q, [field]: value } : q)
        }));

    const handleOptionChange = (qi, oi, value) =>
        setFormData(prev => ({
            ...prev,
            quiz: prev.quiz.map((q, i) => {
                if (i !== qi) return q;
                return { ...q, options: q.options.map((o, j) => j === oi ? value : o) };
            })
        }));

    // ── Edit Handlers ────────────────────────────────────────────
    const openEdit = (blog) => {
        setEditingBlog(blog);
        setEditFormData({
            id: blog.id || blog._id || '',
            title: blog.title || '',
            date: blog.date || '',
            date_sort: blog.date_sort || '',
            created_at: blog.created_at || '',
            updated_at: blog.updated_at || '',
            content: blog.content || '',
            quiz: blog.quiz?.length > 0
                ? blog.quiz.map(q => ({ ...q, options: [...q.options] }))
                : [emptyQuestion()],
        });
        setIsEditModalOpen(true);
    };

    const handleEditField = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditQuizField = (qi, field, value) =>
        setEditFormData(prev => ({
            ...prev,
            quiz: prev.quiz.map((q, i) => i === qi ? { ...q, [field]: value } : q)
        }));

    const handleEditOptionChange = (qi, oi, value) =>
        setEditFormData(prev => ({
            ...prev,
            quiz: prev.quiz.map((q, i) => {
                if (i !== qi) return q;
                return { ...q, options: q.options.map((o, j) => j === oi ? value : o) };
            })
        }));

    const addEditQuestion = () =>
        setEditFormData(prev => ({ ...prev, quiz: [...prev.quiz, emptyQuestion()] }));

    const removeEditQuestion = (qi) =>
        setEditFormData(prev => ({ ...prev, quiz: prev.quiz.filter((_, i) => i !== qi) }));

    const executeEditSubmit = async () => {
        setEditLoading(true);
        try {
            const result = await dailyBlogService.updateBlog(editingBlog.id, editFormData);
            const updated = result?.data; // server returns the actual saved document
            // Update the table row with the server's real response — not just local form state
            setBlogs(prev => prev.map(b =>
                b.id === editingBlog.id ? (updated ?? { ...b, ...editFormData }) : b
            ));
            setIsEditModalOpen(false);
            setEditingBlog(null);
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to update blog: ${msg}`);
        } finally {
            setEditLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Finalize Blog Edit',
            message: 'Are you sure you want to commit these changes to the server?',
            onConfirm: executeEditSubmit
        });
    };

    // ── Delete Handler ────────────────────────────────
    const executeDelete = async (blog) => {
        try {
            await dailyBlogService.deleteBlog(blog.id);
            setBlogs(prev => prev.filter(b => b.id !== blog.id));
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to delete blog: ${msg}`);
        } finally {
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleDelete = (blog) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Delete Blog Post',
            message: `Are you sure you want to delete "${blog.title}"? This cannot be undone.`,
            onConfirm: () => executeDelete(blog)
        });
    };

    const executeSubmit = async () => {
        setLoading(true);
        try {
            const result = await dailyBlogService.addBlog(formData);
            const newBlog = result?.data; // API returns the created document
            // Optimistically prepend new blog so it shows instantly
            if (newBlog) setBlogs(prev => [newBlog, ...prev]);
            setIsAddModalOpen(false);
            setFormData({ id: '', title: '', date: '', date_sort: '', created_at: '', updated_at: '', content: '', quiz: [emptyQuestion()] });
            // Refresh from server to get accurate pagination counts
            fetchBlogs(page, limit);
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to add blog: ${msg}`);
        } finally {
            setLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const executeImport = async (parsedData) => {
        setLoading(true);
        try {
            const result = await dailyBlogService.addBlog(parsedData);
            const newBlog = result?.data;
            if (newBlog) setBlogs(prev => [newBlog, ...prev]);
            setIsImportModalOpen(false);
            setImportJson('');
            fetchBlogs(page, limit);
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to import blog: ${msg}`);
        } finally {
            setLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        try {
            const parsedData = JSON.parse(importJson);
            setConfirmConfig({
                isOpen: true,
                type: 'success',
                title: 'Import Blog Post',
                message: 'Are you sure you want to import this JSON data?',
                onConfirm: () => executeImport(parsedData)
            });
        } catch (error) {
            alert("Invalid JSON format. Please check your data.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'success',
            title: 'Create Blog Post',
            message: 'Is this final? The blog will be published to the network.',
            onConfirm: executeSubmit
        });
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

    // ── Filtered view (client-side search on current page) ───────
    const filteredBlogs = blogs.filter(b =>
        b.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (str) => {
        if (!str) return '—';
        try { return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch { return str; }
    };

    // Page number buttons
    const pageNumbers = () => {
        const total = pagination.total_pages;
        const current = pagination.page;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const pages = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
        return [...pages].sort((a, b) => a - b);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">Daily Intels</h1>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium italic">
                            Manage security research and tactical briefings.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchBlogs(page, limit)}
                        disabled={loading}
                        className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 disabled:opacity-50"
                        title="Refresh Intel"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all font-bold shadow-sm active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                        <FileText className="w-4 h-4" />
                        Import Intel
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl transition-all font-bold shadow-xl active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize Intel
                    </button>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Published Intels', value: blogs.length, icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Research Depth', value: '7,402 KB', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Active Signals', value: blogs.filter(b => b.status === 'published').length, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.02] duration-300">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xl font-black text-zinc-900 dark:text-white leading-tight">{stat.value}</p>
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Table Card ────────────────────────────────────────── */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-500">

                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search intelligence..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-bold uppercase tracking-widest hidden sm:block">Per page</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-lg gap-1">
                            {[10, 20, 50].map(l => (
                                <button
                                    key={l}
                                    onClick={() => handleLimitChange(l)}
                                    className={`px-3 py-1.5 rounded-md font-black transition-all ${limit === l
                                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'hover:text-zinc-800 dark:hover:text-zinc-200'
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
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-12 text-center">RID</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Intel Blueprint</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-32">Status</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-40 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <BookOpen className="w-10 h-10 text-indigo-500" />
                                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">No intel found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog, idx) => (
                                    <tr key={blog.id || idx} className="group hover:bg-indigo-500/[0.02] transition-colors border-b border-zinc-100 dark:border-zinc-800/50">
                                        <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400 text-center">{idx + 1}</td>
                                        <td className="px-6 py-2.5">
                                            <div className="flex items-center gap-3">
                                                <div className="hidden md:block w-12 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                                                    {blog.imageUrl ? <img src={blog.imageUrl} className="w-full h-full object-cover opacity-80" alt="" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-zinc-400">NO_IMG</div>}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-zinc-900 dark:text-white text-[13px] tracking-tight truncate">{blog.title}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium truncate uppercase tracking-widest">{blog.category || 'general_intel'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => openView(blog)} className="p-2 hover:bg-indigo-500/10 text-indigo-500 rounded-lg transition-all" title="View"><Eye className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => openEdit(blog)} className="p-2 hover:bg-amber-500/10 text-amber-500 rounded-lg transition-all" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(blog)} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && pagination.total_pages > 0 && (
                    <div className="px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-950/20">
                        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-tight">
                            Displaying <span className="text-zinc-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> — <span className="text-zinc-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                            <span className="mx-2 opacity-30">|</span>
                            Total Nodes: <span className="text-indigo-600 dark:text-indigo-400">{pagination.total}</span>
                        </p>

                        {/* Page buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(1)}
                                disabled={pagination.page <= 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                <ChevronsLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => goToPage(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-1 mx-1">
                                {pageNumbers().map((p, i, arr) => (
                                    <React.Fragment key={p}>
                                        {i > 0 && arr[i - 1] !== p - 1 && (
                                            <span className="w-4 text-center text-zinc-400 text-[10px] font-black">...</span>
                                        )}
                                        <button
                                            onClick={() => goToPage(p)}
                                            className={`w-7 h-7 rounded-lg text-[10px] font-black transition-all ${pagination.page === p
                                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg scale-110'
                                                : 'text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    </React.Fragment>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.total_pages}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => goToPage(pagination.total_pages)}
                                disabled={pagination.page >= pagination.total_pages}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-white dark:hover:bg-zinc-800 disabled:opacity-20 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                            >
                                <ChevronsRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hidden sm:block">Jump to node</span>
                            <input
                                type="number"
                                min={1}
                                max={pagination.total_pages}
                                defaultValue={pagination.page}
                                onKeyDown={e => e.key === 'Enter' && goToPage(Number(e.target.value))}
                                className="w-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg py-1 text-[10px] text-center font-black focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Detail Modal ───────────────────────────────────────── */}
            {isDetailOpen && selectedBlog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 flex-shrink-0 bg-zinc-50 dark:bg-zinc-950/50">
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5">Tactical Intelligence Briefing</p>
                                <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100 uppercase italic leading-tight">{selectedBlog.title}</h2>
                                <p className="text-[10px] text-zinc-500 mt-1 font-mono font-bold uppercase">{formatDate(selectedBlog.created_at)}</p>
                            </div>
                            <button onClick={() => { setIsDetailOpen(false); setSelectedBlog(null); }} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex-shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto p-6 space-y-6">
                            {/* Content */}
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Content</p>
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                                    <p className="text-base text-zinc-700 dark:text-zinc-300 leading-loose whitespace-pre-line">
                                        {selectedBlog.content}
                                    </p>
                                </div>
                            </div>

                            {/* Quiz */}
                            {selectedBlog.quiz?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                                        Quiz — {selectedBlog.quiz.length} Questions
                                    </p>
                                    <div className="space-y-4">
                                        {selectedBlog.quiz.map((q, qi) => (
                                            <div key={qi} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
                                                <div className="px-5 py-4 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                                                    <p className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                                                        <span className="text-xs font-black text-green-500 mr-2">Q{qi + 1}</span>
                                                        {q.question}
                                                    </p>
                                                </div>
                                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {q.options.map((opt, oi) => (
                                                        <div
                                                            key={oi}
                                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${oi === q.correctAnswerIndex
                                                                ? 'bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400'
                                                                : 'bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                                                                }`}
                                                        >
                                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${oi === q.correctAnswerIndex ? 'bg-green-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                                                {['A', 'B', 'C', 'D'][oi]}
                                                            </span>
                                                            {opt}
                                                            {oi === q.correctAnswerIndex && (
                                                                <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            {/* ── Edit Blog Modal ─────────────────────────────────────── */}
            {
                isEditModalOpen && editingBlog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="p-7 bg-amber-500/5 border-b border-amber-500/20 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Pencil className="w-4 h-4 text-amber-500" />
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Editing Blog</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-1">{editingBlog.title}</h2>
                                </div>
                                <button onClick={() => { setIsEditModalOpen(false); setEditingBlog(null); }}
                                    className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 flex-shrink-0">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="overflow-y-auto p-7 space-y-5">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">ID (optional MongoDB _id)</label>
                                    <input
                                        type="text" name="id" value={editFormData.id} onChange={handleEditField}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm font-mono text-amber-600"
                                        placeholder="e.g. 507f1f77bcf86cd799439011"
                                    />
                                </div>

                                {/* Title */}
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Title *</label>
                                    <input
                                        type="text" name="title" required value={editFormData.title} onChange={handleEditField}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Date</label>
                                        <input
                                            type="text" name="date" value={editFormData.date} onChange={handleEditField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm"
                                            placeholder="e.g. 10 SEP 2026"
                                        />
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Date Sort</label>
                                        <input
                                            type="text" name="date_sort" value={editFormData.date_sort} onChange={handleEditField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm"
                                            placeholder="e.g. 2026-09-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Created At</label>
                                        <input
                                            type="text" name="created_at" value={editFormData.created_at} onChange={handleEditField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm font-mono"
                                            placeholder="e.g. 2026-04-30T00:00:00.000Z"
                                        />
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Updated At</label>
                                        <input
                                            type="text" name="updated_at" value={editFormData.updated_at} onChange={handleEditField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm font-mono"
                                            placeholder="e.g. 2026-04-30T00:00:00.000Z"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Content *</label>
                                    <textarea
                                        name="content" required value={editFormData.content} onChange={handleEditField} rows={6}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all resize-none text-sm"
                                    />
                                </div>

                                {/* Quiz Builder */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-zinc-500 ml-1 uppercase tracking-widest flex items-center gap-2">
                                            <HelpCircle className="w-4 h-4" />
                                            Quiz ({editFormData.quiz.length} questions)
                                        </p>
                                        <button type="button" onClick={addEditQuestion}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-widest border border-amber-500/20">
                                            <Plus className="w-3 h-3" /> Add Q
                                        </button>
                                    </div>

                                    {editFormData.quiz.map((q, qi) => (
                                        <div key={qi} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Question {qi + 1}</span>
                                                {editFormData.quiz.length > 1 && (
                                                    <button type="button" onClick={() => removeEditQuestion(qi)}
                                                        className="p-1 hover:bg-rose-500/10 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="text" required value={q.question}
                                                onChange={e => handleEditQuizField(qi, 'question', e.target.value)}
                                                placeholder="Question text..."
                                                className="w-full text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:border-amber-500 outline-none transition-all"
                                            />
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Options — radio = correct answer</p>
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${q.correctAnswerIndex === oi ? 'border-amber-500/30 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                                        <input type="radio" name={`edit_correct_${qi}`}
                                                            checked={q.correctAnswerIndex === oi}
                                                            onChange={() => handleEditQuizField(qi, 'correctAnswerIndex', oi)}
                                                            className="accent-amber-500 w-4 h-4 flex-shrink-0" />
                                                        <span className="text-[10px] font-bold text-zinc-400 w-4">{['A', 'B', 'C', 'D'][oi]}</span>
                                                        <input type="text" required value={opt}
                                                            onChange={e => handleEditOptionChange(qi, oi, e.target.value)}
                                                            placeholder={`Option ${['A', 'B', 'C', 'D'][oi]}`}
                                                            className="flex-1 text-xs bg-transparent outline-none text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-700" />
                                                        {q.correctAnswerIndex === oi && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2">
                                    <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingBlog(null); }}
                                        className="px-5 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm uppercase tracking-widest">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={editLoading}
                                        className="flex-1 px-5 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-white">
                                        <Save className="w-4 h-4" />
                                        {editLoading ? 'Saving...' : 'Update Blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* ── Add Blog Modal ─────────────────────────────────────── */}
            {
                isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                            <div className="p-7 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold">New Daily Blog</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Add to the daily_blog collection.</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="overflow-y-auto p-7 space-y-5">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">ID (optional MongoDB _id)</label>
                                    <input
                                        type="text" name="id" value={formData.id} onChange={handleField}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all text-sm font-mono text-green-600"
                                        placeholder="e.g. 507f1f77bcf86cd799439011"
                                    />
                                </div>

                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Title *</label>
                                    <input
                                        type="text" name="title" required value={formData.title} onChange={handleField}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-sm"
                                        placeholder="Proxychains: Anonymous Network Communication..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Date</label>
                                        <input
                                            type="text" name="date" value={formData.date} onChange={handleField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-sm"
                                            placeholder="e.g. 10 SEP 2026"
                                        />
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Date Sort</label>
                                        <input
                                            type="text" name="date_sort" value={formData.date_sort} onChange={handleField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-sm"
                                            placeholder="e.g. 2026-09-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Created At</label>
                                        <input
                                            type="text" name="created_at" value={formData.created_at} onChange={handleField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all text-sm font-mono"
                                            placeholder="e.g. 2026-04-30T00:00:00.000Z"
                                        />
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Updated At</label>
                                        <input
                                            type="text" name="updated_at" value={formData.updated_at} onChange={handleField}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all text-sm font-mono"
                                            placeholder="e.g. 2026-04-30T00:00:00.000Z"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Content *</label>
                                    <textarea
                                        name="content" required value={formData.content} onChange={handleField} rows={6}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all resize-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-sm"
                                        placeholder="Full blog content goes here..."
                                    />
                                </div>

                                {/* Quiz Builder */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-zinc-500 ml-1 uppercase tracking-widest flex items-center gap-2">
                                            <HelpCircle className="w-4 h-4" />
                                            Quiz ({formData.quiz.length} questions)
                                        </p>
                                        <button
                                            type="button" onClick={addQuestion}
                                            className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-400 hover:bg-green-500/10 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-widest border border-green-500/20"
                                        >
                                            <Plus className="w-3 h-3" /> Add Q
                                        </button>
                                    </div>

                                    {formData.quiz.map((q, qi) => (
                                        <div key={qi} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Question {qi + 1}</span>
                                                {formData.quiz.length > 1 && (
                                                    <button type="button" onClick={() => removeQuestion(qi)} className="p-1 hover:bg-rose-500/10 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="text" required value={q.question}
                                                onChange={e => handleQuizField(qi, 'question', e.target.value)}
                                                placeholder="What is Proxychains used for?"
                                                className="w-full text-xs bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 focus:border-green-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                            />
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Options — radio = correct answer</p>
                                                {q.options.map((opt, oi) => (
                                                    <div key={oi} className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${q.correctAnswerIndex === oi ? 'border-green-500/30 bg-green-500/5' : 'border-zinc-200 dark:border-zinc-800'}`}>
                                                        <input
                                                            type="radio" name={`correct_${qi}`}
                                                            checked={q.correctAnswerIndex === oi}
                                                            onChange={() => handleQuizField(qi, 'correctAnswerIndex', oi)}
                                                            className="accent-green-500 w-4 h-4 flex-shrink-0"
                                                        />
                                                        <span className="text-[10px] font-bold text-zinc-400 w-4">{['A', 'B', 'C', 'D'][oi]}</span>
                                                        <input
                                                            type="text" required value={opt}
                                                            onChange={e => handleOptionChange(qi, oi, e.target.value)}
                                                            placeholder={`Option ${['A', 'B', 'C', 'D'][oi]}`}
                                                            className="flex-1 text-xs bg-transparent outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-zinc-800 dark:text-zinc-200"
                                                        />
                                                        {q.correctAnswerIndex === oi && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button type="button" onClick={() => setIsAddModalOpen(false)}
                                        className="px-5 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm uppercase tracking-widest">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading}
                                        className="flex-1 px-5 py-3.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-white">
                                        <Save className="w-4 h-4" />
                                        {loading ? 'Saving...' : 'Save Blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* ── Import Blog Modal ─────────────────────────────────────── */}
            {
                isImportModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                            <div className="p-7 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
                                <div>
                                    <h2 className="text-xl font-bold">Import JSON Data</h2>
                                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Paste direct JSON object.</p>
                                </div>
                                <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleImportSubmit} className="overflow-y-auto p-7 space-y-5">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">JSON Content *</label>
                                    <textarea
                                        name="importJson" required value={importJson} onChange={e => setImportJson(e.target.value)} rows={15}
                                        className="w-full bg-slate-900 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none transition-all resize-none text-green-400 font-mono text-sm focus:ring-2 focus:ring-indigo-500/50"
                                        placeholder={'{\n  "title": "...",\n  "content": "...",\n  "quiz": [\n    {\n      "question": "...",\n      "options": ["A", "B", "C", "D"],\n      "correctAnswerIndex": 0\n    }\n  ]\n}'}
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button type="button" onClick={() => setIsImportModalOpen(false)}
                                        className="px-5 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-bold text-sm uppercase tracking-widest">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading}
                                        className="flex-1 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-white">
                                        <Save className="w-4 h-4" />
                                        {loading ? 'Importing...' : 'Import Blog'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

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

export default DailyBlogs;
