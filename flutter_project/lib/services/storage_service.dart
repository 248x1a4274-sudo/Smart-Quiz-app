import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';

/// Service responsible for local persistence using SharedPreferences.
class StorageService {
  static const String _keyCustomQuestions = 'smart_quiz_custom_questions';
  static const String _keyQuizResults = 'smart_quiz_results_history';
  static const String _keyHighestScore = 'smart_quiz_highest_score';

  /// Save a new custom question to SharedPreferences
  Future<void> saveCustomQuestion(Question question) async {
    final prefs = await SharedPreferences.getInstance();
    final questions = await getCustomQuestions();
    questions.insert(0, question);
    final jsonList = questions.map((q) => q.toJson()).toList();
    await prefs.setString(_keyCustomQuestions, jsonEncode(jsonList));
  }

  /// Retrieve all custom questions saved locally
  Future<List<Question>> getCustomQuestions() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_keyCustomQuestions);
    if (jsonString == null || jsonString.isEmpty) return [];

    try {
      final List<dynamic> decoded = jsonDecode(jsonString);
      return decoded.map((item) => Question.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  /// Delete a custom question by ID
  Future<void> deleteCustomQuestion(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final questions = await getCustomQuestions();
    questions.removeWhere((q) => q.id == id);
    final jsonList = questions.map((q) => q.toJson()).toList();
    await prefs.setString(_keyCustomQuestions, jsonEncode(jsonList));
  }

  /// Save completed quiz result and update highest score
  Future<void> saveQuizResult(QuizResult result) async {
    final prefs = await SharedPreferences.getInstance();
    final history = await getQuizHistory();
    history.insert(0, result);
    final jsonList = history.map((r) => r.toJson()).toList();
    await prefs.setString(_keyQuizResults, jsonEncode(jsonList));

    final currentHighest = await getHighestScore();
    if (result.score > currentHighest) {
      await prefs.setInt(_keyHighestScore, result.score);
    }
  }

  /// Get the full quiz attempt history
  Future<List<QuizResult>> getQuizHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = prefs.getString(_keyQuizResults);
    if (jsonString == null || jsonString.isEmpty) return [];

    try {
      final List<dynamic> decoded = jsonDecode(jsonString);
      return decoded.map((item) => QuizResult.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  /// Retrieve user's highest score
  Future<int> getHighestScore() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyHighestScore) ?? 0;
  }

  /// Reset all stored data (useful for demonstration and testing)
  Future<void> clearAllData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyQuizResults);
    await prefs.remove(_keyHighestScore);
    await prefs.remove(_keyCustomQuestions);
  }
}
