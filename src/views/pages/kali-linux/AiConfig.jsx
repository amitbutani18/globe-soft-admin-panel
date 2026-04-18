import React, { useState, useEffect, useCallback } from 'react';
import {
    Save,
    RefreshCw,
    Cpu,
    Link as LinkIcon,
    Key,
    MessageSquare,
    Sparkles,
    Zap,
    AlertCircle,
    Check,
    Pencil,
    X
} from 'lucide-react';
import kaliAiConfigService from '../../../models/kaliAiConfigService';

const AiConfig = () => {
    const [configId, setConfigId] = useState(null);
    const [originalForm, setOriginalForm] = useState(null); // Keep track of original to allow cancel
    const [form, setForm] = useState({
        gemini_model: '',
        gemini_api: '',
        gemini_key: '',
        gemini_prompt: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedOn, setSavedOn] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // ── Fetch Initial Data ───────────────────────────────────────────────────
    const fetchConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await kaliAiConfigService.getAll();
            const dataArr = res.data ?? [];
            if (dataArr.length > 0) {
                const cfg = dataArr[0];
                setConfigId(cfg.id);
                const loadedForm = {
                    gemini_model: cfg.gemini_model || '',
                    gemini_api: cfg.gemini_api || '',
                    gemini_key: cfg.gemini_key || '',
                    gemini_prompt: cfg.gemini_prompt || '',
                };
                setForm(loadedForm);
                setOriginalForm(loadedForm); // Cache the fetched state
            }
        } catch (e) {
            console.error('Error fetching config:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    // ── Edit Controls ────────────────────────────────────────────────────────
    const handleCancel = () => {
        setForm(originalForm); // Revert to cached
        setIsEditing(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!configId) {
            alert('Wait for configuration to load initially before saving.');
            return;
        }
        setSaving(true);
        setSavedOn(null);
        try {
            await kaliAiConfigService.update(configId, form);
            setSavedOn(Date.now());
            setOriginalForm(form); // Update cached save state
            setIsEditing(false); // Lock it again
            setTimeout(() => setSavedOn(null), 3000);
        } catch (err) {
            alert(`Failed back sync update: ${err?.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // ── Pre-styled Field Classes ─────────────────────────────────────────────
    const focusCls = isEditing ? 'focus:border-green-500/50 focus:ring-4 focus:ring-green-500/10' : '';
    // visually dim fields if NOT editing
    const stateVisuals = isEditing
        ? 'bg-white/70 dark:bg-zinc-950/50 border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-zinc-100'
        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed opacity-80';

    const inputCls = `w-full border backdrop-blur-md rounded-2xl px-5 py-4 outline-none transition-all duration-300 text-sm font-medium ${focusCls} ${stateVisuals} placeholder:text-zinc-400`;
    const labelCls = 'text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-2 mb-2 flex items-center gap-2';

    // ── Loading Skeleton ─────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                    <RefreshCw className="w-12 h-12 text-green-500 animate-spin relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-500">Connecting to Core Service</h2>
                    <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest animate-pulse gap-2">fetching registry metrics</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12">

            {/* Header Area */}
            <div className="relative">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 text-white shrink-0">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">AI Engine Setup</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm leading-relaxed max-w-xl">
                                Configure the upstream generative language model pipeline based on Gemini credentials setup.
                            </p>
                        </div>
                    </div>

                    {/* Master Action Toggle */}
                    <div>
                        {!isEditing ? (
                            <button type="button" onClick={() => setIsEditing(true)}
                                className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-all rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg">
                                <Pencil className="w-4 h-4" /> Edit Connection
                            </button>
                        ) : (
                            <div className="flex bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl px-4 py-3 items-center gap-2 text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in-95">
                                <AlertCircle className="w-4 h-4" /> Modification Mode Active
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dashboard Form */}
            <form onSubmit={handleSave} className="relative z-10 grid gap-8 md:grid-cols-12">

                {/* Section: Engine Details */}
                <div className="md:col-span-4 space-y-6">
                    <div className="sticky top-8">
                        <div className="flex items-center gap-3 mb-3 text-zinc-900 dark:text-zinc-100">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <h2 className="text-lg font-bold">Connection Params</h2>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                            Target the correct environment space for your designated application logic. These credentials authorize direct payload bridging.
                        </p>

                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <div className="text-xs space-y-1">
                                    <p className="font-bold uppercase tracking-wider">Warning</p>
                                    <p className="opacity-80">Do not expose these configs on user-facing platforms. Modifying the API target affects all client requests immediately after applying.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-8 flex flex-col gap-6">
                    {/* Glassmorphic Panel 1 */}
                    <div className={`bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border ${isEditing ? 'border-green-500/30 shadow-green-500/5' : 'border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300'} rounded-[2rem] p-8 shadow-sm transition-all relative overflow-hidden group`}>
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0'}`}></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Model */}
                            <div>
                                <label className={labelCls}>
                                    <Cpu className="w-3.5 h-3.5 text-green-500" /> Model Designation
                                </label>
                                <input type="text" value={form.gemini_model} onChange={e => handleChange('gemini_model', e.target.value)}
                                    disabled={!isEditing}
                                    className={`${inputCls} font-mono`} placeholder="gemini-2.5-flash-image" required />
                            </div>

                            {/* Base URL */}
                            <div>
                                <label className={labelCls}>
                                    <LinkIcon className="w-3.5 h-3.5 text-blue-500" /> Endpoint URL
                                </label>
                                <input type="url" value={form.gemini_api} onChange={e => handleChange('gemini_api', e.target.value)}
                                    disabled={!isEditing}
                                    className={`${inputCls} font-mono`} placeholder="https://" required />
                            </div>

                            {/* API Key */}
                            <div className="md:col-span-2">
                                <label className={labelCls}>
                                    <Key className="w-3.5 h-3.5 text-amber-500" /> Authorized API Key
                                </label>
                                <input type="text" value={form.gemini_key} onChange={e => handleChange('gemini_key', e.target.value)}
                                    disabled={!isEditing}
                                    className={`${inputCls} font-mono`} placeholder="AIzaSy..." required />
                                <p className="text-[10px] text-zinc-400 font-mono mt-2 ml-2">Keys strictly bypass frontend and act via backend bridging only.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section: System Prompt Setup */}
                    <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50"></div>

                    <div className={`bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border ${isEditing ? 'border-blue-500/30' : 'border-zinc-200/80 dark:border-zinc-800/80'} rounded-[2rem] p-8 shadow-sm transition-all relative overflow-hidden group`}>
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-400 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-0'}`}></div>

                        <div className="flex items-center gap-3 mb-6 text-zinc-900 dark:text-zinc-100">
                            <div className={`w-8 h-8 rounded-full ${isEditing ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center transition-all`}>
                                <MessageSquare className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-bold tracking-tight">System Prompt Engineering</h3>
                        </div>

                        <div>
                            <textarea value={form.gemini_prompt} onChange={e => handleChange('gemini_prompt', e.target.value)}
                                disabled={!isEditing}
                                className={`${inputCls} min-h-[300px] resize-y font-mono text-[13px] leading-relaxed custom-scrollbar`}
                                placeholder="Enter system instructions constraints to condition the base model..." required />
                        </div>
                    </div>

                    {/* Conditional Submit Bar */}
                    {isEditing && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8 p-6 bg-zinc-900 dark:bg-zinc-950 rounded-3xl shadow-xl shadow-zinc-900/20 border border-zinc-800 animate-in slide-in-from-bottom-8 fade-in">

                            <button type="button" onClick={handleCancel} disabled={saving}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors font-bold text-xs uppercase tracking-widest">
                                <X className="w-4 h-4" /> Cancel Modifying
                            </button>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <button type="submit" disabled={saving || !configId}
                                    className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-8 py-3.5 bg-green-500 hover:bg-green-400 text-white transition-all rounded-xl font-bold uppercase tracking-[0.2em] text-xs outline-none focus:ring-4 focus:ring-green-500/20 shadow-lg shadow-green-500/20 disabled:opacity-50">
                                    {saving ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Syncing...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" /> Save Configuration
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Success Toast / Notification */}
                    {savedOn && !isEditing && (
                        <div className="fixed bottom-10 right-10 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-green-500/20 animate-in slide-in-from-bottom-8 fade-in duration-300">
                            <Check className="w-5 h-5 bg-white/20 rounded-full p-0.5" />
                            <p className="font-bold text-sm tracking-wide">Sync Completed Successfully</p>
                        </div>
                    )}
                </div>
            </form>

        </div>
    );
};

export default AiConfig;
