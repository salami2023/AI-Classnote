export type AcademicLevel = 'nursery' | 'primary' | 'secondary';

export interface VocabularyItem {
  term: string;
  simpleDefinition: string;
  exampleSentence?: string;
}

export interface LessonSection {
  periodNumber?: number; // 1, 2, 3, etc.
  periodTitle?: string; // e.g. "Period 1: States of Matter & Molecular Structure"
  title: string;
  subTopics?: string[];
  explanationBulletPoints: string[];
  everydayAnalogyOrExample?: string;
  teacherTipOrBoardPrompt?: string;
}

export interface ClassActivity {
  title: string;
  durationMinutes?: string;
  activityType: string; // e.g. 'Individual', 'Pair Work', 'Group Game', 'Sensory / Song'
  materialsNeeded?: string[];
  stepByStepInstructions: string[];
  expectedOutcome: string;
}

export interface HomeworkAssignment {
  title: string;
  instructions: string;
  questionsOrTasks: string[];
  guidanceForParentsOrSelfStudy?: string;
  submissionDeadlineNote?: string;
}

export interface LessonDiagram {
  id: string;
  title: string;
  caption: string;
  pngBase64: string; // PNG Data URL format: "data:image/png;base64,..." - strictly standalone PNG, NOT external links!
  diagramType?: string; // e.g., 'Scientific Process / Cycle', 'Anatomy / Structure', 'Flowchart / Steps', 'Model / Schematic', 'Early Years Visual Aid'
  keyLabels?: string[]; // e.g. ["1. Evaporation", "2. Condensation", "3. Precipitation", "4. Collection"]
  teachingPrompt?: string; // Board prompt or question for students regarding this diagram
  svgSource?: string; // Optional raw SVG markup
  width?: number;
  height?: number;
  source?: string;
  createdAt?: string;
}

export interface LessonNote {
  id: string;
  createdAt: string;
  subject: string;
  topic: string;
  academicLevel: AcademicLevel;
  subLevel: string;
  duration: string;
  numberOfPeriods?: number; // 1 to 6 teaching periods allocated to this topic
  periodAllocationSummary?: string; // e.g. "3 Periods (45 mins each)"
  targetAgeGroup?: string;
  overview: string;
  learningObjectives: string[];
  keyVocabulary: VocabularyItem[];
  sections: LessonSection[];
  diagrams?: LessonDiagram[];
  classActivities: ClassActivity[];
  homework: HomeworkAssignment;
  quickSummaryChecklist: string[];
  teacherPedagogyNotes?: string;
  sourceContent?: string;
}

export interface ExamQuestion {
  questionNumber: number;
  questionText: string;
  options?: string[]; // For MCQs
  marks: number;
  correctAnswer: string;
  markingSchemeOrRubric?: string;
}

export interface ExamSection {
  sectionCode: string; // e.g., 'Section A'
  sectionTitle: string; // e.g., 'Multiple Choice Questions'
  instructions?: string;
  totalMarksForSection?: number;
  questions: ExamQuestion[];
}

export interface ExamPaper {
  id: string;
  createdAt: string;
  examTitle: string;
  schoolName?: string;
  schoolLogoUrl?: string;
  termOrSemester?: string;
  academicSession?: string;
  subject: string;
  topic: string;
  coveredTopics?: string[]; // All topics that classnotes have been generated on
  academicLevel: AcademicLevel;
  subLevel: string;
  timeAllowed: string;
  totalMarks: number;
  generalInstructions: string[];
  sections: ExamSection[];
  teacherGradingTips?: string;
  difficulty: 'easy' | 'standard' | 'challenging';
}

export interface PrintSettings {
  schoolName: string;
  teacherName: string;
  termOrSemester: string;
  academicYear: string;
  studentNameLine: boolean;
  dateLine: boolean;
  scoreBox: boolean;
  schoolLogoUrl?: string; // Optional custom or default school crest
}
