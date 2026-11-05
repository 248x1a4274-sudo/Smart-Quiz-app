import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quiz_provider.dart';
import '../providers/score_provider.dart';
import '../widgets/question_card.dart';
import '../widgets/custom_button.dart';
import 'result_screen.dart';

/// Screen 3: Interactive Quiz Screen with timer, question progress, answer locking, and exit dialog.
class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  Future<bool> _showExitConfirmation(BuildContext context) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Exit Ongoing Quiz?'),
        content: const Text(
          'Your quiz progress and current score for this session will be discarded if you leave now.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Keep Playing'),
          ),
          FilledButton.tonal(
            onPressed: () => Navigator.pop(ctx, true),
            style: FilledButton.styleFrom(
              foregroundColor: Theme.of(ctx).colorScheme.error,
            ),
            child: const Text('Exit Quiz'),
          ),
        ],
      ),
    );

    return result ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final quizProvider = context.watch<QuizProvider>();

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final shouldExit = await _showExitConfirmation(context);
        if (shouldExit && context.mounted) {
          quizProvider.cancelQuiz();
          Navigator.pop(context);
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(quizProvider.activeCategory?.name ?? 'Quiz'),
          leading: IconButton(
            icon: const Icon(Icons.close_rounded),
            tooltip: 'Exit Quiz',
            onPressed: () async {
              final shouldExit = await _showExitConfirmation(context);
              if (shouldExit && context.mounted) {
                quizProvider.cancelQuiz();
                Navigator.pop(context);
              }
            },
          ),
          actions: [
            // Score pill in top bar
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.star_rounded,
                        size: 16,
                        color: theme.colorScheme.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Score: ${quizProvider.score}',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onPrimaryContainer,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        body: SafeArea(
          child: _buildBody(context, quizProvider),
        ),
      ),
    );
  }

  Widget _buildBody(BuildContext context, QuizProvider quiz) {
    final theme = Theme.of(context);

    // 1. Loading state
    if (quiz.isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            Text(
              'Fetching Questions from Public API...',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      );
    }

    // 2. Error state
    if (quiz.errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline_rounded, size: 48, color: theme.colorScheme.error),
              const SizedBox(height: 16),
              Text(
                'Oops! Something went wrong',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                quiz.errorMessage!,
                textAlign: TextAlign.center,
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
              const SizedBox(height: 20),
              FilledButton(
                onPressed: () {
                  if (quiz.activeCategory != null) {
                    quiz.startQuiz(category: quiz.activeCategory!);
                  }
                },
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      );
    }

    final question = quiz.currentQuestion;
    if (question == null) {
      return const Center(child: Text('No question available.'));
    }

    final progressRatio = (quiz.currentIndex + 1) / quiz.totalQuestions;
    final isTimerLow = quiz.remainingSeconds <= 5;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Question header & Timer bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Question ${quiz.currentIndex + 1} of ${quiz.totalQuestions}',
                style: theme.textTheme.labelLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              // Timer indicator
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isTimerLow
                      ? const Color(0xFFFFEBEE)
                      : theme.colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isTimerLow ? Colors.red.shade400 : Colors.transparent,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.timer_outlined,
                      size: 16,
                      color: isTimerLow ? Colors.red.shade700 : theme.colorScheme.primary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${quiz.remainingSeconds}s',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                        color: isTimerLow ? Colors.red.shade700 : theme.colorScheme.onSurface,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 10),

          // Linear Progress Indicator
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progressRatio,
              minHeight: 8,
              backgroundColor: theme.colorScheme.surfaceContainerHighest,
              valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
            ),
          ),

          const SizedBox(height: 20),

          // Question Card with options
          QuestionCard(
            question: question,
            selectedOptionIndex: quiz.selectedAnswerIndex,
            isSubmitted: quiz.isAnswerSubmitted,
            onOptionSelected: (idx) {
              quiz.selectOption(idx);
            },
          ),

          const SizedBox(height: 24),

          // Action button: Submit Answer or Next Question
          if (!quiz.isAnswerSubmitted) ...[
            CustomButton(
              text: 'Confirm Answer',
              icon: Icons.check_rounded,
              onPressed: quiz.selectedAnswerIndex != null
                  ? () {
                      quiz.submitAnswer();
                    }
                  : null,
            ),
          ] else ...[
            CustomButton(
              text: quiz.isLastQuestion ? 'View Results' : 'Next Question',
              icon: quiz.isLastQuestion ? Icons.workspace_premium_rounded : Icons.arrow_forward_rounded,
              onPressed: () {
                final hasMore = quiz.nextQuestion();
                if (!hasMore) {
                  // Finish quiz and record score
                  final result = quiz.buildQuizResult();
                  context.read<ScoreProvider>().recordQuizResult(result);

                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => ResultScreen(result: result),
                    ),
                  );
                }
              },
            ),
          ],
        ],
      ),
    );
  }
}
