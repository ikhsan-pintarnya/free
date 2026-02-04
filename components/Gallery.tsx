import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Loader2, Edit3, RotateCcw, Terminal, Copy, Info, Save, Download, Check, ShieldCheck } from 'lucide-react';
import { mergeWatermark } from '../utils/watermarkUtils';

interface GalleryProps {
    images: GeneratedImage[];
    isGenerating: boolean;
    onSelect: (image: GeneratedImage) => void;
    onRegenerate: () => void;
    onSave: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, isGenerating, onSelect, onRegenerate, onSave }) => {
    const [showWatermark, setShowWatermark] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleDownload = async (image: GeneratedImage) => {
        try {
            setIsDownloading(true);
            let dataUrl = `data:${image.mimeType};base64,${image.base64}`;
            const filename = `pintarnya-headshot-${showWatermark ? 'watermarked-' : ''}${image.id}.png`;

            if (showWatermark) {
                dataUrl = await mergeWatermark(image.base64, image.mimeType);
            }

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download failed", err);
            alert("Failed to download image.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900">Your AI Headshot</h2>
                    <p className="text-slate-500 font-medium">We've generated a professional headshot based on your configuration.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onSave}
                        disabled={isGenerating || images.length === 0}
                        className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-6 py-3 rounded-xl border border-blue-200 font-bold shadow-sm transition-all hover:shadow-md disabled:opacity-50 active:scale-95"
                    >
                        <Save size={18} />
                        Save to Library
                    </button>
                    <button
                        onClick={onRegenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 text-sm bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl border border-slate-200 font-bold shadow-sm transition-all hover:shadow-md disabled:opacity-50 active:scale-95"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <RotateCcw size={18} />}
                        Regenerate
                    </button>
                </div>
            </div>

            {isGenerating && images.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                        <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 relative z-10">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    </div>
                    <p className="text-slate-900 font-black text-2xl mt-2">Architecting your Digital Twin...</p>
                    <p className="text-slate-500 font-medium mt-2 max-w-sm text-center">
                        Nano Banana is calculating facial geometry, applying fabric textures, and calibrating lighting levels.
                    </p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Centered Image Result */}
                    <div className="flex flex-col items-center gap-8 animate-fade-in">
                        {images.map((img, idx) => (
                            <div key={img.id} className="flex flex-col gap-6 w-full max-w-md">
                                <div
                                    className="group relative w-full aspect-square rounded-[2.5rem] overflow-hidden border-2 border-slate-100 shadow-2xl bg-white"
                                >
                                    <img
                                        src={`data:${img.mimeType};base64,${img.base64}`}
                                        alt={`Generated Headshot`}
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Watermark Preview Overlay */}
                                    {showWatermark && (
                                        <div className="absolute inset-0 pointer-events-none opacity-50 flex items-center justify-center overflow-hidden">
                                            {/* CSS Pattern for Preview - mimics the canvas logic */}
                                            <div className="absolute w-[150%] h-[150%] flex flex-wrap content-center justify-center gap-8 -rotate-[30deg] transform origin-center">
                                                {Array.from({ length: 120 }).map((_, i) => (
                                                    <span key={i} className="text-white text-2xl font-black opacity-30 select-none whitespace-nowrap">pintarnya</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Interactive Overlay */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        onClick={() => onSelect(img)}
                                    >
                                        <div className="absolute bottom-6 right-6 bg-white text-blue-600 p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                                            <Edit3 size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Download & Options Control Panel */}
                                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showWatermark ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900">Post-Processing</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase">Watermark & Protection</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={showWatermark}
                                                onChange={(e) => setShowWatermark(e.target.checked)}
                                            />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>

                                    <button
                                        onClick={() => handleDownload(img)}
                                        disabled={isDownloading}
                                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-black transition-all shadow-lg active:scale-[0.98]
                                ${showWatermark
                                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
                                                : 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20'}
                            `}
                                    >
                                        {isDownloading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <Download size={18} />
                                        )}
                                        {showWatermark ? 'Download Watermarked Image' : 'Download HD Original'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Consolidated Technical Prompt Log */}
                    {images.length > 0 && (
                        <div className="animate-slide-up">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-blue-400 border border-slate-800">
                                    <Terminal size={16} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Generation Blueprint</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">The full instructions package sent to Gemini Nano Banana</p>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative group/prompt">
                                <div className="flex items-center justify-between px-8 py-4 bg-slate-800/50 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <span className="ml-4 text-[10px] font-mono text-slate-500">system_instruction_v2.5.log</span>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(images[0].promptUsed)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-[10px] font-black transition-all border border-slate-700"
                                    >
                                        <Copy size={12} /> COPY PROMPT
                                    </button>
                                </div>

                                <div className="p-8 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    <div className="text-xs text-blue-100 font-mono leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
                                        {images[0].promptUsed}
                                    </div>
                                </div>

                                {/* Bottom Info Bar */}
                                <div className="px-8 py-3 bg-blue-600/10 border-t border-blue-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                                        <Info size={12} /> Use this block in AI Studio for testing
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono italic">
                                        Total Tokens: ~{Math.round(images[0].promptUsed.length / 4)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};