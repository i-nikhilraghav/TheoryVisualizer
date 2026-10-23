import React, { useState } from 'react';
import { 
  RotateCw, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Bookmark, 
  Award, 
  Sparkles, 
  Check, 
  X,
  Layers
} from 'lucide-react';
import { Flashcard, VisualProject } from '../types';

interface FlashcardDeckProps {
  project: VisualProject;
  isDarkMode: boolean;
  onBookmarkFlashcard: (card: Flashcard) => void;
  isCardBookmarked: (cardId: string) => boolean;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  project,
  isDarkMode,
  onBookmarkFlashcard,
  isCardBookmarked,
}) => {
  // Deck state
  const [cards, setCards] = useState<Flashcard[]>(() => {
    return project.flashcards.map(c => ({
      ...c,
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
      userRating: undefined,
    }));
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New card form inputs
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newHint, setNewHint] = useState('');
  const [newCategory, setNewCategory] = useState('Custom Note');

  const currentCard = cards[currentIndex] || cards[0];

  // SuperMemo-2 (SM-2) Spaced Repetition Algorithm
  const handleRating = (rating: number) => {
    if (!currentCard) return;

    setCards(prevCards => {
      const updated = [...prevCards];
      const card = { ...updated[currentIndex] };

      let repetition = card.repetition || 0;
      let easeFactor = card.easeFactor || 2.5;
      let interval = card.interval || 1;

      // Update ease factor: EF' = EF + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));

      if (rating < 3) {
        // Failed recall: reset repetitions and schedule for tomorrow
        repetition = 0;
        interval = 1;
      } else {
        // Successful recall: scale interval
        if (repetition === 0) {
          interval = 1;
        } else if (repetition === 1) {
          interval = 6;
        } else {
          interval = Math.round(interval * easeFactor);
        }
        repetition += 1;
      }

      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + interval);

      card.repetition = repetition;
      card.easeFactor = parseFloat(easeFactor.toFixed(2));
      card.interval = interval;
      card.dueDate = nextDue.toISOString().split('T')[0];
      card.userRating = rating;

      updated[currentIndex] = card;
      return updated;
    });

    // Move to next card
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const handleCreateCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: `fc-custom-${Date.now()}`,
      front: newFront.trim(),
      back: newBack.trim(),
      hint: newHint.trim() || undefined,
      category: newCategory.trim() || 'Custom Review',
      interval: 1,
      repetition: 0,
      easeFactor: 2.5,
      dueDate: new Date().toISOString().split('T')[0],
    };

    setCards([...cards, newCard]);
    setNewFront('');
    setNewBack('');
    setNewHint('');
    setIsAddModalOpen(false);
    setCurrentIndex(cards.length);
    setIsFlipped(false);
  };

  const masteredCount = cards.filter(c => (c.userRating || 0) >= 3).length;

  if (!cards.length) {
    return <div className="p-8 text-center text-slate-400">No flashcards available.</div>;
  }

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 max-w-4xl mx-auto overflow-y-auto">
      
      {/* Top Deck Stats & Controls */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>SuperMemo-2 (SM-2) Spaced Repetition System</span>
          </span>
          <h2 className="text-xl font-bold text-slate-100">
            {project.title}: Concept Flashcards
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            Mastered: <strong className="text-emerald-400 font-bold">{masteredCount}/{cards.length}</strong>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* 3D Perspective Flashcard Container */}
      <div className="perspective-1000 w-full min-h-[320px] sm:min-h-[360px] flex items-center justify-center my-auto">
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className={`transform-style-3d relative w-full max-w-2xl min-h-[320px] sm:min-h-[360px] rounded-3xl border-2 cursor-pointer transition-transform duration-500 shadow-2xl ${
            isFlipped ? 'rotate-y-180 border-emerald-500/50' : 'border-indigo-500/40'
          } ${isDarkMode ? 'bg-slate-900/95' : 'bg-white'}`}
        >
          {/* --- FRONT OF CARD --- */}
          <div className="backface-hidden absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            {/* Front Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                {currentCard.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookmarkFlashcard(currentCard);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                  title="Bookmark flashcard"
                >
                  <Bookmark className={`w-4 h-4 ${isCardBookmarked(currentCard.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {currentIndex + 1} / {cards.length}
                </span>
              </div>
            </div>

            {/* Front Question Content */}
            <div className="my-auto py-4 text-center">
              <h3 className="text-lg sm:text-2xl font-bold text-slate-100 leading-snug">
                {currentCard.front}
              </h3>

              {/* Optional Hint */}
              {currentCard.hint && (
                <div className="mt-4">
                  {showHint ? (
                    <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 inline-block max-w-md">
                      💡 {currentCard.hint}
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(true);
                      }}
                      className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 mx-auto transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Show Hint</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Front Footer */}
            <div className="text-center text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1.5 pt-3 border-t border-slate-800/80">
              <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Click or tap anywhere to reveal definition / answer</span>
            </div>
          </div>

          {/* --- BACK OF CARD --- */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 rounded-3xl">
            {/* Back Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Answer & Concept Synthesis
              </span>
              <span className="text-xs font-mono text-slate-400">
                Due in {currentCard.interval || 1} day(s)
              </span>
            </div>

            {/* Back Answer Content */}
            <div className="my-auto py-4 text-center">
              <p className="text-base sm:text-xl font-medium text-emerald-100 leading-relaxed">
                {currentCard.back}
              </p>
            </div>

            {/* Back SM-2 Rating Buttons */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="pt-3 border-t border-slate-800/80 flex flex-col gap-2"
            >
              <div className="text-[10px] text-slate-400 uppercase font-bold text-center tracking-wider">
                Rate your recall difficulty (SuperMemo-2 Algorithm):
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRating(1)}
                  className="py-1.5 px-2 rounded-xl text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
                >
                  Blackout (1)
                </button>
                <button
                  onClick={() => handleRating(2)}
                  className="py-1.5 px-2 rounded-xl text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition-colors"
                >
                  Hard (2)
                </button>
                <button
                  onClick={() => handleRating(3)}
                  className="py-1.5 px-2 rounded-xl text-xs font-bold bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800 transition-colors"
                >
                  Good (3)
                </button>
                <button
                  onClick={() => handleRating(5)}
                  className="py-1.5 px-2 rounded-xl text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors"
                >
                  Easy (5)
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Card Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-200"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          Card {currentIndex + 1} of {cards.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5 transition-colors text-slate-200"
        >
          <span>Next Card</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add Custom Flashcard Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border bg-slate-900 border-slate-800 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Create Personalized Flashcard</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomCard} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Front (Question / Prompt / Visual Cue):
                </label>
                <textarea
                  required
                  rows={2}
                  value={newFront}
                  onChange={e => setNewFront(e.target.value)}
                  placeholder="e.g. What is the role of RuBisCO in the Calvin cycle?"
                  className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Back (Target Concept / Accurate Explanation):
                </label>
                <textarea
                  required
                  rows={3}
                  value={newBack}
                  onChange={e => setNewBack(e.target.value)}
                  placeholder="e.g. Fixes CO2 onto RuBP to create 3-PGA intermediates."
                  className="w-full p-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Optional Hint:
                  </label>
                  <input
                    type="text"
                    value={newHint}
                    onChange={e => setNewHint(e.target.value)}
                    placeholder="Short memory anchor"
                    className="w-full p-2 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Category Tag:
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="e.g. Formula, Anatomy"
                    className="w-full p-2 rounded-xl border bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
