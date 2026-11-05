import React, { useState } from 'react';
import {
  User,
  Trophy,
  CheckCircle2,
  BarChart3,
  History,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Category, QuizResult, UserStats } from '../../types/quiz';
import { soundService } from '../../services/audio';

interface ProfileScreenProps {
  stats: UserStats;
  history: QuizResult[];
  categories: Category[];
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  stats,
  history,
  categories,
  onResetData,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* User Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 dark:text-white">
              Quiz Scholar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rank: {stats.totalQuizzesAttempted >= 5 ? 'Knowledge Master' : stats.totalQuizzesAttempted >= 2 ? 'Apprentice' : 'Novice Learner'}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Reset score history"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4 Core Statistics Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Quizzes Done
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {stats.totalQuizzesAttempted}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Total attempts
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Highest Score
            </span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {stats.highestScore}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Max points in 1 quiz
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Accuracy
            </span>
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {stats.overallAccuracy}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {stats.totalCorrectAnswers}/{stats.totalQuestionsAnswered} correct
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Best Ratio
            </span>
            <Sparkles className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {stats.highestPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Peak accuracy
          </div>
        </div>
      </div>

      {/* Category-wise Performance Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          Category-wise Performance
        </h2>

        <div className="space-y-3">
          {categories.map((cat) => {
            const data = stats.categoryScores[cat.id];
            const attempted = data?.attempted || 0;
            const accuracy =
              data && data.maxScore > 0 ? Math.round((data.totalScore / data.maxScore) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.name}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {attempted > 0 ? `${accuracy}% (${attempted} quizzes)` : 'Not tested yet'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-300`}
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Quiz History ({history.length})
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Chronological
          </span>
        </div>

        {history.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 text-center text-slate-400 space-y-2">
            <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-xs">
              No quiz attempts recorded yet. Play a quiz to see your historical scores here!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      item.percentage >= 70
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : item.percentage >= 50
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {item.percentage}%
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.categoryName}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Score: {item.score}/{item.totalQuestions} · {formatDate(item.completedAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span className="text-emerald-600 font-semibold">{item.correctAnswers}✓</span>{' '}
                  <span className="text-rose-600 font-semibold">{item.incorrectAnswers}✗</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation modal for resetting history */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Clear All Quiz History?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              This will reset your score statistics, highest score, and attempt logs from local storage.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  soundService.playTap();
                  onResetData();
                  setShowConfirmReset(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
