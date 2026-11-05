import 'dart:convert';
import 'dart:math';
import 'package:http/http.dart' as http;
import 'package:html_unescape/html_unescape.dart';
import '../models/question.dart';

/// Service responsible for fetching quiz questions from public OpenTDB API or offline bank.
class QuizService {
  final HtmlUnescape _unescape = HtmlUnescape();

  /// Map internal category IDs to Open Trivia DB category IDs
  static const Map<String, int> categoryApiMap = {
    'general_knowledge': 9,
    'science': 17,
    'mathematics': 19,
    'computer_science': 18,
    'programming': 18,
    'history': 23,
    'sports': 21,
  };

  /// Fetch questions for a category, blending in user's custom questions
  Future<List<Question>> fetchQuestions({
    required String categoryId,
    int amount = 5,
    List<Question> customQuestions = const [],
  }) async {
    // Filter matching custom questions
    final matchingCustom = customQuestions.where((q) => q.categoryId == categoryId).toList();

    if (categoryId == 'custom') {
      if (customQuestions.isEmpty) {
        return _getDemoCustomQuestions();
      }
      final shuffled = List<Question>.from(customQuestions)..shuffle(Random());
      return shuffled.take(amount).toList();
    }

    // Try fetching from Open Trivia DB
    final apiCatId = categoryApiMap[categoryId];
    if (apiCatId != null) {
      try {
        final uri = Uri.parse(
          'https://opentdb.com/api.php?amount=$amount&category=$apiCatId&type=multiple',
        );
        final response = await http.get(uri).timeout(const Duration(seconds: 4));

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          if (data['response_code'] == 0 && data['results'] != null) {
            final List results = data['results'];
            final List<Question> apiQuestions = [];

            for (var i = 0; i < results.length; i++) {
              final raw = results[i];
              final rawCorrect = _unescape.convert(raw['correct_answer'] as String);
              final List<String> rawOptions = [
                rawCorrect,
                ...(raw['incorrect_answers'] as List).map((e) => _unescape.convert(e as String)),
              ];

              // Shuffle options
              final shuffledOptions = List<String>.from(rawOptions)..shuffle(Random());
              final correctIndex = shuffledOptions.indexOf(rawCorrect);

              apiQuestions.add(
                Question(
                  id: 'api_${categoryId}_${DateTime.now().millisecondsSinceEpoch}_$i',
                  questionText: _unescape.convert(raw['question'] as String),
                  options: shuffledOptions,
                  correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
                  categoryId: categoryId,
                  difficulty: raw['difficulty'] as String?,
                  explanation: 'Correct answer: $rawCorrect',
                ),
              );
            }

            final combined = [...matchingCustom, ...apiQuestions]..shuffle(Random());
            return combined.take(amount).toList();
          }
        }
      } catch (_) {
        // Fallback to offline bank on network failure or rate limit
      }
    }

    // Fallback question bank
    final bank = _offlineQuestionBank[categoryId] ?? _offlineQuestionBank['general_knowledge']!;
    final combined = [...matchingCustom, ...bank]..shuffle(Random());
    return combined.take(amount).toList();
  }

  List<Question> _getDemoCustomQuestions() {
    return [
      const Question(
        id: 'custom_1',
        questionText: 'Which Flutter widget allows you to listen to changes in ChangeNotifier?',
        options: ['StatefulBuilder', 'Consumer', 'InheritedWidget', 'FutureBuilder'],
        correctAnswerIndex: 1,
        categoryId: 'custom',
        explanation: 'Consumer<T> rebuilds only the descendant subtree when T notifies listeners.',
        isCustom: true,
      ),
      const Question(
        id: 'custom_2',
        questionText: 'What parameter enables Material Design 3 in Flutter’s ThemeData?',
        options: ['useMaterial3: true', 'material3: true', 'version: 3', 'designSystem: Material3'],
        correctAnswerIndex: 0,
        categoryId: 'custom',
        explanation: 'ThemeData(useMaterial3: true) activates Material 3 specifications.',
        isCustom: true,
      ),
    ];
  }

  static const Map<String, List<Question>> _offlineQuestionBank = {
    'general_knowledge': [
      Question(
        id: 'gk_1',
        questionText: 'Which planet in our solar system is known as the "Red Planet"?',
        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswerIndex: 1,
        categoryId: 'general_knowledge',
        explanation: 'Mars is known as the Red Planet due to iron oxide on its surface.',
      ),
      Question(
        id: 'gk_2',
        questionText: 'What is the capital city of Australia?',
        options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctAnswerIndex: 2,
        categoryId: 'general_knowledge',
        explanation: 'Canberra was chosen as Australia’s capital in 1908.',
      ),
      Question(
        id: 'gk_3',
        questionText: 'Which ocean is the largest on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswerIndex: 3,
        categoryId: 'general_knowledge',
        explanation: 'The Pacific Ocean covers over 30% of Earth’s surface.',
      ),
      Question(
        id: 'gk_4',
        questionText: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
        correctAnswerIndex: 1,
        categoryId: 'general_knowledge',
        explanation: 'Leonardo da Vinci painted the Mona Lisa in Florence in the early 16th century.',
      ),
      Question(
        id: 'gk_5',
        questionText: 'What is the chemical symbol for Gold?',
        options: ['Ag', 'Au', 'Fe', 'Pb'],
        correctAnswerIndex: 1,
        categoryId: 'general_knowledge',
        explanation: 'Au comes from the Latin word aurum.',
      ),
    ],
    'science': [
      Question(
        id: 'sci_1',
        questionText: 'What is the powerhouse organelle of an animal cell?',
        options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Endoplasmic Reticulum'],
        correctAnswerIndex: 2,
        categoryId: 'science',
        explanation: 'Mitochondria generate cellular energy in the form of ATP.',
      ),
      Question(
        id: 'sci_2',
        questionText: 'What is the speed of light in a vacuum approximately?',
        options: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '1,000,000 km/s'],
        correctAnswerIndex: 0,
        categoryId: 'science',
        explanation: 'Light travels at ~299,792 km/s.',
      ),
      Question(
        id: 'sci_3',
        questionText: 'Which gas is most abundant in Earth’s atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
        correctAnswerIndex: 2,
        categoryId: 'science',
        explanation: 'Nitrogen makes up approximately 78% of dry atmospheric air.',
      ),
      Question(
        id: 'sci_4',
        questionText: 'What is the pH level of pure neutral water at 25°C?',
        options: ['5', '7', '9', '14'],
        correctAnswerIndex: 1,
        categoryId: 'science',
        explanation: 'Neutral water has a pH of 7.',
      ),
    ],
    'mathematics': [
      Question(
        id: 'math_1',
        questionText: 'What is the square root of 256?',
        options: ['14', '16', '18', '24'],
        correctAnswerIndex: 1,
        categoryId: 'mathematics',
        explanation: '16 × 16 = 256.',
      ),
      Question(
        id: 'math_2',
        questionText: 'If a triangle has angles 90° and 45°, what is the third angle?',
        options: ['35°', '45°', '55°', '90°'],
        correctAnswerIndex: 1,
        categoryId: 'mathematics',
        explanation: '180 - (90 + 45) = 45°.',
      ),
      Question(
        id: 'math_3',
        questionText: 'What is the value of Pi (π) to two decimal places?',
        options: ['3.12', '3.14', '3.16', '3.18'],
        correctAnswerIndex: 1,
        categoryId: 'mathematics',
        explanation: 'Pi is approximately 3.14159...',
      ),
    ],
    'computer_science': [
      Question(
        id: 'cs_1',
        questionText: 'What does CPU stand for?',
        options: ['Central Processing Unit', 'Central Power Unit', 'Core Processing Unit', 'Control Program Unit'],
        correctAnswerIndex: 0,
        categoryId: 'computer_science',
        explanation: 'CPU stands for Central Processing Unit.',
      ),
      Question(
        id: 'cs_2',
        questionText: 'Which data structure adheres to First-In, First-Out (FIFO)?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctAnswerIndex: 1,
        categoryId: 'computer_science',
        explanation: 'A Queue processes elements in First-In, First-Out order.',
      ),
      Question(
        id: 'cs_3',
        questionText: 'What is the time complexity of searching in a balanced Binary Search Tree?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
        correctAnswerIndex: 1,
        categoryId: 'computer_science',
        explanation: 'A balanced BST provides logarithmic time lookup.',
      ),
    ],
    'programming': [
      Question(
        id: 'prog_1',
        questionText: 'Which programming language is Flutter primarily written in?',
        options: ['Java', 'Kotlin', 'Dart', 'Swift'],
        correctAnswerIndex: 2,
        categoryId: 'programming',
        explanation: 'Flutter applications are built using the Dart language.',
      ),
      Question(
        id: 'prog_2',
        questionText: 'What class does Provider listen to for state changes in Flutter?',
        options: ['ChangeNotifier', 'StreamBuilder', 'BlocProvider', 'StatefulWidget'],
        correctAnswerIndex: 0,
        categoryId: 'programming',
        explanation: 'ChangeNotifier triggers notifyListeners() to notify subscribers.',
      ),
      Question(
        id: 'prog_3',
        questionText: 'Which keyword in Dart defines a runtime single-assignment variable?',
        options: ['const', 'final', 'var', 'late'],
        correctAnswerIndex: 1,
        categoryId: 'programming',
        explanation: 'A final variable cannot be reassigned once initialized.',
      ),
    ],
    'history': [
      Question(
        id: 'hist_1',
        questionText: 'In which year did the Apollo 11 moon landing take place?',
        options: ['1965', '1969', '1972', '1975'],
        correctAnswerIndex: 1,
        categoryId: 'history',
        explanation: 'Apollo 11 landed on the moon on July 20, 1969.',
      ),
      Question(
        id: 'hist_2',
        questionText: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
        correctAnswerIndex: 2,
        categoryId: 'history',
        explanation: 'George Washington served as president from 1789 to 1797.',
      ),
    ],
    'sports': [
      Question(
        id: 'sport_1',
        questionText: 'How many players are on the pitch for one soccer team?',
        options: ['9', '10', '11', '12'],
        correctAnswerIndex: 2,
        categoryId: 'sports',
        explanation: 'A soccer team consists of 11 players including the goalkeeper.',
      ),
      Question(
        id: 'sport_2',
        questionText: 'Which nation won the 2022 FIFA World Cup in Qatar?',
        options: ['France', 'Argentina', 'Brazil', 'Germany'],
        correctAnswerIndex: 1,
        categoryId: 'sports',
        explanation: 'Argentina won the 2022 World Cup after beating France.',
      ),
    ],
  };
}
