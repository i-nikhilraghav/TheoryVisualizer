import React, { useState } from 'react';
import { Copy, Check, FunctionSquare, Calculator, BookOpen, Layers } from 'lucide-react';
import { FormulaItem, VisualProject } from '../types';
import { KaTeXView } from './KaTeXView';

interface FormulaExplorerProps {
  project: VisualProject;
  isDarkMode: boolean;
}

export const FormulaExplorer: React.FC<FormulaExplorerProps> = ({
  project,
  isDarkMode,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const formulas = project.formulas || [];

  const handleCopyLatex = (latex: string, index: number) => {
    navigator.clipboard.writeText(latex);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!formulas.length) {
    return (
      <div className="p-8 text-center text-slate-400">
        No mathematical formulas documented for this specific concept.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 max-w-5xl mx-auto overflow-y-auto space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-xs uppercase font-bold text-violet-400 tracking-wider flex items-center gap-1.5">
          <Calculator className="w-4 h-4" />
          <span>Mathematical Derivations & Analytical Proofs</span>
        </span>
        <h2 className="text-xl font-bold text-slate-100">
          Governing Equations for {project.title}
        </h2>
      </div>

      {/* List of Formula Cards */}
      <div className="space-y-6">
        {formulas.map((formula, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-6 shadow-xl relative overflow-hidden transition-all ${
              isDarkMode 
                ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
                : 'bg-white border-slate-200 text-slate-800 shadow-md'
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">
                  {idx + 1}
                </span>
                <h3 className="text-base font-bold text-white">
                  {formula.name}
                </h3>
              </div>

              <button
                onClick={() => handleCopyLatex(formula.latex, idx)}
                className="text-xs px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Copy LaTeX source code"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? 'Copied LaTeX' : 'Copy LaTeX'}</span>
              </button>
            </div>

            {/* LaTeX Render Box */}
            <div className="my-3 py-6 px-4 rounded-xl bg-slate-950 border border-indigo-500/20 text-center overflow-x-auto shadow-inner">
              <div className="text-lg sm:text-2xl text-indigo-100 font-serif">
                <KaTeXView math={formula.latex} displayMode />
              </div>
            </div>

            {/* Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed my-3">
              {formula.explanation}
            </p>

            {/* Variable Table */}
            {formula.variables && formula.variables.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FunctionSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Variable Definitions & Units</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formula.variables.map((v, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-3 text-xs"
                    >
                      <span className="font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        <KaTeXView math={v.symbol} />
                      </span>
                      <span className="text-slate-300">{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
