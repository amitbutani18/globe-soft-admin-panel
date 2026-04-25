import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    RefreshCw,
    FolderOpen,
    Save,
    X,
    Trash2,
    Check,
    FileText,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    LayoutGrid,
    Globe,
    Activity
} from 'lucide-react';
import topicService from '../../../models/topicService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const LIMIT_OPTIONS = [5, 10, 20, 50];

const Topics = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const [editFormData, setEditFormData] = useState({ id: '', name: '', description: '', icon: '', nativeAdIndex: 1, quizTopicName: '' });
    const [editLoading, setEditLoading] = useState(false);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        icon: '',
        nativeAdIndex: 1,
        quizTopicName: '',
    });

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const { topics: data } = await topicService.getTopics();
            setTopics(data);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const openView = async (topic) => {
        try {
            const fresh = await topicService.getTopicById(topic.id);
            setSelectedTopic(fresh ?? topic);
            setIsDetailOpen(true);
        } catch {
            setSelectedTopic(topic);
            setIsDetailOpen(true);
        }
    };

    const handleField = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'nativeAdIndex' ? parseInt(value) || 0 : value }));
    };

    const openEdit = (topic) => {
        setEditingTopic(topic);
        setEditFormData({
            id: topic.id || '',
            name: topic.name || '',
            description: topic.description || '',
            icon: topic.icon || '',
            nativeAdIndex: topic.nativeAdIndex || 1,
            quizTopicName: topic.quizTopicName || '',
        });
        setIsEditModalOpen(true);
    };

    const handleEditField = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: name === 'nativeAdIndex' ? parseInt(value) || 0 : value }));
    };

    const executeEditSubmit = async () => {
        setEditLoading(true);
        try {
            await topicService.updateTopic(editingTopic.id, editFormData);
            setTopics(prev => prev.map(t => t.id === editingTopic.id ? { ...t, ...editFormData } : t));
            setIsEditModalOpen(false);
            setEditingTopic(null);
        } catch (error) {
            alert(`Failed to update topic: ${error.message}`);
        } finally {
            setEditLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleEditSubmit = (e) => {
        if (e) e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Commit Identity Shift',
            message: 'Are you sure you want to modify this topic? This recalibrates the core knowledge pathway.',
            onConfirm: executeEditSubmit
        });
    };

    const executeDelete = async (topic) => {
        try {
            await topicService.deleteTopic(topic.id);
            setTopics(prev => prev.filter(t => t.id !== topic.id));
        } catch (error) {
            alert(`Failed to delete topic: ${error.message}`);
        } finally {
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleDelete = (topic) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Terminate Registry Node',
            message: `Are you sure you want to kill "${topic.name}"? This action is irreversible and affects all sub-matrix content.`,
            onConfirm: () => executeDelete(topic)
        });
    };

    const executeCreate = async () => {
        setLoading(true);
        try {
            await topicService.createTopic(formData);
            setIsAddModalOpen(false);
            setFormData({ id: '', name: '', description: '', icon: '', nativeAdIndex: 1, quizTopicName: '' });
            fetchTopics();
        } catch (error) {
            alert(`Failed to add topic: ${error.message}`);
        } finally {
            setLoading(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'success',
            title: 'Finalize Registry Entry',
            message: 'Deploy this new knowledge node to the live environment?',
            onConfirm: executeCreate
        });
    };

    const goToPage = (p) => {
        setPage(p);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const filteredTopics = topics.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const total = filteredTopics.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedTopics = filteredTopics.slice((page - 1) * limit, page * limit);

    const formatDate = (str) => {
        if (!str) return '—';
        try { return new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch { return str; }
    };

    const pageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
        return [...pages].sort((a, b) => a - b);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">Knowledge Topics</h1>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium italic">
                            Manage the root taxonomy for Kali Linux learning pathways.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchTopics()}
                        disabled={loading}
                        className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 disabled:opacity-50"
                        title="Refresh Registry"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl transition-all font-bold shadow-xl active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize Topic
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Registered Topics', value: total, icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Active Pathways', value: topics.length, icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Gateway Access', value: 'Public', icon: Globe, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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

            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-all duration-500">

                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-bold uppercase tracking-widest hidden sm:block">Per page</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-lg gap-1">
                            {LIMIT_OPTIONS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => handleLimitChange(l)}
                                    className={`w-9 h-7 rounded-md font-black transition-all ${limit === l
                                        ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'hover:text-zinc-800 dark:hover:text-zinc-200'
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
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-12 text-center">UID</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Topic Identity</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-40">Ad / Quiz</th>
                                <th className="px-6 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] w-48 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Syncing Matrix Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedTopics.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-40">
                                            <div className="w-20 h-20 rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                <FolderOpen className="w-10 h-10 text-zinc-400" />
                                            </div>
                                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest leading-loose max-w-xs">
                                                Database resonance empty. Initialize your first topic to begin training.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTopics.map((topic, idx) => {
                                    const row = (page - 1) * limit + idx + 1;
                                    return (
                                        <tr key={topic.id || idx} className="group hover:bg-blue-500/[0.02] transition-colors border-b border-zinc-100 dark:border-zinc-800/50">
                                            <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400 text-center">{row.toString().padStart(2, '0')}</td>
                                            <td className="px-6 py-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors shrink-0">
                                                        <span className="text-[10px] font-mono font-bold uppercase">{topic.icon?.substring(0, 2) || '—'}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-black text-zinc-900 dark:text-zinc-100 text-[13px] tracking-tight truncate">{topic.name}</p>
                                                        <p className="text-[10px] text-zinc-400 font-medium truncate">{topic.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2.5">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-bold text-zinc-400 uppercase">Ad: <span className="text-zinc-800 dark:text-zinc-200">{topic.nativeAdIndex || 0}</span></span>
                                                    <span className="text-[9px] font-bold text-zinc-400 uppercase truncate">Quiz: <span className="text-emerald-500">{topic.quizTopicName || '—'}</span></span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-2.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openView(topic)} className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-all" title="View"><Eye className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => openEdit(topic)} className="p-2 hover:bg-amber-500/10 text-amber-500 rounded-lg transition-all" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                                                    <button onClick={() => handleDelete(topic)} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 0 && (
                    <div className="p-8 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="text-zinc-900 dark:text-white">{total}</span> registry nodes
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
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10'
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

            {isDetailOpen && selectedTopic && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-400 overflow-hidden">
                        <div className="p-10 bg-gradient-to-br from-blue-500/5 to-transparent border-b border-zinc-200 dark:border-zinc-800 relative">
                            <div className="absolute top-10 right-10 flex gap-2">
                                <button onClick={() => setIsDetailOpen(false)} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all shadow-sm border border-zinc-200 dark:border-zinc-700">
                                    <X className="w-5 h-5 text-zinc-500" />
                                </button>
                            </div>
                            <div className="flex items-center gap-5 mb-6">
                                <div className="p-4 bg-blue-500 text-white rounded-[1.5rem] shadow-xl shadow-blue-500/20">
                                    <FolderOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">Matrix Identity</p>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-none">{selectedTopic.name}</h2>
                                    <p className="text-xs font-mono text-zinc-400 mt-2">ID: {selectedTopic.id}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-5 rounded-3xl">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Native Ad Index</p>
                                    <p className="text-xl font-black text-zinc-900 dark:text-white font-mono">{selectedTopic.nativeAdIndex || 0}</p>
                                </div>
                                <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 p-5 rounded-3xl">
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Quiz Topic Name</p>
                                    <p className="text-xl font-black text-emerald-500 font-mono">{selectedTopic.quizTopicName || '—'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-10 space-y-8">
                            <div>
                                <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                                    <FileText className="w-4 h-4 text-zinc-400" /> Administrative Briefing
                                </p>
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8">
                                    <p className="text-zinc-600 dark:text-zinc-400 leading-loose text-base font-medium">
                                        {selectedTopic.description || 'System data: This node targets a core learning topic within the Kali Linux framework. No extended briefing provided.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                        <div className={`p-8 border-b ${isEditModalOpen ? 'bg-amber-500/5 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/20'} flex items-center justify-between flex-shrink-0`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${isEditModalOpen ? 'bg-amber-500' : 'bg-blue-600'}`}>
                                    {isEditModalOpen ? <Pencil className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase leading-tight">
                                        {isEditModalOpen ? 'Modify Identity' : 'Initialize Topic'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Topic Registry Control</p>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all">
                                <X className="w-5 h-5 text-zinc-400" />
                            </button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">ID (Slug/Key) *</label>
                                    <input
                                        type="text" name="id" required
                                        value={isEditModalOpen ? editFormData.id : formData.id}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g. offensive_sec"
                                        disabled={isEditModalOpen}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-mono text-sm disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Topic Name *</label>
                                    <input
                                        type="text" name="name" required
                                        value={isEditModalOpen ? editFormData.name : formData.name}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g. Offensive Security"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Icon Identifier</label>
                                    <input
                                        type="text" name="icon"
                                        value={isEditModalOpen ? editFormData.icon : formData.icon}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g. computer"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Native Ad Index</label>
                                    <input
                                        type="number" name="nativeAdIndex"
                                        value={isEditModalOpen ? editFormData.nativeAdIndex : formData.nativeAdIndex}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quiz Topic Name</label>
                                <input
                                    type="text" name="quizTopicName"
                                    value={isEditModalOpen ? editFormData.quizTopicName : formData.quizTopicName}
                                    onChange={isEditModalOpen ? handleEditField : handleField}
                                    placeholder="e.g. Mastery Quiz"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Operational Briefing</label>
                                <textarea
                                    name="description" required rows={3}
                                    value={isEditModalOpen ? editFormData.description : formData.description}
                                    onChange={isEditModalOpen ? handleEditField : handleField}
                                    placeholder="Enter topic objectives..."
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all resize-none text-sm font-medium"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4 pb-2">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-8 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold text-[11px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                                    Discard
                                </button>
                                <button type="submit" disabled={loading || editLoading}
                                    className={`flex-[2] py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 text-white ${isEditModalOpen ? 'bg-amber-500 shadow-amber-500/20' : 'bg-blue-600 shadow-blue-500/20'}`}>
                                    {(loading || editLoading) ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isEditModalOpen ? 'Commit Changes' : 'Deploy Topic'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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

export default Topics;
