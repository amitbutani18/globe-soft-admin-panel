import React, { useState, useEffect } from 'react';
import {
    Gauge,
    Zap,
    Infinity as InfinityIcon,
    ShieldCheck,
    AlertCircle,
    History,
    RefreshCw,
    TrendingUp,
    Users
} from 'lucide-react';


const ImageLimit = () => {
    const [loading, setLoading] = useState(false);
    const [limits, setLimits] = useState({
        freeDailyLimit: 5,
        premiumDailyLimit: 100,
        rewardBonus: 1
    });

    useEffect(() => {
        // fetchLimits logic disabled until new production API is ready
        /*
        const fetchLimits = async () => {
            try {
                const data = await limitService.getLimits();
                if (data.success) {
                    setLimits(data.data || { freeDailyLimit: 5, premiumDailyLimit: 100 });
                }
            } catch (error) {
                console.error("Failed to fetch Image Limits");
            }
        };
        fetchLimits();
        */
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Generation Limits</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Monitor and configure quota policies for Aesthetic AI users.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Free User Limits */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                            <Users className="w-6 h-6 text-zinc-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Free Tiers</h2>
                            <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold mt-1">Standard Daily Quota</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-8 flex-1">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-bold text-zinc-400">Daily Limit</span>
                                <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100">{limits.freeDailyLimit}</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-400 dark:bg-zinc-600 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                        </div>
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span>Policy Details</span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed font-bold">
                                Reset cycle: 00:00 UTC<br />
                                Overflow: Disallowed<br />
                                Ad Reward: +{limits.rewardBonus || 1} Image
                            </p>
                        </div>
                    </div>
                </div>

                {/* Premium User Limits */}
                <div className="bg-white dark:bg-zinc-900 border-2 border-indigo-600/20 dark:border-indigo-500/30 rounded-3xl overflow-hidden shadow-xl shadow-indigo-500/5 flex flex-col relative">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest">Priority</div>
                    <div className="p-8 border-b border-indigo-50 dark:border-indigo-950/40 bg-indigo-500/5 flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Premium Tiers</h2>
                            <p className="text-xs text-indigo-500/60 uppercase tracking-widest font-bold mt-1">Subscribed Active Users</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-8 flex-1">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-bold text-indigo-400">Daily Limit</span>
                                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{limits.premiumDailyLimit}</span>
                            </div>
                            <div className="w-full h-2 bg-indigo-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.5)]" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Priority Queue</span>
                            </div>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed font-bold">
                                Ultra-fast generation<br />
                                Extended prompt length<br />
                                No Watermarks
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Diagnostics */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                    <h2 className="text-sm font-black uppercase tracking-widest text-zinc-500">System Monitoring</h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Gauge className="w-5 h-5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Load Intensity</span>
                            </div>
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Normal</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-zinc-400" />
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Last Quota Reset</span>
                            </div>
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">14h ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="w-5 h-5 text-indigo-500 animate-spin-slow" />
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Sync Interval</span>
                            </div>
                            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Realtime</span>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
                        <button className="w-full py-4 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600 hover:border-indigo-500 transition-all flex items-center justify-center gap-2">
                            Full Analytics Dashboard
                        </button>
                        <div className="flex items-center gap-2 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">Soft cap logic active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageLimit;
