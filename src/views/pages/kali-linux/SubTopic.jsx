import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    RefreshCw,
    FolderOpen,
    Save,
    X,
    Trash2,
    Eye,
    Pencil,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileText,
    Layers,
    LayoutGrid,
    CheckCircle2
} from 'lucide-react';
import subTopicService from '../../../models/subTopicService';
import topicService from '../../../models/topicService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const LIMIT_OPTIONS = [5, 10, 20, 50];

const SubTopic = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSubTopic, setEditingSubTopic] = useState(null);
    const [editFormData, setEditFormData] = useState({ id: '', topicId: '', title: '', description: '', icon: '', order: 1, screenKey: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [selectedSubTopic, setSelectedSubTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [subTopics, setSubTopics] = useState([]);
    const [topics, setTopics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const [formData, setFormData] = useState({
        id: '',
        topicId: '',
        title: '',
        description: '',
        icon: '',
        order: 1,
        screenKey: '',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [stRes, tRes] = await Promise.all([
                subTopicService.getSubTopics(),
                topicService.getTopics()
            ]);
            setSubTopics(stRes.subTopics);
            setTopics(tRes.topics);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openView = async (st) => {
        try {
            const fresh = await subTopicService.getSubTopicById(st.id);
            setSelectedSubTopic(fresh ?? st);
            setIsDetailOpen(true);
        } catch {
            setSelectedSubTopic(st);
            setIsDetailOpen(true);
        }
    };

    const handleField = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }));
    };

    const openEdit = (st) => {
        setEditingSubTopic(st);
        setEditFormData({
            id: st.id || '',
            topicId: st.topicId || '',
            title: st.title || '',
            description: st.description || '',
            icon: st.icon || '',
            order: st.order || 1,
            screenKey: st.screenKey || '',
        });
        setIsEditModalOpen(true);
    };

    const handleEditField = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: name === 'order' ? parseInt(value) || 0 : value }));
    };

    const executeEditSubmit = async () => {
        setEditLoading(true);
        try {
            await subTopicService.updateSubTopic(editingSubTopic.id, editFormData);
            setSubTopics(prev => prev.map(st => st.id === editingSubTopic.id ? { ...st, ...editFormData } : st));
            setIsEditModalOpen(false);
            setEditingSubTopic(null);
        } catch (error) {
            alert(`Update failed: ${error.message}`);
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
            title: 'Commit Node Modification',
            message: 'Are you sure you want to update this sub-matrix entry? This recalibrates the specialized learning path.',
            onConfirm: executeEditSubmit
        });
    };

    const executeDelete = async (st) => {
        try {
            await subTopicService.deleteSubTopic(st.id);
            setSubTopics(prev => prev.filter(item => item.id !== st.id));
        } catch (error) {
            alert(`Delete failed: ${error.message}`);
        } finally {
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleDelete = (st) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Drop Taxonomic Node',
            message: `Are you sure you want to drop "${st.title || st.name}"? This action is irreversible and terminates the specialized branch.`,
            onConfirm: () => executeDelete(st)
        });
    };

    const executeCreate = async () => {
        setLoading(true);
        try {
            await subTopicService.createSubTopic(formData);
            setFormData({ id: '', topicId: '', title: '', description: '', icon: '', order: 1, screenKey: '' });
            setIsAddModalOpen(false);
            fetchData();
        } catch (error) {
            alert(`Deployment failed: ${error.message}`);
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
            message: 'Are you sure you want to initialize this sub-matrix node? This will deploy the entry to the production registry.',
            onConfirm: executeCreate
        });
    };

    const goToPage = (p) => {
        const totalPages = Math.ceil(filteredSubTopics.length / limit);
        setPage(Math.max(1, Math.min(p, totalPages)));
    };

    const filteredSubTopics = subTopics.filter(st =>
        (st.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (st.id || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedSubTopics = filteredSubTopics.slice((page - 1) * limit, page * limit);
    const totalPages = Math.ceil(filteredSubTopics.length / limit);

    const getTopicName = (id) => {
        const t = topics.find(topic => topic.id === id);
        return t ? t.name : id;
    };

    const pageNumbers = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
        return [...pages].sort((a, b) => a - b);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">Sub Topics</h1>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium italic">
                            Manage specialized learning paths for Kali Linux.
                            <span className="ml-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
                                {subTopics.length} Total
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-xs font-bold text-zinc-500"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Sync
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/20 active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize SubTopic
                    </button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search sub-topics..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-bold uppercase tracking-widest hidden sm:block">Per page</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-lg gap-1">
                            {LIMIT_OPTIONS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => { setLimit(l); setPage(1); }}
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
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-3 w-12 text-center">#</th>
                                <th className="px-6 py-3">Identity & Intent</th>
                                <th className="px-6 py-3">Parent Root</th>
                                <th className="px-6 py-3 w-24 text-center">Order</th>
                                <th className="px-6 py-3 text-right w-52">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Syncing Matrix...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedSubTopics.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-zinc-400 italic">
                                        No sub-topics resonance found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSubTopics.map((st, idx) => (
                                    <tr key={st.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors border-b border-zinc-100 dark:border-zinc-800/50">
                                        <td className="px-6 py-2.5 font-mono text-[10px] text-zinc-400 text-center">
                                            {((page - 1) * limit + idx + 1).toString().padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-2.5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 font-mono text-[9px] font-bold uppercase shrink-0">
                                                    {st.icon?.substring(0, 2) || 'ST'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-[13px] leading-tight truncate">{st.title || st.name}</p>
                                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{st.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5 text-[10px]">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg font-bold text-zinc-500 uppercase truncate max-w-[140px]">
                                                <FolderOpen className="w-3 h-3 text-indigo-500 shrink-0" />
                                                <span className="truncate">{getTopicName(st.topicId)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-2.5 text-center">
                                            <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{st.order || 0}</span>
                                        </td>
                                        <td className="px-6 py-2.5 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openView(st)} className="p-2 hover:bg-green-500/10 text-green-600 rounded-lg transition-all" title="View"><Eye className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => openEdit(st)} className="p-2 hover:bg-amber-500/10 text-amber-500 rounded-lg transition-all" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDelete(st)} className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-950/20">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                            Showing <span className="text-zinc-900 dark:text-white">{(page - 1) * limit + 1}–{Math.min(page * limit, filteredSubTopics.length)}</span> of {filteredSubTopics.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button disabled={page === 1} onClick={() => goToPage(1)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronsLeft className="w-4 h-4" /></button>
                            <button disabled={page === 1} onClick={() => goToPage(page - 1)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                            {pageNumbers().map((p, i, arr) => (
                                <React.Fragment key={p}>
                                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-zinc-400">...</span>}
                                    <button onClick={() => goToPage(p)} className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all ${page === p ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-900'}`}>{p}</button>
                                </React.Fragment>
                            ))}
                            <button disabled={page === totalPages} onClick={() => goToPage(page + 1)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                            <button disabled={page === totalPages} onClick={() => goToPage(totalPages)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30"><ChevronsRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {isDetailOpen && selectedSubTopic && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex items-start justify-between bg-zinc-50 dark:bg-zinc-950/50">
                            <div>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.3em] mb-1">SubTopic Detail</p>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedSubTopic.title || selectedSubTopic.name}</h2>
                                <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase">ID: {selectedSubTopic.id} | Parent: {getTopicName(selectedSubTopic.topicId)}</p>
                            </div>
                            <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Description
                                </h3>
                                <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{selectedSubTopic.description || 'No briefing provided.'}</p>
                                </div>
                            </div>

                            {selectedSubTopic.content && (
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <LayoutGrid className="w-4 h-4" /> Content Body
                                    </h3>
                                    <div className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 space-y-6">
                                        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{selectedSubTopic.content.title}</h4>
                                        <div className="space-y-4">
                                            {selectedSubTopic.content.contentItems && selectedSubTopic.content.contentItems.map((item, i) => (
                                                <div key={i}>
                                                    {item.type === 'heading' && <h5 className="font-bold text-zinc-800 dark:text-zinc-200 mt-6 mb-2">{item.text}</h5>}
                                                    {item.type === 'paragraph' && <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-loose">{item.text}</p>}
                                                    {item.type === 'bulletPoint' && (
                                                        <div className="flex gap-3 ml-2 my-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm italic">{item.text}</p>
                                                        </div>
                                                    )}
                                                    {item.type === 'image' && (
                                                        <div className="my-6 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
                                                            <img src={item.imageUrl} alt="" className="w-full h-auto" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden">
                        <div className={`p-8 border-b ${isEditModalOpen ? 'bg-amber-500/5 border-amber-500/20' : 'bg-indigo-500/5 border-indigo-500/20'} flex items-center justify-between`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg ${isEditModalOpen ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                                    {isEditModalOpen ? <Pencil className="w-5 h-5" /> : <Plus className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{isEditModalOpen ? 'Modify Branch' : 'Initialize SubTopic'}</h2>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-0.5">Taxonomy Node Control</p>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Parent Root (Topic) *</label>
                                <select name="topicId" required value={isEditModalOpen ? editFormData.topicId : formData.topicId} onChange={isEditModalOpen ? handleEditField : handleField}
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold appearance-none cursor-pointer">
                                    <option value="">Select Parent</option>
                                    {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">ID (Unique Key) *</label>
                                    <input type="text" name="id" required value={isEditModalOpen ? editFormData.id : formData.id} onChange={isEditModalOpen ? handleEditField : handleField} disabled={isEditModalOpen} placeholder="acer_tegra"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-mono disabled:opacity-50" />
                                </div>
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Screen Key *</label>
                                    <input type="text" name="screenKey" required value={isEditModalOpen ? editFormData.screenKey : formData.screenKey} onChange={isEditModalOpen ? handleEditField : handleField} placeholder="acer_tegra_v1"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-mono" />
                                </div>
                            </div>
                            <div className="space-y-2 text-xs">
                                <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Title (SubTopic Node) *</label>
                                <input type="text" name="title" required value={isEditModalOpen ? editFormData.title : formData.title} onChange={isEditModalOpen ? handleEditField : handleField} placeholder="Acer Tegra Guide"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Icon (ID)</label>
                                    <input type="text" name="icon" value={isEditModalOpen ? editFormData.icon : formData.icon} onChange={isEditModalOpen ? handleEditField : handleField} placeholder="laptop"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-mono" />
                                </div>
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Sort Order</label>
                                    <input type="number" name="order" value={isEditModalOpen ? editFormData.order : formData.order} onChange={isEditModalOpen ? handleEditField : handleField}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all font-mono" />
                                </div>
                            </div>
                            <div className="space-y-2 text-xs">
                                <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Description</label>
                                <textarea name="description" required rows={3} value={isEditModalOpen ? editFormData.description : formData.description} onChange={isEditModalOpen ? handleEditField : handleField} placeholder="Brief operational summary..."
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl px-5 py-3 outline-none focus:border-indigo-500 transition-all resize-none font-medium" />
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-6 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                                <button type="submit" disabled={loading || editLoading}
                                    className={`flex-[2] py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-white ${isEditModalOpen ? 'bg-amber-500' : 'bg-indigo-600'}`}>
                                    {(loading || editLoading) ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isEditModalOpen ? 'Update Node' : 'Initialize Node'}
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

export default SubTopic;
