import React, { useState } from 'react';
import {
  FileQuestion,
  Printer,
  FileDown,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Layers,
  FileText,
} from 'lucide-react';
import { ExamPaper, AcademicLevel, PrintSettings } from '../types';
import { exportExamToWord } from '../utils/docxExport';
import { triggerPrint } from '../utils/printExport';
import { DEFAULT_CREST_DATA_URL } from '../utils/schoolLogo';

interface ExamViewerProps {
  exam: ExamPaper | null;
  subject: string;
  topic: string;
  content: string;
  academicLevel: AcademicLevel;
  subLevel: string;
  onGenerateExam: (config: {
    mcqCount: number;
    shortAnswerCount?: number;
    essayCount: number;
    difficulty: 'easy' | 'standard' | 'challenging';
  }) => Promise<void>;
  isGenerating: boolean;
  printSettings: PrintSettings;
}

export const ExamViewer: React.FC<ExamViewerProps> = ({
  exam,
  subject,
  topic,
  academicLevel,
  subLevel,
  onGenerateExam,
  isGenerating,
  printSettings,
}) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [viewMode, setViewMode] = useState<'a4-sheets' | 'single-sheet'>('a4-sheets');

  // Exam Generation Config: defaults to 30 MCQs and 8 Theory questions
  const [mcqCount, setMcqCount] = useState<number>(30);
  const [theoryCount, setTheoryCount] = useState<number>(8);
  const [difficulty, setDifficulty] = useState<'easy' | 'standard' | 'challenging'>('standard');
  const [showConfig, setShowConfig] = useState(!exam);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await onGenerateExam({
      mcqCount,
      shortAnswerCount: 0,
      essayCount: theoryCount,
      difficulty,
    });
    setShowConfig(false);
  };

  const handleExportWord = async (includeAnswers: boolean) => {
    if (!exam) return;
    try {
      setIsExportingWord(true);
      await exportExamToWord(exam, includeAnswers, printSettings);
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleCopyText = () => {
    if (!exam) return;
    const schoolName = printSettings.schoolName || exam.schoolName || 'BEACON HILL SCHOOLS';
    const termOrSession = `${printSettings.termOrSemester || exam.termOrSemester || 'First Term Examination'} | ${printSettings.academicYear || exam.academicSession || '2025/2026 Academic Session'}`;

    const lines: string[] = [
      schoolName.toUpperCase(),
      termOrSession,
      exam.examTitle,
      `Subject: ${exam.subject} | Class: ${exam.academicLevel.toUpperCase()} (${exam.subLevel || 'Standard'})`,
      `Time Allowed: ${exam.timeAllowed} | Total Marks: ${exam.totalMarks}`,
      '',
      'GENERAL INSTRUCTIONS:',
      ...exam.generalInstructions.map((i) => `* ${i}`),
      '',
    ];

    exam.sections.forEach((sec) => {
      lines.push(`=== ${sec.sectionCode}: ${sec.sectionTitle} ===`);
      if (sec.instructions) lines.push(sec.instructions);
      lines.push('');

      sec.questions.forEach((q) => {
        lines.push(`${q.questionNumber}. ${q.questionText} (${q.marks} marks)`);
        if (q.options && q.options.length > 0) {
          q.options.forEach((opt) => lines.push(`   ${opt}`));
        }
        if (showAnswers) {
          lines.push(`   -> ANSWER: ${q.correctAnswer}`);
          if (q.markingSchemeOrRubric) {
            lines.push(`   -> RUBRIC: ${q.markingSchemeOrRubric}`);
          }
        }
        lines.push('');
      });
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeLogo = printSettings.schoolLogoUrl || exam?.schoolLogoUrl || DEFAULT_CREST_DATA_URL;
  const schoolName = printSettings.schoolName || exam?.schoolName || 'BEACON HILL SCHOOLS';
  const termOrSession = `${printSettings.termOrSemester || exam?.termOrSemester || 'First Term Examination'} • ${printSettings.academicYear || exam?.academicSession || '2025/2026 Academic Session'}`;

  // Separate sections into Objective (Section A, MCQs) and Theory (Section B, Theory)
  const sectionA = exam?.sections.find((s) => s.sectionCode.toLowerCase().includes('a') || s.questions.some((q) => q.options && q.options.length > 0)) || exam?.sections[0];
  const sectionB = exam?.sections.find((s) => s !== sectionA) || exam?.sections[1];

  return (
    <div className="space-y-5">
      {/* Exam Generation Configuration Drawer */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Official 2-Page A4 Examination Paper Generator
              </h2>
              <p className="text-xs text-slate-500">
                Standard format: 30 Multiple Choice Questions (Page 1) + 8 Theory Questions (Page 2) in font size 11.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Hide Settings' : 'Customize Exam Format'}</span>
          </button>
        </div>

        {/* Current Topic & Syllabus Reference Banner */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span className="text-slate-400 font-medium">Subject: </span>
              <strong className="text-slate-900">{subject || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Primary Topic: </span>
              <strong className="text-slate-900">{topic || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Class: </span>
              <strong className="text-slate-900 uppercase">
                {academicLevel} ({subLevel || 'Standard'})
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold">
              Paper: ISO A4 (Max 2 Pages)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[11px] font-semibold">
              Font Size: 11pt
            </span>
          </div>
        </div>

        {/* Customization Options */}
        {showConfig && (
          <div className="space-y-3 mb-4 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section A: Multiple Choice Questions (Page 1)
                </label>
                <select
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value={30}>30 Questions (Official Standard)</option>
                  <option value={20}>20 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Arranged in a space-optimized 2-column grid.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section B: Theory / Problem Solving (Page 2)
                </label>
                <select
                  value={theoryCount}
                  onChange={(e) => setTheoryCount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value={8}>8 Questions (Official Standard)</option>
                  <option value={6}>6 Questions</option>
                  <option value={5}>5 Questions</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Detailed theoretical questions with rubric.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Standard & Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as 'easy' | 'standard' | 'challenging')
                  }
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-medium"
                >
                  <option value="standard">Standard Examination</option>
                  <option value="easy">Foundational / Revision</option>
                  <option value="challenging">Advanced / Mock Exam</option>
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Covers all generated class note topics.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Generate Exam Button */}
        <button
          type="button"
          onClick={() => handleGenerate()}
          disabled={isGenerating || !subject || !topic}
          className={`w-full py-3 px-5 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 transition-all shadow-md ${
            isGenerating || !subject || !topic
              ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
              : 'bg-blue-800 hover:bg-blue-900 active:scale-[0.99] shadow-blue-800/20'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Drafting Official 2-Page A4 Exam (30 MCQs + 8 Theory)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                {exam
                  ? 'Regenerate Exam (30 MCQs + 8 Theory covering all topics)'
                  : 'Generate Official 2-Page Exam (30 MCQs + 8 Theory)'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Exam Display */}
      {exam && (
        <div className="space-y-4">
          {/* Syllabus Coverage Tag Banner */}
          {exam.coveredTopics && exam.coveredTopics.length > 0 && (
            <div className="no-print p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-900">
                  Comprehensive Syllabus Coverage:
                </span>
                <span className="text-emerald-800">
                  All 30 MCQs and 8 Theory questions cover the entire syllabus of generated class notes:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {exam.coveredTopics.map((top, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white text-emerald-900 border border-emerald-300 font-semibold text-[11px]"
                  >
                    {top}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="no-print bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Left: View Mode Toggle & Answer Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAnswers(false)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !showAnswers
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Student Paper (Blank)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswers(true)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    showAnswers
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Teacher Marking Key</span>
                </button>
              </div>

              {/* View Presentation Switcher: 2-Page A4 vs Continuous */}
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('a4-sheets')}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'a4-sheets'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Show exact 2 A4 paper sheets layout"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>A4 2-Page View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('single-sheet')}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'single-sheet'
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Show single continuous view"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Continuous</span>
                </button>
              </div>
            </div>

            {/* Right: Export and Print Actions */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleExportWord(false)}
                disabled={isExportingWord}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                title="Download Student Exam Paper as Microsoft Word .docx"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Word (Student Paper)</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportWord(true)}
                disabled={isExportingWord}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="Download Teacher Answer Key as Microsoft Word .docx"
              >
                <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Word (Answer Key)</span>
              </button>

              <button
                type="button"
                onClick={triggerPrint}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                title="Print assessment or save as PDF (Formatted for 2 A4 Pages)"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print A4 (2 Pages)</span>
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Printable Exam Paper Container */}
          <div
            id="printable-exam-sheet"
            className={`space-y-6 ${viewMode === 'a4-sheets' ? 'space-y-8' : ''}`}
          >
            {/* ========================================================= */}
            {/* PAGE 1: OBJECTIVE QUESTIONS (30 MCQS)                     */}
            {/* ========================================================= */}
            <div className="printable-sheet exam-page-1 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[1100px] print:min-h-0 print:border-none print:shadow-none print:p-0">
              <div className="space-y-3">
                {/* Official Exam Heading with School Logo, School Name, Subject, Term/Session */}
                <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
                  {/* School Logo */}
                  {activeLogo && (
                    <div className="flex justify-center pb-1">
                      <img
                        src={activeLogo}
                        alt="School Crest Logo"
                        className="w-14 h-14 object-contain mx-auto print:w-12 print:h-12"
                      />
                    </div>
                  )}

                  {/* School Name */}
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-serif uppercase print:text-base">
                    {schoolName}
                  </h1>

                  {/* Term and Academic Session */}
                  <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide print:text-xs">
                    {termOrSession}
                  </h2>

                  {/* Subject and Title */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                    <span className="text-xs sm:text-sm font-extrabold text-blue-900 uppercase tracking-tight print:text-xs">
                      SUBJECT: {exam.subject}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase print:text-xs">
                      {exam.examTitle}
                    </span>
                  </div>

                  {showAnswers && (
                    <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-300 mt-1">
                      ★ Teacher Master Answer Key & Marking Guide ★
                    </div>
                  )}
                </div>

                {/* Student Details and Parameters Table */}
                <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50/50 space-y-1.5 text-[11px] leading-tight">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-600 font-semibold">Student Name:</span>
                      <span className="border-b border-slate-400 flex-1 h-4 inline-block"></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-slate-600 font-semibold">Class:</span>
                      <span className="font-bold text-slate-900">
                        {exam.academicLevel.toUpperCase()} ({exam.subLevel || 'Standard'})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-500">Date:</span>
                      <span className="border-b border-slate-400 inline-block w-24 ml-1 h-3.5"></span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Time Allowed: </span>
                      <strong className="text-slate-900">{exam.timeAllowed}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-600 font-medium">Total Marks: </span>
                      <strong className="text-slate-900">{exam.totalMarks} Marks</strong>
                    </div>
                  </div>
                </div>

                {/* General Instructions */}
                {exam.generalInstructions && exam.generalInstructions.length > 0 && (
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700 leading-snug">
                    <span className="font-bold text-slate-900 mr-1.5">Instructions:</span>
                    <span>{exam.generalInstructions.join(' • ')}</span>
                  </div>
                )}

                {/* Section A Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-1 pt-1">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                    {sectionA?.sectionCode || 'SECTION A'}: {sectionA?.sectionTitle || 'MULTIPLE CHOICE QUESTIONS'} (30 MARKS)
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    30 Questions • 1 Mark Each
                  </span>
                </div>
                {sectionA?.instructions && (
                  <p className="text-[11px] text-slate-600 italic -mt-1">
                    {sectionA.instructions}
                  </p>
                )}

                {/* STRICTLY NO TOPIC HEADINGS: Directly write out the 30 MCQs in Font Size 11 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 print:grid-cols-2 exam-mcq-grid text-[11pt] leading-[1.32] pt-1">
                  {sectionA?.questions.map((q) => (
                    <div
                      key={q.questionNumber}
                      className="avoid-page-break text-[11pt] text-slate-900 leading-[1.32] pb-1 border-b border-slate-100 last:border-none"
                    >
                      {/* Question Stem in Font Size 11 */}
                      <div className="flex items-baseline gap-1">
                        <span className="font-bold shrink-0">{q.questionNumber}.</span>
                        <span className="font-normal">{q.questionText}</span>
                      </div>

                      {/* Options in 2 sub-columns */}
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-3 pt-0.5 text-[10.5pt] text-slate-800">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="truncate" title={opt}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Teacher Master Answer Mode */}
                      {showAnswers && (
                        <div className="mt-0.5 ml-3 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10pt] font-semibold text-emerald-800 flex items-center gap-1.5">
                          <span>Ans:</span>
                          <strong>{q.correctAnswer}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Page 1 Bottom Divider / Turn Over Notice */}
              <div className="pt-3 border-t border-slate-300 text-center text-[10.5pt] font-bold text-slate-600 uppercase tracking-wider mt-4">
                [ Page 1 of 2 — Turn Over for Section B: Theory Questions ]
              </div>
            </div>

            {/* ========================================================= */}
            {/* PAGE 2: THEORY QUESTIONS (8 QUESTIONS)                    */}
            {/* ========================================================= */}
            <div className="printable-sheet exam-page-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[1100px] print:min-h-0 print:border-none print:shadow-none print:p-0">
              <div className="space-y-3">
                {/* Page 2 Header Banner */}
                <div className="border-b-2 border-slate-900 pb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {activeLogo && (
                      <img
                        src={activeLogo}
                        alt="Logo"
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="font-black text-slate-900 uppercase">
                      {schoolName}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="font-extrabold text-blue-900 uppercase">
                      {exam.subject}
                    </span>
                  </div>

                  <div className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                    Page 2 of 2 • Section B (Theory)
                  </div>
                </div>

                {/* Section B Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-1 pt-1">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight">
                    {sectionB?.sectionCode || 'SECTION B'}: {sectionB?.sectionTitle || 'THEORY QUESTIONS'} ({sectionB?.totalMarksForSection || 70} MARKS)
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    8 Theory Questions
                  </span>
                </div>
                {sectionB?.instructions && (
                  <p className="text-[11px] text-slate-600 italic -mt-1">
                    {sectionB.instructions}
                  </p>
                )}

                {/* STRICTLY NO TOPIC HEADINGS: Directly write out the 8 Theory Questions in Font Size 11 */}
                <div className="space-y-3 pt-1">
                  {sectionB?.questions.map((q) => (
                    <div
                      key={q.questionNumber}
                      className="avoid-page-break text-[11pt] leading-[1.38] text-slate-900 pb-2 border-b border-slate-200 last:border-none"
                    >
                      {/* Question Text in Font Size 11 */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-bold mr-1.5">{q.questionNumber}.</span>
                          <span className="font-normal">{q.questionText}</span>
                        </div>
                        <span className="font-bold text-[10.5pt] text-slate-700 shrink-0">
                          [{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}]
                        </span>
                      </div>

                      {/* Lined Answer Space for Student Paper */}
                      {!showAnswers && (
                        <div className="pt-1 space-y-1.5">
                          <div className="border-b border-dashed border-slate-300 h-3.5"></div>
                          <div className="border-b border-dashed border-slate-300 h-3.5"></div>
                        </div>
                      )}

                      {/* Teacher Master Marking Scheme & Rubric */}
                      {showAnswers && (
                        <div className="mt-1.5 p-2 rounded bg-emerald-50 border border-emerald-200 text-[10pt] text-emerald-950 space-y-0.5">
                          <div className="flex items-baseline gap-1.5">
                            <strong className="text-emerald-900">Marking Guide:</strong>
                            <span>{q.correctAnswer}</span>
                          </div>
                          {q.markingSchemeOrRubric && (
                            <div className="text-[9.5pt] text-emerald-800">
                              <em>Rubric: {q.markingSchemeOrRubric}</em>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Page 2 Bottom End Notice */}
              <div className="pt-4 border-t-2 border-slate-900 text-center text-[10.5pt] font-black text-slate-900 uppercase tracking-wider mt-6">
                [ END OF EXAMINATION PAPER — TOTAL MARKS: {exam.totalMarks} ]
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
