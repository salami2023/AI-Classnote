import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Resilient content generator that retries on transient spikes (e.g. 503 UNAVAILABLE) and falls back to alternate flash models if needed
async function generateWithRetry(ai: GoogleGenAI, params: any, maxRetries = 2) {
  let lastError: any = null;
  const models = [params.model || "gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const currentModel = models[Math.min(attempt, models.length - 1)];
    const callParams = { ...params, model: currentModel };
    try {
      console.log(`[Gemini] Calling ${currentModel} (attempt ${attempt + 1}/${maxRetries + 1})...`);
      const startTime = Date.now();
      const res = await ai.models.generateContent(callParams);
      console.log(`[Gemini] ${currentModel} completed in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
      return res;
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[Gemini] Attempt ${attempt + 1} with ${currentModel} failed: ${errMsg.slice(0, 120)}`);
      const isTransient =
        errMsg.includes("503") ||
        errMsg.includes("UNAVAILABLE") ||
        errMsg.includes("high demand") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      if (isTransient && attempt < maxRetries) {
        console.warn(
          `[Gemini] Retrying with next model/attempt in ${(attempt + 1) * 1500}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1500));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint: Generate structured Class Notes & Study Guides
app.post("/api/generate-notes", async (req: Request, res: Response) => {
  try {
    const {
      subject,
      topic,
      content,
      academicLevel, // 'nursery' | 'primary' | 'secondary'
      subLevel,      // e.g. 'Nursery 1 (Age 3-4)', 'Primary 4 (Grade 4)', 'Senior Secondary (Grade 10-12)'
      duration = "45 mins",
      tone = "engaging",
      numberOfPeriods = 2,
      customInstructions = "",
    } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: "Subject and Topic are required." });
    }

    const validPeriods = Math.min(Math.max(parseInt(String(numberOfPeriods)) || 2, 1), 6);

    const ai = getAI();

    // Specific pedagogical directives based on academic level
    let levelInstruction = "";
    if (academicLevel === "nursery") {
      levelInstruction = `
ACADEMIC LEVEL: NURSERY / EARLY YEARS (Ages 3-5).
- Vocabulary MUST be ultra-simple, gentle, warm, and playful.
- Use sound-words, rhymes, simple songs, or visual cues where helpful.
- Explanations must be 1-2 sentence bite-sized concepts that a toddler or preschooler can grasp.
- Bullet points must be short and direct.
- Class Activities MUST be sensory, movement-based, play-based, or sing-along (e.g., clapping, miming, coloring, touch & feel).
- Homework MUST be fun, parent-assisted, and simple (e.g., point out 3 objects at home, color a shape, practice with mother/father).
`;
    } else if (academicLevel === "primary") {
      levelInstruction = `
ACADEMIC LEVEL: PRIMARY / ELEMENTARY SCHOOL (Ages 6-11).
- Vocabulary should be clear, foundational, and friendly. Always define new words in plain English.
- Every explanation must use easy-to-relate analogies from everyday life (e.g., kitchen, playground, animals, family).
- Ensure all key notes are organized in distinct bullet points.
- Class Activities MUST be interactive: pair-work, hands-on mini-experiments, flashcard games, or drawing diagrams.
- Homework MUST be clear and reinforcing: short exercises, drawing/labeling, finding examples at home.
`;
    } else {
      levelInstruction = `
ACADEMIC LEVEL: SECONDARY / HIGH SCHOOL (Ages 12-18).
- Vocabulary should be accurate to the academic discipline, but explained in clear, accessible, and simple terms without confusing jargon.
- Break complex ideas down into logical bullet points, sequential steps, cause-and-effect, or comparison tables.
- Class Activities MUST promote critical thinking: guided inquiry, small-group problem solving, role-play/debate, or practical lab demonstrations.
- Homework MUST develop independent mastery: analytical questions, real-world case scenarios, summary outlines, or problem sets.
`;
    }

    const prompt = `You are a master curriculum developer and teacher coach.
Create a comprehensive, structured, and easy-to-read CLASS NOTES & STUDY GUIDE for teachers.

Subject: ${subject}
Topic: ${topic}
Target Class / Academic Level: ${academicLevel.toUpperCase()} (${subLevel || "Standard level"})
Lesson Duration: ${duration} per period
Total Allocated Teaching Periods: ${validPeriods} Period(s)
Preferred Teaching Style: ${tone}
Teacher's Source Content / Curriculum Notes:
"""
${content || "No raw notes provided. Generate a complete, high-quality, syllabus-aligned lesson on this topic."}
"""
Additional Teacher Instructions: ${customInstructions || "None"}

CRITICAL REQUIREMENTS:
1. PERIOD-BASED DIVISION: The topic has been allocated exactly ${validPeriods} teaching period(s).
   You MUST divide the core lesson content into exactly ${validPeriods} distinct, sequential teaching period sections (Period 1${validPeriods > 1 ? ` through Period ${validPeriods}` : ''}). Each period represents a focused, complete instructional session within the overarching topic.
   - Section 1: periodNumber = 1, periodTitle = "Period 1: [Specific Core Sub-topic Focus]"
   ${validPeriods > 1 ? `- Subsequent sections: periodNumber = 2 to ${validPeriods}, each with a descriptive periodTitle, subTopics list, focused bullet-point explanations, everyday analogy, and board prompt.` : ''}
   - For every period section:
     * periodNumber: 1, 2, ... up to ${validPeriods}
     * periodTitle: e.g. "Period 1: Introduction to Matter & Three Physical States"
     * title: concise core sub-topic name
     * subTopics: 2 to 4 specific sub-topics/focus areas covered in this period
     * explanationBulletPoints: simple, student-friendly notes written strictly in bullet points
     * everydayAnalogyOrExample: vivid everyday analogy to anchor comprehension
     * teacherTipOrBoardPrompt: blackboard layout recommendation or thought-provoking interactive prompt
2. ALWAYS present notes in simple and basic terms so students easily understand without feeling overwhelmed.
3. ALWAYS use BULLET POINTS for all explanatory sections to ensure high readability, scannability, and ease of board copying.
4. INCLUDE hands-on, realistic CLASS ACTIVITIES with step-by-step instructions.
5. INCLUDE structured HOMEWORK that reinforces the lesson across the teaching periods.
6. Provide learning objectives, key vocabulary with simple definitions, bite-sized lesson sections, and a student summary checklist.
7. INCLUDE EDUCATIONAL DIAGRAM SPECIFICATION: Diagrams and images are essential lesson aids for teachers. Provide a 'diagramSpec' with clean, educational SVG markup (viewBox='0 0 800 500', clear labels, arrows, shapes, vibrant educational colors), title, caption, keyLabels, and a teaching board prompt.

${levelInstruction}

Generate a valid JSON object matching the requested schema strictly.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert instructional designer and teacher assistant who produces clear, pedagogical, structured class notes divided into discrete teaching periods for educators. Always write in simple, direct language formatted in bullet points. Provide high-quality educational diagrams where appropriate.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            academicLevel: { type: Type.STRING },
            subLevel: { type: Type.STRING },
            duration: { type: Type.STRING },
            numberOfPeriods: { type: Type.INTEGER, description: "Total number of teaching periods allocated to this topic (1 to 6)" },
            periodAllocationSummary: { type: Type.STRING, description: "e.g. '3 Teaching Periods (45 mins each)'" },
            targetAgeGroup: { type: Type.STRING },
            overview: { type: Type.STRING, description: "A simple 2-3 sentence overview of what the lesson teaches across the periods." },
            learningObjectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Bullet points starting with action verbs (e.g., 'Identify...', 'Explain...', 'List...').",
            },
            keyVocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  simpleDefinition: { type: Type.STRING },
                  exampleSentence: { type: Type.STRING },
                },
                required: ["term", "simpleDefinition"],
              },
            },
            diagramSpec: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                caption: { type: Type.STRING },
                diagramType: { type: Type.STRING, description: "e.g. Science Schematic, Process Cycle, Anatomy Model, Flowchart, Early Years Visual Aid" },
                keyLabels: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Key labeled items in the diagram (e.g. 1. Evaporation, 2. Condensation, etc.)",
                },
                teachingPrompt: { type: Type.STRING, description: "Classroom board prompt or discussion question for teachers" },
                svgMarkup: { type: Type.STRING, description: "Full clean valid SVG code (viewBox='0 0 800 500', shapes, arrows, text, colors) illustrating the topic" },
              },
              description: "Visual lesson aid diagram specification for this topic.",
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  periodNumber: { type: Type.INTEGER, description: "The period number: 1, 2, 3, etc." },
                  periodTitle: { type: Type.STRING, description: "e.g. 'Period 1: States of Matter & Molecular Structure'" },
                  title: { type: Type.STRING, description: "Core sub-topic for this teaching period." },
                  subTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2-4 key sub-topics/focus areas covered in this period",
                  },
                  explanationBulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key concepts explained strictly in clean, easy-to-read bullet points.",
                  },
                  everydayAnalogyOrExample: { type: Type.STRING },
                  teacherTipOrBoardPrompt: { type: Type.STRING },
                },
                required: ["periodNumber", "periodTitle", "title", "explanationBulletPoints"],
              },
            },
            classActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  durationMinutes: { type: Type.STRING },
                  activityType: { type: Type.STRING, description: "e.g. Individual, Pair Work, Group Game, Sensory/Song" },
                  materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                  stepByStepInstructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  expectedOutcome: { type: Type.STRING },
                },
                required: ["title", "activityType", "stepByStepInstructions", "expectedOutcome"],
              },
            },
            homework: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                instructions: { type: Type.STRING },
                questionsOrTasks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                guidanceForParentsOrSelfStudy: { type: Type.STRING },
                submissionDeadlineNote: { type: Type.STRING },
              },
              required: ["title", "instructions", "questionsOrTasks"],
            },
            quickSummaryChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-5 bullet points summarizing what students must remember.",
            },
            teacherPedagogyNotes: {
              type: Type.STRING,
              description: "Special pedagogical advice for teaching this specific age group.",
            },
          },
          required: [
            "subject",
            "topic",
            "academicLevel",
            "overview",
            "learningObjectives",
            "keyVocabulary",
            "sections",
            "classActivities",
            "homework",
            "quickSummaryChecklist",
          ],
        },
      },
    });

    const rawText = response.text || "{}";
    const data = JSON.parse(rawText);
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating notes:", error);
    return res.status(500).json({
      error: "Failed to generate class notes.",
      details: error?.message || String(error),
    });
  }
});

// Endpoint: Generate dedicated Lesson Aid Diagram (SVG specification to be converted to PNG)
app.post("/api/generate-diagram", async (req: Request, res: Response) => {
  try {
    const {
      topic,
      subject,
      academicLevel = "primary",
      subLevel = "",
      diagramPrompt = "",
    } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({ error: "Topic and subject are required." });
    }

    const ai = getAI();
    const prompt = `You are a professional educational graphic designer and teacher assistant.
Design a comprehensive, beautifully styled, and easy-to-read EDUCATIONAL SVG DIAGRAM to act as an indispensable lesson aid.

Subject: ${subject}
Topic: ${topic}
Academic Level: ${academicLevel} (${subLevel || "Standard level"})
Specific Focus / Teacher Request: ${diagramPrompt || "Create an intuitive, labeled diagram illustrating the primary concept or steps."}

REQUIREMENTS:
1. The diagram MUST be a complete valid SVG string with viewBox="0 0 800 500" and xmlns="http://www.w3.org/2000/svg".
2. Use clear, modern fonts, distinct shapes, directional flow arrows, high-contrast readable text, and educational color coding.
3. Include title, labeled parts / callouts with clear pointers, and a bottom banner explaining the lesson concept.
4. Return a valid JSON matching the schema.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            caption: { type: Type.STRING },
            diagramType: { type: Type.STRING },
            keyLabels: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            teachingPrompt: { type: Type.STRING },
            svgMarkup: { type: Type.STRING, description: "Complete valid SVG code with viewBox='0 0 800 500'" },
          },
          required: ["title", "caption", "diagramType", "keyLabels", "teachingPrompt", "svgMarkup"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating diagram:", error);
    return res.status(500).json({
      error: "Failed to generate diagram.",
      details: error?.message || String(error),
    });
  }
});

// Endpoint: Generate Exam & Assessment Questions
app.post("/api/generate-exams", async (req: Request, res: Response) => {
  try {
    const {
      subject,
      topic,
      content,
      academicLevel,
      subLevel,
      schoolName = "BEACON HILL SCHOOLS",
      termOrSemester = "First Term Examination",
      academicSession = "2025/2026 Academic Session",
      coveredTopics = [], // All topics and units from generated classnotes
      mcqCount = 30, // 30 MCQs requested
      theoryCount = 8, // 8 Theory questions requested
      difficulty = "standard", // 'easy' | 'standard' | 'challenging'
      customInstructions = "",
    } = req.body;

    if (!subject) {
      return res.status(400).json({ error: "Subject is required." });
    }

    const ai = getAI();

    // Prepare syllabus / topics scope representation
    let topicsSummaryText = "";
    if (Array.isArray(coveredTopics) && coveredTopics.length > 0) {
      topicsSummaryText = `ALL COVERED TOPICS FROM GENERATED CLASS NOTES:\n` +
        coveredTopics
          .map((t: any, idx: number) => {
            if (typeof t === "string") return `${idx + 1}. ${t}`;
            return `${idx + 1}. ${t.topic || t.title}${t.subTopics?.length ? ` (Sub-topics: ${t.subTopics.join(", ")})` : ""}${t.overview ? ` - ${t.overview}` : ""}`;
          })
          .join("\n");
    } else {
      topicsSummaryText = `Primary Topic: ${topic}\nContent Overview: ${content || "Standard curriculum topics for this subject and level."}`;
    }

    let levelPrompt = "";
    if (academicLevel === "nursery") {
      levelPrompt = `
ACADEMIC LEVEL: NURSERY (Ages 3-5).
- Keep question stems simple, visual, and oral-friendly.
- MCQ questions with 3-4 simple options (A, B, C, D).
- Theory questions phrased as simple oral/drawing/identification prompts.
`;
    } else if (academicLevel === "primary") {
      levelPrompt = `
ACADEMIC LEVEL: PRIMARY (Ages 6-11).
- Clear, unambiguous question stems.
- 30 Multiple Choice Questions (A, B, C, D).
- 8 Theory questions with straightforward parts (a, b) focusing on definitions, listings, and practical primary school examples.
`;
    } else {
      levelPrompt = `
ACADEMIC LEVEL: SECONDARY (Ages 12-18).
- Standard WAEC / GCSE / National Curriculum examination format.
- 30 Multiple Choice Questions testing knowledge recall, comprehension, and application.
- 8 Structured Theory / Essay questions with sub-parts: (a), (b), (c) testing analysis, problem-solving, and explanations.
`;
    }

    const prompt = `You are a Senior School Examination Officer and Chief Examiner.
You must construct an official, print-ready, curriculum-standard examination paper.

HEADER PARAMETERS:
- School: ${schoolName}
- Subject: ${subject}
- Primary Topic / Scope: ${topic || "Comprehensive Term Examination"}
- Term / Session: ${termOrSemester} (${academicSession})
- Class / Academic Level: ${academicLevel.toUpperCase()} (${subLevel || "Standard"})
- Difficulty: ${difficulty}

SYLLABUS & CONTENT SCOPE (CRITICAL):
${topicsSummaryText}

${content ? `ADDITIONAL CLASS NOTES EXCERPTS:\n"""\n${content.slice(0, 3000)}\n"""` : ""}
${customInstructions ? `Teacher Directives: ${customInstructions}` : ""}

${levelPrompt}

STRICT EXAM COMPILATION RULES:
1. QUESTION QUANTITY:
   - SECTION A: OBJECTIVE QUESTIONS must contain EXACTLY ${mcqCount} MULTIPLE CHOICE QUESTIONS (numbered sequentially 1 to ${mcqCount}). Each MCQ MUST have 4 options: A, B, C, and D, with 1 mark each. Total: ${mcqCount} marks.
   - SECTION B: THEORY QUESTIONS must contain EXACTLY ${theoryCount} STRUCTURED / ESSAY QUESTIONS (numbered sequentially 1 to ${theoryCount}). Each question should have sub-parts e.g. (a), (b) with clear mark distribution (e.g. 8 to 10 marks per question). Total: ~70 marks.

2. ABSOLUTELY NO TOPIC HEADINGS:
   - DO NOT include topic headings, unit titles, or subject sub-headings anywhere amidst or above individual questions.
   - Simply write out the questions sequentially under Section A (Questions 1 to ${mcqCount}) and Section B (Questions 1 to ${theoryCount}).

3. BALANCED SYLLABUS COVERAGE:
   - The questions MUST be distributed across the ENTIRE range of topics that class notes have been generated on.
   - Every topic listed in the scope above must be tested across the 30 MCQs and 8 theory questions.

4. ANSWER KEY & MARKING SCHEME:
   - Provide the accurate correct answer for each of the ${mcqCount} MCQs (e.g. "B) ...").
   - Provide a complete step-by-step marking guide and rubric for all ${theoryCount} theory questions.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert school examination compiler. You write rigorous, clean, and syllabus-wide school examination papers with exactly 30 MCQs and 8 theory questions, without topic subheadings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examTitle: { type: Type.STRING, description: "e.g. FIRST TERM EXAMINATION" },
            schoolName: { type: Type.STRING },
            termOrSemester: { type: Type.STRING },
            academicSession: { type: Type.STRING },
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            coveredTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of all topics covered in this examination paper",
            },
            academicLevel: { type: Type.STRING },
            subLevel: { type: Type.STRING },
            timeAllowed: { type: Type.STRING, description: "e.g. 2 Hours or 1 Hour 30 Mins" },
            totalMarks: { type: Type.INTEGER, description: "Total marks, e.g. 100" },
            generalInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionCode: { type: Type.STRING, description: "SECTION A or SECTION B" },
                  sectionTitle: { type: Type.STRING, description: "OBJECTIVE QUESTIONS or THEORY QUESTIONS" },
                  instructions: { type: Type.STRING },
                  totalMarksForSection: { type: Type.INTEGER },
                  questions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        questionNumber: { type: Type.INTEGER },
                        questionText: { type: Type.STRING },
                        options: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Options formatted like ['A) ...', 'B) ...', 'C) ...', 'D) ...'] for MCQs; empty for Theory",
                        },
                        marks: { type: Type.INTEGER },
                        correctAnswer: { type: Type.STRING },
                        markingSchemeOrRubric: { type: Type.STRING },
                      },
                      required: ["questionNumber", "questionText", "marks", "correctAnswer"],
                    },
                  },
                },
                required: ["sectionCode", "sectionTitle", "questions"],
              },
            },
            teacherGradingTips: { type: Type.STRING },
          },
          required: [
            "examTitle",
            "subject",
            "academicLevel",
            "timeAllowed",
            "totalMarks",
            "generalInstructions",
            "sections",
          ],
        },
      },
    });

    const rawText = response.text || "{}";
    const data = JSON.parse(rawText);
    return res.json(data);
  } catch (error: any) {
    console.error("Error generating exams:", error);
    return res.status(500).json({
      error: "Failed to generate exam questions.",
      details: error?.message || String(error),
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
