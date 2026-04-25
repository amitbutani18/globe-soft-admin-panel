import React, { useState, useEffect } from 'react';
import {
    Trophy,
    Search,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    Eye,
    X,
    Save,
    ChevronLeft,
    ChevronRight,
    Target,
    Activity,
    LayoutGrid,
    CheckCircle2,
    Sparkles,
    Zap,
    ToggleLeft,
    ToggleRight,
    ListTree
} from 'lucide-react';
import ConfirmationModal from '../../../components/ConfirmationModal';
import levelQuizService from '../../../models/levelQuizService';

const LIMIT_OPTIONS = [5, 10, 20, 50];

const LevelQuizzes = () => {
    // State
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        type: 'warning',
        title: '',
        message: '',
        onConfirm: null
    });

    // Modal States
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [editingLevel, setEditingLevel] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        level: '',
        levelNum: 1,
        questions: []
    });

    const [editFormData, setEditFormData] = useState({
        id: '',
        level: '',
        levelNum: 1,
        questions: []
    });

    const [formLoading, setFormLoading] = useState(false);

    // Fetch Data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await levelQuizService.getLevels();
            if (res.data) {
                setLevels(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Matrix Editor Handlers
    const addQuestion = (isEdit = false) => {
        const newQuestion = { question: '', options: ['', '', '', ''], correctAnswerIndex: 0 };
        if (isEdit) {
            setEditFormData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
        } else {
            setFormData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
        }
    };

    const removeQuestion = (idx, isEdit = false) => {
        if (isEdit) {
            setEditFormData(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
        } else {
            setFormData(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
        }
    };

    const updateQuestionField = (idx, field, value, isEdit = false) => {
        const updateFunc = (prev) => {
            const newQuestions = [...prev.questions];
            newQuestions[idx] = { ...newQuestions[idx], [field]: value };
            return { ...prev, questions: newQuestions };
        };
        if (isEdit) setEditFormData(updateFunc);
        else setFormData(updateFunc);
    };

    const updateOption = (qIdx, oIdx, value, isEdit = false) => {
        const updateFunc = (prev) => {
            const newQuestions = [...prev.questions];
            const newOptions = [...newQuestions[qIdx].options];
            newOptions[oIdx] = value;
            newQuestions[qIdx] = { ...newQuestions[qIdx], options: newOptions };
            return { ...prev, questions: newQuestions };
        };
        if (isEdit) setEditFormData(updateFunc);
        else setFormData(updateFunc);
    };

    // Generic Handlers
    const handleField = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'levelNum' ? parseInt(value) || 0 : value)
        }));
    };

    const handleEditField = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'levelNum' ? parseInt(value) || 0 : value)
        }));
    };

    const executeSubmit = async () => {
        setFormLoading(true);
        try {
            const res = await levelQuizService.createLevel(formData);
            setIsAddModalOpen(false);
            setFormData({ level: '', levelNum: levels.length + 1, questions: [] });
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to add level: ${error.message}`);
        } finally {
            setFormLoading(false);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'success',
            title: 'Confirm Level Initialization',
            message: 'Are you sure you want to initialize this level progression node?',
            onConfirm: executeSubmit
        });
    };

    const executeEditSubmit = async () => {
        setFormLoading(true);
        try {
            const res = await levelQuizService.updateLevel(editingLevel.id, editFormData);
            setIsEditModalOpen(false);
            setEditingLevel(null);
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to update level: ${error.message}`);
        } finally {
            setFormLoading(false);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setConfirmConfig({
            isOpen: true,
            type: 'warning',
            title: 'Confirm Changes',
            message: 'Are you sure you want to update this level manifestation?',
            onConfirm: executeEditSubmit
        });
    };

    const executeDelete = async (level) => {
        try {
            const res = await levelQuizService.deleteLevel(level.id);
            fetchData();
            if (res.message) alert(res.message);
        } catch (error) {
            alert(`Failed to delete: ${error.message}`);
        } finally {
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleDelete = (level) => {
        setConfirmConfig({
            isOpen: true,
            type: 'danger',
            title: 'Terminate Node',
            message: `Are you sure you want to delete "${level.level}"? This action cannot be undone.`,
            onConfirm: () => executeDelete(level)
        });
    };

    // Modal Triggers
    const openView = (level) => {
        setSelectedLevel(level);
        setIsViewModalOpen(true);
    };

    const openEdit = (level) => {
        setEditingLevel(level);
        setEditFormData({
            id: level.id,
            level: level.level || '',
            levelNum: level.levelNum || 0,
            questions: level.questions || []
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20 flex items-center justify-center text-white shrink-0 transition-transform hover:scale-105 duration-300">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase italic">Level Progression</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-1 max-w-lg font-medium text-shadow-sm italic">
                            Manage ethical hacking level quizzes and progression nodes.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-all text-zinc-600 dark:text-zinc-400 disabled:opacity-50"
                        title="Resync Data"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl transition-all font-bold shadow-2xl active:scale-95 text-[11px] uppercase tracking-[0.2em]"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize Level
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Levels', value: levels.length, icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Quiz Nodes', value: `${levels.reduce((acc, curr) => acc + (curr.questions?.length || 0), 0)} Total`, icon: ListTree, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Security Status', value: 'Production', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6 flex items-center gap-5 transition-all hover:scale-[1.02] duration-300">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0 shadow-inner`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">{stat.value}</p>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500">
                <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search levels..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3.5 text-sm focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-400 font-bold"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans italic">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-12 text-center">LVL</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Registry Descriptor</th>
                                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] w-48 text-right text-shadow-sm">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50 font-black">
                            {loading ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-20 text-center uppercase tracking-widest italic animate-pulse text-zinc-400 font-black">
                                        Accessing Progression Protocols...
                                    </td>
                                </tr>
                            ) : levels.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-8 py-24 text-center">
                                        <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest italic leading-loose opacity-40">
                                            No Level Nodes Detected in Matrix.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                levels.filter(l => l.level?.toLowerCase().includes(searchQuery.toLowerCase())).map((level, idx) => (
                                    <tr key={level.id || idx} className="group hover:bg-emerald-500/[0.03] transition-colors border-l-[3px] border-transparent hover:border-emerald-500 duration-300">
                                        <td className="px-8 py-6 font-mono text-[10px] text-zinc-400 group-hover:text-emerald-500 transition-colors uppercase text-center font-black italic">
                                            {level.levelNum?.toString().padStart(2, '0') || '00'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 group-hover:scale-110 transition-transform duration-300">
                                                    <Zap className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight mb-0.5 group-hover:translate-x-1 transition-transform">{level.level}</p>
                                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium italic">{level.questions?.length || 0} Progression Nodes Assigned</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                                <button onClick={() => openView(level)} className="p-3 hover:bg-emerald-500/10 text-emerald-600 rounded-2xl transition-all border border-transparent hover:border-emerald-500/20" title="Inspect Node"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => openEdit(level)} className="p-3 hover:bg-emerald-500/10 text-emerald-600 rounded-2xl transition-all border border-transparent hover:border-emerald-500/20" title="Manifest Rewrite"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(level)} className="p-3 hover:bg-rose-500/10 text-rose-500 rounded-2xl transition-all border border-transparent hover:border-rose-500/20" title="Terminate Node"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Modal */}
            {isViewModalOpen && selectedLevel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-zinc-900 border border-white/20 dark:border-zinc-800 rounded-[3.5rem] w-full max-w-4xl shadow-3xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-12 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-b border-zinc-200 dark:border-zinc-800 relative flex-shrink-0 italic font-black">
                            <button onClick={() => setIsViewModalOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-white dark:hover:bg-zinc-800 rounded-2xl transition-all shadow-2xl active:scale-90 group"><X className="w-6 h-6 text-zinc-500 group-hover:rotate-90 transition-transform duration-300 font-bold" /></button>
                            <div className="flex items-center gap-10">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500 flex items-center justify-center text-white shadow-2xl transition-transform hover:scale-110 duration-500 shadow-emerald-500/40 ring-8 ring-emerald-500/10">
                                    <Trophy className="w-16 h-16" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.5em] italic">Progression Node Manifest</p>
                                    </div>
                                    <h2 className="text-5xl font-black text-zinc-900 dark:text-white leading-tight tracking-tighter italic lowercase">{selectedLevel.level || 'untitled node'}</h2>
                                    <div className="flex items-center gap-6 mt-4 opacity-40 italic">
                                        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">Registry ID: {selectedLevel.id}</p>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Level Priority: {selectedLevel.levelNum || 'Unset'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar italic font-black">
                            <section>
                                <p className="text-[12px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-emerald-500/30"></div>
                                    Assessment Matrix Nodes ({selectedLevel.questions?.length || 0})
                                </p>
                                <div className="grid grid-cols-1 gap-8">
                                    {selectedLevel.questions?.map((q, idx) => (
                                        <div key={idx} className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] p-12 shadow-inner group hover:border-emerald-500/30 transition-all duration-500">
                                            <div className="flex gap-10">
                                                <div className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-emerald-600 font-black text-2xl shadow-2xl group-hover:scale-110 transition-all duration-500 shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-8 flex-1">
                                                    <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100 leading-relaxed italic lowercase">{q.question}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {q.options?.map((opt, oIdx) => (
                                                            <div key={oIdx} className={`p-6 rounded-2xl border flex items-center gap-5 transition-all duration-300 ${oIdx === q.correctAnswerIndex
                                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'}`}>
                                                                <div className={`w-3 h-3 rounded-full shrink-0 ${oIdx === q.correctAnswerIndex ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300 ring-4 ring-zinc-100 dark:ring-zinc-800'}`}></div>
                                                                <span className="font-bold lowercase text-sm line-clamp-1">{opt}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Add / Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[3.5rem] w-full max-w-2xl shadow-3xl animate-in zoom-in-95 duration-400 max-h-[92vh] flex flex-col overflow-hidden italic font-black">
                        <div className={`p-10 border-b flex items-center justify-between flex-shrink-0 ${isEditModalOpen ? 'bg-emerald-500/5' : 'bg-blue-500/5'}`}>
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20 ${isEditModalOpen ? 'bg-emerald-600' : 'bg-emerald-500'}`}>
                                    {isEditModalOpen ? <Pencil className="w-7 h-7" /> : <Plus className="w-8 h-8" />}
                                </div>
                                <div className="italic">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5 leading-none">Progression Matrix Editor</p>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase leading-none italic">{isEditModalOpen ? 'Rewrite Node' : 'Initialize Node'}</h2>
                                </div>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-all active:scale-90"><X className="w-7 h-7 text-zinc-400" /></button>
                        </div>

                        <form onSubmit={isEditModalOpen ? handleEditSubmit : handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar italic font-black">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">Descriptor Name *</label>
                                    <input
                                        type="text" name="level" required
                                        value={isEditModalOpen ? editFormData.level : formData.level}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="Level 1"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all font-black text-sm shadow-inner"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-3">Level Number *</label>
                                    <input
                                        type="number" name="levelNum" required
                                        value={isEditModalOpen ? editFormData.levelNum : formData.levelNum}
                                        onChange={isEditModalOpen ? handleEditField : handleField}
                                        placeholder="1"
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all font-black text-sm shadow-inner text-center"
                                    />
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="flex items-center justify-between border-b border-emerald-500/10 pb-6">
                                    <p className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.3em] italic leading-none">Assessment Nodes ({(isEditModalOpen ? editFormData.questions.length : formData.questions.length)})</p>
                                    <button
                                        type="button"
                                        onClick={() => addQuestion(isEditModalOpen)}
                                        className="px-6 py-3 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 italic"
                                    >
                                        Add Quiz Node
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {(isEditModalOpen ? editFormData.questions : formData.questions).map((q, idx) => (
                                        <div key={idx} className="relative bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 shadow-inner animate-in slide-in-from-right-4">
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(idx, isEditModalOpen)}
                                                className="absolute top-6 right-6 p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                            ><Trash2 className="w-5 h-5" /></button>

                                            <div className="space-y-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Assessment Question {idx + 1}</label>
                                                    <textarea
                                                        value={q.question}
                                                        onChange={(e) => updateQuestionField(idx, 'question', e.target.value, isEditModalOpen)}
                                                        rows={2}
                                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 outline-none focus:border-emerald-500/50 transition-all text-sm font-black resize-none"
                                                        placeholder="Define the query..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={oIdx} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wide italic">Node Option {oIdx + 1}</label>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuestionField(idx, 'correctAnswerIndex', oIdx, isEditModalOpen)}
                                                                    className={`w-4 h-4 rounded-full border-2 transition-all ${oIdx === q.correctAnswerIndex ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300 dark:border-zinc-700'}`}
                                                                ></button>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => updateOption(idx, oIdx, e.target.value, isEditModalOpen)}
                                                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-emerald-500/30 text-xs font-bold"
                                                                placeholder={`Payload ${oIdx + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10 sticky bottom-0 bg-white dark:bg-zinc-900 pb-2 translate-y-2">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 px-8 py-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 italic">Discard</button>
                                <button type="submit" disabled={formLoading}
                                    className={`flex-[2] py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] text-white shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 italic ${isEditModalOpen ? 'bg-emerald-600 shadow-emerald-500/30 ring-4 ring-emerald-500/10' : 'bg-emerald-500 shadow-emerald-500/20 ring-4 ring-emerald-500/5'}`}>
                                    {formLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isEditModalOpen ? 'Commit Manifest' : 'Seal Registry'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Confirmation Matrix */}
            <ConfirmationModal
                isOpen={confirmConfig.isOpen}
                type={confirmConfig.type}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={confirmConfig.onConfirm}
                onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default LevelQuizzes;
