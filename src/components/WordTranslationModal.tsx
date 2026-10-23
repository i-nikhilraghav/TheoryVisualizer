import React from 'react';
import { 
  X, 
  BookOpen, 
  Languages, 
  Sparkles, 
  History, 
  GraduationCap, 
  Volume2 
} from 'lucide-react';
import { WordTranslationData, SupportedLanguage } from '../types';

interface WordTranslationModalProps {
  data: WordTranslationData | null;
  loading: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const WordTranslationModal: React.FC<WordTranslationModalProps> = ({
  data,
  loading,
  onClose,
  language,
}) => {
  if (!data && !loading) return null;

  const handleSpeakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border bg-slate-900 border-slate-800 p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-400">Consulting Etymology & Translation Engine...</p>
          </div>
        ) : data ? (
          <div className="space-y-4">
            
            {/* Header: Word & Translation */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                <Languages className="w-3.5 h-3.5" />
                <span>Contextual Linguistic Synthesis</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white capitalize flex items-center gap-2">
                    <span>{data.word}</span>
                    <button
                      onClick={() => handleSpeakWord(data.word)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                      title="Listen pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </h3>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                    ➔ {data.translatedWord}
                  </div>
                </div>

                <span className="text-[11px] font-mono font-bold text-slate-400 px-2 py-1 rounded bg-slate-800 border border-slate-700">
                  {data.partOfSpeech}
                </span>
              </div>
            </div>

            {/* Academic Definition */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-indigo-400" />
                <span>Operational Definition</span>
              </div>
              <p className="leading-relaxed">{data.definition}</p>
            </div>

            {/* Etymology / Historical Roots */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <History className="w-3 h-3 text-indigo-400" />
                <span>Etymology & Morphological Roots</span>
              </div>
              <p className="leading-relaxed">{data.etymology}</p>
            </div>

            {/* Educational / Curriculum Significance */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3 text-amber-400" />
                <span>Curriculum Examination Context</span>
              </div>
              <p className="leading-relaxed">{data.educationalContext}</p>
            </div>

            {/* Bottom Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md shadow-indigo-600/30"
              >
                Close Inspector
              </button>
            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
};
