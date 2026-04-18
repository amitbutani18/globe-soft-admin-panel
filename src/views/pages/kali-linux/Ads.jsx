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
    Trash2
} from 'lucide-react';
import adsService from '../../../models/adsService';

const Ads = () => {
    const [configId, setConfigId] = useState(null);
    const [originalForm, setOriginalForm] = useState(null);
    const [form, setForm] = useState({
        dailyUpdateScreenBannerAd: '',
        dailyUpdateScreenBannerAd_ios: '',
        native_ads: '',
        native_ads_ios: '',
        normalOpenAd: '',
        normalOpenAd_ios: '',
        preInterstitialAd: '',
        preInterstitialAd_ios: '',
        reward_inter: '',
        reward_inter_ios: '',
        splashInterstitialAd: '',
        splashInterstitialAd_ios: '',
        toolsMain: '',
        usbMain: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedOn, setSavedOn] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [patchingField, setPatchingField] = useState(null);


    const adFieldsMetadata = [
        { id: 'dailyUpdateScreenBannerAd', label: 'Daily Update Banner', Icon: Layout, platform: 'android' },
        { id: 'dailyUpdateScreenBannerAd_ios', label: 'Daily Update Banner', Icon: Layout, platform: 'ios' },
        { id: 'native_ads', label: 'Native Ads Unit', Icon: Layers, platform: 'android' },
        { id: 'native_ads_ios', label: 'Native Ads Unit', Icon: Layers, platform: 'ios' },
        { id: 'normalOpenAd', label: 'Normal App Open', Icon: Globe, platform: 'android' },
        { id: 'normalOpenAd_ios', label: 'Normal App Open', Icon: Globe, platform: 'ios' },
        { id: 'splashInterstitialAd', label: 'Splash Interstitial', Icon: Zap, platform: 'android' },
        { id: 'splashInterstitialAd_ios', label: 'Splash Interstitial', Icon: Zap, platform: 'ios' },
        { id: 'preInterstitialAd', label: 'Pre-Interstitial', Icon: Zap, platform: 'android' },
        { id: 'preInterstitialAd_ios', label: 'Pre-Interstitial', Icon: Zap, platform: 'ios' },
        { id: 'reward_inter', label: 'Rewarded Interstitial', Icon: Sparkles, platform: 'android' },
        { id: 'reward_inter_ios', label: 'Rewarded Interstitial', Icon: Sparkles, platform: 'ios' },
        { id: 'toolsMain', label: 'Tools Main Entry', Icon: Layers, platform: 'feature' },
        { id: 'usbMain', label: 'USB Feature Entry', Icon: Layout, platform: 'feature' },
    ];

    const [activeTab, setActiveTab] = useState('android');
    const [customFields, setCustomFields] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, index: null });
    const [createModal, setCreateModal] = useState({ isOpen: false, key: '', value: '' });

    // ── Fetch Initial Data ───────────────────────────────────────────────────
    const fetchAds = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adsService.getAds();
            if (res.success && res.data) {
                const data = res.data;
                setConfigId(data.id || data._id);
                const loadedForm = {
                    dailyUpdateScreenBannerAd: data.dailyUpdateScreenBannerAd || '',
                    dailyUpdateScreenBannerAd_ios: data.dailyUpdateScreenBannerAd_ios || '',
                    native_ads: data.native_ads || '',
                    native_ads_ios: data.native_ads_ios || '',
                    normalOpenAd: data.normalOpenAd || '',
                    normalOpenAd_ios: data.normalOpenAd_ios || '',
                    preInterstitialAd: data.preInterstitialAd || '',
                    preInterstitialAd_ios: data.preInterstitialAd_ios || '',
                    reward_inter: data.reward_inter || '',
                    reward_inter_ios: data.reward_inter_ios || '',
                    splashInterstitialAd: data.splashInterstitialAd || '',
                    splashInterstitialAd_ios: data.splashInterstitialAd_ios || '',
                    toolsMain: data.toolsMain || '',
                    usbMain: data.usbMain || '',
                    updatedAt: data.updatedAt || '',
                    createdAt: data.createdAt || '',
                };
                setForm(loadedForm);
                setOriginalForm(loadedForm);
                if (data.customFields) setCustomFields(data.customFields);
                setIsCreating(false);
            } else {
                setIsCreating(true);
                setIsEditing(true);
            }
        } catch (e) {
            console.error('Error fetching ads configuration:', e);
            setIsCreating(true);
            setIsEditing(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAds();
    }, [fetchAds]);

    const handleCancel = () => {
        setForm(originalForm || {
            dailyUpdateScreenBannerAd: '',
            dailyUpdateScreenBannerAd_ios: '',
            native_ads: '',
            native_ads_ios: '',
            normalOpenAd: '',
            normalOpenAd_ios: '',
            preInterstitialAd: '',
            preInterstitialAd_ios: '',
            reward_inter: '',
            reward_inter_ios: '',
            splashInterstitialAd: '',
            splashInterstitialAd_ios: '',
            toolsMain: '',
            usbMain: '',
        });
        setCustomFields(originalForm?.customFields || []);
        setIsEditing(false);
        if (!configId) setIsCreating(true);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setSavedOn(null);
        try {
            const activeCustomFields = customFields.filter(f => f && f.key && f.key.trim() !== '');
            const payload = { ...form, customFields: activeCustomFields };

            if (isCreating) {
                const res = await adsService.createAds(payload);
                if (res.message.includes('success') || res.success) {
                    setSavedOn(Date.now());
                    await fetchAds();
                }
            } else {
                if (!configId) return;
                await adsService.patchAds(configId, payload);
                setSavedOn(Date.now());
                setOriginalForm({ ...form, customFields: activeCustomFields });
                setIsEditing(false);
            }
            setTimeout(() => setSavedOn(null), 3000);
        } catch (err) {
            alert(`${isCreating ? 'Creation' : 'Update'} failed: ${err?.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handlePatch = async (field, value) => {
        if (!configId) {
            alert('Cannot update: No configuration ID found. Please create a configuration first.');
            return;
        }
        setPatchingField(field);
        try {
            const res = await adsService.patchAds(configId, { [field]: value });
            if (res.success || res.message?.includes('success')) {
                setOriginalForm(prev => ({ ...prev, [field]: value }));
                // If it was a custom field, update it in originalForm's customFields array too
                if (typeof field === 'number') {
                    setCustomFields(prev => {
                        const next = [...prev];
                        next[field] = { ...next[field], value };
                        return next;
                    });
                }
                setSavedOn(Date.now());
                setTimeout(() => setSavedOn(null), 3000);
            }
        } catch (err) {
            alert(`Update failed for ${field}: ${err?.message}`);
        } finally {
            setPatchingField(null);
        }
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

        // Auto-switch tab based on the new variable's name
        const platform = getPlatform(newField.key);
        setActiveTab(platform);
        setIsEditing(true); // Ensure we are in edit mode to see the changes
    };

    const handleCustomFieldChange = (index, field, value) => {
        setCustomFields(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const openDeleteModal = (type, index) => {
        setDeleteModal({ isOpen: true, type, index });
    };

    const handleConfirmDelete = async () => {
        const { type, index } = deleteModal;
        if (type === 'custom') {
            setCustomFields(prev => prev.filter((_, i) => i !== index));
        } else if (type === 'core') {
            setForm(prev => ({ ...prev, [index]: '' }));
        }
        setDeleteModal({ isOpen: false, type: null, index: null });
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
        if (activeTab === 'feature') return false;
        return getPlatform(f.key) === activeTab;
    });

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
                                <p className="text-xs text-zinc-500 font-medium lowercase font-mono">system.orchestrate(new_variable)</p>
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

    const ConfirmModal = () => {
        if (!deleteModal.isOpen) return null;
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteModal({ isOpen: false, type: null, index: null })} />
                <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col items-center text-center gap-6">
                        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Remove Variable</h3>
                            <p className="text-sm text-zinc-500 font-medium">Are you sure you want to remove this ad unit? This action cannot be undone once committed.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                            <button onClick={() => setDeleteModal({ isOpen: false, type: null, index: null })} className="flex-1 px-6 py-3 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-[10px] uppercase tracking-widest">Cancel</button>
                            <button onClick={handleConfirmDelete} className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-rose-500 hover:bg-rose-400 shadow-lg shadow-rose-500/20 transition-all text-[10px] uppercase tracking-widest">Delete Variable</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Synchronizing Ad Units...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm transition-all duration-300">
                <div className="flex items-center gap-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 text-white">
                        <Megaphone className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Ads Management</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 font-medium">Unified AdMob unit orchestration for cross-platform expansion.</p>
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
                                <Plus className="w-4 h-4 text-emerald-500" /> Create New
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
                                className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white hover:bg-emerald-400 transition-all rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-emerald-500/20"
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
                        { id: 'android', label: 'Android Matrix', Icon: Smartphone },
                        { id: 'ios', label: 'iOS Gateway', Icon: Smartphone },
                        { id: 'feature', label: 'Features', Icon: Layers },
                        { id: 'all', label: 'View All', Icon: Monitor }
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all self-end sm:self-auto"
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
                                {/* Info Column */}
                                <div className="flex-1 min-w-[240px] space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${field.platform === 'ios' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {field.Icon && <field.Icon className="w-4 h-4" />}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">{field.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest ${field.platform === 'ios' ? 'bg-blue-500/10 text-blue-600' :
                                                    field.platform === 'android' ? 'bg-emerald-500/10 text-emerald-600' :
                                                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                                    }`}>
                                                    {field.platform}
                                                </span>
                                                <span className="text-[10px] text-zinc-400 font-mono italic">{field.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Column */}
                                <div className="flex-[2] relative">
                                    <input
                                        type="text"
                                        value={form[field.id]}
                                        onChange={e => handleChange(field.id, e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/50 text-sm font-mono outline-none transition-all ${isEditing
                                            ? 'border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5'
                                            : 'border-transparent cursor-not-allowed opacity-60'
                                            }`}
                                        placeholder="ca-app-pub-..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(form[field.id])}
                                        title="Copy to clipboard"
                                        className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>

                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handlePatch(field.id, form[field.id])}
                                                disabled={patchingField === field.id}
                                                title="Update field"
                                                className="p-3 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20 disabled:opacity-50"
                                            >
                                                {patchingField === field.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal('core', field.id)}
                                                title="Clear field"
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
                            <div key={`custom-${index}`} className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all border-l-4 animate-in slide-in-from-left-2 ${getPlatform(field.key) === 'ios' ? 'border-l-blue-500' : 'border-l-emerald-500'}`}>
                                {/* Info Column */}
                                <div className="flex-1 min-w-[240px] space-y-1">
                                    <div className="relative pt-4">
                                        <input
                                            type="text"
                                            value={field.key}
                                            onChange={e => handleCustomFieldChange(index, 'key', e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="VARIABLE_NAME"
                                            className={`w-full bg-transparent text-xs font-black uppercase tracking-widest outline-none border-b border-transparent focus:border-emerald-500/30 py-1 ${getPlatform(field.key) === 'ios' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                                        />
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-widest absolute top-0 left-0 ${getPlatform(field.key) === 'ios' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                            Custom {getPlatform(field.key) === 'ios' ? 'iOS' : 'Android'}
                                        </span>
                                    </div>
                                </div>

                                {/* Input Column */}
                                <div className="flex-[2] relative">
                                    <input
                                        type="text"
                                        value={field.value}
                                        onChange={e => handleCustomFieldChange(index, 'value', e.target.value)}
                                        disabled={!isEditing}
                                        className={`w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-950/50 text-sm font-mono outline-none transition-all ${isEditing
                                            ? 'border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5'
                                            : 'border-transparent cursor-not-allowed opacity-60'
                                            }`}
                                        placeholder="Enter value..."
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(field.value)}
                                        title="Copy to clipboard"
                                        className="p-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>

                                    {isEditing && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handlePatch('customFields', customFields)}
                                                disabled={patchingField === 'customFields'}
                                                title="Update custom variables"
                                                className="p-3 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20 disabled:opacity-50"
                                            >
                                                {patchingField === 'customFields' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal('custom', index)}
                                                title="Remove field"
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
            <ConfirmModal />

            {/* Notification Toast */}
            {savedOn && !isEditing && (
                <div className="fixed bottom-12 right-12 z-50 flex items-center gap-4 bg-emerald-500 text-white px-8 py-5 rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 animate-in slide-in-from-right-10">
                    <Check className="w-5 h-5 bg-white/20 rounded-full p-2" />
                    <div>
                        <p className="font-black text-sm uppercase tracking-widest">Global Sync Completed</p>
                        <p className="text-[10px] opacity-80 mt-0.5 uppercase tracking-tighter italic">Ad units successfully deployed to cloud clusters.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ads;


