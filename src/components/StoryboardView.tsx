import React, { useState } from 'react';
import { 
  Sun, 
  Zap, 
  Layers, 
  Activity, 
  Droplets, 
  Sparkles, 
  Compass, 
  Grid, 
  Atom,
  ChevronRight,
  ChevronLeft,
  Eye,
  Lightbulb,
  Copy,
  Check,
  FileDown
} from 'lucide-react';
import { StoryboardStep, VisualProject } from '../types';

interface StoryboardViewProps {
  project: VisualProject;
  isDarkMode: boolean;
  onOpenPdfModal?: () => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  isDarkMode,
  onOpenPdfModal,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const steps = project.storyboard || [];
  const current = steps[activeStep] || steps[0];

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'Grid': return <Grid className="w-5 h-5 text-pink-400" />;
      case 'Atom': return <Atom className="w-5 h-5 text-cyan-400" />;
      default: return <Activity className="w-5 h-5 text-violet-400" />;
    }
  };

  const handleCopyPrompt = () => {
    if (!current) return;
    const promptText = `Educational scientific illustration of ${current.title}: ${current.visualDescription}. Style: Textbook scientific diagram, isometric projection, clean vector linework, high contrast labeled diagram.`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  if (!steps.length) {
    return <div className="p-8 text-center text-slate-400">No storyboard steps available.</div>;
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 max-w-5xl mx-auto overflow-y-auto">
      
      {/* Header and Step Indicator */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
            Sequential Visual Narrative
          </span>
          <h2 className="text-xl font-bold text-slate-100">
            {project.title}: Concept Storyboard
          </h2>
        </div>

        {/* Step Numbers Navigation & PDF Action */}
        <div className="flex items-center gap-3">
          {onOpenPdfModal && (
            <button
              onClick={onOpenPdfModal}
              className="px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Download Storyboard as PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download PDF</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {steps.map((st, idx) => (
              <button
                key={st.step}
                onClick={() => setActiveStep(idx)}
                className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                  activeStep === idx
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {st.step}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Storyboard Frame Card */}
      {current && (
        <div className={`rounded-2xl border p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-2xl relative overflow-hidden ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800 shadow-md'
        }`}>
          {/* Subtle Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Step Tag & Key Concept */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                {getStepIcon(current.icon)}
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Phase {current.step} of {steps.length}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  {current.title}
                </h3>
              </div>
            </div>

            <button
              onClick={handleCopyPrompt}
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
              title="Copy Diffusion Generation Prompt for this frame"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied Prompt' : 'Copy AI Prompt'}</span>
            </button>
          </div>

          {/* Visual Schematic Box / Dynamic Graphic Representation */}
          <div className="my-4 p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/20 relative">
            <div className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Scene Visualization & Dynamics:</span>
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              "{current.visualDescription}"
            </p>

            {/* Metaphor & Cognitive Analogy */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Intuitive Metaphor / Analogy
                </div>
                <div className="text-xs text-amber-100/90 leading-snug mt-0.5">
                  {current.analogy}
                </div>
              </div>
            </div>
          </div>

          {/* Key Concept Takeaway */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-center justify-between">
            <span className="font-semibold text-slate-400">Atomic Concept:</span>
            <span className="font-bold text-indigo-300">{current.keyConcept}</span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-800/80">
            <button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Frame</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              {activeStep + 1} / {steps.length}
            </span>

            <button
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition-colors text-white shadow-md shadow-indigo-600/30"
            >
              <span>Next Frame</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Grid of All Frames for Quick Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {steps.map((st, idx) => (
          <div
            key={st.step}
            onClick={() => setActiveStep(idx)}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              activeStep === idx
                ? 'bg-indigo-600/15 border-indigo-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                {st.step}
              </span>
              <h5 className="font-bold text-xs truncate">{st.title}</h5>
            </div>
            <p className="text-[11px] line-clamp-2 text-slate-400">
              {st.keyConcept}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
