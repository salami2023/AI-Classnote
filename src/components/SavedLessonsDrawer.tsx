import React from 'react';
import { X, BookOpen, Trash2, Calendar, ChevronRight, Bookmark, Image as ImageIcon } from 'lucide-react';
import { LessonNote } from '../types';

interface SavedLessonsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedNotes: LessonNote[];
  onSelectNote: (note: LessonNote) => void;
  onDeleteNote: (id: string) => void;
  onClearAll: () => void;
}

export const SavedLessonsDrawer: React.FC<SavedLessonsDrawerProps> = ({
  isOpen,
  onClose,
  savedNotes,
  onSelectNote,
  onDeleteNote,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs no-print">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Saved Study Guides ({savedNotes.length})
              </h3>
              <p className="text-xs text-slate-500">
                Quickly access previously generated lesson notes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedNotes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No saved study guides yet.</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Generate your first lesson note and it will automatically appear here for easy re-printing.
              </p>
            </div>
          ) : (
            savedNotes.map((note) => {
              const formattedDate = new Date(note.createdAt).toLocaleDateString(
                undefined,
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              );

              return (
                <div
                  key={note.id}
                  className="group relative p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => {
                        onSelectNote(note);
                        onClose();
                      }}
                      className="text-left flex-1"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            note.academicLevel === 'nursery'
                              ? 'bg-amber-100 text-amber-800'
                              : note.academicLevel === 'primary'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {note.academicLevel}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </span>
                        {note.diagrams && note.diagrams.length > 0 && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <ImageIcon className="w-2.5 h-2.5" />
                            <span>PNG Diagram</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 line-clamp-1">
                        {note.topic}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        Subject: {note.subject} • {note.duration}
                      </p>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      title="Delete from saved history"
                      className="text-slate-300 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {savedNotes.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Saved History
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
