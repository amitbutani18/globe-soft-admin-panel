import React, { useState, useEffect, useCallback } from 'react';
import {
    Star,
    Plus,
    Pencil,
    Trash2,
    Save,
    RefreshCw,
    ShieldCheck,
    Zap,
    Check,
    X,
    LayoutList,
    AlertCircle,
    Loader2
} from 'lucide-react';
import aestheticBenefitsService from '../../../models/aestheticBenefitsService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const PremiumBenefits = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [benefits, setBenefits] = useState([]);
    const [id, setId] = useState('');
    const [newBenefit, setNewBenefit] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const fetchBenefits = useCallback(async () => {
        setLoading(true);
        try {
            const response = await aestheticBenefitsService.getBenefits();
            if (response.success && response.data) {
                setBenefits(response.data.benefits || []);
                setId(response.data.id || '');
            }
        } catch (error) {
            console.error('❌ Failed to fetch benefits:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBenefits();
    }, [fetchBenefits]);

    const syncBenefits = async (updatedList) => {
        if (!id) return;
        setSaving(true);
        try {
            const response = await aestheticBenefitsService.updateBenefits(id, { benefits: updatedList });
            if (response.success) {
                setBenefits(updatedList);
            }
        } catch (error) {
            alert('Failed to sync benefits with server.');
            console.error(error);
        } finally {
            setSaving(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleAdd = (e) => {
        if (e) e.preventDefault();
        if (!newBenefit.trim()) return;

        setConfirmConfig({
            isOpen: true,
            type: 'success',
            title: 'Grant New Benefit',
            message: 'Are you sure you want to initialize this new premium benefit? It will be immediately available to all subscribers.',
            onConfirm: async () => {
                const updated = [...benefits, newBenefit.trim()];
                await syncBenefits(updated);
                setNewBenefit('');
            }
        });
    };

    const handleDelete = (index) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Revoke Benefit',
            message: 'Are you sure you want to remove this premium benefit? Users will lose access to this feature immediately.',
            onConfirm: () => {
                const updated = benefits.filter((_, i) => i !== index);
                syncBenefits(updated);
            }
        });
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingValue(benefits[index]);
    };

    const cancelEditing = () => {
        setEditingIndex(null);
        setEditingValue('');
    };

    const handleSaveEdit = (index) => {
        if (!editingValue.trim()) return;

        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Re-calibrate Benefit',
            message: 'Are you sure you want to modify this premium benefit? This change will propagate to all active subscriptions.',
            onConfirm: async () => {
                const updated = benefits.map((b, i) => i === index ? editingValue.trim() : b);
                await syncBenefits(updated);
                setEditingIndex(null);
                setEditingValue('');
            }
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Loading User Privileges...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm shadow-indigo-500/5">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Premium Tiers</h1>
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-0.5">Benefit Orchestrator</p>
                    </div>
                    <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">ID: {id}</p>
                </div>

                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-widest"
                        >
                            <Pencil className="w-4 h-4" /> Configure
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <div className={`flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all ${saving ? 'bg-indigo-50 border-indigo-200 text-indigo-600 animate-pulse' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{saving ? 'Syncing...' : 'Live Synced'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Addition UI */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-sm">
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors">
                            <Zap className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            value={newBenefit}
                            onChange={(e) => setNewBenefit(e.target.value)}
                            disabled={!isEditing}
                            placeholder={isEditing ? "Add a new premium benefit..." : "Click Configure to modify benefits"}
                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newBenefit.trim() || saving || !isEditing}
                        className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 text-xs uppercase tracking-widest"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* List UI */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-950/20">
                    <div className="flex items-center gap-3">
                        <LayoutList className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Benefit Registry</h3>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{benefits.length} Items Total</span>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group flex items-center justify-between p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all animate-in slide-in-from-left-2 duration-300">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 text-xs font-black">
                                    {index + 1}
                                </div>
                                {editingIndex === index ? (
                                    <input
                                        autoFocus
                                        value={editingValue}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit(index);
                                            if (e.key === 'Escape') cancelEditing();
                                        }}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        className="flex-1 bg-white dark:bg-zinc-950 border border-indigo-500/50 rounded-xl px-4 py-2 text-sm font-bold outline-none ring-4 ring-indigo-500/5 animate-in zoom-in-95 duration-150"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 group-hover:translate-x-1 transition-transform">{benefit}</span>
                                )}
                            </div>

                            <div className={`flex items-center gap-2 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0'}`}>
                                {editingIndex === index ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(index)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={cancelEditing} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(index)} disabled={!isEditing} className="p-2 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-500/5 rounded-xl transition-all disabled:opacity-0">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(index)} disabled={!isEditing} className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-500/5 rounded-xl transition-all disabled:opacity-0">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {benefits.length === 0 && (
                        <div className="p-12 text-center space-y-4">
                            <div className="inline-flex p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                                <AlertCircle className="w-8 h-8" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">No benefits currently registered in the registry.</p>
                        </div>
                    )}
                </div>
            </div>
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

export default PremiumBenefits;
