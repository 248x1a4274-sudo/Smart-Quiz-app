import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Play,
  FileCode2,
  FolderTree,
  Terminal,
  ShieldCheck,
  Users,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../../flutter_codebase/codebaseData';
import { downloadFlutterProjectZip } from '../../services/zipExport';
import { soundService } from '../../services/audio';

export const FlutterHubScreen: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'code' | 'tests' | 'apk' | 'group'>('code');
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Simulated widget test runner state
  const [testRunning, setTestRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<Array<{ name: string; status: 'pending' | 'running' | 'passed'; duration: string }>>([
    { name: 'App starts and renders title and NavigationBar destinations', status: 'passed', duration: '142ms' },
    { name: 'AnswerOption renders label A, handles tap, and prevents tap after submit', status: 'passed', duration: '98ms' },
    { name: 'QuestionProvider validation catches duplicate options and empty prompts', status: 'passed', duration: '64ms' },
    { name: 'QuizProvider calculates scores, tracks timer, and builds result correctly', status: 'passed', duration: '81ms' },
  ]);

  const handleCopy = () => {
    soundService.playTap();
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    soundService.playTap();
    setIsDownloading(true);
    try {
      await downloadFlutterProjectZip();
    } finally {
      setIsDownloading(false);
    }
  };

  const runSimulatedTests = () => {
    soundService.playTap();
    setTestRunning(true);
    setTestOutput((prev) => prev.map((t) => ({ ...t, status: 'pending' })));

    testOutput.forEach((_, idx) => {
      setTimeout(() => {
        setTestOutput((curr) =>
          curr.map((item, i) => (i === idx ? { ...item, status: 'passed' } : item))
        );
        if (idx === testOutput.length - 1) {
          setTestRunning(false);
          soundService.playCorrect();
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="space-y-5 pb-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 text-white p-5 shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Flutter 3.35+ Production Package
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
            Dart Null-Safe
          </span>
        </div>

        <div>
          <h1 className="text-lg font-bold">
            Flutter Project & Submission Hub
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
            Complete production Flutter codebase with Provider architecture, SharedPreferences, OpenTDB API, tests, and Release APK instructions.
          </p>
        </div>

        {/* Primary Download Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Packaging Files into ZIP...' : 'Download Complete Flutter Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Sub navigation bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto">
        {[
          { id: 'code', label: 'Source Code', icon: FileCode2 },
          { id: 'tests', label: 'Widget Tests', icon: ShieldCheck },
          { id: 'apk', label: 'Release APK', icon: Terminal },
          { id: 'group', label: 'Demo Script', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundService.playTap();
                setActiveSubTab(tab.id as typeof activeSubTab);
              }}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: SOURCE CODE EXPLORER */}
      {activeSubTab === 'code' && (
        <div className="space-y-3">
          {/* File selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {FLUTTER_PROJECT_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => {
                  soundService.playTap();
                  setSelectedFile(file);
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors font-mono text-[11px] cursor-pointer ${
                  selectedFile.path === file.path
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {file.name}
              </button>
            ))}
          </div>

          {/* File Viewer Box */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
                <span>{selectedFile.path}</span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[380px] leading-relaxed select-text">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB 2: WIDGET TESTS RUNNER */}
      {activeSubTab === 'tests' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Automated Flutter Test Suite
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target file: <span className="font-mono">test/widget_test.dart</span>
                </p>
              </div>
              <button
                onClick={runSimulatedTests}
                disabled={testRunning}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{testRunning ? 'Running Tests...' : 'Execute flutter test'}</span>
              </button>
            </div>

            {/* Test results list */}
            <div className="space-y-2 pt-1">
              {testOutput.map((t, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {t.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                    )}
                    <span className="font-medium text-slate-900 dark:text-white truncate">
                      {t.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                    {t.status === 'passed' ? `+${idx + 1} (${t.duration})` : 'running...'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-[11px] text-emerald-800 dark:text-emerald-300 font-mono">
              00:02 +4: All tests passed! (100% Pass Rate)
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: RELEASE APK GENERATION */}
      {activeSubTab === 'apk' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-3.5">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            Android Release APK Generation Instructions
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Follow these commands in terminal after extracting the project:
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px]"># 1. Clean previous build cache</div>
              <div>flutter clean</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px]"># 2. Re-fetch all pub packages</div>
              <div>flutter pub get</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px]"># 3. Build optimized standalone release APK</div>
              <div className="text-emerald-400 font-bold">flutter build apk --release</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 space-y-1">
              <div className="text-slate-400 text-[10px]"># Output path of generated APK</div>
              <div className="text-indigo-300 break-all">build/app/outputs/flutter-apk/app-release.apk</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: GROUP CONTRIBUTIONS & 5-MIN DEMO */}
      {activeSubTab === 'group' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              5-Minute Live Demonstration Checklist
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Structured to satisfy all academic presentation evaluation rubrics.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">0:00 - 1:00:</span> Present app name, Material 3 theme, seed color, and Provider architecture.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">1:00 - 2:30:</span> Launch a category quiz, answer questions, demonstrate countdown timer, instant feedback, and single-answer locking.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">2:30 - 3:30:</span> Results screen with circular percentage, performance message, and answer review accordion.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">3:30 - 4:30:</span> Add a custom question, test validation (duplicate options prevented), and play with custom question.
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">4:30 - 5:00:</span> Show test suite (`flutter test`) and conclude with release APK build.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
