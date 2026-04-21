import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    Layers,
    ChevronRight,
    ChevronDown,
    Monitor,
    Terminal,
    Sparkles,
    Menu,
    X,
    FileJson,
    Megaphone,
    Fingerprint,
    Zap,
    Star,
    Sun,
    Moon,
    BookOpen,
    Cpu,
    FileText,
    Globe,
    BarChart2,
    KeyRound,
    BookMarked,
    HelpCircle,
    FolderOpen,
    ShieldCheck,
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
        accent: 'indigo',
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
        color: 'text-green-400',
        activeBg: 'bg-green-500/10',
        activeBorder: 'border-green-500/20',
        accent: 'green',
        subItems: [
            { name: 'Daily Blogs', path: '/daily-blogs', icon: <BookOpen className="w-4 h-4" /> },
            {
                name: 'Topics',
                path: '/topics',
                icon: <FolderOpen className="w-4 h-4" />,
                children: [
                    { name: 'Topics', path: '/topics', icon: <FolderOpen className="w-4 h-4" /> },
                    { name: 'Sub Topic', path: '/sub-topic', icon: <Layers className="w-4 h-4" /> },
                    { name: 'Sub Topic Quiz', path: '/sub-topic-quiz', icon: <HelpCircle className="w-4 h-4" /> },
                    { name: 'Content', path: '/kali-content', icon: <FileText className="w-4 h-4" /> },
                ]
            },
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
        accent: 'pink',
        subItems: [
            { name: 'Prompts', path: '/prompts', icon: <Sparkles className="w-4 h-4" /> },
            { name: 'Templates', path: '/templates', icon: <Layers className="w-4 h-4" /> },
        ]
    },
];

// Nested navigation component
const NestedNavItem = ({ sub, location }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    if (sub.children) {
        // Parent item with children
        const isParentActive = sub.children.some(child => location.pathname === child.path);

        // Auto-expand if any child is active
        React.useEffect(() => {
            if (isParentActive && !isExpanded) {
                setIsExpanded(true);
            }
        }, [isParentActive, isExpanded]);

        return (
            <div className="space-y-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        isParentActive
                            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/5 shadow-sm shadow-indigo-500/10"
                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
                    )}
                >
                    <span className={cn(
                        "transition-all duration-300",
                        isParentActive ? "text-indigo-600 dark:text-indigo-500 scale-110" : "opacity-70"
                    )}>
                        {React.cloneElement(sub.icon, { className: "w-[18px] h-[18px]" })}
                    </span>
                    <span className="flex-1 text-left">{sub.name}</span>
                    <ChevronRight className={cn(
                        "w-3 h-3 transition-transform duration-300",
                        isExpanded && "rotate-90"
                    )} />
                </button>

                {/* Children */}
                {isExpanded && (
                    <div className="ml-6 space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                        {sub.children.map((child) => {
                            const isChildActive = location.pathname === child.path;
                            return (
                                <Link
                                    key={child.path}
                                    to={child.path}
                                    className={cn(
                                        "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                                        isChildActive
                                            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/5 shadow-sm shadow-indigo-500/10"
                                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
                                    )}
                                >
                                    <span className={cn(
                                        "transition-all duration-300",
                                        isChildActive ? "text-indigo-600 dark:text-indigo-500 scale-110" : "opacity-70"
                                    )}>
                                        {React.cloneElement(child.icon, { className: "w-[18px] h-[18px]" })}
                                    </span>
                                    {child.name}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    } else {
        // Regular sub-item without children
        const isActive = location.pathname === sub.path;
        return (
            <Link
                key={sub.path}
                to={sub.path}
                className={cn(
                    "flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                    isActive
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-500/5 shadow-sm shadow-indigo-500/10"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/30"
                )}
            >
                <span className={cn(
                    "transition-all duration-300",
                    isActive ? "text-indigo-600 dark:text-indigo-500 scale-110" : "opacity-70"
                )}>
                    {React.cloneElement(sub.icon, { className: "w-[18px] h-[18px]" })}
                </span>
                {sub.name}
            </Link>
        );
    }
};

const AdminLayout = () => {
    const { theme, toggleTheme } = useAppStore();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Derive the active app from the current URL - works on page refresh too
    const activeApp = React.useMemo(() => {
        console.log('Current pathname:', location.pathname);

        const findActivePath = (items) => {
            for (const item of items) {
                if (item.path && location.pathname === item.path) {
                    console.log('Found active path:', item.path);
                    return true;
                }
                if (item.children) {
                    if (findActivePath(item.children)) {
                        return true;
                    }
                }
            }
            return false;
        };

        const matched = apps.find(app => {
            const isActive = findActivePath(app.subItems);
            if (isActive) {
                console.log('Active app found:', app.id);
            }
            return isActive;
        });

        const result = matched?.id ?? 'aesthetic_ai';
        console.log('Final active app:', result);
        return result;
    }, [location.pathname]);

    const [expandedApp, setExpandedApp] = useState(activeApp);

    // Sync theme with HTML root
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

    // Keep expanded section in sync when navigating between apps
    React.useEffect(() => {
        setExpandedApp(activeApp);
    }, [activeApp]);

    return (
        <div className={cn(
            "flex h-screen font-sans selection:bg-indigo-500/30 transition-colors duration-300",
            "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100"
        )}>
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 border-r transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 outline-none",
                    "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800",
                    !isSidebarOpen && "-translate-x-full lg:w-20"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Header */}
                    <div className="p-6 flex items-center justify-between border-b border-zinc-800/50 mb-6">
                        {isSidebarOpen ? (
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                                    CRM Admin
                                </h1>
                            </div>
                        ) : (
                            <div className="mx-auto w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <Monitor className="w-5 h-5" />
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Container */}
                    <nav className="flex-1 px-4 space-y-6 overflow-y-auto no-scrollbar">
                        {/* Dashboard Link */}
                        <div className="space-y-1">
                            <Link
                                to="/dashboard"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                    location.pathname === '/dashboard'
                                        ? "bg-zinc-800 text-white shadow-xl shadow-black/40"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                )}
                            >
                                <LayoutDashboard className={cn("w-5 h-5", location.pathname === '/dashboard' && "text-indigo-400")} />
                                {isSidebarOpen && <span className="font-semibold text-sm">Dashboard</span>}
                            </Link>
                        </div>

                        {/* Applications (Accordion) */}
                        <div className="space-y-2">
                            <h2 className={cn("text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 px-3", !isSidebarOpen && "sr-only")}>
                                Applications
                            </h2>
                            {apps.map((app) => (
                                <div key={app.id} className="space-y-1">
                                    <button
                                        onClick={() => toggleApp(app.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                            activeApp === app.id
                                                ? cn(app.activeBg, "text-zinc-100")
                                                : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300"
                                        )}
                                    >
                                        {activeApp === app.id && (
                                            <div className={cn("absolute left-0 top-0 bottom-0 w-1",
                                                app.accent === 'indigo' ? 'bg-indigo-500' :
                                                    app.accent === 'green' ? 'bg-green-500' : 'bg-pink-500'
                                            )} />
                                        )}
                                        <div className={cn(
                                            "shrink-0 transition-transform duration-300",
                                            activeApp === app.id ? "scale-110" : "group-hover:scale-110",
                                            activeApp === app.id ? app.color : "text-zinc-600"
                                        )}>
                                            {app.icon}
                                        </div>
                                        {isSidebarOpen && (
                                            <span className="font-bold text-[15px] flex-1 text-left tracking-tight">{app.name}</span>
                                        )}
                                        {isSidebarOpen && (
                                            <ChevronDown className={cn(
                                                "w-4 h-4 transition-transform duration-300 opacity-50",
                                                expandedApp === app.id && "rotate-180"
                                            )} />
                                        )}
                                    </button>

                                    {/* Sub-items (Accordion Content) */}
                                    {isSidebarOpen && expandedApp === app.id && (
                                        <div className="ml-9 space-y-1.5 border-l border-zinc-200 dark:border-zinc-800/50 pl-3 py-2 animate-in slide-in-from-top-2 duration-300">
                                            {app.subItems.map((sub) => (
                                                <NestedNavItem key={sub.path || sub.name} sub={sub} location={location} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Global Settings */}
                        <div className="pt-4 mt-4 border-t border-zinc-800/50">
                            <Link
                                to="/settings"
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                    location.pathname === '/settings'
                                        ? "bg-zinc-800 text-white shadow-xl shadow-black/40"
                                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                                )}
                            >
                                <Settings className={cn("w-5 h-5", location.pathname === '/settings' && "text-indigo-400")} />
                                {isSidebarOpen && <span className="font-semibold text-sm">Global Settings</span>}
                            </Link>
                        </div>
                    </nav>

                    {/* Footer User Info */}
                    <div className="p-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                A
                            </div>
                            {isSidebarOpen && (
                                <div className="overflow-hidden">
                                    <p className="font-bold text-sm truncate">Admin User</p>
                                    <p className="text-[10px] text-zinc-500 truncate">admin@aesthetic.ai</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
                {/* Simplified Header */}
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md px-8 flex items-center justify-between z-10 transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden lg:block"
                        >
                            <Menu className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        </button>
                        <h2 className="text-sm font-semibold tracking-tight text-zinc-500 dark:text-zinc-400">
                            {activeApp.replace('_', ' ').toUpperCase()} <span className="mx-2 text-zinc-300 dark:text-zinc-700">/</span>
                            <span className="text-zinc-900 dark:text-zinc-100">{location.pathname.substring(1).replace('-', ' ').toUpperCase() || 'DASHBOARD'}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-300"
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? (
                                <Sun className="w-5 h-5 text-amber-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-indigo-600" />
                            )}
                        </button>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                            Local Node: Active
                        </div>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
