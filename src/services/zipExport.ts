import JSZip from 'jszip';
import { FLUTTER_PROJECT_FILES } from '../flutter_codebase/codebaseData';

export async function downloadFlutterProjectZip(): Promise<void> {
  const zip = new JSZip();

  // Root files
  zip.file('pubspec.yaml', FLUTTER_PROJECT_FILES.find((f) => f.path === 'pubspec.yaml')?.content || '');
  zip.file('README.md', FLUTTER_PROJECT_FILES.find((f) => f.path === 'README.md')?.content || '');
  zip.file('DEFECT_LOG.md', FLUTTER_PROJECT_FILES.find((f) => f.path === 'DEFECT_LOG.md')?.content || '');
  zip.file('CONTRIBUTIONS.md', FLUTTER_PROJECT_FILES.find((f) => f.path === 'CONTRIBUTIONS.md')?.content || '');

  // lib/ folder
  const libFolder = zip.folder('lib');
  if (libFolder) {
    libFolder.file('main.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/main.dart')?.content || '');

    const models = libFolder.folder('models');
    models?.file('category.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/models/category.dart')?.content || '');
    models?.file('question.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/models/question.dart')?.content || '');
    models?.file('quiz_result.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/models/quiz_result.dart')?.content || '');

    const providers = libFolder.folder('providers');
    providers?.file('quiz_provider.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/providers/quiz_provider.dart')?.content || '');
    providers?.file('question_provider.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/providers/question_provider.dart')?.content || '');
    providers?.file('score_provider.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'lib/providers/score_provider.dart')?.content || '');

    const testFolder = zip.folder('test');
    testFolder?.file('widget_test.dart', FLUTTER_PROJECT_FILES.find((f) => f.path === 'test/widget_test.dart')?.content || '');
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'smart_quiz_flutter_project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
