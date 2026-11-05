# Academic Group Member Contributions & 5-Minute Live Demo Guide

## Project: Smart Quiz – Interactive Android Quiz Application
**Target Framework**: Flutter 3.35+, Dart 3.3+ (Null Safety)  
**Course / Subject**: Mobile Application Development & Software Engineering  

---

## 1. Group Member Allocation & Responsibilities

| Student Name | Role | Primary Contributions & Delivered Modules |
|--------------|------|-------------------------------------------|
| **Team Lead / Member 1** | System Architect & State Management Lead | • Configured `MultiProvider` architecture (`QuizProvider`, `QuestionProvider`, `ScoreProvider`).<br>• Designed data models (`Question`, `Category`, `QuizResult`).<br>• Implemented countdown timer logic and single-answer locking mechanisms. |
| **Member 2** | UI/UX & Frontend Screen Engineer | • Designed Material Design 3 theme system (`ThemeData` with M3 seed color, dynamic dark mode).<br>• Built `HomeScreen`, `CategoriesScreen`, and `QuizScreen` with responsive card layouts.<br>• Engineered custom widgets (`CategoryCard`, `QuestionCard`, `AnswerOption`, `CustomButton`). |
| **Member 3** | Backend & Service Integration Lead | • Implemented `QuizService` integrating the public Open Trivia DB API.<br>• Built HTML entity decoding and the 50+ question offline safety bank.<br>• Integrated `SharedPreferences` in `StorageService` for persisting custom questions, high scores, and history. |
| **Member 4** | QA, Form Validation & Documentation Lead | • Developed `AddQuestionScreen` with 4-way uniqueness input validation.<br>• Built `ProfileScreen` with category mastery bars and past attempt history.<br>• Authored `widget_test.dart`, `DEFECT_LOG.md`, README documentation, and release build configuration. |

---

## 2. Five-Minute Live Demonstration Script (Step-by-Step)

```text
[0:00 - 0:45] Minute 1: Introduction & Architecture
• Present title: "Smart Quiz – Interactive Quiz Application built with Flutter & Provider".
• Point out the Material Design 3 typography, dynamic seed color, and clean folder structure:
  lib/models, lib/services, lib/providers, lib/screens, lib/widgets.
• Highlight user statistics on the Home Screen (Quizzes completed: X, Highest score: Y).

[0:45 - 2:00] Minute 2: Category Quiz Gameplay & Public API
• Navigate to Categories Screen, choose "Computer Science" or "Programming".
• Explain how QuizService calls OpenTDB REST API asynchronously with offline fallback.
• Demonstrate the 15-second countdown timer ticking down.
• Click Option A: observe tactile selection highlight.
• Click "Confirm Answer": show instant feedback (green check for correct, red X for wrong).
• Demonstrate that tapping other options is disabled to prevent score tampering.
• Attempt to tap the top Exit (X) button: show the Material 3 confirmation dialog.

[2:00 - 3:15] Minute 3: Results Screen & Score History
• Complete the 5th question and advance to the Results Screen.
• Point out the circular score percentage, performance message ("Mastermind!"), and stats.
• Expand the "Review Detailed Answers" accordion to inspect student responses vs correct answers.
• Tap "Back to Home" and navigate to Profile Screen: observe highest score and quiz history updated!

[3:15 - 4:15] Minute 4: Custom Question Builder & Local Storage
• Go to "Add Question" screen.
• Deliberately enter duplicate options ("True" and "True"): show the validation error snackbar.
• Fill valid question ("What keyword in Dart defines a runtime constant? -> final, const, var, dynamic").
• Save question: observe local persistence confirmation via SharedPreferences.
• Navigate back to Categories -> Custom Questions: launch quiz and answer the newly created question!

[4:15 - 5:00] Minute 5: Automated Testing & Release APK
• Show terminal command: `flutter test` running all 4 unit and widget test cases with 100% pass rate.
• Conclude with release APK build command: `flutter build apk --release`.
• Take professor/evaluator questions.
```
