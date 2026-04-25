import React, { useState, useEffect, useCallback } from 'react';
import {
    Settings,
    ShieldCheck,
    Zap,
    MousePointer2,
    Activity,
    Key,
    Save,
    RefreshCw,
    Pencil,
    X,
    Check,
    LayoutGrid,
    Eye,
    EyeOff,
    Smartphone,
    Globe,
    Loader2
} from 'lucide-react';
import aestheticAdConfigService from '../../../models/aestheticAdConfigService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const AdConfig = () => {
    const [configId, setConfigId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const [form, setForm] = useState({
        ad_click_frequency: 5,
        all_ads_enabled: true,
        app_open_enabled: false,
        banner_enabled: true,
        interstitial_enabled: true,
        rewarded_enabled: true,
    });

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const response = await aestheticAdConfigService.getAdConfig();
            if (response.success && response.data) {
                const { id, ...configData } = response.data;
                setConfigId(id);
                setForm(configData);
            }
        } catch (error) {
            console.error('❌ Failed to fetch Ad Config:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const executeSave = async () => {
        setSaving(true);
        try {
            const response = await aestheticAdConfigService.patchAdConfig(configId, form);
            if (response.success) {
                setIsEditing(false);
                alert('Aesthetic AI Configuration saved successfully!');
            }
        } catch (err) {
            alert(`Unexpected error: ${err?.message}`);
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
            title: 'Commit Ad Configuration',
            message: 'Save these settings to the live Ad server? This will affect global ad delivery.',
            onConfirm: executeSave
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Syncing Ad Parameters...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm shadow-indigo-500/5">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">Ad Settings</h1>
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-0.5">Control Panel Node</p>
                    </div>
                    <p className="text-[9px] font-mono text-zinc-400 mt-1 uppercase">ID: {configId}</p>
                </div>

                <div className="flex items-center gap-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-widest"
                        >
                            <Pencil className="w-4 h-4" /> Edit
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visibility Controls */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Visibility Controls</h3>
                    <div className="space-y-3">
                        <ToggleRow
                            label="All Ads Enabled"
                            icon={<LayoutGrid className="w-4 h-4 text-indigo-500" />}
                            enabled={form.all_ads_enabled}
                            onChange={(val) => setForm({ ...form, all_ads_enabled: val })}
                            disabled={!isEditing}
                        />
                        <ToggleRow
                            label="App Open Ads"
                            icon={<Zap className="w-4 h-4 text-amber-500" />}
                            enabled={form.app_open_enabled}
                            onChange={(val) => setForm({ ...form, app_open_enabled: val })}
                            disabled={!isEditing}
                        />
                        <ToggleRow
                            label="Banner Ads"
                            icon={<Smartphone className="w-4 h-4 text-emerald-500" />}
                            enabled={form.banner_enabled}
                            onChange={(val) => setForm({ ...form, banner_enabled: val })}
                            disabled={!isEditing}
                        />
                        <ToggleRow
                            label="Interstitial Ads"
                            icon={<Activity className="w-4 h-4 text-rose-500" />}
                            enabled={form.interstitial_enabled}
                            onChange={(val) => setForm({ ...form, interstitial_enabled: val })}
                            disabled={!isEditing}
                        />
                        <ToggleRow
                            label="Rewarded Ads"
                            icon={<Check className="w-4 h-4 text-indigo-500" />}
                            enabled={form.rewarded_enabled}
                            onChange={(val) => setForm({ ...form, rewarded_enabled: val })}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {/* Frequency Settings */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">Frequency Settings</h3>
                    <div className="space-y-6 py-4">
                        <InputGroup
                            label="Ad Click Frequency"
                            icon={<MousePointer2 className="w-4 h-4" />}
                            value={form.ad_click_frequency}
                            onChange={(v) => setForm({ ...form, ad_click_frequency: parseInt(v) || 0 })}
                            disabled={!isEditing}
                            type="number"
                            description="Clicks required to trigger advertisements"
                        />

                        <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2 mt-auto">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Aesthetic-AI Live</h4>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
                                This dashboard is connected to the live Aesthetic AI backend. All changes will persist across user sessions.
                            </p>
                        </div>
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
        </div>
    );
};

const ToggleRow = ({ label, icon, enabled, onChange, disabled }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-indigo-500/20 transition-all group">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-tight">{label}</span>
        </div>
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 outline-none disabled:opacity-40 ${enabled ? 'bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.4)]' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const InputGroup = ({ label, icon, value, onChange, disabled, type = "text", description }) => (
    <div className="space-y-2 group">
        <div className="flex items-center gap-2 px-1">
            <span className={disabled ? "text-zinc-400" : "text-indigo-500"}>{icon}</span>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</label>
        </div>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-indigo-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
            />
        </div>
        {description && <p className="text-[10px] text-zinc-400 font-medium ml-1">{description}</p>}
    </div>
);

export default AdConfig;
