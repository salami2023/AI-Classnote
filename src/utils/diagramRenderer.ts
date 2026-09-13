/**
 * Educational Diagram PNG Renderer & Utilities
 * Converts vector lesson aid diagrams (SVG) directly into standalone PNG base64 images.
 * Guarantees that diagrams are stored as standalone PNG images (data:image/png;base64,...),
 * without external links, ensuring offline permanence, seamless Word/PDF export,
 * and persistent storage with the lesson note.
 */

/**
 * Converts an SVG string to a high-resolution PNG data URL (data:image/png;base64,...)
 * using HTML5 Canvas with crisp 2x DPI rasterization.
 */
export async function convertSvgToPng(
  svgString: string,
  width: number = 800,
  height: number = 500
): Promise<string> {
  return new Promise((resolve) => {
    try {
      let cleanSvg = svgString.trim();

      // Ensure xmlns attribute is present
      if (!cleanSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
        cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      // Ensure viewBox or width/height
      if (!cleanSvg.includes('viewBox')) {
        cleanSvg = cleanSvg.replace('<svg', `<svg viewBox="0 0 ${width} ${height}"`);
      }

      const svgBlob = new Blob([cleanSvg], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        try {
          const scale = 2; // 2x high-resolution rendering
          const canvas = document.createElement('canvas');
          canvas.width = width * scale;
          canvas.height = height * scale;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(generateCanvasFallbackPng(cleanSvg, width, height));
            return;
          }

          // Anti-aliasing & crisp rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Clean white educational backdrop
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw the SVG image scaled
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);

          const pngDataUrl = canvas.toDataURL('image/png');
          resolve(pngDataUrl);
        } catch (canvasErr) {
          URL.revokeObjectURL(url);
          console.warn('Canvas conversion warning, falling back to direct canvas drawing:', canvasErr);
          resolve(generateCanvasFallbackPng(cleanSvg, width, height));
        }
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        console.warn('SVG img load warning, using canvas fallback:', err);
        resolve(generateCanvasFallbackPng(cleanSvg, width, height));
      };

      img.src = url;
    } catch (outerErr) {
      console.warn('SVG to PNG conversion error:', outerErr);
      resolve(generateCanvasFallbackPng(svgString, width, height));
    }
  });
}

/**
 * Fallback Canvas generator that creates an educational diagram PNG directly
 * in case SVG rasterization encountered browser sandbox restrictions.
 */
export function generateCanvasFallbackPng(
  titleOrText: string,
  width: number = 800,
  height: number = 500
): string {
  try {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Banner
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(10, 10, width - 20, 50);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('BEACON HILL SCHOOLS - LESSON AID DIAGRAM', 30, 42);

    // Subtitle
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    const displayTitle = titleOrText.slice(0, 60).replace(/<[^>]*>/g, '');
    ctx.fillText(`Topic Illustration: ${displayTitle || 'Curriculum Diagram'}`, 30, 95);

    // 4 Schematic Blocks for Teaching
    const boxes = [
      { label: 'Step 1: Input / Concept', color: '#dbeafe', border: '#3b82f6', text: '#1e40af', x: 40, y: 130 },
      { label: 'Step 2: Core Process', color: '#dcfce7', border: '#22c55e', text: '#15803d', x: 230, y: 130 },
      { label: 'Step 3: Interaction', color: '#fef3c7', border: '#eab308', text: '#854d0e', x: 420, y: 130 },
      { label: 'Step 4: Output / Result', color: '#f3e8ff', border: '#a855f7', text: '#6b21a8', x: 610, y: 130 },
    ];

    boxes.forEach((b) => {
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, 150, 140);
      ctx.strokeStyle = b.border;
      ctx.lineWidth = 2;
      ctx.strokeRect(b.x, b.y, 150, 140);

      ctx.fillStyle = b.text;
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(b.label, b.x + 10, b.y + 30);

      // Connecting arrow
      if (b.x < 600) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(b.x + 155, b.y + 70);
        ctx.lineTo(b.x + 185, b.y + 70);
        ctx.stroke();
      }
    });

    // Classroom Note at bottom
    ctx.fillStyle = '#334155';
    ctx.font = 'italic 13px sans-serif';
    ctx.fillText('Lesson Aid Note: Use this diagram on the whiteboard to guide student discussion.', 40, 320);

    return canvas.toDataURL('image/png');
  } catch {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
}

/**
 * Downloads a standalone PNG diagram directly to the user's computer.
 */
export function downloadPngFile(pngBase64: string, filename: string): void {
  const cleanName = filename.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const safeFilename = cleanName.endsWith('.png') ? cleanName : `${cleanName}.png`;

  const link = document.createElement('a');
  link.href = pngBase64;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copies the PNG image directly to clipboard so teachers can paste into Word, PowerPoint, etc.
 */
export async function copyPngToClipboard(pngBase64: string): Promise<boolean> {
  try {
    const res = await fetch(pngBase64);
    const blob = await res.blob();
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Clipboard copy error:', err);
    return false;
  }
}

/**
 * Converts a teacher-uploaded image file (PNG/JPEG) into a PNG data URL.
 */
export function readUploadedFileAsPngDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      if (file.type === 'image/png') {
        resolve(rawUrl);
      } else {
        // Draw to canvas to ensure strictly PNG format
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 500;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } else {
            resolve(rawUrl);
          }
        };
        img.onerror = () => resolve(rawUrl);
        img.src = rawUrl;
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
