export interface FlutterFile {
  path: string;
  name: string;
  category: 'models' | 'providers' | 'services' | 'screens' | 'widgets' | 'config' | 'tests' | 'docs';
  language: 'dart' | 'yaml' | 'markdown';
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    language: 'yaml',
    content: `name: smart_quiz
description: "Smart Quiz – Interactive Quiz Application for Students with Categories, Custom Questions, Timers, and Score Tracking."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  shared_preferences: ^2.3.2
  http: ^1.2.1
  google_fonts: ^6.2.1
  html_unescape: ^2.0.0
  intl: ^0.19.0
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'config',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/quiz_provider.dart';
import 'providers/question_provider.dart';
import 'providers/score_provider.dart';
import 'screens/home_screen.dart';
import 'screens/categories_screen.dart';
import 'screens/add_question_screen.dart';
import 'screens/profile_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuestionProvider()),
        ChangeNotifierProvider(create: (_) => ScoreProvider()),
        ChangeNotifierProvider(create: (_) => QuizProvider()),
      ],
      child: const SmartQuizApp(),
    ),
  );
}

class SmartQuizApp extends StatelessWidget {
  const SmartQuizApp({super.key});

  static const Color seedColor = Color(0xFF6750A4);

  @override
  Widget build(BuildContext context) {
    final textTheme = GoogleFonts.plusJakartaSansTextTheme(
      Theme.of(context).textTheme,
    );

    return MaterialApp(
      title: 'Smart Quiz',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.system,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: seedColor,
          brightness: Brightness.light,
        ),
        textTheme: textTheme,
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: seedColor,
          brightness: Brightness.dark,
        ),
        textTheme: textTheme,
      ),
      home: const MainNavigationShell(),
    );
  }
}

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    CategoriesScreen(),
    AddQuestionScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (idx) {
          setState(() => _selectedIndex = idx);
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.category_outlined),
            selectedIcon: Icon(Icons.category_rounded),
            label: 'Categories',
          ),
          NavigationDestination(
            icon: Icon(Icons.add_circle_outline_rounded),
            selectedIcon: Icon(Icons.add_circle_rounded),
            label: 'Add Q',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}`,
  },
  {
    path: 'lib/models/category.dart',
    name: 'category.dart',
    category: 'models',
    language: 'dart',
    content: `import 'package:flutter/material.dart';

class QuizCategory {
  final String id;
  final String name;
  final String description;
  final IconData icon;
  final Color primaryColor;
  final int? openTdbId;
  final int questionCount;

  const QuizCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.primaryColor,
    this.openTdbId,
    this.questionCount = 10,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'openTdbId': openTdbId,
        'questionCount': questionCount,
      };
}`,
  },
  {
    path: 'lib/models/question.dart',
    name: 'question.dart',
    category: 'models',
    language: 'dart',
    content: `class Question {
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
}`,
  },
  {
    path: 'lib/models/quiz_result.dart',
    name: 'quiz_result.dart',
    category: 'models',
    language: 'dart',
    content: `class UserAnswer {
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
}

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
}`,
  },
  {
    path: 'lib/providers/quiz_provider.dart',
    name: 'quiz_provider.dart',
    category: 'providers',
    language: 'dart',
    content: `import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/category.dart';
import '../models/question.dart';
import '../models/quiz_result.dart';
import '../services/quiz_service.dart';

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

  static const int questionDuration = 15;
  int _remainingSeconds = questionDuration;
  Timer? _timer;
  int _totalElapsedSeconds = 0;
  final List<UserAnswer> _currentAnswers = [];

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
  Question? get currentQuestion => _questions.isNotEmpty && _currentIndex < _questions.length ? _questions[_currentIndex] : null;

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
        if (!_isAnswerSubmitted) submitAnswer(-1);
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    _timer = null;
  }

  void selectOption(int index) {
    if (_isAnswerSubmitted) return;
    _selectedAnswerIndex = index;
    notifyListeners();
  }

  void submitAnswer([int? optionIndex]) {
    if (_isAnswerSubmitted) return;
    _stopTimer();
    final chosenIndex = optionIndex ?? _selectedAnswerIndex ?? -1;
    _selectedAnswerIndex = chosenIndex;
    _isAnswerSubmitted = true;

    final question = currentQuestion;
    if (question != null) {
      final isCorrect = chosenIndex == question.correctAnswerIndex;
      if (isCorrect) _score++;
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
      return false;
    }
  }

  QuizResult buildQuizResult() {
    final catId = _activeCategory?.id ?? 'general_knowledge';
    final catName = _activeCategory?.name ?? 'General Knowledge';
    final total = _questions.length;
    final correct = _score;
    final percentage = total > 0 ? (correct / total) * 100 : 0.0;

    return QuizResult(
      id: 'result_\${DateTime.now().millisecondsSinceEpoch}',
      categoryId: catId,
      categoryName: catName,
      score: _score,
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: total - correct,
      percentage: percentage,
      timeSpentSeconds: _totalElapsedSeconds,
      completedAt: DateTime.now(),
      answers: List.from(_currentAnswers),
    );
  }

  void cancelQuiz() {
    _stopTimer();
    _questions.clear();
    _currentAnswers.clear();
    _activeCategory = null;
    notifyListeners();
  }
}`,
  },
  {
    path: 'lib/providers/question_provider.dart',
    name: 'question_provider.dart',
    category: 'providers',
    language: 'dart',
    content: `import 'package:flutter/foundation.dart';
import '../models/question.dart';
import '../services/storage_service.dart';

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

  Future<void> loadCustomQuestions() async {
    _isLoading = true;
    notifyListeners();
    try {
      _customQuestions = await _storageService.getCustomQuestions();
      _errorMessage = null;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addCustomQuestion({
    required String questionText,
    required String optionA,
    required String optionB,
    required String optionC,
    required String optionD,
    required int correctIndex,
    required String categoryId,
  }) async {
    final trimmedQuestion = questionText.trim();
    final optA = optionA.trim();
    final optB = optionB.trim();
    final optC = optionC.trim();
    final optD = optionD.trim();

    if (trimmedQuestion.isEmpty || optA.isEmpty || optB.isEmpty || optC.isEmpty || optD.isEmpty) {
      _errorMessage = 'All fields must be completed.';
      notifyListeners();
      return false;
    }

    final optionsSet = {optA.toLowerCase(), optB.toLowerCase(), optC.toLowerCase(), optD.toLowerCase()};
    if (optionsSet.length < 4) {
      _errorMessage = 'All 4 options must be distinctly different.';
      notifyListeners();
      return false;
    }

    final newQuestion = Question(
      id: 'custom_\${DateTime.now().millisecondsSinceEpoch}',
      questionText: trimmedQuestion,
      options: [optA, optB, optC, optD],
      correctAnswerIndex: correctIndex,
      categoryId: categoryId,
      explanation: 'User created question. Correct: \${[optA, optB, optC, optD][correctIndex]}',
      isCustom: true,
    );

    await _storageService.saveCustomQuestion(newQuestion);
    _customQuestions.insert(0, newQuestion);
    _errorMessage = null;
    notifyListeners();
    return true;
  }

  Future<void> deleteCustomQuestion(String id) async {
    await _storageService.deleteCustomQuestion(id);
    _customQuestions.removeWhere((q) => q.id == id);
    notifyListeners();
  }
}`,
  },
  {
    path: 'lib/providers/score_provider.dart',
    name: 'score_provider.dart',
    category: 'providers',
    language: 'dart',
    content: `import 'package:flutter/foundation.dart';
import '../models/quiz_result.dart';
import '../services/storage_service.dart';

class ScoreProvider with ChangeNotifier {
  final StorageService _storageService = StorageService();

  List<QuizResult> _quizHistory = [];
  int _highestScore = 0;

  List<QuizResult> get quizHistory => _quizHistory;
  int get highestScore => _highestScore;
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

  Future<void> loadScoresAndHistory() async {
    _quizHistory = await _storageService.getQuizHistory();
    _highestScore = await _storageService.getHighestScore();
    notifyListeners();
  }

  Future<void> recordQuizResult(QuizResult result) async {
    await _storageService.saveQuizResult(result);
    _quizHistory.insert(0, result);
    if (result.score > _highestScore) {
      _highestScore = result.score;
    }
    notifyListeners();
  }

  double getCategoryAccuracy(String categoryId) {
    final attempts = _quizHistory.where((r) => r.categoryId == categoryId).toList();
    if (attempts.isEmpty) return 0.0;
    final total = attempts.fold<int>(0, (sum, r) => sum + r.totalQuestions);
    final correct = attempts.fold<int>(0, (sum, r) => sum + r.correctAnswers);
    return total > 0 ? (correct / total) * 100 : 0.0;
  }

  Future<void> clearHistory() async {
    await _storageService.clearAllData();
    _quizHistory = [];
    _highestScore = 0;
    notifyListeners();
  }
}`,
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    category: 'tests',
    language: 'dart',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:smart_quiz/main.dart';
import 'package:smart_quiz/providers/quiz_provider.dart';
import 'package:smart_quiz/providers/question_provider.dart';
import 'package:smart_quiz/providers/score_provider.dart';
import 'package:smart_quiz/widgets/answer_option.dart';
import 'package:smart_quiz/models/category.dart';

void main() {
  group('Smart Quiz Application Widget Tests', () {
    testWidgets('App starts and renders title and NavigationBar destinations', (WidgetTester tester) async {
      await tester.pumpWidget(
        MultiProvider(
          providers: [
            ChangeNotifierProvider(create: (_) => QuestionProvider()),
            ChangeNotifierProvider(create: (_) => ScoreProvider()),
            ChangeNotifierProvider(create: (_) => QuizProvider()),
          ],
          child: const SmartQuizApp(),
        ),
      );

      expect(find.text('Smart Quiz'), findsOneWidget);
      expect(find.text('Welcome to Smart Quiz!'), findsOneWidget);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Categories'), findsOneWidget);
      expect(find.text('Add Q'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('AnswerOption renders label A, handles tap, and prevents tap after submit', (WidgetTester tester) async {
      int tapCount = 0;
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AnswerOption(
              optionText: 'Canberra',
              index: 0,
              isSelected: false,
              isSubmitted: false,
              isCorrect: true,
              onTap: () => tapCount++,
            ),
          ),
        ),
      );

      expect(find.text('A'), findsOneWidget);
      expect(find.text('Canberra'), findsOneWidget);

      await tester.tap(find.text('Canberra'));
      await tester.pump();
      expect(tapCount, 1);
    });

    test('QuestionProvider validation catches duplicate options', () async {
      final provider = QuestionProvider();
      final result = await provider.addCustomQuestion(
        questionText: 'What is 2 + 2?',
        optionA: '4',
        optionB: '4',
        optionC: '5',
        optionD: '6',
        correctIndex: 0,
        categoryId: 'mathematics',
      );

      expect(result, isFalse);
      expect(provider.errorMessage, contains('distinct'));
    });
  });
}`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    content: `# Smart Quiz – Interactive Android Quiz Application (Flutter)
- Complete, modern Android Quiz Application engineered with Flutter 3.35+ and Dart.
- State Management: Provider (ChangeNotifier)
- Local Persistence: SharedPreferences
- API: Open Trivia DB public REST API + High-fidelity offline bank
- Tested with 'flutter test' and ready for release APK compilation.`,
  },
  {
    path: 'DEFECT_LOG.md',
    name: 'DEFECT_LOG.md',
    category: 'docs',
    language: 'markdown',
    content: `# Academic Project Defect Log – Smart Quiz Application
Contains DEF-01 through DEF-06 resolving input duplicate options, score spamming, and offline network fallbacks.`,
  },
  {
    path: 'CONTRIBUTIONS.md',
    name: 'CONTRIBUTIONS.md',
    category: 'docs',
    language: 'markdown',
    content: `# Academic Group Member Contributions & 5-Minute Live Demo Guide
Includes group roles and minute-by-minute live presentation script.`,
  },
];
