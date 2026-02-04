import React, { useState } from 'react';
import { Book, FolderHeart, Plus, Key, X, Save } from 'lucide-react';
import { AppStep } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  step: AppStep;
  onNavigate: (step: AppStep) => void;
  hasProjects: boolean;
  apiKey?: string;
  onSetApiKey?: (key: string) => void;
}

const steps = [
  { label: 'Upload', id: AppStep.UPLOAD },
  { label: 'Style', id: AppStep.FEATURES },
  { label: 'Generate', id: AppStep.GENERATION },
  { label: 'Refine', id: AppStep.EDITOR },
];

export const Layout: React.FC<LayoutProps> = ({ children, step, onNavigate, hasProjects, apiKey, onSetApiKey }) => {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');

  // Sync tempKey with apiKey prop when modal opens
  const openKeyModal = () => {
    setTempKey(apiKey || '');
    setShowKeyModal(true);
  };

  const handleSaveKey = () => {
    if (onSetApiKey && tempKey.trim()) {
      onSetApiKey(tempKey.trim());
      setShowKeyModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl p-6 flex justify-between items-center border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate(AppStep.UPLOAD)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="./pintarnya-logo.png" alt="Pintarnya" className="w-16 h-16 object-contain" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              <span className="text-blue-600">AI Photo</span> Studio
            </h1>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate(AppStep.UPLOAD)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${step === AppStep.UPLOAD ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Plus size={16} /> New Headshot
            </button>
            <button
              onClick={() => onNavigate(AppStep.LIBRARY)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${step === AppStep.LIBRARY ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <FolderHeart size={16} /> My Library
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Step Indicator (Hidden on mobile) */}
          <div className="hidden lg:flex gap-4 mr-4">
            {steps.map((s, idx) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id && step !== AppStep.LIBRARY;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                        ${isActive ? 'border-blue-600 bg-blue-600 text-white scale-105' : ''}
                        ${isCompleted ? 'border-blue-600 bg-white text-blue-600' : ''}
                        ${(!isActive && !isCompleted) || step === AppStep.LIBRARY ? 'border-slate-300 bg-slate-100 text-slate-400' : ''}
                    `}
                  >
                    {idx + 1}
                  </div>
                  {/* Label hidden on smaller LG screens to save space if needed, but keeping for now */}
                  <span className={`text-sm font-medium hidden xl:block ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-[2px] hidden xl:block ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* API Key Trigger */}
          {onSetApiKey && (
            <button
              onClick={openKeyModal}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              title="Manage API Key"
            >
              <Key size={20} />
            </button>
          )}
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Key size={18} className="text-blue-600" /> API Key Configuration
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4">
                Update your Google Gemini API key below. This key is stored locally in your browser.
              </p>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Paste API Key here..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-slate-900 focus:border-blue-500 focus:outline-none font-medium mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  disabled={!tempKey.trim()}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} /> Save Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-5xl flex-1 p-4 md:p-8 flex flex-col">
        {children}
      </main>

      <footer className="w-full p-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white mt-auto">
        Powered by Gemini Nano Banana (Flash Image) &bull; Create professional LinkedIn profiles in seconds
      </footer>
    </div>
  );
};