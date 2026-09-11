import React from 'react';
import {
  BookOpen,
  FileQuestion,
  School,
  Bookmark,
  Printer,
  Sparkles,
} from 'lucide-react';
import { AcademicLevel } from '../types';

interface HeaderProps {
  activeTab: 'notes' | 'exams';
  setActiveTab: (tab: 'notes' | 'exams') => void;
  academicLevel: AcademicLevel;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  academicLevel,
  savedCount,
  onOpenSaved,
  onOpenSettings,
  onPrint,
}) => {
  const getLevelBadge = () => {
    switch (academicLevel) {
      case 'nursery':
        return {
          label: 'Nursery / Early Years (Reception 1-2, KG 1-2, Nursery)',
          bgColor: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'primary':
        return {
          label: 'Primary / Elementary (Basic 1 - 6)',
          bgColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'secondary':
        return {
          label: 'Secondary / High School (JSS 1-3, SS 1-3)',
          bgColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
        };
    }
  };

  const badge = getLevelBadge();

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Beacon Hill Schools
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                  Educator Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Class Notes, Study Guides & Printable Exam Generator
              </p>
            </div>
          </div>

          {/* Center: Main View Navigation */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="tab-notes-btn"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notes'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lesson Notes & Guide</span>
            </button>
            <button
              id="tab-exams-btn"
              onClick={() => setActiveTab('exams')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'exams'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Exam Questions Generator</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            <div
              className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${badge.bgColor}`}
            >
              {badge.label}
            </div>

            <button
              id="school-settings-btn"
              onClick={onOpenSettings}
              title="Customize School Header on Exports"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <School className="w-4 h-4" />
            </button>

            <button
              id="saved-history-btn"
              onClick={onOpenSaved}
              title="Saved Lessons History"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <Bookmark className="w-4 h-4" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              id="print-export-btn"
              onClick={onPrint}
              className="hidden sm:inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
