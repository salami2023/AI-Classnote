import { AcademicLevel } from '../types';

export interface DiagramTemplateDefinition {
  title: string;
  caption: string;
  diagramType: string;
  keyLabels: string[];
  teachingPrompt: string;
  svgMarkup: string;
}

/**
 * High-quality educational vector templates for common curriculum subjects & topics.
 * Designed specifically for primary, secondary, and nursery school lessons.
 */
export const DIAGRAM_TEMPLATES: Record<string, DiagramTemplateDefinition> = {
  // 1. Water Cycle
  water_cycle: {
    title: 'The Water Cycle: Evaporation, Condensation, Precipitation & Collection',
    caption: 'Earth\'s natural hydrologic system showing how thermal solar energy drives continuous water recycling between oceans, atmosphere, and land.',
    diagramType: 'Scientific Process / Natural Cycle',
    keyLabels: [
      '1. Evaporation (Water to vapor)',
      '2. Condensation (Clouds form)',
      '3. Precipitation (Rain falls)',
      '4. Surface Runoff & Collection (Rivers to ocean)',
      'Solar Radiation (Heat engine)',
      'Transpiration (Plants release vapor)',
    ],
    teachingPrompt: 'Board Prompt: Ask pupils to trace the cycle with their finger: Where does water go when a puddle disappears in the afternoon sunshine?',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#bae6fd" />
          <stop offset="100%" stop-color="#f0f9ff" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
        <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#86efac" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
        <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#eab308" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
        </filter>
      </defs>

      <!-- Background Sky -->
      <rect width="800" height="500" fill="url(#skyGrad)" rx="12" />

      <!-- Sun (Heat Source) -->
      <circle cx="120" cy="90" r="45" fill="url(#sunGrad)" filter="url(#shadow)" />
      <g stroke="#eab308" stroke-width="3" stroke-linecap="round">
        <line x1="120" y1="25" x2="120" y2="38" />
        <line x1="120" y1="142" x2="120" y2="155" />
        <line x1="55" y1="90" x2="68" y2="90" />
        <line x1="172" y1="90" x2="185" y2="90" />
        <line x1="74" y1="44" x2="84" y2="54" />
        <line x1="156" y1="126" x2="166" y2="136" />
        <line x1="74" y1="136" x2="84" y2="126" />
        <line x1="156" y1="54" x2="166" y2="44" />
      </g>
      <text x="120" y="95" text-anchor="middle" font-weight="bold" font-size="13" fill="#854d0e">Sun's Heat</text>

      <!-- Mountains / Green Land -->
      <path d="M 380 430 Q 480 260 580 320 Q 640 240 760 380 L 800 500 L 320 500 Z" fill="url(#landGrad)" />
      <!-- Mountain Peak Snow -->
      <polygon points="630,250 650,285 640,290 625,280 615,288" fill="#ffffff" />

      <!-- Trees on Mountain -->
      <polygon points="460,370 475,340 490,370" fill="#14532d" />
      <polygon points="490,385 505,355 520,385" fill="#14532d" />
      <polygon points="530,375 545,345 560,375" fill="#14532d" />

      <!-- Blue Ocean / River Basin -->
      <path d="M 0 410 Q 180 395 340 430 L 400 500 L 0 500 Z" fill="url(#waterGrad)" />
      <path d="M 40 430 Q 160 425 280 440" stroke="#bae6fd" stroke-width="2" fill="none" opacity="0.6" />
      <path d="M 60 450 Q 140 445 220 460" stroke="#bae6fd" stroke-width="2" fill="none" opacity="0.6" />

      <!-- Clouds (Condensation) -->
      <!-- White Fluffy Cloud -->
      <g filter="url(#shadow)">
        <path d="M 330 110 A 30 30 0 0 1 380 90 A 40 40 0 0 1 450 100 A 30 30 0 0 1 480 130 A 25 25 0 0 1 460 160 L 330 160 A 25 25 0 0 1 330 110 Z" fill="#ffffff" />
      </g>
      <!-- Dark Rain Cloud -->
      <g filter="url(#shadow)">
        <path d="M 540 100 A 35 35 0 0 1 600 80 A 45 45 0 0 1 680 95 A 35 35 0 0 1 710 130 A 30 30 0 0 1 690 165 L 530 165 A 30 30 0 0 1 540 100 Z" fill="#94a3b8" />
      </g>

      <!-- Raindrops (Precipitation) -->
      <g stroke="#0284c7" stroke-width="2.5" stroke-linecap="round">
        <line x1="560" y1="185" x2="550" y2="210" />
        <line x1="590" y1="180" x2="580" y2="205" />
        <line x1="620" y1="190" x2="610" y2="215" />
        <line x1="650" y1="180" x2="640" y2="205" />
        <line x1="680" y1="185" x2="670" y2="210" />
        <line x1="575" y1="225" x2="565" y2="250" />
        <line x1="605" y1="220" x2="595" y2="245" />
        <line x1="635" y1="230" x2="625" y2="255" />
        <line x1="665" y1="220" x2="655" y2="245" />
      </g>

      <!-- Evaporation Rising Vapor Arrows -->
      <g stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4" fill="none">
        <path d="M 120 380 Q 140 300 190 240 Q 230 190 310 150" />
        <path d="M 190 390 Q 210 320 260 260 Q 290 220 340 170" />
      </g>
      <polygon points="315,145 305,158 318,162" fill="#0284c7" />

      <!-- Surface Runoff Arrow -->
      <path d="M 520 420 Q 420 440 330 450" stroke="#0369a1" stroke-width="3.5" fill="none" stroke-dasharray="8,4" />
      <polygon points="325,450 338,443 336,457" fill="#0369a1" />

      <!-- LABELED BADGES / CALLOUTS -->
      <!-- 1. Evaporation Badge -->
      <g filter="url(#shadow)">
        <rect x="40" y="270" width="180" height="42" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="50" y="288" font-size="12" font-weight="bold" fill="#0369a1">1. EVAPORATION</text>
        <text x="50" y="303" font-size="10" fill="#475569">Water heats &amp; rises as vapor</text>
      </g>

      <!-- 2. Condensation Badge -->
      <g filter="url(#shadow)">
        <rect x="300" y="28" width="190" height="42" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>
        <text x="310" y="46" font-size="12" font-weight="bold" fill="#1d4ed8">2. CONDENSATION</text>
        <text x="310" y="61" font-size="10" fill="#475569">Vapor cools into fluffy clouds</text>
      </g>

      <!-- 3. Precipitation Badge -->
      <g filter="url(#shadow)">
        <rect x="560" y="28" width="195" height="42" rx="8" fill="#ffffff" stroke="#475569" stroke-width="2"/>
        <text x="570" y="46" font-size="12" font-weight="bold" fill="#334155">3. PRECIPITATION</text>
        <text x="570" y="61" font-size="10" fill="#475569">Water droplets fall as rain</text>
      </g>

      <!-- 4. Collection Badge -->
      <g filter="url(#shadow)">
        <rect x="230" y="435" width="220" height="42" rx="8" fill="#ffffff" stroke="#0891b2" stroke-width="2"/>
        <text x="240" y="453" font-size="12" font-weight="bold" fill="#0e7490">4. RUNOFF &amp; COLLECTION</text>
        <text x="240" y="468" font-size="10" fill="#475569">Water gathers in rivers &amp; oceans</text>
      </g>

      <!-- Header Ribbon -->
      <rect x="15" y="12" width="220" height="24" rx="6" fill="#1e3a8a" />
      <text x="25" y="28" font-size="11" font-weight="bold" fill="#ffffff" letter-spacing="0.5">BEACON HILL SCHOOLS • SCIENCE</text>
    </svg>`,
  },

  // 2. Photosynthesis & Plant Food
  photosynthesis: {
    title: 'Photosynthesis: How Green Plants Make Food',
    caption: 'Chlorophyll inside plant leaves uses sunlight energy to convert carbon dioxide and water into glucose and oxygen.',
    diagramType: 'Biological Process Schematic',
    keyLabels: [
      'Sunlight (Solar Energy)',
      'Carbon Dioxide (CO2 from air)',
      'Water (H2O absorbed by roots)',
      'Chlorophyll (Green leaf pigment)',
      'Glucose (Sugar food stored in plant)',
      'Oxygen (O2 released into air)',
    ],
    teachingPrompt: 'Question for Class: What do plants take in from the air, and what gift do they breathe out for animals and humans to live?',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4ade80" />
          <stop offset="100%" stop-color="#16a34a" />
        </linearGradient>
        <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#22c55e" />
          <stop offset="100%" stop-color="#15803d" />
        </linearGradient>
        <filter id="pDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
        </filter>
      </defs>

      <!-- Sky and Ground -->
      <rect width="800" height="380" fill="#f0fdf4" rx="12" />
      <rect y="380" width="800" height="120" fill="#78350f" rx="12" />
      <rect y="375" width="800" height="10" fill="#a16207" />

      <!-- Sun -->
      <circle cx="100" cy="80" r="40" fill="#facc15" filter="url(#pDrop)" />
      <g stroke="#eab308" stroke-width="3">
        <line x1="100" y1="20" x2="100" y2="35" />
        <line x1="100" y1="125" x2="100" y2="140" />
        <line x1="40" y1="80" x2="55" y2="80" />
        <line x1="145" y1="80" x2="160" y2="80" />
        <line x1="140" y1="120" x2="220" y2="180" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,4" />
      </g>
      <text x="100" y="85" text-anchor="middle" font-weight="bold" font-size="12" fill="#713f12">Sunlight</text>

      <!-- Plant Stem & Leaves -->
      <path d="M 400 380 Q 395 250 400 150" stroke="url(#stemGrad)" stroke-width="14" fill="none" stroke-linecap="round" />
      <!-- Left Leaf -->
      <path d="M 395 280 Q 260 250 240 200 Q 320 180 395 240 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="2" filter="url(#pDrop)" />
      <path d="M 395 260 Q 320 230 260 205" stroke="#15803d" stroke-width="2" fill="none" />
      <!-- Right Leaf -->
      <path d="M 405 230 Q 540 200 560 150 Q 480 130 405 190 Z" fill="url(#leafGrad)" stroke="#15803d" stroke-width="2" filter="url(#pDrop)" />
      <path d="M 405 210 Q 480 180 540 155" stroke="#15803d" stroke-width="2" fill="none" />
      <!-- Top Flower / Bud -->
      <circle cx="400" cy="130" r="25" fill="#f43f5e" />
      <circle cx="400" cy="130" r="12" fill="#fbbf24" />

      <!-- Plant Roots in Soil -->
      <g stroke="#d97706" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M 400 380 Q 370 430 350 470" />
        <path d="M 400 380 Q 420 430 460 480" />
        <path d="M 380 410 Q 330 430 310 450" />
        <path d="M 410 410 Q 450 440 480 450" />
      </g>

      <!-- Input 1: Carbon Dioxide -->
      <g filter="url(#pDrop)">
        <rect x="60" y="210" width="150" height="45" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" />
        <text x="70" y="230" font-weight="bold" font-size="12" fill="#1d4ed8">Carbon Dioxide (CO2)</text>
        <text x="70" y="245" font-size="10" fill="#64748b">Enters through leaf stomata</text>
      </g>
      <path d="M 215 230 L 255 220" stroke="#3b82f6" stroke-width="3" fill="none" />
      <polygon points="255,220 245,215 247,227" fill="#3b82f6" />

      <!-- Input 2: Water from soil -->
      <g filter="url(#pDrop)">
        <rect x="80" y="420" width="180" height="45" rx="8" fill="#f0f9ff" stroke="#0284c7" stroke-width="2" />
        <text x="90" y="440" font-weight="bold" font-size="12" fill="#0369a1">Water &amp; Minerals (H2O)</text>
        <text x="90" y="455" font-size="10" fill="#64748b">Drawn up through roots</text>
      </g>
      <path d="M 265 440 Q 330 440 370 410" stroke="#0284c7" stroke-width="3" stroke-dasharray="6,4" fill="none" />
      <polygon points="370,410 358,414 364,424" fill="#0284c7" />

      <!-- Output 1: Oxygen Release -->
      <g filter="url(#pDrop)">
        <rect x="580" y="110" width="160" height="45" rx="8" fill="#fdf4ff" stroke="#a855f7" stroke-width="2" />
        <text x="590" y="130" font-weight="bold" font-size="12" fill="#7e22ce">Oxygen Gas (O2)</text>
        <text x="590" y="145" font-size="10" fill="#64748b">Released for us to breathe</text>
      </g>
      <path d="M 520 150 L 575 135" stroke="#a855f7" stroke-width="3" fill="none" />
      <polygon points="575,135 563,132 568,144" fill="#a855f7" />

      <!-- Output 2: Glucose Food -->
      <g filter="url(#pDrop)">
        <rect x="580" y="240" width="170" height="45" rx="8" fill="#fefce8" stroke="#ca8a04" stroke-width="2" />
        <text x="590" y="260" font-weight="bold" font-size="12" fill="#a16207">Glucose / Sugar</text>
        <text x="590" y="275" font-size="10" fill="#64748b">Used for plant growth &amp; fruit</text>
      </g>
      <path d="M 440 220 Q 510 240 575 255" stroke="#ca8a04" stroke-width="3" fill="none" />
      <polygon points="575,255 562,252 567,264" fill="#ca8a04" />

      <!-- Chemical Equation Bar -->
      <rect x="100" y="12" width="600" height="32" rx="6" fill="#1e3a8a" />
      <text x="400" y="33" text-anchor="middle" font-weight="bold" font-size="13" fill="#ffffff">
        EQUATION: Carbon Dioxide + Water + Sunlight ➔ Glucose (Sugar) + Oxygen
      </text>
    </svg>`,
  },

  // 3. States of Matter (Solid, Liquid, Gas)
  states_of_matter: {
    title: 'The Three States of Matter: Particle Arrangement & Behavior',
    caption: 'Illustrates how molecular attraction, movement, and kinetic heat energy change matter from solid ice to liquid water and gaseous vapor.',
    diagramType: 'Physical Science Model',
    keyLabels: [
      'Solid (Tightly packed in neat rows, vibrates in place)',
      'Liquid (Close together, slides past each other)',
      'Gas (Far apart, moves fast in all directions)',
      'Melting (Solid ➔ Liquid)',
      'Freezing (Liquid ➔ Solid)',
      'Evaporation / Boiling (Liquid ➔ Gas)',
    ],
    teachingPrompt: 'Board Prompt: Ask pupils: In which state do the particles have the most space to dance around freely?',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <filter id="mDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="800" height="500" fill="#f8fafc" rx="12" />

      <!-- Title Bar -->
      <rect x="20" y="15" width="760" height="38" rx="8" fill="#1e3a8a" />
      <text x="400" y="40" text-anchor="middle" font-weight="bold" font-size="15" fill="#ffffff">
        BEACON HILL SCHOOLS • THE 3 STATES OF MATTER
      </text>

      <!-- 1. SOLID CONTAINER -->
      <g filter="url(#mDrop)">
        <rect x="40" y="80" width="210" height="280" rx="12" fill="#f0f9ff" stroke="#0284c7" stroke-width="2.5" />
        <rect x="40" y="80" width="210" height="40" rx="12" fill="#0284c7" />
        <text x="145" y="106" text-anchor="middle" font-weight="bold" font-size="16" fill="#ffffff">1. SOLID (Ice)</text>

        <!-- Fixed Particle Grid -->
        <g fill="#0284c7">
          <circle cx="85" cy="180" r="14" /><circle cx="125" cy="180" r="14" /><circle cx="165" cy="180" r="14" /><circle cx="205" cy="180" r="14" />
          <circle cx="85" cy="220" r="14" /><circle cx="125" cy="220" r="14" /><circle cx="165" cy="220" r="14" /><circle cx="205" cy="220" r="14" />
          <circle cx="85" cy="260" r="14" /><circle cx="125" cy="260" r="14" /><circle cx="165" cy="260" r="14" /><circle cx="205" cy="260" r="14" />
          <circle cx="85" cy="300" r="14" /><circle cx="125" cy="300" r="14" /><circle cx="165" cy="300" r="14" /><circle cx="205" cy="300" r="14" />
        </g>
        <text x="145" y="335" text-anchor="middle" font-size="11" font-weight="bold" fill="#0369a1">Definite Shape &amp; Volume</text>
        <text x="145" y="350" text-anchor="middle" font-size="10" fill="#64748b">Particles vibrate in fixed spots</text>
      </g>

      <!-- 2. LIQUID CONTAINER -->
      <g filter="url(#mDrop)">
        <rect x="295" y="80" width="210" height="280" rx="12" fill="#f0fdf4" stroke="#16a34a" stroke-width="2.5" />
        <rect x="295" y="80" width="210" height="40" rx="12" fill="#16a34a" />
        <text x="400" y="106" text-anchor="middle" font-weight="bold" font-size="16" fill="#ffffff">2. LIQUID (Water)</text>

        <!-- Loosely Packed Particles -->
        <g fill="#16a34a">
          <circle cx="330" cy="230" r="14" /><circle cx="370" cy="220" r="14" /><circle cx="410" cy="235" r="14" /><circle cx="450" cy="225" r="14" />
          <circle cx="345" cy="270" r="14" /><circle cx="390" cy="265" r="14" /><circle cx="430" cy="275" r="14" /><circle cx="470" cy="260" r="14" />
          <circle cx="335" cy="310" r="14" /><circle cx="380" cy="310" r="14" /><circle cx="425" cy="305" r="14" /><circle cx="465" cy="310" r="14" />
        </g>
        <text x="400" y="335" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">Takes Container Shape</text>
        <text x="400" y="350" text-anchor="middle" font-size="10" fill="#64748b">Flows &amp; slides past each other</text>
      </g>

      <!-- 3. GAS CONTAINER -->
      <g filter="url(#mDrop)">
        <rect x="550" y="80" width="210" height="280" rx="12" fill="#fffbeb" stroke="#d97706" stroke-width="2.5" />
        <rect x="550" y="80" width="210" height="40" rx="12" fill="#d97706" />
        <text x="655" y="106" text-anchor="middle" font-weight="bold" font-size="16" fill="#ffffff">3. GAS (Steam)</text>

        <!-- Fast Spaced Out Particles with Motion Lines -->
        <g fill="#d97706">
          <circle cx="585" cy="160" r="14" />
          <circle cx="715" cy="180" r="14" />
          <circle cx="640" cy="225" r="14" />
          <circle cx="590" cy="290" r="14" />
          <circle cx="710" cy="295" r="14" />
        </g>
        <g stroke="#b45309" stroke-width="1.5">
          <line x1="585" y1="140" x2="585" y2="150" /><line x1="715" y1="195" x2="725" y2="205" />
          <line x1="625" y1="225" x2="615" y2="225" /><line x1="710" y1="310" x2="700" y2="320" />
        </g>
        <text x="655" y="335" text-anchor="middle" font-size="11" font-weight="bold" fill="#b45309">No Fixed Shape / Fills Space</text>
        <text x="655" y="350" text-anchor="middle" font-size="10" fill="#64748b">Moves very fast with high energy</text>
      </g>

      <!-- Heat Energy Bar at Bottom -->
      <rect x="40" y="380" width="720" height="90" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
      <!-- Left to Right Arrow (Heating) -->
      <path d="M 120 410 L 680 410" stroke="#dc2626" stroke-width="4" stroke-linecap="round" />
      <polygon points="685,410 670,403 670,417" fill="#dc2626" />
      <text x="400" y="403" text-anchor="middle" font-size="12" font-weight="bold" fill="#b91c1c">
        ➔ ADDING HEAT (Melting ➔ Evaporating)
      </text>

      <!-- Right to Left Arrow (Cooling) -->
      <path d="M 680 445 L 120 445" stroke="#2563eb" stroke-width="4" stroke-linecap="round" />
      <polygon points="115,445 130,438 130,452" fill="#2563eb" />
      <text x="400" y="460" text-anchor="middle" font-size="12" font-weight="bold" fill="#1d4ed8">
        ➔ REMOVING HEAT / COOLING (Condensing ➔ Freezing)
      </text>
    </svg>`,
  },

  // 4. Human Heart & Blood Flow
  heart_circulatory: {
    title: 'The Human Heart: Chambers, Valves and Blood Flow',
    caption: 'Deoxygenated blood (blue) enters the right atrium and is pumped to lungs; oxygenated blood (red) enters left atrium and is pumped to the whole body via the aorta.',
    diagramType: 'Anatomical Schematic',
    keyLabels: [
      'Superior / Inferior Vena Cava (Deoxygenated in)',
      'Right Atrium & Right Ventricle',
      'Pulmonary Artery (To lungs for oxygen)',
      'Pulmonary Veins (Oxygen-rich from lungs)',
      'Left Atrium & Left Ventricle (Thick muscle wall)',
      'Aorta (Carries oxygen-rich blood to entire body)',
    ],
    teachingPrompt: 'Classroom Activity: Have students place a hand on their chest and count beats for 30 seconds. Explain why the left side muscle is thicker.',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <filter id="hDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="800" height="500" fill="#fafafa" rx="12" />

      <!-- Banner -->
      <rect x="20" y="15" width="760" height="36" rx="8" fill="#1e3a8a" />
      <text x="400" y="39" text-anchor="middle" font-weight="bold" font-size="15" fill="#ffffff">
        BEACON HILL SCHOOLS • THE HUMAN HEART &amp; CIRCULATION
      </text>

      <!-- Stylized Heart Dual Chamber Schematic -->
      <!-- Left (Right side of heart biologically - Blue / Deoxygenated) -->
      <path d="M 400 120 C 310 120 250 180 250 250 C 250 330 330 400 400 440 Z" fill="#3b82f6" stroke="#1d4ed8" stroke-width="4" filter="url(#hDrop)" />
      <!-- Right (Left side of heart biologically - Red / Oxygenated) -->
      <path d="M 400 120 C 490 120 550 180 550 250 C 550 330 470 400 400 440 Z" fill="#ef4444" stroke="#b91c1c" stroke-width="4" filter="url(#hDrop)" />

      <!-- Septum Divider -->
      <line x1="400" y1="120" x2="400" y2="440" stroke="#ffffff" stroke-width="6" stroke-dasharray="12,6" />

      <!-- Aorta arch up top -->
      <path d="M 430 130 C 430 70 510 60 520 120" fill="none" stroke="#dc2626" stroke-width="18" stroke-linecap="round" />
      <line x1="470" y1="75" x2="470" y2="55" stroke="#dc2626" stroke-width="8" stroke-linecap="round" />
      <line x1="490" y1="78" x2="495" y2="58" stroke="#dc2626" stroke-width="8" stroke-linecap="round" />

      <!-- Vena Cava blue pipe -->
      <path d="M 280 80 L 280 150" fill="none" stroke="#2563eb" stroke-width="16" stroke-linecap="round" />

      <!-- Chamber Labels inside heart -->
      <!-- Right Atrium -->
      <text x="325" y="200" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">RIGHT ATRIUM</text>
      <text x="325" y="218" text-anchor="middle" font-size="11" fill="#dbeafe">(Deoxygenated Blood)</text>
      <!-- Right Ventricle -->
      <text x="335" y="320" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">RIGHT VENTRICLE</text>
      <text x="335" y="338" text-anchor="middle" font-size="11" fill="#dbeafe">(Pumps to Lungs)</text>

      <!-- Left Atrium -->
      <text x="475" y="200" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">LEFT ATRIUM</text>
      <text x="475" y="218" text-anchor="middle" font-size="11" fill="#fee2e2">(Oxygen from Lungs)</text>
      <!-- Left Ventricle -->
      <text x="465" y="320" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">LEFT VENTRICLE</text>
      <text x="465" y="338" text-anchor="middle" font-size="11" fill="#fee2e2">(Pumps to Body)</text>

      <!-- Callout Labels -->
      <!-- Aorta -->
      <g filter="url(#hDrop)">
        <rect x="560" y="70" width="190" height="42" rx="8" fill="#ffffff" stroke="#dc2626" stroke-width="2" />
        <text x="570" y="88" font-weight="bold" font-size="12" fill="#991b1b">AORTA (Main Artery)</text>
        <text x="570" y="103" font-size="10" fill="#4b5563">Carries red blood to all organs</text>
      </g>
      <line x1="560" y1="91" x2="520" y2="95" stroke="#dc2626" stroke-width="2" />

      <!-- Vena Cava -->
      <g filter="url(#hDrop)">
        <rect x="40" y="70" width="190" height="42" rx="8" fill="#ffffff" stroke="#2563eb" stroke-width="2" />
        <text x="50" y="88" font-weight="bold" font-size="12" fill="#1e40af">VENA CAVA (Main Vein)</text>
        <text x="50" y="103" font-size="10" fill="#4b5563">Returns blue blood from body</text>
      </g>
      <line x1="230" y1="91" x2="270" y2="95" stroke="#2563eb" stroke-width="2" />

      <!-- Valves Note -->
      <rect x="180" y="455" width="440" height="32" rx="6" fill="#f1f5f9" stroke="#cbd5e1" />
      <text x="400" y="475" text-anchor="middle" font-size="12" font-weight="bold" fill="#334155">
        Heart Valves act like one-way doors to prevent blood flowing backwards!
      </text>
    </svg>`,
  },

  // 5. Electric Circuit (Series & Parallel)
  electric_circuit: {
    title: 'Simple Electric Circuit: Flow of Current, Components & Closed Loop',
    caption: 'Current flows from the battery positive terminal through the closed switch, lights up the bulb filament, and returns to the negative terminal.',
    diagramType: 'Physics & Engineering Schematic',
    keyLabels: [
      'Battery / Cell (Voltage power source with + and - terminals)',
      'Copper Wires (Conductors carrying electrons)',
      'Switch (Controls circuit: OPEN = OFF, CLOSED = ON)',
      'Light Bulb / Load (Converts electrical energy to light and heat)',
      'Direction of Conventional Current (+ to -)',
    ],
    teachingPrompt: 'Board Question: If a wire breaks or the switch is turned OFF, what happens to the electric current and why?',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <filter id="cDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="800" height="500" fill="#f8fafc" rx="12" />

      <rect x="20" y="15" width="760" height="36" rx="8" fill="#1e3a8a" />
      <text x="400" y="39" text-anchor="middle" font-weight="bold" font-size="15" fill="#ffffff">
        BEACON HILL SCHOOLS • SIMPLE ELECTRIC CIRCUIT SCHEMATIC
      </text>

      <!-- Connecting Wire Loop (Closed Circuit) -->
      <rect x="150" y="100" width="500" height="280" rx="16" fill="none" stroke="#dc2626" stroke-width="6" stroke-linecap="round" />

      <!-- Battery Component (Left) -->
      <g filter="url(#cDrop)">
        <!-- Battery Body -->
        <rect x="110" y="190" width="80" height="120" rx="10" fill="#1e293b" />
        <rect x="110" y="240" width="80" height="70" rx="0" fill="#334155" />
        <!-- Positive Top Knob -->
        <rect x="135" y="175" width="30" height="15" rx="3" fill="#e2e8f0" />
        <text x="150" y="215" text-anchor="middle" font-weight="bold" font-size="20" fill="#ef4444">+</text>
        <text x="150" y="265" text-anchor="middle" font-weight="bold" font-size="14" fill="#ffffff">1.5V</text>
        <text x="150" y="295" text-anchor="middle" font-weight="bold" font-size="20" fill="#94a3b8">-</text>
      </g>

      <!-- Switch Component (Top) -->
      <g filter="url(#cDrop)">
        <rect x="360" y="80" width="100" height="40" rx="8" fill="#ffffff" stroke="#64748b" stroke-width="2" />
        <circle cx="380" cy="100" r="6" fill="#0f172a" />
        <circle cx="440" cy="100" r="6" fill="#0f172a" />
        <!-- Closed Switch Contact Arm -->
        <line x1="380" y1="100" x2="438" y2="100" stroke="#16a34a" stroke-width="5" stroke-linecap="round" />
        <text x="410" y="72" text-anchor="middle" font-size="11" font-weight="bold" fill="#15803d">SWITCH: CLOSED (ON)</text>
      </g>

      <!-- Light Bulb Component (Right) -->
      <g filter="url(#cDrop)">
        <!-- Yellow Glow -->
        <circle cx="650" cy="240" r="55" fill="#fef08a" opacity="0.6" />
        <circle cx="650" cy="240" r="40" fill="#fde047" stroke="#eab308" stroke-width="2" />
        <!-- Metal Base -->
        <rect x="635" y="275" width="30" height="25" rx="4" fill="#94a3b8" />
        <!-- Filament -->
        <path d="M 640 260 Q 650 220 660 260" stroke="#b45309" stroke-width="3" fill="none" />
        <text x="650" y="210" text-anchor="middle" font-size="13" font-weight="bold" fill="#854d0e">GLOWING BULB</text>
      </g>

      <!-- Flow Arrows on Wires -->
      <!-- Top wire arrow -->
      <polygon points="530,100 515,92 515,108" fill="#dc2626" />
      <!-- Bottom wire arrow -->
      <polygon points="310,380 325,372 325,388" fill="#dc2626" />

      <!-- Labels / Badges -->
      <rect x="140" y="415" width="520" height="60" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
      <text x="400" y="438" text-anchor="middle" font-weight="bold" font-size="13" fill="#1e3a8a">
        ESSENTIAL RULE: Electrons only flow in a COMPLETE, UNBROKEN loop!
      </text>
      <text x="400" y="458" text-anchor="middle" font-size="11" fill="#475569">
        Energy transfer: Chemical energy (battery) ➔ Electrical energy (wires) ➔ Light &amp; Heat energy (bulb).
      </text>
    </svg>`,
  },

  // 6. Early Years: 5 Steps of Hand Washing
  hand_washing: {
    title: 'Clean & Healthy Hands: 5 Steps to Wash Away Germs',
    caption: 'Step-by-step visual lesson aid for early years learners showing how water, soap, rubbing, and drying keep our bodies healthy.',
    diagramType: 'Early Years Sensory Visual Aid',
    keyLabels: [
      'Step 1: Wet hands with clean running water',
      'Step 2: Apply foaming soap bubbles',
      'Step 3: Rub palms, between fingers & nails',
      'Step 4: Rinse away all soap & germs',
      'Step 5: Dry thoroughly with a clean towel',
    ],
    teachingPrompt: 'Sing-along: Sing the "Happy Birthday" song twice with pupils while miming the scrubbing hand gestures!',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <filter id="wDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="800" height="500" fill="#ecfeff" rx="12" />

      <rect x="20" y="15" width="760" height="38" rx="8" fill="#0891b2" />
      <text x="400" y="40" text-anchor="middle" font-weight="bold" font-size="16" fill="#ffffff">
        BEACON HILL EARLY YEARS • 5 STEPS TO CLEAN HANDS! 🧼💧
      </text>

      <!-- 5 Step Cards -->
      <!-- Step 1 -->
      <g filter="url(#wDrop)">
        <rect x="30" y="75" width="135" height="300" rx="12" fill="#ffffff" stroke="#38bdf8" stroke-width="2.5" />
        <circle cx="97" cy="110" r="22" fill="#0284c7" />
        <text x="97" y="117" text-anchor="middle" font-weight="bold" font-size="18" fill="#ffffff">1</text>
        <text x="97" y="155" text-anchor="middle" font-weight="bold" font-size="13" fill="#0369a1">WET HANDS</text>
        <!-- Water tap illustration -->
        <path d="M 80 180 L 115 180 L 115 210" stroke="#64748b" stroke-width="8" stroke-linecap="round" fill="none" />
        <circle cx="115" cy="230" r="6" fill="#38bdf8" />
        <circle cx="115" cy="250" r="8" fill="#0284c7" />
        <text x="97" y="320" text-anchor="middle" font-size="11" fill="#475569">Turn on clean</text>
        <text x="97" y="335" text-anchor="middle" font-size="11" fill="#475569">running water</text>
      </g>

      <!-- Step 2 -->
      <g filter="url(#wDrop)">
        <rect x="180" y="75" width="135" height="300" rx="12" fill="#ffffff" stroke="#f472b6" stroke-width="2.5" />
        <circle cx="247" cy="110" r="22" fill="#db2777" />
        <text x="247" y="117" text-anchor="middle" font-weight="bold" font-size="18" fill="#ffffff">2</text>
        <text x="247" y="155" text-anchor="middle" font-weight="bold" font-size="13" fill="#be185d">ADD SOAP</text>
        <!-- Soap bar illustration -->
        <rect x="215" y="195" width="65" height="40" rx="10" fill="#fbcfe8" stroke="#db2777" stroke-width="2" />
        <!-- Bubbles -->
        <circle cx="230" cy="180" r="8" fill="#e0e7ff" stroke="#818cf8" />
        <circle cx="265" cy="175" r="12" fill="#e0e7ff" stroke="#818cf8" />
        <text x="247" y="320" text-anchor="middle" font-size="11" fill="#475569">Make lots of</text>
        <text x="247" y="335" text-anchor="middle" font-size="11" fill="#475569">bubbly lather</text>
      </g>

      <!-- Step 3 -->
      <g filter="url(#wDrop)">
        <rect x="330" y="75" width="140" height="300" rx="12" fill="#ffffff" stroke="#facc15" stroke-width="2.5" />
        <circle cx="400" cy="110" r="22" fill="#ca8a04" />
        <text x="400" y="117" text-anchor="middle" font-weight="bold" font-size="18" fill="#ffffff">3</text>
        <text x="400" y="155" text-anchor="middle" font-weight="bold" font-size="13" fill="#a16207">SCRUB 20 SECS</text>
        <!-- Scrubbing hands symbol -->
        <circle cx="385" cy="215" r="22" fill="#fed7aa" />
        <circle cx="415" cy="215" r="22" fill="#fed7aa" />
        <text x="400" y="315" text-anchor="middle" font-size="11" fill="#475569">Palms, fingers,</text>
        <text x="400" y="330" text-anchor="middle" font-size="11" fill="#475569">backs &amp; nails!</text>
        <text x="400" y="348" text-anchor="middle" font-size="10" font-weight="bold" fill="#e11d48">Sing 20 seconds!</text>
      </g>

      <!-- Step 4 -->
      <g filter="url(#wDrop)">
        <rect x="485" y="75" width="135" height="300" rx="12" fill="#ffffff" stroke="#4ade80" stroke-width="2.5" />
        <circle cx="552" cy="110" r="22" fill="#16a34a" />
        <text x="552" y="117" text-anchor="middle" font-weight="bold" font-size="18" fill="#ffffff">4</text>
        <text x="552" y="155" text-anchor="middle" font-weight="bold" font-size="13" fill="#15803d">RINSE CLEAN</text>
        <!-- Splashing water -->
        <path d="M 520 220 Q 550 200 580 220" stroke="#06b6d4" stroke-width="4" fill="none" />
        <circle cx="535" cy="235" r="5" fill="#06b6d4" />
        <circle cx="552" cy="245" r="6" fill="#06b6d4" />
        <circle cx="570" cy="235" r="5" fill="#06b6d4" />
        <text x="552" y="320" text-anchor="middle" font-size="11" fill="#475569">Wash away all</text>
        <text x="552" y="335" text-anchor="middle" font-size="11" fill="#475569">soap and germs</text>
      </g>

      <!-- Step 5 -->
      <g filter="url(#wDrop)">
        <rect x="635" y="75" width="135" height="300" rx="12" fill="#ffffff" stroke="#c084fc" stroke-width="2.5" />
        <circle cx="702" cy="110" r="22" fill="#9333ea" />
        <text x="702" y="117" text-anchor="middle" font-weight="bold" font-size="18" fill="#ffffff">5</text>
        <text x="702" y="155" text-anchor="middle" font-weight="bold" font-size="13" fill="#7e22ce">DRY WELL</text>
        <!-- Towel illustration -->
        <rect x="677" y="195" width="50" height="60" rx="6" fill="#e9d5ff" stroke="#9333ea" stroke-width="2" />
        <line x1="685" y1="245" x2="720" y2="245" stroke="#9333ea" stroke-width="2" />
        <text x="702" y="320" text-anchor="middle" font-size="11" fill="#475569">Dry with clean</text>
        <text x="702" y="335" text-anchor="middle" font-size="11" fill="#475569">cloth or towel</text>
      </g>

      <!-- Bottom Rhyme Ribbon -->
      <rect x="40" y="400" width="720" height="75" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <text x="400" y="426" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490">
        Classroom Rhyme: "Top and bottom, top and bottom, in between, in between!
      </text>
      <text x="400" y="448" text-anchor="middle" font-size="13" font-weight="bold" fill="#0e7490">
        Rub your hands together, rub your hands together, now they're clean, squeaky clean!"
      </text>
    </svg>`,
  },

  // 7. Fractions & Visual Models (Mathematics)
  fractions: {
    title: 'Fractions: Parts of a Whole (Halves, Thirds & Fourths)',
    caption: 'Visualizing fractions as equal parts of an object: numerator shows parts chosen, denominator shows total equal parts.',
    diagramType: 'Mathematical Model',
    keyLabels: [
      '1 Whole (1/1) - Complete untouched unit',
      'One Half (1/2) - Two equal parts, 1 shaded',
      'One Third (1/3) - Three equal parts, 1 shaded',
      'One Fourth / Quarter (1/4) - Four equal parts, 1 shaded',
      'Numerator = Top number (Count of parts)',
      'Denominator = Bottom number (Total equal pieces)',
    ],
    teachingPrompt: 'Math Board Exercise: Draw a circle on the board and ask: If 3 children share 1 pizza equally, what fraction does each child receive?',
    svgMarkup: `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
      <defs>
        <filter id="fDrop" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
        </filter>
      </defs>
      <rect width="800" height="500" fill="#f8fafc" rx="12" />

      <rect x="20" y="15" width="760" height="38" rx="8" fill="#1e3a8a" />
      <text x="400" y="40" text-anchor="middle" font-weight="bold" font-size="15" fill="#ffffff">
        BEACON HILL MATHEMATICS • UNDERSTANDING FRACTIONS AS EQUAL PARTS
      </text>

      <!-- 1 Whole -->
      <g filter="url(#fDrop)">
        <rect x="30" y="75" width="165" height="280" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <text x="112" y="105" text-anchor="middle" font-weight="bold" font-size="15" fill="#0f172a">1 WHOLE</text>
        <circle cx="112" cy="180" r="50" fill="#60a5fa" stroke="#2563eb" stroke-width="3" />
        <text x="112" y="270" text-anchor="middle" font-weight="bold" font-size="22" fill="#1e3a8a">1</text>
        <text x="112" y="300" text-anchor="middle" font-size="11" fill="#475569">All parts together</text>
        <text x="112" y="318" text-anchor="middle" font-size="11" fill="#475569">(1 out of 1 part)</text>
      </g>

      <!-- 1/2 Half -->
      <g filter="url(#fDrop)">
        <rect x="220" y="75" width="165" height="280" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <text x="302" y="105" text-anchor="middle" font-weight="bold" font-size="15" fill="#0f172a">ONE HALF</text>
        <!-- Half Circle Shaded -->
        <circle cx="302" cy="180" r="50" fill="#f1f5f9" stroke="#2563eb" stroke-width="3" />
        <path d="M 302 130 A 50 50 0 0 1 302 230 Z" fill="#60a5fa" />
        <line x1="302" y1="130" x2="302" y2="230" stroke="#1e3a8a" stroke-width="3" />
        <text x="302" y="270" text-anchor="middle" font-weight="bold" font-size="24" fill="#1e3a8a">1/2</text>
        <text x="302" y="300" text-anchor="middle" font-size="11" fill="#475569">1 shaded part</text>
        <text x="302" y="318" text-anchor="middle" font-size="11" fill="#475569">out of 2 equal parts</text>
      </g>

      <!-- 1/3 Third -->
      <g filter="url(#fDrop)">
        <rect x="410" y="75" width="165" height="280" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <text x="492" y="105" text-anchor="middle" font-weight="bold" font-size="15" fill="#0f172a">ONE THIRD</text>
        <!-- Third Circle Shaded (120 deg) -->
        <circle cx="492" cy="180" r="50" fill="#f1f5f9" stroke="#2563eb" stroke-width="3" />
        <path d="M 492 180 L 492 130 A 50 50 0 0 1 535 205 Z" fill="#34d399" />
        <line x1="492" y1="180" x2="492" y2="130" stroke="#1e3a8a" stroke-width="3" />
        <line x1="492" y1="180" x2="535" y2="205" stroke="#1e3a8a" stroke-width="3" />
        <line x1="492" y1="180" x2="449" y2="205" stroke="#1e3a8a" stroke-width="3" />
        <text x="492" y="270" text-anchor="middle" font-weight="bold" font-size="24" fill="#065f46">1/3</text>
        <text x="492" y="300" text-anchor="middle" font-size="11" fill="#475569">1 shaded part</text>
        <text x="492" y="318" text-anchor="middle" font-size="11" fill="#475569">out of 3 equal parts</text>
      </g>

      <!-- 1/4 Fourth -->
      <g filter="url(#fDrop)">
        <rect x="600" y="75" width="165" height="280" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
        <text x="682" y="105" text-anchor="middle" font-weight="bold" font-size="15" fill="#0f172a">ONE QUARTER</text>
        <!-- Quarter Circle Shaded (90 deg) -->
        <circle cx="682" cy="180" r="50" fill="#f1f5f9" stroke="#2563eb" stroke-width="3" />
        <path d="M 682 180 L 682 130 A 50 50 0 0 1 732 180 Z" fill="#f472b6" />
        <line x1="682" y1="130" x2="682" y2="230" stroke="#1e3a8a" stroke-width="3" />
        <line x1="632" y1="180" x2="732" y2="180" stroke="#1e3a8a" stroke-width="3" />
        <text x="682" y="270" text-anchor="middle" font-weight="bold" font-size="24" fill="#9d174d">1/4</text>
        <text x="682" y="300" text-anchor="middle" font-size="11" fill="#475569">1 shaded part</text>
        <text x="682" y="318" text-anchor="middle" font-size="11" fill="#475569">out of 4 equal parts</text>
      </g>

      <!-- Numerator / Denominator Guide -->
      <rect x="40" y="375" width="720" height="95" rx="10" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
      <text x="140" y="410" font-weight="bold" font-size="16" fill="#1e40af">NUMERATOR (Top)</text>
      <text x="140" y="430" font-size="12" fill="#475569">How many parts you have or choose.</text>
      <line x1="380" y1="390" x2="380" y2="455" stroke="#93c5fd" stroke-width="2" />
      <text x="410" y="410" font-weight="bold" font-size="16" fill="#15803d">DENOMINATOR (Bottom)</text>
      <text x="410" y="430" font-size="12" fill="#475569">Total number of equal parts the whole is divided into.</text>
    </svg>`,
  },
};

/**
 * Universal dynamic SVG generator that produces a structured educational diagram
 * for any academic topic (Science, Social Studies, English, Mathematics, Business, etc.).
 */
export function generateUniversalTopicSvg(
  topic: string,
  subject: string,
  academicLevel: AcademicLevel,
  subLevel?: string
): DiagramTemplateDefinition {
  const cleanTopic = topic.trim();
  const cleanSubject = subject.trim();

  // Generate 4 logical pedagogical steps or components based on the topic
  const steps = [
    { num: '1', title: 'Foundational Concept', desc: `Basic principle of ${cleanTopic.slice(0, 24)}`, color: '#3b82f6', bg: '#eff6ff' },
    { num: '2', title: 'Core Process & Action', desc: 'How the components work and interact', color: '#10b981', bg: '#ecfdf5' },
    { num: '3', title: 'Interaction & Change', desc: 'Cause, effect, or functional transformation', color: '#f59e0b', bg: '#fffbeb' },
    { num: '4', title: 'Outcome & Practical Value', desc: 'Final result and real-world application', color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  const svgMarkup = `<svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
    <defs>
      <filter id="uDrop" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12"/>
      </filter>
    </defs>
    <rect width="800" height="500" fill="#f8fafc" rx="12" />

    <!-- Top School Banner -->
    <rect x="20" y="15" width="760" height="42" rx="8" fill="#1e3a8a" />
    <text x="35" y="41" font-weight="bold" font-size="14" fill="#ffffff" letter-spacing="0.5">
      BEACON HILL SCHOOLS • ${cleanSubject.toUpperCase()} LESSON AID
    </text>
    <text x="760" y="41" text-anchor="end" font-size="12" fill="#93c5fd">
      ${academicLevel.toUpperCase()} ${subLevel ? `(${subLevel})` : ''}
    </text>

    <!-- Main Topic Box -->
    <rect x="20" y="70" width="760" height="50" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <text x="35" y="100" font-weight="bold" font-size="15" fill="#0f172a">
      TOPIC SCHEMATIC: ${cleanTopic}
    </text>

    <!-- Central Connecting Flow Line -->
    <line x1="80" y1="230" x2="720" y2="230" stroke="#94a3b8" stroke-width="4" stroke-linecap="round" stroke-dasharray="8,6" />

    <!-- 4 Structured Educational Cards -->
    ${steps
      .map(
        (st, idx) => `
      <g filter="url(#uDrop)">
        <rect x="${40 + idx * 185}" y="145" width="165" height="170" rx="10" fill="${st.bg}" stroke="${st.color}" stroke-width="2.5" />
        <circle cx="${122 + idx * 185}" cy="175" r="18" fill="${st.color}" />
        <text x="${122 + idx * 185}" y="181" text-anchor="middle" font-weight="bold" font-size="15" fill="#ffffff">${st.num}</text>
        <text x="${122 + idx * 185}" y="215" text-anchor="middle" font-weight="bold" font-size="11" fill="#0f172a">${st.title}</text>
        <line x1="${55 + idx * 185}" y1="225" x2="${190 + idx * 185}" y2="225" stroke="${st.color}" stroke-width="1" opacity="0.4" />
        <foreignObject x="${50 + idx * 185}" y="235" width="145" height="70">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 10px; color: #334155; line-height: 1.35; text-align: center; padding: 2px;">
            ${st.desc}
          </div>
        </foreignObject>
        ${
          idx < 3
            ? `<polygon points="${215 + idx * 185},230 ${202 + idx * 185},223 ${202 + idx * 185},237" fill="#64748b" />`
            : ''
        }
      </g>
    `
      )
      .join('')}

    <!-- Lower Educational Takeaway Panel -->
    <rect x="20" y="340" width="760" height="135" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
    <rect x="20" y="340" width="760" height="32" rx="10" fill="#f1f5f9" />
    <text x="35" y="361" font-weight="bold" font-size="12" fill="#1e3a8a">
      TEACHER BOARD GUIDE &amp; STUDENT OBSERVATION POINTS
    </text>

    <!-- Point 1 -->
    <circle cx="45" cy="395" r="4" fill="#3b82f6" />
    <text x="60" y="399" font-size="12" fill="#1e293b">
      <tspan font-weight="bold">Classroom Discussion:</tspan> Guide pupils through each stage in numerical order. Ask them to explain Step 1 before advancing.
    </text>

    <!-- Point 2 -->
    <circle cx="45" cy="425" r="4" fill="#10b981" />
    <text x="60" y="429" font-size="12" fill="#1e293b">
      <tspan font-weight="bold">Visual Lesson Aid Role:</tspan> Have students copy this schematic diagram into their exercise books and label the arrows.
    </text>

    <!-- Point 3 -->
    <circle cx="45" cy="455" r="4" fill="#f59e0b" />
    <text x="60" y="459" font-size="12" fill="#1e293b">
      <tspan font-weight="bold">Reinforcement Question:</tspan> How does understanding ${cleanTopic.slice(0, 30)} help us in our daily community and environment?
    </text>
  </svg>`;

  return {
    title: `${cleanTopic}: Visual Lesson Aid Schematic`,
    caption: `Structured educational diagram illustrating the components, sequence, and key relationships in ${cleanTopic}.`,
    diagramType: 'Curriculum Concept Schematic',
    keyLabels: [
      `1. Foundational Principle of ${cleanTopic.slice(0, 20)}`,
      '2. Core Operating Process',
      '3. Functional Interactions & Changes',
      '4. Practical Application & Outcomes',
    ],
    teachingPrompt: `Whiteboard Exercise: Walk through each numbered block with pupils and ask: "Which stage happens first and why?"`,
    svgMarkup,
  };
}

/**
 * Matches a lesson topic and subject to the most relevant educational diagram.
 */
export function getEducationalDiagramForTopic(
  topic: string,
  subject: string,
  academicLevel: AcademicLevel,
  subLevel?: string
): DiagramTemplateDefinition {
  const lowerTopic = (topic + ' ' + subject).toLowerCase();

  if (
    lowerTopic.includes('water cycle') ||
    lowerTopic.includes('rain') ||
    lowerTopic.includes('evaporation') ||
    lowerTopic.includes('hydrolog')
  ) {
    return DIAGRAM_TEMPLATES.water_cycle;
  }

  if (
    lowerTopic.includes('photosynthesis') ||
    lowerTopic.includes('plant nutrition') ||
    lowerTopic.includes('how plants make food') ||
    lowerTopic.includes('chlorophyll')
  ) {
    return DIAGRAM_TEMPLATES.photosynthesis;
  }

  if (
    lowerTopic.includes('state of matter') ||
    lowerTopic.includes('states of matter') ||
    lowerTopic.includes('solid liquid') ||
    lowerTopic.includes('melting') ||
    lowerTopic.includes('freezing')
  ) {
    return DIAGRAM_TEMPLATES.states_of_matter;
  }

  if (
    lowerTopic.includes('heart') ||
    lowerTopic.includes('circulat') ||
    lowerTopic.includes('blood') ||
    lowerTopic.includes('aorta') ||
    lowerTopic.includes('pulse')
  ) {
    return DIAGRAM_TEMPLATES.heart_circulatory;
  }

  if (
    lowerTopic.includes('circuit') ||
    lowerTopic.includes('electric') ||
    lowerTopic.includes('battery') ||
    lowerTopic.includes('switch') ||
    lowerTopic.includes('current')
  ) {
    return DIAGRAM_TEMPLATES.electric_circuit;
  }

  if (
    lowerTopic.includes('wash') ||
    lowerTopic.includes('hygiene') ||
    lowerTopic.includes('clean hand') ||
    lowerTopic.includes('germ') ||
    (academicLevel === 'nursery' && lowerTopic.includes('clean'))
  ) {
    return DIAGRAM_TEMPLATES.hand_washing;
  }

  if (
    lowerTopic.includes('fraction') ||
    lowerTopic.includes('half') ||
    lowerTopic.includes('quarter') ||
    lowerTopic.includes('numerator') ||
    lowerTopic.includes('denominator')
  ) {
    return DIAGRAM_TEMPLATES.fractions;
  }

  // Universal topic schematic generator
  return generateUniversalTopicSvg(topic, subject, academicLevel, subLevel);
}
