import { LessonNote, ExamPaper } from '../types';

export const SAMPLE_PRESETS = [
  {
    id: 'nursery-body',
    academicLevel: 'nursery' as const,
    subLevel: 'KG 2',
    subject: 'Health Habits & Literacy',
    topic: 'My Wonderful Body & Washing Hands',
    periods: 2,
    duration: '30 mins',
    content: `Parts of the body: head, eyes, ears, nose, mouth, hands, and feet.
Why we wash our hands with soap and water: to chase away tiny germs we cannot see.
When to wash hands: before eating food, after playing outside in the sand, and after using the toilet.
Song/Rhyme: "Wash, wash, wash your hands, make them nice and clean! Rub the top and rub the palms, cleanest ever seen!"`,
  },
  {
    id: 'primary-water-cycle',
    academicLevel: 'primary' as const,
    subLevel: 'Basic 4',
    subject: 'Basic Science & Technology',
    topic: 'The Water Cycle and States of Matter',
    periods: 3,
    duration: '45 mins',
    content: `Three states of water: Solid (ice), Liquid (drinking water), and Gas (water vapor / steam).
The 4 stages of the water cycle:
1. Evaporation: The sun heats up water from rivers, lakes, and oceans. The water turns into invisible vapor and rises into the sky.
2. Condensation: High up in the cool sky, water vapor cools down and joins together to form fluffy clouds.
3. Precipitation: When clouds get too heavy with water droplets, they fall back to earth as rain, snow, or sleet.
4. Collection: Rainwater collects into rivers, streams, and oceans, and the cycle begins all over again.
Key facts: Water never disappears; it is recycled again and again on Earth!`,
  },
  {
    id: 'secondary-photosynthesis',
    academicLevel: 'secondary' as const,
    subLevel: 'JSS 2',
    subject: 'Biology / Integrated Science',
    topic: 'Photosynthesis & Plant Nutrition',
    periods: 2,
    duration: '60 mins',
    content: `Definition: Photosynthesis is the biochemical process by which green plants manufacture their own food (glucose) using sunlight, water, and carbon dioxide in the presence of chlorophyll.
Chemical Equation: 6CO2 + 6H2O + Sunlight -> C6H12O6 + 6O2
Raw materials needed:
- Carbon dioxide (absorbed through stomata on leaves)
- Water (absorbed from soil via root hair cells and transported via xylem)
- Sunlight (absorbed by the green pigment chlorophyll inside chloroplasts)
Products:
- Glucose (used for plant energy, growth, or stored as starch)
- Oxygen (by-product released into atmosphere for respiration of living organisms)
Significance: Primary source of food on Earth, sustains atmospheric oxygen balance, reduces greenhouse gases.`,
  },
];

export const INITIAL_LESSON_NOTE: LessonNote = {
  id: 'sample-primary-water',
  createdAt: new Date().toISOString(),
  subject: 'Basic Science',
  topic: 'The Water Cycle: Earth’s Natural Recycler',
  academicLevel: 'primary',
  subLevel: 'Basic 4',
  duration: '45 mins',
  periodsCount: 3,
  targetAgeGroup: '9 - 10 years',
  overview: 'In this lesson, pupils learn how water moves continuously between the Earth and the sky in four simple steps: Evaporation, Condensation, Precipitation, and Collection.',
  learningObjectives: [
    'Identify the three forms of water: solid (ice), liquid (water), and gas (steam/vapor).',
    'Describe the four main stages of the water cycle in simple words.',
    'Explain why rain falls from clouds when they become heavy.',
    'Demonstrate how the water cycle works using a simple zip-lock bag classroom model.',
  ],
  keyVocabulary: [
    {
      term: 'Water Cycle',
      simpleDefinition: 'The endless journey water takes from the ground to the clouds and back down to the ground.',
      exampleSentence: 'Rain is an important part of the water cycle.',
    },
    {
      term: 'Evaporation',
      simpleDefinition: 'When liquid water warms up from the sun and turns into an invisible gas called water vapor.',
      exampleSentence: 'A puddle on the road dries up because of evaporation.',
    },
    {
      term: 'Condensation',
      simpleDefinition: 'When invisible water vapor cools down and turns into tiny water droplets to form clouds.',
      exampleSentence: 'You see condensation on a cold glass of lemonade.',
    },
    {
      term: 'Precipitation',
      simpleDefinition: 'Water falling from clouds down to Earth as rain, drizzle, or hail.',
      exampleSentence: 'We use umbrellas during heavy precipitation.',
    },
    {
      term: 'Collection',
      simpleDefinition: 'Water gathering together in rivers, lakes, ponds, and oceans.',
      exampleSentence: 'Streams flow downhill for collection in the sea.',
    },
  ],
  sections: [
    {
      period: 1,
      periodTitle: 'Period 1: The Three States of Water',
      title: 'What Are the Three States of Water?',
      explanationBulletPoints: [
        'Water is special because it can exist in three different shapes or states.',
        'Solid state: Ice cubes in the freezer are hard and hold their shape.',
        'Liquid state: The water we drink, wash with, and swim in.',
        'Gas state: Water vapor that rises from a hot bowl of soup or boiling kettle.',
      ],
      everydayAnalogyOrExample: 'Think of water as a shapeshifter: cold makes it freeze like a stone, warm makes it run like a river, and heat makes it fly like air!',
      teacherTipOrBoardPrompt: 'Draw three simple boxes on the board: Ice cube, Water cup, and Cloud steam.',
    },
    {
      period: 2,
      periodTitle: 'Period 2: The 4 Big Steps of the Water Cycle',
      title: 'The 4 Big Steps of the Water Cycle',
      explanationBulletPoints: [
        'Step 1 (Evaporation): The hot sun shines on puddles, rivers, and seas. The water gets warm and floats up into the sky as light vapor.',
        'Step 2 (Condensation): As the water vapor climbs higher into the chilly sky, it shivers, cools down, and hugs other droplets to create fluffy white or grey clouds.',
        'Step 3 (Precipitation): The cloud gets fuller and darker until it cannot hold the heavy water anymore. Splash! It drops down as rain.',
        'Step 4 (Collection): The fallen rain flows into soil, drains, streams, and oceans. Then the sun shines again, and the magic cycle restarts!',
      ],
      everydayAnalogyOrExample: 'It is just like a giant water wheel or carousel that never stops turning on planet Earth.',
      teacherTipOrBoardPrompt: 'Have students repeat with hand motions: Hands up (Evaporation), Hands together (Condensation), Wiggle fingers down (Precipitation), Hands sweep wide (Collection).',
    },
    {
      period: 3,
      periodTitle: 'Period 3: Why the Water Cycle Matters to Us',
      title: 'Why is the Water Cycle Important to Us?',
      explanationBulletPoints: [
        'It gives clean fresh water to plants, trees, farm crops, and drinking reservoirs.',
        'It cleans our air and keeps weather temperatures balanced.',
        'The water dinosaur drank millions of years ago is the exact same water we drink today!',
      ],
      everydayAnalogyOrExample: 'Earth does not make brand new water; it is the ultimate nature recycler.',
      teacherTipOrBoardPrompt: 'Board summary table linking Evaporation -> Cloud -> Rain -> River.',
    },
  ],
  classActivities: [
    {
      title: 'The Mini Water Cycle in a Zip-Lock Bag',
      durationMinutes: '15 mins',
      activityType: 'Pair Work / Demonstration',
      materialsNeeded: [
        'Clear zip-lock sandwich bags (1 per pair)',
        'Blue food coloring (optional)',
        'Water (approx. 2 tablespoons per bag)',
        'Permanent markers',
        'Tape to stick bags onto a sunny classroom window',
      ],
      stepByStepInstructions: [
        'Step 1: Students use markers to draw the sun, a cloud, and ocean waves on the plastic bag.',
        'Step 2: Pour 2 tablespoons of water (tinted blue) into the bottom of the bag.',
        'Step 3: Seal the zip-lock securely to trap the air and water inside.',
        'Step 4: Tape the bag to a bright, sunny window.',
        'Step 5: Observe how the sun warms the water (evaporation), droplets form on the bag walls (condensation), and slide back down (precipitation)!',
      ],
      expectedOutcome: 'Pupils visibly witness all four stages of the water cycle happening in real-time inside their transparent bag.',
    },
  ],
  homework: {
    title: 'Water Detective & Cloud Observation Sheet',
    instructions: 'Complete the three short tasks below in your science notebook. Ask an older family member to help you spot examples!',
    questionsOrTasks: [
      'Question 1: Name the three states of water and draw one example of each in your notebook.',
      'Question 2: Look outside your window before dinner. Describe the clouds in the sky. Are they white and fluffy or dark and heavy?',
      'Question 3: Kitchen experiment: When someone boils water in a pot with a lid, what appears under the lid when you lift it? Which step of the water cycle is this?',
      'Question 4 (Bonus): Write down two reasons why we must turn off running taps while brushing our teeth.',
    ],
    guidanceForParentsOrSelfStudy: 'Parents: Please supervise children near warm cooking appliances. Encourage your child to describe what happens in their own words.',
    submissionDeadlineNote: 'Due next Science period (Thursday morning).',
  },
  quickSummaryChecklist: [
    'Water exists as Ice (solid), Water (liquid), and Vapor (gas).',
    'Evaporation is water rising into the sky as vapor.',
    'Condensation is water vapor forming clouds.',
    'Precipitation is rain falling back down.',
    'Collection is water gathering in lakes and seas.',
  ],
  teacherPedagogyNotes: 'At the Primary level, focus on visual kinesthetics. Repeating the four-stage hand gesture song ensures 100% retention before the end of the 45-minute period.',
};

export const INITIAL_EXAM_PAPER: ExamPaper = {
  id: 'sample-primary-water-exam',
  createdAt: new Date().toISOString(),
  examTitle: 'Continuous Assessment Test: The Water Cycle',
  subject: 'Basic Science & Technology',
  topic: 'The Water Cycle and States of Matter',
  academicLevel: 'primary',
  subLevel: 'Basic 4',
  timeAllowed: '30 Minutes',
  totalMarks: 25,
  difficulty: 'standard',
  generalInstructions: [
    'Read all questions carefully before choosing or writing your answer.',
    'Section A contains 5 Multiple Choice Questions (1 mark each). Circle the correct letter.',
    'Section B contains 3 Short Answer Questions (3 marks each). Write clearly.',
    'Section C contains 1 Application / Diagram question (11 marks).',
    'Write neatly and double-check your work before submission.',
  ],
  sections: [
    {
      sectionCode: 'Section A',
      sectionTitle: 'Multiple Choice Questions (5 Marks)',
      instructions: 'Choose the most correct option (A, B, C, or D) for each question.',
      totalMarksForSection: 5,
      questions: [
        {
          questionNumber: 1,
          questionText: 'What warms up water in rivers and oceans to start evaporation?',
          options: ['A) The cold moon', 'B) The hot sun', 'C) Wind currents', 'D) Rain clouds'],
          marks: 1,
          correctAnswer: 'B) The hot sun',
          markingSchemeOrRubric: 'Award 1 mark for option B.',
        },
        {
          questionNumber: 2,
          questionText: 'When water freezes in a cold refrigerator, it turns into which state of matter?',
          options: ['A) Solid ice', 'B) Liquid water', 'C) Invisible gas', 'D) Water vapor'],
          marks: 1,
          correctAnswer: 'A) Solid ice',
          markingSchemeOrRubric: 'Award 1 mark for option A.',
        },
        {
          questionNumber: 3,
          questionText: 'Which word means water falling from clouds as rain?',
          options: ['A) Evaporation', 'B) Condensation', 'C) Precipitation', 'D) Filtration'],
          marks: 1,
          correctAnswer: 'C) Precipitation',
          markingSchemeOrRubric: 'Award 1 mark for option C.',
        },
        {
          questionNumber: 4,
          questionText: 'Clouds in the sky are formed during which stage of the water cycle?',
          options: ['A) Evaporation', 'B) Condensation', 'C) Melting', 'D) Freezing'],
          marks: 1,
          correctAnswer: 'B) Condensation',
          markingSchemeOrRubric: 'Award 1 mark for option B.',
        },
        {
          questionNumber: 5,
          questionText: 'Why is the water cycle called a "cycle"?',
          options: [
            'A) It only happens once a year',
            'B) It stops completely in the rainy season',
            'C) It repeats continuously over and over again',
            'D) It is shaped like a bicycle wheel',
          ],
          marks: 1,
          correctAnswer: 'C) It repeats continuously over and over again',
          markingSchemeOrRubric: 'Award 1 mark for option C.',
        },
      ],
    },
    {
      sectionCode: 'Section B',
      sectionTitle: 'Short Answer & Fill-in-the-Blank (9 Marks)',
      instructions: 'Provide clear, brief answers in the spaces provided.',
      totalMarksForSection: 9,
      questions: [
        {
          questionNumber: 6,
          questionText: 'List the THREE states of water and give ONE daily example for each state.',
          marks: 3,
          correctAnswer: '1. Solid (Ice cubes/snow); 2. Liquid (Drinking water/ocean); 3. Gas (Steam from kettle/water vapor).',
          markingSchemeOrRubric: '1 mark for each correctly identified state and matched example (Total: 3 marks).',
        },
        {
          questionNumber: 7,
          questionText: 'What happens to a shallow puddle of rainwater on a hot sunny afternoon, and why?',
          marks: 3,
          correctAnswer: 'The puddle dries up/disappears because the sun heats the water, turning it into invisible water vapor through the process of evaporation.',
          markingSchemeOrRubric: '1 mark for stating it dries up, 2 marks for mentioning sun heat and evaporation.',
        },
        {
          questionNumber: 8,
          questionText: 'Explain in one or two simple sentences what happens during Condensation.',
          marks: 3,
          correctAnswer: 'During condensation, warm water vapor rises up into the cold air, cools down, and joins together to form droplets that create clouds.',
          markingSchemeOrRubric: '2 marks for cooling down of vapor, 1 mark for formation of clouds/droplets.',
        },
      ],
    },
    {
      sectionCode: 'Section C',
      sectionTitle: 'Structured / Diagram & Application (11 Marks)',
      instructions: 'Answer the question completely showing your understanding.',
      totalMarksForSection: 11,
      questions: [
        {
          questionNumber: 9,
          questionText: 'A pupil notices tiny droplets of water collecting on the outside of a cold metal cup of ice water. (a) Where did these water droplets come from? (b) Which process of the water cycle causes this? (c) Mention two reasons why the water cycle is essential to human life on Earth.',
          marks: 11,
          correctAnswer: '(a) From the invisible water vapor present in the surrounding air, not leaking from inside the cup (3 marks). (b) Condensation (3 marks). (c) Provides fresh water for drinking/farming, maintains Earth’s climate and temperature, and cleans the air (5 marks).',
          markingSchemeOrRubric: 'Part (a): 3 marks; Part (b): 3 marks; Part (c): 5 marks (2.5 marks for each valid reason).',
        },
      ],
    },
  ],
  teacherGradingTips: 'Accept pupil answers that explain concepts in their own words as long as core scientific principles (heat, cooling, vapor, rain) are accurately reflected.',
};
