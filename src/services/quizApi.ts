import { Category, CategoryId, Question } from '../types/quiz';

export const QUIZ_CATEGORIES: Category[] = [
  {
    id: 'general_knowledge',
    name: 'General Knowledge',
    description: 'Current affairs, world culture, geography, and trivia',
    iconName: 'Globe',
    color: 'from-blue-600 to-indigo-600',
    accentColor: 'text-blue-600 dark:text-blue-400',
    openTdbId: 9,
    questionCount: 25,
  },
  {
    id: 'science',
    name: 'Science & Nature',
    description: 'Physics, chemistry, biology, astronomy, and nature',
    iconName: 'Atom',
    color: 'from-emerald-600 to-teal-600',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    openTdbId: 17,
    questionCount: 20,
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Arithmetic, algebra, geometry, logic, and puzzles',
    iconName: 'Calculator',
    color: 'from-amber-600 to-orange-600',
    accentColor: 'text-amber-600 dark:text-amber-400',
    openTdbId: 19,
    questionCount: 18,
  },
  {
    id: 'computer_science',
    name: 'Computer Science',
    description: 'Hardware, operating systems, networking, and algorithms',
    iconName: 'Cpu',
    color: 'from-purple-600 to-violet-600',
    accentColor: 'text-purple-600 dark:text-purple-400',
    openTdbId: 18,
    questionCount: 22,
  },
  {
    id: 'programming',
    name: 'Programming & Tech',
    description: 'Dart, Flutter, Python, JavaScript, and software development',
    iconName: 'Code2',
    color: 'from-cyan-600 to-blue-600',
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    openTdbId: 18, // Computer Science subset in OpenTDB
    questionCount: 25,
  },
  {
    id: 'history',
    name: 'History',
    description: 'Ancient civilizations, world wars, revolutions, and milestones',
    iconName: 'Landmark',
    color: 'from-rose-600 to-pink-600',
    accentColor: 'text-rose-600 dark:text-rose-400',
    openTdbId: 23,
    questionCount: 20,
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Olympics, football, cricket, tennis, and athletic records',
    iconName: 'Trophy',
    color: 'from-emerald-600 to-green-600',
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    openTdbId: 21,
    questionCount: 20,
  },
  {
    id: 'custom',
    name: 'Custom Questions',
    description: 'Community and student questions created on this device',
    iconName: 'PenTool',
    color: 'from-violet-600 to-indigo-600',
    accentColor: 'text-violet-600 dark:text-violet-400',
    questionCount: 0,
  },
];

// Rich offline question fallback bank ensuring 100% offline reliability
const FALLBACK_QUESTION_BANK: Record<CategoryId, Question[]> = {
  general_knowledge: [
    {
      id: 'gk-1',
      questionText: 'Which planet in our solar system is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswerIndex: 1,
      category: 'general_knowledge',
      explanation: 'Mars is known as the Red Planet due to the reddish iron oxide on its surface.',
    },
    {
      id: 'gk-2',
      questionText: 'What is the capital city of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correctAnswerIndex: 2,
      category: 'general_knowledge',
      explanation: 'Canberra was chosen as the compromise capital between rival cities Sydney and Melbourne in 1908.',
    },
    {
      id: 'gk-3',
      questionText: 'Which ocean is the largest and deepest on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
      correctAnswerIndex: 3,
      category: 'general_knowledge',
      explanation: 'The Pacific Ocean covers over 30% of Earth’s surface and contains the Mariana Trench.',
    },
    {
      id: 'gk-4',
      questionText: 'Who painted the famous masterpiece "The Starry Night"?',
      options: ['Pablo Picasso', 'Vincent van Gogh', 'Claude Monet', 'Leonardo da Vinci'],
      correctAnswerIndex: 1,
      category: 'general_knowledge',
      explanation: 'Vincent van Gogh painted The Starry Night in June 1889 while at Saint-Paul-de-Mausole.',
    },
    {
      id: 'gk-5',
      questionText: 'Which country is known as the "Land of the Rising Sun"?',
      options: ['China', 'Japan', 'South Korea', 'Thailand'],
      correctAnswerIndex: 1,
      category: 'general_knowledge',
      explanation: 'Japan is called Nippon/Nihon in Japanese, meaning "origin of the sun".',
    },
    {
      id: 'gk-6',
      questionText: 'What is the chemical symbol for Gold?',
      options: ['Ag', 'Au', 'Fe', 'Pb'],
      correctAnswerIndex: 1,
      category: 'general_knowledge',
      explanation: 'Au comes from the Latin word for gold, "aurum", meaning glowing dawn.',
    },
  ],
  science: [
    {
      id: 'sci-1',
      questionText: 'What is the primary powerhouse organelle of an animal cell?',
      options: ['Ribosome', 'Nucleus', 'Mitochondria', 'Endoplasmic Reticulum'],
      correctAnswerIndex: 2,
      category: 'science',
      explanation: 'Mitochondria generate most of the chemical energy needed to power biochemical reactions via ATP.',
    },
    {
      id: 'sci-2',
      questionText: 'What is the speed of light in a vacuum approximately?',
      options: ['300,000 km/s', '150,000 km/s', '30,000 km/s', '1,000,000 km/s'],
      correctAnswerIndex: 0,
      category: 'science',
      explanation: 'Light travels at approximately 299,792 kilometers per second in a vacuum.',
    },
    {
      id: 'sci-3',
      questionText: 'Which gas makes up the largest percentage of Earth’s atmosphere?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
      correctAnswerIndex: 2,
      category: 'science',
      explanation: 'Nitrogen constitutes approximately 78% of Earth’s atmosphere, with Oxygen making up ~21%.',
    },
    {
      id: 'sci-4',
      questionText: 'What is the pH level of pure distilled water at 25°C?',
      options: ['5', '7', '9', '14'],
      correctAnswerIndex: 1,
      category: 'science',
      explanation: 'Pure water has an equal concentration of H+ and OH- ions, giving it a neutral pH of 7.0.',
    },
    {
      id: 'sci-5',
      questionText: 'What type of bond involves the sharing of electron pairs between atoms?',
      options: ['Ionic bond', 'Hydrogen bond', 'Covalent bond', 'Metallic bond'],
      correctAnswerIndex: 2,
      category: 'science',
      explanation: 'Covalent chemical bonds are formed when atoms share valence electrons.',
    },
  ],
  mathematics: [
    {
      id: 'math-1',
      questionText: 'What is the value of Pi (π) rounded to two decimal places?',
      options: ['3.12', '3.14', '3.16', '3.18'],
      correctAnswerIndex: 1,
      category: 'mathematics',
      explanation: 'Pi is an irrational constant whose approximate value is 3.14159...',
    },
    {
      id: 'math-2',
      questionText: 'If a triangle has angles measuring 90° and 45°, what is the third angle?',
      options: ['35°', '45°', '55°', '90°'],
      correctAnswerIndex: 1,
      category: 'mathematics',
      explanation: 'The interior angles of any planar triangle sum to 180°. 180 - (90 + 45) = 45°.',
    },
    {
      id: 'math-3',
      questionText: 'What is the square root of 256?',
      options: ['14', '16', '18', '24'],
      correctAnswerIndex: 1,
      category: 'mathematics',
      explanation: '16 × 16 = 256.',
    },
    {
      id: 'math-4',
      questionText: 'What is the smallest prime number?',
      options: ['0', '1', '2', '3'],
      correctAnswerIndex: 2,
      category: 'mathematics',
      explanation: '2 is the smallest prime number and also the only even prime number.',
    },
    {
      id: 'math-5',
      questionText: 'What is the derivative of x² with respect to x?',
      options: ['x', '2x', 'x²', '2'],
      correctAnswerIndex: 1,
      category: 'mathematics',
      explanation: 'Using the power rule d/dx[x^n] = n*x^(n-1), d/dx[x²] = 2x.',
    },
  ],
  computer_science: [
    {
      id: 'cs-1',
      questionText: 'What does CPU stand for in computer hardware architecture?',
      options: [
        'Central Performance Unit',
        'Central Processing Unit',
        'Control Protocol Unit',
        'Computational Power Unit',
      ],
      correctAnswerIndex: 1,
      category: 'computer_science',
      explanation: 'The Central Processing Unit (CPU) executes instructions comprising a computer program.',
    },
    {
      id: 'cs-2',
      questionText: 'Which data structure follows the Last-In, First-Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswerIndex: 1,
      category: 'computer_science',
      explanation: 'A Stack is a LIFO structure where the last item pushed is the first one popped.',
    },
    {
      id: 'cs-3',
      questionText: 'What is the time complexity of binary search on a sorted array of size N?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N²)'],
      correctAnswerIndex: 1,
      category: 'computer_science',
      explanation: 'Binary search halves the search space at each step, yielding logarithmic time O(log N).',
    },
    {
      id: 'cs-4',
      questionText: 'Which OSI layer is responsible for end-to-end packet routing across networks?',
      options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
      correctAnswerIndex: 1,
      category: 'computer_science',
      explanation: 'Layer 3 (Network Layer, e.g. IP) handles routing packets across distinct networks.',
    },
    {
      id: 'cs-5',
      questionText: 'What does SQL stand for in database management systems?',
      options: [
        'Structured Query Language',
        'Simple Question Language',
        'Sequential Query Logic',
        'System Quality Level',
      ],
      correctAnswerIndex: 0,
      category: 'computer_science',
      explanation: 'SQL stands for Structured Query Language, the ANSI standard for relational databases.',
    },
  ],
  programming: [
    {
      id: 'prog-1',
      questionText: 'In Flutter, which widget is the root of an application following Material Design 3?',
      options: ['CupertinoApp', 'MaterialApp', 'Scaffold', 'Container'],
      correctAnswerIndex: 1,
      category: 'programming',
      explanation: 'MaterialApp wraps widgets implementing Material Design patterns like ThemeData and Navigator.',
    },
    {
      id: 'prog-2',
      questionText: 'In Dart and Flutter state management, what class does Provider listen to for state changes?',
      options: ['StreamBuilder', 'ChangeNotifier', 'FutureProvider', 'Bloc'],
      correctAnswerIndex: 1,
      category: 'programming',
      explanation: 'ChangeNotifier provides notifyListeners() to publish state changes to consumer widgets.',
    },
    {
      id: 'prog-3',
      questionText: 'Which keyword in Dart declares a variable that can be assigned only once and evaluated at runtime?',
      options: ['const', 'final', 'var', 'late'],
      correctAnswerIndex: 1,
      category: 'programming',
      explanation: 'final variables can only be assigned once and can be initialized with runtime computations.',
    },
    {
      id: 'prog-4',
      questionText: 'What is the purpose of the pubspec.yaml file in a Flutter project?',
      options: [
        'Configures Java bytecode for Android',
        'Declares project metadata, dependencies, assets, and fonts',
        'Compiles Dart code into C++',
        'Stores database credentials',
      ],
      correctAnswerIndex: 1,
      category: 'programming',
      explanation: 'pubspec.yaml manages dependencies, assets, Flutter SDK constraints, and app versions.',
    },
    {
      id: 'prog-5',
      questionText: 'In object-oriented programming, what principle allows a child class to override a parent method?',
      options: ['Encapsulation', 'Polymorphism', 'Abstraction', 'Composition'],
      correctAnswerIndex: 1,
      category: 'programming',
      explanation: 'Polymorphism (specifically runtime subtype polymorphism) allows overriding inherited methods.',
    },
    {
      id: 'prog-6',
      questionText: 'Which command compiles an Android release APK in Flutter?',
      options: ['flutter run --release', 'flutter build apk --release', 'flutter create apk', 'flutter compile android'],
      correctAnswerIndex: 1,
      category: 'programming',
      explanation: 'flutter build apk --release creates the optimized production APK bundle.',
    },
  ],
  history: [
    {
      id: 'hist-1',
      questionText: 'In which year did the Apollo 11 mission land the first humans on the Moon?',
      options: ['1965', '1969', '1971', '1975'],
      correctAnswerIndex: 1,
      category: 'history',
      explanation: 'Neil Armstrong and Buzz Aldrin landed the Apollo 11 Lunar Module Eagle on July 20, 1969.',
    },
    {
      id: 'hist-2',
      questionText: 'Who was the first President of the United States under the Constitution?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Alexander Hamilton'],
      correctAnswerIndex: 2,
      category: 'history',
      explanation: 'George Washington served as the first U.S. President from 1789 to 1797.',
    },
    {
      id: 'hist-3',
      questionText: 'The ancient city of Alexandria was founded in Egypt by which historical conqueror?',
      options: ['Julius Caesar', 'Alexander the Great', 'Napoleon Bonaparte', 'Ramses II'],
      correctAnswerIndex: 1,
      category: 'history',
      explanation: 'Alexander the Great founded Alexandria around 331 BC during his Persian campaign.',
    },
    {
      id: 'hist-4',
      questionText: 'In which year did World War II officially end?',
      options: ['1943', '1944', '1945', '1950'],
      correctAnswerIndex: 2,
      category: 'history',
      explanation: 'World War II concluded in 1945 following the unconditional surrender of Axis forces.',
    },
  ],
  sports: [
    {
      id: 'sport-1',
      questionText: 'How many players are on the field for one team in a standard association football (soccer) match?',
      options: ['9', '10', '11', '12'],
      correctAnswerIndex: 2,
      category: 'sports',
      explanation: 'A football team fields 11 players, including one goalkeeper.',
    },
    {
      id: 'sport-2',
      questionText: 'Which country won the FIFA Men’s World Cup in 2022 in Qatar?',
      options: ['France', 'Argentina', 'Brazil', 'Croatia'],
      correctAnswerIndex: 1,
      category: 'sports',
      explanation: 'Argentina defeated France in an epic penalty shootout in the 2022 Final.',
    },
    {
      id: 'sport-3',
      questionText: 'How long is an Olympic swimming pool?',
      options: ['25 meters', '50 meters', '75 meters', '100 meters'],
      correctAnswerIndex: 1,
      category: 'sports',
      explanation: 'Standard Olympic-size swimming pools measure exactly 50 meters in length.',
    },
    {
      id: 'sport-4',
      questionText: 'In tennis, what term represents a score of zero?',
      options: ['Nil', 'Blank', 'Love', 'Fault'],
      correctAnswerIndex: 2,
      category: 'sports',
      explanation: '"Love" in tennis is believed to derive from the French word "l’œuf" (the egg), symbolizing zero.',
    },
  ],
  custom: [],
};

// Helper to decode HTML entities returned by Open Trivia DB
function decodeHtmlEntities(str: string): string {
  if (typeof document === 'undefined') {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&eacute;/g, 'é')
      .replace(/&oacute;/g, 'ó');
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function fetchQuestionsForCategory(
  category: CategoryId,
  count: number = 5,
  customQuestions: Question[] = []
): Promise<{ questions: Question[]; source: 'api' | 'custom' | 'offline_bank' }> {
  // If custom category requested:
  if (category === 'custom') {
    if (customQuestions.length === 0) {
      // Provide a couple starter custom templates if none created yet
      return {
        questions: [
          {
            id: 'custom-demo-1',
            questionText: 'Which design specification system was introduced by Google for Android 12 and above?',
            options: ['Material Design 1', 'Holo Theme', 'Material Design 3 (Material You)', 'Neumorphism'],
            correctAnswerIndex: 2,
            category: 'custom',
            explanation: 'Material Design 3 introduces dynamic color theming, adaptive layouts, and revised component specs.',
            isCustom: true,
          },
          {
            id: 'custom-demo-2',
            questionText: 'In Flutter, which widget manages state changes and notifies listeners in the Provider architecture?',
            options: ['StreamController', 'ChangeNotifier', 'StatefulWidget', 'InheritedModel'],
            correctAnswerIndex: 1,
            category: 'custom',
            explanation: 'ChangeNotifier is extended by providers and calls notifyListeners() to refresh UI.',
            isCustom: true,
          },
        ],
        source: 'custom',
      };
    }
    return {
      questions: shuffleArray(customQuestions).slice(0, count),
      source: 'custom',
    };
  }

  // Include user's custom questions that match this category
  const matchingCustom = customQuestions.filter((q) => q.category === category);

  // Try public quiz API (Open Trivia DB)
  const categoryConfig = QUIZ_CATEGORIES.find((c) => c.id === category);
  if (categoryConfig?.openTdbId) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch(
        `https://opentdb.com/api.php?amount=${count}&category=${categoryConfig.openTdbId}&type=multiple`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.response_code === 0 && Array.isArray(data.results) && data.results.length > 0) {
          const apiQuestions: Question[] = data.results.map((raw: {
            question: string;
            correct_answer: string;
            incorrect_answers: string[];
            difficulty: 'easy' | 'medium' | 'hard';
          }, idx: number) => {
            const rawOptions = [raw.correct_answer, ...raw.incorrect_answers];
            const decodedOptions = rawOptions.map((opt) => decodeHtmlEntities(opt));
            const shuffledOptions = shuffleArray(decodedOptions);
            const decodedCorrect = decodeHtmlEntities(raw.correct_answer);
            const correctIndex = shuffledOptions.indexOf(decodedCorrect);

            return {
              id: `opentdb-${category}-${Date.now()}-${idx}`,
              questionText: decodeHtmlEntities(raw.question),
              options: shuffledOptions,
              correctAnswerIndex: correctIndex >= 0 ? correctIndex : 0,
              category,
              difficulty: raw.difficulty,
              explanation: `Correct answer: ${decodedCorrect}`,
            };
          });

          // Mix in matching custom questions if available
          const combined = [...matchingCustom, ...apiQuestions];
          return {
            questions: shuffleArray(combined).slice(0, count),
            source: 'api',
          };
        }
      }
    } catch {
      // API unreachable, rate limited, or network offline -> fall through to offline bank
    }
  }

  // High quality offline fallback bank
  const bank = FALLBACK_QUESTION_BANK[category] || [];
  const combinedBank = [...matchingCustom, ...bank];
  const selected = shuffleArray(combinedBank).slice(0, count);

  return {
    questions: selected.length > 0 ? selected : FALLBACK_QUESTION_BANK.general_knowledge.slice(0, count),
    source: 'offline_bank',
  };
}
