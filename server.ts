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
      subLevel,      // e.g. 'Reception 1', 'Basic 4', 'JSS 2', etc.
      periods = 2,
      duration = "45 mins",
      tone = "engaging",
      customInstructions = "",
    } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: "Subject and Topic are required." });
    }

    const periodsCount = Math.max(1, Math.min(8, parseInt(String(periods), 10) || 1));

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
Allocated Periods: ${periodsCount} teaching period(s) (${duration} per period)
Preferred Teaching Style: ${tone}
Teacher's Source Content / Curriculum Notes:
"""
${content || "No raw notes provided. Generate a complete, high-quality, syllabus-aligned lesson on this topic."}
"""
Additional Teacher Instructions: ${customInstructions || "None"}

CRITICAL REQUIREMENTS:
1. MANDATORY DIVISION INTO EXACTLY ${periodsCount} TEACHING PERIOD(S):
   The teacher has specified that this topic will be taught across ${periodsCount} period(s).
   You MUST divide the structured class notes (the 'sections' array) into EXACTLY ${periodsCount} sections, where each section corresponds strictly to one teaching period:
   - Section 1 must cover Period 1: foundational concepts, definitions, introductory principles.
   ${periodsCount >= 2 ? `- Section 2 must cover Period 2: deeper breakdown, types, classifications, or practical rules.` : ''}
   ${periodsCount >= 3 ? `- Section 3 (and subsequent sections): must cover subsequent periods (Period 3 onward): real-life applications, problem solving, analysis, or review.` : ''}
   Each section in 'sections' MUST have:
   - period: ${periodsCount === 1 ? '1' : 'sequential integer (1, 2, ... up to ' + periodsCount + ')'}
   - periodTitle: e.g. "Period 1: [Subtopic Title]", "Period 2: [Subtopic Title]"
   - title: Clean subtopic or focus title for that period
   - explanationBulletPoints: Clear, easy-to-read bullet points strictly intended for teaching and board copying during that specific period
   - everydayAnalogyOrExample: A relatable real-life analogy or concrete example for this period
   - teacherTipOrBoardPrompt: A practical board illustration or teaching tip for this period
2. ALWAYS present notes in simple and basic terms so students easily understand without feeling overwhelmed.
3. ALWAYS use BULLET POINTS for all explanatory sections to ensure high readability, scannability, and ease of board copying.
4. INCLUDE hands-on, realistic CLASS ACTIVITIES with step-by-step instructions.
5. INCLUDE structured HOMEWORK that reinforces the lesson.
6. Provide learning objectives, key vocabulary with simple definitions, bite-sized lesson sections, and a student summary checklist.

${levelInstruction}

Generate a valid JSON object matching the requested schema strictly.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert instructional designer and teacher assistant who produces clear, pedagogical, structured class notes for educators. Always write in simple, direct language formatted in bullet points, and strictly divide the class notes into the exact number of teaching periods requested.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            academicLevel: { type: Type.STRING },
            subLevel: { type: Type.STRING },
            duration: { type: Type.STRING },
            periodsCount: { type: Type.INTEGER, description: "Total number of periods for this lesson topic" },
            targetAgeGroup: { type: Type.STRING },
            overview: { type: Type.STRING, description: "A simple 2-3 sentence overview of what the lesson teaches." },
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
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.INTEGER, description: "Period number (1, 2, ...)" },
                  periodTitle: { type: Type.STRING, description: "Title with period indicator, e.g. 'Period 1: Introduction and Definition'" },
                  title: { type: Type.STRING, description: "Subtopic or lesson focus for this period" },
                  explanationBulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Key concepts explained strictly in clean, easy-to-read bullet points for this period.",
                  },
                  everydayAnalogyOrExample: { type: Type.STRING },
                  teacherTipOrBoardPrompt: { type: Type.STRING },
                },
                required: ["title", "explanationBulletPoints"],
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

    // Ensure periodsCount and section period assignments are consistent
    data.periodsCount = data.periodsCount || periodsCount;
    if (Array.isArray(data.sections)) {
      data.sections = data.sections.map((sec: any, idx: number) => {
        const periodNum = sec.period || idx + 1;
        return {
          ...sec,
          period: periodNum,
          periodTitle: sec.periodTitle || `Period ${periodNum}: ${sec.title || 'Lesson Notes'}`,
        };
      });
    }

    return res.json(data);
  } catch (error: any) {
    console.error("Error generating notes:", error);
    return res.status(500).json({
      error: "Failed to generate class notes.",
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
      mcqCount = 5,
      shortAnswerCount = 3,
      essayOrPracticalCount = 2,
      difficulty = "standard", // 'easy' | 'standard' | 'challenging'
      customInstructions = "",
    } = req.body;

    if (!subject || !topic) {
      return res.status(400).json({ error: "Subject and Topic are required." });
    }

    const ai = getAI();

    let levelPrompt = "";
    if (academicLevel === "nursery") {
      levelPrompt = `
ACADEMIC LEVEL: NURSERY (Ages 3-5).
- Questions must be oral, visual, simple identification, circling/matching, or basic true/false.
- MCQ questions should have simple 2-3 visual/descriptive options.
- No heavy reading required; suitable for teacher to read out loud to pupils.
`;
    } else if (academicLevel === "primary") {
      levelPrompt = `
ACADEMIC LEVEL: PRIMARY (Ages 6-11).
- Clear, simple question stems without trick wording.
- MCQ questions with 4 distinct options (A, B, C, D).
- Short answer questions with clear blanks or 1-2 sentence answers.
- Simple application or drawing/labeling problems.
`;
    } else {
      levelPrompt = `
ACADEMIC LEVEL: SECONDARY (Ages 12-18).
- Well-structured examination format with clear marks allocation.
- Section A: Multiple Choice Questions test foundational knowledge and recall.
- Section B: Short answer questions test conceptual clarity and explanation.
- Section C: Structured / Essay / Problem-solving questions test analytical reasoning and application.
- Include comprehensive answer keys and marking guidelines for teachers.
`;
    }

    const prompt = `You are a professional school examination officer and teacher.
Generate a high quality, print-ready EXAM / ASSESSMENT PAPER based on:

Subject: ${subject}
Topic: ${topic}
Class / Academic Level: ${academicLevel.toUpperCase()} (${subLevel || "Standard"})
Difficulty: ${difficulty}
Requested Question Distribution:
- Multiple Choice Questions (MCQs): ${mcqCount}
- Short Answer / Fill in the blanks: ${shortAnswerCount}
- Essay / Practical / Problem Solving: ${essayOrPracticalCount}

Curriculum Content / Notes:
"""
${content || "Generate relevant questions based on standard curriculum for this topic and class level."}
"""
Teacher Notes/Instructions: ${customInstructions || "None"}

${levelPrompt}

Generate a complete assessment with full questions, mark allocations, student instructions, and a complete Answer Key & Marking Guide.`;

    const response = await generateWithRetry(ai, {
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert educational assessment creator. You build clean, rigorous, and level-appropriate school examinations with accurate answer keys and clear marking guides.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examTitle: { type: Type.STRING },
            subject: { type: Type.STRING },
            topic: { type: Type.STRING },
            academicLevel: { type: Type.STRING },
            subLevel: { type: Type.STRING },
            timeAllowed: { type: Type.STRING },
            totalMarks: { type: Type.INTEGER },
            generalInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionCode: { type: Type.STRING, description: "e.g. Section A, Section B, Section C" },
                  sectionTitle: { type: Type.STRING, description: "e.g. Multiple Choice Questions, Short Answer, Essay/Structured" },
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
                          description: "Options formatted like ['A) Option 1', 'B) Option 2', ...], empty for non-MCQ",
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
            "topic",
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
