import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus, Search, RefreshCw, Layers, Save, X, Trash2, Eye, Pencil,
    ChevronLeft, ChevronRight, LayoutGrid, List, Activity, Image as ImageIcon,
    CheckCircle2, Calendar, FileText
} from 'lucide-react';
import categoryService from '../../../models/categoryService';
import subCategoryService from '../../../models/subCategoryService';
import ConfirmationModal from '../../../components/ConfirmationModal';
import ImageUploader from '../../../components/ImageUploader';

const Category = () => {
    const [viewLevel, setViewLevel] = useState(0);
    const [viewMode, setViewMode] = useState('list');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState({ current_page: 1, limit: 20, total_items: 0, total_pages: 1 });

    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    // Modals
    const [isAddCatOpen, setIsAddCatOpen] = useState(false);
    const [isEditCatOpen, setIsEditCatOpen] = useState(false);
    const [isAddSubOpen, setIsAddSubOpen] = useState(false);
    const [isEditSubOpen, setIsEditSubOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const [viewObject, setViewObject] = useState(null);
    const [viewType, setViewType] = useState('Category');

    const [catForm, setCatForm] = useState({ name: '', beforeImage: '', is_active: true, seq_num: 1 });
    const [editCatForm, setEditCatForm] = useState({ id: '', name: '', beforeImage: '', is_active: true, seq_num: 1 });

    const [subForm, setSubForm] = useState({ name: '', refImage: '', prompt: '', is_active: true, seq_num: 1 });
    const [editSubForm, setEditSubForm] = useState({ id: '', name: '', refImage: '', prompt: '', is_active: true, seq_num: 1 });

    const fetchCategories = useCallback(async (p = page, l = limit) => {
        setLoading(true);
        try {
            const res = await categoryService.getCategories(p, l);
            if (res && res.success) {
                setCategories(res.data || []);
                if (res.pagination) setPagination(res.pagination);
            }
        } catch (error) {
            console.error(error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        if (viewLevel === 0) fetchCategories(page, limit);
    }, [fetchCategories, viewLevel, page, limit]);

    const fetchSubCategories = async (catId) => {
        setLoading(true);
        try {
            const res = await subCategoryService.getSubcategories(catId, 1, 100);
            if (res && res.success) {
                setSubCategories(res.data || []);
            }
        } catch (error) {
            console.error(error);
            setSubCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setViewLevel(1);
        setSearchQuery('');
        fetchSubCategories(cat.id);
    };

    const goBack = () => {
        if (viewLevel > 0) {
            setViewLevel(0);
            setSelectedCategory(null);
            setSearchQuery('');
        }
    };

    // Category CRUD
    const executeAddCat = async () => {
        setAdding(true);
        try {
            const res = await categoryService.addCategory(catForm);
            if (res.success) {
                setIsAddCatOpen(false);
                setCatForm({ name: '', beforeImage: '', is_active: true, seq_num: 1 });
                fetchCategories(page, limit);
            }
        } catch (error) { alert('Error: ' + error.message); }
        finally { setAdding(false); setConfirmConfig(p => ({ ...p, isOpen: false })); }
    };

    const executeEditCat = async () => {
        setUpdating(true);
        try {
            const { id, ...data } = editCatForm;
            const res = await categoryService.patchCategory(id, data);
            if (res.success) {
                setIsEditCatOpen(false);
                fetchCategories(page, limit);
            }
        } catch (error) { alert('Error: ' + error.message); }
        finally { setUpdating(false); setConfirmConfig(p => ({ ...p, isOpen: false })); }
    };

    const executeDeleteCat = async (id) => {
        setLoading(true);
        try {
            await categoryService.deleteCategory(id);
            fetchCategories(page, limit);
        } catch (error) { alert('Error: ' + error.message); }
        finally { setLoading(false); setConfirmConfig(p => ({ ...p, isOpen: false })); }
    };

    // SubCategory CRUD
    const executeAddSub = async () => {
        setAdding(true);
        try {
            const payload = { ...subForm, CategoryId: selectedCategory.id };
            const res = await subCategoryService.addSubcategory(payload);
            if (res.success) {
                setIsAddSubOpen(false);
                setSubForm({ name: '', refImage: '', prompt: '', is_active: true, seq_num: 1 });
                fetchSubCategories(selectedCategory.id);
            }
        } catch (error) { alert('Error: ' + error.message); }
        finally { setAdding(false); setConfirmConfig(p => ({ ...p, isOpen: false })); }
    };

    const executeEditSub = async () => {
        setUpdating(true);
        try {
            const { id, ...data } = editSubForm;
            const res = await subCategoryService.patchSubcategory(id, data);
            if (res.success) {
                setIsEditSubOpen(false);
                fetchSubCategories(selectedCategory.id);
            }
        } catch (error) { alert('Error: ' + error.message); }
        finally { setUpdating(false); setConfirmConfig(p => ({ ...p, isOpen: false })); }
    };

    const executeDeleteSub = async (id) => {
        setLoading(true);
        try {
            await subCategoryService.deleteSubcategory(id);
            fetchSubCategories(selectedCategory.id);
        } catch (error) { alert('Error: ' + error.message); }
        finally { setLoading(false); setConfirmConfig(p => ({ ...p, isOpen: false })); }
    };

    // Handlers
    const confirmAction = (title, message, onConfirm, type = 'warning') => {
        setConfirmConfig({ isOpen: true, title, message, onConfirm, type });
    };

    const openView = (item, type) => {
        setViewObject(item);
        setViewType(type);
        setIsViewModalOpen(true);
    };

    const filteredCats = categories.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const filteredSubs = subCategories.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewLevel > 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:scale-105' : 'bg-emerald-500 text-white'}`}
                        disabled={viewLevel === 0}
                    >
                        {viewLevel === 0 ? <Layers className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">
                            <span className={viewLevel === 0 ? 'text-emerald-500' : ''}>Categories</span>
                            {viewLevel >= 1 && (
                                <>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                    <span className="text-blue-500">{selectedCategory?.name}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic leading-none">
                            {viewLevel === 0 ? "Category Matrix" : "Sub-Categories Explorer"}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs w-48 focus:border-emerald-500/50 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-emerald-500"
                    >
                        {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => viewLevel === 0 ? setIsAddCatOpen(true) : setIsAddSubOpen(true)}
                        className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add {viewLevel === 0 ? 'Category' : 'Sub-Category'}
                    </button>
                </div>
            </div>

            {/* Level 0: Categories */}
            {viewLevel === 0 && (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
                        {loading ? <div className="col-span-full py-10 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-zinc-400" /></div> :
                            filteredCats.map(cat => (
                                <div key={cat.id} onClick={() => handleCategoryClick(cat)} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-7 hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col h-full">
                                    <div className="flex justify-end items-start mb-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-emerald-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); openView(cat, 'Category'); }}><Eye className="w-4 h-4" /></button>
                                            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-amber-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); setEditCatForm({ ...cat }); setIsEditCatOpen(true); }}><Pencil className="w-4 h-4" /></button>
                                            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-rose-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); confirmAction('Delete Category', 'Delete irreversible?', () => executeDeleteCat(cat.id), 'danger'); }}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        {cat.beforeImage ? (
                                            <div className="w-32 h-32 rounded-3xl overflow-hidden mb-6 border-2 border-emerald-50 dark:border-zinc-800 shadow-lg group-hover:scale-105 transition-transform">
                                                <img src={cat.beforeImage} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
                                                <ImageIcon className="w-8 h-8 text-zinc-300" />
                                            </div>
                                        )}
                                        <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors uppercase leading-tight text-center">{cat.name}</h3>
                                        <span className={`inline-flex items-center text-[8px] font-black ${cat.is_active ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'} px-2 py-1 rounded-sm uppercase tracking-widest`}>{cat.is_active ? 'Active' : 'Offline'}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-row items-center text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            <div className="w-16">Image</div>
                            <div className="flex-1">Name</div>
                            <div className="w-32 text-center">Status</div>
                            <div className="w-32 text-right px-4">Actions</div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? <div className="py-10 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-zinc-400" /></div> :
                                filteredCats.map(cat => (
                                    <div key={cat.id} onClick={() => handleCategoryClick(cat)} className="group flex items-center px-6 py-3 hover:bg-emerald-500/5 border-b border-zinc-100 dark:border-zinc-800 transition-colors cursor-pointer">
                                        <div className="w-16">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100">{cat.beforeImage && <img src={cat.beforeImage} className="w-full h-full object-cover" />}</div>
                                        </div>
                                        <div className="flex-1 font-black text-[12px] text-zinc-900 dark:text-white uppercase italic group-hover:text-emerald-500">{cat.name}</div>
                                        <div className="w-32 text-center"><span className={`text-[8px] font-black ${cat.is_active ? 'text-emerald-600 px-2 py-1 bg-emerald-500/10 rounded-full' : 'text-rose-600 px-2 py-1 bg-rose-500/10 rounded-full'}`}>{cat.is_active ? 'Active' : 'Offline'}</span></div>
                                        <div className="w-32 flex items-center justify-end gap-1.5 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-blue-500 transition-all" onClick={(e) => { e.stopPropagation(); openView(cat, 'Category'); }}><Eye className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-amber-500 transition-all" onClick={(e) => { e.stopPropagation(); setEditCatForm({ ...cat }); setIsEditCatOpen(true); }}><Pencil className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-rose-500 transition-all" onClick={(e) => { e.stopPropagation(); confirmAction('Delete Category', 'Delete irreversible?', () => executeDeleteCat(cat.id), 'danger'); }}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )
            )}

            {/* Level 1: SubCategories */}
            {viewLevel === 1 && (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
                        {loading ? <div className="col-span-full py-10 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-zinc-400" /></div> :
                            filteredSubs.map(sub => (
                                <div key={sub.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-7 hover:border-blue-500/50 transition-all duration-300 shadow-sm flex flex-col h-full">
                                    <div className="flex justify-end items-start mb-4">
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-blue-500 transition-colors shadow-sm" onClick={() => openView(sub, 'SubCategory')}><Eye className="w-4 h-4" /></button>
                                            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-amber-500 transition-colors shadow-sm" onClick={() => { setEditSubForm({ ...sub }); setIsEditSubOpen(true); }}><Pencil className="w-4 h-4" /></button>
                                            <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-rose-500 transition-colors shadow-sm" onClick={() => confirmAction('Delete SubCategory', 'Delete irreversible?', () => executeDeleteSub(sub.id), 'danger')}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center">
                                        {sub.refImage ? (
                                            <div className="w-full h-40 rounded-3xl overflow-hidden mb-6 border group-hover:border-blue-500/30 transition-all shadow-md"><img src={sub.refImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                                        ) : (
                                            <div className="w-full h-40 rounded-3xl bg-zinc-100 flex items-center justify-center mb-6"><ImageIcon className="w-8 h-8 text-zinc-300" /></div>
                                        )}
                                        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 uppercase leading-tight group-hover:text-blue-500 transition-colors">{sub.name}</h3>
                                        <p className="text-[10px] text-zinc-500 line-clamp-2 mb-4 font-medium px-4">{sub.prompt}</p>
                                        <span className={`inline-flex items-center text-[8px] font-black ${sub.is_active ? 'text-blue-600 bg-blue-500/10' : 'text-rose-600 bg-rose-500/10'} px-2.5 py-1 rounded-sm uppercase tracking-widest`}>{sub.is_active ? 'Active' : 'Offline'}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-row items-center text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            <div className="w-16">Image</div>
                            <div className="flex-1">Name</div>
                            <div className="w-1/3">Prompt Preview</div>
                            <div className="w-32 text-center">Status</div>
                            <div className="w-32 text-right px-4">Actions</div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loading ? <div className="py-10 flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-zinc-400" /></div> :
                                filteredSubs.map(sub => (
                                    <div key={sub.id} className="group flex items-center px-6 py-3 hover:bg-blue-500/5 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                                        <div className="w-16">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100">{sub.refImage && <img src={sub.refImage} className="w-full h-full object-cover" />}</div>
                                        </div>
                                        <div className="flex-1 font-black text-[12px] text-zinc-900 dark:text-white uppercase italic group-hover:text-blue-500 transition-colors">{sub.name}</div>
                                        <div className="w-1/3 pr-8"><p className="text-[10px] text-zinc-500 truncate font-medium">{sub.prompt}</p></div>
                                        <div className="w-32 text-center"><span className={`text-[8px] font-black ${sub.is_active ? 'text-blue-600 px-2 py-1 bg-blue-500/10 rounded-full' : 'text-rose-600 px-2 py-1 bg-rose-500/10 rounded-full'}`}>{sub.is_active ? 'Active' : 'Offline'}</span></div>
                                        <div className="w-32 flex items-center justify-end gap-1.5 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-blue-500 transition-all" onClick={() => openView(sub, 'SubCategory')}><Eye className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-amber-500 transition-all" onClick={() => { setEditSubForm({ ...sub }); setIsEditSubOpen(true); }}><Pencil className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-rose-500 transition-all" onClick={() => confirmAction('Delete SubCategory', 'Delete irreversible?', () => executeDeleteSub(sub.id), 'danger')}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )
            )}

            {/* View Details Modal */}
            {isViewModalOpen && viewObject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[85vh]">
                        <div className={`p-8 bg-gradient-to-br ${viewObjectType === 'Category' ? 'from-emerald-500/10 via-emerald-500/5' : 'from-blue-500/10 via-blue-500/5'} to-transparent border-b border-zinc-200 dark:border-zinc-800 relative flex-shrink-0`}>
                            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-xl transition-all shadow-sm border border-zinc-200"><X className="w-5 h-5 text-zinc-500" /></button>
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic">{viewObjectType} Details</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <div className="flex justify-center mb-8">
                                <div className="w-48 h-48 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
                                    <img src={viewObjectType === 'Category' ? viewObject.beforeImage : viewObject.refImage} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest pl-1">Name</h3>
                                    <p className="font-black text-xl italic uppercase text-zinc-900">{viewObject.name}</p>
                                </div>
                                {viewObjectType === 'SubCategory' && (
                                    <div>
                                        <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest pl-1 mb-2">Prompt Setup</h3>
                                        <p className="font-medium text-sm bg-zinc-50 dark:bg-zinc-950 p-6 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 leading-relaxed text-zinc-700">{viewObject.prompt}</p>
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <div className="flex-1 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Sequence</h3>
                                        <p className="font-black text-sm">{viewObject.seq_num}</p>
                                    </div>
                                    <div className="flex-1 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                        <h3 className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Status</h3>
                                        <p className={`font-black text-sm ${viewObject.is_active ? 'text-emerald-500' : 'text-rose-500'}`}>{viewObject.is_active ? 'Active' : 'Offline'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADD CATEGORY MODAL */}
            {isAddCatOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                        <div className="p-8 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-b border-zinc-200 relative flex-shrink-0">
                            <button onClick={() => setIsAddCatOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white rounded-xl shadow-sm border border-zinc-200"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-black uppercase tracking-tight italic">Add Category Node</h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); confirmAction('Save Category', 'Create this root entity?', executeAddCat, 'success'); }} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category Name</label>
                                <input required value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm outline-none font-bold focus:border-emerald-500/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Number</label>
                                <input required type="number" value={catForm.seq_num} onChange={e => setCatForm({ ...catForm, seq_num: parseInt(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm outline-none font-bold focus:border-emerald-500/50" />
                            </div>
                            <div className="-mx-1">
                                <ImageUploader
                                    label="Before Image (Upload)"
                                    folderName="Category/before"
                                    value={catForm.beforeImage}
                                    onChange={(url) => setCatForm({ ...catForm, beforeImage: url })}
                                />
                            </div>
                            <div className="space-y-2 flex items-center justify-between bg-emerald-50/50 p-5 rounded-2xl border border-emerald-500/20">
                                <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Status</label>
                                <input type="checkbox" checked={catForm.is_active} onChange={e => setCatForm({ ...catForm, is_active: e.target.checked })} className="w-5 h-5 accent-emerald-500" />
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button type="submit" disabled={adding} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2">
                                    {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT CATEGORY MODAL */}
            {isEditCatOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                        <div className="p-8 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-zinc-200 relative flex-shrink-0">
                            <button onClick={() => setIsEditCatOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white rounded-xl shadow-sm border border-zinc-200"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-black uppercase tracking-tight italic">Edit Category Node</h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); confirmAction('Update Category', 'Save these modifications?', executeEditCat, 'warning'); }} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category Name</label>
                                <input required value={editCatForm.name} onChange={e => setEditCatForm({ ...editCatForm, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-amber-500/50 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Number</label>
                                <input required type="number" value={editCatForm.seq_num} onChange={e => setEditCatForm({ ...editCatForm, seq_num: parseInt(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm outline-none font-bold focus:border-amber-500/50" />
                            </div>
                            <div className="-mx-1">
                                <ImageUploader
                                    label="Before Image (Upload)"
                                    folderName="Category/before"
                                    value={editCatForm.beforeImage}
                                    onChange={(url) => setEditCatForm({ ...editCatForm, beforeImage: url })}
                                />
                            </div>
                            <div className="space-y-2 flex items-center justify-between bg-amber-50/50 p-5 rounded-2xl border border-amber-500/20">
                                <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Active Status</label>
                                <input type="checkbox" checked={editCatForm.is_active} onChange={e => setEditCatForm({ ...editCatForm, is_active: e.target.checked })} className="w-5 h-5 accent-amber-500" />
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button type="submit" disabled={updating} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20 transition-all flex justify-center items-center gap-2">
                                    {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Protocol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD SUBCATEGORY MODAL */}
            {isAddSubOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                        <div className="p-8 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-b border-zinc-200 relative flex-shrink-0">
                            <button onClick={() => setIsAddSubOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white rounded-xl shadow-sm border border-zinc-200"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-black uppercase tracking-tight italic">New Sub-Category</h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); confirmAction('Save SubCategory', 'Deploy new Sub-Category?', executeAddSub, 'success'); }} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">SubCategory Name</label>
                                    <input required value={subForm.name} onChange={e => setSubForm({ ...subForm, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-blue-500/50 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Priority</label>
                                    <input required type="number" value={subForm.seq_num} onChange={e => setSubForm({ ...subForm, seq_num: parseInt(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-blue-500/50 outline-none" />
                                </div>
                            </div>
                            <div className="-mx-1">
                                <ImageUploader
                                    label="Reference Image (Upload)"
                                    folderName="Category/ref"
                                    value={subForm.refImage}
                                    onChange={(url) => setSubForm({ ...subForm, refImage: url })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Activity className="w-3 h-3 text-blue-500" /> Runtime Prompt Vector</label>
                                <textarea required value={subForm.prompt} onChange={e => setSubForm({ ...subForm, prompt: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-[2rem] px-6 py-5 text-sm font-medium min-h-[140px] focus:border-blue-500/50 outline-none resize-none" placeholder="Enter configuration prompt..." />
                            </div>
                            <div className="space-y-2 flex items-center justify-between bg-blue-50/50 p-5 rounded-2xl border border-blue-500/20">
                                <label className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Active Status</label>
                                <input type="checkbox" checked={subForm.is_active} onChange={e => setSubForm({ ...subForm, is_active: e.target.checked })} className="w-5 h-5 accent-blue-500" />
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button type="submit" disabled={adding} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 transition-all flex justify-center items-center gap-2">
                                    {adding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT SUBCATEGORY MODAL */}
            {isEditSubOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
                        <div className="p-8 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-b border-zinc-200 relative flex-shrink-0">
                            <button onClick={() => setIsEditSubOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-white rounded-xl shadow-sm border border-zinc-200"><X className="w-5 h-5" /></button>
                            <h2 className="text-2xl font-black uppercase tracking-tight italic">Modify Sub-Category</h2>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); confirmAction('Update SubCategory', 'Save these changes?', executeEditSub, 'warning'); }} className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">SubCategory Name</label>
                                    <input required value={editSubForm.name} onChange={e => setEditSubForm({ ...editSubForm, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-amber-500/50 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Sequence Priority</label>
                                    <input required type="number" value={editSubForm.seq_num} onChange={e => setEditSubForm({ ...editSubForm, seq_num: parseInt(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-amber-500/50 outline-none" />
                                </div>
                            </div>
                            <div className="-mx-1">
                                <ImageUploader
                                    label="Reference Image (Upload)"
                                    folderName="Category/ref"
                                    value={editSubForm.refImage}
                                    onChange={(url) => setEditSubForm({ ...editSubForm, refImage: url })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">AI Prompt</label>
                                <textarea required value={editSubForm.prompt} onChange={e => setEditSubForm({ ...editSubForm, prompt: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 rounded-[2rem] px-6 py-5 text-sm font-medium min-h-[140px] focus:border-amber-500/50 outline-none resize-none" />
                            </div>
                            <div className="space-y-2 flex items-center justify-between bg-amber-50/50 p-5 rounded-2xl border border-amber-500/20">
                                <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Active Status</label>
                                <input type="checkbox" checked={editSubForm.is_active} onChange={e => setEditSubForm({ ...editSubForm, is_active: e.target.checked })} className="w-5 h-5 accent-amber-500" />
                            </div>
                            <div className="pt-6 flex gap-3">
                                <button type="submit" disabled={updating} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20 transition-all flex justify-center items-center gap-2">
                                    {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Protocol
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmationModal isOpen={confirmConfig.isOpen} onClose={() => setConfirmConfig(p => ({ ...p, isOpen: false }))} onConfirm={confirmConfig.onConfirm} title={confirmConfig.title} message={confirmConfig.message} type={confirmConfig.type} />
        </div>
    );
};

export default Category;
