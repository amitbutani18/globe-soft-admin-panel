import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Image as ImageIcon,
    Save,
    X,
    ChevronRight,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import subcategoryService from '../../../models/subcategoryService';
import categoryService from '../../../models/categoryService';

const INITIAL_FORM = { CategoryId: '', name: '', refImage: '', prompt: '', is_active: true, seq_num: 1 };

const Subcategory = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState(INITIAL_FORM);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [cats, subs] = await Promise.all([
                categoryService.getCategories(),
                subcategoryService.getSubcategories()
            ]);
            setCategories(cats || []);
            setSubcategories(subs || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await subcategoryService.addSubcategory(formData);
            alert('Subcategory added successfully!');
            setIsAddModalOpen(false);
            setFormData(INITIAL_FORM);
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Failed to add subcategory: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [formData, fetchData]);

    const filtered = subcategories.filter(s =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subcategory</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage specific collections and AI prompts within categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all font-semibold text-sm text-zinc-600 dark:text-zinc-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 text-sm text-white"
                    >
                        <Plus className="w-5 h-5" />
                        Add Subcategory
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search subcategories..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold border border-zinc-200 dark:border-zinc-700 transition-colors uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/40 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Seq</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Name</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 transition-colors duration-300">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2 text-zinc-400 text-xs uppercase tracking-widest font-bold opacity-50">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-30">
                                            <Sparkles className="w-10 h-10 text-indigo-500" />
                                            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-black">No subcategories found in production</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((sub, idx) => (
                                    <tr key={sub.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-xs text-zinc-400 dark:text-zinc-600">{sub.seq_num || idx + 1}</td>
                                        <td className="px-6 py-5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-tighter">{sub.id}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-inner">
                                                    {sub.refImage ? (
                                                        <img src={sub.refImage} alt={sub.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-zinc-900 dark:text-zinc-200 text-sm uppercase tracking-tight">{sub.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-tighter">{sub.CategoryId || sub.category_id || '—'}</td>
                                        <td className="px-6 py-5">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-bold border px-2 py-0.5 rounded-full w-fit uppercase tracking-tighter ${sub.is_active
                                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                                : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
                                                }`}>
                                                {sub.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">New Subcategory</h2>
                                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest leading-relaxed">Create a nested collection with custom AI prompts.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Parent Category</label>
                                    {categories.length > 0 ? (
                                        <select
                                            name="CategoryId"
                                            required
                                            value={formData.CategoryId}
                                            onChange={handleInputChange}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all text-sm"
                                        >
                                            <option value="">Select category...</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text" name="CategoryId" required value={formData.CategoryId}
                                            onChange={handleInputChange}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all text-sm"
                                            placeholder="e.g. 69c3ca0d..."
                                        />
                                    )}
                                </div>
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Subcategory Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                        placeholder="Studio" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Reference Image URL</label>
                                    <input type="url" name="refImage" required value={formData.refImage} onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                        placeholder="https://..." />
                                </div>
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest">Sequence Num</label>
                                    <input type="number" name="seq_num" required value={formData.seq_num} onChange={handleInputChange}
                                        className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                <label className="font-bold text-zinc-500 ml-1 uppercase tracking-widest flex items-center gap-2">
                                    AI Prompt <Sparkles className="w-3 h-3 text-indigo-500" />
                                </label>
                                <textarea
                                    name="prompt" required rows={5} value={formData.prompt} onChange={handleInputChange}
                                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-sm leading-relaxed"
                                    placeholder="A hyper-realistic portrait of..."
                                />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                                <input type="checkbox" id="is_active_sub" name="is_active" checked={formData.is_active} onChange={handleInputChange}
                                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-indigo-500" />
                                <label htmlFor="is_active_sub" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer select-none uppercase tracking-widest">
                                    Active Module
                                </label>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-white">
                                <Save className="w-4 h-4" />
                                {loading ? 'Processing...' : 'Save Subcategory'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subcategory;
