import 'package:flutter/foundation.dart';
import '../models/question.dart';
import '../services/storage_service.dart';

/// Provider for managing custom question creation, validation, and storage.
class QuestionProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();

  List<Question> _customQuestions = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<Question> get customQuestions => _customQuestions;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  QuestionProvider() {
    loadCustomQuestions();
  }

  /// Load custom questions from local storage
  Future<void> loadCustomQuestions() async {
    _isLoading = true;
    notifyListeners();

    try {
      _customQuestions = await _storageService.getCustomQuestions();
      _errorMessage = null;
    } catch (e) {
      _errorMessage = 'Failed to load custom questions: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Validate inputs and add a new custom question
  Future<bool> addCustomQuestion({
    required String questionText,
    required String optionA,
    required String optionB,
    required String optionC,
    required String optionD,
    required int correctIndex,
    required String categoryId,
  }) async {
    // Validation checks
    final trimmedQuestion = questionText.trim();
    final optA = optionA.trim();
    final optB = optionB.trim();
    final optC = optionC.trim();
    final optD = optionD.trim();

    if (trimmedQuestion.isEmpty) {
      _errorMessage = 'Question text cannot be empty.';
      notifyListeners();
      return false;
    }

    if (optA.isEmpty || optB.isEmpty || optC.isEmpty || optD.isEmpty) {
      _errorMessage = 'All four options must be provided.';
      notifyListeners();
      return false;
    }

    final optionsSet = {optA.toLowerCase(), optB.toLowerCase(), optC.toLowerCase(), optD.toLowerCase()};
    if (optionsSet.length < 4) {
      _errorMessage = 'All 4 options must be distinctly different.';
      notifyListeners();
      return false;
    }

    if (correctIndex < 0 || correctIndex > 3) {
      _errorMessage = 'Please choose a valid correct answer option.';
      notifyListeners();
      return false;
    }

    final newQuestion = Question(
      id: 'custom_${DateTime.now().millisecondsSinceEpoch}',
      questionText: trimmedQuestion,
      options: [optA, optB, optC, optD],
      correctAnswerIndex: correctIndex,
      categoryId: categoryId,
      explanation: 'User created custom question. Correct: ${[optA, optB, optC, optD][correctIndex]}',
      isCustom: true,
    );

    await _storageService.saveCustomQuestion(newQuestion);
    _customQuestions.insert(0, newQuestion);
    _errorMessage = null;
    notifyListeners();
    return true;
  }

  /// Delete a custom question by id
  Future<void> deleteCustomQuestion(String id) async {
    await _storageService.deleteCustomQuestion(id);
    _customQuestions.removeWhere((q) => q.id == id);
    notifyListeners();
  }
}
