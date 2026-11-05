import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/category.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';
import '../services/quiz_service.dart';

/// Provider for managing an active quiz session, countdown timer, and score tallying.
class QuizProvider with ChangeNotifier {
  final QuizService _quizService = QuizService();

  QuizCategory? _activeCategory;
  List<Question> _questions = [];
  int _currentIndex = 0;
  int? _selectedAnswerIndex;
  bool _isAnswerSubmitted = false;
  int _score = 0;
  bool _isLoading = false;
  String? _errorMessage;

  // Countdown timer per question
  static const int questionDuration = 15;
  int _remainingSeconds = questionDuration;
  Timer? _timer;
  int _totalElapsedSeconds = 0;

  // History of answers in current quiz
  final List<UserAnswer> _currentAnswers = [];

  // Getters
  QuizCategory? get activeCategory => _activeCategory;
  List<Question> get questions => _questions;
  int get currentIndex => _currentIndex;
  int? get selectedAnswerIndex => _selectedAnswerIndex;
  bool get isAnswerSubmitted => _isAnswerSubmitted;
  int get score => _score;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  int get remainingSeconds => _remainingSeconds;
  int get totalQuestions => _questions.length;
  bool get isLastQuestion => _currentIndex == _questions.length - 1;
  Question? get currentQuestion =>
      _questions.isNotEmpty && _currentIndex < _questions.length ? _questions[_currentIndex] : null;

  /// Start a new quiz for the given category
  Future<void> startQuiz({
    required QuizCategory category,
    List<Question> customQuestions = const [],
    int questionCount = 5,
  }) async {
    _activeCategory = category;
    _isLoading = true;
    _errorMessage = null;
    _currentIndex = 0;
    _selectedAnswerIndex = null;
    _isAnswerSubmitted = false;
    _score = 0;
    _totalElapsedSeconds = 0;
    _currentAnswers.clear();
    _stopTimer();
    notifyListeners();

    try {
      _questions = await _quizService.fetchQuestions(
        categoryId: category.id,
        amount: questionCount,
        customQuestions: customQuestions,
      );

      if (_questions.isEmpty) {
        _errorMessage = 'No questions available for this category yet.';
      } else {
        _startTimer();
      }
    } catch (e) {
      _errorMessage = 'Failed to load questions. Please check connection and retry.';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Start or restart countdown timer for current question
  void _startTimer() {
    _stopTimer();
    _remainingSeconds = questionDuration;
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      _totalElapsedSeconds++;
      if (_remainingSeconds > 0) {
        _remainingSeconds--;
        notifyListeners();
      } else {
        _stopTimer();
        // Time expired: automatically lock answer as unselected (-1) if not submitted yet
        if (!_isAnswerSubmitted) {
          submitAnswer(-1);
        }
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    _timer = null;
  }

  /// Select an option before submitting
  void selectOption(int index) {
    if (_isAnswerSubmitted) return; // Prevent changing after submission
    _selectedAnswerIndex = index;
    notifyListeners();
  }

  /// Submit answer for current question
  void submitAnswer([int? optionIndex]) {
    if (_isAnswerSubmitted) return; // Prevent multiple submissions
    _stopTimer();

    final chosenIndex = optionIndex ?? _selectedAnswerIndex ?? -1;
    _selectedAnswerIndex = chosenIndex;
    _isAnswerSubmitted = true;

    final question = currentQuestion;
    if (question != null) {
      final isCorrect = chosenIndex == question.correctAnswerIndex;
      if (isCorrect) {
        _score++;
      }

      _currentAnswers.add(
        UserAnswer(
          questionId: question.id,
          questionText: question.questionText,
          selectedIndex: chosenIndex,
          correctIndex: question.correctAnswerIndex,
          isCorrect: isCorrect,
          options: question.options,
        ),
      );
    }

    notifyListeners();
  }

  /// Advance to next question or finalize
  bool nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      _currentIndex++;
      _selectedAnswerIndex = null;
      _isAnswerSubmitted = false;
      _startTimer();
      notifyListeners();
      return true;
    } else {
      _stopTimer();
      return false; // Quiz ended
    }
  }

  /// Build final QuizResult
  QuizResult buildQuizResult() {
    final catId = _activeCategory?.id ?? 'general_knowledge';
    final catName = _activeCategory?.name ?? 'General Knowledge';
    final total = _questions.length;
    final correct = _score;
    final incorrect = total - correct;
    final percentage = total > 0 ? (correct / total) * 100 : 0.0;

    return QuizResult(
      id: 'result_${DateTime.now().millisecondsSinceEpoch}',
      categoryId: catId,
      categoryName: catName,
      score: _score,
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      percentage: percentage,
      timeSpentSeconds: _totalElapsedSeconds,
      completedAt: DateTime.now(),
      answers: List.from(_currentAnswers),
    );
  }

  /// Abort ongoing quiz and reset
  void cancelQuiz() {
    _stopTimer();
    _questions.clear();
    _currentAnswers.clear();
    _activeCategory = null;
    _currentIndex = 0;
    _selectedAnswerIndex = null;
    _isAnswerSubmitted = false;
    _score = 0;
    notifyListeners();
  }

  @override
  void dispose() {
    _stopTimer();
    super.dispose();
  }
}
