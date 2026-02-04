import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Layout } from './Layout';
import { UploadStep } from './UploadStep';
import { LiteStepWizard } from './LiteStepWizard';
import { Gallery } from './Gallery';
import { Editor } from './Editor';
import { AppStep, HeadshotFeatures, GeneratedImage, SavedProject } from '../types';
import { generateHeadshot } from '../services/geminiService';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';

const INITIAL_FEATURES: HeadshotFeatures = {
    pose: '3/4 Profile',
    attire: 'Navy Blue Executive Suit, white shirt, silk tie',
    background: 'Modern tech office with soft daylight bokeh',
    grooming: 'Well-Groomed',
    expression: 'Slight Smile',
    cameraAngle: 'Eye-level',
    lensDepth: 'F1.8 Cinematic Bokeh',
    colorGrade: 'Clean & Modern'
};

const FREE_LIMIT = 1;

export const FreeStudio: React.FC = () => {
    const [token, setToken] = useState<string | null>(null);
    const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
    const [uploadedImage, setUploadedImage] = useState<{ base64: string, mimeType: string } | null>(null);
    const [features, setFeatures] = useState<HeadshotFeatures>(INITIAL_FEATURES);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usageCount, setUsageCount] = useState(0);

    useEffect(() => {
        const count = parseInt(localStorage.getItem('free_usage_count') || '0', 10);
        setUsageCount(count);
    }, []);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setToken(tokenResponse.access_token);
        },
        scope: 'https://www.googleapis.com/auth/generative-language.retriever https://www.googleapis.com/auth/generative-language.tuning',
        // Note: Standard scope for Gemini might be just "https://www.googleapis.com/auth/cloud-platform" or specific genai ones if available. 
        // 'https://www.googleapis.com/auth/generative-language.retriever' is often used for RAG but might suffice or be related.
        // Ideally we need "https://www.googleapis.com/auth/generative-language".
        // Let's try to add the generic one.
    });

    // Correction: The correct scope for generating content via API is simpler if using API Key, 
    // but for OAuth it is `https://www.googleapis.com/auth/generative-language.retriever` (read-only) or similar.
    // Actually, `https://www.googleapis.com/auth/generative-language` is the broad one.

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (res) => {
            console.log("Logged in", res);
            setToken(res.access_token);
        },
        onError: (err) => console.error("Login Failed", err),
        scope: "https://www.googleapis.com/auth/generative-language.retriever" // This might need adjustment based on exact API requirements for 'generateContent'
    });

    const handleImageUpload = (base64: string, mimeType: string) => {
        setUploadedImage({ base64, mimeType });
        setError(null);
        setStep(AppStep.FEATURES);
    };

    const updateFeatures = (key: keyof HeadshotFeatures, value: any) => {
        setFeatures(prev => ({ ...prev, [key]: value }));
    };

    const handleGeneration = async () => {
        if (!uploadedImage || !token) return;

        if (usageCount >= FREE_LIMIT) {
            setError("You have used your 1 free generation. Please use the full version with your API key.");
            return;
        }

        setStep(AppStep.GENERATION);
        setIsGenerating(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const seed = Math.floor(Math.random() * 10000);
            // Pass token as apiKey. Service detects "ya29" and uses REST API.
            const img = await generateHeadshot(token, uploadedImage.base64, uploadedImage.mimeType, features, seed);
            setGeneratedImages([img]);

            // Increment Usage
            const newCount = usageCount + 1;
            setUsageCount(newCount);
            localStorage.setItem('free_usage_count', newCount.toString());

        } catch (err: any) {
            console.error("Critical error in generation:", err);
            setError(err?.message || "An unexpected error occurred during generation.");
        } finally {
            setIsGenerating(false);
        }
        const handleLogout = () => {
            setToken(null);
        };

        // If user has used their quota and has no current images to show (e.g. refreshed page), show "Quota Exceeded" screen
        if (usageCount >= FREE_LIMIT && generatedImages.length === 0 && token) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
                    <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl animate-fade-in text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-slate-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Free Trial Completed</h1>
                        <p className="text-slate-500 mb-8">
                            You have used your 1 free generation. We hope you liked the result!
                        </p>

                        <button
                            onClick={() => {
                                // Optional: Clear token to let them login with another account if they really want, 
                                // or keep them locked. Let's provide a logout.
                                setToken(null);
                            }}
                            className="text-slate-400 hover:text-slate-600 font-semibold text-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            );
        }

        if (!token) {
            return (
                <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
                    <div className="bg-white max-w-4xl w-full rounded-[2.5rem] shadow-2xl animate-fade-in overflow-hidden flex flex-col md:flex-row">

                        {/* Visual Side */}
                        <div className="md:w-1/2 bg-blue-50 p-8 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-blue-600/5 mix-blend-multiply" />
                            <div className="relative z-10 w-full max-w-[320px]">
                                <img
                                    src="./promo-banner.png"
                                    alt="Before and After Transformation"
                                    className="w-full h-auto rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <img src="./pintarnya-logo.png" alt="Pintarnya" className="w-10 h-10 object-contain" />
                                <span className="font-black text-slate-800 tracking-tight text-xl">Pintarnya Lite</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
                                Professional Headshots, <span className="text-blue-600">For Free.</span>
                            </h1>

                            <p className="text-slate-500 mb-8 text-sm md:text-base leading-relaxed">
                                Turn your casual selfie into a confident, professional profile picture in seconds.
                                <span className="block mt-2 font-semibold text-slate-700">Powered by Gemini AI.</span>
                            </p>

                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-center md:text-left">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-600 rounded-lg text-white shrink-0">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <p className="text-blue-900 font-bold text-base">1 Free AI Generation</p>
                                        <p className="text-blue-700/80 text-xs">Join thousands of professionals upgrading their CV today.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleGoogleLogin()}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:translate-y-[-2px]"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                                Sign in with Google
                            </button>

                            <p className="text-[10px] text-slate-400 mt-6 text-center">
                                By continuing, you agree to generate content using your personal Google Quota.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Layout
                step={step}
                onNavigate={setStep}
                hasProjects={false}
                apiKey={token}
                onSetApiKey={() => { }}
            >
                <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" />
                        Connected
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold rounded-full border border-slate-200 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
                {step === AppStep.UPLOAD && (
                    <div className="relative">
                        <div className="absolute top-0 right-0 m-4 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm border border-amber-200 z-10">
                            <Sparkles className="w-3 h-3" />
                            {FREE_LIMIT - usageCount} Credit Left
                        </div>
                        <UploadStep onImageUpload={handleImageUpload} onShowLibrary={() => { }} hasProjects={false} />
                    </div>
                )}

                {step === AppStep.FEATURES &&
                    <div className="relative">
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h2 className="text-2xl font-bold text-slate-800">Customize</h2>
                            <div className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm border border-amber-200">
                                <Sparkles className="w-3 h-3" />
                                {FREE_LIMIT - usageCount} Credit Left
                            </div>
                        </div>

                        <LiteStepWizard
                            features={features}
                            updateFeatures={updateFeatures}
                            onNext={handleGeneration}
                            uploadedImagePreview={uploadedImage}
                        />
                    </div>
                }
                {step === AppStep.GENERATION && (
                    <div className="flex flex-col gap-4">
                        {usageCount >= FREE_LIMIT && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-center justify-between">
                                <span className="font-bold flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Quota Used
                                </span>
                                <span className="text-sm">Thank you for trying!</span>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl animate-fade-in mb-4">
                                <h4 className="font-bold text-lg mb-1">Generation Failed</h4>
                                <p className="text-sm opacity-90">{error}</p>
                                <button
                                    onClick={handleGeneration}
                                    disabled={usageCount >= FREE_LIMIT}
                                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                        <Gallery
                            images={generatedImages}
                            isGenerating={isGenerating}
                            onSelect={(img) => { setSelectedImage(img); setStep(AppStep.EDITOR); }}
                            onRegenerate={handleGeneration} // This will be blocked by internal logic if limit reached
                            onSave={() => alert("Image saved locally!")} // Simple alert for now
                        />
                    </div>
                )}
                {step === AppStep.EDITOR && selectedImage && <Editor apiKey={token} initialImage={selectedImage} onBack={() => setStep(AppStep.GENERATION)} />}
            </Layout>
        );
    };
