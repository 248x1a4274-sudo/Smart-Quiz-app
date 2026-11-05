import 'package:flutter/material.dart';
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

      // Verify that Smart Quiz brand is present
      expect(find.text('Smart Quiz'), findsOneWidget);
      expect(find.text('Welcome to Smart Quiz!'), findsOneWidget);

      // Verify bottom navigation destinations
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
              onTap: () {
                tapCount++;
              },
            ),
          ),
        ),
      );

      expect(find.text('A'), findsOneWidget);
      expect(find.text('Canberra'), findsOneWidget);

      // Tap on option
      await tester.tap(find.text('Canberra'));
      await tester.pump();
      expect(tapCount, 1);

      // Test submitted state: onTap should now be disabled
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AnswerOption(
              optionText: 'Canberra',
              index: 0,
              isSelected: true,
              isSubmitted: true,
              isCorrect: true,
              onTap: () {
                tapCount++;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('Canberra'));
      await tester.pump();
      // Should not increment because isSubmitted is true
      expect(tapCount, 1);
    });

    test('QuestionProvider validation catches duplicate options', () async {
      final provider = QuestionProvider();
      final result = await provider.addCustomQuestion(
        questionText: 'What is 2 + 2?',
        optionA: '4',
        optionB: '4', // Duplicate option!
        optionC: '5',
        optionD: '6',
        correctIndex: 0,
        categoryId: 'mathematics',
      );

      expect(result, isFalse);
      expect(provider.errorMessage, contains('distinct'));
    });

    test('QuizProvider calculates scores and builds result correctly', () async {
      final quiz = QuizProvider();
      const testCat = QuizCategory(
        id: 'mathematics',
        name: 'Mathematics',
        description: 'Maths quiz',
        icon: Icons.calculate,
        primaryColor: Colors.orange,
      );

      await quiz.startQuiz(category: testCat, questionCount: 2);
      expect(quiz.questions.isNotEmpty, isTrue);

      // Select and submit option
      final correctIdx = quiz.currentQuestion!.correctAnswerIndex;
      quiz.selectOption(correctIdx);
      quiz.submitAnswer();

      expect(quiz.score, 1);
      expect(quiz.isAnswerSubmitted, isTrue);

      final result = quiz.buildQuizResult();
      expect(result.score, 1);
      expect(result.categoryId, 'mathematics');
    });
  });
}
