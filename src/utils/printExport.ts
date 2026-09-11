export function triggerPrint(): void {
  window.print();
}

/**
 * Downloads a rich, formatted HTML document with Word MIME type (.doc),
 * which opens natively in Microsoft Word, Google Docs, and LibreOffice.
 */
export function exportToWordHTML(
  title: string,
  htmlContent: string,
  filename: string
): void {
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body {
    font-family: 'Calibri', 'Arial', sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    margin: 36pt 48pt;
  }
  h1 { color: #1e3a8a; font-size: 20pt; text-align: center; margin-bottom: 4pt; }
  h2 { color: #1e3a8a; font-size: 14pt; border-bottom: 1.5pt solid #cbd5e1; padding-bottom: 3pt; margin-top: 18pt; }
  h3 { color: #334155; font-size: 12pt; margin-top: 12pt; }
  p, li { font-size: 11pt; }
  ul { margin-top: 4pt; margin-bottom: 8pt; padding-left: 20pt; }
  li { margin-bottom: 4pt; }
  .table-header { width: 100%; border-collapse: collapse; margin-bottom: 16pt; }
  .table-header td { padding: 6pt; border: 1pt solid #cbd5e1; font-size: 10.5pt; }
  .callout { background: #f8fafc; border-left: 3pt solid #3b82f6; padding: 8pt 12pt; margin: 8pt 0; }
  .activity-box { background: #f0fdf4; border: 1pt solid #bbf7d0; padding: 10pt; margin: 10pt 0; border-radius: 4pt; }
  .homework-box { background: #fffbeb; border: 1pt solid #fde68a; padding: 10pt; margin: 10pt 0; border-radius: 4pt; }
  .exam-question { margin-bottom: 12pt; }
  .answer-key { color: #059669; font-weight: bold; }
</style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const blob = new Blob(['\ufeff' + fullHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
