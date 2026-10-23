import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Compass, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, VisualProject } from '../types';

interface AdaptiveQuizProps {
  project: VisualProject;
  isDarkMode: boolean;
  onLocateInMindMap: (nodeId: string) => void;
}

export const AdaptiveQuiz: React.FC<AdaptiveQuizProps> = ({
  project,
  isDarkMode,
  onLocateInMindMap,
}) => {
  const questions = project.quiz || [];

  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (optionIdx: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // already answered this question

    const updated = { ...selectedAnswers, [currentIdx]: optionIdx };
    setSelectedAnswers(updated);

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    // Check if this was the final question
    if (Object.keys(updated).length === questions.length) {
      setIsSubmitted(true);
      // Fire confetti for celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setScore(0);
  };

  if (!questions.length) {
    return <div className="p-8 text-center text-slate-400">No quiz questions generated.</div>;
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const isCurrentAnswered = selectedAnswers[currentIdx] !== undefined;
  const chosenOption = selectedAnswers[currentIdx];

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 max-w-4xl mx-auto overflow-y-auto">
      
      {/* Quiz Header & Live Score Card */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Bloom's Taxonomy Contextual Assessment</span>
          </span>
          <h2 className="text-xl font-bold text-slate-100">
            {project.title}: Concept Evaluation
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl border bg-slate-800/80 border-slate-700 text-xs font-medium text-slate-300">
            Progress: <strong className="text-indigo-400">{answeredCount}/{questions.length}</strong>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-xs font-bold text-emerald-300">
            Score: {score} / {questions.length}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-6">
        {questions.map((q, idx) => {
          const ans = selectedAnswers[idx];
          const isCorrect = ans !== undefined && ans === q.correctIndex;
          const isWrong = ans !== undefined && ans !== q.correctIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all ${
                isCorrect 
                  ? 'bg-emerald-500' 
                  : isWrong 
                  ? 'bg-rose-500' 
                  : currentIdx === idx 
                  ? 'bg-indigo-500' 
                  : 'bg-slate-800'
              }`}
              title={`Question ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className={`rounded-2xl border p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-2xl relative ${
          isDarkMode 
            ? 'bg-slate-900/90 border-slate-800 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800 shadow-md'
        }`}>
          <div>
            {/* Taxonomy & Reference Node Badge */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                currentQ.taxonomyLevel === 'Recall'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : currentQ.taxonomyLevel === 'Understanding'
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                Bloom's Tier: {currentQ.taxonomyLevel}
              </span>

              <button
                onClick={() => onLocateInMindMap(currentQ.referenceNodeId)}
                className="text-xs px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 flex items-center gap-1.5 transition-colors font-medium"
                title="Locate reference concept in Mind Map"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Locate in Mind Map</span>
              </button>
            </div>

            {/* Question Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-100 leading-snug mb-6">
              <span className="text-indigo-400 mr-2">Q{currentIdx + 1}.</span>
              {currentQ.question}
            </h3>

            {/* 4 Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = chosenOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let stateClasses = 'border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-200';

                if (isCurrentAnswered) {
                  if (isCorrect) {
                    stateClasses = 'border-emerald-500 bg-emerald-950/60 text-emerald-100 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected) {
                    stateClasses = 'border-rose-500 bg-rose-950/60 text-rose-100 ring-1 ring-rose-500';
                  } else {
                    stateClasses = 'opacity-40 border-slate-900 bg-slate-950/30 text-slate-400';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isCurrentAnswered}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all transform active:scale-99 ${stateClasses}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isCurrentAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isCurrentAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pedagogical Explanation Callout */}
            {isCurrentAnswered && (
              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-indigo-500/30 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Pedagogical Analysis & Explanation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Next / Previous Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200"
            >
              Previous Question
            </button>

            <span className="text-xs font-mono text-slate-400">
              {currentIdx + 1} / {questions.length}
            </span>

            {currentIdx + 1 < questions.length ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Quiz</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Completion Summary Modal / Card */}
      {isSubmitted && (
        <div className="mt-6 p-6 rounded-2xl border bg-gradient-to-r from-indigo-950/80 via-slate-900 to-emerald-950/80 border-emerald-500/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-white">
            Assessment Completed!
          </h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You scored {score} out of {questions.length} points ({Math.round((score / questions.length) * 100)}%).
            Great job mastering the foundational principles of {project.title}.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg"
            >
              Retake Assessment
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
