/// Represents a recorded answer attempt for a single question.
class UserAnswer {
  final String questionId;
  final String questionText;
  final int selectedIndex;
  final int correctIndex;
  final bool isCorrect;
  final List<String> options;

  const UserAnswer({
    required this.questionId,
    required this.questionText,
    required this.selectedIndex,
    required this.correctIndex,
    required this.isCorrect,
    required this.options,
  });

  Map<String, dynamic> toJson() => {
        'questionId': questionId,
        'questionText': questionText,
        'selectedIndex': selectedIndex,
        'correctIndex': correctIndex,
        'isCorrect': isCorrect,
        'options': options,
      };

  factory UserAnswer.fromJson(Map<String, dynamic> json) {
    return UserAnswer(
      questionId: json['questionId'] as String,
      questionText: json['questionText'] as String,
      selectedIndex: json['selectedIndex'] as int,
      correctIndex: json['correctIndex'] as int,
      isCorrect: json['isCorrect'] as bool,
      options: List<String>.from(json['options'] as List),
    );
  }
}

/// Represents the completed result of a full quiz session.
class QuizResult {
  final String id;
  final String categoryId;
  final String categoryName;
  final int score;
  final int totalQuestions;
  final int correctAnswers;
  final int incorrectAnswers;
  final double percentage;
  final int timeSpentSeconds;
  final DateTime completedAt;
  final List<UserAnswer> answers;

  const QuizResult({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.score,
    required this.totalQuestions,
    required this.correctAnswers,
    required this.incorrectAnswers,
    required this.percentage,
    required this.timeSpentSeconds,
    required this.completedAt,
    required this.answers,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'categoryId': categoryId,
        'categoryName': categoryName,
        'score': score,
        'totalQuestions': totalQuestions,
        'correctAnswers': correctAnswers,
        'incorrectAnswers': incorrectAnswers,
        'percentage': percentage,
        'timeSpentSeconds': timeSpentSeconds,
        'completedAt': completedAt.toIso8601String(),
        'answers': answers.map((a) => a.toJson()).toList(),
      };

  factory QuizResult.fromJson(Map<String, dynamic> json) {
    return QuizResult(
      id: json['id'] as String,
      categoryId: json['categoryId'] as String,
      categoryName: json['categoryName'] as String,
      score: json['score'] as int,
      totalQuestions: json['totalQuestions'] as int,
      correctAnswers: json['correctAnswers'] as int,
      incorrectAnswers: json['incorrectAnswers'] as int,
      percentage: (json['percentage'] as num).toDouble(),
      timeSpentSeconds: json['timeSpentSeconds'] as int? ?? 0,
      completedAt: DateTime.parse(json['completedAt'] as String),
      answers: (json['answers'] as List?)
              ?.map((a) => UserAnswer.fromJson(a as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
