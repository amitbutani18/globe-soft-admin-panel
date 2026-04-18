import React from 'react';
import {
    Gem,
    Crown,
    Zap,
    Image as ImageIcon,
    Ghost,
    ArrowRight,
    CheckCircle2,
    Star
} from 'lucide-react';

const PremiumBenefits = () => {
    const benefits = [
        {
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            title: "Ultra-Fast Generation",
            description: "Bypass standard queues and generate images with priority GPU access.",
            color: "amber"
        },
        {
            icon: <ImageIcon className="w-6 h-6 text-blue-500" />,
            title: "High Dynamic Range (4K)",
            description: "Unlock ultra-high resolution output for all generated artwork.",
            color: "blue"
        },
        {
            icon: <Ghost className="w-6 h-6 text-indigo-500" />,
            title: "No Watermarks",
            description: "Export clean, professional images without any Aesthetic AI branding.",
            color: "indigo"
        },
        {
            icon: <Crown className="w-6 h-6 text-purple-500" />,
            title: "Experimental Models",
            description: "Early access to the latest Gemini and diffusion model updates.",
            color: "purple"
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Premium Benefits</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-1">Configure and showcase value propositions for subscribed users.</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-2 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl">
                    <Gem className="w-4 h-4 text-indigo-400" />
                    Premium Tier Active
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {benefits.map((benefit, idx) => (
                    <div key={idx} className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-indigo-500/10 transition-all" />

                        <div className="space-y-6 relative">
                            <div className="flex items-center justify-between">
                                <div className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800`}>
                                    {benefit.icon}
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                            <Star className="w-3 h-3 text-zinc-400" fill="currentColor" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold tracking-tight">{benefit.title}</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Active Feature
                                </span>
                                <button className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/50 transition-all group/btn">
                                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-indigo-500 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-indigo-600 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative shadow-2xl shadow-indigo-500/20">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                <div className="space-y-4 relative">
                    <h2 className="text-3xl font-black text-white tracking-tighter max-w-md leading-none uppercase">
                        Master the Premium Experience
                    </h2>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-sm">
                        Adjust benefit parameters, trial periods, and conversion tracking logic for your subscriber base.
                    </p>
                </div>
                <div className="flex gap-4 relative">
                    <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Edit Tier Logic
                    </button>
                    <button className="px-8 py-4 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl border border-indigo-400/30 hover:bg-indigo-400 transition-all">
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumBenefits;
