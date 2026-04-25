import React, { useState, useEffect } from 'react';
import {
    FolderOpen,
    Layers,
    FileText,
    Search,
    RefreshCw,
    ChevronRight,
    BookOpen,
    Activity,
    Plus,
    X,
    Eye,
    Zap,
    Trash2,
    Pencil,
    ExternalLink,
    ArrowLeft,
    Terminal,
    ChevronLeft,
    MoreVertical,
    LayoutGrid,
    List
} from 'lucide-react';
import topicService from '../../../models/topicService';
import subTopicService from '../../../models/subTopicService';

const ModuleExplorer = () => {
    // Navigation State: 0 = Topics, 1 = SubTopics, 2 = Content
    const [viewLevel, setViewLevel] = useState(0);

    // Selection State
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedSubTopic, setSelectedSubTopic] = useState(null);

    // Data State
    const [topics, setTopics] = useState([]);
    const [subTopics, setSubTopics] = useState([]);
    const [content, setContent] = useState(null);

    // Loading State
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch Topics on Mount
    useEffect(() => {
        if (viewLevel === 0) fetchTopics();
    }, [viewLevel]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const { topics: data } = await topicService.getTopics(1, 100);
            setTopics(data || []);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicSelect = async (topic) => {
        console.log('Topic selected:', topic.id);
        setSelectedTopic(topic);
        setSelectedSubTopic(null);
        setContent(null);
        setSubTopics([]);
        setLoading(true);
        try {
            // Updated call using the new relation-based API
            const { subTopics: data } = await topicService.getTopicSubTopics(topic.id);
            console.log('Sub-topics fetched:', data?.length);
            setSubTopics(data || []);
            setViewLevel(1);
        } catch (error) {
            console.error('Failed to fetch sub-topics:', error);
            setSubTopics([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle SubTopic Selection
    const handleSubTopicSelect = async (st) => {
        console.log('Subtopic selected:', st.id);
        setSelectedSubTopic(st);
        setLoading(true);
        try {
            // Updated call using the new content-specific API
            const { content: data } = await subTopicService.getSubTopicContent(st.id);
            console.log('Content fetched:', data ? 'Yes' : 'No');
            setContent(data);
            setViewLevel(2);
        } catch (error) {
            console.error('Failed to fetch content:', error);
            setContent(null);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        if (viewLevel > 0) {
            setViewLevel(viewLevel - 1);
            if (viewLevel === 1) setSelectedTopic(null);
            if (viewLevel === 2) setSelectedSubTopic(null);
        }
    };

    const filteredTopics = topics.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredSubTopics = subTopics.filter(st =>
        (st.title || st.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-[calc(100vh-140px)] flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${viewLevel > 0 ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white hover:scale-105' : 'bg-green-500 text-white'}`}
                        disabled={viewLevel === 0}
                    >
                        {viewLevel === 0 ? <Terminal className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">
                            <span className={viewLevel === 0 ? 'text-green-500' : ''}>Topics</span>
                            {viewLevel >= 1 && (
                                <>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                    <span className={viewLevel === 1 ? 'text-blue-500' : ''}>{selectedTopic?.name}</span>
                                </>
                            )}
                            {viewLevel >= 2 && (
                                <>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                    <span className="text-emerald-500">{selectedSubTopic?.title || selectedSubTopic?.name}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic leading-none">
                            {viewLevel === 0 && "Module Architecture"}
                            {viewLevel === 1 && "Sub-Matrix Nodes"}
                            {viewLevel === 2 && "Knowledge Artifacts"}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {viewLevel < 2 && (
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-green-500 transition-colors" />
                            <input
                                type="text"
                                placeholder={`Search...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs w-48 focus:border-green-500/50 outline-none transition-all"
                            />
                        </div>
                    )}
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 hover:text-green-500"
                    >
                        {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => { }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add {viewLevel === 0 ? 'Topic' : viewLevel === 1 ? 'Subtopic' : 'Content'}
                    </button>
                </div>
            </div>

            {/* Level 0: Topics Grid */}
            {viewLevel === 0 && (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pb-10">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-40 bg-white/50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 animate-pulse" />
                            ))
                        ) : filteredTopics.map(topic => (
                            <div
                                key={topic.id}
                                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-7 hover:border-green-500/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer flex flex-col h-full"
                                onClick={() => handleTopicSelect(topic)}
                            >
                                <div className="flex justify-end items-start mb-6">
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                        <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-amber-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); }}><Pencil className="w-4 h-4" /></button>
                                        <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-rose-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); }}><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors capitalize leading-tight">
                                        {topic.name}
                                    </h3>
                                    <p className="text-[11px] text-zinc-500 font-bold tracking-tighter uppercase opacity-60">
                                        {topic.id}
                                    </p>
                                </div>

                                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Open Infrastructure</span>
                                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all shadow-inner">
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col">
                        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex items-center text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                            <div className="flex-1">Topic Name & ID</div>
                            <div className="w-48 text-center">Status</div>
                            <div className="w-32 text-right px-4">Actions</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {loading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className="h-12 border-b border-zinc-100 dark:border-zinc-800 animate-pulse" />
                                ))
                            ) : filteredTopics.map(topic => (
                                <div
                                    key={topic.id}
                                    onClick={() => handleTopicSelect(topic)}
                                    className="group flex items-center px-6 py-2 hover:bg-green-500/5 border-b border-zinc-100 dark:border-zinc-800 transition-colors cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-[13px] text-zinc-900 dark:text-white truncate group-hover:text-green-500 transition-colors uppercase italic">{topic.name}</h3>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">{topic.id}</p>
                                    </div>
                                    <div className="w-48 text-center">
                                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[8px] font-black text-zinc-500 uppercase tracking-widest border border-zinc-200 dark:border-zinc-700">Production Node</span>
                                    </div>
                                    <div className="w-32 flex items-center justify-end gap-1.5 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 hover:text-amber-500 transition-colors" onClick={(e) => e.stopPropagation()}><Pencil className="w-3.5 h-3.5" /></button>
                                        <button className="p-1.5 hover:text-rose-500 transition-colors" onClick={(e) => e.stopPropagation()}><Trash2 className="w-3.5 h-3.5" /></button>
                                        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:translate-x-1 transition-transform ml-1" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}

            {/* Level 1: SubTopics */}
            {viewLevel === 1 && (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar pb-10">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-48 bg-white/50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 animate-pulse" />
                            ))
                        ) : filteredSubTopics.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <Activity className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No Sub-Matrix Nodes Available</p>
                            </div>
                        ) : filteredSubTopics.map(st => (
                            <div
                                key={st.id}
                                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-6 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col h-full"
                                onClick={() => handleSubTopicSelect(st)}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                        <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-amber-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); }}><Pencil className="w-4 h-4" /></button>
                                        <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-rose-500 transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); }}><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors uppercase italic leading-tight">
                                        {st.title || st.name}
                                    </h3>
                                    <p className="text-[11px] text-zinc-500 line-clamp-3 leading-relaxed mb-4">
                                        {st.description || 'System generated branch documentation for security practitioners.'}
                                    </p>
                                </div>

                                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-black">{st.screenKey || 'KEY'}</div>
                                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-right-8 duration-500">
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Selected Parent Node</p>
                                <h2 className="text-lg font-black text-zinc-900 dark:text-white">{selectedTopic?.name}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 overflow-y-auto custom-scrollbar pb-10">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-24 bg-white/50 dark:bg-zinc-900/50 rounded-2xl animate-pulse" />
                                ))
                            ) : filteredSubTopics.length === 0 ? (
                                <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                    <Activity className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No Sub-Matrix Nodes Available</p>
                                </div>
                            ) : filteredSubTopics.map(st => (
                                <div
                                    key={st.id}
                                    className="group flex items-center gap-6 p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl hover:border-blue-500/50 transition-all cursor-pointer shadow-sm"
                                    onClick={() => handleSubTopicSelect(st)}
                                >
                                    <div className="flex-1 min-w-0 pr-4 ml-4">
                                        <h3 className="font-black text-sm text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase italic mb-0.5" title={st.title || st.name}>
                                            {st.title || st.name}
                                        </h3>
                                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed truncate">
                                            {st.description || 'System generated branch documentation for security practitioners.'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black text-zinc-500">{st.screenKey || 'N/A'}</div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:text-amber-500 transition-colors" onClick={(e) => e.stopPropagation()}><Pencil className="w-4 h-4" /></button>
                                            <button className="p-2 hover:text-rose-500 transition-colors" onClick={(e) => e.stopPropagation()}><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}

            {/* Level 2: Content View */}
            {viewLevel === 2 && (
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-12 duration-700">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-emerald-500/5 to-transparent flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Authenticated Lesson Profile</p>
                                <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic">{content?.title}</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:text-amber-500 transition-all"><Pencil className="w-5 h-5" /></button>
                            <button className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">Edit All Blocks</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                        {loading ? (
                            <div className="space-y-8 animate-pulse max-w-3xl mx-auto">
                                <div className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full w-3/4" />
                                <div className="space-y-4">
                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full" />
                                    <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-5/6" />
                                </div>
                                <div className="h-80 bg-zinc-100 dark:bg-zinc-800 rounded-[3rem]" />
                            </div>
                        ) : content ? (
                            <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
                                {content.contentItems && Array.isArray(content.contentItems) && content.contentItems.map((item, idx) => (
                                    <div key={idx} className="group relative animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
                                        {/* Row controls */}
                                        <div className="absolute -left-12 top-0 bottom-0 flex flex-col justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-blue-500 transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-rose-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>

                                        {(item.type === 'heading' || item.type === 'subHeading') && (
                                            <div className={`border-l-4 ${item.type === 'heading' ? 'border-green-500' : 'border-blue-500'} pl-6 py-2 my-12 bg-zinc-500/5 rounded-r-3xl`}>
                                                <h3 className={`${item.type === 'heading' ? 'text-2xl' : 'text-xl'} font-black text-zinc-800 dark:text-zinc-200 tracking-tight uppercase italic`}>
                                                    {item.text}
                                                </h3>
                                            </div>
                                        )}
                                        {(item.type === 'paragraph' || item.type === 'customText') && (
                                            <p className={`${item.type === 'customText' ? 'font-bold text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'} text-lg leading-relaxed`}>
                                                {item.text}
                                            </p>
                                        )}
                                        {item.type === 'bulletPoint' && (
                                            <div className="flex gap-5 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800 hover:shadow-xl hover:shadow-zinc-500/5 transition-all">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2.5 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                                <p className="text-zinc-700 dark:text-zinc-300 font-bold italic tracking-tight">{item.text}</p>
                                            </div>
                                        )}
                                        {item.type === 'image' && (
                                            <div className="my-14 rounded-[3rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl group/img">
                                                <img src={item.imageUrl} alt={item.text} className="w-full h-auto transition-transform duration-1000 group-hover/img:scale-110" />
                                                {item.text && <div className="p-4 bg-black/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-[0.3em] text-center">{item.text}</div>}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-40 opacity-30">
                                <X className="w-20 h-20 mb-8" />
                                <h2 className="text-2xl font-black uppercase">No Content Found</h2>
                            </div>
                        )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-xl flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            <span className="flex items-center gap-2 px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                                <Activity className="w-3 h-3 text-green-500" /> Lesson Version: 1.0.4
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-colors">Preview Landing</button>
                            <button className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">Publish Live</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModuleExplorer;
