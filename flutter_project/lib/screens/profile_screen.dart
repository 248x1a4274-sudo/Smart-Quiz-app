import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/score_provider.dart';
import 'categories_screen.dart';

/// Screen 6: Profile and Score History Screen showing analytics, badges, category progress, and past attempts.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final scoreProvider = context.watch<ScoreProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile & Score History'),
        actions: [
          if (scoreProvider.totalQuizzesCompleted > 0)
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined),
              tooltip: 'Reset History',
              onPressed: () {
                _showClearHistoryDialog(context);
              },
            ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User Avatar & Title
              Row(
                children: [
                  CircleAvatar(
                    radius: 34,
                    backgroundColor: theme.colorScheme.primaryContainer,
                    child: Icon(
                      Icons.person_rounded,
                      size: 38,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Quiz Scholar',
                          style: theme.textTheme.titleLarge?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Student Profile · Level ${((scoreProvider.totalQuizzesCompleted / 2).floor() + 1)}',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // 4 Stat Metric Cards (Quizzes, Best Score, Accuracy, Total Qs)
              Row(
                children: [
                  Expanded(
                    child: _buildStatTile(
                      context,
                      label: 'Quizzes Done',
                      value: '${scoreProvider.totalQuizzesCompleted}',
                      icon: Icons.assignment_turned_in_rounded,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatTile(
                      context,
                      label: 'High Score',
                      value: '${scoreProvider.highestScore}',
                      icon: Icons.emoji_events_rounded,
                      color: Colors.amber.shade700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildStatTile(
                      context,
                      label: 'Accuracy',
                      value: '${scoreProvider.averageAccuracy.toStringAsFixed(1)}%',
                      icon: Icons.track_changes_rounded,
                      color: const Color(0xFF2E7D32),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildStatTile(
                      context,
                      label: 'Total Qs',
                      value: '${scoreProvider.totalQuestionsAnswered}',
                      icon: Icons.quiz_rounded,
                      color: const Color(0xFF00838F),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Category-wise Performance Section
              Text(
                'Category-wise Mastery',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              Card(
                elevation: 0,
                color: theme.colorScheme.surfaceContainerLow,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: theme.colorScheme.outlineVariant.withAlpha(70)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: CategoriesScreen.allCategories.map((cat) {
                      final accuracy = scoreProvider.getCategoryAccuracy(cat.id);
                      final categoryAttempts = scoreProvider.quizHistory
                          .where((r) => r.categoryId == cat.id)
                          .length;

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(cat.icon, size: 18, color: cat.primaryColor),
                                    const SizedBox(width: 8),
                                    Text(
                                      cat.name,
                                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                                    ),
                                  ],
                                ),
                                Text(
                                  categoryAttempts > 0
                                      ? '${accuracy.round()}% ($categoryAttempts played)'
                                      : 'Not played yet',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: theme.colorScheme.onSurfaceVariant,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: categoryAttempts > 0 ? (accuracy / 100) : 0.0,
                                minHeight: 6,
                                backgroundColor: theme.colorScheme.surfaceContainerHighest,
                                valueColor: AlwaysStoppedAnimation<Color>(cat.primaryColor),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // Quiz History Section
              Text(
                'Recent Quiz Attempts (${scoreProvider.quizHistory.length})',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              if (scoreProvider.quizHistory.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(28),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: theme.colorScheme.outlineVariant.withAlpha(60)),
                  ),
                  child: Center(
                    child: Text(
                      'No quiz attempts recorded yet.\nPlay a quiz to start building your score history!',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: theme.colorScheme.outline, height: 1.4),
                    ),
                  ),
                )
              else
                ...scoreProvider.quizHistory.map((result) {
                  final dateFormat = DateFormat('MMM d, yyyy · h:mm a');
                  final formattedDate = dateFormat.format(result.completedAt);

                  return Card(
                    elevation: 0,
                    margin: const EdgeInsets.only(bottom: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(color: theme.colorScheme.outlineVariant.withAlpha(60)),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      leading: CircleAvatar(
                        backgroundColor: result.percentage >= 70
                            ? const Color(0xFFE8F5E9)
                            : const Color(0xFFFFEBEE),
                        child: Text(
                          '${result.percentage.round()}%',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: result.percentage >= 70
                                ? const Color(0xFF2E7D32)
                                : const Color(0xFFC62828),
                          ),
                        ),
                      ),
                      title: Text(
                        result.categoryName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      subtitle: Text(
                        'Score: ${result.score}/${result.totalQuestions} · $formattedDate',
                        style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurfaceVariant),
                      ),
                      trailing: Text(
                        '${result.correctAnswers}✓ ${result.incorrectAnswers}✗',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                    ),
                  );
                }),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatTile(
    BuildContext context, {
    required String label,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.colorScheme.outlineVariant.withAlpha(70)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withAlpha(25),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  value,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  label,
                  style: theme.textTheme.labelSmall?.copyWith(color: theme.colorScheme.outline),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showClearHistoryDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reset Quiz History?'),
        content: const Text(
          'This will remove all recorded past attempts and highest score records from local storage.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton.tonal(
            onPressed: () {
              context.read<ScoreProvider>().clearHistory();
              Navigator.pop(ctx);
            },
            child: const Text('Clear History'),
          ),
        ],
      ),
    );
  }
}
