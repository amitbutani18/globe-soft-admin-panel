import React from 'react';
import {
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    ArrowUpRight,
    RefreshCcw,
    Plus,
    Clock
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
        { label: 'Total Users', value: '1,250', change: '+4%', icon: <Users className="w-5 h-5 text-blue-500" /> },
        { label: 'Total Revenue', value: '$4,250', change: '+4%', icon: <DollarSign className="w-5 h-5 text-emerald-500" /> },
        { label: 'Growth Rate', value: '+12.5%', change: '+4%', icon: <TrendingUp className="w-5 h-5 text-indigo-500" /> },
        { label: 'System Status', value: 'Active', change: '+4%', icon: <Activity className="w-5 h-5 text-rose-500" /> },
    ];

    const recentActivity = [
        { id: 1, action: "New user registered in", app: activeApp, time: "2 hours ago" },
        { id: 2, action: "New user registered in", app: activeApp, time: "2 hours ago" },
        { id: 3, action: "New user registered in", app: activeApp, time: "2 hours ago" },
        { id: 4, action: "New user registered in", app: activeApp, time: "2 hours ago" },
        { id: 5, action: "New user registered in", app: activeApp, time: "2 hours ago" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here is what's happening with <span className="text-indigo-600 dark:text-indigo-400 font-bold">{activeApp.replace('_', ' ')}</span> today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/80">
                        <RefreshCcw className="w-3.5 h-3.5" />
                        Refresh Data
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 text-xs transition-all uppercase tracking-widest">
                        <Plus className="w-4 h-4" />
                        Add Entity
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex items-center justify-between">
                            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4 space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] dark:opacity-[0.05] group-hover:scale-125 transition-transform duration-500">
                            {React.cloneElement(stat.icon, { className: "w-24 h-24" })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Card */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
                        <h3 className="text-lg font-bold">Analytics Overview</h3>
                        <select className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-8 text-center relative overflow-hidden">
                        <div className="space-y-4 relative z-10 pointer-events-none opacity-40">
                            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <TrendingUp className="w-8 h-8 text-indigo-500" />
                            </div>
                            <p className="text-sm font-bold text-zinc-500">Charts for <span className="text-indigo-500">{activeApp}</span> will appear here</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest">Waiting for API Integration...</p>
                        </div>
                        <div className="absolute inset-x-8 bottom-8 top-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl" />
                    </div>
                </div>

                {/* Sidebar Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 transition-colors duration-300">
                        <h3 className="text-lg font-bold">Recent Activity</h3>
                    </div>
                    <div className="p-4 space-y-1">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group cursor-pointer">
                                <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-500/20 group-hover:scale-125 transition-transform" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold leading-relaxed">
                                        {item.action} <span className="text-indigo-600 dark:text-indigo-500">{item.app}</span>
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-tighter">
                                        <Clock className="w-3 h-3" />
                                        {item.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
