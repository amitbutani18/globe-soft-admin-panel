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
    Pencil
} from 'lucide-react';
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
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [editFormData, setEditFormData] = useState({ title: '', content: '', quiz: [emptyQuestion()] });
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

    // Form state — API only accepts: title, content, quiz
    const [formData, setFormData] = useState({
        title: '',
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
            title: blog.title || '',
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

    const handleEditSubmit = async (e) => {
        e.preventDefault();
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
        }
    };

    // ── Delete Handler ────────────────────────────────
    const handleDelete = async (blog) => {
        if (!window.confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
        try {
            await dailyBlogService.deleteBlog(blog.id);
            setBlogs(prev => prev.filter(b => b.id !== blog.id));
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to delete blog: ${msg}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await dailyBlogService.addBlog(formData);
            const newBlog = result?.data; // API returns the created document
            // Optimistically prepend new blog so it shows instantly
            if (newBlog) setBlogs(prev => [newBlog, ...prev]);
            setIsAddModalOpen(false);
            setFormData({ title: '', content: '', quiz: [emptyQuestion()] });
            // Refresh from server to get accurate pagination counts
            fetchBlogs(page, limit);
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to add blog: ${msg}`);
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
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Daily Blogs</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage daily blog posts for Kali Linux.
                        {pagination.total > 0 && (
                            <span className="ml-2 text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                {pagination.total} total
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchBlogs(page, limit)}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all font-semibold text-sm text-zinc-600 dark:text-zinc-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl transition-all font-semibold shadow-lg shadow-green-500/20 active:scale-95 text-sm text-white"
                    >
                        <Plus className="w-5 h-5" />
                        Add Blog
                    </button>
                </div>
            </div>

            {/* ── Stats ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Blogs', value: pagination.total || blogs.length, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'With Quizzes', value: blogs.filter(b => b.quiz?.length > 0).length, icon: HelpCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Total Pages', value: pagination.total_pages || 1, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4 transition-colors duration-300">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{stat.label}</p>
                        </div>
                    </div>
                ))}
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
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-green-500/50 focus:outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
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
                                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
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
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Title</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-32">Date</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] w-24 text-center">Quiz</th>
                                <th className="px-5 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right w-36">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredBlogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <BookOpen className="w-10 h-10 text-green-500" />
                                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">No blogs found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBlogs.map((blog, idx) => {
                                    const row = (pagination.page - 1) * pagination.limit + idx + 1;
                                    return (
                                        <tr key={blog.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                                            {/* Row # */}
                                            <td className="px-5 py-4 font-mono text-xs text-zinc-400 dark:text-zinc-600 w-10">{row}</td>

                                            {/* Title + content snippet */}
                                            <td className="px-5 py-4">
                                                <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm leading-snug mb-1">
                                                    {blog.title}
                                                </p>
                                                <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed line-clamp-2 max-w-2xl">
                                                    {blog.content}
                                                </p>
                                            </td>

                                            {/* Date */}
                                            <td className="px-5 py-4 w-32">
                                                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono whitespace-nowrap">
                                                    <Calendar className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                                                    {formatDate(blog.created_at)}
                                                </div>
                                            </td>

                                            {/* Quiz count */}
                                            <td className="px-5 py-4 w-24 text-center">
                                                {blog.quiz?.length > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-tight">
                                                        <HelpCircle className="w-3 h-3" />
                                                        {blog.quiz.length} Qs
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-zinc-400 font-bold uppercase">—</span>
                                                )}
                                            </td>

                                            {/* Actions: View + Edit + Delete */}
                                            <td className="px-5 py-4 text-right w-52">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => openView(blog)}
                                                        disabled={viewLoading === blog.id}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-400 hover:bg-green-500/10 px-3 py-1.5 rounded-lg transition-colors border border-green-500/20 uppercase tracking-widest disabled:opacity-50"
                                                    >
                                                        {viewLoading === blog.id
                                                            ? <RefreshCw className="w-3 h-3 animate-spin" />
                                                            : <Eye className="w-3 h-3" />}
                                                        {viewLoading === blog.id ? 'Loading...' : 'View'}
                                                    </button>
                                                    <button
                                                        onClick={() => openEdit(blog)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors border border-amber-500/20 uppercase tracking-widest"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(blog)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors border border-rose-500/20 uppercase tracking-widest"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete
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
                        <p className="text-xs text-zinc-500 font-medium">
                            Showing{' '}
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">
                                {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}
                            </span>{' '}
                            of <span className="font-bold text-zinc-700 dark:text-zinc-300">{pagination.total}</span> blogs
                        </p>

                        {/* Page buttons */}
                        <div className="flex items-center gap-1">
                            {/* First */}
                            <button
                                onClick={() => goToPage(1)}
                                disabled={pagination.page <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>
                            {/* Prev */}
                            <button
                                onClick={() => goToPage(pagination.page - 1)}
                                disabled={pagination.page <= 1}
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
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${pagination.page === p
                                            ? 'bg-green-600 text-white shadow shadow-green-500/20'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                </React.Fragment>
                            ))}

                            {/* Next */}
                            <button
                                onClick={() => goToPage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.total_pages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {/* Last */}
                            <button
                                onClick={() => goToPage(pagination.total_pages)}
                                disabled={pagination.page >= pagination.total_pages}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Page jump */}
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span className="font-medium hidden sm:block">Go to page</span>
                            <input
                                type="number"
                                min={1}
                                max={pagination.total_pages}
                                defaultValue={pagination.page}
                                key={pagination.page}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') goToPage(Number(e.target.value));
                                }}
                                className="w-14 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-center font-bold focus:border-green-500/50 focus:outline-none transition-all text-zinc-700 dark:text-zinc-300"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Detail Modal ───────────────────────────────────────── */}
            {isDetailOpen && selectedBlog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="p-7 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-4 flex-shrink-0 bg-zinc-50 dark:bg-zinc-950/50">
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">Blog Detail</p>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-snug">{selectedBlog.title}</h2>
                                <p className="text-sm text-zinc-500 mt-1.5 font-mono">{formatDate(selectedBlog.created_at)}</p>
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
            )}

            {/* ── Edit Blog Modal ─────────────────────────────────────── */}
            {isEditModalOpen && editingBlog && (
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
                            {/* Title */}
                            <div className="space-y-2 text-xs">
                                <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Title *</label>
                                <input
                                    type="text" name="title" required value={editFormData.title} onChange={handleEditField}
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-sm"
                                />
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
            )}

            {/* ── Add Blog Modal ─────────────────────────────────────── */}
            {isAddModalOpen && (
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
                                <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Title *</label>
                                <input
                                    type="text" name="title" required value={formData.title} onChange={handleField}
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-green-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-sm"
                                    placeholder="Proxychains: Anonymous Network Communication..."
                                />
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
            )}
        </div>
    );
};

export default DailyBlogs;
