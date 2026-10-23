import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Compass, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  Layers, 
  ArrowRight,
  Atom
} from 'lucide-react';
import { EducationTier, SupportedLanguage } from '../types';
import { CURRICULUM_SUBJECTS } from '../data/presetCurriculum';

interface TheoryPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (topic: string, tier: EducationTier, subject: string, contextText?: string) => void;
  isLoading: boolean;
  currentTier: EducationTier;
  language: SupportedLanguage;
}

export const TheoryPromptModal: React.FC<TheoryPromptModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
  currentTier,
  language,
}) => {
  const [topic, setTopic] = useState('');
  const [tier, setTier] = useState<EducationTier>(currentTier);
  const [subject, setSubject] = useState('');
  const [contextText, setContextText] = useState('');

  if (!isOpen) return null;

  const tierSubjects = CURRICULUM_SUBJECTS.filter(s => s.tier === tier);
  const activeSubjectObj = tierSubjects.find(s => s.name === subject) || tierSubjects[0];

  const handleSelectPresetTopic = (t: string) => {
    setTopic(t);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), tier, subject || activeSubjectObj?.name || 'Science', contextText.trim());
  };

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
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Modal Theory Decomposition</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Deconstruct & Visualize Any Educational Theory
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Generates an interactive DAG mind map, KaTeX formulas, visual storyboard, SM-2 flashcards, and adaptive assessment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Target Audience Tier Selector */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">
              Target Audience Tier:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTier('school');
                  setSubject(CURRICULUM_SUBJECTS.filter(s => s.tier === 'school')[0].name);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tier === 'school'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-xs'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>School (Up to 10th)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Metaphors, visual analogies & character storyboards
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTier('college');
                  setSubject(CURRICULUM_SUBJECTS.filter(s => s.tier === 'college')[0].name);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tier === 'college'
                    ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-xs'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-400">
                  <Compass className="w-4 h-4" />
                  <span>College & Competitive</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Technical schematics, coordinate graphs & derivations
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTier('research');
                  setSubject(CURRICULUM_SUBJECTS.filter(s => s.tier === 'research')[0].name);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tier === 'research'
                    ? 'bg-purple-500/15 border-purple-500 text-white shadow-xs'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs text-purple-400">
                  <Atom className="w-4 h-4" />
                  <span>Research & Advanced</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Latent topology, wave functions, KaTeX proofs
                </div>
              </button>
            </div>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Curriculum Domain / Subject:
            </label>
            <select
              value={subject || activeSubjectObj?.name}
              onChange={e => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              {tierSubjects.map(sub => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preset Topics Chips */}
          {activeSubjectObj && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Featured topics for {activeSubjectObj.name}:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeSubjectObj.sampleTopics.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleSelectPresetTopic(t)}
                    className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/80 transition-all truncate max-w-xs"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Topic Name */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Theory Title / Scientific Topic:
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Double Circulation in Human Heart, SN2 Reaction Mechanism, or Bloch Sphere"
              className="w-full p-3 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          {/* Optional Detailed Source Text */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Optional Context / Textbook Excerpt:
            </label>
            <textarea
              rows={3}
              value={contextText}
              onChange={e => setContextText(e.target.value)}
              placeholder="Paste specific formulas, textbook definitions, or exam guidelines to tailor the model output..."
              className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition-all transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Synthesizing Visualizer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Deconstruct & Visualize</span>
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
