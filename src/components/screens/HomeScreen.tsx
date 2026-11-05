import React from 'react';
import {
  GraduationCap,
  Trophy,
  CheckCircle2,
  Play,
  ArrowRight,
  PlusCircle,
  Globe,
  Code2,
  Atom,
  Flame,
} from 'lucide-react';
import { Category, CategoryId, UserStats } from '../../types/quiz';
import { soundService } from '../../services/audio';

interface HomeScreenProps {
  stats: UserStats;
  categories: Category[];
  customQuestionCount: number;
  onSelectCategory: (categoryId: CategoryId) => void;
  onNavigateTab: (tab: 'categories' | 'add_question' | 'profile' | 'flutter_hub') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  categories,
  customQuestionCount,
  onSelectCategory,
  onNavigateTab,
}) => {
  const featured = categories.filter((c) =>
    ['general_knowledge', 'programming', 'science'].includes(c.id)
  );

  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'general_knowledge':
        return Globe;
      case 'programming':
        return Code2;
      case 'science':
        return Atom;
      default:
        return Flame;
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 text-white shadow-xl shadow-indigo-500/10">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Interactive Learning Edition</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test & Elevate Your Knowledge
            </h1>
            <p className="text-sm text-indigo-100/90 leading-relaxed max-w-md">
              Answer curated quizzes from the Open Trivia DB or test your peers with custom questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                soundService.playTap();
                onSelectCategory('general_knowledge');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Quick Start Quiz</span>
            </button>

            <button
              onClick={() => {
                soundService.playTap();
                onNavigateTab('categories');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-sm transition-colors"
            >
              <span>All 7 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient background blur shapes */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Real Statistics Overview Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Highest Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {stats.highestScore}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Best points recorded
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Quizzes Done
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {stats.totalQuizzesAttempted}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {stats.totalQuestionsAnswered} questions solved
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Featured Categories
          </h2>
          <button
            onClick={() => onNavigateTab('categories')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View All ({categories.length})
          </button>
        </div>

        <div className="space-y-2.5">
          {featured.map((cat) => {
            const Icon = getCategoryIcon(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => {
                  soundService.playTap();
                  onSelectCategory(cat.id);
                }}
                className="group w-full text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 active:scale-[0.99] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 transition-all cursor-pointer shadow-xs flex items-center gap-3.5"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {cat.questionCount} Qs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Questions Action Banner */}
      <div className="rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-4.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Author Custom Questions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {customQuestionCount > 0
                ? `${customQuestionCount} custom questions saved on this device.`
                : 'Create your own multiple choice questions with answers.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundService.playTap();
            onNavigateTab('add_question');
          }}
          className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition-transform shrink-0"
        >
          Create
        </button>
      </div>
    </div>
  );
};
