import React from 'react';
import {
  Globe,
  Atom,
  Calculator,
  Cpu,
  Code2,
  Landmark,
  Trophy,
  PenTool,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Category, CategoryId } from '../../types/quiz';
import { soundService } from '../../services/audio';

interface CategoriesScreenProps {
  categories: Category[];
  customQuestionCount: number;
  onSelectCategory: (categoryId: CategoryId) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  customQuestionCount,
  onSelectCategory,
}) => {
  const getCategoryIcon = (id: CategoryId) => {
    switch (id) {
      case 'general_knowledge':
        return Globe;
      case 'science':
        return Atom;
      case 'mathematics':
        return Calculator;
      case 'computer_science':
        return Cpu;
      case 'programming':
        return Code2;
      case 'history':
        return Landmark;
      case 'sports':
        return Trophy;
      case 'custom':
        return PenTool;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Quiz Categories
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select any category below to begin a timed 5-question challenge
        </p>
      </div>

      <div className="space-y-2.5">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.id);
          const isCustom = cat.id === 'custom';
          const count = isCustom ? customQuestionCount : cat.questionCount;

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
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {cat.name}
                  </h3>
                  {isCustom && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/60 px-1.5 py-0.5 rounded-md">
                      Local
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {cat.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  {count} Qs
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
