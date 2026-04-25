import React, { useState, useEffect, useCallback } from 'react';
import {
    Megaphone,
    Smartphone,
    Monitor,
    Zap,
    Save,
    RefreshCw,
    Pencil,
    X,
    Check,
    Plus,
    Layout,
    Globe,
    Layers,
    Shield,
    Sparkles,
    Copy,
    Trash2,
    Key,
    Loader2
} from 'lucide-react';
import aestheticAdsService from '../../../models/aestheticAdsService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const Ads = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedOn, setSavedOn] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [patchingField, setPatchingField] = useState(null);

    // Unified Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const [configId, setConfigId] = useState('');
    const [originalForm, setOriginalForm] = useState(null);
    const [form, setForm] = useState({
        app_open_ios: '',
        banner_android: '',
        banner_ios: '',
        interstitial_android: '',
        interstitial_ios: '',
        rewarded_android: '',
        rewarded_interstitial_android: '',
        rewarded_interstitial_ios: '',
        rewarded_ios: '',
    });

    const adFieldsMetadata = [
        { id: 'banner_android', label: 'Banner Ad Unit', Icon: Layout, platform: 'android' },
        { id: 'interstitial_android', label: 'Interstitial Ad Unit', Icon: Zap, platform: 'android' },
        { id: 'rewarded_android', label: 'Rewarded Ad Unit', Icon: Sparkles, platform: 'android' },
        { id: 'rewarded_interstitial_android', label: 'Rewarded Interstitial', Icon: Sparkles, platform: 'android' },
        { id: 'app_open_ios', label: 'App Open Ad Unit', Icon: Globe, platform: 'ios' },
        { id: 'banner_ios', label: 'Banner Ad Unit', Icon: Layout, platform: 'ios' },
        { id: 'interstitial_ios', label: 'Interstitial Ad Unit', Icon: Zap, platform: 'ios' },
        { id: 'rewarded_ios', label: 'Rewarded Ad Unit', Icon: Sparkles, platform: 'ios' },
        { id: 'rewarded_interstitial_ios', label: 'Rewarded Interstitial', Icon: Sparkles, platform: 'ios' },
    ];

    const [activeTab, setActiveTab] = useState('android');
    const [customFields, setCustomFields] = useState([]);
    const [createModal, setCreateModal] = useState({ isOpen: false, key: '', value: '' });

    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const response = await aestheticAdsService.getAds();
            if (response.success && response.data) {
                const { id, ...adData } = response.data;
                setConfigId(id);

                // Separate core fields from potential custom ones if they exist in the response
                const coreKeys = Object.keys(form);
                const coreForm = {};
                const custom = [];

                Object.entries(adData).forEach(([key, value]) => {
                    if (coreKeys.includes(key)) {
                        coreForm[key] = value || '';
                    } else if (value && typeof value === 'string') {
                        custom.push({ key, value });
                    }
                });

                setForm(coreForm);
                setOriginalForm(coreForm);
                setCustomFields(custom);
            }
        } catch (error) {
            console.error('❌ Failed to fetch Ads:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleCancel = () => {
        setForm(originalForm);
        setIsEditing(false);
    };

    const executeSave = async () => {
        setSaving(true);
        try {
            // Combine core form and custom fields for update
            const payload = { ...form };
            customFields.forEach(f => {
                payload[f.key] = f.value;
            });

            const response = await aestheticAdsService.patchAds(configId, payload);
            if (response.success) {
                setSavedOn(Date.now());
                setOriginalForm({ ...form });
                setIsEditing(false);
                setTimeout(() => setSavedOn(null), 3000);
            }
        } catch (err) {
            alert(`Update failed: ${err?.message}`);
        } finally {
            setSaving(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleSave = (e) => {
        if (e) e.preventDefault();
        if (!configId) return;
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Commit Ad Registry',
            message: 'Are you sure you want to save these global ad units? This will propagate to all active clients.',
            onConfirm: executeSave
        });
    };

    const executePatch = async (field, value) => {
        if (!configId) return;
        setPatchingField(field);
        try {
            const response = await aestheticAdsService.patchAds(configId, { [field]: value });
            if (response.success) {
                setOriginalForm(prev => ({ ...prev, [field]: value }));
                setSavedOn(Date.now());
                setTimeout(() => setSavedOn(null), 3000);
            }
        } catch (err) {
            alert(`Update failed for ${field}: ${err?.message}`);
        } finally {
            setPatchingField(null);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handlePatch = (field, value) => {
        if (!configId) return;
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Hot-Patch Variable',
            message: `You are about to perform an atomic update on [${field}]. This will bypass the global sync and update the production unit immediately.`,
            onConfirm: () => executePatch(field, value)
        });
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleAddField = () => {
        setCreateModal({ isOpen: true, key: '', value: '' });
    };

    const handleCreateSubmit = (e) => {
        if (e) e.preventDefault();
        if (!createModal.key.trim()) return;
        const newField = { key: createModal.key, value: createModal.value };
        setCustomFields(prev => [...prev, newField]);
        setCreateModal({ isOpen: false, key: '', value: '' });
        const platform = getPlatform(newField.key);
        setActiveTab(platform);
        setIsEditing(true);
    };

    const handleCustomFieldChange = (index, field, value) => {
        setCustomFields(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const openDeleteModal = (type, index) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Remove Variable',
            message: 'Are you sure you want to remove this ad unit? This action cannot be undone.',
            onConfirm: () => {
                if (type === 'custom') {
                    setCustomFields(prev => prev.filter((_, i) => i !== index));
                } else if (type === 'core') {
                    setForm(prev => ({ ...prev, [index]: '' }));
                }
                setConfirmConfig({ ...confirmConfig, isOpen: false });
            }
        });
    };

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value || '');
    };

    const getPlatform = (key) => {
        if (!key) return 'android';
        return key.toLowerCase().includes('ios') ? 'ios' : 'android';
    };

    const filteredFields = activeTab === 'all'
        ? adFieldsMetadata
        : adFieldsMetadata.filter(f => f.platform === activeTab);

    const filteredCustomFields = customFields.filter(f => {
        if (activeTab === 'all') return true;
        return getPlatform(f.key) === activeTab;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Loading Ad Clusters...</p>
            </div>
        );
    }

    const CreateModal = () => {
        if (!createModal.isOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setCreateModal({ ...createModal, isOpen: false })} />
                <form onSubmit={handleCreateSubmit} className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                                <Plus className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Create Variable</h3>
                                <p className="text-xs text-zinc-500 font-medium lowercase font-mono">aesthetic.orchestrate(new_variable)</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Variable Name</label>
                                <input
                                    type="text"
                                    required
                                    value={createModal.key}
                                    onChange={e => setCreateModal({ ...createModal, key: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-emerald-500/50 text-sm font-bold tracking-tight"
                                    placeholder="e.g. ad_ios_banner_v2"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Variable Value</label>
                                <input
                                    type="text"
                                    value={createModal.value}
                                    onChange={e => setCreateModal({ ...createModal, value: e.target.value })}
                                    className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 outline-none focus:border-emerald-500/50 text-sm font-mono"
                                    placeholder="ca-app-pub-..."
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full pt-2">
                            <button type="button" onClick={() => setCreateModal({ ...createModal, isOpen: false })} className="flex-1 px-6 py-4 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-[10px] uppercase tracking-widest">Cancel</button>
                            <button type="submit" className="flex-1 px-6 py-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all text-[10px] uppercase tracking-widest">Create Unit</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

    const ConfirmModalPlaceholder = () => null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm shadow-indigo-500/5">
                <div className="flex items-center gap-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 text-white">
                        <Megaphone className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">Aesthetic Ads</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 font-medium italic lowercase">orchestrating.monetization.clusters</p>
                        <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">ID: {configId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleAddField}
                                className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                            >
                                <Plus className="w-4 h-4 text-indigo-500" /> Create Variable
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 active:scale-95 transition-all rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl"
                            >
                                <Pencil className="w-4 h-4" /> Edit Config
                            </button>
                        </>
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
                                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-500 transition-all rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-indigo-600/20"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tab Switcher & Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl w-fit max-w-full">
                    {[
                        { id: 'android', label: 'Android Layer', Icon: Smartphone },
                        { id: 'ios', label: 'iOS Gateway', Icon: Smartphone },
                        { id: 'all', label: 'Matrix View', Icon: Monitor }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                                }`}
                        >
                            {tab.Icon && <tab.Icon className="w-4 h-4" />}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {isEditing && (
                    <button
                        type="button"
                        onClick={handleAddField}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500/20 transition-all self-end sm:self-auto"
                    >
                        <Plus className="w-4 h-4" /> Add Custom Unit
                    </button>
                )}
            </div>

            {/* Unified List View */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300">
                <div className="p-2">
                    <div className="grid grid-cols-1 divide-y divide-zinc-100 dark:divide-zinc-800">
                        {filteredFields.map((field) => (
                            <div key={field.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all">
                                <div className="flex-1 min-w-[240px] space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${field.platform === 'ios' ? 'bg-purple-500/10 text-purple-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                                            {field.Icon && <field.Icon className="w-4 h-4" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{field.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest ${field.platform === 'ios' ? 'bg-purple-500/10 text-purple-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                                                    {field.platform}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 font-mono italic">{field.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-[2] relative">
                                    <input
                                        type="text"
                                        value={form[field.id]}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/50 text-sm font-mono outline-none transition-all ${isEditing
                                            ? 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5'
                                            : 'border-transparent cursor-not-allowed opacity-60'
                                            }`}
                                        placeholder="ca-app-pub-..."
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(form[field.id])}
                                        title="Copy"
                                        className="p-3 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-500/5 rounded-xl transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>

                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handlePatch(field.id, form[field.id])}
                                                disabled={patchingField === field.id}
                                                className="p-3 text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white rounded-xl transition-all border border-indigo-500/20 disabled:opacity-50"
                                            >
                                                {patchingField === field.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal('core', field.id)}
                                                className="p-3 text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Custom Fields */}
                        {filteredCustomFields.map((field, index) => (
                            <div key={`custom-${index}`} className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all border-l-4 animate-in slide-in-from-left-2 ${getPlatform(field.key) === 'ios' ? 'border-l-purple-500' : 'border-l-indigo-500'}`}>
                                <div className="flex-1 min-w-[240px] space-y-1">
                                    <div className="relative pt-4">
                                        <input
                                            type="text"
                                            value={field.key}
                                            onChange={e => handleCustomFieldChange(index, 'key', e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full bg-transparent text-xs font-black uppercase tracking-widest outline-none border-b border-transparent focus:border-indigo-500/30 py-1 ${getPlatform(field.key) === 'ios' ? 'text-purple-600' : 'text-indigo-600'}`}
                                        />
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest absolute top-0 left-0 ${getPlatform(field.key) === 'ios' ? 'bg-purple-500/10 text-purple-600' : 'bg-indigo-500/10 text-indigo-600'}`}>
                                            Custom {getPlatform(field.key) === 'ios' ? 'iOS' : 'Android'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-[2] relative">
                                    <input
                                        type="text"
                                        value={field.value}
                                        onChange={e => handleCustomFieldChange(index, 'value', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/50 text-sm font-mono outline-none transition-all ${isEditing
                                            ? 'border-zinc-200 dark:border-zinc-800 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5'
                                            : 'border-transparent cursor-not-allowed opacity-60'
                                            }`}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(field.value)}
                                        className="p-3 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-500/5 rounded-xl transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal('custom', index)}
                                                className="p-3 text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CreateModal />
            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
            />

            {/* Notification Toast */}
            {savedOn && !isEditing && (
                <div className="fixed bottom-12 right-12 z-50 flex items-center gap-4 bg-indigo-600 text-white px-8 py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-500/20 animate-in slide-in-from-right-10">
                    <Check className="w-5 h-5 bg-white/20 rounded-full p-2" />
                    <div>
                        <p className="font-black text-sm uppercase tracking-widest text-white">Live Sync Completed</p>
                        <p className="text-[10px] opacity-80 mt-0.5 uppercase tracking-tighter italic text-indigo-100">Aesthetic configurations updated successfully.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ads;
