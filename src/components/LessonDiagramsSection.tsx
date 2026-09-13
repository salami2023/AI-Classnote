import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Maximize2,
  X,
  Upload,
  RefreshCw,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { LessonNote, LessonDiagram } from '../types';
import {
  convertSvgToPng,
  downloadPngFile,
  copyPngToClipboard,
  readUploadedFileAsPngDataUrl,
} from '../utils/diagramRenderer';
import { getEducationalDiagramForTopic } from '../utils/diagramLibrary';

interface LessonDiagramsSectionProps {
  note: LessonNote;
  onUpdateDiagrams: (diagrams: LessonDiagram[]) => void;
}

export const LessonDiagramsSection: React.FC<LessonDiagramsSectionProps> = ({
  note,
  onUpdateDiagrams,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fullscreenDiagram, setFullscreenDiagram] = useState<LessonDiagram | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCustomPromptModal, setShowCustomPromptModal] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const diagrams = note.diagrams || [];

  const handleDownload = (diag: LessonDiagram, index: number) => {
    const filename = `${note.subject}_${note.topic}_diagram_${index + 1}`.replace(/\s+/g, '_');
    downloadPngFile(diag.pngBase64, filename);
    showNotice('PNG diagram downloaded to your device!');
  };

  const handleCopy = async (diag: LessonDiagram) => {
    const success = await copyPngToClipboard(diag.pngBase64);
    if (success) {
      setCopiedId(diag.id);
      showNotice('PNG copied to clipboard! Paste into Word, Slides, or Printout.');
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      // Fallback: trigger download if clipboard permissions are restricted in iframe
      handleDownload(diag, 0);
    }
  };

  const showNotice = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDelete = (id: string) => {
    const updated = diagrams.filter((d) => d.id !== id);
    onUpdateDiagrams(updated);
    showNotice('Diagram removed from lesson note.');
  };

  /**
   * Generates a curriculum-aligned lesson aid diagram (converted to standalone PNG).
   */
  const handleGenerateStandardDiagram = async () => {
    setIsGenerating(true);
    try {
      // 1. Check if Gemini server-side diagram is requested or use standard curriculum vector
      const spec = getEducationalDiagramForTopic(
        note.topic,
        note.subject,
        note.academicLevel,
        note.subLevel
      );

      // 2. Convert SVG into high-res PNG
      const pngBase64 = await convertSvgToPng(spec.svgMarkup, 800, 500);

      const newDiagram: LessonDiagram = {
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

      onUpdateDiagrams([...diagrams, newDiagram]);
      showNotice('Lesson aid diagram generated in PNG format & attached to class note!');
    } catch (err) {
      console.error('Error generating diagram:', err);
      showNotice('Failed to generate diagram. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Generates a custom diagram using Gemini AI endpoint and converts to PNG.
   */
  const handleGenerateCustomDiagram = async () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    setShowCustomPromptModal(false);

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: note.topic,
          subject: note.subject,
          academicLevel: note.academicLevel,
          subLevel: note.subLevel,
          diagramPrompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Server diagram generation failed');
      }

      const data = await response.json();
      const svgCode = data.svgMarkup || getEducationalDiagramForTopic(note.topic, note.subject, note.academicLevel).svgMarkup;
      const pngBase64 = await convertSvgToPng(svgCode, 800, 500);

      const newDiagram: LessonDiagram = {
        id: `diag_${Date.now()}`,
        title: data.title || `${note.topic} Visual Aid`,
        caption: data.caption || `Diagram for ${note.topic}`,
        diagramType: data.diagramType || 'AI Lesson Aid',
        keyLabels: data.keyLabels || [],
        teachingPrompt: data.teachingPrompt || '',
        pngBase64,
        width: 800,
        height: 500,
        source: 'gemini-svg',
        createdAt: new Date().toISOString(),
      };

      onUpdateDiagrams([...diagrams, newDiagram]);
      setCustomPrompt('');
      showNotice('Custom PNG diagram generated and attached!');
    } catch (err) {
      console.warn('Custom diagram API error, falling back to curriculum library:', err);
      // Fallback
      await handleGenerateStandardDiagram();
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handles teacher uploading a local PNG image.
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const pngBase64 = await readUploadedFileAsPngDataUrl(file);
      const newDiagram: LessonDiagram = {
        id: `diag_upload_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        caption: 'Teacher uploaded visual lesson aid.',
        diagramType: 'Teacher Image (PNG)',
        pngBase64,
        source: 'upload',
        createdAt: new Date().toISOString(),
      };

      onUpdateDiagrams([...diagrams, newDiagram]);
      showNotice('Uploaded image converted to PNG and saved with class note!');
    } catch (err) {
      console.error('File upload error:', err);
      showNotice('Could not process the uploaded file. Please select a PNG or JPG image.');
    }
  };

  return (
    <div id="lesson-diagrams-container" className="my-8 border-t border-b border-blue-100 py-6 bg-slate-50/50 rounded-2xl px-4 sm:px-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Visual Lesson Aid Diagrams <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full ml-1">PNG Format</span>
            </h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Indispensable classroom aids for visual learners. Saved directly as high-resolution PNG data within this lesson note (no broken links), ready for printing and Word export.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleGenerateStandardDiagram}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            title="Generate curriculum visual aid"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {diagrams.length === 0 ? 'Generate Lesson Diagram' : 'Add Another Diagram'}
          </button>

          <button
            onClick={() => setShowCustomPromptModal(true)}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium shadow-sm transition-colors disabled:opacity-50"
            title="Prompt AI for custom diagram topic"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            Custom Prompt
          </button>

          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium shadow-sm cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-gray-500" />
            Upload PNG
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Temporary Toast Alert */}
      {statusMessage && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-center justify-between animate-fadeIn">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-blue-500 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Diagrams List or Empty State */}
      {diagrams.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            No diagram added yet for this lesson note
          </h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
            Diagrams act as powerful visual aids for students. Click below to generate an educational PNG diagram matching &quot;{note.topic}&quot; to save and export along with this note.
          </p>
          <button
            onClick={handleGenerateStandardDiagram}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate Lesson Aid Diagram (PNG)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {diagrams.map((diag, index) => (
            <div
              key={diag.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {/* Card Header */}
              <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {diag.title}
                  </h4>
                  {diag.diagramType && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {diag.diagramType}
                    </span>
                  )}
                </div>

                {/* Card Top Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDownload(diag, index)}
                    className="p-1.5 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Download standalone PNG file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(diag)}
                    className="p-1.5 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Copy PNG to clipboard"
                  >
                    {copiedId === diag.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setFullscreenDiagram(diag)}
                    className="p-1.5 rounded-md text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Zoom in full size"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(diag.id)}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove diagram"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PNG Image Display Container */}
              <div className="p-4 sm:p-6 bg-white flex flex-col items-center">
                <div className="relative group w-full max-w-3xl rounded-xl border border-gray-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
                  {/* The standalone PNG data URI */}
                  <img
                    src={diag.pngBase64}
                    alt={diag.title}
                    className="w-full h-auto max-h-[480px] object-contain cursor-pointer transition-transform duration-200 group-hover:scale-[1.01]"
                    onClick={() => setFullscreenDiagram(diag)}
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 pointer-events-none">
                    <span className="px-3 py-1.5 rounded-lg bg-white/90 text-gray-900 text-xs font-semibold shadow flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" /> Click to Zoom
                    </span>
                  </div>
                </div>

                {/* Caption / Teacher Figure Note */}
                {diag.caption && (
                  <p className="text-xs sm:text-sm text-gray-600 italic text-center mt-3 max-w-2xl">
                    <span className="font-semibold text-gray-700 not-italic">Figure Note: </span>
                    {diag.caption}
                  </p>
                )}
              </div>

              {/* Pedagogical Metadata Box */}
              {(diag.keyLabels?.length || diag.teachingPrompt) && (
                <div className="px-5 py-3.5 bg-slate-50/70 border-t border-gray-200 space-y-2.5 text-xs sm:text-sm">
                  {diag.keyLabels && diag.keyLabels.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-blue-900 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> Key Labels:
                      </span>
                      {diag.keyLabels.map((lbl, lIdx) => (
                        <span
                          key={lIdx}
                          className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 text-xs"
                        >
                          {lbl}
                        </span>
                      ))}
                    </div>
                  )}

                  {diag.teachingPrompt && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Classroom Teaching Prompt: </span>
                        <span>{diag.teachingPrompt}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Custom Prompt Modal */}
      {showCustomPromptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Custom Diagram Request</h3>
              </div>
              <button
                onClick={() => setShowCustomPromptModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Describe what visual concept, steps, labeled parts, or comparison diagram you need for &quot;{note.topic}&quot;. The system will render a labeled diagram and convert it to a standalone PNG image.
            </p>

            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Draw a 4-step flowchart showing how rainfall becomes groundwater, with labeled arrows and key terms..."
              className="w-full h-28 p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCustomPromptModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateCustomDiagram}
                disabled={!customPrompt.trim() || isGenerating}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow disabled:opacity-50 flex items-center gap-1.5"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Diagram (PNG)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {fullscreenDiagram && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-base">{fullscreenDiagram.title}</h4>
                <p className="text-xs text-gray-300">{fullscreenDiagram.caption}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(fullscreenDiagram, 0)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download PNG
                </button>
                <button
                  onClick={() => setFullscreenDiagram(null)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 bg-slate-100 flex-1 overflow-auto flex items-center justify-center">
              <img
                src={fullscreenDiagram.pngBase64}
                alt={fullscreenDiagram.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
