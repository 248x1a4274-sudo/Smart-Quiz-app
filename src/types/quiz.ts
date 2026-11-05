export type CategoryId =
  | 'general_knowledge'
  | 'science'
  | 'mathematics'
  | 'computer_science'
  | 'programming'
  | 'history'
  | 'sports'
  | 'custom';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  iconName: string;
  color: string;
  accentColor: string;
  openTdbId?: number;
  questionCount: number;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  category: CategoryId;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
  isCustom?: boolean;
}

export interface QuizAttemptAnswer {
  questionId: string;
  questionText: string;
  selectedOptionIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  options: string[];
}

export interface QuizResult {
  id: string;
  categoryId: CategoryId;
  categoryName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string; // ISO string
  answers: QuizAttemptAnswer[];
}

export interface UserStats {
  totalQuizzesAttempted: number;
  highestScore: number;
  highestPercentage: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  categoryScores: Record<CategoryId, { attempted: number; totalScore: number; maxScore: number }>;
}

export interface CustomQuestionInput {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOptionIndex: number;
  category: CategoryId;
}
