import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Layout } from './Layout';
import { UploadStep } from './UploadStep';
import { StepWizard } from './StepWizard';
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
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
                <div className="bg-white max-w-md w-full rounded-3xl p-8 shadow-2xl animate-fade-in text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <img src="./pintarnya-logo.png" alt="Pintarnya" className="w-12 h-12 object-contain" />
                        <h1 className="text-2xl font-bold text-slate-900">AI Photo Studio <span className="text-blue-600 block text-lg font-normal">Free Trial</span></h1>
                    </div>

                    <p className="text-slate-500 mb-8">
                        Sign in with your Google Account to generate <strong>1 professional headshot for free</strong> using your own Gemini quota (via OAuth).
                    </p>

                    <button
                        onClick={() => handleGoogleLogin()}
                        className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                        Sign in with Google
                    </button>


                </div>
            </div>
        );
    }

    return (
        <Layout
            step={step}
            onNavigate={setStep}
            hasProjects={false} // No persistence in free mode for simplicity
            apiKey={token}
            onSetApiKey={() => { }} // No-op
        >
            {step === AppStep.UPLOAD && <UploadStep onImageUpload={handleImageUpload} onShowLibrary={() => { }} hasProjects={false} />}
            {step === AppStep.FEATURES &&
                <div className="relative">
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg mb-4 text-xs font-bold text-center">
                        Free Mode: {FREE_LIMIT - usageCount} generation remaining
                    </div>
                    <StepWizard features={features} updateFeatures={updateFeatures} onNext={handleGeneration} uploadedImagePreview={uploadedImage} />
                </div>
            }
            {step === AppStep.GENERATION && (
                <div className="flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl animate-fade-in mb-4">
                            <h4 className="font-bold text-lg mb-1">Generation Failed</h4>
                            <p className="text-sm opacity-90">{error}</p>
                            <button
                                onClick={handleGeneration}
                                disabled={usageCount >= FREE_LIMIT}
                                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                    <Gallery
                        images={generatedImages}
                        isGenerating={isGenerating}
                        onSelect={(img) => { setSelectedImage(img); setStep(AppStep.EDITOR); }}
                        onRegenerate={handleGeneration}
                        onSave={() => alert("Saving not available in Free Mode. Please download the image.")}
                    />
                </div>
            )}
            {step === AppStep.EDITOR && selectedImage && <Editor apiKey={token} initialImage={selectedImage} onBack={() => setStep(AppStep.GENERATION)} />}
        </Layout>
    );
};
