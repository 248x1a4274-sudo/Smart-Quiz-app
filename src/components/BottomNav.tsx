import React from 'react';
import { Home, Grid, PlusCircle, User, Code2 } from 'lucide-react';

export type TabId = 'home' | 'categories' | 'add_question' | 'profile' | 'flutter_hub';

interface BottomNavProps {
  currentTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as TabId, label: 'Home', icon: Home },
    { id: 'categories' as TabId, label: 'Categories', icon: Grid },
    { id: 'add_question' as TabId, label: 'Add Q', icon: PlusCircle },
    { id: 'profile' as TabId, label: 'Profile', icon: User },
    { id: 'flutter_hub' as TabId, label: 'Flutter Code', icon: Code2 },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 transition-colors">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative group"
            >
              <div
                className={`w-12 h-8 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight whitespace-nowrap transition-colors ${
                  isActive
                    ? 'font-bold text-indigo-700 dark:text-indigo-400'
                    : 'font-medium text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
