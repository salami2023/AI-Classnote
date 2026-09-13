import React, { useRef } from 'react';
import { X, School, Check, RotateCcw, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { PrintSettings } from '../types';
import { DEFAULT_CREST_DATA_URL } from '../utils/schoolLogo';

interface PrintHeaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrintSettings;
  onSave: (newSettings: PrintSettings) => void;
}

export const PrintHeaderSettingsModal: React.FC<PrintHeaderSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [form, setForm] = React.useState<PrintSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setForm(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: PrintSettings = {
      schoolName: 'Beacon Hill Schools',
      teacherName: 'Subject Instructor',
      termOrSemester: 'First Term',
      academicYear: '2025 / 2026 Academic Session',
      studentNameLine: true,
      dateLine: true,
      scoreBox: true,
      schoolLogoUrl: DEFAULT_CREST_DATA_URL,
    };
    setForm(defaultSettings);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (< 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setForm((prev) => ({ ...prev, schoolLogoUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  const activeLogo = form.schoolLogoUrl || DEFAULT_CREST_DATA_URL;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                School Header & Logo Settings
              </h3>
              <p className="text-xs text-slate-500">
                Configure your school crest, institution name, and term session.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* School Logo Section */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              School Crest / Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border-2 border-slate-200 p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
                <img
                  src={activeLogo}
                  alt="School Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Logo Image</span>
                  </button>

                  {form.schoolLogoUrl && form.schoolLogoUrl !== DEFAULT_CREST_DATA_URL && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, schoolLogoUrl: DEFAULT_CREST_DATA_URL }))}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center gap-1"
                      title="Reset to Official Academic Crest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Use Default Crest</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  High-resolution PNG, JPEG or SVG. Embedded at the heading of exam papers and exports.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              School / Institution Name
            </label>
            <input
              type="text"
              required
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
              placeholder="e.g. Beacon Hill Schools"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
              Teacher / Instructor Name
            </label>
            <input
              type="text"
              value={form.teacherName}
              onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
              placeholder="e.g. Mr. Emmanuel Okon"
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Term / Examination
              </label>
              <input
                type="text"
                value={form.termOrSemester}
                onChange={(e) =>
                  setForm({ ...form, termOrSemester: e.target.value })
                }
                placeholder="e.g. First Term Examination"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                Academic Session / Year
              </label>
              <input
                type="text"
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
                placeholder="e.g. 2025/2026 Session"
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Save School Header</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
