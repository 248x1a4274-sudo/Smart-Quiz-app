import 'package:flutter/material.dart';

/// Single multiple-choice answer option with A/B/C/D indicator, selection states, and instant feedback.
class AnswerOption extends StatelessWidget {
  final String optionText;
  final int index;
  final bool isSelected;
  final bool isSubmitted;
  final bool isCorrect;
  final VoidCallback onTap;

  const AnswerOption({
    super.key,
    required this.optionText,
    required this.index,
    required this.isSelected,
    required this.isSubmitted,
    required this.isCorrect,
    required this.onTap,
  });

  static const List<String> optionLabels = ['A', 'B', 'C', 'D'];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final label = index < optionLabels.length ? optionLabels[index] : '${index + 1}';

    // State styling determination
    Color backgroundColor = theme.colorScheme.surface;
    Color borderColor = theme.colorScheme.outlineVariant.withAlpha(120);
    Color labelBgColor = theme.colorScheme.surfaceContainerHighest;
    Color labelTextColor = theme.colorScheme.onSurfaceVariant;
    Color textColor = theme.colorScheme.onSurface;
    IconData? statusIcon;
    Color? statusIconColor;

    if (isSubmitted) {
      if (isCorrect) {
        // Correct answer (green)
        backgroundColor = const Color(0xFFE8F5E9);
        borderColor = const Color(0xFF2E7D32);
        labelBgColor = const Color(0xFF2E7D32);
        labelTextColor = Colors.white;
        textColor = const Color(0xFF1B5E20);
        statusIcon = Icons.check_circle_rounded;
        statusIconColor = const Color(0xFF2E7D32);
      } else if (isSelected && !isCorrect) {
        // Wrong selected answer (red)
        backgroundColor = const Color(0xFFFFEBEE);
        borderColor = const Color(0xFFC62828);
        labelBgColor = const Color(0xFFC62828);
        labelTextColor = Colors.white;
        textColor = const Color(0xFFB71C1C);
        statusIcon = Icons.cancel_rounded;
        statusIconColor = const Color(0xFFC62828);
      } else {
        // Other non-selected wrong options
        backgroundColor = theme.colorScheme.surface.withAlpha(150);
        borderColor = theme.colorScheme.outlineVariant.withAlpha(60);
      }
    } else if (isSelected) {
      // User tapped this before submitting
      backgroundColor = theme.colorScheme.primaryContainer.withAlpha(120);
      borderColor = theme.colorScheme.primary;
      labelBgColor = theme.colorScheme.primary;
      labelTextColor = theme.colorScheme.onPrimary;
      textColor = theme.colorScheme.primary;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Material(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          onTap: isSubmitted ? null : onTap,
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              border: Border.all(color: borderColor, width: isSelected || (isSubmitted && isCorrect) ? 2 : 1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                // Option badge (A, B, C, D)
                Container(
                  width: 34,
                  height: 34,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: labelBgColor,
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: labelTextColor,
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                // Option text
                Expanded(
                  child: Text(
                    optionText,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                      color: textColor,
                      height: 1.3,
                    ),
                  ),
                ),
                // Status icon feedback
                if (statusIcon != null) ...[
                  const SizedBox(width: 8),
                  Icon(statusIcon, color: statusIconColor, size: 22),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
