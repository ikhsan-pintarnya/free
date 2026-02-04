import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { editHeadshot } from '../services/geminiService';
import { ArrowLeft, Send, Sparkles, Loader2, Download, History, ChevronRight, MoreVertical, Eye, X, Terminal, Copy, Check } from 'lucide-react';

interface EditorProps {
    initialImage: GeneratedImage;
    onBack: () => void;
    apiKey: string;
}

export const Editor: React.FC<EditorProps> = ({ initialImage, onBack, apiKey }) => {
    const [history, setHistory] = useState<GeneratedImage[]>([initialImage]);
    const [currentImage, setCurrentImage] = useState<GeneratedImage>(initialImage);
    const [prompt, setPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [showPromptModal, setShowPromptModal] = useState<GeneratedImage | null>(null);
    const [copied, setCopied] = useState(false);

    const handleEdit = async () => {
        if (!prompt.trim() || isProcessing) return;

        setIsProcessing(true);
        setError(null);

        try {
            const newImage = await editHeadshot(apiKey, currentImage, prompt);
            setHistory(prev => [...prev, newImage]);
            setCurrentImage(newImage);
            setPrompt('');
        } catch (err: any) {
            setError("Failed to update image. Try a different instruction.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyPrompt = () => {
        if (showPromptModal) {
            navigator.clipboard.writeText(showPromptModal.promptUsed);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEdit();
        }
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:${currentImage.mimeType};base64,${currentImage.base64}`;
        link.download = `professional-cv-photo-${Date.now()}.png`;
        link.click();
    }

    return (
        <div className="flex flex-col lg:flex-row h-full gap-8 animate-fade-in relative">
            {/* Full Prompt Modal */}
            {showPromptModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-2 font-bold text-slate-800">
                                <Terminal size={18} className="text-blue-600" />
                                Full AI Generation Prompt
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyPrompt}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                                    ${copied ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
                                `}
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy for AI Studio'}
                                </button>
                                <button onClick={() => setShowPromptModal(null)} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                            <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl font-mono text-xs leading-relaxed border border-slate-800 shadow-inner whitespace-pre-wrap">
                                {showPromptModal.promptUsed}
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Sparkles size={12} /> Optimization Tip
                                </p>
                                <p className="text-xs text-blue-900 leading-normal">
                                    Paste this entire block into the <strong>System Instructions</strong> in AI Studio to test how the model handles identity locks versus style variables.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Left: Image View */}
            <div className="flex-1 flex flex-col">
                <button onClick={onBack} className="self-start text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-6 text-sm font-semibold transition-colors">
                    <ArrowLeft size={16} /> Back to Results
                </button>

                <div className="relative flex-1 bg-white rounded-[2rem] overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm min-h-[400px]">
                    <img
                        src={`data:${currentImage.mimeType};base64,${currentImage.base64}`}
                        alt="Current Headshot"
                        className="max-h-[90%] max-w-[90%] object-contain rounded-xl shadow-lg"
                    />

                    {isProcessing && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                            <span className="font-bold">Applying edits...</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div className="text-xs text-slate-500 font-bold bg-slate-200/50 px-4 py-2 rounded-full border border-slate-200/50">
                        Viewing Version {history.findIndex(h => h.id === currentImage.id) + 1} of {history.length}
                    </div>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30"
                    >
                        <Download size={18} /> Download HD
                    </button>
                </div>
            </div>

            {/* Right: Controls & History */}
            <div className="w-full lg:w-[400px] flex flex-col bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm h-full">
                <div className="mb-6">
                    <h3 className="text-xl font-extrabold flex items-center gap-2 mb-2 text-slate-900">
                        <Sparkles className="text-blue-600" size={24} />
                        AI Retouching
                    </h3>
                    <p className="text-sm text-slate-500">
                        Select a version below to view or edit.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto mb-6 space-y-3 pr-2 custom-scrollbar">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={14} /> Version History
                    </div>

                    {history.map((img, idx) => {
                        const isActive = img.id === currentImage.id;
                        return (
                            <div key={img.id} className="relative group">
                                <button
                                    onClick={() => setCurrentImage(img)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4
                                    ${isActive
                                            ? 'bg-blue-50 border-blue-500 shadow-sm'
                                            : 'bg-white border-slate-100 hover:border-slate-300'
                                        }
                                `}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-8">
                                        <div className={`text-xs font-black ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                                            {idx === 0 ? 'Original Generation' : 'Edit Version'}
                                        </div>
                                        <div className="text-[11px] text-slate-400 truncate font-medium">
                                            {idx === 0 ? 'Base generated image' : img.promptUsed.slice(0, 50) + '...'}
                                        </div>
                                    </div>

                                    <div className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <ChevronRight size={16} className={isActive ? 'text-blue-500' : 'text-slate-300'} />
                                    </div>
                                </button>

                                {/* 3 Dots Menu Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === img.id ? null : img.id);
                                    }}
                                    className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {/* Action Popup */}
                                {activeMenuId === img.id && (
                                    <div
                                        className="absolute right-0 top-12 z-10 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 animate-scale-in"
                                        onMouseLeave={() => setActiveMenuId(null)}
                                    >
                                        <button
                                            onClick={() => {
                                                setShowPromptModal(img);
                                                setActiveMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-3 p-3 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
                                        >
                                            <Eye size={16} />
                                            See Full Prompt
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-xs font-bold animate-fade-in">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100">
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Try: 'Make the tie red' or 'Fix hair'..."
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-5 pr-14 text-slate-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 focus:outline-none resize-none h-32 text-sm font-medium transition-all"
                        />
                        <button
                            onClick={handleEdit}
                            disabled={isProcessing || !prompt.trim()}
                            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl disabled:opacity-30 transition-all shadow-xl shadow-blue-600/20"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};