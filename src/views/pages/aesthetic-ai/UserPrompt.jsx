import React, { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Search,
    RefreshCw,
    Sparkles,
    Image as ImageIcon,
    ChevronRight,
    Calendar,
    Pencil,
    Trash2,
    Eye,
    X,
    Filter,
    CheckCircle2,
    ChevronsLeft,
    ChevronsRight,
    ChevronLeft,
    Target,
    PenTool,
    Save,
    Fingerprint
} from 'lucide-react';
import imagePromptService from '../../../models/imagePromptService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const UserPrompt = () => {
    const [loading, setLoading] = useState(false);
    const [promptData, setPromptData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [syncing, setSyncing] = useState(false);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const fetchPrompt = useCallback(async () => {
        setLoading(true);
        try {
            const response = await imagePromptService.getPrompts(1, 1);
            if (response && response.success && response.data && response.data.length > 0) {
                const firstPrompt = response.data[0];
                setPromptData(firstPrompt);
                setEditValue(firstPrompt.promts || '');
            }
        } catch (error) {
            console.error('Failed to fetch user prompt:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPrompt();
    }, [fetchPrompt]);

    const executeUpdate = async () => {
        if (!promptData?.id) return;
        setSyncing(true);
        try {
            const response = await imagePromptService.updatePrompt(promptData.id, {
                promts: editValue
            });
            if (response.success || response.message) {
                setPromptData(prev => ({ ...prev, promts: editValue }));
                setIsEditing(false);
                alert('Prompt synchronized successfully');
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            alert(`Sync Failed: ${msg}`);
        } finally {
            setSyncing(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleUpdate = () => {
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Synchronize Neural Core',
            message: 'Are you sure you want to push this prompt instruction to the global matrix? This will influence all AI image generations.',
            onConfirm: executeUpdate
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Global Prompt Config</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">
                        Manage the primary AI instruction overlay for Aesthetic AI.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchPrompt}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all font-semibold text-sm text-zinc-600 dark:text-zinc-300 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold shadow-lg active:scale-95 text-sm uppercase tracking-widest ${isEditing
                            ? 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
                            }`}
                    >
                        {isEditing ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                        {isEditing ? 'Cancel' : 'Configure'}
                    </button>
                </div>
            </div>

            {/* ── Primary Config Card ────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-2xl transition-all duration-500">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600">
                                <Fingerprint className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold uppercase tracking-tight">Main Prompt Definition</h2>
                                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                    Registry ID: {promptData?.id || 'Scanning...'}
                                </p>
                            </div>
                        </div>
                        {isEditing && (
                            <button
                                onClick={handleUpdate}
                                disabled={syncing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {syncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Sync Change
                            </button>
                        )}
                    </div>

                    <div className="p-10">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                                <RefreshCw className="w-10 h-10 animate-spin text-emerald-500" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Synchronizing Matrix...</p>
                            </div>
                        ) : !promptData ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
                                <Sparkles className="w-12 h-12 text-zinc-400" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Registry Entry Not Found</p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Target className="w-3 h-3" /> Instruction Payload
                                        </label>
                                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                                            Live Status
                                        </span>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            rows={8}
                                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-emerald-500/30 rounded-[2rem] px-8 py-8 text-base focus:border-emerald-500 outline-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 leading-relaxed font-bold italic shadow-inner"
                                            placeholder="Enter global prompt modifiers..."
                                        />
                                    ) : (
                                        <div className="p-10 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] shadow-inner group">
                                            <p className="text-zinc-700 dark:text-zinc-300 leading-[2] text-xl font-bold whitespace-pre-wrap italic">
                                                "{promptData.promts}"
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Metadata Footer */}
                                <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Last Modified</span>
                                            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 font-mono">
                                                {new Date(promptData.updatedAt || promptData.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-zinc-100 dark:bg-zinc-800 hidden sm:block"></div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-500" />
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Architecture</span>
                                            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Aesthetic AI Core</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center py-4">
                <div className="h-[1px] w-12 bg-zinc-100 dark:bg-zinc-800"></div>
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-300 mx-4">Matrix Endpoint Active</p>
                <div className="h-[1px] w-12 bg-zinc-100 dark:bg-zinc-800"></div>
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

export default UserPrompt;
