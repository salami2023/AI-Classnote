/**
 * School Logo Utilities
 * Provides high-resolution academic school crests and custom logo management
 */

// Default high-resolution Academic Crest SVG
export const DEFAULT_SCHOOL_CREST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>
    <linearGradient id="crestBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>
  
  <!-- Outer Decorative Ring -->
  <circle cx="100" cy="100" r="94" fill="none" stroke="#D97706" stroke-width="3" stroke-dasharray="6 3" />
  <circle cx="100" cy="100" r="88" fill="url(#crestBlue)" stroke="#FDE047" stroke-width="3" />
  
  <!-- Laurel Wreath Leaves (Left) -->
  <path d="M 46,128 C 36,104 40,78 52,60 C 50,74 54,88 64,98 C 54,106 50,116 46,128 Z" fill="#FDE047" opacity="0.9"/>
  <path d="M 38,98 C 32,84 36,70 44,56 C 44,68 50,78 58,84 Z" fill="#D97706" opacity="0.8"/>
  <path d="M 52,142 C 42,126 44,112 50,98 C 56,110 64,122 72,130 Z" fill="#FDE047"/>
  
  <!-- Laurel Wreath Leaves (Right) -->
  <path d="M 154,128 C 164,104 160,78 148,60 C 150,74 146,88 136,98 C 146,106 150,116 154,128 Z" fill="#FDE047" opacity="0.9"/>
  <path d="M 162,98 C 168,84 164,70 156,56 C 156,68 150,78 142,84 Z" fill="#D97706" opacity="0.8"/>
  <path d="M 148,142 C 158,126 156,112 150,98 C 144,110 136,122 128,130 Z" fill="#FDE047"/>

  <!-- Center Academic Shield -->
  <path d="M 70,54 L 130,54 C 130,54 134,96 130,118 C 126,138 100,154 100,154 C 100,154 74,138 70,118 C 66,96 70,54 70,54 Z" fill="#FFFFFF" stroke="#D97706" stroke-width="3" />
  
  <!-- Shield Split Background -->
  <path d="M 100,54 L 130,54 C 130,54 134,96 130,118 C 126,138 100,154 100,154 Z" fill="#EFF6FF" />

  <!-- Torch of Knowledge / Wisdom -->
  <path d="M 98,64 L 102,64 L 101,92 L 99,92 Z" fill="#D97706"/>
  <!-- Flame -->
  <path d="M 100,56 C 96,60 96,64 100,68 C 104,64 104,60 100,56 Z" fill="#EF4444"/>
  <path d="M 100,58 C 98,61 98,63 100,66 C 102,63 102,61 100,58 Z" fill="#FDE047"/>
  
  <!-- Open Book of Learning -->
  <path d="M 80,102 C 90,98 98,100 100,104 C 102,100 110,98 120,102 L 120,122 C 110,118 102,120 100,124 C 98,120 90,118 80,122 Z" fill="#1E3A8A" stroke="#1E3A8A" stroke-width="1.5"/>
  <path d="M 82,104 C 90,101 97,103 99,106 L 99,122 C 97,119 90,117 82,120 Z" fill="#FFFFFF"/>
  <path d="M 118,104 C 110,101 103,103 101,106 L 101,122 C 103,119 110,117 118,120 Z" fill="#FFFFFF"/>
  
  <!-- Book Page Lines -->
  <line x1="85" y1="108" x2="95" y2="107" stroke="#94A3B8" stroke-width="1"/>
  <line x1="85" y1="112" x2="95" y2="111" stroke="#94A3B8" stroke-width="1"/>
  <line x1="85" y1="116" x2="95" y2="115" stroke="#94A3B8" stroke-width="1"/>
  <line x1="105" y1="107" x2="115" y2="108" stroke="#94A3B8" stroke-width="1"/>
  <line x1="105" y1="111" x2="115" y2="112" stroke="#94A3B8" stroke-width="1"/>
  <line x1="105" y1="115" x2="115" y2="116" stroke="#94A3B8" stroke-width="1"/>
  
  <!-- Stars of Excellence -->
  <polygon points="100,32 102,38 108,38 103,42 105,48 100,44 95,48 97,42 92,38 98,38" fill="#FDE047"/>
  <polygon points="82,38 83,43 88,43 84,46 86,51 82,48 78,51 80,46 76,43 81,43" fill="#FDE047"/>
  <polygon points="118,38 119,43 124,43 120,46 122,51 118,48 114,51 116,46 112,43 117,43" fill="#FDE047"/>

  <!-- Bottom Banner Ribbon -->
  <path d="M 50,160 L 70,154 L 100,162 L 130,154 L 150,160 L 144,170 L 130,166 L 100,174 L 70,166 L 56,170 Z" fill="#D97706" stroke="#92400E" stroke-width="1.5"/>
  <text x="100" y="168" font-family="'Times New Roman', Georgia, serif" font-size="8" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">EXCELLENCE</text>
</svg>`;

export const DEFAULT_CREST_DATA_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  DEFAULT_SCHOOL_CREST_SVG
)}`;

// Convert an SVG string to a high-res PNG Data URL in browser for docx embedding
export async function svgToPngDataUrl(svgString: string, width = 200, height = 200): Promise<string> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const urlApi = window.URL || (window as any).webkitURL;
      const blobURL = urlApi.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const pngData = canvas.toDataURL('image/png');
          urlApi.revokeObjectURL(blobURL);
          resolve(pngData);
        } else {
          urlApi.revokeObjectURL(blobURL);
          resolve(DEFAULT_CREST_DATA_URL);
        }
      };

      img.onerror = () => {
        urlApi.revokeObjectURL(blobURL);
        resolve(DEFAULT_CREST_DATA_URL);
      };

      img.src = blobURL;
    } catch {
      resolve(DEFAULT_CREST_DATA_URL);
    }
  });
}
