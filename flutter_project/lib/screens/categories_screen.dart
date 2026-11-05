import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/category.dart';
import '../providers/quiz_provider.dart';
import '../providers/question_provider.dart';
import '../widgets/category_card.dart';
import 'quiz_screen.dart';

/// Screen 2: Quiz Categories Screen listing all 7 categories + Custom questions.
class CategoriesScreen extends StatelessWidget {
  const CategoriesScreen({super.key});

  static const List<QuizCategory> allCategories = [
    QuizCategory(
      id: 'general_knowledge',
      name: 'General Knowledge',
      description: 'Current affairs, world culture, geography, and trivia',
      icon: Icons.public_rounded,
      primaryColor: Color(0xFF3F51B5),
      openTdbId: 9,
      questionCount: 25,
    ),
    QuizCategory(
      id: 'science',
      name: 'Science & Nature',
      description: 'Physics, chemistry, biology, astronomy, and nature',
      icon: Icons.science_rounded,
      primaryColor: Color(0xFF2E7D32),
      openTdbId: 17,
      questionCount: 20,
    ),
    QuizCategory(
      id: 'mathematics',
      name: 'Mathematics',
      description: 'Arithmetic, algebra, geometry, logic, and puzzles',
      icon: Icons.calculate_rounded,
      primaryColor: Color(0xFFE65100),
      openTdbId: 19,
      questionCount: 18,
    ),
    QuizCategory(
      id: 'computer_science',
      name: 'Computer Science',
      description: 'Hardware, operating systems, networking, and theory',
      icon: Icons.memory_rounded,
      primaryColor: Color(0xFF6A1B9A),
      openTdbId: 18,
      questionCount: 22,
    ),
    QuizCategory(
      id: 'programming',
      name: 'Programming & Tech',
      description: 'Dart, Flutter, Python, JavaScript, and architecture',
      icon: Icons.code_rounded,
      primaryColor: Color(0xFF00838F),
      openTdbId: 18,
      questionCount: 25,
    ),
    QuizCategory(
      id: 'history',
      name: 'History',
      description: 'Ancient civilizations, world wars, and milestones',
      icon: Icons.account_balance_rounded,
      primaryColor: Color(0xFFC2185B),
      openTdbId: 23,
      questionCount: 20,
    ),
    QuizCategory(
      id: 'sports',
      name: 'Sports',
      description: 'Olympics, football, cricket, tennis, and athletics',
      icon: Icons.emoji_events_rounded,
      primaryColor: Color(0xFF1565C0),
      openTdbId: 21,
      questionCount: 20,
    ),
    QuizCategory(
      id: 'custom',
      name: 'Custom Questions',
      description: 'Student-created questions saved on this device',
      icon: Icons.edit_note_rounded,
      primaryColor: Color(0xFF7B1FA2),
      questionCount: 0,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final questionProvider = context.watch<QuestionProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Categories'),
      ),
      body: SafeArea(
        child: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          itemCount: allCategories.length,
          itemBuilder: (context, index) {
            final category = allCategories[index];
            final customCount = questionProvider.customQuestions
                .where((q) => q.categoryId == category.id || category.id == 'custom')
                .length;

            final effectiveCategory = category.id == 'custom'
                ? QuizCategory(
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    icon: category.icon,
                    primaryColor: category.primaryColor,
                    questionCount: customCount,
                  )
                : category;

            return Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: CategoryCard(
                category: effectiveCategory,
                onTap: () {
                  final quizProvider = context.read<QuizProvider>();
                  quizProvider.startQuiz(
                    category: effectiveCategory,
                    customQuestions: questionProvider.customQuestions,
                  );
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const QuizScreen()),
                  );
                },
              ),
            );
          },
        ),
      ),
    );
  }
}
