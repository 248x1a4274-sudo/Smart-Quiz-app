/// Represents a multiple-choice quiz question with 4 options.
class Question {
  final String id;
  final String questionText;
  final List<String> options;
  final int correctAnswerIndex;
  final String categoryId;
  final String? difficulty;
  final String? explanation;
  final bool isCustom;

  const Question({
    required this.id,
    required this.questionText,
    required this.options,
    required this.correctAnswerIndex,
    required this.categoryId,
    this.difficulty,
    this.explanation,
    this.isCustom = false,
  });

  /// Factory constructor to deserialize from JSON (e.g. SharedPreferences)
  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['id'] as String,
      questionText: json['questionText'] as String,
      options: List<String>.from(json['options'] as List),
      correctAnswerIndex: json['correctAnswerIndex'] as int,
      categoryId: json['categoryId'] as String,
      difficulty: json['difficulty'] as String?,
      explanation: json['explanation'] as String?,
      isCustom: json['isCustom'] as bool? ?? false,
    );
  }

  /// Serialize to JSON
  Map<String, dynamic> toJson() => {
        'id': id,
        'questionText': questionText,
        'options': options,
        'correctAnswerIndex': correctAnswerIndex,
        'categoryId': categoryId,
        'difficulty': difficulty,
        'explanation': explanation,
        'isCustom': isCustom,
      };

  /// Return copy with updated fields
  Question copyWith({
    String? id,
    String? questionText,
    List<String>? options,
    int? correctAnswerIndex,
    String? categoryId,
    String? difficulty,
    String? explanation,
    bool? isCustom,
  }) {
    return Question(
      id: id ?? this.id,
      questionText: questionText ?? this.questionText,
      options: options ?? this.options,
      correctAnswerIndex: correctAnswerIndex ?? this.correctAnswerIndex,
      categoryId: categoryId ?? this.categoryId,
      difficulty: difficulty ?? this.difficulty,
      explanation: explanation ?? this.explanation,
      isCustom: isCustom ?? this.isCustom,
    );
  }
}
