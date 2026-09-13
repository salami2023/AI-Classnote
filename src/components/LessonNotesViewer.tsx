import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  Copy,
  Check,
  Edit3,
  BookOpen,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Target,
  Share2,
  CheckCircle,
  Calendar,
  User,
  GraduationCap,
  Save,
  Plus,
  Trash2,
  CalendarRange,
  Layers,
} from 'lucide-react';
import { LessonNote, PrintSettings, LessonDiagram } from '../types';
import { exportLessonNoteToWord } from '../utils/docxExport';
import { exportToWordHTML, triggerPrint } from '../utils/printExport';
import { LessonDiagramsSection } from './LessonDiagramsSection';

interface LessonNotesViewerProps {
  note: LessonNote;
  onUpdateNote: (updated: LessonNote) => void;
  printSettings: PrintSettings;
  onSwitchToExam: () => void;
}

export const LessonNotesViewer: React.FC<LessonNotesViewerProps> = ({
  note,
  onUpdateNote,
  printSettings,
  onSwitchToExam,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBuffer, setEditBuffer] = useState<LessonNote>(note);
  const [selectedPeriod, setSelectedPeriod] = useState<number | 'all'>('all');

  // Sync buffer if parent note changes
  React.useEffect(() => {
    setEditBuffer(note);
    setIsEditing(false);
    setSelectedPeriod('all');
  }, [note.id]);

  // Extract distinct period numbers
  const periodNumbers: number[] = Array.from(
    new Set<number>(note.sections.map((s, idx) => s.periodNumber || (idx + 1)))
  ).sort((a, b) => a - b);

  const handleCopy = () => {
    const textLines: string[] = [
      `# ${note.subject}: ${note.topic}`,
      `Class Level: ${note.academicLevel.toUpperCase()} (${note.subLevel}) | Duration: ${note.duration}`,
      `Teaching Periods: ${note.periodAllocationSummary || `${note.numberOfPeriods || periodNumbers.length} Periods (${note.duration} each)`}`,
      ``,
      `## Overview`,
      note.overview,
      ``,
      `## Learning Objectives`,
      ...note.learningObjectives.map((o) => `* ${o}`),
      ``,
      `## Key Vocabulary & Definitions`,
      ...note.keyVocabulary.map(
        (v) => `* **${v.term}**: ${v.simpleDefinition}${v.exampleSentence ? ` (e.g. "${v.exampleSentence}")` : ''}`
      ),
      ``,
      `## Structured Class Notes (${note.numberOfPeriods || periodNumbers.length} Teaching Periods)`,
      ...note.sections.flatMap((s, idx) => {
        const pNum = s.periodNumber || (idx + 1);
        const pTitle = s.periodTitle || `Period ${pNum}: ${s.title}`;
        return [
          `### [PERIOD ${pNum}] ${pTitle}`,
          s.subTopics && s.subTopics.length > 0 ? `*Focus Areas: ${s.subTopics.join(', ')}*` : '',
          ...s.explanationBulletPoints.map((p) => `* ${p}`),
          s.everydayAnalogyOrExample ? `* Analogy: ${s.everydayAnalogyOrExample}` : '',
          s.teacherTipOrBoardPrompt ? `* Board Prompt: ${s.teacherTipOrBoardPrompt}` : '',
          '',
        ];
      }),
      `## Class Activities`,
      ...note.classActivities.flatMap((a, i) => [
        `### Activity ${i + 1}: ${a.title} (${a.activityType})`,
        `Materials: ${a.materialsNeeded?.join(', ') || 'None'}`,
        ...a.stepByStepInstructions.map((s) => `1. ${s}`),
        `Outcome: ${a.expectedOutcome}`,
        '',
      ]),
      `## Homework`,
      `### ${note.homework.title}`,
      note.homework.instructions,
      ...note.homework.questionsOrTasks.map((q, i) => `${i + 1}. ${q}`),
      note.homework.guidanceForParentsOrSelfStudy
        ? `Note: ${note.homework.guidanceForParentsOrSelfStudy}`
        : '',
      '',
      `## Summary Checklist`,
      ...note.quickSummaryChecklist.map((c) => `[ ] ${c}`),
    ];

    navigator.clipboard.writeText(textLines.filter(Boolean).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportWordDocx = async () => {
    try {
      setIsExportingWord(true);
      await exportLessonNoteToWord(note, printSettings);
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      // Fallback to HTML-based .doc
      handleExportWordDocHTML();
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleExportWordDocHTML = () => {
    const printableElement = document.getElementById('printable-lesson-sheet');
    if (!printableElement) return;
    exportToWordHTML(
      `${note.subject} - ${note.topic}`,
      printableElement.innerHTML,
      `${note.subject}_${note.topic}_ClassNotes.doc`
    );
  };

  const handleSaveEdits = () => {
    onUpdateNote(editBuffer);
    setIsEditing(false);
  };

  const handleCancelEdits = () => {
    setEditBuffer(note);
    setIsEditing(false);
  };

  const getLevelBadgeStyles = (level: string) => {
    switch (level) {
      case 'nursery':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'primary':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'secondary':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action & Export Bar */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Export Options:
          </span>
          <button
            onClick={handleExportWordDocx}
            disabled={isExportingWord}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            title="Download formatted Microsoft Word .docx document"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600" />
            <span>{isExportingWord ? 'Exporting...' : 'Word Document (.docx)'}</span>
          </button>

          <button
            onClick={triggerPrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            title="Print or Save as PDF with clean A4 styling"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
            title="Copy formatted markdown text to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Toggle Edit Mode */}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveEdits}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancelEdits}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              title="Edit notes before exporting or printing"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Notes</span>
            </button>
          )}

          {/* Quick jump to Exam Generation */}
          <button
            onClick={onSwitchToExam}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate Exam from Topic</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Sheet */}
      <div
        id="printable-lesson-sheet"
        className="printable-sheet bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8"
      >
        {/* Document Header / School Banner */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif uppercase">
                {printSettings.schoolName}
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                {[printSettings.termOrSemester, printSettings.academicYear]
                  .filter(Boolean)
                  .join(' • ')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getLevelBadgeStyles(
                  note.academicLevel
                )}`}
              >
                {note.academicLevel} LEVEL: {note.subLevel}
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Subject
              </span>
              <span className="font-bold text-slate-900">{note.subject}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Topic
              </span>
              <span className="font-bold text-slate-900">{note.topic}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Teaching Allocation
              </span>
              <span className="font-bold text-blue-800">
                {note.periodAllocationSummary || `${note.numberOfPeriods || periodNumbers.length} Periods (${note.duration || '45 mins'})`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                Teacher
              </span>
              <span className="font-bold text-slate-900">
                {printSettings.teacherName || 'Subject Teacher'}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Lesson Overview */}
        <div className="avoid-page-break">
          <div className="flex items-center space-x-2 text-blue-900 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold tracking-tight">Lesson Overview</h2>
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={editBuffer.overview}
              onChange={(e) =>
                setEditBuffer({ ...editBuffer, overview: e.target.value })
              }
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              {note.overview}
            </p>
          )}
        </div>

        {/* 2. Learning Objectives */}
        <div className="avoid-page-break">
          <div className="flex items-center space-x-2 text-blue-900 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold tracking-tight">
              Learning Objectives
            </h2>
          </div>
          <p className="text-xs text-slate-500 italic mb-2.5">
            By the end of this lesson, learners should be able to:
          </p>
          <ul className="space-y-2 text-sm text-slate-800">
            {note.learningObjectives.map((obj, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-snug">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Key Vocabulary & Simple Definitions */}
        {note.keyVocabulary && note.keyVocabulary.length > 0 && (
          <div className="avoid-page-break">
            <div className="flex items-center space-x-2 text-teal-900 mb-3">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <h2 className="text-base font-bold tracking-tight">
                Key Vocabulary in Simple Terms
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {note.keyVocabulary.map((vocab, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 space-y-1"
                >
                  <div className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>{vocab.term}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {vocab.simpleDefinition}
                  </p>
                  {vocab.exampleSentence && (
                    <p className="text-[11px] text-slate-500 italic">
                      e.g., "{vocab.exampleSentence}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Structured Class Notes (Divided by Teaching Periods) */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Structured Class Notes by Period</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                    {note.numberOfPeriods || periodNumbers.length} Teaching {note.numberOfPeriods === 1 ? 'Period' : 'Periods'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Discrete sequential teaching sessions with sub-topics, simple bullet-point notes, analogies, and board prompts.
                </p>
              </div>

              {/* Interactive Period Switcher Bar (Whiteboard / Projector Filter) */}
              <div className="no-print flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('all')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedPeriod === 'all'
                      ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  All Periods ({note.sections.length})
                </button>
                {periodNumbers.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPeriod(p)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                      selectedPeriod === p
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>Period {p}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Whiteboard / Focus Mode Notice */}
            {selectedPeriod !== 'all' && (
              <div className="no-print mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-bold">
                    Whiteboard Focus Mode: Period {selectedPeriod} displayed.
                  </span>
                  <span className="text-blue-700 hidden md:inline">
                    Ideal for single-period classroom projectors or board copying.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPeriod('all')}
                  className="font-bold text-blue-700 hover:text-blue-950 underline text-xs cursor-pointer ml-2"
                >
                  Show All Periods
                </button>
              </div>
            )}
          </div>

          {/* Section Cards */}
          {note.sections.map((section, sIdx) => {
            const periodNum = section.periodNumber || (sIdx + 1);
            const isHiddenOnScreen = selectedPeriod !== 'all' && periodNum !== selectedPeriod;

            return (
              <div
                key={sIdx}
                className={`avoid-page-break bg-slate-50/80 p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all space-y-3.5 ${
                  isHiddenOnScreen ? 'hidden print:block print-show-period' : 'block'
                }`}
              >
                {/* Period Header & Badge Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200/90 gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-md bg-blue-600 text-white font-extrabold text-xs tracking-wider shadow-xs uppercase flex items-center gap-1">
                      <CalendarRange className="w-3.5 h-3.5" />
                      <span>PERIOD {periodNum}</span>
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {section.title}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto shadow-2xs">
                    ⏱ {note.duration || '45 mins'}
                  </span>
                </div>

                {/* Focus Areas (Sub-Topics) Chips */}
                {section.subTopics && section.subTopics.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Focus Areas:
                    </span>
                    {section.subTopics.map((st, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200 font-medium shadow-2xs"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                )}

                {/* Explanation Bullet Points */}
                <ul className="space-y-2 text-sm text-slate-800 list-disc list-outside pl-5">
                  {section.explanationBulletPoints.map((point, pIdx) => (
                    <li key={pIdx} className="leading-relaxed">
                      {point}
                    </li>
                  ))}
                </ul>

                {/* Everyday Analogy Callout */}
                {section.everydayAnalogyOrExample && (
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                    <span className="font-bold shrink-0 text-amber-800">💡 Everyday Analogy:</span>
                    <span className="leading-relaxed italic">
                      {section.everydayAnalogyOrExample}
                    </span>
                  </div>
                )}

                {/* Teacher Blackboard Tip / Board Prompt */}
                {section.teacherTipOrBoardPrompt && (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                    <span className="font-bold shrink-0 text-blue-800">📋 Board Prompt:</span>
                    <span className="leading-relaxed font-medium">
                      {section.teacherTipOrBoardPrompt}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Visual Lesson Aid Diagrams Section (PNG format) */}
        <div className="avoid-page-break">
          <LessonDiagramsSection
            note={note}
            onUpdateDiagrams={(diagrams: LessonDiagram[]) => {
              const updated = { ...note, diagrams };
              onUpdateNote(updated);
              setEditBuffer(updated);
            }}
          />
        </div>

        {/* 5. Class Activities */}
        {note.classActivities && note.classActivities.length > 0 && (
          <div className="avoid-page-break space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h2 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Interactive Class Activities</span>
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Hands-On Learning
              </span>
            </div>

            {note.classActivities.map((act, aIdx) => (
              <div
                key={aIdx}
                className="p-4 sm:p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-bold text-sm sm:text-base text-emerald-950">
                    Activity {aIdx + 1}: {act.title}
                  </div>
                  <div className="text-xs font-medium text-emerald-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100">
                      {act.activityType}
                    </span>
                    {act.durationMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{act.durationMinutes}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Materials Needed */}
                {act.materialsNeeded && act.materialsNeeded.length > 0 && (
                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">Materials Needed: </strong>
                    <span>{act.materialsNeeded.join(', ')}</span>
                  </div>
                )}

                {/* Step-by-step instructions */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Step-by-Step Instructions:
                  </span>
                  <ol className="space-y-1.5 text-xs sm:text-sm text-slate-800 list-decimal list-outside pl-5">
                    {act.stepByStepInstructions.map((step, sIdx) => (
                      <li key={sIdx} className="leading-snug">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Expected Outcome */}
                {act.expectedOutcome && (
                  <div className="p-2.5 bg-emerald-100/70 rounded-lg text-xs text-emerald-950 flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Expected Outcome: </strong>
                      {act.expectedOutcome}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 6. Homework & Take-Home Assignment */}
        {note.homework && (
          <div className="avoid-page-break p-5 rounded-2xl border-2 border-amber-300 bg-amber-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200 pb-2">
              <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <span>Homework: {note.homework.title}</span>
              </h2>
              {note.homework.submissionDeadlineNote && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{note.homework.submissionDeadlineNote}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-amber-900 italic">
              {note.homework.instructions}
            </p>

            <ol className="space-y-2 text-xs sm:text-sm text-slate-900 list-decimal list-outside pl-5 font-medium">
              {note.homework.questionsOrTasks.map((task, tIdx) => (
                <li key={tIdx} className="leading-relaxed">
                  {task}
                </li>
              ))}
            </ol>

            {note.homework.guidanceForParentsOrSelfStudy && (
              <div className="mt-2 p-2.5 bg-amber-100/60 rounded-lg text-xs text-amber-900">
                <strong>Parent / Study Guidance: </strong>
                {note.homework.guidanceForParentsOrSelfStudy}
              </div>
            )}
          </div>
        )}

        {/* 7. Key Takeaways & Summary Checklist */}
        {note.quickSummaryChecklist && note.quickSummaryChecklist.length > 0 && (
          <div className="avoid-page-break bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Summary Checklist for Students</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
              {note.quickSummaryChecklist.map((item, cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-start space-x-2 p-2 rounded-md bg-white border border-slate-200"
                >
                  <span className="w-4 h-4 rounded-sm border border-slate-400 shrink-0 mt-0.5 inline-block" />
                  <span className="leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teacher Pedagogy Note (Shown only on screen or as teacher footer) */}
        {note.teacherPedagogyNotes && (
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/80 text-xs text-indigo-950">
            <strong className="text-indigo-900 block mb-1">
              🧑‍🏫 Teacher Coaching Note:
            </strong>
            <p className="leading-relaxed">{note.teacherPedagogyNotes}</p>
          </div>
        )}

        {/* Printable Footer */}
        <div className="print-only pt-6 border-t border-slate-300 text-center text-xs text-slate-500">
          <p>
            {printSettings.schoolName} • Class Notes & Study Guide • Subject: {note.subject} • Topic: {note.topic}
          </p>
        </div>
      </div>
    </div>
  );
};
