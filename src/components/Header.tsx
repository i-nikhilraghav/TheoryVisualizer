import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  Share2, 
  Bookmark, 
  History, 
  Moon, 
  Sun, 
  Globe, 
  Compass, 
  ChevronDown,
  Home,
  Layout,
  GraduationCap,
  FileDown
} from 'lucide-react';
import { EducationTier, SupportedLanguage, VisualProject } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { CURRICULUM_SUBJECTS } from '../data/presetCurriculum';

interface HeaderProps {
  currentProject: VisualProject;
  activeTier: EducationTier;
  onSelectTier: (tier: EducationTier) => void;
  onSelectSubject: (subjectName: string) => void;
  language: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  readingMode: boolean;
  onToggleReadingMode: () => void;
  onOpenNewModal: () => void;
  onOpenUploadModal: () => void;
  onOpenShareModal: () => void;
  onOpenPdfModal: () => void;
  onOpenBookmarks: () => void;
  onOpenHistory: () => void;
  bookmarkCount: number;
  viewMode: 'home' | 'workspace';
  onToggleViewMode: (mode: 'home' | 'workspace') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  activeTier,
  onSelectTier,
  onSelectSubject,
  language,
  onSelectLanguage,
  isDarkMode,
  onToggleDarkMode,
  readingMode,
  onToggleReadingMode,
  onOpenNewModal,
  onOpenUploadModal,
  onOpenShareModal,
  onOpenPdfModal,
  onOpenBookmarks,
  onOpenHistory,
  bookmarkCount,
  viewMode,
  onToggleViewMode,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const subjectsForTier = CURRICULUM_SUBJECTS.filter(s => s.tier === activeTier);

  return (
    <header className={`border-b transition-colors duration-200 sticky top-0 z-40 ${
      isDarkMode 
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md' 
        : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onToggleViewMode('home')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group select-none"
            title="Return to TheoryVisualizer Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent group-hover:opacity-90">
                  {t.appName}
                </span>
                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded tracking-wide ${
                  activeTier === 'school' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : activeTier === 'college'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  {activeTier}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 max-w-[200px] md:max-w-none">
                {viewMode === 'home' ? 'Curriculum Overview' : currentProject.title}
              </p>
            </div>
          </div>

          {/* Education Tier Switcher */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs font-medium">
            <button
              onClick={() => onSelectTier('school')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTier === 'school'
                  ? 'bg-emerald-500 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t.tierSchool}</span>
            </button>
            <button
              onClick={() => onSelectTier('college')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTier === 'college'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.tierCollege}</span>
            </button>
            <button
              onClick={() => onSelectTier('research')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTier === 'research'
                  ? 'bg-purple-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.tierResearch}</span>
            </button>
          </div>

          {/* Subject Selector Dropdown */}
          <div className="relative group hidden md:block">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              isDarkMode 
                ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200' 
                : 'bg-slate-100 border-slate-300 hover:border-slate-400 text-slate-800'
            }`}>
              <span className="text-slate-400">{t.subject}:</span>
              <span className="font-semibold max-w-[130px] truncate">{currentProject.subject}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className={`absolute left-0 mt-1 w-64 rounded-xl shadow-xl border py-1 hidden group-hover:block z-50 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                {t.selectSubject}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {subjectsForTier.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => onSelectSubject(sub.name)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-600/10 hover:text-indigo-400 transition-colors flex items-center justify-between"
                  >
                    <span>{sub.name}</span>
                    <span className="text-[10px] text-slate-500">{sub.sampleTopics.length} topics</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* View Mode Switcher: Home vs Studio Workspace */}
            <button
              onClick={() => onToggleViewMode(viewMode === 'home' ? 'workspace' : 'home')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'workspace'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
              title={viewMode === 'home' ? 'Open Visualizer Studio Workspace' : 'Return to Curriculum Homepage'}
            >
              {viewMode === 'home' ? (
                <>
                  <Layout className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Visualizer Studio</span>
                </>
              ) : (
                <>
                  <Home className="w-3.5 h-3.5 text-slate-300" />
                  <span className="hidden sm:inline">Curriculum Home</span>
                </>
              )}
            </button>

            {/* New Topic / Deconstruct Button */}
            <button
              onClick={onOpenNewModal}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">{t.newTopic}</span>
            </button>

            {/* Book / PDF Upload */}
            <button
              onClick={onOpenUploadModal}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title={t.uploadBook}
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.uploadBook}</span>
            </button>

            {/* Language Switcher */}
            <div className="relative group">
              <button 
                className={`p-2 rounded-lg border flex items-center gap-1 text-xs font-medium transition-colors ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
                title="Language"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="uppercase text-[11px] font-bold">{language}</span>
              </button>
              <div className={`absolute right-0 mt-1 w-36 rounded-xl shadow-xl border py-1 hidden group-hover:block z-50 ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                {(['en', 'hi', 'es', 'fr', 'de', 'ja'] as SupportedLanguage[]).map(lng => (
                  <button
                    key={lng}
                    onClick={() => onSelectLanguage(lng)}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                      language === lng ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'hover:bg-slate-800'
                    }`}
                  >
                    <span>{lng === 'en' ? 'English' : lng === 'hi' ? 'हिंदी' : lng === 'es' ? 'Español' : lng === 'fr' ? 'Français' : lng === 'de' ? 'Deutsch' : '日本語'}</span>
                    <span className="uppercase text-[10px] text-slate-500">{lng}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Mode Toggle */}
            <button
              onClick={onToggleReadingMode}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                readingMode 
                  ? 'bg-emerald-500 text-white border-emerald-400 font-bold' 
                  : isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={readingMode ? t.exitReadingMode : t.readingMode}
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>

            {/* Bookmarks */}
            <button
              onClick={onOpenBookmarks}
              className={`p-2 rounded-lg border text-xs relative transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={t.bookmarks}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* History */}
            <button
              onClick={onOpenHistory}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={t.history}
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
            </button>

            {/* Share */}
            <button
              onClick={onOpenShareModal}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={t.share}
            >
              <Share2 className="w-3.5 h-3.5 text-violet-400" />
            </button>

            {/* Download as PDF */}
            <button
              onClick={onOpenPdfModal}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isDarkMode 
                  ? 'bg-indigo-950/60 border-indigo-700/60 hover:bg-indigo-900/60 text-indigo-300' 
                  : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700'
              }`}
              title="Download as PDF (Printable Report with Mind Map & Storyboard)"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="hidden xl:inline">Download PDF</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
