import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Trash2,
  PenTool,
  HelpCircle,
} from 'lucide-react';
import { Category, CategoryId, CustomQuestionInput, Question } from '../../types/quiz';
import { soundService } from '../../services/audio';

interface AddQuestionScreenProps {
  categories: Category[];
  customQuestions: Question[];
  onSaveQuestion: (input: CustomQuestionInput) => void;
  onDeleteQuestion: (id: string) => void;
}

export const AddQuestionScreen: React.FC<AddQuestionScreenProps> = ({
  categories,
  customQuestions,
  onSaveQuestion,
  onDeleteQuestion,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(0);
  const [category, setCategory] = useState<CategoryId>('general_knowledge');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    const q = questionText.trim();
    const a = optionA.trim();
    const b = optionB.trim();
    const c = optionC.trim();
    const d = optionD.trim();

    // Validation checks
    if (!q) {
      setValidationError('Please enter the question text.');
      return;
    }
    if (q.length < 8) {
      setValidationError('Question text is too short. Please write a descriptive question.');
      return;
    }

    if (!a || !b || !c || !d) {
      setValidationError('All four multiple-choice options (A, B, C, D) are required.');
      return;
    }

    // Validation: All 4 options must be distinct
    const normalizedOptions = [a.toLowerCase(), b.toLowerCase(), c.toLowerCase(), d.toLowerCase()];
    const uniqueOptions = new Set(normalizedOptions);
    if (uniqueOptions.size < 4) {
      setValidationError('All 4 options must be distinctly different from each other.');
      return;
    }

    if (correctOptionIndex < 0 || correctOptionIndex > 3) {
      setValidationError('Please mark which option (A, B, C, or D) is the correct answer.');
      return;
    }

    soundService.playCorrect();
    onSaveQuestion({
      questionText: q,
      optionA: a,
      optionB: b,
      optionC: c,
      optionD: d,
      correctOptionIndex,
      category,
    });

    setSuccessMessage('Question saved successfully to local storage!');
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOptionIndex(0);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  const optionLabels = ['Option A', 'Option B', 'Option C', 'Option D'];

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Create Custom Question
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Add new questions with validation. Saved locally and blended into quizzes.
        </p>
      </div>

      {/* Validation / Success Messages */}
      {validationError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Target Quiz Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryId)}
            className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Question Prompt Text
          </label>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="e.g. Which programming language is primarily used for Flutter development?"
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
          />
        </div>

        {/* 4 Multiple Choice Options with Correct Answer Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Multiple Choice Options
            </label>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Select radio for correct answer
            </span>
          </div>

          {[
            { label: optionLabels[0], value: optionA, setter: setOptionA, index: 0 },
            { label: optionLabels[1], value: optionB, setter: setOptionB, index: 1 },
            { label: optionLabels[2], value: optionC, setter: setOptionC, index: 2 },
            { label: optionLabels[3], value: optionD, setter: setOptionD, index: 3 },
          ].map((item) => (
            <div
              key={item.index}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-3 ${
                correctOptionIndex === item.index
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <input
                type="radio"
                name="correct_option"
                id={`opt_${item.index}`}
                checked={correctOptionIndex === item.index}
                onChange={() => setCorrectOptionIndex(item.index)}
                className="w-4 h-4 text-indigo-600 accent-indigo-600 cursor-pointer ml-1"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => item.setter(e.target.value)}
                placeholder={`${item.label} answer text...`}
                className="flex-1 bg-transparent text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
              />
              {correctOptionIndex === item.index && (
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-md shrink-0">
                  Correct
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Question to Local Storage</span>
        </button>
      </form>

      {/* List of Existing Custom Questions */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Saved Custom Questions ({customQuestions.length})
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Persistent on device
          </span>
        </div>

        {customQuestions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center text-slate-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-xs">
              No custom questions created yet. Use the form above to add your first question!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {customQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded-md">
                      {q.category}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {q.questionText}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Correct: <span className="font-semibold text-emerald-600">{q.options[q.correctAnswerIndex]}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundService.playTap();
                    onDeleteQuestion(q.id);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
