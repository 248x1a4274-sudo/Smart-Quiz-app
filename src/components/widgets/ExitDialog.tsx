import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ExitDialogProps {
  isOpen: boolean;
  onKeepPlaying: () => void;
  onConfirmExit: () => void;
}

export const ExitDialog: React.FC<ExitDialogProps> = ({
  isOpen,
  onKeepPlaying,
  onConfirmExit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transform scale-100 transition-all">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Exit Ongoing Quiz?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Your active quiz progress and score for this session will be lost if you leave now. Are you sure?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onKeepPlaying}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Keep Playing
          </button>
          <button
            onClick={onConfirmExit}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-xl transition-transform"
          >
            Exit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
