import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  FileText,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  CalendarRange,
} from 'lucide-react';
import { AcademicLevel } from '../types';
import { SAMPLE_PRESETS } from '../utils/sampleData';

interface TeacherInputFormProps {
  subject: string;
  setSubject: (val: string) => void;
  topic: string;
  setTopic: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  academicLevel: AcademicLevel;
  setAcademicLevel: (val: AcademicLevel) => void;
  subLevel: string;
  setSubLevel: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  numberOfPeriods: number;
  setNumberOfPeriods: (val: number) => void;
  tone: string;
  setTone: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const TeacherInputForm: React.FC<TeacherInputFormProps> = ({
  subject,
  setSubject,
  topic,
  setTopic,
  content,
  setContent,
  academicLevel,
  setAcademicLevel,
  subLevel,
  setSubLevel,
  duration,
  setDuration,
  numberOfPeriods,
  setNumberOfPeriods,
  tone,
  setTone,
  onGenerate,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Suggested subjects based on level
  const subjectSuggestions: Record<AcademicLevel, string[]> = {
    nursery: [
      'Health Habits & Cleanliness',
      'Letter Sounds & Phonics',
      'Numbers & Shapes Fun',
      'Rhymes & Storytelling',
      'Social Behavior & Sharing',
      'Sensory Science & Colors',
    ],
    primary: [
      'Basic Science & Tech',
      'Mathematics',
      'English Language',
      'Social Studies',
      'Agricultural Science',
      'Computer Studies',
      'Civic Education',
    ],
    secondary: [
      'Biology',
      'Physics',
      'Chemistry',
      'Mathematics / Algebra',
      'English Literature',
      'Economics',
      'Government & Civics',
      'Geography',
    ],
  };

  const subLevelOptions: Record<AcademicLevel, string[]> = {
    nursery: [
      'Reception 1',
      'Reception 2',
      'KG 1',
      'KG 2',
      'Nursery',
    ],
    primary: [
      'Basic 1',
      'Basic 2',
      'Basic 3',
      'Basic 4',
      'Basic 5',
      'Basic 6',
    ],
    secondary: [
      'JSS 1',
      'JSS 2',
      'JSS 3',
      'SS 1',
      'SS 2',
      'SS 3',
    ],
  };

  const handleLevelChange = (level: AcademicLevel) => {
    setAcademicLevel(level);
    setSubLevel(subLevelOptions[level][0]);
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setAcademicLevel(preset.academicLevel);
      setSubLevel(preset.subLevel);
      setSubject(preset.subject);
      setTopic(preset.topic);
      setDuration(preset.duration);
      if (preset.numberOfPeriods) {
        setNumberOfPeriods(preset.numberOfPeriods);
      }
      setContent(preset.content);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
      {/* Header & Preset Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Lesson Configuration & Topic Details</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the class level and topic to generate structured notes with bullet points, activities & homework.
          </p>
        </div>

        {/* Quick Sample Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Try Sample:
          </span>
          <div className="flex gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleLoadPreset('nursery-body')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
            >
              Nursery
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('primary-water-cycle')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
            >
              Primary
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset('secondary-photosynthesis')}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors"
            >
              Secondary
            </button>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="space-y-4"
      >
        {/* Step 1: Academic Level Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            1. Select Academic Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Nursery */}
            <button
              type="button"
              onClick={() => handleLevelChange('nursery')}
              className={`p-3 rounded-xl border text-left transition-all ${
                academicLevel === 'nursery'
                  ? 'border-amber-400 bg-amber-50/70 ring-2 ring-amber-400/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Ages 3 - 5
                </span>
                {academicLevel === 'nursery' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">Nursery / Early Years</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Ultra-simple words, rhymes, sensory games, colors & parent-guided fun tasks.
              </p>
            </button>

            {/* Primary */}
            <button
              type="button"
              onClick={() => handleLevelChange('primary')}
              className={`p-3 rounded-xl border text-left transition-all ${
                academicLevel === 'primary'
                  ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-400/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Ages 6 - 11
                </span>
                {academicLevel === 'primary' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">Primary / Elementary</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Clear bullet points, daily life analogies, hands-on group activities & homework.
              </p>
            </button>

            {/* Secondary */}
            <button
              type="button"
              onClick={() => handleLevelChange('secondary')}
              className={`p-3 rounded-xl border text-left transition-all ${
                academicLevel === 'secondary'
                  ? 'border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-400/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  Ages 12 - 18
                </span>
                {academicLevel === 'secondary' && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <div className="font-bold text-sm text-slate-900">Secondary / High School</div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Disciplinary rigor explained in simple steps, critical thinking, labs & analytical sets.
              </p>
            </button>
          </div>
        </div>

        {/* Sub-level, Duration & Number of Periods Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Class Grade / Sub-Level
            </label>
            <select
              value={subLevel}
              onChange={(e) => setSubLevel(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {subLevelOptions[academicLevel].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
              {subLevel && !subLevelOptions[academicLevel].includes(subLevel) && (
                <option value={subLevel}>{subLevel}</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Period Duration</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="30 mins">30 mins (Nursery / Short)</option>
              <option value="40 mins">40 mins (Standard period)</option>
              <option value="45 mins">45 mins (Recommended)</option>
              <option value="60 mins">60 mins (Extended single)</option>
              <option value="80 mins (Double Period)">80 mins (Double practical period)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CalendarRange className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-slate-800">Teaching Periods</span>
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                {numberOfPeriods} {numberOfPeriods === 1 ? 'Period' : 'Periods'}
              </span>
            </label>
            <select
              value={numberOfPeriods}
              onChange={(e) => setNumberOfPeriods(parseInt(e.target.value) || 1)}
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-slate-800"
            >
              <option value={1}>1 Period (Single Lesson)</option>
              <option value={2}>2 Periods (Standard 2-Part Unit)</option>
              <option value={3}>3 Periods (3-Day Unit / Week Block)</option>
              <option value={4}>4 Periods (Comprehensive 4-Part Module)</option>
              <option value={5}>5 Periods (Full 5-Day Teaching Week)</option>
              <option value={6}>6 Periods (Extended Deep Dive Unit)</option>
            </select>
          </div>
        </div>

        {/* Quick Periods Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 -mt-1 p-2 bg-slate-50/80 rounded-lg border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>Select Periods:</span>
          </span>
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setNumberOfPeriods(p)}
              className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                numberOfPeriods === p
                  ? 'bg-blue-600 text-white shadow-xs scale-102'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {p} {p === 1 ? 'Period' : 'Periods'}
            </button>
          ))}
        </div>

        {/* Subject with Quick Suggestions */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            2. Subject
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Basic Science & Technology, English Language, Mathematics..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 self-center">Suggestions:</span>
            {subjectSuggestions[academicLevel].slice(0, 5).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSubject(s)}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors ${
                  subject === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            3. Topic & Subtopic
          </label>
          <input
            type="text"
            required
            placeholder="e.g. The Water Cycle and States of Matter, Living Things, Parts of Speech..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 font-medium"
          />
        </div>

        {/* Content of the Topic (Textarea) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>4. Content of the Topic / Syllabus Notes</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Optional: paste raw textbook text or curriculum points
            </span>
          </div>
          <textarea
            rows={3}
            placeholder="Type or paste textbook notes, syllabus bullet points, definitions, or specific facts you want included. If left empty, AI will generate complete, curriculum-aligned content for you."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
        </div>

        {/* Advanced Pedagogical Preferences */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Teaching Style & Tone Preferences</span>
          </button>

          {showAdvanced && (
            <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Instructional Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="engaging and conversational">Simple, Engaging & Conversational (Best for comprehension)</option>
                  <option value="storytelling with rhymes">Storytelling & Rhymes (Ideal for Nursery/Lower Primary)</option>
                  <option value="hands-on and kinesthetic">Hands-on & Experiment-focused</option>
                  <option value="structured and academic">Structured & Exam-Oriented (Upper Secondary)</option>
                </select>
              </div>

              <div className="text-xs text-slate-600 flex items-center">
                <p className="leading-relaxed">
                  The AI is instructed to <strong className="text-slate-900">always use simple and basic terms</strong> and format explanations in <strong className="text-slate-900">clean bullet points</strong> with interactive class activities and homework.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating || !subject.trim() || !topic.trim()}
            className={`w-full py-3 px-5 rounded-xl font-bold text-sm text-white flex items-center justify-center space-x-2 transition-all shadow-md ${
              isGenerating || !subject.trim() || !topic.trim()
                ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] shadow-blue-500/25'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Structured Study Guide...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Class Notes, Activities & Homework</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
