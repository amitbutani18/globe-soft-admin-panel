import React from 'react';
import {
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    ArrowUpRight,
    RefreshCcw,
    Plus,
    Clock,
    Zap,
    Globe,
    Shield
} from 'lucide-react';
import { useAppStore } from '../../models/appStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Dashboard = () => {
    const { activeApp } = useAppStore();

    const stats = [
        { label: 'Active Users', value: '2,840', change: '+12.5%', icon: <Users className="w-5 h-5" />, color: 'crimson', trend: 'up' },
        { label: 'Cloud Revenue', value: '$14.2k', change: '+18.2%', icon: <DollarSign className="w-5 h-5" />, color: 'emerald', trend: 'up' },
        { label: 'Bandwidth', value: '942GB', change: '-2.4%', icon: <Activity className="w-5 h-5" />, color: 'amber', trend: 'down' },
        { label: 'Node Health', value: '99.9%', change: 'Stable', icon: <Zap className="w-5 h-5" />, color: 'indigo', trend: 'stable' },
    ];

    const recentActivity = [
        { id: 1, action: "Security node deployed", user: "Admin", time: "12m ago", status: "success" },
        { id: 2, action: "API endpoint optimized", user: "System", time: "45m ago", status: "processing" },
        { id: 3, action: "User session terminated", user: "Auth-Bot", time: "1h ago", status: "warning" },
        { id: 4, action: "Database backup complete", user: "Admin", time: "3h ago", status: "success" },
        { id: 5, action: "New module integrated", user: "Dev-Pipe", time: "5h ago", status: "success" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Compact Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[9px] font-black text-crimson-600 dark:text-crimson-500 uppercase tracking-[0.4em] mb-0.5">
                        <Globe className="w-2.5 h-2.5" />
                        Live System Core
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white lg:text-4xl">
                        Operational <span className="text-crimson-600 dark:text-crimson-500 italic">Overview</span>
                    </h1>
                    <p className="text-[13px] font-bold text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
                        Monitoring {activeApp && activeApp !== 'dashboard' ? (
                            <span className="text-zinc-900 dark:text-zinc-100 uppercase underline decoration-crimson-500 underline-offset-4">{activeApp.replace('_', ' ')}</span>
                        ) : (
                            "all infrastructure nodes"
                        )} with real-time heuristic analysis.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 shadow-premium border border-zinc-100 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-zinc-600 dark:text-zinc-300 group">
                        <RefreshCcw className="w-3.5 h-3.5 text-crimson-500 group-hover:rotate-180 transition-transform duration-700" />
                        Sync Data
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl hover:shadow-crimson-500/20 hover:scale-105 active:scale-95 transition-all text-[11px] font-black tracking-tight group">
                        <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                        Deploy New Node
                    </button>
                </div>
            </div>

            {/* Stats Grid - Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 rounded-[2rem] blur-sm group-hover:blur-md transition-all duration-500" />
                        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-5 rounded-[2rem] shadow-premium hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 cursor-default overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-500 animate-float",
                                    stat.color === 'crimson' ? "bg-crimson-500/10 text-crimson-600" :
                                        stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-600" :
                                            stat.color === 'amber' ? "bg-amber-500/10 text-amber-600" :
                                                "bg-indigo-500/10 text-indigo-600"
                                )}>
                                    {React.cloneElement(stat.icon, { className: "w-5 h-5" })}
                                </div>
                                <div className={cn(
                                    "px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                    stat.trend === 'up' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" :
                                        stat.trend === 'down' ? "bg-crimson-500/10 border-crimson-500/20 text-crimson-600" :
                                            "bg-zinc-500/10 border-zinc-500/20 text-zinc-500"
                                )}>
                                    {stat.change}
                                </div>
                            </div>
                            <div className="space-y-0.5 relative z-10">
                                <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.3em]">{stat.label}</p>
                                <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">{stat.value}</h3>
                            </div>

                            <div className="absolute -right-2 -bottom-2 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-150 group-hover:rotate-12 transition-all duration-1000">
                                {React.cloneElement(stat.icon, { className: "w-20 h-20" })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Compact Visual Chart */}
                <div className="xl:col-span-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-3xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] p-6 shadow-premium flex flex-col min-h-[350px]">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-crimson-600 dark:bg-crimson-500 rounded-full" />
                            <div>
                                <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-white uppercase tracking-tighter">Growth Dynamics</h3>
                                <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Real-time Performance Triage</p>
                            </div>
                        </div>
                        <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <button className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 shadow-sm text-[9px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Active</button>
                            <button className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">History</button>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-2 p-2 border-b-2 border-zinc-100 dark:border-zinc-800/50">
                        {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 60, 95].map((h, i) => (
                            <div key={i} className="flex-1 relative group cursor-pointer h-full flex items-end">
                                <div
                                    className="w-full bg-gradient-to-t from-crimson-600 to-crimson-400 rounded-xl group-hover:scale-x-110 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                                    style={{ height: `${h}%`, opacity: 0.1 + (i * 0.08) }}
                                />
                                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[8px] font-black text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    N_{i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compact Activity Feed */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2rem] p-6 shadow-premium flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-black tracking-tight text-zinc-900 dark:text-white uppercase tracking-tighter">System Pulse</h3>
                        <Activity className="w-4 h-4 text-crimson-500 animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        {recentActivity.map((item, idx) => (
                            <div key={item.id} className="group flex items-start gap-3 p-3 rounded-2xl hover:bg-zinc-50/50 dark:hover:bg-zinc-950/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 transition-all duration-300 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-500 group-hover:rotate-12",
                                    item.status === 'success' ? "bg-emerald-500/10 text-emerald-600" :
                                        item.status === 'processing' ? "bg-indigo-500/10 text-indigo-600" :
                                            "bg-amber-500/10 text-amber-600"
                                )}>
                                    {item.status === 'success' ? <Shield className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 truncate tracking-tight">{item.action}</p>
                                        <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase shrink-0">{item.time}</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.user} • {item.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-crimson-600 hover:border-crimson-500/20 transition-all duration-300">
                        View System Log
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
