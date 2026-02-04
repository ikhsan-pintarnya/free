import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, ArrowRight, CheckCircle2, FolderHeart } from 'lucide-react';

interface UploadStepProps {
  onImageUpload: (base64: string, mimeType: string) => void;
  onShowLibrary: () => void;
  hasProjects: boolean;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onImageUpload, onShowLibrary, hasProjects }) => {
  const [hasStarted, setHasStarted] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const mimeType = result.split(';')[0].split(':')[1];
        const base64 = result.split(',')[1];
        onImageUpload(base64, mimeType);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  // Landing Page View
  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            #1 AI Headshot Generator
          </div>
          <h2 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
            Turn your casual photo into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional CV Ready</span> headshot.
          </h2>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop spending hundreds on photographers. Use Professional CV Photo to transform your selfies into corporate-grade profile pictures in seconds using Gemini AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
                onClick={() => setHasStarted(true)}
                className="w-full sm:w-auto group bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 px-12 rounded-2xl transition-all shadow-xl hover:shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95"
            >
                Create My Headshot
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            {hasProjects && (
                <button 
                    onClick={onShowLibrary}
                    className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 text-xl font-bold py-5 px-12 rounded-2xl transition-all border border-slate-200 flex items-center justify-center gap-3 shadow-sm active:scale-95"
                >
                    <FolderHeart className="text-blue-600" />
                    My Library
                </button>
            )}
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-slate-400 font-bold text-sm uppercase tracking-widest">
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                No Studio Required
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Identity Preserved
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                8K Quality
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Upload View
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto animate-fade-in pt-10">
      <button 
        onClick={() => setHasStarted(false)}
        className="self-start mb-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium"
      >
        ← Back to Home
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Start with a Selfie</h2>
        <p className="text-slate-500 text-lg">
          Upload a clear photo of yourself. We'll transform it into a professional studio headshot.
        </p>
      </div>

      <label className="group relative w-full aspect-[4/3] max-w-lg flex flex-col items-center justify-center border-3 border-dashed border-slate-300 rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud size={40} />
          </div>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-slate-500">
            JPG, PNG (Max 5MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-sm text-slate-500">
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <ImageIcon className="text-green-500" />
          <span>Good lighting works best</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <ImageIcon className="text-green-500" />
          <span>Face clearly visible</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <ImageIcon className="text-green-500" />
          <span>No glasses/hats preferred</span>
        </div>
      </div>
    </div>
  );
};