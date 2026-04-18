import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    Save,
    X,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { useEffect } from 'react';
import categoryService from '../../../models/categoryService';

const Category = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        beforeImage: '',
        afterImage: '',
        is_active: true,
        seq_num: 1
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await categoryService.addCategory(formData);
            alert('Category added successfully!');
            setIsAddModalOpen(false);
            setFormData({ name: '', beforeImage: '', afterImage: '', is_active: true, seq_num: 1 });
            fetchCategories(); // Refresh list
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            alert(`Failed to add category: ${errorMsg}`);
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage image collection categories for Aesthetic AI.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 text-sm text-white"
                >
                    <Plus className="w-5 h-5" />
                    Add Category
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search categories..."
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
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Preview</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 transition-colors duration-300">
                            {categories.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-zinc-500 uppercase tracking-widest text-[10px] font-black opacity-30">
                                        No categories found in production
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat, idx) => (
                                    <tr key={cat.id || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
                                        <td className="px-6 py-5 font-mono text-xs text-zinc-400 dark:text-zinc-600">{cat.seq_num || idx + 1}</td>
                                        <td className="px-6 py-5 font-mono text-[10px] text-zinc-400 dark:text-zinc-500 tracking-tighter">{cat.id}</td>
                                        <td className="px-6 py-5 font-bold text-zinc-900 dark:text-zinc-200 text-sm transition-colors uppercase tracking-tight">{cat.name}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5">
                                                <a href={cat.beforeImage} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 overflow-hidden group/img relative">
                                                    <img src={cat.beforeImage} alt="before" className="w-full h-full object-cover group-hover/img:opacity-50 transition-opacity" />
                                                    <ImageIcon className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                </a>
                                                <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700 font-bold" />
                                                <a href={cat.afterImage} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 overflow-hidden group/img relative">
                                                    <img src={cat.afterImage} alt="after" className="w-full h-full object-cover group-hover/img:opacity-50 transition-opacity" />
                                                    <ImageIcon className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-bold ${cat.is_active ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'} border px-2 py-0.5 rounded-full w-fit uppercase tracking-tighter`}>
                                                {cat.is_active ? 'Active' : 'Inactive'}
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

            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="p-8 bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">New Category</h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1 uppercase tracking-widest leading-relaxed">Add a new entry to the MongoDB collection.</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 dark:text-zinc-500 ml-1 uppercase tracking-widest">Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700" placeholder="Figurine" />
                                </div>
                                <div className="space-y-2 text-xs">
                                    <label className="font-bold text-zinc-500 dark:text-zinc-500 ml-1 uppercase tracking-widest">Sequence</label>
                                    <input type="number" name="seq_num" required value={formData.seq_num} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                <label className="font-bold text-zinc-500 dark:text-zinc-500 ml-1 uppercase tracking-widest">Before Image URL</label>
                                <input type="url" name="beforeImage" required value={formData.beforeImage} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all" />
                            </div>

                            <div className="space-y-2 text-xs">
                                <label className="font-bold text-zinc-500 dark:text-zinc-500 ml-1 uppercase tracking-widest">After Image URL</label>
                                <input type="url" name="afterImage" required value={formData.afterImage} onChange={handleInputChange} className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all" />
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                                <input type="checkbox" id="is_active_cat" name="is_active" checked={formData.is_active} onChange={handleInputChange} className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-indigo-500" />
                                <label htmlFor="is_active_cat" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 cursor-pointer select-none uppercase tracking-widest">Active Collection</label>
                            </div>

                            <div className="flex items-center gap-3 pt-4">
                                <button type="submit" disabled={loading} className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest text-white">
                                    <Save className="w-4 h-4" />
                                    {loading ? 'Processing...' : 'Save Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;
