import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Type, 
  Search, 
  Languages, 
  Sparkles,
  BookOpen,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { VisualProject, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';

interface ReaderPaneProps {
  project: VisualProject;
  language: SupportedLanguage;
  isDarkMode: boolean;
  readingMode: boolean;
  onSelectWord: (word: string, contextSentence: string) => void;
  activeSentenceGlobalIndex: number;
  onSentenceChange: (index: number) => void;
}

export const ReaderPane: React.FC<ReaderPaneProps> = ({
  project,
  language,
  isDarkMode,
  readingMode,
  onSelectWord,
  activeSentenceGlobalIndex,
  onSentenceChange,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [fontSerif, setFontSerif] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState<'sm' | 'base' | 'lg'>('base');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Flatten all sentences across all readerSections
  const allSentences = React.useMemo(() => {
    const list: { text: string; sectionIndex: number; sentenceIndex: number }[] = [];
    project.readerSections.forEach((section, sIdx) => {
      section.sentences.forEach((st, stIdx) => {
        list.push({ text: st, sectionIndex: sIdx, sentenceIndex: stIdx });
      });
    });
    return list;
  }, [project]);

  // Load available voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const updateVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);
        // Prefer voice matching current language or English
        const langCode = language === 'hi' ? 'hi' : language;
        const matching = voices.find(v => v.lang.startsWith(langCode));
        if (matching) {
          setSelectedVoice(matching.name);
        } else if (voices.length > 0 && !selectedVoice) {
          setSelectedVoice(voices[0].name);
        }
      };

      updateVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = updateVoices;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  // Handle sentence playback
  const playSentenceAt = (index: number) => {
    if (!synthRef.current || index >= allSentences.length) {
      setIsPlaying(false);
      setCurrentSentenceIdx(0);
      onSentenceChange(-1);
      return;
    }

    synthRef.current.cancel();
    const sentenceObj = allSentences[index];
    setCurrentSentenceIdx(index);
    onSentenceChange(index);

    const utterance = new SpeechSynthesisUtterance(sentenceObj.text);
    utterance.rate = speechRate;
    if (selectedVoice) {
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }

    utterance.onend = () => {
      if (index + 1 < allSentences.length) {
        playSentenceAt(index + 1);
      } else {
        setIsPlaying(false);
        setCurrentSentenceIdx(0);
        onSentenceChange(-1);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      onSentenceChange(-1);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      synthRef.current?.cancel();
      setIsPlaying(false);
    } else {
      playSentenceAt(currentSentenceIdx);
    }
  };

  const handleStopSpeech = () => {
    synthRef.current?.cancel();
    setIsPlaying(false);
    setCurrentSentenceIdx(0);
    onSentenceChange(-1);
  };

  // Handle mouse selection of word in text
  const handleTextMouseUp = () => {
    const selection = window.getSelection();
    if (!selection) return;
    const text = selection.toString().trim();
    if (text.length > 1 && text.length < 40) {
      // Find parent sentence
      const anchorNode = selection.anchorNode;
      const sentenceContext = anchorNode?.parentElement?.innerText || text;
      onSelectWord(text, sentenceContext);
    }
  };

  // Font size classes
  const fontClass = fontSerif ? 'font-serif' : 'font-sans';
  const sizeClass = fontSizeLevel === 'sm' ? 'text-sm' : fontSizeLevel === 'lg' ? 'text-lg' : 'text-base';

  return (
    <div className={`h-full flex flex-col ${readingMode ? 'max-w-4xl mx-auto py-6' : ''}`}>
      
      {/* Reader Controls Toolbar */}
      <div className={`p-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 ${
        isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        
        {/* Audio TTS Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
            }`}
            title={isPlaying ? t.pauseSpeech : t.playSpeech}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? t.pauseSpeech : t.playSpeech}</span>
          </button>

          {isPlaying && (
            <button
              onClick={handleStopSpeech}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-400' : 'border-slate-300 hover:bg-slate-200 text-slate-600'
              }`}
              title={t.stopSpeech}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-2 text-slate-400">
            <span className="text-[11px] font-medium">{t.voiceSpeed}:</span>
            {[0.75, 1.0, 1.25, 1.5].map(rate => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  speechRate === rate 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40' 
                    : 'hover:text-slate-200'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>

        {/* Typography Customization */}
        <div className="flex items-center gap-2">
          {/* Serif / Sans toggle */}
          <button
            onClick={() => setFontSerif(!fontSerif)}
            className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
              fontSerif 
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 font-serif' 
                : isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'
            }`}
            title="Toggle Serif/Sans font"
          >
            {fontSerif ? 'Serif' : 'Sans'}
          </button>

          {/* Font Size */}
          <div className="flex items-center border rounded overflow-hidden border-slate-700">
            <button
              onClick={() => setFontSizeLevel('sm')}
              className={`px-2 py-0.5 text-[10px] font-bold ${fontSizeLevel === 'sm' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSizeLevel('base')}
              className={`px-2 py-0.5 text-xs font-bold ${fontSizeLevel === 'base' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('lg')}
              className={`px-2 py-0.5 text-sm font-bold ${fontSizeLevel === 'lg' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Reader Body */}
      <div 
        onMouseUp={handleTextMouseUp}
        className={`flex-1 overflow-y-auto p-5 sm:p-7 space-y-7 leading-relaxed ${fontClass} ${sizeClass}`}
      >
        {/* Theory Header Card */}
        <div className={`p-4 rounded-xl border ${
          isDarkMode 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{project.targetAudience}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-slate-100 dark:text-slate-100">
            {project.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">
            {project.summary}
          </p>

          {/* Key Takeaways */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Core Principles
            </div>
            {project.keyTakeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Translation Guidance Callout */}
        <div className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between border ${
          isDarkMode ? 'bg-slate-800/40 border-slate-700/60 text-slate-400' : 'bg-indigo-50/50 border-indigo-100 text-indigo-800'
        }`}>
          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.translateTooltip}</span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
            Interactive
          </span>
        </div>

        {/* Reader Sections */}
        {project.readerSections.map((section, sIdx) => {
          let runningSentenceOffset = 0;
          for (let prev = 0; prev < sIdx; prev++) {
            runningSentenceOffset += project.readerSections[prev].sentences.length;
          }

          return (
            <section key={sIdx} className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-200 tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>{section.title}</span>
              </h3>

              <div className="text-slate-300 leading-relaxed space-y-2">
                <p>
                  {section.sentences.map((st, stIdx) => {
                    const globalIdx = runningSentenceOffset + stIdx;
                    const isActive = isPlaying && currentSentenceIdx === globalIdx;

                    return (
                      <span
                        key={stIdx}
                        onClick={() => playSentenceAt(globalIdx)}
                        className={`cursor-pointer transition-all duration-200 rounded px-1 py-0.5 inline ${
                          isActive
                            ? 'bg-amber-400/25 text-amber-200 font-medium underline decoration-amber-400 decoration-2'
                            : 'hover:bg-indigo-500/15'
                        }`}
                        title="Click to listen from this sentence"
                      >
                        {st}{' '}
                      </span>
                    );
                  })}
                </p>
              </div>
            </section>
          );
        })}

        {/* Quick academic glossary tags */}
        <div className="pt-6 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Search className="w-3 h-3 text-indigo-400" />
            <span>Tap key terminology for etymology & translation:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['photosynthesis', 'chloroplast', 'electromagnetic', 'vector', 'RuBisCO', 'stoma', 'wavelength', 'induction'].map((term) => (
              <button
                key={term}
                onClick={() => onSelectWord(term, `Academic terminology key: ${term}`)}
                className="px-2.5 py-1 rounded-full text-xs bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 border border-slate-700/60 transition-all font-mono"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
