import React from 'react';
import {
    User,
    Bell,
    Lock,
    Cloud,
    Globe,
    Shield,
    Palette,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';
import { useAppStore } from '../../models/appStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Settings = () => {
    const { theme, toggleTheme } = useAppStore();

    const sections = [
        {
            title: 'Profile Settings',
            icon: <User className="w-5 h-5 text-blue-500" />,
            description: 'Manage your personal information and public profile.',
            settings: [
                { name: 'Full Name', value: 'Admin User', type: 'text' },
                { name: 'Email Address', value: 'admin@aesthetic.ai', type: 'email' },
            ]
        },
        {
            title: 'System Preferences',
            icon: <Monitor className="w-5 h-5 text-emerald-500" />,
            description: 'Configure global system behaviors and notifications.',
            settings: [
                { name: 'Push Notifications', value: true, type: 'toggle' },
                { name: 'Automatic Updates', value: false, type: 'toggle' },
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and application configuration.</p>
            </div>

            <div className="grid gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 flex items-center gap-4 transition-colors duration-300">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                {section.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">{section.title}</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">{section.description}</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {section.settings.map((setting, sIdx) => (
                                <div key={sIdx} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm tracking-tight">{setting.name}</p>
                                        {setting.description && (
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{setting.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {setting.type === 'theme-toggle' ? (
                                            <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors duration-300">
                                                <button
                                                    onClick={() => theme !== 'light' && toggleTheme()}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                                                        theme === 'light'
                                                            ? "bg-white text-indigo-600 shadow-md translate-x-0"
                                                            : "text-zinc-500 hover:text-zinc-300"
                                                    )}
                                                >
                                                    <Sun className="w-4 h-4" />
                                                    Light
                                                </button>
                                                <button
                                                    onClick={() => theme !== 'dark' && toggleTheme()}
                                                    className={cn(
                                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                                                        theme === 'dark'
                                                            ? "bg-zinc-900 text-indigo-400 shadow-md shadow-black/40"
                                                            : "text-zinc-500 hover:text-zinc-700"
                                                    )}
                                                >
                                                    <Moon className="w-4 h-4" />
                                                    Dark
                                                </button>
                                            </div>
                                        ) : setting.type === 'toggle' ? (
                                            <button
                                                className={cn(
                                                    "w-12 h-6 rounded-full transition-colors relative",
                                                    setting.value ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"
                                                )}
                                            >
                                                <div className={cn(
                                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
                                                    setting.value ? "right-1" : "left-1"
                                                )} />
                                            </button>
                                        ) : (
                                            <input
                                                type={setting.type}
                                                defaultValue={setting.value}
                                                className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none min-w-[200px] transition-colors duration-300"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
