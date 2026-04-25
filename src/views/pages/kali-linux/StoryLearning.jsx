import React, { useState, useEffect } from 'react';
import {
    BookMarked,
    Search,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    Eye,
    X,
    Save,
    ChevronLeft,
    ChevronRight,
    FileText,
    Globe,
    Activity,
    HelpCircle,
    LayoutGrid,
    CheckCircle2
} from 'lucide-react';
import ConfirmationModal from '../../../components/ConfirmationModal';
import storyLearningService from '../../../models/storyLearningService';
import topicService from '../../../models/topicService';

const LIMIT_OPTIONS = [5, 10, 20, 50];

const StoryLearning = () => {
    // State
    const [stories, setStories] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        type: 'warning',
        title: '',
        message: '',
        onConfirm: null
    });

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStory, setSelectedStory] = useState(null);
    const [editingStory, setEditingStory] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        storyContent: '',
        quiz: [] // Currently initialized as empty, can be expanded later
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        title: '',
        storyContent: '',
        quiz: []
    });

    const [formLoading, setFormLoading] = useState(false);

    // Fetch Initial Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [storyRes, topicRes] = await Promise.all([
                storyLearningService.getStories(),
                topicService.getTopics()
            ]);
            setStories(storyRes.data || []);
            setTopics(topicRes.topics || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Form Handlers
    const handleField = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditField = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const executeSubmit = async () => {
        setFormLoading(true);
        try {
            const res = await storyLearningService.createStory(formData);
            setIsAddModalOpen(false);
            setFormData({ title: '', storyContent: '', quiz: [] });
            fetchData();
            if (res.message) {
                alert(res.message);
            }
        } catch (error) {
            alert(`Failed to add story: ${error.message}`);
        } finally {
            setFormLoading(false);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'success',
            title: 'Confirm Submission',
            message: 'Are you sure you want to create this story narrative?',
            onConfirm: executeSubmit
        });
    };

    const executeEditSubmit = async () => {
        setFormLoading(true);
        try {
            const payload = {
                title: editFormData.title,
                storyContent: editFormData.storyContent,
                quiz: editFormData.quiz
            };
            await storyLearningService.updateStory(editingStory.id, payload);
            setIsEditModalOpen(false);
            setEditingStory(null);
            fetchData();
        } catch (error) {
            alert(`Failed to update story: ${error.message}`);
        } finally {
            setFormLoading(false);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Confirm Changes',
            message: 'Are you sure you want to update this story narrative?',
            onConfirm: executeEditSubmit
        });
    };

    const executeDelete = async (story) => {
        try {
            const res = await storyLearningService.deleteStory(story.id);
            setStories(prev => prev.filter(s => s.id !== story.id));
            if (res.message) {
                alert(res.message);
            }
        } catch (error) {
            alert(`Failed to delete: ${error.message}`);
        } finally {
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleDelete = (story) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Terminate Story',
            message: `Are you sure you want to delete "${story.title}"? This action cannot be undone.`,
            onConfirm: () => executeDelete(story)
        });
    };

    // Modal Triggers
    const openView = (story) => {
        setSelectedStory(story);
        setIsViewModalOpen(true);
    };

    const openEdit = (story) => {
        setEditingStory(story);
        setEditFormData({
            id: story.id,
            title: story.title || '',
            storyContent: story.storyContent || '',
            quiz: story.quiz || []
        });
        setIsEditModalOpen(true);
    };

    // Filtering & Pagination
    const filteredStories = stories.filter(s =>
        s.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const total = filteredStories.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedStories = filteredStories.slice((page - 1) * limit, page * limit);

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
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-rose-500 to-pink-600 shadow-xl shadow-rose-500/20 flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <BookMarked className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase italic text-shadow-sm">Story Learning</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg font-medium">
                            Manage interactive story-driven training pathways for Kali Linux.
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
                        Draft New Story
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Published Stories', value: total, icon: LayoutGrid, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                    { label: 'Interactive Quizzes', value: stories.reduce((acc, s) => acc + (s.quiz?.length || 0), 0), icon: HelpCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Production Flow', value: 'Live', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
                            placeholder="Search stories by title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-rose-500/50 focus:ring-4 focus:ring-rose-500/5 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-500 uppercase tracking-widest hidden lg:block text-[10px]">Matrix Density</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-2xl gap-1">
                            {LIMIT_OPTIONS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => { setLimit(l); setPage(1); }}
                                    className={`px-4 py-2 rounded-xl font-black transition-all ${limit === l
                                        ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-md scale-105'
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
                    <table className="w-full text-left border-collapse font-sans">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-12 text-center italic">UID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Story Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-48 text-center italic">Interactive Nodes</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-48 text-right italic text-shadow-sm">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-700">
                                            <RefreshCw className="w-10 h-10 text-rose-500 animate-spin" />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Syncing Story Matrix...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedStories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-40">
                                            <div className="w-20 h-20 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shadow-inner">
                                                <BookMarked className="w-10 h-10 text-zinc-400" />
                                            </div>
                                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest leading-loose max-w-xs transition-all decoration-rose-500/30 underline offset-8 decoration-2">
                                                No story nodes identified. Craft your first lesson to begin.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedStories.map((story, idx) => {
                                    const row = (page - 1) * limit + idx + 1;
                                    return (
                                        <tr key={story.id || idx} className="group hover:bg-rose-500/[0.03] transition-colors border-l-[3px] border-transparent hover:border-rose-500 duration-300">
                                            <td className="px-8 py-6 font-mono text-[10px] text-zinc-400 group-hover:text-rose-500 transition-colors uppercase text-center font-black italic">
                                                {row.toString().padStart(2, '0')}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-all shadow-inner group-hover:scale-110 duration-300">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight mb-0.5 group-hover:translate-x-1 transition-transform">{story.title}</p>
                                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium line-clamp-1 italic max-w-md">{story.storyContent?.substring(0, 80) || 'No narrative data provided.'}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                                    <HelpCircle className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                                        {story.quiz?.length || 0} Questions
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                    <button onClick={() => openView(story)} className="p-3 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all hover:shadow-lg hover:shadow-rose-500/10 border border-transparent hover:border-rose-500/20" title="Inspect Narrative"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => openEdit(story)} className="p-3 hover:bg-blue-500/10 text-blue-500 rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-500/10 border border-transparent hover:border-blue-500/20" title="Manifest Rewrite"><Pencil className="w-4 h-4" /></button>
                                                    <button onClick={() => handleDelete(story)} className="p-3 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all hover:shadow-lg hover:shadow-rose-500/10 border border-transparent hover:border-rose-500/20" title="Terminate Node"><Trash2 className="w-4 h-4" /></button>
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
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                            Displaying <span className="text-zinc-900 dark:text-white text-shadow-sm font-black">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="text-zinc-900 dark:text-white font-black">{total}</span> story nodes
                        </p>

                        <div className="flex items-center gap-3">
                            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-md group active:scale-95">
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <div className="flex gap-1.5 px-2 py-1 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-2xl">
                                {pageNumbers().map(p => (
                                    <button
                                        key={p} onClick={() => goToPage(p)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all duration-300 ${page === p
                                            ? 'bg-rose-600 text-white shadow-xl shadow-rose-500/40 ring-4 ring-rose-500/10 scale-110'
                                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-md group active:scale-95">
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedStory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3.5rem] w-full max-w-4xl shadow-3xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-12 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent border-b border-zinc-200 dark:border-zinc-800 relative flex-shrink-0">
                            <div className="absolute top-10 right-10 flex gap-2">
                                <button onClick={() => setIsViewModalOpen(false)} className="p-4 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all shadow-2xl border border-zinc-200 dark:border-zinc-700 active:scale-90 group">
                                    <X className="w-6 h-6 text-zinc-500 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                            <div className="flex items-center gap-8 mb-8">
                                <div className="p-5 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-[2rem] shadow-2xl shadow-rose-500/40 animate-pulse-slow">
                                    <BookMarked className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.5em] mb-2 italic">Story Objective</p>
                                    <h2 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight italic">{selectedStory.title}</h2>
                                    <p className="text-[10px] font-mono text-zinc-400 mt-3 uppercase tracking-widest font-black opacity-60 italic">Node Hash: {selectedStory.id}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-white/40 dark:border-zinc-800 p-6 rounded-[2rem] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Questions Indexed</p>
                                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{selectedStory.quiz?.length || 0}</p>
                                    </div>
                                </div>
                                <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-white/40 dark:border-zinc-800 p-6 rounded-[2rem] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Last Update</p>
                                        <p className="text-xs font-black text-zinc-900 dark:text-white italic uppercase tracking-wider">{new Date(selectedStory.updatedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
                            {/* Narrative Section */}
                            <section>
                                <p className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 italic">
                                    <div className="w-8 h-[1px] bg-rose-500/30"></div>
                                    Story Narrative
                                </p>
                                <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-inner">
                                    <p className="text-zinc-700 dark:text-zinc-300 leading-[2.2] text-lg font-medium whitespace-pre-wrap selection:bg-rose-500/20 italic">
                                        {selectedStory.storyContent}
                                    </p>
                                </div>
                            </section>

                            {/* Quiz Nodes Section */}
                            {selectedStory.quiz && selectedStory.quiz.length > 0 && (
                                <section>
                                    <p className="text-[12px] font-black text-blue-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 italic">
                                        <div className="w-8 h-[1px] bg-blue-500/30"></div>
                                        Assessment Nodes
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {selectedStory.quiz.map((q, qIdx) => (
                                            <div key={qIdx} className="bg-white dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 group hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
                                                <div className="flex items-center gap-3 mb-5">
                                                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px] font-black text-blue-600 italic">Q{qIdx + 1}</span>
                                                    <p className="font-black text-zinc-900 dark:text-white leading-tight">{q.question}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    {q.options.map((opt, optIdx) => (
                                                        <div key={optIdx} className={`px-4 py-2.5 rounded-xl text-[11px] font-bold border flex items-center justify-between transition-all ${opt === q.rightAnswer
                                                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 shadow-sm'
                                                            : 'bg-zinc-50 dark:bg-zinc-900 border-transparent text-zinc-500 opacity-60'}`}>
                                                            {opt}
                                                            {opt === q.rightAnswer && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 duration-400 max-h-[90vh] flex flex-col overflow-hidden">
                        <div className={`p-10 border-b flex items-center justify-between flex-shrink-0 ${isEditModalOpen ? 'bg-blue-500/5 border-blue-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl ${isEditModalOpen ? 'bg-blue-600 shadow-blue-500/30' : 'bg-rose-600 shadow-rose-500/30'}`}>
                                    {isEditModalOpen ? <Pencil className="w-6 h-6 animate-pulse-slow" /> : <Plus className="w-7 h-7" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">Story Configuration</p>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase leading-none tracking-tight">
                                        {isEditModalOpen ? 'Rewrite Narrative' : 'Initialize Narrative'}
                                    </h2>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all active:scale-90"><X className="w-6 h-6 text-zinc-400" /></button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                            <div className="space-y-3 px-2">
                                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                    Story Title Header
                                </label>
                                <input
                                    type="text" name="title" required
                                    value={isEditModalOpen ? editFormData.title : formData.title}
                                    onChange={isEditModalOpen ? handleEditField : handleField}
                                    placeholder="e.g., Arjun's Network Discovery Journey"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl px-8 py-5 outline-none focus:border-rose-500/50 focus:ring-8 focus:ring-rose-500/5 transition-all text-base font-black italic shadow-inner"
                                />
                            </div>

                            <div className="space-y-3 px-2">
                                <label className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                    Primary Story Discourse
                                </label>
                                <textarea
                                    name="storyContent" required rows={8}
                                    value={isEditModalOpen ? editFormData.storyContent : formData.storyContent}
                                    onChange={isEditModalOpen ? handleEditField : handleField}
                                    placeholder="Draft the primary learning narrative here..."
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] px-8 py-8 outline-none focus:border-rose-500/50 focus:ring-8 focus:ring-rose-500/5 transition-all resize-none text-base font-medium leading-relaxed italic shadow-inner"
                                />
                            </div>

                            <div className="px-2 pt-4">
                                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-6 shadow-inner">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                                <HelpCircle className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-[0.2em] mb-0.5">Assessment Matrix</p>
                                                <p className="text-[11px] text-zinc-500 font-bold italic">Configuring {isEditModalOpen ? editFormData.quiz?.length : formData.quiz?.length} Question Nodes</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const target = isEditModalOpen ? setEditFormData : setFormData;
                                                target(prev => ({
                                                    ...prev,
                                                    quiz: [...(prev.quiz || []), { question: '', options: ['', '', '', ''], rightAnswer: '' }]
                                                }));
                                            }}
                                            className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Append Node
                                        </button>
                                    </div>

                                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {(isEditModalOpen ? editFormData.quiz : formData.quiz)?.map((q, qIdx) => (
                                            <div key={qIdx} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative group/quiz">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const target = isEditModalOpen ? setEditFormData : setFormData;
                                                        target(prev => ({
                                                            ...prev,
                                                            quiz: prev.quiz.filter((_, i) => i !== qIdx)
                                                        }));
                                                    }}
                                                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover/quiz:opacity-100 transition-opacity active:scale-90"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>

                                                <div className="space-y-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1 italic">Vulnerability Query {qIdx + 1}</label>
                                                        <input
                                                            type="text"
                                                            value={q.question}
                                                            onChange={(e) => {
                                                                const target = isEditModalOpen ? setEditFormData : setFormData;
                                                                target(prev => {
                                                                    const newQuiz = [...prev.quiz];
                                                                    newQuiz[qIdx] = { ...newQuiz[qIdx], question: e.target.value };
                                                                    return { ...prev, quiz: newQuiz };
                                                                });
                                                            }}
                                                            placeholder="State the investigative question..."
                                                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 text-xs font-bold outline-none focus:border-blue-500/40"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        {q.options.map((opt, oIdx) => (
                                                            <div key={oIdx} className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={opt}
                                                                    onChange={(e) => {
                                                                        const target = isEditModalOpen ? setEditFormData : setFormData;
                                                                        target(prev => {
                                                                            const newQuiz = [...prev.quiz];
                                                                            const newOptions = [...newQuiz[qIdx].options];
                                                                            newOptions[oIdx] = e.target.value;
                                                                            newQuiz[qIdx] = { ...newQuiz[qIdx], options: newOptions };
                                                                            return { ...prev, quiz: newQuiz };
                                                                        });
                                                                    }}
                                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                                    className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-xl pl-4 pr-10 py-2.5 text-[11px] font-medium outline-none transition-all ${q.rightAnswer === opt && opt !== '' ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-100 dark:border-zinc-800'}`}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const target = isEditModalOpen ? setEditFormData : setFormData;
                                                                        target(prev => {
                                                                            const newQuiz = [...prev.quiz];
                                                                            newQuiz[qIdx] = { ...newQuiz[qIdx], rightAnswer: opt };
                                                                            return { ...prev, quiz: newQuiz };
                                                                        });
                                                                    }}
                                                                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${q.rightAnswer === opt && opt !== '' ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-300 hover:text-blue-500'}`}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {(isEditModalOpen ? editFormData.quiz : formData.quiz)?.length === 0 && (
                                            <div className="py-8 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] opacity-40">
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">No assessment nodes currently initialized.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10 sticky bottom-0 bg-white/10 backdrop-blur-md">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-8 py-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 italic">Discard Manifest</button>
                                <button type="submit" disabled={formLoading}
                                    className={`flex-[2] py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-4 text-white italic ${isEditModalOpen ? 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700' : 'bg-rose-600 shadow-rose-500/30 hover:bg-rose-700'}`}>
                                    {formLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isEditModalOpen ? 'Commit Changes' : 'Seal Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Matrix */}
            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                type={confirmConfig.type}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={confirmConfig.onConfirm}
                onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default StoryLearning;
