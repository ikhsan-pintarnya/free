import React from 'react';
import { HeadshotFeatures } from '../types';
import { Sparkles, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';

interface WizardProps {
    features: HeadshotFeatures;
    updateFeatures: (key: keyof HeadshotFeatures, value: any) => void;
    onNext: () => void;
    uploadedImagePreview: { base64: string; mimeType: string } | null;
}

const OUTFIT_OPTIONS = [
    {
        id: 'Navy Blue Executive Suit, white shirt, silk tie',
        title: 'Executive',
        img: 'https://images.unsplash.com/photo-1594938298603-c8148c47e356?q=80&w=300&h=400&auto=format&fit=crop'
    },
    {
        id: 'Dark Grey Blazer over a black t-shirt',
        title: 'Tech Modern',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=400&auto=format&fit=crop'
    },
    {
        id: 'Casual Linen Shirt in off-white, relaxed collar',
        title: 'Casual',
        img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=300&h=400&auto=format&fit=crop'
    },
    {
        id: 'Professional silk blouse with subtle accents',
        title: 'Blouse',
        img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=400&auto=format&fit=crop'
    },
    {
        id: 'Minimalist black turtleneck',
        title: 'Creative',
        img: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=300&h=400&auto=format&fit=crop'
    },
    {
        id: 'Batik Shirt, Indonesian formal wear',
        title: 'Batik',
        img: 'https://images.unsplash.com/photo-1628151016003-7cb71c4c1143?q=80&w=300&h=400&auto=format&fit=crop'
    },
];

export const LiteStepWizard: React.FC<WizardProps> = ({ features, updateFeatures, onNext }) => {
    return (
        <div className="flex flex-col max-w-4xl mx-auto w-full animate-fade-in pb-20">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Select Your Style</h2>
                <p className="text-slate-500 font-medium">Choose an outfit for your professional headshot.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {OUTFIT_OPTIONS.map((outfit) => (
                    <button
                        key={outfit.id}
                        onClick={() => updateFeatures('attire', outfit.id)}
                        className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 transition-all duration-300
                            ${features.attire === outfit.id
                                ? 'border-blue-600 ring-4 ring-blue-600/20 scale-[1.02] shadow-xl'
                                : 'border-slate-100 hover:border-slate-300 hover:shadow-lg scale-100'}
                        `}
                    >
                        <img
                            src={outfit.img}
                            alt={outfit.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end h-1/2`}>
                            <span className="text-white font-bold text-lg">{outfit.title}</span>
                            {features.attire === outfit.id && (
                                <div className="absolute top-3 right-3 bg-blue-600 text-white p-1 rounded-full shadow-lg animate-bounce-short">
                                    <CheckCircle2 size={16} strokeWidth={4} />
                                </div>
                            )}
                        </div>
                    </button>
                ))}

                {/* Custom Upload Option */}
                <button
                    onClick={() => updateFeatures('attire', 'Custom Attire Reference')}
                    className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-white transition-all flex flex-col items-center justify-center gap-3
                         ${features.attire === 'Custom Attire Reference' ? 'border-blue-600 ring-4 ring-blue-600/20 bg-blue-50/50' : ''}
                    `}
                >
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors shadow-sm">
                        <Upload size={20} />
                    </div>
                    <span className="text-slate-600 font-bold group-hover:text-blue-600 transition-colors">Custom Upload</span>
                </button>
            </div>

            {features.attire === 'Custom Attire Reference' && (
                <div className="mb-10 bg-blue-50 border border-blue-100 p-6 rounded-2xl animate-fade-in text-center">
                    <p className="text-blue-800 font-bold mb-3">Upload your outfit reference</p>
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
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2.5 file:px-6
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-600 file:text-white
                        hover:file:bg-blue-700
                        cursor-pointer mx-auto max-w-xs"
                    />
                </div>
            )}

            <button
                onClick={onNext}
                disabled={!features.attire}
                className="w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg transform hover:-translate-y-1 active:scale-[0.98]"
            >
                <Sparkles size={20} /> Generate Headshot
            </button>
        </div>
    );
};
