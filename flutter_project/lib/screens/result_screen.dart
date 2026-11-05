import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/quiz_result.dart';
import '../models/category.dart';
import '../providers/quiz_provider.dart';
import '../providers/question_provider.dart';
import '../widgets/custom_button.dart';
import 'categories_screen.dart';
import 'quiz_screen.dart';

/// Screen 4: Results Screen with score percentage, breakdown, analysis, and Play Again / Home buttons.
class ResultScreen extends StatelessWidget {
  final QuizResult result;

  const ResultScreen({super.key, required this.result});

  String _getPerformanceMessage(double percentage) {
    if (percentage >= 90) return 'Mastermind! Outstanding Knowledge!';
    if (percentage >= 70) return 'Great Job! Solid Understanding!';
    if (percentage >= 50) return 'Good Effort! Keep Practicing!';
    return 'Don’t Give Up! Review and Try Again!';
  }

  Color _getScoreColor(double percentage) {
    if (percentage >= 80) return const Color(0xFF2E7D32); // Green
    if (percentage >= 60) return const Color(0xFFF57C00); // Amber
    return const Color(0xFFC62828); // Red
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scoreColor = _getScoreColor(result.percentage);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz Results'),
        automaticallyImplyLeading: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            children: [
              // Circular / Hero Score Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 20),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: theme.colorScheme.outlineVariant.withAlpha(70)),
                ),
                child: Column(
                  children: [
                    // Circular score percentage
                    Container(
                      width: 130,
                      height: 130,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: scoreColor.withAlpha(50), width: 8),
                      ),
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '${result.percentage.round()}%',
                              style: theme.textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                                color: scoreColor,
                              ),
                            ),
                            Text(
                              'Score',
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: theme.colorScheme.outline,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Performance feedback title
                    Text(
                      _getPerformanceMessage(result.percentage),
                      textAlign: TextAlign.center,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const SizedBox(height: 6),

                    Text(
                      'Category: ${result.categoryName}',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Summary metric tiles (Total, Correct, Incorrect, Time)
              Row(
                children: [
                  Expanded(
                    child: _buildMetricTile(
                      context,
                      label: 'Correct',
                      value: '${result.correctAnswers}',
                      icon: Icons.check_circle_rounded,
                      color: const Color(0xFF2E7D32),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      context,
                      label: 'Incorrect',
                      value: '${result.incorrectAnswers}',
                      icon: Icons.cancel_rounded,
                      color: const Color(0xFFC62828),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricTile(
                      context,
                      label: 'Total Qs',
                      value: '${result.totalQuestions}',
                      icon: Icons.help_outline_rounded,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Question Breakdown Expansion
              ExpansionTile(
                initiallyExpanded: false,
                tilePadding: const EdgeInsets.symmetric(horizontal: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: theme.colorScheme.outlineVariant.withAlpha(80)),
                ),
                collapsedShape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: theme.colorScheme.outlineVariant.withAlpha(80)),
                ),
                title: Text(
                  'Review Detailed Answers (${result.answers.length})',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                ),
                children: [
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: result.answers.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, idx) {
                      final ans = result.answers[idx];
                      return ListTile(
                        leading: CircleAvatar(
                          radius: 14,
                          backgroundColor: ans.isCorrect
                              ? const Color(0xFFE8F5E9)
                              : const Color(0xFFFFEBEE),
                          child: Icon(
                            ans.isCorrect ? Icons.check : Icons.close,
                            size: 16,
                            color: ans.isCorrect
                                ? const Color(0xFF2E7D32)
                                : const Color(0xFFC62828),
                          ),
                        ),
                        title: Text(
                          ans.questionText,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4.0),
                          child: Text(
                            'Your answer: ${ans.selectedIndex >= 0 && ans.selectedIndex < ans.options.length ? ans.options[ans.selectedIndex] : "None (Timed Out)"}\n'
                            'Correct answer: ${ans.options[ans.correctIndex]}',
                            style: TextStyle(
                              fontSize: 12,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),

              const SizedBox(height: 32),

              // Action Buttons: Play Again & Back to Home
              CustomButton(
                text: 'Play Again',
                icon: Icons.replay_rounded,
                onPressed: () {
                  final activeCategory = CategoriesScreen.allCategories.firstWhere(
                    (c) => c.id == result.categoryId,
                    orElse: () => CategoriesScreen.allCategories.first,
                  );

                  final customQs = context.read<QuestionProvider>().customQuestions;
                  context.read<QuizProvider>().startQuiz(
                    category: activeCategory,
                    customQuestions: customQs,
                  );

                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(builder: (_) => const QuizScreen()),
                  );
                },
              ),

              const SizedBox(height: 12),

              CustomButton(
                text: 'Back to Home',
                isSecondary: true,
                icon: Icons.home_rounded,
                onPressed: () {
                  Navigator.popUntil(context, (route) => route.isFirst);
                },
              ),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricTile(
    BuildContext context, {
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.colorScheme.outlineVariant.withAlpha(70)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 6),
          Text(
            value,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onSurface,
            ),
          ),
          Text(
            label,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.outline,
            ),
          ),
        ],
      ),
    );
  }
}
