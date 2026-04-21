import React, { useState, useEffect, useCallback } from 'react';
import {
    Activity,
    Zap,
    Users,
    Save,
    RefreshCw,
    Pencil,
    Check,
    Loader2,
    Layers,
    Star,
    Sliders,
    Settings,
    Shield
} from 'lucide-react';
import aestheticLimitsService from '../../../models/aestheticLimitsService';

const ImageLimit = () => {
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [patchingField, setPatchingField] = useState(null);

    const [form, setForm] = useState({
        free_user_limit: 0,
        premium_user_daily_limit: 0
    });

    const [originalForm, setOriginalForm] = useState({
        free_user_limit: 0,
        premium_user_daily_limit: 0
    });

    const fetchLimits = useCallback(async () => {
        setLoading(true);
        try {
            const response = await aestheticLimitsService.getLimits();
            if (response && response.success && response.data) {
                const { id: docId, ...limitData } = response.data;
                setId(docId || '');
                const sanitizedData = {
                    free_user_limit: limitData.free_user_limit || 0,
                    premium_user_daily_limit: limitData.premium_user_daily_limit || 0
                };
                setForm(sanitizedData);
                setOriginalForm(sanitizedData);
            }
        } catch (error) {
            console.error('❌ Failed to fetch limits:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLimits();
    }, [fetchLimits]);

    const handleCancel = () => {
        setForm(originalForm);
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!id) return;
        setSaving(true);
        try {
            const response = await aestheticLimitsService.updateLimits(id, form);
            if (response && response.success) {
                setOriginalForm(form);
                setIsEditing(false);
                alert('Quota configurations updated successfully!');
            }
        } catch (err) {
            alert(`Update failed: ${err?.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handlePatch = async (field, value) => {
        if (!id) return;
        setPatchingField(field);
        try {
            const response = await aestheticLimitsService.updateLimits(id, { [field]: value });
            if (response && response.success) {
                setOriginalForm(prev => ({ ...prev, [field]: value }));
            }
        } catch (err) {
            alert(`Patch failed for ${field}: ${err?.message}`);
        } finally {
            setPatchingField(null);
        }
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 font-mono">Calibrating Quota Clusters...</p>
            </div>
        );
    }

    const limitFields = [
        {
            id: 'free_user_limit',
            label: 'Free Tier Daily limit',
            Icon: Layers,
            description: 'Standard generation tokens for guest users',
            color: 'text-zinc-500',
            bgColor: 'bg-zinc-100'
        },
        {
            id: 'premium_user_daily_limit',
            label: 'Premium Daily Limit',
            Icon: Star,
            description: 'High-priority tokens for subscribed users',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-500/10'
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Premium Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm shadow-indigo-500/5">
                <div className="flex items-center gap-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 text-white">
                        <Sliders className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">Quota Matrix</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 font-medium italic lowercase tracking-wider">orchestrating.generation.limits</p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">Node ID: {id || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-10 py-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white hover:scale-105 active:scale-95 transition-all rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl"
                        >
                            <Pencil className="w-4 h-4" /> Configure
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-4 text-zinc-500 hover:text-rose-500 transition-colors font-bold text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white hover:bg-indigo-500 transition-all rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Sync Quota
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* List View Container */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/30 dark:bg-zinc-950/20">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">Parameter Registry</h3>
                </div>

                <div className="p-2">
                    <div className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800">
                        {limitFields.map((field) => {
                            const Icon = field.Icon || Settings;
                            return (
                                <div key={field.id} className="group flex flex-col sm:flex-row sm:items-center gap-6 p-8 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                                    <div className="flex-1 min-w-[280px] space-y-1">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${field.bgColor || 'bg-zinc-100'} ${field.color || 'text-zinc-500'} shadow-sm group-hover:scale-110 transition-transform`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{field.label}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-zinc-400 font-mono italic">{field.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-zinc-400 font-medium ml-14 max-w-xs">{field.description}</p>
                                    </div>

                                    <div className="flex-1 max-w-sm relative">
                                        <input
                                            type="number"
                                            value={form[field.id] || 0}
                                            onChange={e => handleChange(field.id, parseInt(e.target.value) || 0)}
                                            disabled={!isEditing}
                                            className={`w-full px-6 py-4 rounded-[1.5rem] border bg-zinc-50/50 dark:bg-zinc-950/50 text-base font-bold outline-none transition-all ${isEditing
                                                ? 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500/50 focus:ring-8 focus:ring-indigo-500/5'
                                                : 'border-transparent cursor-not-allowed opacity-60'
                                                }`}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                            Images
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex items-center gap-2 pl-4">
                                            <button
                                                type="button"
                                                onClick={() => handlePatch(field.id, form[field.id])}
                                                disabled={patchingField === field.id}
                                                className="p-4 text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white rounded-2xl transition-all border border-indigo-500/20 disabled:opacity-50 shadow-sm"
                                            >
                                                {patchingField === field.id ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Information Badge */}
            <div className="max-w-2xl p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] space-y-3">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600">Local Sandbox Protection</h4>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium italic">
                    These limits are exclusively applied within the Aesthetic AI module. Changes are synchronized in real-time with the production backend and persist across all user sessions.
                </p>
            </div>
        </div>
    );
};

export default ImageLimit;
