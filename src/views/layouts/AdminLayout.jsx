import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    Layers,
    ChevronDown,
    Monitor,
    Terminal,
    Sparkles,
    Menu,
    X,
    FileJson,
    Megaphone,
    Star,
    Sun,
    Moon,
    BookOpen,
    Cpu,
    Globe,
    BarChart2,
    Zap,
    BookMarked,
    HelpCircle,
    FolderOpen,
    Users,
    Languages,
    Image,
    UserCog
} from 'lucide-react';
import { useAppStore } from '../../models/appStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for Tailwind classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const apps = [
    {
        id: 'aesthetic_ai',
        name: 'Aesthetic AI',
        icon: <Sparkles className="w-5 h-5" />,
        color: 'text-indigo-400',
        activeBg: 'bg-indigo-500/10',
        activeBorder: 'border-indigo-500/20',
        accentColor: '#818cf8',
        subItems: [
            {
                name: 'Content',
                path: '/categories',
                icon: <Layers className="w-4 h-4" />,
                children: [
                    { name: 'Category', path: '/categories', icon: <Layers className="w-4 h-4" /> },
                    { name: 'Subcategory', path: '/subcategories', icon: <Monitor className="w-4 h-4" /> },
                ]
            },
            {
                name: 'App Setting',
                path: '/ai-config',
                icon: <Settings className="w-4 h-4" />,
                children: [
                    { name: 'Ad Config', path: '/ad-config', icon: <Settings className="w-4 h-4" /> },
                    { name: 'Ads', path: '/ads', icon: <Megaphone className="w-4 h-4" /> },
                    { name: 'AI Config', path: '/ai-config', icon: <FileJson className="w-4 h-4" /> },
                    { name: 'Premium Benefits', path: '/premium-benefits', icon: <Star className="w-4 h-4" /> },
                    { name: 'Image Limits', path: '/image-generation-limits', icon: <Cpu className="w-4 h-4" /> },
                ]
            },
            { name: 'Image Prompt', path: '/image-prompt', icon: <Image className="w-4 h-4" /> },
        ]
    },
    {
        id: 'kali linux',
        name: 'Kali Linux',
        icon: <Terminal className="w-5 h-5" />,
        color: 'text-emerald-400',
        activeBg: 'bg-emerald-500/10',
        activeBorder: 'border-emerald-500/20',
        accentColor: '#10b981',
        subItems: [
            { name: 'Daily Blogs', path: '/daily-blogs', icon: <BookOpen className="w-4 h-4" /> },
            { name: 'Module Explorer', path: '/kali-modules', icon: <FolderOpen className="w-4 h-4" /> },
            { name: 'Level Quizzes', path: '/level-quizzes', icon: <BarChart2 className="w-4 h-4" /> },
            { name: 'Flashed Quiz', path: '/flashed-quiz', icon: <Zap className="w-4 h-4" /> },
            { name: 'Story Learning', path: '/story-learning', icon: <BookMarked className="w-4 h-4" /> },
            {
                name: 'Users Management',
                path: '/kali-users',
                icon: <Users className="w-4 h-4" />,
                children: [
                    { name: 'Users', path: '/kali-users', icon: <Users className="w-4 h-4" /> },
                    { name: 'User Login Config', path: '/user-login-config', icon: <UserCog className="w-4 h-4" /> },
                ]
            },
            {
                name: 'Settings',
                path: '/kali-ai-config',
                icon: <Settings className="w-4 h-4" />,
                children: [
                    { name: 'AI Config', path: '/kali-ai-config', icon: <Cpu className="w-4 h-4" /> },
                    { name: 'Ads', path: '/kali-ads', icon: <Megaphone className="w-4 h-4" /> },
                    { name: 'Ad Config', path: '/kali-ad-config', icon: <Settings className="w-4 h-4" /> },
                ]
            },
            {
                name: 'Languages',
                path: '/languages',
                icon: <Globe className="w-4 h-4" />,
                children: [
                    { name: 'Languages', path: '/languages', icon: <Globe className="w-4 h-4" /> },
                    { name: 'Translated Topics', path: '/translated-topic', icon: <Languages className="w-4 h-4" /> },
                    { name: 'Translated Sub Topics', path: '/translated-subtopic', icon: <Languages className="w-4 h-4" /> },
                    { name: 'Translated Contents', path: '/translated-contents', icon: <Languages className="w-4 h-4" /> },
                    { name: 'Translated Level Quizzes', path: '/translated-level-quizzes', icon: <Languages className="w-4 h-4" /> },
                    { name: 'Translated Subtopic Quizzes', path: '/translated-subtopic-quizzes', icon: <Languages className="w-4 h-4" /> },
                ]
            },
        ]
    },
    {
        id: 'promtverse ai',
        name: 'Promtverse AI',
        icon: <Layers className="w-5 h-5" />,
        color: 'text-pink-400',
        activeBg: 'bg-pink-500/10',
        activeBorder: 'border-pink-500/20',
        accentColor: '#f472b6',
        subItems: [
            { name: 'Prompts', path: '/prompts', icon: <Sparkles className="w-4 h-4" /> },
            { name: 'Templates', path: '/templates', icon: <Layers className="w-4 h-4" /> },
        ]
    },
];

const NestedNavItem = ({ sub, location }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    if (sub.children) {
        const isParentActive = sub.children.some(child => location.pathname === child.path);

        React.useEffect(() => {
            if (isParentActive && !isExpanded) {
                setIsExpanded(true);
            }
        }, [isParentActive]);

        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300",
                        isParentActive
                            ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800/50"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <span className={isParentActive ? "text-crimson-600 dark:text-crimson-500" : "opacity-70"}>
                            {React.cloneElement(sub.icon, { className: "w-4 h-4" })}
                        </span>
                        {sub.name}
                    </div>
                    <ChevronDown className={cn("w-3 h-3 transition-transform duration-300 opacity-40", isExpanded && "rotate-180")} />
                </button>

                {isExpanded && (
                    <div className="ml-4 space-y-1 border-l border-zinc-200 dark:border-zinc-800/50 pl-4 py-1 animate-in slide-in-from-top-1 duration-200">
                        {sub.children.map((child) => {
                            const isChildActive = location.pathname === child.path;
                            return (
                                <Link
                                    key={child.path}
                                    to={child.path}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-1 rounded-lg text-[11px] font-medium transition-all",
                                        isChildActive
                                            ? "text-crimson-600 dark:text-crimson-400 bg-crimson-500/5"
                                            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                                    )}
                                >
                                    <div className={cn("w-1 h-1 rounded-full", isChildActive ? "bg-crimson-500" : "bg-zinc-300 dark:bg-zinc-700")} />
                                    {child.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    } else {
        const isActive = location.pathname === sub.path;
        return (
            <Link
                key={sub.path}
                to={sub.path}
                className={cn(
                    "flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300",
                    isActive
                        ? "text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
                )}
            >
                <span className={cn(
                    "transition-all duration-300",
                    isActive ? "text-crimson-600 dark:text-crimson-500 scale-110" : "opacity-70"
                )}>
                    {React.cloneElement(sub.icon, { className: "w-4 h-4" })}
                </span>
                {sub.name}
            </Link>
        );
    }
};

const AdminLayout = () => {
    const { theme, toggleTheme, setActiveApp } = useAppStore();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const activeApp = React.useMemo(() => {
        const findActivePath = (items) => {
            for (const item of items) {
                if (item.path && location.pathname === item.path) return true;
                if (item.children && findActivePath(item.children)) return true;
            }
            return false;
        };

        const matched = apps.find(app => findActivePath(app.subItems));
        return matched?.id ?? 'dashboard';
    }, [location.pathname]);

    React.useEffect(() => {
        setActiveApp(activeApp);
    }, [activeApp, setActiveApp]);

    const [expandedApp, setExpandedApp] = useState(activeApp);

    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleApp = (appId) => {
        setExpandedApp(prev => prev === appId ? null : appId);
    };

    React.useEffect(() => {
        setExpandedApp(activeApp);
    }, [activeApp]);

    return (
        <div className={cn(
            "flex h-screen font-sans selection:bg-crimson-500/30 transition-colors duration-300",
            "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
        )}>
            <div className="fixed inset-0 bg-white dark:bg-zinc-950 pointer-events-none transition-colors duration-1000" />
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-crimson-500/10 dark:bg-crimson-500/5 rounded-full blur-[100px] animate-pulse" />
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 transition-all duration-500 transform overflow-hidden",
                    "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-r border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-20"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-between mb-1">
                        {isSidebarOpen ? (
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-700 flex items-center justify-center shadow-lg shadow-crimson-500/40 transition-all duration-500">
                                    <Monitor className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-lg font-black bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent italic tracking-tighter leading-none">
                                        CRM ADMIN
                                    </h1>
                                    <span className="text-[9px] font-black text-crimson-500 tracking-[0.3em] ml-0.5 uppercase">Premium Suite</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto w-9 h-9 rounded-2xl bg-gradient-to-br from-crimson-500 to-crimson-700 flex items-center justify-center shadow-lg shadow-crimson-500/40 transition-transform">
                                <Monitor className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-zinc-800 transition-colors lg:hidden">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 space-y-4 overflow-y-auto no-scrollbar">
                        <div className="space-y-1">
                            <Link
                                to="/dashboard"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-300 border",
                                    location.pathname === '/dashboard'
                                        ? "bg-crimson-50 text-crimson-600 border-crimson-100 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
                                        : "bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                                )}
                            >
                                <LayoutDashboard className={cn("w-4 h-4", location.pathname === '/dashboard' ? "text-crimson-600" : "text-zinc-400")} />
                                {isSidebarOpen && <span className="font-bold text-xs tracking-tight text-inherit">Dashboard Overview</span>}
                            </Link>
                        </div>

                        <div className="space-y-2">
                            <h2 className={cn("text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 px-3", !isSidebarOpen && "sr-only")}>
                                Applications
                            </h2>
                            {apps.map((app) => {
                                const isActive = activeApp === app.id;
                                const isExpanded = expandedApp === app.id;

                                return (
                                    <div key={app.id} className="space-y-1">
                                        <button
                                            onClick={() => toggleApp(app.id)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-2 rounded-xl transition-all duration-300 border",
                                                (isActive || isExpanded)
                                                    ? "bg-zinc-50/80 text-zinc-900 border-zinc-200 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
                                                    : "bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500 shadow-sm",
                                                    (isActive || isExpanded) ? "scale-110 " + app.activeBg : "opacity-80"
                                                )} style={{ color: app.accentColor }}>
                                                    {React.cloneElement(app.icon, { className: "w-3.5 h-3.5" })}
                                                </div>
                                                {isSidebarOpen && (
                                                    <div className="flex flex-col items-start min-w-0">
                                                        <span className="font-black text-xs uppercase tracking-widest truncate text-inherit leading-none">{app.name}</span>
                                                        <span className={cn(
                                                            "text-[8px] font-bold uppercase tracking-tighter opacity-60 truncate",
                                                            (isActive || isExpanded) ? "text-crimson-600" : ""
                                                        )}>Active Node</span>
                                                    </div>
                                                )}
                                            </div>
                                            {isSidebarOpen && (
                                                <ChevronDown className={cn(
                                                    "w-3 h-3 transition-transform duration-500 opacity-40",
                                                    isExpanded && "rotate-180 opacity-100"
                                                )} />
                                            )}
                                        </button>

                                        {isSidebarOpen && isExpanded && (
                                            <div className="ml-7 space-y-1 border-l border-zinc-200 dark:border-zinc-800/50 pl-2.5 py-1.5 animate-in slide-in-from-top-2 duration-300">
                                                {app.subItems.map((sub) => (
                                                    <NestedNavItem key={sub.path || sub.name} sub={sub} location={location} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-crimson-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-crimson-500/40">
                                A
                            </div>
                            {isSidebarOpen && (
                                <div className="overflow-hidden">
                                    <p className="font-black text-xs truncate text-zinc-900 dark:text-white uppercase leading-none">Admin User</p>
                                    <p className="text-[9px] text-zinc-500 truncate font-bold">admin@aesthetic.ai</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden z-10">
                <header className="h-14 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-3xl px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 shadow-premium hover:scale-110 active:scale-95 transition-all text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-800"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-[9px] font-black tracking-[0.3em] text-crimson-500 uppercase italic leading-none">
                                {activeApp.replace('_', ' ')}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter capitalize">
                                    {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Live: 24ms</span>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 shadow-premium border border-zinc-100 dark:border-zinc-800 hover:scale-110 active:scale-95 transition-all group"
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-amber-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-crimson-600" />
                            )}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-6 selection:bg-crimson-500/20">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
