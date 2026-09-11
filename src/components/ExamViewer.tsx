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
  Award,
  Clock,
  BookOpen,
} from 'lucide-react';
import { ExamPaper, AcademicLevel, PrintSettings } from '../types';
import { exportExamToWord } from '../utils/docxExport';
import { triggerPrint } from '../utils/printExport';

interface ExamViewerProps {
  exam: ExamPaper | null;
  subject: string;
  topic: string;
  content: string;
  academicLevel: AcademicLevel;
  subLevel: string;
  onGenerateExam: (config: {
    mcqCount: number;
    shortAnswerCount: number;
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

  // Config state
  const [mcqCount, setMcqCount] = useState(5);
  const [shortAnswerCount, setShortAnswerCount] = useState(3);
  const [essayCount, setEssayCount] = useState(2);
  const [difficulty, setDifficulty] = useState<'easy' | 'standard' | 'challenging'>('standard');
  const [showConfig, setShowConfig] = useState(!exam);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await onGenerateExam({
      mcqCount,
      shortAnswerCount,
      essayCount,
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
    const lines: string[] = [
      `${printSettings.schoolName}`,
      `${exam.examTitle}`,
      `Subject: ${exam.subject} | Class: ${exam.academicLevel.toUpperCase()} (${exam.subLevel})`,
      `Time Allowed: ${exam.timeAllowed} | Total Marks: ${exam.totalMarks}`,
      ``,
      `Instructions:`,
      ...exam.generalInstructions.map((i) => `* ${i}`),
      ``,
    ];

    exam.sections.forEach((sec) => {
      lines.push(`## ${sec.sectionCode}: ${sec.sectionTitle}`);
      if (sec.instructions) lines.push(sec.instructions);
      lines.push(``);

      sec.questions.forEach((q) => {
        lines.push(`${q.questionNumber}. ${q.questionText} (${q.marks} marks)`);
        if (q.options) {
          q.options.forEach((opt) => lines.push(`   ${opt}`));
        }
        if (showAnswers) {
          lines.push(`   -> ANSWER: ${q.correctAnswer}`);
          if (q.markingSchemeOrRubric) {
            lines.push(`   -> RUBRIC: ${q.markingSchemeOrRubric}`);
          }
        }
        lines.push(``);
      });
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Exam Generation Configuration Drawer / Panel */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Exam & Assessment Questions Generator
              </h2>
              <p className="text-xs text-slate-500">
                Create print-ready assessments with matching answer keys from the current topic.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Hide Config' : 'Customize Exam Format'}</span>
          </button>
        </div>

        {/* Current Topic Reference Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-400 font-semibold">Subject: </span>
              <strong className="text-slate-900">{subject || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Topic: </span>
              <strong className="text-slate-900">{topic || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-semibold">Level: </span>
              <strong className="text-slate-900 uppercase">
                {academicLevel} ({subLevel})
              </strong>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        {showConfig && (
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Multiple Choice (MCQs)
                </label>
                <select
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Answer Questions
                </label>
                <select
                  value={shortAnswerCount}
                  onChange={(e) => setShortAnswerCount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value={0}>None</option>
                  <option value={2}>2 Questions</option>
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Essay / Problem Solving
                </label>
                <select
                  value={essayCount}
                  onChange={(e) => setEssayCount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value={0}>None</option>
                  <option value={1}>1 Question</option>
                  <option value={2}>2 Questions</option>
                  <option value={3}>3 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as 'easy' | 'standard' | 'challenging')
                  }
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="easy">Foundational / Easy</option>
                  <option value="standard">Standard Level</option>
                  <option value="challenging">Challenging / Advanced</option>
                </select>
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
              : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] shadow-indigo-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Drafting Examination Paper & Rubrics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                {exam ? 'Regenerate Exam Questions' : 'Generate Full Exam Assessment'}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Main Exam Display */}
      {exam && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="no-print bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* View Mode Toggle: Student Paper vs Teacher Marking Guide */}
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
                <span>Student Exam Paper</span>
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
                <span>Teacher Answer Key & Rubrics</span>
              </button>
            </div>

            {/* Export Actions */}
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
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                title="Print assessment or save as PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save as PDF</span>
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

          {/* Printable Exam Paper Sheet */}
          <div
            id="printable-exam-sheet"
            className="printable-sheet bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6"
          >
            {/* Header / School Exam Banner */}
            <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif uppercase">
                {printSettings.schoolName}
              </h1>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                {exam.examTitle}
              </h2>
              {showAnswers && (
                <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-300">
                  ★ Teacher Master Answer Key & Marking Guide ★
                </div>
              )}
            </div>

            {/* Student Info & Exam Parameters Table */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold">Student Name:</span>
                  <span className="border-b border-slate-400 flex-1 h-5 inline-block"></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 font-semibold">Class / Level:</span>
                  <span className="font-bold text-slate-900">
                    {exam.academicLevel.toUpperCase()} ({exam.subLevel || 'Standard'})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 font-semibold">Subject: </span>
                  <strong className="text-slate-900">{exam.subject}</strong>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-semibold">Time Allowed: </span>
                  <strong className="text-slate-900">{exam.timeAllowed}</strong>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-semibold">Total Marks: </span>
                  <strong className="text-slate-900">{exam.totalMarks} Marks</strong>
                </div>
              </div>
            </div>

            {/* General Instructions */}
            {exam.generalInstructions && exam.generalInstructions.length > 0 && (
              <div className="avoid-page-break p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">
                  General Instructions:
                </span>
                <ul className="list-disc list-outside pl-5 space-y-1">
                  {exam.generalInstructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Question Sections */}
            <div className="space-y-6 pt-2">
              {exam.sections.map((sec, sIdx) => (
                <div key={sIdx} className="avoid-page-break space-y-3">
                  {/* Section Title */}
                  <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                    <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                      {sec.sectionCode}: {sec.sectionTitle}
                    </h3>
                    {sec.totalMarksForSection && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                        {sec.totalMarksForSection} Marks
                      </span>
                    )}
                  </div>

                  {sec.instructions && (
                    <p className="text-xs text-slate-600 italic">
                      {sec.instructions}
                    </p>
                  )}

                  {/* Questions List */}
                  <div className="space-y-4 pt-1">
                    {sec.questions.map((q) => (
                      <div
                        key={q.questionNumber}
                        className="avoid-page-break p-3.5 rounded-xl border border-slate-200 bg-white space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-sm font-semibold text-slate-900 leading-snug">
                            <span className="font-bold mr-1.5">
                              {q.questionNumber}.
                            </span>
                            <span>{q.questionText}</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                            [{q.marks} {q.marks === 1 ? 'mark' : 'marks'}]
                          </span>
                        </div>

                        {/* Options for MCQ */}
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-1 text-xs text-slate-800">
                            {q.options.map((opt, optIdx) => (
                              <div
                                key={optIdx}
                                className="p-2 rounded-lg bg-slate-50 border border-slate-200"
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* If NOT showing answers & NOT MCQ: render answer writing lines for print! */}
                        {!showAnswers && (!q.options || q.options.length === 0) && (
                          <div className="pt-2 pb-1 space-y-2">
                            <div className="border-b border-dashed border-slate-300 h-4"></div>
                            <div className="border-b border-dashed border-slate-300 h-4"></div>
                          </div>
                        )}

                        {/* Teacher Master Answer Key */}
                        {showAnswers && (
                          <div className="mt-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="font-bold">Correct Answer:</span>
                              <span className="font-semibold">{q.correctAnswer}</span>
                            </div>
                            {q.markingSchemeOrRubric && (
                              <div className="text-emerald-900 pt-0.5 pl-5">
                                <strong>Marking Rubric: </strong>
                                {q.markingSchemeOrRubric}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Grading Tips for Teachers */}
            {exam.teacherGradingTips && showAnswers && (
              <div className="avoid-page-break p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950">
                <strong className="block mb-1 text-indigo-900">
                  Teacher Marking Advice:
                </strong>
                <p>{exam.teacherGradingTips}</p>
              </div>
            )}

            {/* Printable Footer */}
            <div className="print-only pt-6 border-t border-slate-300 text-center text-xs text-slate-500">
              <p>
                {printSettings.schoolName} • Examination Assessment • Subject: {exam.subject} • Total Marks: {exam.totalMarks}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
