/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNav, TabId } from './components/BottomNav';
import { HomeScreen } from './components/screens/HomeScreen';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { QuizScreen } from './components/screens/QuizScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { AddQuestionScreen } from './components/screens/AddQuestionScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { FlutterHubScreen } from './components/screens/FlutterHubScreen';

import { CategoryId, CustomQuestionInput, Question, QuizResult, UserStats } from './types/quiz';
import { QUIZ_CATEGORIES, fetchQuestionsForCategory } from './services/quizApi';
import { storageService } from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('home');
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<UserStats>(storageService.getUserStats());
  const [history, setHistory] = useState<QuizResult[]>(storageService.getQuizHistory());

  // Active Quiz Session State
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [quizErrorMessage, setQuizErrorMessage] = useState<string | null>(null);
  const [currentQuizResult, setCurrentQuizResult] = useState<QuizResult | null>(null);

  // Load custom questions, user stats, and history on initial mount
  useEffect(() => {
    setCustomQuestions(storageService.getCustomQuestions());
    setStats(storageService.getUserStats());
    setHistory(storageService.getQuizHistory());
  }, []);

  // Launch a new Quiz
  const handleStartQuiz = useCallback(async (categoryId: CategoryId) => {
    setActiveCategoryId(categoryId);
    setCurrentQuizResult(null);
    setIsLoadingQuiz(true);
    setQuizErrorMessage(null);

    try {
      const { questions } = await fetchQuestionsForCategory(categoryId, 5, customQuestions);
      if (questions.length === 0) {
        setQuizErrorMessage('No questions found for this category.');
      } else {
        setQuizQuestions(questions);
      }
    } catch {
      setQuizErrorMessage('Failed to fetch questions. Please check network connection.');
    } finally {
      setIsLoadingQuiz(false);
    }
  }, [customQuestions]);

  // Finish an active quiz session
  const handleFinishQuiz = (result: QuizResult) => {
    const updatedStats = storageService.saveQuizResult(result);
    setStats(updatedStats);
    setHistory(storageService.getQuizHistory());
    setCurrentQuizResult(result);
  };

  // Exit/abort quiz
  const handleExitQuiz = () => {
    setActiveCategoryId(null);
    setCurrentQuizResult(null);
    setQuizQuestions([]);
  };

  // Play again in the same category
  const handlePlayAgain = () => {
    if (activeCategoryId) {
      handleStartQuiz(activeCategoryId);
    } else {
      handleExitQuiz();
    }
  };

  // Save custom question
  const handleSaveQuestion = (input: CustomQuestionInput) => {
    const newQ = storageService.saveCustomQuestion(input);
    setCustomQuestions((prev) => [newQ, ...prev]);
  };

  // Delete custom question
  const handleDeleteQuestion = (id: string) => {
    storageService.deleteCustomQuestion(id);
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Reset user data
  const handleResetData = () => {
    storageService.resetAllData();
    setStats(storageService.getUserStats());
    setHistory([]);
  };

  const activeCategory = QUIZ_CATEGORIES.find((c) => c.id === activeCategoryId) || QUIZ_CATEGORIES[0];

  // Determine screen title for header
  let screenTitle = 'Home';
  if (currentQuizResult) {
    screenTitle = 'Quiz Results';
  } else if (activeCategoryId) {
    screenTitle = `Quiz: ${activeCategory.name}`;
  } else {
    switch (currentTab) {
      case 'home':
        screenTitle = 'Home';
        break;
      case 'categories':
        screenTitle = 'Categories';
        break;
      case 'add_question':
        screenTitle = 'Add Question';
        break;
      case 'profile':
        screenTitle = 'Profile & History';
        break;
      case 'flutter_hub':
        screenTitle = 'Flutter Source & Tests';
        break;
    }
  }

  return (
    <AndroidFrame activeScreenTitle={screenTitle}>
      <div className="flex flex-col min-h-full">
        {/* Main dynamic screen view */}
        <div className="flex-1">
          {currentQuizResult ? (
            <ResultScreen
              result={currentQuizResult}
              highestScore={stats.highestScore}
              onPlayAgain={handlePlayAgain}
              onBackToHome={handleExitQuiz}
            />
          ) : activeCategoryId ? (
            <QuizScreen
              category={activeCategory}
              questions={quizQuestions}
              isLoading={isLoadingQuiz}
              errorMessage={quizErrorMessage}
              onRetry={() => handleStartQuiz(activeCategoryId)}
              onFinishQuiz={handleFinishQuiz}
              onExitQuiz={handleExitQuiz}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomeScreen
                  stats={stats}
                  categories={QUIZ_CATEGORIES}
                  customQuestionCount={customQuestions.length}
                  onSelectCategory={handleStartQuiz}
                  onNavigateTab={(tab) => setCurrentTab(tab as TabId)}
                />
              )}
              {currentTab === 'categories' && (
                <CategoriesScreen
                  categories={QUIZ_CATEGORIES}
                  customQuestionCount={customQuestions.length}
                  onSelectCategory={handleStartQuiz}
                />
              )}
              {currentTab === 'add_question' && (
                <AddQuestionScreen
                  categories={QUIZ_CATEGORIES}
                  customQuestions={customQuestions}
                  onSaveQuestion={handleSaveQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                />
              )}
              {currentTab === 'profile' && (
                <ProfileScreen
                  stats={stats}
                  history={history}
                  categories={QUIZ_CATEGORIES}
                  onResetData={handleResetData}
                />
              )}
              {currentTab === 'flutter_hub' && <FlutterHubScreen />}
            </>
          )}
        </div>

        {/* Bottom Navigation Bar (Hidden when actively taking a quiz) */}
        {!activeCategoryId && !currentQuizResult && (
          <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
        )}
      </div>
    </AndroidFrame>
  );
}
