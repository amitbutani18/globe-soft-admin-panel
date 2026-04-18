import React, { useState, useEffect } from 'react';
import {
    Image as ImageIcon,
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
    LayoutGrid,
    CheckCircle2,
    Sparkles,
    Wind,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import imagePromptService from '../../../models/imagePromptService';

const LIMIT_OPTIONS = [5, 11, 20, 50];

const ImagePrompt = () => {
    // State
    const [prompts, setPrompts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 11,
        total: 0,
        total_pages: 0
    });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [editingPrompt, setEditingPrompt] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        ref_image: '',
        prompt: '',
        is_active: true,
        seq_num: 1
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        name: '',
        ref_image: '',
        prompt: '',
        is_active: true,
        seq_num: 1
    });

    const [formLoading, setFormLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchData();
    }, [pagination.page, pagination.limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await imagePromptService.getPrompts(pagination.page, pagination.limit);
            if (res.data) {
                setPrompts(res.data);
                if (res.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: res.pagination.total,
                        total_pages: res.pagination.total_pages
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleField = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'seq_num' ? parseInt(value) || 0 : value)
        }));
    };

    const handleEditField = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'seq_num' ? parseInt(value) || 0 : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await imagePromptService.createPrompt(formData);
            setIsAddModalOpen(false);
            setFormData({ name: '', ref_image: '', prompt: '', is_active: true, seq_num: prompts.length + 1 });
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to add prompt: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await imagePromptService.updatePrompt(editingPrompt.id, editFormData);
            setIsEditModalOpen(false);
            setEditingPrompt(null);
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to update prompt: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (prompt) => {
        if (!window.confirm(`Delete prompt: "${prompt.name}"?`)) return;
        try {
            const res = await imagePromptService.deletePrompt(prompt.id);
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to delete: ${error.message}`);
        }
    };

    const toggleStatus = async (prompt) => {
        try {
            const updatedData = { ...prompt, is_active: !prompt.is_active };
            await imagePromptService.updatePrompt(prompt.id, updatedData);
            setPrompts(prev => prev.map(p => p.id === prompt.id ? updatedData : p));
        } catch (error) {
            alert(`Failed to toggle status: ${error.message}`);
        }
    };

    // Modal Triggers
    const openView = (prompt) => {
        setSelectedPrompt(prompt);
        setIsViewModalOpen(true);
    };

    const openEdit = (prompt) => {
        setEditingPrompt(prompt);
        setEditFormData({
            id: prompt.id,
            name: prompt.name || '',
            ref_image: prompt.ref_image || '',
            prompt: prompt.prompt || '',
            is_active: prompt.is_active ?? true,
            seq_num: prompt.seq_num || 1
        });
        setIsEditModalOpen(true);
    };

    const goToPage = (p) => {
        setPagination(prev => ({ ...prev, page: Math.max(1, Math.min(p, prev.total_pages)) }));
    };

    const pageNumbers = () => {
        const nums = [];
        for (let i = 1; i <= pagination.total_pages; i++) nums.push(i);
        return nums;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase italic">Image Prompts</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg font-medium text-shadow-sm italic">
                            Manage AI image generation scripts for Kali Linux modules.
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
                        Capture New Prompt
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Published Prompts', value: pagination.total, icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Active Matrix', value: `${prompts.filter(p => p.is_active).length} Nodes`, icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
                            placeholder="Filter prompts by keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-400 font-bold"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-500 uppercase tracking-widest hidden lg:block text-[10px]">Density Control</span>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1.5 rounded-2xl gap-1">
                            {LIMIT_OPTIONS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => setPagination(prev => ({ ...prev, limit: l, page: 1 }))}
                                    className={`px-4 py-2 rounded-xl font-black transition-all ${pagination.limit === l
                                        ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-md scale-105'
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
                    <table className="w-full text-left border-collapse font-sans italic">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-12 text-center italic">UID</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Visual Descriptor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-32 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-48 text-right italic text-shadow-sm">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 font-black">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center uppercase tracking-widest italic animate-pulse text-zinc-400 font-black">
                                        Synchronizing Prompt Registry...
                                    </td>
                                </tr>
                            ) : prompts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest italic leading-loose opacity-40">
                                            Registry Empty. Capture your first AI generation node.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                prompts.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((prompt, idx) => (
                                    <tr key={prompt.id || idx} className="group hover:bg-blue-500/[0.03] transition-colors border-l-[3px] border-transparent hover:border-blue-500 duration-300">
                                        <td className="px-8 py-6 font-mono text-[10px] text-zinc-400 group-hover:text-blue-500 transition-colors uppercase text-center font-black italic">
                                            {prompt.seq_num?.toString().padStart(2, '0') || '00'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-inner group-hover:scale-105 transition-all duration-300">
                                                    {prompt.ref_image ? (
                                                        <img src={prompt.ref_image} alt={prompt.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-zinc-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight mb-0.5 group-hover:translate-x-1 transition-transform">{prompt.name}</p>
                                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium line-clamp-1 italic max-w-lg">{prompt.prompt?.substring(0, 100)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <button
                                                onClick={() => toggleStatus(prompt)}
                                                className={`p-2.5 rounded-2xl transition-all ${prompt.is_active
                                                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500'}`}
                                            >
                                                {prompt.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => openView(prompt)} className="p-3 hover:bg-blue-500/10 text-blue-500 rounded-2xl transition-all border border-transparent hover:border-blue-500/20" title="Inspect Node"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => openEdit(prompt)} className="p-3 hover:bg-blue-500/10 text-blue-500 rounded-2xl transition-all border border-transparent hover:border-blue-500/20" title="Modify Node"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(prompt)} className="p-3 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all border border-transparent hover:border-rose-500/20" title="Terminate Node"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                {!loading && pagination.total_pages > 0 && (
                    <div className="p-8 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">
                            Displaying <span className="text-zinc-900 dark:text-white font-black">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-zinc-900 dark:text-white font-black">{pagination.total}</span> prompt codes
                        </p>

                        <div className="flex items-center gap-3">
                            <button onClick={() => goToPage(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-95 group">
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                            <div className="flex gap-1.5 px-2 py-1 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-2xl font-black">
                                {pageNumbers().map(p => (
                                    <button
                                        key={p} onClick={() => goToPage(p)}
                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${pagination.page === p
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/40 ring-4 ring-blue-500/10'
                                            : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => goToPage(pagination.page + 1)} disabled={pagination.page >= pagination.total_pages} className="p-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all active:scale-95 group">
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedPrompt && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3.5rem] w-full max-w-4xl shadow-3xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-12 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-b border-zinc-200 dark:border-zinc-800 relative flex-shrink-0">
                            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all shadow-2xl active:scale-90 group"><X className="w-6 h-6 text-zinc-500 group-hover:rotate-90 transition-transform duration-300" /></button>
                            <div className="flex items-center gap-10">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-700 shadow-2xl transition-transform hover:scale-110 duration-500">
                                    {selectedPrompt.ref_image ? (
                                        <img src={selectedPrompt.ref_image} alt={selectedPrompt.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-zinc-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.5em] mb-3 italic">Visual Metadata Node</p>
                                    <h2 className="text-5xl font-black text-zinc-900 dark:text-white leading-tight italic tracking-tighter">{selectedPrompt.name}</h2>
                                    <div className="flex items-center gap-6 mt-4">
                                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black italic opacity-60">ID: {selectedPrompt.id}</p>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedPrompt.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedPrompt.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></div>
                                            {selectedPrompt.is_active ? 'Active Flow' : 'Halted'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar italic font-black">
                            <section>
                                <p className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <div className="w-8 h-[1px] bg-blue-500/30"></div>
                                    AI Generation Script
                                </p>
                                <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-inner group">
                                    <p className="text-zinc-700 dark:text-zinc-300 leading-[2.2] text-xl font-bold whitespace-pre-wrap italic group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500">
                                        {selectedPrompt.prompt}
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] w-full max-w-xl shadow-3xl animate-in zoom-in-95 duration-400 max-h-[90vh] flex flex-col overflow-hidden italic font-black">
                        <div className={`p-10 border-b flex items-center justify-between flex-shrink-0 ${isEditModalOpen ? 'bg-blue-500/5' : 'bg-emerald-500/5'}`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl ${isEditModalOpen ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                    {isEditModalOpen ? <Pencil className="w-6 h-6" /> : <Plus className="w-7 h-7" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Configuration Matrix</p>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase leading-none italic">{isEditModalOpen ? 'Manifest Rewrite' : 'Initialize Node'}</h2>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all active:scale-90"><X className="w-6 h-6 text-zinc-400" /></button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar italic font-black">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Sequence Priority *</label>
                                    <input
                                        type="number" name="seq_num" required
                                        value={isEditModalOpen ? editFormData.seq_num : formData.seq_num}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g., 1"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500/50 transition-all text-sm font-black italic shadow-inner"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Descriptor Name *</label>
                                    <input
                                        type="text" name="name" required
                                        value={isEditModalOpen ? editFormData.name : formData.name}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g., hacker-matrix-rain"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500/50 transition-all text-sm font-black italic shadow-inner"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Reference Image URL *</label>
                                    <input
                                        type="text" name="ref_image" required
                                        value={isEditModalOpen ? editFormData.ref_image : formData.ref_image}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="https://space.digitalocean.com/..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-8 py-5 outline-none focus:border-blue-500/50 transition-all text-sm font-black italic shadow-inner"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Generation Script Payload *</label>
                                    <textarea
                                        name="prompt" required rows={6}
                                        value={isEditModalOpen ? editFormData.prompt : formData.prompt}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="Define the AI directive here..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] px-8 py-8 outline-none focus:border-blue-500/50 transition-all resize-none text-sm font-black italic shadow-inner leading-relaxed"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">Status Protocol</p>
                                        <p className="text-xs text-zinc-500 font-bold italic">Toggle node availability in matrix</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox" name="is_active"
                                            checked={isEditModalOpen ? editFormData.is_active : formData.is_active}
                                            onChange={isEditModalOpen ? handleEditField : handleField}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-8 bg-zinc-200 peer-focus:outline-none dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 rounded-full"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10 sticky bottom-0 bg-white/10 backdrop-blur-md">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-8 py-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 italic">Discard</button>
                                <button type="submit" disabled={formLoading}
                                    className={`flex-[2] py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-4 text-white italic ${isEditModalOpen ? 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700' : 'bg-emerald-600 shadow-emerald-500/30 hover:bg-emerald-700'}`}>
                                    {formLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isEditModalOpen ? 'Commit Rewrite' : 'Seal Node'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImagePrompt;
