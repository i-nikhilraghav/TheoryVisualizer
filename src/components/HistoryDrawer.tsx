import React, { useState } from 'react';
import { 
  X, 
  History, 
  Search, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { VisualProject } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: VisualProject[];
  onSelectProject: (project: VisualProject) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectProject,
  onClearHistory,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = history.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.subject.toLowerCase().includes(search.toLowerCase()) ||
    p.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-slate-100 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">
              Generated Prompts History
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
              {history.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Clear Bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search past prompts & topics..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-500 pointer-events-none" />
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-2 rounded-xl border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear prompt history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List of Previous Generations */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">No generation logs match your search.</p>
              <p className="text-[11px] text-slate-500">
                Every theory prompt you deconstruct is automatically cached here for zero-latency retrieval.
              </p>
            </div>
          ) : (
            filtered.map(proj => (
              <div
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/70 hover:bg-slate-950 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                    proj.educationTier === 'school'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : proj.educationTier === 'college'
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                      : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                  }`}>
                    {proj.educationTier} • {proj.subject}
                  </span>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {proj.createdAt ? new Date(proj.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Saved'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {proj.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {proj.summary}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500">
                  <span>{proj.mindMap.nodes.length} nodes • {proj.flashcards.length} flashcards</span>
                  <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Load Session <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
