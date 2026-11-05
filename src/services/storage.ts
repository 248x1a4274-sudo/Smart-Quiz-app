import { CategoryId, CustomQuestionInput, Question, QuizResult, UserStats } from '../types/quiz';

const STORAGE_KEYS = {
  CUSTOM_QUESTIONS: 'smart_quiz_custom_questions',
  QUIZ_RESULTS: 'smart_quiz_results_history',
  USER_STATS: 'smart_quiz_user_stats',
  THEME_MODE: 'smart_quiz_theme_mode',
  SOUND_ENABLED: 'smart_quiz_sound_enabled',
};

const INITIAL_STATS: UserStats = {
  totalQuizzesAttempted: 0,
  highestScore: 0,
  highestPercentage: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  overallAccuracy: 0,
  categoryScores: {
    general_knowledge: { attempted: 0, totalScore: 0, maxScore: 0 },
    science: { attempted: 0, totalScore: 0, maxScore: 0 },
    mathematics: { attempted: 0, totalScore: 0, maxScore: 0 },
    computer_science: { attempted: 0, totalScore: 0, maxScore: 0 },
    programming: { attempted: 0, totalScore: 0, maxScore: 0 },
    history: { attempted: 0, totalScore: 0, maxScore: 0 },
    sports: { attempted: 0, totalScore: 0, maxScore: 0 },
    custom: { attempted: 0, totalScore: 0, maxScore: 0 },
  },
};

export const storageService = {
  // Get all custom questions
  getCustomQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  // Save a new custom question
  saveCustomQuestion(input: CustomQuestionInput): Question {
    const questions = this.getCustomQuestions();
    const newQuestion: Question = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      questionText: input.questionText.trim(),
      options: [
        input.optionA.trim(),
        input.optionB.trim(),
        input.optionC.trim(),
        input.optionD.trim(),
      ],
      correctAnswerIndex: input.correctOptionIndex,
      category: input.category,
      explanation: `Correct answer: ${[input.optionA, input.optionB, input.optionC, input.optionD][input.correctOptionIndex]}`,
      isCustom: true,
    };

    const updated = [newQuestion, ...questions];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(updated));
    return newQuestion;
  },

  // Delete a custom question
  deleteCustomQuestion(id: string): void {
    const questions = this.getCustomQuestions().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(questions));
  },

  // Get quiz results history
  getQuizHistory(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  // Save a completed quiz result and recalculate user stats
  saveQuizResult(result: QuizResult): UserStats {
    const history = this.getQuizHistory();
    const updatedHistory = [result, ...history];
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(updatedHistory));

    // Update aggregate stats
    const stats = this.getUserStats();
    stats.totalQuizzesAttempted += 1;
    stats.totalQuestionsAnswered += result.totalQuestions;
    stats.totalCorrectAnswers += result.correctAnswers;
    stats.overallAccuracy = Math.round(
      (stats.totalCorrectAnswers / stats.totalQuestionsAnswered) * 100
    );

    if (result.score > stats.highestScore) {
      stats.highestScore = result.score;
    }
    if (result.percentage > stats.highestPercentage) {
      stats.highestPercentage = result.percentage;
    }

    if (!stats.categoryScores[result.categoryId]) {
      stats.categoryScores[result.categoryId] = { attempted: 0, totalScore: 0, maxScore: 0 };
    }
    stats.categoryScores[result.categoryId].attempted += 1;
    stats.categoryScores[result.categoryId].totalScore += result.score;
    stats.categoryScores[result.categoryId].maxScore += result.totalQuestions;

    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    return stats;
  },

  // Get aggregated user statistics
  getUserStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (!data) return { ...INITIAL_STATS };
      const parsed = JSON.parse(data);
      return {
        ...INITIAL_STATS,
        ...parsed,
        categoryScores: {
          ...INITIAL_STATS.categoryScores,
          ...(parsed.categoryScores || {}),
        },
      };
    } catch {
      return { ...INITIAL_STATS };
    }
  },

  // Reset all statistics and history (for testing and demo)
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
  },
};
