import React, { useState, useCallback, useEffect } from 'react';
import {
    Cpu,
    Save,
    RefreshCcw,
    ShieldCheck,
    Zap,
    Activity,
    Key,
    Sliders,
    Globe,
    AlertCircle,
    Loader2
} from 'lucide-react';
import aestheticAiConfigService from '../../../models/aestheticAiConfigService';

const AIConfig = () => {
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [config, setConfig] = useState({
        id: '',
        gemini_api: '',
        gemini_key: '',
        gemini_prompt: '',
        gemini_model: 'gemini-2.5-flash-image',
        createdAt: '',
        updatedAt: ''
    });

    // Fetch config on component mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                console.log('🔄 Fetching AI Config...');
                setFetchLoading(true);
                const response = await aestheticAiConfigService.get();
                console.log('📥 API Response:', response);
                if (response.success && response.data) {
                    console.log('✅ Setting config data:', response.data);
                    setConfig(response.data);
                } else {
                    console.log('❌ No success or data in response');
                }
            } catch (error) {
                console.error('❌ Failed to fetch AI config:', error);
                alert('Failed to load AI Configuration.');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleChange = useCallback((key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        console.log('🔘 Save button clicked!');
        
        if (!config.id) {
            console.log('❌ No config ID found');
            alert('No configuration ID found. Please refresh the page.');
            return;
        }
        
        console.log('📤 Updating config with ID:', config.id);
        console.log('📤 Payload:', {
            gemini_api: config.gemini_api,
            gemini_key: config.gemini_key,
            gemini_prompt: config.gemini_prompt,
            gemini_model: config.gemini_model
        });
        
        setLoading(true);
        try {
            const response = await aestheticAiConfigService.update(config.id, {
                gemini_api: config.gemini_api,
                gemini_key: config.gemini_key,
                gemini_prompt: config.gemini_prompt,
                gemini_model: config.gemini_model
            });
            
            console.log('📥 PUT API Response:', response);
            
            if (response.success) {
                console.log('✅ Update successful!');
                alert('AI Configuration updated successfully!');
                // Refresh the config to get updated data
                const freshResponse = await aestheticAiConfigService.get();
                if (freshResponse.success && freshResponse.data) {
                    setConfig(freshResponse.data);
                }
            } else {
                console.log('❌ Update failed:', response);
                alert('Failed to update AI Configuration.');
            }
        } catch (error) {
            console.error('❌ Error updating config:', error);
            alert('Failed to update AI Configuration.');
        } finally {
            setLoading(false);
        }
    }, [config.id]);

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading AI Configuration...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Configuration</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage Gemini API settings and model parameters for Aesthetic AI.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Config Form */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold">Model Settings</h2>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 text-xs transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Gemini API URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <input
                                            type="url"
                                            value={config.gemini_api}
                                            onChange={e => handleChange('gemini_api', e.target.value)}
                                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-indigo-500 outline-none transition-all font-mono"
                                            placeholder="Enter Gemini API URL"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">API Key</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <input
                                            type="password"
                                            value={config.gemini_key}
                                            onChange={e => handleChange('gemini_key', e.target.value)}
                                            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-indigo-500 outline-none transition-all font-mono"
                                            placeholder="Enter Gemini API Key"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Model Instance</label>
                                <div className="relative">
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <select
                                        value={config.gemini_model}
                                        onChange={e => handleChange('gemini_model', e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-indigo-500 outline-none transition-all appearance-none font-bold"
                                    >
                                        <option value="gemini-2.5-flash-image">Gemini 2.5 Flash Image</option>
                                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                        <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Gemini Prompt</label>
                                <textarea
                                    value={config.gemini_prompt}
                                    onChange={e => handleChange('gemini_prompt', e.target.value)}
                                    rows={8}
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3.5 text-sm focus:border-indigo-500 outline-none transition-all font-mono resize-none"
                                    placeholder="Enter Gemini prompt template"
                                />
                            </div>
                        </div>
                    </form>

                    <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Security Warning</h4>
                            <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1 leading-relaxed">
                                Avoid sharing your Gemini API key. Ensure that environment variables are properly configured on the server to prevent unauthorized access.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-sm space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Configuration Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-2xl bg-emerald-500/5 border-emerald-500/10">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-sm font-bold">API Status</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Connected</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 border rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-5 h-5 text-zinc-400" />
                                    <span className="text-sm font-bold">Model</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 truncate max-w-24">
                                    {config.gemini_model?.replace('gemini-', '') || 'N/A'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-zinc-400" />
                                    <span className="text-sm font-bold">Last Updated</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    {config.updatedAt ? new Date(config.updatedAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 border rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-zinc-400" />
                                    <span className="text-sm font-bold">Created</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    {config.createdAt ? new Date(config.createdAt).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-4 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-600 hover:border-indigo-500/50 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-3.5 h-3.5" />
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIConfig;
