import React, { useState, useCallback, useEffect } from 'react';
import {
    Cpu,
    Save,
    RefreshCw,
    ShieldCheck,
    Zap,
    Activity,
    Key,
    Sliders,
    Globe,
    AlertCircle,
    Eye,
    EyeOff,
    Terminal,
    Loader2,
    Pencil,
    X,
    Check
} from 'lucide-react';
import aestheticAiConfigService from '../../../models/aestheticAiConfigService';
import ConfirmationModal from '../../../components/ConfirmationModal';

const AIConfig = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

    const [config, setConfig] = useState({
        id: '',
        gemini_api: '',
        gemini_key: '',
        gen_prompt: '',
        gemini_model: '',
    });

    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const response = await aestheticAiConfigService.get();
            if (response.success && response.data) {
                setConfig(response.data);
            }
        } catch (error) {
            console.error('❌ Failed to fetch AI config:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const handleChange = useCallback((key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    }, []);

    const executeSubmit = async () => {
        setSaving(true);
        try {
            const response = await aestheticAiConfigService.update(config.id, {
                gemini_api: config.gemini_api,
                gemini_key: config.gemini_key,
                gen_prompt: config.gen_prompt,
                gemini_model: config.gemini_model
            });
            if (response.success) {
                alert('AI Configuration updated successfully!');
                setIsEditing(false);
            } else {
                alert('Failed to update AI Configuration.');
            }
        } catch (error) {
            alert('Error updating AI Configuration.');
            console.error(error);
        } finally {
            setSaving(false);
            setConfirmConfig({ ...confirmConfig, isOpen: false });
        }
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!config.id) {
            alert("No configuration ID found.");
            return;
        }
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Deploy AI Matrix',
            message: 'Are you sure you want to deploy these changes to the neural core? This impacts all AI-driven components.',
            onConfirm: executeSubmit
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchConfig();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Synchronizing AI Clusters...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">AI Matrix</h1>
                    <div className="flex items-center gap-2 text-indigo-500">
                        <Cpu className="w-3.5 h-3.5" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Orchestration</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-widest"
                        >
                            <Pencil className="w-3.5 h-3.5" /> Edit Config
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-[10px] uppercase tracking-widest"
                            >
                                <X className="w-3.5 h-3.5 inline mr-1" /> Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 text-[10px] uppercase tracking-widest disabled:opacity-50"
                            >
                                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                {saving ? 'Deploying...' : 'Deploy AI'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Core Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-zinc-50/30 dark:bg-zinc-950/20">
                            <Sliders className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em]">Hyperparameters</h3>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputGroup
                                    label="API Cluster URL"
                                    icon={<Globe className="w-4 h-4" />}
                                    value={config.gemini_api}
                                    onChange={(v) => handleChange('gemini_api', v)}
                                    placeholder="Enter API Endpoint"
                                    disabled={!isEditing}
                                    mono
                                />
                                <div className="space-y-2 group">
                                    <div className="flex items-center gap-2 px-1">
                                        <Key className="w-4 h-4 text-indigo-500" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Key</label>
                                    </div>
                                    <div className="relative">
                                        {showApiKey ? (
                                            <textarea
                                                value={config.gemini_key}
                                                onChange={(e) => handleChange('gemini_key', e.target.value)}
                                                disabled={!isEditing}
                                                rows={2}
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-5 pr-14 py-4 text-sm font-mono focus:border-indigo-500 outline-none transition-all group-hover:border-zinc-300 dark:group-hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed resize-none break-all"
                                                placeholder="••••••••••••••••"
                                            />
                                        ) : (
                                            <input
                                                type="password"
                                                value={config.gemini_key}
                                                onChange={(e) => handleChange('gemini_key', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-5 pr-14 py-4 text-sm font-mono focus:border-indigo-500 outline-none transition-all group-hover:border-zinc-300 dark:group-hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                                placeholder="••••••••••••••••"
                                            />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                            className="absolute right-4 top-4 p-2 text-zinc-400 hover:text-indigo-500 transition-colors"
                                        >
                                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex items-center gap-2 px-1">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Model Deployment</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={config.gemini_model}
                                        onChange={(e) => handleChange('gemini_model', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all group-hover:border-zinc-300 dark:group-hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                        <Sliders className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex items-center gap-2 px-1">
                                    <Terminal className="w-4 h-4 text-indigo-500" />
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Prompt Directive</label>
                                </div>
                                <textarea
                                    value={config.gen_prompt}
                                    onChange={(e) => handleChange('gen_prompt', e.target.value)}
                                    disabled={!isEditing}
                                    rows={10}
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] px-6 py-5 text-sm font-medium leading-relaxed focus:border-indigo-500 outline-none transition-all resize-none group-hover:border-zinc-300 dark:group-hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                    placeholder="Enter AI persona guidelines..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Column */}
                <div className="space-y-8 text-center md:text-left">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm space-y-6">
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Ecosystem</h4>
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tighter">Live Connection</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <StatusItem label="Protocol" value="REST/SSL" icon={<ShieldCheck className="w-3.5 h-3.5" />} />
                            <StatusItem label="Latency" value="12ms" icon={<Zap className="w-3.5 h-3.5" />} />
                        </div>

                        <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-2 mt-4 text-left">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Aesthetic Auth</h4>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium italic">
                                This dashboard is securely connected to the dedicated Aesthetic AI backend instance.
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

const InputGroup = ({ label, icon, value, onChange, placeholder, disabled, mono = false }) => (
    <div className="space-y-2 group">
        <div className="flex items-center gap-2 px-1">
            <span className={disabled ? "text-zinc-400" : "text-indigo-500"}>{icon}</span>
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</label>
        </div>
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm focus:border-indigo-500 outline-none transition-all group-hover:border-zinc-300 dark:group-hover:border-zinc-700 disabled:opacity-60 disabled:cursor-not-allowed ${mono ? 'font-mono' : 'font-bold underline-offset-4'}`}
                placeholder={placeholder}
            />
        </div>
    </div>
);

const StatusItem = ({ label, value, icon }) => (
    <div className="flex items-center justify-between group/item">
        <div className="flex items-center gap-2">
            <span className="text-zinc-400 group-hover/item:text-indigo-500 transition-colors">{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{label}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
);

export default AIConfig;
