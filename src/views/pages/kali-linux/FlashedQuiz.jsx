import React, { useState, useEffect } from 'react';
import {
    Zap,
    Search,
    Plus,
    RefreshCw,
    Edit2,
    Trash2,
    Eye,
    X,
    Save,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    CheckCircle2,
    ListFilter,
    Activity,
    FolderOpen
} from 'lucide-react';
import flashedQuizService from '../../../models/flashedQuizService';
import topicService from '../../../models/topicService';

const LIMIT_OPTIONS = [5, 10, 20, 50];

const FlashedQuiz = () => {
    // State
    const [quizzes, setQuizzes] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [editingQuiz, setEditingQuiz] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        topicId: '',
        question: '',
        options: ['', '', '', ''],
        answer: 0,
        order: 1
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        topicId: '',
        question: '',
        options: ['', '', '', ''],
        answer: 0,
        order: 1
    });

    const [formLoading, setFormLoading] = useState(false);

    // Fetch Initial Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [quizRes, topicRes] = await Promise.all([
                flashedQuizService.getQuizzes(),
                topicService.getTopics()
            ]);
            setQuizzes(quizRes.data || []);
            setTopics(topicRes.topics || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // CRUD Handlers
    const handleAddField = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('option_')) {
            const index = parseInt(name.split('_')[1]);
            const newOptions = [...formData.options];
            newOptions[index] = value;
            setFormData(prev => ({ ...prev, options: newOptions }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleEditField = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('option_')) {
            const index = parseInt(name.split('_')[1]);
            const newOptions = [...editFormData.options];
            newOptions[index] = value;
            setEditFormData(prev => ({ ...prev, options: newOptions }));
        } else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await flashedQuizService.createQuiz(formData);
            setIsAddModalOpen(false);
            setFormData({ topicId: '', question: '', options: ['', '', '', ''], answer: 0, order: 1 });
            fetchData();
        } catch (error) {
            alert(`Failed to add quiz: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            // Refined payload based on production CURL
            const payload = {
                question: editFormData.question,
                options: editFormData.options,
            };

            // Add optional fields if they exist in the state and were previously supported
            if (editFormData.topicId) payload.topicId = editFormData.topicId;
            if (editFormData.answer !== undefined) payload.answer = editFormData.answer;
            if (editFormData.order !== undefined) payload.order = parseInt(editFormData.order);

            await flashedQuizService.updateQuiz(editingQuiz.id, payload);
            setIsEditModalOpen(false);
            setEditingQuiz(null);
            fetchData();
        } catch (error) {
            alert(`Failed to update quiz: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (quiz) => {
        if (!window.confirm(`Delete quiz: "${quiz.question.substring(0, 30)}..."?`)) return;
        try {
            await flashedQuizService.deleteQuiz(quiz.id);
            setQuizzes(prev => prev.filter(q => q.id !== quiz.id));
        } catch (error) {
            alert(`Failed to delete: ${error.message}`);
        }
    };

    // Modal Triggers
    const openView = (quiz) => {
        setSelectedQuiz(quiz);
        setIsViewModalOpen(true);
    };

    const openEdit = (quiz) => {
        setEditingQuiz(quiz);
        setEditFormData({
            id: quiz.id,
            topicId: quiz.topicId || '',
            question: quiz.question || '',
            options: Array.isArray(quiz.options) ? quiz.options : ['', '', '', ''],
            answer: quiz.answer !== undefined ? quiz.answer : 0,
            order: quiz.order || 1
        });
        setIsEditModalOpen(true);
    };

    // Filtering & Pagination
    const filteredQuizzes = quizzes.filter(q =>
        q.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topicId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const total = filteredQuizzes.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedQuizzes = filteredQuizzes.slice((page - 1) * limit, page * limit);

    const goToPage = (p) => {
        setPage(Math.max(1, Math.min(p, totalPages)));
    };

    const pageNumbers = () => {
        const nums = [];
        for (let i = 1; i <= totalPages; i++) nums.push(i);
        return nums;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20 flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <Zap className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase italic">Flashed Quiz</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg font-medium">
                            Configure rapid-fire training nodes for the Kali Linux knowledge engine.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all text-zinc-600 dark:text-zinc-400 disabled:opacity-50"
                        title="Resync Data"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl transition-all font-bold shadow-2xl active:scale-95 text-[11px] uppercase tracking-[0.2em]"
                    >
                        <Plus className="w-4 h-4" />
                        Assemble Quiz
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Deployed Quizzes', value: total, icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Parent Topics', value: topics.length, icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'System Accuracy', value: '99.8%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 flex items-center gap-5 transition-all hover:scale-[1.02] duration-300">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">{stat.value}</p>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500">
                <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search quiz nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-500 uppercase tracking-widest hidden lg:block">Matrix Density</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-2xl gap-1">
                            {LIMIT_OPTIONS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => { setLimit(l); setPage(1); }}
                                    className={`px-4 py-2 rounded-xl font-black transition-all ${limit === l
                                        ? 'bg-white dark:bg-zinc-800 text-amber-600 dark:text-amber-400 shadow-md scale-105'
                                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-12">UID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Question / Topic</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-40">Correct Answer</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-48 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Syncing Quiz Matrix...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedQuizzes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-40">
                                            <div className="w-20 h-20 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                <HelpCircle className="w-10 h-10 text-zinc-400" />
                                            </div>
                                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest leading-loose max-w-xs">
                                                No quiz nodes detected. Initialize the first training sequence.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedQuizzes.map((quiz, idx) => {
                                    const row = (page - 1) * limit + idx + 1;
                                    return (
                                        <tr key={quiz.id || idx} className="group hover:bg-amber-500/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-mono text-[10px] text-zinc-400 group-hover:text-amber-500 transition-colors uppercase">
                                                {row.toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight mb-1 group-hover:translate-x-1 transition-transform line-clamp-1">
                                                        {quiz.question}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
                                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{quiz.topicId || 'Global Registry'}</span>
                                                        <span className="text-zinc-300 dark:text-zinc-700 mx-1">/</span>
                                                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Order: {quiz.order}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                                                        {quiz.answer !== undefined ? `Opt ${String.fromCharCode(65 + quiz.answer)}` : 'Verified'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openView(quiz)} className="p-2.5 hover:bg-amber-500/10 text-amber-500 rounded-xl transition-all" title="View Detail"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => openEdit(quiz)} className="p-2.5 hover:bg-blue-500/10 text-blue-500 rounded-xl transition-all" title="Modify"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(quiz)} className="p-2.5 hover:bg-rose-500/10 text-rose-500 rounded-xl transition-all" title="Terminate"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                {!loading && totalPages > 0 && (
                    <div className="p-8 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="text-zinc-900 dark:text-white">{total}</span> training nodes
                        </p>

                        <div className="flex items-center gap-2">
                            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-1">
                                {pageNumbers().map(p => (
                                    <button
                                        key={p} onClick={() => goToPage(p)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${page === p
                                            ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/10'
                                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedQuiz && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-400 overflow-hidden">
                        <div className="p-10 bg-gradient-to-br from-amber-500/5 to-transparent border-b border-zinc-200 dark:border-zinc-800 relative">
                            <div className="absolute top-10 right-10 flex gap-2">
                                <button onClick={() => setIsViewModalOpen(false)} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all shadow-sm border border-zinc-200 dark:border-zinc-700">
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>
                            <div className="flex items-center gap-5 mb-6">
                                <div className="p-4 bg-amber-500 text-white rounded-[1.5rem] shadow-xl shadow-amber-500/20">
                                    <Zap className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em] mb-1">Testing Hub</p>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-none">Quiz Detail</h2>
                                    <p className="text-xs font-mono text-zinc-400 mt-2">PARENT: {selectedQuiz.topicId}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-6 rounded-3xl">
                                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-3">Quiz Question</p>
                                <p className="text-lg font-bold text-zinc-900 dark:text-white leading-relaxed">{selectedQuiz.question}</p>
                            </div>
                        </div>

                        <div className="p-10 space-y-8">
                            <div>
                                <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                    <ListFilter className="w-4 h-4 text-zinc-400" /> Available Options
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedQuiz.options.map((opt, i) => (
                                        <div key={i} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${selectedQuiz.answer === i ? 'bg-emerald-500/10 border-emerald-500/30 ring-2 ring-emerald-500/5' : 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedQuiz.answer === i ? 'bg-emerald-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <p className={`flex-1 text-sm font-bold ${selectedQuiz.answer === i ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>{opt}</p>
                                            {selectedQuiz.answer === i && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className={`p-8 border-b ${isEditModalOpen ? 'bg-blue-500/5 border-blue-500/20' : 'bg-amber-500/5 border-amber-500/20'} flex items-center justify-between flex-shrink-0`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${isEditModalOpen ? 'bg-blue-600' : 'bg-amber-500'}`}>
                                    {isEditModalOpen ? <Edit2 className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase leading-tight">
                                        {isEditModalOpen ? 'Modify Quiz' : 'Initialize Quiz'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Quiz Registry Node</p>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all"><X className="w-5 h-5 text-zinc-400" /></button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Parent Topic *</label>
                                    <select
                                        name="topicId"
                                        required
                                        value={isEditModalOpen ? editFormData.topicId : formData.topicId}
                                        onChange={isEditModalOpen ? handleEditField : handleAddField}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 transition-all text-sm font-bold"
                                    >
                                        <option value="">Select Topic</option>
                                        {topics.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quiz Order</label>
                                    <input
                                        type="number" name="order" required
                                        value={isEditModalOpen ? editFormData.order : formData.order}
                                        onChange={isEditModalOpen ? handleEditField : handleAddField}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Question Content *</label>
                                <textarea
                                    name="question" required rows={2}
                                    value={isEditModalOpen ? editFormData.question : formData.question}
                                    onChange={isEditModalOpen ? handleEditField : handleAddField}
                                    placeholder="Enter quiz question..."
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-amber-500/50 transition-all resize-none text-sm font-bold"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Answer Options & Key</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {(isEditModalOpen ? editFormData.options : formData.options).map((opt, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text" name={`option_${i}`} required
                                                    value={opt}
                                                    onChange={isEditModalOpen ? handleEditField : handleAddField}
                                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-14 pr-6 py-4 outline-none transition-all text-sm font-medium focus:border-amber-500/50`}
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-black text-[10px] text-zinc-500">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => isEditModalOpen ? setEditFormData(prev => ({ ...prev, answer: i })) : setFormData(prev => ({ ...prev, answer: i }))}
                                                className={`w-14 rounded-2xl flex items-center justify-center transition-all ${(isEditModalOpen ? editFormData.answer : formData.answer) === i
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                                                    : 'bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 text-zinc-300'
                                                    }`}
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4 pb-2">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-8 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Discard</button>
                                <button type="submit" disabled={formLoading}
                                    className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-white ${isEditModalOpen ? 'bg-blue-600 shadow-blue-500/20' : 'bg-amber-600 shadow-amber-500/20'}`}>
                                    {formLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isEditModalOpen ? 'Commit Update' : 'Initialize Quiz'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashedQuiz;
