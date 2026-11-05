import 'package:flutter/foundation.dart';
import '../models/quiz_result.dart';
import '../services/storage_service.dart';

/// Provider for managing scores, historical attempts, and performance metrics.
class ScoreProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();

  List<QuizResult> _quizHistory = [];
  int _highestScore = 0;
  bool _isLoading = false;

  List<QuizResult> get quizHistory => _quizHistory;
  int get highestScore => _highestScore;
  bool get isLoading => _isLoading;

  int get totalQuizzesCompleted => _quizHistory.length;

  int get totalQuestionsAnswered =>
      _quizHistory.fold<int>(0, (sum, item) => sum + item.totalQuestions);

  int get totalCorrectAnswers =>
      _quizHistory.fold<int>(0, (sum, item) => sum + item.correctAnswers);

  double get averageAccuracy {
    if (totalQuestionsAnswered == 0) return 0.0;
    return (totalCorrectAnswers / totalQuestionsAnswered) * 100;
  }

  ScoreProvider() {
    loadScoresAndHistory();
  }

  /// Load scores and quiz history from local storage
  Future<void> loadScoresAndHistory() async {
    _isLoading = true;
    notifyListeners();

    try {
      _quizHistory = await _storageService.getQuizHistory();
      _highestScore = await _storageService.getHighestScore();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Record a newly completed quiz session
  Future<void> recordQuizResult(QuizResult result) async {
    await _storageService.saveQuizResult(result);
    _quizHistory.insert(0, result);
    if (result.score > _highestScore) {
      _highestScore = result.score;
    }
    notifyListeners();
  }

  /// Get accuracy percentage for a specific category
  double getCategoryAccuracy(String categoryId) {
    final categoryAttempts = _quizHistory.where((r) => r.categoryId == categoryId).toList();
    if (categoryAttempts.isEmpty) return 0.0;
    final totalQ = categoryAttempts.fold<int>(0, (sum, r) => sum + r.totalQuestions);
    final correctQ = categoryAttempts.fold<int>(0, (sum, r) => sum + r.correctAnswers);
    return totalQ > 0 ? (correctQ / totalQ) * 100 : 0.0;
  }

  /// Clear all history
  Future<void> clearHistory() async {
    await _storageService.clearAllData();
    _quizHistory = [];
    _highestScore = 0;
    notifyListeners();
  }
}
