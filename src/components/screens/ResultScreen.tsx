import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizResult } from '../../types/quiz';
import { soundService } from '../../services/audio';

interface ResultScreenProps {
  result: QuizResult;
  highestScore: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  highestScore,
  onPlayAgain,
  onBackToHome,
}) => {
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  useEffect(() => {
    soundService.playComplete();
    if (result.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b'],
        });
      } catch {
        // Safe catch
      }
    }
  }, [result.percentage]);

  const getPerformanceMessage = (pct: number) => {
    if (pct >= 90) return { title: 'Mastermind!', subtitle: 'Outstanding performance! You aced this quiz with flying colors.' };
    if (pct >= 75) return { title: 'Great Job!', subtitle: 'Impressive effort! You demonstrated solid understanding.' };
    if (pct >= 50) return { title: 'Good Effort!', subtitle: 'Decent attempt! Review the answers below to sharpen your recall.' };
    return { title: 'Keep Learning!', subtitle: 'Every attempt builds mastery. Practice again and beat your score!' };
  };

  const perf = getPerformanceMessage(result.percentage);
  const isNewHighScore = result.score >= highestScore && result.score > 0;

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Score Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center relative overflow-hidden">
        {isNewHighScore && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-bold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>New Personal Best!</span>
          </div>
        )}

        {/* Circular Percentage Ring */}
        <div className="relative w-32 h-32 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className={
                result.percentage >= 70
                  ? 'stroke-emerald-500'
                  : result.percentage >= 50
                  ? 'stroke-amber-500'
                  : 'stroke-rose-500'
              }
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * result.percentage) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {result.percentage}%
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Score
            </span>
          </div>
        </div>

        <div className="space-y-1 mt-2">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {perf.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {perf.subtitle}
          </p>
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-1">
            Category: {result.categoryName}
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {result.correctAnswers}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Correct
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5">
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {result.incorrectAnswers}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Incorrect
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 text-center">
          <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {result.timeSpentSeconds}s
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Time Taken
          </div>
        </div>
      </div>

      {/* Detailed Answers Review Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowDetailedReview(!showDetailedReview)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        >
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Detailed Question Review ({result.answers.length} Questions)
          </span>
          {showDetailedReview ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showDetailedReview && (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 p-2 space-y-2">
            {result.answers.map((ans, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 space-y-1.5">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 shrink-0">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {idx + 1}. {ans.questionText}
                    </p>
                    <div className="mt-1 text-[11px] space-y-0.5 text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="font-semibold">Your answer: </span>
                        <span className={ans.isCorrect ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>
                          {ans.selectedOptionIndex >= 0 && ans.selectedOptionIndex < ans.options.length
                            ? ans.options[ans.selectedOptionIndex]
                            : 'None (Timed Out)'}
                        </span>
                      </div>
                      {!ans.isCorrect && (
                        <div>
                          <span className="font-semibold">Correct answer: </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {ans.options[ans.correctAnswerIndex]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons: Play Again & Back to Home */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={() => {
            soundService.playTap();
            onPlayAgain();
          }}
          className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Play Again</span>
        </button>

        <button
          onClick={() => {
            soundService.playTap();
            onBackToHome();
          }}
          className="w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};
