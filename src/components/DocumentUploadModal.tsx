import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Check, 
  Sparkles, 
  BookOpen, 
  FileUp, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { EducationTier } from '../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessDocument: (title: string, text: string, tier: EducationTier) => void;
  isLoading: boolean;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onProcessDocument,
  isLoading,
}) => {
  const [docTitle, setDocTitle] = useState('');
  const [docText, setDocText] = useState('');
  const [tier, setTier] = useState<EducationTier>('college');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocText(content || '');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleType: 'ncert' | 'jee' | 'research') => {
    if (sampleType === 'ncert') {
      setDocTitle('NCERT Class 10 Science - Chemical Reactions & Equations');
      setTier('school');
      setUploadedFileName('ncert_chapter_1.txt');
      setDocText(`Chapter 1: Chemical Reactions and Equations.
Whenever a chemical change occurs, we can say that a chemical reaction has taken place.
Consider situations like: milk is left at room temperature during summers, an iron tawa/pan/nail is left exposed to humid atmosphere, or food is digested in our body.
During chemical reactions, chemical bonds between atoms are broken and new bonds are formed.
A complete chemical equation represents the reactants, products, and their physical states symbolically.
A balanced chemical equation has an equal number of atoms of each element on both sides, obeying the Law of Conservation of Mass.`);
    } else if (sampleType === 'jee') {
      setDocTitle('JEE Advanced Physics - Rotational Mechanics & Angular Momentum');
      setTier('college');
      setUploadedFileName('rotational_dynamics_advanced.txt');
      setDocText(`Rotational Dynamics and Rigid Body Motion.
The moment of inertia I of a rigid body about a specified axis is defined as the integral of r^2 dm over the entire mass distribution.
According to the parallel axis theorem, I = I_cm + M d^2.
Torque is related to the rate of change of angular momentum by tau = dL/dt.
When net external torque on a closed system is zero, total angular momentum vector L remains conserved.
Rolling motion without slipping requires the linear acceleration of the center of mass to satisfy a_cm = alpha * R.`);
    } else {
      setDocTitle('Quantum Decoherence & The Measurement Problem in Open Systems');
      setTier('research');
      setUploadedFileName('decoherence_open_systems.txt');
      setDocText(`Decoherence in Open Quantum Systems and Quantum-to-Classical Transition.
The interaction between a system S and its environmental reservoir E leads to quantum entanglement between system states and environmental modes.
The reduced density matrix rho_S is obtained by taking the partial trace over the environmental Hilbert space: rho_S = Tr_E(rho_SE).
Non-diagonal elements (coherences) decay exponentially at the decoherence rate gamma_dec, suppressing quantum superposition into pointer states.
This dynamical transition resolves the measurement problem without invoking non-unitary wavefunction collapse.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docText.trim()) return;
    onProcessDocument(docTitle || 'Uploaded Textbook Excerpt', docText, tier);
  };

  const wordCount = docText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border bg-slate-900 border-slate-800 p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <FileUp className="w-4 h-4" />
            <span>Document & Textbook Mind Map Ingestion</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Upload Textbook Chapter or Research Excerpt
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Transform raw educational documents into an interactive directed acyclic graph (DAG), flashcards, and quizzes.
          </p>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Or load textbook sample preset:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample('ncert')}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-bold text-emerald-400">Class 10 NCERT</div>
              <div className="text-[10px] text-slate-400 truncate">Chemical Reactions</div>
            </button>

            <button
              type="button"
              onClick={() => handleLoadSample('jee')}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-bold text-indigo-400">JEE Physics</div>
              <div className="text-[10px] text-slate-400 truncate">Rotational Dynamics</div>
            </button>

            <button
              type="button"
              onClick={() => handleLoadSample('research')}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-left transition-colors"
            >
              <div className="text-xs font-bold text-purple-400">Research Paper</div>
              <div className="text-[10px] text-slate-400 truncate">Quantum Decoherence</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Document Title & Target Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-semibold mb-1">
                Document / Chapter Title:
              </label>
              <input
                type="text"
                required
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                placeholder="e.g. Chapter 4: Carbon and Its Compounds"
                className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Target Audience Tier:
              </label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as EducationTier)}
                className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="school">School (Up to 10th)</option>
                <option value="college">College & Competitive</option>
                <option value="research">Research & Advanced</option>
              </select>
            </div>
          </div>

          {/* File Upload Zone */}
          <div className="relative border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center bg-slate-950/40 transition-colors">
            <input
              type="file"
              accept=".txt,.pdf,.md,.doc"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
              <Upload className="w-6 h-6 text-emerald-400" />
              <div className="text-xs font-semibold text-slate-200">
                {uploadedFileName ? (
                  <span className="text-emerald-400 font-bold">{uploadedFileName}</span>
                ) : (
                  'Click or drag & drop textbook file (.txt, .md, .pdf)'
                )}
              </div>
              <div className="text-[10px] text-slate-500">
                Supports up to 25,000 characters per theoretical analysis run
              </div>
            </div>
          </div>

          {/* Text Content Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">
                Or paste textbook excerpt / chapter text:
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {wordCount} words • {docText.length} chars
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={docText}
              onChange={e => setDocText(e.target.value)}
              placeholder="Paste theory text, formulas, or textbook paragraphs here..."
              className="w-full p-3 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !docText.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Synthesizing Mind Map...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Interactive Mind Map</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
