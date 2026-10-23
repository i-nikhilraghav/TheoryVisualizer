import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Layers, 
  Activity, 
  Calculator, 
  Award, 
  HelpCircle, 
  FileText, 
  Compass, 
  Sparkles,
  Bookmark,
  BookOpen
} from 'lucide-react';
import { 
  EducationTier, 
  SupportedLanguage, 
  VisualProject, 
  WordTranslationData, 
  BookmarkItem,
  MindMapNode,
  Flashcard
} from './types';
import { SHOWCASE_PROJECTS, CURRICULUM_SUBJECTS } from './data/presetCurriculum';
import { UI_TRANSLATIONS } from './data/translations';

// Components
import { Header } from './components/Header';
import { ReaderPane } from './components/ReaderPane';
import { MindMapCanvas } from './components/MindMapCanvas';
import { StoryboardView } from './components/StoryboardView';
import { InteractiveSimulations } from './components/InteractiveSimulations';
import { FormulaExplorer } from './components/FormulaExplorer';
import { FlashcardDeck } from './components/FlashcardDeck';
import { AdaptiveQuiz } from './components/AdaptiveQuiz';
import { WordTranslationModal } from './components/WordTranslationModal';
import { SocialShareModal } from './components/SocialShareModal';
import { DocumentUploadModal } from './components/DocumentUploadModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { TheoryPromptModal } from './components/TheoryPromptModal';
import { PdfExportModal } from './components/PdfExportModal';
import { HomePage } from './components/HomePage';

export default function App() {
  // --- CORE STATE ---
  const [viewMode, setViewMode] = useState<'home' | 'workspace'>('home');
  const [activeTier, setActiveTier] = useState<EducationTier>('college');
  const [currentProject, setCurrentProject] = useState<VisualProject>(() => {
    return SHOWCASE_PROJECTS.college as VisualProject;
  });
  const [activeTab, setActiveTab] = useState<'canvas' | 'storyboard' | 'simulation' | 'formulas' | 'flashcards' | 'quiz'>('canvas');
  
  // UI States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [readingMode, setReadingMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Modals & Drawers
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Translation Modal State
  const [translationModal, setTranslationModal] = useState<{
    isOpen: boolean;
    data: WordTranslationData | null;
    loading: boolean;
  }>({
    isOpen: false,
    data: null,
    loading: false,
  });

  // Persistent History
  const [history, setHistory] = useState<VisualProject[]>(() => {
    try {
      const saved = localStorage.getItem('tv_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
    return [
      SHOWCASE_PROJECTS.college as VisualProject,
      SHOWCASE_PROJECTS.school as VisualProject,
      SHOWCASE_PROJECTS.research as VisualProject,
    ];
  });

  // Persistent Bookmarks
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('tv_bookmarks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse bookmarks from localStorage', e);
    }
    return [
      {
        id: 'bm-initial-1',
        type: 'node',
        title: 'Ampère-Maxwell Law',
        snippet: 'curl B = mu0*J + mu0*eps0*(dE/dt) (Displacement current)',
        tag: 'Electrodynamics',
        projectId: 'proj-em-waves-college',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'bm-initial-2',
        type: 'project',
        title: 'Photosynthesis & Cellular Respiration',
        snippet: 'Biochemical solar energy conversion via thylakoid photolysis & Calvin cycle',
        tag: 'Biology-10th',
        projectId: 'proj-photosynthesis-10th',
        createdAt: new Date().toISOString(),
      }
    ];
  });

  // Save history & bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tv_history', JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('tv_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {}
  }, [bookmarks]);

  // Synchronize Dark Mode CSS Class on HTML body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // Switch Tier
  const handleSelectTier = (tier: EducationTier) => {
    setActiveTier(tier);
    const targetShowcase = SHOWCASE_PROJECTS[tier] as VisualProject;
    if (targetShowcase) {
      setCurrentProject(targetShowcase);
      setSelectedNodeId(null);
    }
  };

  // Switch Subject
  const handleSelectSubject = async (subjectName: string) => {
    const matchedSubject = CURRICULUM_SUBJECTS.find(s => s.name === subjectName);
    const sampleTopic = matchedSubject?.sampleTopics[0] || subjectName;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/visualize/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: sampleTopic,
          educationTier: activeTier,
          subject: subjectName,
          targetLanguage: language,
        }),
      });
      const data = await res.json();
      if (data.project) {
        setCurrentProject(data.project);
        setHistory(prev => [data.project, ...prev.filter(p => p.id !== data.project.id)]);
      }
    } catch (e) {
      console.warn('API fetch error, falling back:', e);
    } finally {
      setIsProcessing(false);
      setSelectedNodeId(null);
    }
  };

  // Generate customized theory project
  const handleGenerateCustom = async (
    topic: string, 
    tier: EducationTier, 
    subject: string, 
    contextText?: string
  ) => {
    setIsProcessing(true);
    setIsNewModalOpen(false);
    setIsUploadModalOpen(false);

    try {
      const res = await fetch('/api/visualize/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          sourceText: contextText,
          educationTier: tier,
          subject,
          targetLanguage: language,
        }),
      });
      const data = await res.json();
      if (data.project) {
        setActiveTier(tier);
        setCurrentProject(data.project);
        setHistory(prev => [data.project, ...prev.filter(p => p.id !== data.project.id)]);
      }
    } catch (e) {
      console.error('Error generating theory visualization:', e);
    } finally {
      setIsProcessing(false);
      setSelectedNodeId(null);
    }
  };

  // Launch topic directly from Homepage with instant matching or generation
  const handleLaunchTopic = (topic: string, tier: EducationTier, subject: string) => {
    setActiveTier(tier);
    setSelectedNodeId(null);

    const lower = topic.toLowerCase();
    if (lower.includes('photosynthesis')) {
      setCurrentProject(SHOWCASE_PROJECTS.school as VisualProject);
      setViewMode('workspace');
    } else if (lower.includes('maxwell') || lower.includes('electromagnetic') || lower.includes('wave')) {
      setCurrentProject(SHOWCASE_PROJECTS.college as VisualProject);
      setViewMode('workspace');
    } else if (lower.includes('transformer') || lower.includes('attention')) {
      setCurrentProject(SHOWCASE_PROJECTS.research as VisualProject);
      setViewMode('workspace');
    } else {
      handleGenerateCustom(topic, tier, subject);
      setViewMode('workspace');
    }
  };

  // Word Translation & Etymology Trigger
  const handleSelectWord = async (word: string, contextSentence: string) => {
    setTranslationModal({
      isOpen: true,
      data: null,
      loading: true,
    });

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word,
          contextSentence,
          targetLanguage: language,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setTranslationModal({
          isOpen: true,
          data: data.data,
          loading: false,
        });
      }
    } catch (err) {
      console.warn('Translation error:', err);
      setTranslationModal(prev => ({ ...prev, loading: false }));
    }
  };

  // Bookmark actions
  const handleBookmarkNode = (node: MindMapNode) => {
    const existing = bookmarks.find(b => b.id === `bm-node-${node.id}`);
    if (existing) {
      setBookmarks(bookmarks.filter(b => b.id !== existing.id));
    } else {
      const newBm: BookmarkItem = {
        id: `bm-node-${node.id}`,
        type: 'node',
        title: node.label,
        snippet: node.description,
        tag: node.category,
        projectId: currentProject.id,
        createdAt: new Date().toISOString(),
      };
      setBookmarks([newBm, ...bookmarks]);
    }
  };

  const handleBookmarkFlashcard = (card: Flashcard) => {
    const existing = bookmarks.find(b => b.id === `bm-card-${card.id}`);
    if (existing) {
      setBookmarks(bookmarks.filter(b => b.id !== existing.id));
    } else {
      const newBm: BookmarkItem = {
        id: `bm-card-${card.id}`,
        type: 'flashcard',
        title: card.front,
        snippet: card.back,
        tag: card.category,
        projectId: currentProject.id,
        createdAt: new Date().toISOString(),
      };
      setBookmarks([newBm, ...bookmarks]);
    }
  };

  const isNodeBookmarked = (nodeId: string) => {
    return bookmarks.some(b => b.id === `bm-node-${nodeId}`);
  };

  const isCardBookmarked = (cardId: string) => {
    return bookmarks.some(b => b.id === `bm-card-${cardId}`);
  };

  const handleSelectBookmark = (item: BookmarkItem) => {
    setIsBookmarksOpen(false);
    if (item.type === 'node') {
      const targetNodeId = item.id.replace('bm-node-', '');
      setSelectedNodeId(targetNodeId);
      setActiveTab('canvas');
    } else if (item.type === 'flashcard') {
      setActiveTab('flashcards');
    }
  };

  const handleLocateInMindMap = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setActiveTab('canvas');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Application Header */}
      <Header
        currentProject={currentProject}
        activeTier={activeTier}
        onSelectTier={handleSelectTier}
        onSelectSubject={handleSelectSubject}
        language={language}
        onSelectLanguage={setLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        readingMode={readingMode}
        onToggleReadingMode={() => setReadingMode(!readingMode)}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        bookmarkCount={bookmarks.length}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Loading Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-full border-3 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-sm font-semibold text-slate-200">
              {t.analyzingPrompt}
            </p>
          </div>
        )}

        {/* --- VIEW ROUTER: HOMEPAGE VS WORKSPACE --- */}
        {viewMode === 'home' ? (
          <div className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto">
            <HomePage
              onLaunchTopic={handleLaunchTopic}
              onOpenWorkspace={() => setViewMode('workspace')}
              onOpenUploadModal={() => setIsUploadModalOpen(true)}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
              isDarkMode={isDarkMode}
              language={language}
            />
          </div>
        ) : readingMode ? (
          // Reading Mode: Single full-width centered zen workspace
          <div className="flex-1 h-full overflow-y-auto">
            <ReaderPane
              project={currentProject}
              language={language}
              isDarkMode={isDarkMode}
              readingMode={true}
              onSelectWord={handleSelectWord}
              activeSentenceGlobalIndex={activeSentenceIndex}
              onSentenceChange={setActiveSentenceIndex}
            />
          </div>
        ) : (
          // Standard Split Workspace
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
            
            {/* Left Pane: Structured Academic Reader (40% width on Desktop) */}
            <div className="w-full lg:w-[42%] h-[40vh] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0 overflow-hidden flex flex-col">
              <ReaderPane
                project={currentProject}
                language={language}
                isDarkMode={isDarkMode}
                readingMode={false}
                onSelectWord={handleSelectWord}
                activeSentenceGlobalIndex={activeSentenceIndex}
                onSentenceChange={setActiveSentenceIndex}
              />
            </div>

            {/* Right Pane: Multi-Modal Visual Canvas Workspace (60% width) */}
            <div className="flex-1 h-[60vh] lg:h-full flex flex-col overflow-hidden bg-slate-950">
              
              {/* Workspace Navigation Tabs */}
              <div className="border-b border-slate-800 bg-slate-900/70 backdrop-blur-md px-4 flex items-center justify-between shrink-0 overflow-x-auto">
                <div className="flex items-center space-x-1 py-2">
                  <button
                    onClick={() => setActiveTab('canvas')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'canvas'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{t.tabCanvas}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('storyboard')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'storyboard'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{t.tabStoryboard}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('simulation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'simulation'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>{t.tabSimulation}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('formulas')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'formulas'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{t.tabFormulas}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'flashcards'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{t.tabFlashcards}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeTab === 'quiz'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{t.tabQuiz}</span>
                  </button>
                </div>
              </div>

              {/* Tab Content Panel */}
              <div className="flex-1 overflow-hidden relative">
                {activeTab === 'canvas' && (
                  <MindMapCanvas
                    project={currentProject}
                    isDarkMode={isDarkMode}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={setSelectedNodeId}
                    onBookmarkNode={handleBookmarkNode}
                    isNodeBookmarked={isNodeBookmarked}
                    activeSentenceIndex={activeSentenceIndex}
                    onOpenPdfModal={() => setIsPdfModalOpen(true)}
                  />
                )}

                {activeTab === 'storyboard' && (
                  <StoryboardView
                    project={currentProject}
                    isDarkMode={isDarkMode}
                    onOpenPdfModal={() => setIsPdfModalOpen(true)}
                  />
                )}

                {activeTab === 'simulation' && (
                  <InteractiveSimulations
                    project={currentProject}
                    isDarkMode={isDarkMode}
                  />
                )}

                {activeTab === 'formulas' && (
                  <FormulaExplorer
                    project={currentProject}
                    isDarkMode={isDarkMode}
                  />
                )}

                {activeTab === 'flashcards' && (
                  <FlashcardDeck
                    project={currentProject}
                    isDarkMode={isDarkMode}
                    onBookmarkFlashcard={handleBookmarkFlashcard}
                    isCardBookmarked={isCardBookmarked}
                  />
                )}

                {activeTab === 'quiz' && (
                  <AdaptiveQuiz
                    project={currentProject}
                    isDarkMode={isDarkMode}
                    onLocateInMindMap={handleLocateInMindMap}
                  />
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      {/* --- MODALS & DRAWERS --- */}

      {/* New Theory Generator Modal */}
      <TheoryPromptModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onGenerate={handleGenerateCustom}
        isLoading={isProcessing}
        currentTier={activeTier}
        language={language}
      />

      {/* Book / PDF Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProcessDocument={(title, text, tier) => handleGenerateCustom(title, tier, currentProject.subject, text)}
        isLoading={isProcessing}
      />

      {/* Word Translation & Etymology Modal */}
      <WordTranslationModal
        data={translationModal.data}
        loading={translationModal.loading}
        onClose={() => setTranslationModal({ isOpen: false, data: null, loading: false })}
        language={language}
      />

      {/* Social Media Share Modal */}
      <SocialShareModal
        project={currentProject}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* PDF Export Modal (jsPDF + html2canvas) */}
      <PdfExportModal
        project={currentProject}
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onRemoveBookmark={(id) => setBookmarks(bookmarks.filter(b => b.id !== id))}
        onSelectBookmark={handleSelectBookmark}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectProject={(proj) => {
          setActiveTier(proj.educationTier);
          setCurrentProject(proj);
          setSelectedNodeId(null);
        }}
        onClearHistory={() => setHistory([])}
      />

    </div>
  );
}
