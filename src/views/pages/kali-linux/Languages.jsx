import React, { useState, useEffect } from 'react';
import {
    Globe,
    Search,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Save,
    ToggleLeft,
    ToggleRight,
    Languages as LangIcon,
    Sparkles,
    CheckCircle2,
    Activity,
    Flag
} from 'lucide-react';
import languageService from '../../../models/languageService';

const Languages = () => {
    // State
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLang, setEditingLang] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        nativeName: '',
        flag: '',
        isActive: true
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        code: '',
        name: '',
        nativeName: '',
        flag: '',
        isActive: true
    });

    const [formLoading, setFormLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await languageService.getLanguages();
            if (res.data) {
                setLanguages(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch languages:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generic Handlers
    const handleField = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditField = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await languageService.createLanguage(formData);
            setIsAddModalOpen(false);
            setFormData({ code: '', name: '', nativeName: '', flag: '', isActive: true });
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to add language: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const res = await languageService.updateLanguage(editingLang.id, editFormData);
            setIsEditModalOpen(false);
            setEditingLang(null);
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to update language: ${error.message}`);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (lang) => {
        if (!window.confirm(`Delete language: "${lang.name}"?`)) return;
        try {
            const res = await languageService.deleteLanguage(lang.id);
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to delete: ${error.message}`);
        }
    };

    const toggleStatus = async (lang) => {
        try {
            const updatedData = { ...lang, isActive: !lang.isActive };
            await languageService.updateLanguage(lang.id, updatedData);
            setLanguages(prev => prev.map(l => l.id === lang.id ? updatedData : l));
        } catch (error) {
            alert(`Failed to toggle status: ${error.message}`);
        }
    };

    const openEdit = (lang) => {
        setEditingLang(lang);
        setEditFormData({
            id: lang.id,
            code: lang.code || '',
            name: lang.name || '',
            nativeName: lang.nativeName || '',
            flag: lang.flag || '',
            isActive: lang.isActive ?? true
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans italic">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 flex items-center justify-center text-white shrink-0 group transition-transform hover:scale-105 duration-300">
                        <Globe className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase italic">Globalization</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg font-medium text-shadow-sm italic">
                            Manage multi-region localization protocols and regional nodes.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all text-zinc-600 dark:text-zinc-400 disabled:opacity-50"
                        title="Resync Registry"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl transition-all font-bold shadow-2xl active:scale-95 text-[11px] uppercase tracking-[0.2em]"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize Node
                    </button>
                </div>
            </div>

            {/* Main Registry Table */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500">
                <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search regional nodes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-400 font-bold"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto font-black">
                    <table className="w-full text-left border-collapse italic">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-24">Code</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Language Manifest</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Native Descriptor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-32 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-48 text-right italic">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center uppercase tracking-widest italic animate-pulse text-zinc-400 font-black">
                                        Accessing Globalization Protocols...
                                    </td>
                                </tr>
                            ) : languages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest italic opacity-40">
                                            No Localization Nodes Detected.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                languages.filter(l => l.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((lang, idx) => (
                                    <tr key={lang.id || idx} className="group hover:bg-blue-500/[0.03] transition-colors border-l-[3px] border-transparent hover:border-blue-500 duration-300">
                                        <td className="px-8 py-6 font-mono text-[11px] text-blue-600 transition-colors uppercase font-black">
                                            {lang.code}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform duration-300">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </div>
                                                <p className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight mb-0.5 group-hover:translate-x-1 transition-transform">{lang.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-zinc-500 text-sm">
                                            {lang.nativeName}
                                        </td>
                                        <td className="px-8 py-6 text-center italic">
                                            <button
                                                onClick={() => toggleStatus(lang)}
                                                className={`p-2 rounded-2xl transition-all ${lang.isActive
                                                    ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500'}`}
                                            >
                                                {lang.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => openEdit(lang)} className="p-3 hover:bg-blue-500/10 text-blue-600 rounded-2xl transition-all border border-transparent hover:border-blue-500/20" title="Rewrite Node"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(lang)} className="p-3 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all border border-transparent hover:border-rose-500/20" title="Decommission Node"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300 font-black italic">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3.5rem] w-full max-w-xl shadow-3xl animate-in zoom-in-95 duration-400 overflow-hidden flex flex-col">
                        <div className={`p-10 border-b flex items-center justify-between flex-shrink-0 ${isEditModalOpen ? 'bg-blue-500/5' : 'bg-emerald-500/5'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl ${isEditModalOpen ? 'bg-blue-600 shadow-blue-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
                                    {isEditModalOpen ? <Pencil className="w-7 h-7" /> : <Plus className="w-8 h-8" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 leading-none italic">Globalization Matrix Editor</p>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase leading-none italic">{isEditModalOpen ? 'Rewrite Node' : 'Initialize Node'}</h2>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all active:scale-90"><X className="w-7 h-7 text-zinc-400" /></button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="p-10 space-y-8 lowercase font-black">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">Node Code *</label>
                                    <input
                                        type="text" name="code" required maxLength="5"
                                        value={isEditModalOpen ? editFormData.code : formData.code}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g., en"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-black text-sm shadow-inner uppercase italic"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">Registry Name *</label>
                                    <input
                                        type="text" name="name" required
                                        value={isEditModalOpen ? editFormData.name : formData.name}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="e.g., English"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-black text-sm shadow-inner italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3 italic">Native Descriptor *</label>
                                <input
                                    type="text" name="nativeName" required
                                    value={isEditModalOpen ? editFormData.nativeName : formData.nativeName}
                                    onChange={isEditModalOpen ? handleEditField : handleField}
                                    placeholder="e.g., English"
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all font-black text-sm shadow-inner italic"
                                />
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-8 py-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 italic">Discard</button>
                                <button type="submit" disabled={formLoading}
                                    className={`flex-[2] py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 italic ${isEditModalOpen ? 'bg-blue-600 shadow-blue-500/20 ring-4 ring-blue-500/10' : 'bg-emerald-500 shadow-emerald-500/20 ring-4 ring-emerald-500/5'}`}>
                                    {formLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isEditModalOpen ? 'Commit Manifest' : 'Seal Registry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Languages;
