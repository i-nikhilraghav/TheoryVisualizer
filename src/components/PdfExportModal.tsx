import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  Check, 
  Sparkles, 
  Eye, 
  Layers, 
  GitFork, 
  Compass, 
  Calculator,
  Award
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VisualProject } from '../types';
import { KaTeXView } from './KaTeXView';

interface PdfExportModalProps {
  project: VisualProject;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeMindMap, setIncludeMindMap] = useState(true);
  const [includeStoryboard, setIncludeStoryboard] = useState(true);
  const [includeFormulas, setIncludeFormulas] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!printableRef.current) return;
    setIsGenerating(true);
    setStatusMessage('Rasterizing print-ready layout...');

    try {
      // Allow DOM to fully layout
      await new Promise(r => setTimeout(r, 200));

      setStatusMessage('Capturing high-resolution vector snapshot (2x scale)...');
      const element = printableRef.current;

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution for crisp printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff', // Clean white background for printing
        windowWidth: 1024,
      });

      setStatusMessage('Compiling PDF pages with jsPDF...');
      const imgData = canvas.toDataURL('image/png');

      // A4 specifications in mm: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // Full A4 width in mm
      const pageHeight = 297; // Full A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Subsequent Pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const sanitizedTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
      const filename = `TheoryVisualizer-${sanitizedTitle}-${Date.now().toString().slice(-4)}.pdf`;

      setStatusMessage('Downloading PDF...');
      pdf.save(filename);

      setTimeout(() => {
        setIsGenerating(false);
        setStatusMessage('');
      }, 800);
    } catch (error) {
      console.error('Error generating PDF with jsPDF and html2canvas:', error);
      setIsGenerating(false);
      setStatusMessage('Export failed. Please try again.');
    }
  };

  const nodeMap = new Map(project.mindMap.nodes.map(n => [n.id, n]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-4xl rounded-2xl border bg-slate-900 border-slate-800 text-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                  Print & PDF Publisher
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  jsPDF + html2canvas
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Download "{project.title}" as PDF
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Configuration Controls */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-semibold">Include Sections:</span>
            
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-200">
              <input
                type="checkbox"
                checked={includeMindMap}
                onChange={e => setIncludeMindMap(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>Mind Map DAG</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-200">
              <input
                type="checkbox"
                checked={includeStoryboard}
                onChange={e => setIncludeStoryboard(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>Storyboard Narrative</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-200">
              <input
                type="checkbox"
                checked={includeFormulas}
                onChange={e => setIncludeFormulas(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              <span>Formulas & Proofs</span>
            </label>
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>{statusMessage || 'Compiling PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Printable PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Live Document Preview Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60">
          
          <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Document Layout Preview (Ready for A4 Print)</span>
          </div>

          {/* This printable container is captured by html2canvas */}
          <div 
            ref={printableRef}
            className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl max-w-[850px] mx-auto border border-slate-200 space-y-8 font-sans"
            style={{ width: '100%' }}
          >
            {/* Document Header & Watermark */}
            <div className="border-b-2 border-indigo-600 pb-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                  <span>TheoryVisualizer • Academic Curriculum Report</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {project.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {project.subject} • {project.targetAudience}
                </p>
              </div>

              <div className="text-right text-[11px] text-slate-500 font-mono">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div className="text-indigo-600 font-bold uppercase mt-0.5">Tier: {project.educationTier}</div>
              </div>
            </div>

            {/* Executive Summary & Principles */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-1">
                <span>1. Conceptual Overview & Key Principles</span>
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-serif">
                {project.summary}
              </p>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-slate-600">Core Takeaways:</div>
                {project.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mind Map DAG Section */}
            {includeMindMap && (
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span>2. Concept Mind Map (Directed Acyclic Graph)</span>
                </h2>
                
                {/* Visual SVG Diagram for PDF */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative overflow-hidden">
                  <div className="text-[10px] text-slate-500 font-mono mb-3 flex items-center justify-between">
                    <span>Hierarchy & Relationships ({project.mindMap.nodes.length} nodes, {project.mindMap.edges.length} connections)</span>
                    <span className="text-indigo-600 font-bold">DAG Structure</span>
                  </div>

                  {/* Node Grid Layout for High Print Readability */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.mindMap.nodes.map(node => (
                      <div
                        key={node.id}
                        className="p-3 rounded-lg border border-slate-300 bg-white shadow-2xs space-y-1"
                        style={{ borderLeftWidth: '4px', borderLeftColor: node.color || '#4f46e5' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                            {node.category}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-slate-100 text-slate-600">
                            #{node.id}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {node.label}
                        </h4>
                        <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-3">
                          {node.description}
                        </p>
                        {node.formula && (
                          <div className="text-[9px] font-mono text-indigo-700 pt-1">
                            Formula: {node.formula}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Connections Table */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Relationship Links:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                      {project.mindMap.edges.map(edge => {
                        const src = nodeMap.get(edge.source);
                        const tgt = nodeMap.get(edge.target);
                        return (
                          <div key={edge.id} className="flex items-center gap-1 truncate bg-white px-2 py-1 rounded border border-slate-200">
                            <strong className="text-slate-800">{src?.label || edge.source}</strong>
                            <span className="text-indigo-600">➔ [{edge.label || 'relates'}] ➔</span>
                            <strong className="text-slate-800">{tgt?.label || edge.target}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Storyboard Visual Narrative Section */}
            {includeStoryboard && (
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span>3. Visual Storyboard & Cognitive Metaphors</span>
                </h2>

                <div className="space-y-3">
                  {project.storyboard.map(st => (
                    <div
                      key={st.step}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {st.step}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">
                            {st.title}
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {st.keyConcept}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Visual Dynamics:</strong> {st.visualDescription}
                      </p>

                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <span className="font-bold text-amber-700 shrink-0">💡 Analogy:</span>
                        <span>{st.analogy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mathematical Formulas Section */}
            {includeFormulas && project.formulas.length > 0 && (
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2 border-b border-slate-200 pb-1">
                  <span>4. Governing Formulas & Mathematical Proofs</span>
                </h2>

                <div className="space-y-3">
                  {project.formulas.map((form, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">
                          {form.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Eq. {fIdx + 1}
                        </span>
                      </div>

                      <div className="py-2 px-3 rounded bg-white border border-slate-200 text-center font-serif text-sm">
                        <KaTeXView math={form.latex} displayMode />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {form.explanation}
                      </p>

                      {form.variables && form.variables.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                          {form.variables.map((v, vIdx) => (
                            <div key={vIdx} className="text-slate-600">
                              <strong className="text-slate-800 font-mono">{v.symbol}</strong>: {v.meaning}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Document Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Published with TheoryVisualizer • Concept Mapping Engine</span>
              <span>Page 1 / Document End</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
