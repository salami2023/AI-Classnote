export type AcademicLevel = 'nursery' | 'primary' | 'secondary';

export interface VocabularyItem {
  term: string;
  simpleDefinition: string;
  exampleSentence?: string;
}

export interface LessonSection {
  period?: number;
  periodTitle?: string;
  title: string;
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

export interface LessonNote {
  id: string;
  createdAt: string;
  subject: string;
  topic: string;
  academicLevel: AcademicLevel;
  subLevel: string;
  duration: string;
  periodsCount?: number;
  targetAgeGroup?: string;
  overview: string;
  learningObjectives: string[];
  keyVocabulary: VocabularyItem[];
  sections: LessonSection[];
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
  subject: string;
  topic: string;
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
}
