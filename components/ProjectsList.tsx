
import React from 'react';
import { SavedProject } from '../types';
import { Trash2, ExternalLink, Calendar, Plus, FolderOpen } from 'lucide-react';

interface ProjectsListProps {
  projects: SavedProject[];
  onLoad: (project: SavedProject) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects, onLoad, onDelete, onNew }) => {
  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">My Library</h2>
          <p className="text-slate-500 font-medium">Your saved professional headshot collections.</p>
        </div>
        <button
          onClick={onNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-2 shadow-xl hover:shadow-blue-600/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Start New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <FolderOpen size={48} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Your library is empty</h3>
          <p className="text-slate-500 max-w-md">Once you generate headshots, save them to your library to access them here any time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
            >
              {/* Preview Grid */}
              <div className="aspect-[16/10] bg-slate-100 relative grid grid-cols-2 gap-[1px]">
                {/* Combine Source + Generated for preview, take first 4 */}
                {[
                  { ...project.sourceImage, id: 'source', isSource: true },
                  ...project.generatedImages
                ].slice(0, 4).map((img, i) => (
                  <div key={img.id || i} className="relative w-full h-full">
                    <img
                      src={`data:${img.mimeType};base64,${img.base64}`}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    {/* Label Badge for Source Image */}
                    {(img as any).isSource && (
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white/90 text-[10px] font-bold px-2 py-1 rounded-md border border-white/10 uppercase tracking-widest">
                        Original
                      </div>
                    )}
                  </div>
                ))}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => onLoad(project)}
                    className="bg-white text-blue-600 p-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <ExternalLink size={20} /> Open Build
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-lg text-slate-900 leading-tight">{project.name}</h3>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this project?")) onDelete(project.id);
                    }}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    {new Date(project.timestamp).toLocaleDateString()}
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                    {project.features.vibe}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
