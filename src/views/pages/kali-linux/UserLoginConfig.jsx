import React, { useState, useEffect } from 'react';
import {
    ShieldCheck,
    RefreshCw,
    Save,
    Lock,
    Unlock,
    Fingerprint,
    Eye,
    EyeOff,
    CheckCircle2,
    Activity,
    KeyRound,
    UserCog,
    Sparkles,
    Check
} from 'lucide-react';
import userLoginConfigService from '../../../models/userLoginConfigService';

const UserLoginConfig = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isLocked, setIsLocked] = useState(true);
    const [lastSync, setLastSync] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await userLoginConfigService.getConfig();
            if (res.data) {
                setConfig(res.data);
                setLastSync(new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error('Failed to fetch login config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (field) => {
        if (isLocked) return;
        setConfig(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        if (!config || !config.id) return;
        setSaving(true);
        try {
            const { id, created_at, updated_at, ...updateData } = config;
            await userLoginConfigService.updateConfig(id, updateData);
            setLastSync(new Date().toLocaleTimeString());
            setIsLocked(true);
            alert('Security Matrix Updated Successfully');
        } catch (error) {
            alert(`Update Failed: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-pulse">
                <div className="w-16 h-16 rounded-3xl bg-violet-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-violet-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Decrypting Authentication Matrix...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 font-sans italic">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-12">
                <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-violet-500 to-indigo-600 shadow-3xl shadow-violet-500/30 flex items-center justify-center text-white shrink-0 group hover:scale-105 transition-transform duration-500">
                        <UserCog className="w-12 h-12" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-violet-500/20">Access Control</span>
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">Last Sync: {lastSync}</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic leading-none">Login Config</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-md font-medium text-shadow-sm leading-relaxed">
                            Global authentication protocols and visibility flags for the hacking matrix.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsLocked(!isLocked)}
                        className={`group flex items-center gap-3 px-8 py-4 rounded-3xl font-black transition-all active:scale-95 text-[11px] uppercase tracking-[0.2em] border-2 ${isLocked
                            ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-xl shadow-rose-500/10'}`}
                    >
                        {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                        {isLocked ? 'Matrix Locked' : 'Secure Override'}
                    </button>
                    {!isLocked && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-3 px-10 py-4 bg-violet-600 text-white rounded-3xl font-black transition-all hover:bg-violet-700 active:scale-95 text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-violet-500/40"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Commit Changes
                        </button>
                    )}
                </div>
            </div>

            {/* Config Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Login Required Card */}
                <div className={`p-10 rounded-[3.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${config?.login_required
                    ? 'bg-violet-500/5 border-violet-500/20'
                    : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <KeyRound className="w-32 h-32 text-violet-500 -rotate-12" />
                    </div>

                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                            <Fingerprint className={`w-8 h-8 ${config?.login_required ? 'text-violet-500' : 'text-zinc-400'}`} />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 lowercase tracking-tight">Access Gatekeeping</h3>
                        <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium mb-12 flex-1">
                            Force authentication protocols before users can access the primary command grid.
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${config?.login_required ? 'bg-violet-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${config?.login_required ? 'text-violet-500' : 'text-zinc-400'}`}>
                                    {config?.login_required ? 'PROTOCOL ACTIVE' : 'OPEN ACCESS'}
                                </span>
                            </div>
                            <button
                                onClick={() => handleToggle('login_required')}
                                disabled={isLocked}
                                className={`w-20 h-10 rounded-full transition-all relative ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} ${config?.login_required ? 'bg-violet-600' : 'bg-zinc-300 dark:bg-zinc-800'}`}
                            >
                                <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-lg transition-all ${config?.login_required ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* First Login Show Card */}
                <div className={`p-10 rounded-[3.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${config?.first_login_show
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800'}`}>
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-32 h-32 text-emerald-500 rotate-12" />
                    </div>

                    <div className="flex flex-col h-full relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                            {config?.first_login_show ? <Eye className="w-8 h-8 text-emerald-500" /> : <EyeOff className="w-8 h-8 text-zinc-400" />}
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 lowercase tracking-tight">Onboarding Manifest</h3>
                        <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium mb-12 flex-1">
                            Initiate specific walkthrough sequences or welcome payloads during the internal bootstrap phase.
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${config?.first_login_show ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`}></div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${config?.first_login_show ? 'text-emerald-500' : 'text-zinc-400'}`}>
                                    {config?.first_login_show ? 'BOOTSTRAP ENABLED' : 'SILENT LAUNCH'}
                                </span>
                            </div>
                            <button
                                onClick={() => handleToggle('first_login_show')}
                                disabled={isLocked}
                                className={`w-20 h-10 rounded-full transition-all relative ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} ${config?.first_login_show ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-800'}`}
                            >
                                <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-lg transition-all ${config?.first_login_show ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Health Meter */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-inner">
                        <Activity className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 leading-none italic">Security integrity</p>
                        <div className="flex items-center gap-3">
                            <h4 className="text-xl font-black text-zinc-900 dark:text-white lowercase tracking-tight">Identity Persistence</h4>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`w-4 h-1 rounded-full ${i <= 4 ? 'bg-violet-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-12 text-center md:text-left h-full">
                    <div>
                        <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none mb-1">256-BIT</p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">Encryption</p>
                    </div>
                    <div className="w-[1px] h-12 bg-zinc-200 dark:border-zinc-800 hidden md:block"></div>
                    <div>
                        <p className="text-2xl font-black text-violet-600 leading-none mb-1 uppercase italic">Stable</p>
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] italic">Gateway Status</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLoginConfig;
