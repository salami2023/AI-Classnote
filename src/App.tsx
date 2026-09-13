import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TeacherInputForm } from './components/TeacherInputForm';
import { LessonNotesViewer } from './components/LessonNotesViewer';
import { ExamViewer } from './components/ExamViewer';
import { PrintHeaderSettingsModal } from './components/PrintHeaderSettingsModal';
import { SavedLessonsDrawer } from './components/SavedLessonsDrawer';
import {
  AcademicLevel,
  LessonNote,
  ExamPaper,
  PrintSettings,
  LessonDiagram,
} from './types';
import {
  INITIAL_LESSON_NOTE,
  INITIAL_EXAM_PAPER,
} from './utils/sampleData';
import { triggerPrint } from './utils/printExport';
import { convertSvgToPng } from './utils/diagramRenderer';
import { getEducationalDiagramForTopic } from './utils/diagramLibrary';
import { AlertCircle, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  schoolName: 'Beacon Hill Schools',
  teacherName: 'Senior Educator',
  termOrSemester: 'First Term',
  academicYear: '2025/2026 Academic Session',
  studentNameLine: true,
  dateLine: true,
  scoreBox: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'notes' | 'exams'>('notes');

  // Input states
  const [subject, setSubject] = useState('Basic Science & Technology');
  const [topic, setTopic] = useState('The Water Cycle and States of Matter');
  const [content, setContent] = useState('');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('primary');
  const [subLevel, setSubLevel] = useState('Basic 4');
  const [duration, setDuration] = useState('45 mins');
  const [numberOfPeriods, setNumberOfPeriods] = useState<number>(3);
  const [tone, setTone] = useState('engaging and conversational');

  // Generated outputs
  const [currentNote, setCurrentNote] = useState<LessonNote>(INITIAL_LESSON_NOTE);
  const [currentExam, setCurrentExam] = useState<ExamPaper | null>(INITIAL_EXAM_PAPER);

  // Status
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isGeneratingExams, setIsGeneratingExams] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Modals & Drawers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Persistence for PrintSettings and SavedNotes
  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    try {
      const saved = localStorage.getItem('classnotes_print_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          !parsed.schoolName ||
          parsed.schoolName.toUpperCase().includes('AUGUSTINE') ||
          parsed.schoolName.toUpperCase().includes('ROYAL ACADEMY')
        ) {
          return { ...parsed, schoolName: 'Beacon Hill Schools' };
        }
        return parsed;
      }
      return DEFAULT_PRINT_SETTINGS;
    } catch {
      return DEFAULT_PRINT_SETTINGS;
    }
  });

  const [savedNotes, setSavedNotes] = useState<LessonNote[]>(() => {
    try {
      const saved = localStorage.getItem('classnotes_saved_history');
      return saved ? JSON.parse(saved) : [INITIAL_LESSON_NOTE];
    } catch {
      return [INITIAL_LESSON_NOTE];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('classnotes_print_settings', JSON.stringify(printSettings));
    } catch (err) {
      console.error(err);
    }
  }, [printSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('classnotes_saved_history', JSON.stringify(savedNotes));
    } catch (err) {
      console.error(err);
    }
  }, [savedNotes]);

  // Ensure initial note has its educational PNG diagram ready
  useEffect(() => {
    if (!currentNote.diagrams || currentNote.diagrams.length === 0) {
      const spec = getEducationalDiagramForTopic(
        currentNote.topic,
        currentNote.subject,
        currentNote.academicLevel,
        currentNote.subLevel
      );
      convertSvgToPng(spec.svgMarkup, 800, 500).then((pngBase64) => {
        const initialDiagram: LessonDiagram = {
          id: `diag_${Date.now()}`,
          title: spec.title,
          caption: spec.caption,
          diagramType: spec.diagramType,
          keyLabels: spec.keyLabels,
          teachingPrompt: spec.teachingPrompt,
          pngBase64,
          width: 800,
          height: 500,
          source: 'curriculum-library',
          createdAt: new Date().toISOString(),
        };

        setCurrentNote((prev) => ({
          ...prev,
          diagrams: [initialDiagram],
        }));

        setSavedNotes((prev) =>
          prev.map((n) =>
            n.id === currentNote.id ? { ...n, diagrams: [initialDiagram] } : n
          )
        );
      });
    }
  }, []);

  // Generate Lesson Notes
  const handleGenerateNotes = async () => {
    setErrorMessage(null);
    setIsGeneratingNotes(true);
    try {
      const res = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          content,
          academicLevel,
          subLevel,
          duration,
          numberOfPeriods,
          tone,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();

      // Convert educational diagram specification into a standalone high-res PNG image
      let noteDiagrams: LessonDiagram[] = [];
      try {
        let svgCode = data.diagramSpec?.svgMarkup;
        let dTitle = data.diagramSpec?.title;
        let dCaption = data.diagramSpec?.caption;
        let dType = data.diagramSpec?.diagramType;
        let dLabels = data.diagramSpec?.keyLabels;
        let dPrompt = data.diagramSpec?.teachingPrompt;

        if (!svgCode || typeof svgCode !== 'string' || !svgCode.includes('<svg')) {
          const fallbackSpec = getEducationalDiagramForTopic(
            data.topic || topic,
            data.subject || subject,
            data.academicLevel || academicLevel,
            data.subLevel || subLevel
          );
          svgCode = fallbackSpec.svgMarkup;
          dTitle = dTitle || fallbackSpec.title;
          dCaption = dCaption || fallbackSpec.caption;
          dType = dType || fallbackSpec.diagramType;
          dLabels = dLabels || fallbackSpec.keyLabels;
          dPrompt = dPrompt || fallbackSpec.teachingPrompt;
        }

        const pngBase64 = await convertSvgToPng(svgCode, 800, 500);

        noteDiagrams = [
          {
            id: `diag_${Date.now()}`,
            title: dTitle || `${data.topic} Lesson Aid Diagram`,
            caption: dCaption || `Visual lesson aid illustrating ${data.topic}.`,
            diagramType: dType || 'Curriculum Schematic',
            keyLabels: dLabels || [],
            teachingPrompt: dPrompt || 'Classroom Discussion: Trace the diagram on the board and discuss each labeled stage with pupils.',
            pngBase64,
            width: 800,
            height: 500,
            source: data.diagramSpec?.svgMarkup ? 'gemini-svg' : 'curriculum-library',
            createdAt: new Date().toISOString(),
          },
        ];
      } catch (diagramErr) {
        console.warn('Diagram rasterization to PNG warning:', diagramErr);
      }

      const newNote: LessonNote = {
        ...data,
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
        sourceContent: content,
        numberOfPeriods: data.numberOfPeriods || numberOfPeriods,
        periodAllocationSummary: data.periodAllocationSummary || `${data.numberOfPeriods || numberOfPeriods} Periods (${duration} each)`,
        diagrams: noteDiagrams,
      };

      setCurrentNote(newNote);
      setSavedNotes((prev) => [newNote, ...prev.filter((n) => n.topic !== newNote.topic)]);

      setSuccessNotice(`Structured ${newNote.numberOfPeriods || numberOfPeriods}-period lesson guide & PNG diagram for "${newNote.topic}" generated successfully!`);
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (error: any) {
      console.error('Notes generation error:', error);
      setErrorMessage(
        error?.message || 'Failed to generate class notes. Please check the network and try again.'
      );
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  // Generate Exam Questions
  const handleGenerateExam = async (config: {
    mcqCount: number;
    shortAnswerCount?: number;
    essayCount: number;
    difficulty: 'easy' | 'standard' | 'challenging';
  }) => {
    setErrorMessage(null);
    setIsGeneratingExams(true);
    try {
      // Gather all topics from generated class notes
      const notesCollection = savedNotes.length > 0 ? savedNotes : [currentNote];
      const allCoveredTopics = notesCollection.map((n) => ({
        topic: n.topic,
        subject: n.subject,
        overview: n.overview,
        subTopics: n.sections.flatMap((s) => s.subTopics || [s.title]),
        numberOfPeriods: n.numberOfPeriods || n.sections.length,
      }));

      const res = await fetch('/api/generate-exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          content: content || currentNote?.overview || '',
          academicLevel,
          subLevel,
          schoolName: printSettings.schoolName || 'BEACON HILL SCHOOLS',
          termOrSemester: printSettings.termOrSemester || 'First Term Examination',
          academicSession: printSettings.academicYear || '2025/2026 Academic Session',
          schoolLogoUrl: printSettings.schoolLogoUrl,
          coveredTopics: allCoveredTopics,
          mcqCount: config.mcqCount || 30,
          theoryCount: config.essayCount || 8,
          difficulty: config.difficulty,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const newExam: ExamPaper = {
        ...data,
        id: `exam-${Date.now()}`,
        createdAt: new Date().toISOString(),
        schoolName: data.schoolName || printSettings.schoolName,
        schoolLogoUrl: printSettings.schoolLogoUrl,
        termOrSemester: data.termOrSemester || printSettings.termOrSemester,
        academicSession: data.academicSession || printSettings.academicYear,
        coveredTopics: data.coveredTopics || allCoveredTopics.map((t) => t.topic),
        difficulty: config.difficulty,
      };

      setCurrentExam(newExam);
      setSuccessNotice(`Official 2-Page Exam Paper (30 MCQs + 8 Theory Questions) covering all topics generated!`);
      setTimeout(() => setSuccessNotice(null), 4500);
    } catch (error: any) {
      console.error('Exam generation error:', error);
      setErrorMessage(
        error?.message || 'Failed to generate exam questions. Please try again.'
      );
    } finally {
      setIsGeneratingExams(false);
    }
  };

  const handleUpdateNote = (updated: LessonNote) => {
    setCurrentNote(updated);
    setSavedNotes((prev) =>
      prev.map((n) => (n.id === updated.id ? updated : n))
    );
  };

  const handleSelectSavedNote = (note: LessonNote) => {
    setCurrentNote(note);
    setSubject(note.subject);
    setTopic(note.topic);
    setAcademicLevel(note.academicLevel);
    setSubLevel(note.subLevel);
    setDuration(note.duration);
    if (note.numberOfPeriods) setNumberOfPeriods(note.numberOfPeriods);
    if (note.sourceContent) setContent(note.sourceContent);
  };

  const handleDeleteSavedNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm('Clear all saved lesson notes history?')) {
      setSavedNotes([]);
    }
  };

  const handleSwitchToExam = () => {
    setActiveTab('exams');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        academicLevel={academicLevel}
        savedCount={savedNotes.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrint={triggerPrint}
      />

      {/* Status Notifications */}
      <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start space-x-2.5 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block font-semibold">Generation Error</strong>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex-1 font-medium">{successNotice}</span>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'notes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Configuration Form */}
            <div className="no-print lg:col-span-5 space-y-6">
              <TeacherInputForm
                subject={subject}
                setSubject={setSubject}
                topic={topic}
                setTopic={setTopic}
                content={content}
                setContent={setContent}
                academicLevel={academicLevel}
                setAcademicLevel={setAcademicLevel}
                subLevel={subLevel}
                setSubLevel={setSubLevel}
                duration={duration}
                setDuration={setDuration}
                numberOfPeriods={numberOfPeriods}
                setNumberOfPeriods={setNumberOfPeriods}
                tone={tone}
                setTone={setTone}
                onGenerate={handleGenerateNotes}
                isGenerating={isGeneratingNotes}
              />

              {/* Informational Guidance for Teachers */}
              <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-4 sm:p-5 text-xs text-blue-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Curriculum Design Principles Built-In:</span>
                </div>
                <ul className="space-y-1.5 text-blue-800/90 list-disc list-outside pl-4">
                  <li>
                    <strong>Simple & Basic Terms:</strong> Explanations avoid complex jargon and break concepts into clear analogies.
                  </li>
                  <li>
                    <strong>Readability with Bullet Points:</strong> Every core lesson idea is structured into clear scannable points for board notes.
                  </li>
                  <li>
                    <strong>Class Activities:</strong> Hands-on, movement, or cooperative activities tailored to the age bracket.
                  </li>
                  <li>
                    <strong>Reinforcing Homework:</strong> Practical tasks with clear student & parent guidance.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Structured Study Guide & Notes Viewer */}
            <div className="lg:col-span-7">
              {currentNote ? (
                <LessonNotesViewer
                  note={currentNote}
                  onUpdateNote={handleUpdateNote}
                  printSettings={printSettings}
                  onSwitchToExam={handleSwitchToExam}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 space-y-3">
                  <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-700">No Lesson Generated Yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Fill in the subject and topic on the left and click "Generate Class Notes" to see your complete study guide.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Exams View */
          <div className="max-w-4xl mx-auto">
            <ExamViewer
              exam={currentExam}
              subject={subject}
              topic={topic}
              content={content || currentNote?.overview || ''}
              academicLevel={academicLevel}
              subLevel={subLevel}
              onGenerateExam={handleGenerateExam}
              isGenerating={isGeneratingExams}
              printSettings={printSettings}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto py-6 border-t border-slate-200 bg-white text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>
            ClassNotes & Exam Generator for Educators • Nursery, Primary & Secondary Curriculum Alignment • PDF & Word Document Export
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PrintHeaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={printSettings}
        onSave={setPrintSettings}
      />

      <SavedLessonsDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedNotes={savedNotes}
        onSelectNote={handleSelectSavedNote}
        onDeleteNote={handleDeleteSavedNote}
        onClearAll={handleClearAllSaved}
      />
    </div>
  );
}
