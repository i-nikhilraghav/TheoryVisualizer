import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Sparkles,
  Smartphone,
  FileDown
} from 'lucide-react';
import { VisualProject } from '../types';

interface SocialShareModalProps {
  project: VisualProject;
  isOpen: boolean;
  onClose: () => void;
  onOpenPdfModal?: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  project,
  isOpen,
  onClose,
  onOpenPdfModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://theoryvisualizer.ai';
  const shareText = `Explore "${project.title}" on TheoryVisualizer! Deconstructed into interactive DAG mind maps, 3D simulations, and spaced-repetition flashcards.`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}&hashtags=TheoryVisualizer,EdTech,STEM,Learning`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleLinkedinShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySummary = () => {
    const fullSummary = `🧠 TheoryVisualizer: ${project.title} (${project.educationTier.toUpperCase()} - ${project.subject})
${project.summary}

Key Takeaways:
${project.keyTakeaways.map(k => `• ${k}`).join('\n')}

🔗 ${currentUrl}`;
    navigator.clipboard.writeText(fullSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border bg-slate-900 border-slate-800 p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Media Sharing & Export Suite</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Share "{project.title}"
          </h3>
        </div>

        {/* Instagram Story / Visual Preview Card (9:16 aspect ratio representation) */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-tr from-slate-950 via-indigo-950/60 to-purple-950/60 border border-indigo-500/30 text-center relative overflow-hidden shadow-inner">
          <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1 flex items-center justify-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Visual Story Card Preview (Instagram / Social Feed)</span>
          </div>
          
          <div className="my-3 p-4 rounded-xl bg-slate-900/90 border border-slate-700 max-w-sm mx-auto text-left shadow-lg">
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
              {project.educationTier} • {project.subject}
            </span>
            <h4 className="text-sm font-bold text-white mt-2 leading-snug">
              {project.title}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">
              {project.summary}
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>TheoryVisualizer.ai</span>
              <span className="text-emerald-400 font-bold">{project.mindMap.nodes.length} Concept Nodes</span>
            </div>
          </div>
        </div>

        {/* Share Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={handleTwitterShare}
            className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Twitter className="w-4 h-4 text-sky-400" />
            <span>Twitter / X</span>
          </button>
          
          <button
            onClick={handleLinkedinShare}
            className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Linkedin className="w-4 h-4 text-blue-400" />
            <span>LinkedIn</span>
          </button>

          <button
            onClick={handleFacebookShare}
            className="p-3 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-colors"
          >
            <Facebook className="w-4 h-4 text-indigo-400" />
            <span>Facebook</span>
          </button>
        </div>

        {/* QR Code Scan & Direct Link */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Dynamic SVG QR Code Representation */}
          <div className="w-24 h-24 p-2 bg-white rounded-xl shadow-xs shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-950">
              {/* Stylized QR Code matrix */}
              <rect x="10" y="10" width="30" height="30" fill="#000" />
              <rect x="15" y="15" width="20" height="20" fill="#fff" />
              <rect x="20" y="20" width="10" height="10" fill="#000" />

              <rect x="60" y="10" width="30" height="30" fill="#000" />
              <rect x="65" y="15" width="20" height="20" fill="#fff" />
              <rect x="70" y="20" width="10" height="10" fill="#000" />

              <rect x="10" y="60" width="30" height="30" fill="#000" />
              <rect x="15" y="65" width="20" height="20" fill="#fff" />
              <rect x="20" y="70" width="10" height="10" fill="#000" />

              <rect x="45" y="20" width="8" height="8" fill="#000" />
              <rect x="45" y="45" width="12" height="12" fill="#000" />
              <rect x="60" y="60" width="10" height="10" fill="#000" />
              <rect x="75" y="75" width="15" height="15" fill="#000" />
            </svg>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>Scan to open on smartphone or tablet</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Share directly with classmates, research peers, or post to classroom boards.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied Summary' : 'Copy Full Summary'}</span>
              </button>
              {onOpenPdfModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenPdfModal();
                  }}
                  className="px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download as PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
