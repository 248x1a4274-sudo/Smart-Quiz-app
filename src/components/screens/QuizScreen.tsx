import React, { useState, useEffect } from 'react';
import {
  X,
  Timer,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Category, Question, QuizAttemptAnswer, QuizResult } from '../../types/quiz';
import { soundService } from '../../services/audio';
import { ExitDialog } from '../widgets/ExitDialog';

interface QuizScreenProps {
  category: Category;
  questions: Question[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onFinishQuiz: (result: QuizResult) => void;
  onExitQuiz: () => void;
}

const QUESTION_DURATION = 15; // 15 seconds per question

export const QuizScreen: React.FC<QuizScreenProps> = ({
  category,
  questions,
  isLoading,
  errorMessage,
  onRetry,
  onFinishQuiz,
  onExitQuiz,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(QUESTION_DURATION);
  const [recordedAnswers, setRecordedAnswers] = useState<QuizAttemptAnswer[]>([]);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Question Timer countdown
  useEffect(() => {
    if (isLoading || errorMessage || !currentQuestion || isAnswerSubmitted) return;

    const timer = setInterval(() => {
      setTotalElapsedTime((prev) => prev + 1);
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time expired: auto-lock as unselected (-1)
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswerSubmitted, isLoading, errorMessage, currentQuestion]);

  const handleTimeExpired = () => {
    if (isAnswerSubmitted) return;
    soundService.playIncorrect();
    setIsAnswerSubmitted(true);
    setSelectedOptionIndex(-1);

    if (currentQuestion) {
      setRecordedAnswers((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          questionText: currentQuestion.questionText,
          selectedOptionIndex: -1,
          correctAnswerIndex: currentQuestion.correctAnswerIndex,
          isCorrect: false,
          options: currentQuestion.options,
        },
      ]);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return; // Prevent changing after submission
    soundService.playTap();
    setSelectedOptionIndex(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted || !currentQuestion) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOptionIndex === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      soundService.playCorrect();
      setScore((s) => s + 1);
    } else {
      soundService.playIncorrect();
    }

    setRecordedAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        questionText: currentQuestion.questionText,
        selectedOptionIndex,
        correctAnswerIndex: currentQuestion.correctAnswerIndex,
        isCorrect,
        options: currentQuestion.options,
      },
    ]);
  };

  const handleNextQuestion = () => {
    soundService.playTap();
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      setRemainingSeconds(QUESTION_DURATION);
    } else {
      // Finalize Quiz
      const finalScore = score + (selectedOptionIndex === currentQuestion?.correctAnswerIndex ? 0 : 0);
      const percentage = Math.round((finalScore / totalQuestions) * 100);

      const result: QuizResult = {
        id: `result-${Date.now()}`,
        categoryId: category.id,
        categoryName: category.name,
        score: finalScore,
        totalQuestions,
        correctAnswers: finalScore,
        incorrectAnswers: totalQuestions - finalScore,
        percentage,
        timeSpentSeconds: totalElapsedTime,
        completedAt: new Date().toISOString(),
        answers: recordedAnswers,
      };

      onFinishQuiz(result);
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl border-4 border-indigo-600 border-t-transparent animate-spin" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Loading {category.name} Quiz...
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Querying public quiz API and assembling multiple-choice pool
          </p>
        </div>
      </div>
    );
  }

  // Error Screen
  if (errorMessage || !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Could Not Load Quiz
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {errorMessage || 'No questions available for this category right now.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <button
            onClick={onExitQuiz}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isTimeCritical = remainingSeconds <= 5;

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-150">
      {/* Top Header: Category Name, Score, Exit button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setIsExitDialogOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
            title="Exit quiz"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {category.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Question {currentIndex + 1} of {totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Current Score Indicator */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold text-indigo-700 dark:text-indigo-400 tabular-nums">
            Score: {score}
          </div>
        </div>
      </div>

      {/* Progress Bar & Countdown Timer */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            Progress ({progressPercent}%)
          </span>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
              isTimeCritical
                ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="tabular-nums">{remainingSeconds}s</span>
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
            {currentQuestion.isCustom
              ? 'Student Custom Question'
              : currentQuestion.difficulty || 'Trivia Question'}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Single Choice
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {currentQuestion.questionText}
        </h3>

        {/* 4 Multiple Choice Options */}
        <div className="space-y-2.5 pt-1">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrect = idx === currentQuestion.correctAnswerIndex;

            let cardStyle =
              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200';
            let badgeStyle =
              'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

            if (isAnswerSubmitted) {
              if (isCorrect) {
                // Correct answer (green)
                cardStyle =
                  'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500';
                badgeStyle = 'bg-emerald-600 text-white font-bold';
              } else if (isSelected && !isCorrect) {
                // Wrong selected answer (red)
                cardStyle =
                  'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                badgeStyle = 'bg-rose-600 text-white font-bold';
              } else {
                cardStyle =
                  'opacity-40 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500';
              }
            } else if (isSelected) {
              cardStyle =
                'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-600/30 font-semibold';
              badgeStyle = 'bg-indigo-600 text-white font-bold';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-sm ${cardStyle} ${
                  isAnswerSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 transition-colors ${badgeStyle}`}
                  >
                    {optionLabels[idx]}
                  </div>
                  <span className="leading-snug break-words">{option}</span>
                </div>

                {isAnswerSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation / Answer Feedback Banner */}
        {isAnswerSubmitted && currentQuestion.explanation && (
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 animate-in fade-in">
            <span className="font-bold text-slate-900 dark:text-white mr-1.5">Note:</span>
            {currentQuestion.explanation}
          </div>
        )}
      </div>

      {/* Action Footer: Confirm or Next Question */}
      <div className="pt-1">
        {!isAnswerSubmitted ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedOptionIndex === null}
            className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              selectedOptionIndex !== null
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98]'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Confirm Answer</span>
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full h-12 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-2 transition-all"
          >
            <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      <ExitDialog
        isOpen={isExitDialogOpen}
        onKeepPlaying={() => setIsExitDialogOpen(false)}
        onConfirmExit={() => {
          setIsExitDialogOpen(false);
          onExitQuiz();
        }}
      />
    </div>
  );
};
