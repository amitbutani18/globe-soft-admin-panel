import React from 'react';
import { ShieldCheck, AlertCircle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'warning' }) => {
    if (!isOpen) return null;

    const config = {
        warning: {
            icon: AlertCircle,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
        },
        danger: {
            icon: AlertCircle,
            color: 'text-rose-500',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            btn: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20'
        },
        success: {
            icon: ShieldCheck,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
        }
    }[type];

    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-2xl ${config.bg} flex items-center justify-center mb-6`}>
                        <Icon className={`w-8 h-8 ${config.color}`} />
                    </div>

                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-2">{title}</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-[1.5rem] font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-[2] px-6 py-4 ${config.btn} text-white rounded-[1.5rem] font-bold transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest`}
                        >
                            Final Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
