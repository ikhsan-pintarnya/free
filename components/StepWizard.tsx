import React, { useState } from 'react';
import { HeadshotFeatures } from '../types';
import { ArrowRight, Camera, UserCheck, Sparkles, Layout, Monitor, Smile, Eye, Palette, Maximize, Settings2, Image as ImageIcon, CheckCircle2, PencilLine, FileText } from 'lucide-react';

interface WizardProps {
    features: HeadshotFeatures;
    updateFeatures: (key: keyof HeadshotFeatures, value: any) => void;
    onNext: () => void;
    uploadedImagePreview: { base64: string; mimeType: string } | null;
}

const POSE_OPTIONS = [
    { id: 'Frontal Portrait', title: 'Frontal', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop' },
    { id: '3/4 Profile Turn', title: '3/4 Turn', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop' },
    { id: 'Power Stance framing', title: 'Power', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&h=200&auto=format&fit=crop' },
    { id: 'Approachable head tilt', title: 'Friendly', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&h=200&auto=format&fit=crop' },
];

const BG_OPTIONS = [
    { id: 'Modern tech office with soft daylight bokeh', title: 'Modern Office', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 'Premium matte grey studio background', title: 'Grey Studio', img: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 'High-floor corporate window overlooking a city skyline', title: 'City Skyline', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 'Sunlit outdoor green space with blurred leaves', title: 'Natural Park', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=300&h=200&auto=format&fit=crop' },
    { id: 'Solid Blue Background', title: 'Solid Blue', img: 'https://placehold.co/300x200/0000FF/FFFFFF?text=Blue' },
    { id: 'Solid Red Background', title: 'Solid Red', img: 'https://placehold.co/300x200/FF0000/FFFFFF?text=Red' },
];

// Vibe options removed

export const StepWizard: React.FC<WizardProps> = ({ features, updateFeatures, onNext, uploadedImagePreview }) => {
    const [showReview, setShowReview] = useState(false);

    if (showReview) {
        return (
            <div className="flex flex-col h-full max-w-4xl mx-auto w-full animate-fade-in space-y-8 pb-20">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-600/20">
                        <FileText size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Final Configuration Review</h2>
                    <p className="text-slate-500 font-medium">Verify your AI generation parameters before proceeding.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Persona Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Sparkles size={14} className="text-blue-600" /> Style & Persona
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-xs text-slate-500 font-bold">Expression</span>
                                <span className="text-xs text-slate-900 font-black">{features.expression}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-xs text-slate-500 font-bold">Grooming</span>
                                <span className="text-xs text-slate-900 font-black">{features.grooming}</span>
                            </div>
                        </div>
                    </div>

                    {/* Environment Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Monitor size={14} className="text-blue-600" /> Set & Background
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-xs text-slate-500 font-bold">Location</span>
                                <span className="text-xs text-slate-900 font-black truncate max-w-[150px]">
                                    {BG_OPTIONS.find(b => b.id === features.background)?.title ||
                                        (features.background.startsWith('Solid background with hex color')
                                            ? `Custom (${features.background.split(' ').pop()})`
                                            : 'Custom')}
                                </span>
                            </div>
                            <div className="flex flex-col border-b border-slate-50 pb-2">
                                <span className="text-xs text-slate-500 font-bold mb-1">Detailed Attire</span>
                                <span className="text-xs text-slate-900 font-black">{features.attire}</span>
                            </div>
                        </div>
                    </div>

                    {/* Technical Card */}
                    <div className="md:col-span-2 bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                        <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Camera size={14} /> Technical Execution Blueprint
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 font-black uppercase mb-1">Composition</span>
                                <span className="text-xs font-bold">{POSE_OPTIONS.find(p => p.id === features.pose)?.title || 'Custom'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 font-black uppercase mb-1">Camera Angle</span>
                                <span className="text-xs font-bold">{features.cameraAngle.split(' ')[0]}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 font-black uppercase mb-1">Optics</span>
                                <span className="text-xs font-bold">{features.lensDepth.split(' ')[0]}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 font-black uppercase mb-1">Grade</span>
                                <span className="text-xs font-bold">{features.colorGrade}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        onClick={() => setShowReview(false)}
                        className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-black py-5 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <PencilLine size={18} /> Modify Selections
                    </button>
                    <button
                        onClick={onNext}
                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95"
                    >
                        <CheckCircle2 size={18} /> Confirm & Generate Headshot
                    </button>
                </div>

                <div className="flex items-center justify-center gap-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <span className="w-12 h-[1px] bg-slate-200"></span>
                    Strict Identity Lock Engaged
                    <span className="w-12 h-[1px] bg-slate-200"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto w-full animate-fade-in space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Build Configuration</h2>
                    <p className="text-slate-500 font-medium">Fine-tune the parameters for your AI Headshot Engine.</p>
                </div>
                {uploadedImagePreview && (
                    <div className="flex items-center gap-3 bg-white p-2 pr-4 border border-slate-200 rounded-2xl shadow-sm">
                        <img
                            src={`data:${uploadedImagePreview.mimeType};base64,${uploadedImagePreview.base64}`}
                            alt="Source"
                            className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                        />
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            Biometric Source <br /> <span className="text-blue-600">Locked</span>
                        </div>
                    </div>
                )}
            </div>

            {/* SECTION 1: SCENE ARCHITECTURE (Semantic Intent) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                        <Layout size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">1. Scene Architecture</h3>
                        <p className="text-[11px] text-slate-500 font-bold">Defines persona, environment, and semantic atmosphere.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Monitor size={14} /> Environment Context
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            {BG_OPTIONS.map((bg) => (
                                <button
                                    key={bg.id}
                                    onClick={() => updateFeatures('background', bg.id)}
                                    className={`group relative h-20 overflow-hidden rounded-xl border-2 transition-all
                                    ${features.background === bg.id ? 'border-indigo-600 ring-2 ring-indigo-50' : 'border-slate-100 hover:border-slate-300'}
                                `}
                                >
                                    <img src={bg.img} alt={bg.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider">{bg.title}</span>
                                    </div>
                                </button>
                            ))}
                            {/* Custom Color Picker Button */}
                            <div className="relative h-20 overflow-hidden rounded-xl border-2 border-slate-100 hover:border-slate-300 transition-all">
                                <label className="cursor-pointer w-full h-full block">
                                    <input
                                        type="color"
                                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => {
                                            const color = e.target.value;
                                            updateFeatures('background', `Solid background with hex color ${color}`);
                                        }}
                                    />
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: features.background.startsWith('Solid background with hex color')
                                                ? features.background.split(' ').pop()
                                                : '#e2e8f0'
                                        }}
                                    >
                                        <span className={`text-[10px] font-black uppercase tracking-wider z-10 
                                            ${features.background.startsWith('Solid background with hex color') ? 'text-white drop-shadow-md' : 'text-slate-500'}`}>
                                            Custom Color
                                        </span>
                                        {/* Overlay to darken slightly for text readability if needed, or just let the user pick */}
                                        {features.background.startsWith('Solid background with hex color') && (
                                            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                                        )}
                                    </div>
                                    {/* Active State Indicator for Custom Color */}
                                    {features.background.startsWith('Solid background with hex color') && (
                                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-xl pointer-events-none" />
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Smile size={14} /> Facial Expression
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Slight Smile', 'Confident Neutral', 'Warm & Approachable', 'Focused / Serious'].map((exp) => (
                                <button
                                    key={exp}
                                    onClick={() => updateFeatures('expression', exp)}
                                    className={`px-4 py-3 rounded-xl border-2 text-left text-xs font-bold transition-all
                                        ${features.expression === exp ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'}
                                    `}
                                >
                                    {exp}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <UserCheck size={12} /> Personal Grooming
                        </label>
                        <div className="flex gap-3">
                            {['Well-Groomed', 'Natural / Raw'].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => updateFeatures('grooming', g)}
                                    className={`flex-1 px-4 py-3 rounded-xl border-2 text-xs font-black transition-all
                                    ${features.grooming === g ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'border-slate-100 bg-white text-slate-400'}
                                `}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon size={12} /> Semantic Attire
                        </label>
                        <select
                            value={features.attire}
                            onChange={(e) => updateFeatures('attire', e.target.value)}
                            className="w-full bg-white border-2 border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500 mb-2"
                        >
                            <option value="Navy Blue Executive Suit, white shirt, silk tie">Executive Suit (Sharp)</option>
                            <option value="Casual Linen Shirt in off-white, relaxed collar">Linen Shirt (Relaxed)</option>
                            <option value="Dark Grey Blazer over a black t-shirt">Modern Semi-Casual</option>
                            <option value="Minimalist black turtleneck">The Creative Look</option>
                            <option value="Professional silk blouse with subtle accents">Professional Blouse</option>
                            <option value="Custom Attire Reference">Custom Upload...</option>
                        </select>

                        {features.attire === 'Custom Attire Reference' && (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            const base64String = (reader.result as string).split(',')[1];
                                            updateFeatures('attireImage', base64String);
                                            updateFeatures('attireImageMimeType', file.type);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                    className="w-full text-xs text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-xs file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                                />
                                {features.attireImage && (
                                    <div className="mt-2 text-[10px] text-green-600 font-bold flex items-center gap-1">
                                        <CheckCircle2 size={10} /> Reference Image Loaded
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SECTION 2: TECHNICAL EXECUTION (Master Controls) */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Settings2 size={120} />
                </div>

                <div className="flex items-center gap-4 mb-10 relative">
                    <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-[0.15em]">2. Technical Execution</h3>
                        <p className="text-[11px] text-blue-400 font-bold uppercase">Master Optics & Framing Protocol</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Camera size={14} /> Composition & Framing
                        </h4>
                        <div className="grid grid-cols-4 gap-3">
                            {POSE_OPTIONS.map((pose) => (
                                <button
                                    key={pose.id}
                                    onClick={() => updateFeatures('pose', pose.id)}
                                    className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all
                                    ${features.pose === pose.id ? 'border-blue-500 ring-4 ring-blue-500/20 scale-105' : 'border-slate-800 hover:border-slate-600'}
                                `}
                                >
                                    <img src={pose.img} alt={pose.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[8px] font-black text-white text-center uppercase">
                                        {pose.title}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Eye size={12} /> Perspective Angle
                            </label>
                            <select
                                value={features.cameraAngle}
                                onChange={(e) => updateFeatures('cameraAngle', e.target.value)}
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="Eye-level portrait">Eye Level (Neutral)</option>
                                <option value="Low Angle heroic portrait">Low Angle (Powerful)</option>
                                <option value="High Angle soft portrait">High Angle (Approachable)</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Maximize size={12} /> Optical Depth
                            </label>
                            <select
                                value={features.lensDepth}
                                onChange={(e) => updateFeatures('lensDepth', e.target.value)}
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-blue-500 transition-colors"
                            >
                                <option value="F1.8 Cinematic Bokeh depth">F1.8 Bokeh (Studio)</option>
                                <option value="F8.0 Professional Sharp depth">F8.0 Sharp (Full)</option>
                                <option value="35mm Street Lens depth">35mm (Natural)</option>
                            </select>
                        </div>

                        <div className="space-y-4 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Palette size={12} /> Color Grading Pipeline
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['Clean & Modern', 'Warm Cinematic', 'Cool Commercial', 'Dramatic B&W'].map((grade) => (
                                    <button
                                        key={grade}
                                        onClick={() => updateFeatures('colorGrade', grade)}
                                        className={`px-3 py-3 rounded-xl border-2 text-[10px] font-black transition-all uppercase
                                        ${features.colorGrade === grade ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}
                                    `}
                                    >
                                        {grade.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowReview(true)}
                disabled={!features.pose || !features.attire}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-6 px-12 rounded-3xl transition-all shadow-2xl hover:shadow-indigo-600/20 disabled:opacity-20 flex items-center justify-center gap-4 text-lg transform hover:-translate-y-1 active:scale-[0.98]"
            >
                Initialize AI Engine Build <ArrowRight size={22} />
            </button>
        </div>
    );
};