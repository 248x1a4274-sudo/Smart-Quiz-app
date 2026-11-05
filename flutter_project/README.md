# Smart Quiz – Interactive Android Quiz Application

A modern, user-friendly, educational Android Quiz Application engineered with **Flutter 3.35+** and **Dart (Null Safety)**. Smart Quiz allows students to test their knowledge across diverse categories, answer timed multiple-choice questions, track scores with local persistence, review detailed analytics, and author custom questions.

---

## 1. System Architecture & Features

### Core Capabilities
- **7 Public Categories + Custom Pool**: General Knowledge, Science & Nature, Mathematics, Computer Science, Programming & Tech, History, Sports, and User-Created Questions.
- **Dynamic API Integration**: Integrated with the Open Trivia DB Public Quiz API with automated HTML decoding, randomized option shuffling, and resilient offline bank fallbacks.
- **Provider State Management**: Clean architectural separation across `QuizProvider`, `QuestionProvider`, and `ScoreProvider` extending `ChangeNotifier`.
- **Local Persistence**: Custom questions, highest scores, and complete quiz history saved locally via `SharedPreferences`.
- **Question Countdown Timer**: 15-second per-question timer with dynamic visual color alerts and auto-locking on expiration.
- **Material Design 3**: Fully compliant with Material 3 dynamic color scheme, smooth transitions, and tactile feedback.
- **Instant Answer Feedback**: Selected answer states, immediate green/red feedback, explanation hints, and prevention of repeated answering.
- **Exit Confirmation Dialog**: Warns students before forfeiting an active quiz session.

---

## 2. Project Directory Structure

```text
smart_quiz/
├── pubspec.yaml
├── README.md
├── DEFECT_LOG.md
├── CONTRIBUTIONS.md
├── test/
│   └── widget_test.dart
└── lib/
    ├── main.dart
    ├── models/
    │   ├── category.dart
    │   ├── question.dart
    │   └── quiz_result.dart
    ├── providers/
    │   ├── quiz_provider.dart
    │   ├── question_provider.dart
    │   └── score_provider.dart
    ├── services/
    │   ├── quiz_service.dart
    │   └── storage_service.dart
    ├── screens/
    │   ├── home_screen.dart
    │   ├── categories_screen.dart
    │   ├── quiz_screen.dart
    │   ├── result_screen.dart
    │   ├── add_question_screen.dart
    │   └── profile_screen.dart
    └── widgets/
        ├── category_card.dart
        ├── question_card.dart
        ├── answer_option.dart
        └── custom_button.dart
```

---

## 3. Installation & Getting Started

### Prerequisites
- Flutter SDK `^3.35.0` or newer (stable channel)
- Dart SDK `^3.3.0`
- Android Studio / VS Code with Flutter extensions
- Android device or emulator running API 24+ (Android 7.0+)

### Setup Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/smart-quiz.git
   cd smart-quiz
   ```

2. **Install Flutter dependencies**:
   ```bash
   flutter pub get
   ```

3. **Verify Flutter environment**:
   ```bash
   flutter doctor
   ```

4. **Run on an Android device or emulator**:
   ```bash
   flutter run
   ```

---

## 4. Running Automated Tests

Run the complete suite of widget and unit tests:
```bash
flutter test
```

Expected output:
```text
00:02 +4: All tests passed!
```

---

## 5. Generating Android Release APK

To generate a standalone, optimized Android Release APK ready for submission and distribution:

```bash
# 1. Clean previous build artifacts
flutter clean

# 2. Re-fetch packages
flutter pub get

# 3. Build optimized release APK
flutter build apk --release
```

The compiled release APK will be located at:
```text
build/app/outputs/flutter-apk/app-release.apk
```

To build split per-ABI APKs (reducing file size for arm64/armeabi devices):
```bash
flutter build apk --split-per-abi
```

---

## 6. Public Data Source
- **Primary Source**: [Open Trivia Database (OpenTDB)](https://opentdb.com/) API.
- **Category Endpoints**:
  - General Knowledge: `category=9`
  - Science & Nature: `category=17`
  - Computers: `category=18`
  - Mathematics: `category=19`
  - Sports: `category=21`
  - History: `category=23`
- **Offline Safeguard**: Built-in 50+ question offline repository ensuring complete offline playability during academic demonstrations.
