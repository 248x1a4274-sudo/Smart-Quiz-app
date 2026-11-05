import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/question_provider.dart';
import '../widgets/custom_button.dart';

/// Screen 5: Add Custom Questions Screen with strict validation and local persistence.
class AddQuestionScreen extends StatefulWidget {
  const AddQuestionScreen({super.key});

  @override
  State<AddQuestionScreen> createState() => _AddQuestionScreenState();
}

class _AddQuestionScreenState extends State<AddQuestionScreen> {
  final _formKey = GlobalKey<FormState>();

  final _questionController = TextEditingController();
  final _optionAController = TextEditingController();
  final _optionBController = TextEditingController();
  final _optionCController = TextEditingController();
  final _optionDController = TextEditingController();

  int _selectedCorrectIndex = 0;
  String _selectedCategory = 'general_knowledge';

  static const List<Map<String, String>> categoriesList = [
    {'id': 'general_knowledge', 'name': 'General Knowledge'},
    {'id': 'science', 'name': 'Science & Nature'},
    {'id': 'mathematics', 'name': 'Mathematics'},
    {'id': 'computer_science', 'name': 'Computer Science'},
    {'id': 'programming', 'name': 'Programming & Tech'},
    {'id': 'history', 'name': 'History'},
    {'id': 'sports', 'name': 'Sports'},
    {'id': 'custom', 'name': 'Custom Community'},
  ];

  @override
  void dispose() {
    _questionController.dispose();
    _optionAController.dispose();
    _optionBController.dispose();
    _optionCController.dispose();
    _optionDController.dispose();
    super.dispose();
  }

  void _submitQuestion() async {
    if (!_formKey.currentState!.validate()) return;

    final optA = _optionAController.text.trim();
    final optB = _optionBController.text.trim();
    final optC = _optionCController.text.trim();
    final optD = _optionDController.text.trim();

    // Validation: All 4 options must be distinct
    final distinctSet = {
      optA.toLowerCase(),
      optB.toLowerCase(),
      optC.toLowerCase(),
      optD.toLowerCase(),
    };

    if (distinctSet.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Validation Error: All four options must be distinct and unique!'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final provider = context.read<QuestionProvider>();
    final success = await provider.addCustomQuestion(
      questionText: _questionController.text.trim(),
      optionA: optA,
      optionB: optB,
      optionC: optC,
      optionD: optD,
      correctIndex: _selectedCorrectIndex,
      categoryId: _selectedCategory,
    );

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Custom question saved locally!'),
            backgroundColor: Color(0xFF2E7D32),
          ),
        );
        // Clear fields
        _questionController.clear();
        _optionAController.clear();
        _optionBController.clear();
        _optionCController.clear();
        _optionDController.clear();
        setState(() {
          _selectedCorrectIndex = 0;
        });
      } else if (provider.errorMessage != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.errorMessage!),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final questionProvider = context.watch<QuestionProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Custom Question'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Instructions Card
              Card(
                elevation: 0,
                color: theme.colorScheme.surfaceContainerHighest.withAlpha(100),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(color: theme.colorScheme.outlineVariant.withAlpha(60)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    children: [
                      Icon(Icons.lightbulb_outline_rounded, color: theme.colorScheme.primary),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Your question is saved on your device and will appear in quizzes for this category.',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Creation Form
              Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Dropdown
                    Text(
                      'Quiz Category',
                      style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      value: _selectedCategory,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      items: categoriesList.map((cat) {
                        return DropdownMenuItem<String>(
                          value: cat['id'],
                          child: Text(cat['name']!),
                        );
                      }).toList(),
                      onChanged: (val) {
                        if (val != null) setState(() => _selectedCategory = val);
                      },
                    ),

                    const SizedBox(height: 18),

                    // Question Text Input
                    Text(
                      'Question Text',
                      style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _questionController,
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Enter your question clearly here...',
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        contentPadding: const EdgeInsets.all(16),
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Question text is required and cannot be empty.';
                        }
                        if (value.trim().length < 5) {
                          return 'Question must be at least 5 characters long.';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    // 4 Options with Radio selection for correct answer
                    Text(
                      'Answer Options (Select correct option with the radio button)',
                      style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),

                    _buildOptionInput(
                      label: 'Option A',
                      index: 0,
                      controller: _optionAController,
                    ),
                    _buildOptionInput(
                      label: 'Option B',
                      index: 1,
                      controller: _optionBController,
                    ),
                    _buildOptionInput(
                      label: 'Option C',
                      index: 2,
                      controller: _optionCController,
                    ),
                    _buildOptionInput(
                      label: 'Option D',
                      index: 3,
                      controller: _optionDController,
                    ),

                    const SizedBox(height: 24),

                    // Save Button
                    CustomButton(
                      text: 'Save Custom Question',
                      icon: Icons.save_rounded,
                      onPressed: _submitQuestion,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 36),

              // Existing Custom Questions List
              Text(
                'Locally Saved Questions (${questionProvider.customQuestions.length})',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),

              if (questionProvider.customQuestions.isEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: theme.colorScheme.outlineVariant.withAlpha(60)),
                  ),
                  child: Center(
                    child: Text(
                      'No custom questions added yet. Use the form above to add your first question!',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: theme.colorScheme.outline),
                    ),
                  ),
                )
              else
                ...questionProvider.customQuestions.map((q) {
                  return Card(
                    elevation: 0,
                    margin: const EdgeInsets.only(bottom: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(color: theme.colorScheme.outlineVariant.withAlpha(60)),
                    ),
                    child: ListTile(
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      title: Text(
                        q.questionText,
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                      subtitle: Text(
                        'Category: ${q.categoryId} · Correct: ${q.options[q.correctAnswerIndex]}',
                        style: TextStyle(fontSize: 12, color: theme.colorScheme.onSurfaceVariant),
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete_outline_rounded, color: Colors.red),
                        onPressed: () {
                          questionProvider.deleteCustomQuestion(q.id);
                        },
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

  Widget _buildOptionInput({
    required String label,
    required int index,
    required TextEditingController controller,
  }) {
    final theme = Theme.of(context);
    final isSelected = _selectedCorrectIndex == index;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Radio<int>(
            value: index,
            groupValue: _selectedCorrectIndex,
            onChanged: (val) {
              if (val != null) setState(() => _selectedCorrectIndex = val);
            },
          ),
          Expanded(
            child: TextFormField(
              controller: controller,
              decoration: InputDecoration(
                labelText: '$label ${isSelected ? '(Correct Answer)' : ''}',
                labelStyle: TextStyle(
                  color: isSelected ? theme.colorScheme.primary : null,
                  fontWeight: isSelected ? FontWeight.bold : null,
                ),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) {
                  return '$label cannot be empty';
                }
                return null;
              },
            ),
          ),
        ],
      ),
    );
  }
}
