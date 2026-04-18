import React, { useState, useEffect, useCallback } from 'react';
import {
    Settings,
    Shield,
    Bot,
    MousePointer2,
    Globe,
    Zap,
    Save,
    RefreshCw,
    Pencil,
    X,
    Check,
    LayoutGrid,
    Key,
    Activity,
    Cloud,
    Users,
    Container,
    Terminal,
    Box,
    Eye,
    EyeOff,
    Plus,
    Trash2
} from 'lucide-react';
import adConfigService from '../../../models/adConfigService';

const AdConfig = () => {
    const [configId, setConfigId] = useState(null);
    const [originalForm, setOriginalForm] = useState(null);
    const [form, setForm] = useState({
        aiChatFreeCount: 0,
        click: 0,
        cloudMain: '',
        communityMain: '',
        containerMain: '',
        showOpenAdInSplash: false,
        native_ads_enabled: false,
        showreview: false,
        virtulizationMain: '',
        wslMain: '',
        openAiApiKey: '',
        premium_click: 0,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedOn, setSavedOn] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [activeSection, setActiveSection] = useState('general');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, index: null });

    // ── Fetch Initial Data ───────────────────────────────────────────────────
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await adConfigService.getAdConfig();
            if (res.success && res.data) {
                const data = res.data;
                setConfigId(data.id || data._id);
                const loadedForm = {
                    aiChatFreeCount: data.aiChatFreeCount ?? 0,
                    click: data.click ?? 0,
                    cloudMain: data.cloudMain || '',
                    communityMain: data.communityMain || '',
                    containerMain: data.containerMain || '',
                    showOpenAdInSplash: !!data.showOpenAdInSplash,
                    native_ads_enabled: !!data.native_ads_enabled,
                    showreview: !!data.showreview,
                    virtulizationMain: data.virtulizationMain || '',
                    wslMain: data.wslMain || '',
                    openAiApiKey: data.openAiApiKey || '',
                    premium_click: data.premium_click ?? 0,
                };
                setForm(loadedForm);
                setOriginalForm(loadedForm);
                // Also load custom fields if they exist in the response
                if (data.customFields) {
                    setCustomFields(data.customFields);
                }
            }
        } catch (e) {
            console.error('Error fetching ad configuration:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    // ── Controls ────────────────────────────────────────────────────────────
    const handleCreateNew = () => {
        // preserve existing form data as base
        // setConfigId(null); // Keep or clear ID? Usually clear for "New", but user said "remain all data"
        setIsCreating(true);
        setIsEditing(true);
        setActiveSection('advanced');
        setCustomFields(prev => [...prev, { key: '', value: '' }]);
    };

    const handleCancel = () => {
        setForm(originalForm || {
            aiChatFreeCount: 0,
            click: 0,
            cloudMain: '',
            communityMain: '',
            containerMain: '',
            showOpenAdInSplash: false,
            native_ads_enabled: false,
            showreview: false,
            virtulizationMain: '',
            wslMain: '',
            openAiApiKey: '',
            premium_click: 0,
        });
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleAddField = () => {
        setCustomFields(prev => [...prev, { key: '', value: '' }]);
    };

    const openDeleteModal = (type, index = null) => {
        setDeleteModal({ isOpen: true, type, index });
    };

    const handleConfirmDelete = async () => {
        const { type, index } = deleteModal;
        if (type === 'variable') {
            setCustomFields(prev => prev.filter((_, i) => i !== index));
        } else if (type === 'core') {
            // "Deleting" a core variable resets it to empty/0/false
            const booleanFields = ['showOpenAdInSplash', 'native_ads_enabled', 'showreview'];
            let defaultValue = '';
            if (booleanFields.includes(index)) {
                defaultValue = false;
            } else if (index === 'aiChatFreeCount' || index === 'click') {
                defaultValue = 0;
            }
            setForm(prev => ({ ...prev, [index]: defaultValue }));
        } else if (type === 'config') {
            console.log('Global deletion (pending new API)');
            alert('Global deletion functionality is temporarily disabled. Please wait for the new API implementation.');
        }
        setDeleteModal({ isOpen: false, type: null, index: null });
    };

    const handleFieldChange = (index, field, value) => {
        setCustomFields(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        setSavedOn(null);
        try {
            // Filter out empty custom fields
            const activeCustomFields = customFields.filter(f => f.key.trim() !== '');
            const payload = { ...form, customFields: activeCustomFields };

            if (isCreating) {
                console.log('Creation payload (pending new API):', payload);
                alert('Creation functionality is temporarily disabled. Please wait for the new API implementation.');
                setSaving(false);
                return;
            }

            await adConfigService.updateAdConfig(configId, payload);
            setSavedOn(Date.now());
            setOriginalForm({ ...form });
            setIsEditing(false);
            setTimeout(() => setSavedOn(null), 3000);
        } catch (err) {
            alert(`Update failed: ${err?.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // ── UI Components ────────────────────────────────────────────────────────
    const ConfigRow = ({ label, field, icon: Icon, type = "text", placeholder = "", showToggle, isShown, onToggle, description }) => {
        const inputBaseCls = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:border-green-500/50 text-sm placeholder:text-zinc-400";

        return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
                <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">{label}</label>
                    </div>
                    {description && <p className="text-[11px] text-zinc-500 font-medium">{description}</p>}
                </div>
                <div className="flex-1 max-w-sm flex items-center gap-3">
                    <div className="relative flex-1">
                        {showToggle && isShown ? (
                            <textarea
                                value={form[field]}
                                onChange={e => handleChange(field, e.target.value)}
                                disabled={!isEditing}
                                rows={2}
                                className={`${inputBaseCls} resize-none pr-10 pt-3`}
                                placeholder={placeholder}
                            />
                        ) : (
                            <input
                                type={showToggle ? (isShown ? 'text' : 'password') : type}
                                value={form[field]}
                                onChange={e => handleChange(field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                                disabled={!isEditing}
                                className={`${inputBaseCls} ${showToggle ? 'pr-10' : ''}`}
                                placeholder={placeholder}
                            />
                        )}
                        {showToggle && (
                            <button
                                type="button"
                                onClick={onToggle}
                                className={`absolute right-3 ${isShown ? 'top-3' : 'top-1/2 -translate-y-1/2'} p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors`}
                            >
                                {isShown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => openDeleteModal('core', field)}
                            className="p-2.5 text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const SettingToggle = ({ label, field, icon: Icon, description }) => (
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors group">
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight">{label}</span>
                    {description && <p className="text-[11px] text-zinc-500 font-medium">{description}</p>}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    disabled={!isEditing}
                    onClick={() => handleChange(field, !form[field])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${form[field] ? 'bg-green-600' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form[field] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={() => openDeleteModal('core', field)}
                        className="p-2.5 text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );

    const ConfirmModal = () => {
        if (!deleteModal.isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setDeleteModal({ isOpen: false, type: null, index: null })} />
                <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
                    <div className="flex flex-col items-center text-center gap-6">
                        <div className="p-4 rounded-full bg-amber-500/10 text-amber-500">
                            <Trash2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Confirm Deletion</h3>
                            <p className="text-sm text-zinc-500 font-medium font-mono text-amber-600/80 uppercase tracking-tighter">Action: system.deleteVariable(index:{deleteModal.index})</p>
                            <p className="text-sm text-zinc-500 font-medium">
                                Are you sure you want to remove this variable? This will remove it from the local state until you persist changes.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, type: null, index: null })}
                                className="flex-1 px-6 py-3 rounded-2xl font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="flex-1 px-6 py-3 rounded-2xl font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 transition-all text-xs uppercase tracking-widest"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
                <RefreshCw className="w-6 h-6 text-green-500 animate-spin" />
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Syncing configurations...</p>
            </div>
        );
    }

    const navigationItems = [
        { id: 'general', label: 'AI & Core', icon: Bot },
        { id: 'routing', label: 'Navigation', icon: Globe },
        { id: 'ads', label: 'Advertising', icon: Zap },
        { id: 'advanced', label: 'Advanced', icon: Terminal },
    ];

    return (
        <div className="max-w-6xl mx-auto py-10 px-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-1.5 min-w-0">
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Ad Config</h1>
                    <div className="flex items-center gap-3">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <Settings className="w-4 h-4 text-green-500" /> System Orchestration
                        </p>
                        {isEditing && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                Live Editing
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={handleCreateNew}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs uppercase tracking-widest shadow-sm"
                            >
                                <Plus className="w-4 h-4 text-green-500" /> New Config
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-8 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 text-xs uppercase tracking-widest"
                            >
                                <Pencil className="w-4 h-4" /> Edit Parameters
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                className="px-6 py-2.5 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-white transition-colors text-xs uppercase tracking-widest"
                            >
                                <X className="w-4 h-4 inline mr-1" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-10 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Persist Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-64 shrink-0 space-y-2 sticky top-8">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest border border-transparent ${activeSection === item.id
                                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-2xl transition-colors duration-300">
                    <form onSubmit={handleSave}>
                        <div className="p-8">
                            {activeSection === 'general' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">AI & Core Thresholds</h2>
                                        <p className="text-xs text-zinc-500 font-medium">Define usage limits and AI computational keys.</p>
                                    </div>
                                    <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/20">
                                        <ConfigRow label="Free Chat Count" field="aiChatFreeCount" icon={Activity} type="number" description="How many AI messages a guest user can send." />
                                        <ConfigRow label="Click Frequency" field="click" icon={MousePointer2} type="number" description="Interval threshold for user interactions." />
                                        <ConfigRow label="Premium Click" field="premium_click" icon={Zap} type="number" description="Threshold for premium user interactions." />
                                        <ConfigRow
                                            label="OpenAI API Key"
                                            field="openAiApiKey"
                                            icon={Key}
                                            type="password"
                                            placeholder="sk-..."
                                            showToggle={true}
                                            isShown={showApiKey}
                                            onToggle={() => setShowApiKey(!showApiKey)}
                                            description="Key used for all AI core operations."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'routing' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Navigation Routing</h2>
                                        <p className="text-xs text-zinc-500 font-medium">Centralized endpoints for app-wide redirection.</p>
                                    </div>
                                    <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/20">
                                        <ConfigRow label="Cloud Main" field="cloudMain" icon={Cloud} placeholder="/cloud/main" />
                                        <ConfigRow label="Community Main" field="communityMain" icon={Users} placeholder="/community" />
                                        <ConfigRow label="Container Port" field="containerMain" icon={Container} placeholder="8080" />
                                        <ConfigRow label="Virtualization" field="virtulizationMain" icon={Box} placeholder="/virt" />
                                        <ConfigRow label="WSL Interface" field="wslMain" icon={Terminal} placeholder="/wsl" />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'ads' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Advertising & Visibility</h2>
                                        <p className="text-xs text-zinc-500 font-medium">Toggle monetization and platform review prompts.</p>
                                    </div>
                                    <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/20">
                                        <SettingToggle label="Splash Ads" field="showOpenAdInSplash" icon={Zap} description="Show high-revenue ads on initial application load." />
                                        <SettingToggle label="Native Ads" field="native_ads_enabled" icon={LayoutGrid} description="Enable contextual advertisements in list views." />
                                        <SettingToggle label="Review Prompt" field="showreview" icon={Check} description="Trigger market review invitations to users." />
                                    </div>
                                </div>
                            )}

                            {activeSection === 'advanced' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Additional Parameters</h2>
                                            <p className="text-xs text-zinc-500 font-medium font-mono text-green-600/80">system.customVariables[]</p>
                                        </div>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={handleAddField}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-500/20 hover:bg-green-500/20 transition-all"
                                            >
                                                <Plus className="w-3 h-3" /> Add Var
                                            </button>
                                        )}
                                    </div>

                                    {customFields.length === 0 ? (
                                        <div className="py-16 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem] flex flex-col items-center gap-3">
                                            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full">
                                                <Terminal className="w-8 h-8 text-zinc-300" />
                                            </div>
                                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">No custom variables defined</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {customFields.map((field, index) => (
                                                <div key={index} className="flex items-center gap-3 group animate-in slide-in-from-left-2 duration-200">
                                                    <div className="relative flex-1">
                                                        <input
                                                            type="text"
                                                            value={field.key}
                                                            onChange={e => handleFieldChange(index, 'key', e.target.value)}
                                                            disabled={!isEditing}
                                                            placeholder="VAR_NAME"
                                                            className="w-full px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 outline-none focus:border-green-500/50 text-xs font-black uppercase tracking-widest placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                                        />
                                                    </div>
                                                    <div className="relative flex-[2]">
                                                        <input
                                                            type="text"
                                                            value={field.value}
                                                            onChange={e => handleFieldChange(index, 'value', e.target.value)}
                                                            disabled={!isEditing}
                                                            placeholder="value"
                                                            className="w-full px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950 outline-none focus:border-green-500/50 text-sm font-medium"
                                                        />
                                                    </div>
                                                    {isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteModal('variable', index)}
                                                            className="flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 rounded-xl hover:text-white transition-all border border-rose-500/20 shadow-sm"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Remove</span>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal />

            {/* Notification */}
            {savedOn && !isEditing && (
                <div className="fixed bottom-10 right-10 flex items-center gap-3 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-xl shadow-green-600/20 animate-in fade-in slide-in-from-right-10">
                    <Check className="w-5 h-5 bg-white/20 rounded-full p-1" />
                    <span className="font-bold text-xs uppercase tracking-widest">Orchestration Persisted</span>
                </div>
            )}
        </div>
    );
};

export default AdConfig;

