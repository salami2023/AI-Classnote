import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Packer,
  ImageRun,
} from 'docx';
import { LessonNote, ExamPaper, PrintSettings } from '../types';
import { DEFAULT_CREST_DATA_URL, svgToPngDataUrl } from './schoolLogo';

function base64ToUint8Array(base64String: string): Uint8Array {
  const cleanBase64 = base64String.replace(/^data:image\/\w+;base64,/, '');
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function exportLessonNoteToWord(
  note: LessonNote,
  settings?: PrintSettings
): Promise<void> {
  const schoolName = settings?.schoolName || 'BEACON HILL SCHOOLS';
  const teacherName = settings?.teacherName || '';
  const term = settings?.termOrSemester || '';

  const children: (Paragraph | Table)[] = [];

  // Header banner table or paragraphs
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: schoolName.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          color: '1E3A8A',
        }),
      ],
    })
  );

  if (term || teacherName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: [term, teacherName ? `Teacher: ${teacherName}` : '']
              .filter(Boolean)
              .join('  |  '),
            italics: true,
            size: 20,
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // Metadata Table: Subject, Class, Topic, Duration
  const metaRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Subject: ', bold: true, color: '1E3A8A' }),
                new TextRun({ text: note.subject }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Academic Level: ', bold: true, color: '1E3A8A' }),
                new TextRun({
                  text: `${note.academicLevel.toUpperCase()} (${note.subLevel || 'General'})`,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Topic: ', bold: true, color: '1E3A8A' }),
                new TextRun({ text: note.topic }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Teaching Periods: ', bold: true, color: '1E3A8A' }),
                new TextRun({
                  text: note.periodAllocationSummary || `${note.numberOfPeriods || note.sections.length || 1} Periods (${note.duration || '45 mins'} each)`,
                  bold: true,
                  color: '0369A1',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: metaRows,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'E5E7EB' },
        insideVertical: { style: BorderStyle.NONE },
      },
    })
  );

  children.push(new Paragraph({ spacing: { before: 240, after: 120 } }));

  // Lesson Overview
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
      children: [new TextRun({ text: 'Lesson Overview', bold: true, color: '1E3A8A' })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: note.overview, size: 22 })],
    })
  );

  // Learning Objectives
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: 'Learning Objectives', bold: true, color: '1E3A8A' })],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'By the end of this lesson, learners should be able to:',
          italics: true,
        }),
      ],
      spacing: { after: 100 },
    })
  );

  note.learningObjectives.forEach((obj) => {
    children.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: obj, size: 22 })],
      })
    );
  });

  // Key Vocabulary
  if (note.keyVocabulary && note.keyVocabulary.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 260, after: 100 },
        children: [new TextRun({ text: 'Key Vocabulary & Simple Terms', bold: true, color: '1E3A8A' })],
      })
    );

    note.keyVocabulary.forEach((vocab) => {
      const vocabRuns: TextRun[] = [
        new TextRun({ text: `${vocab.term}: `, bold: true, color: '0F766E' }),
        new TextRun({ text: vocab.simpleDefinition }),
      ];
      if (vocab.exampleSentence) {
        vocabRuns.push(
          new TextRun({
            text: ` (e.g. "${vocab.exampleSentence}")`,
            italics: true,
            color: '6B7280',
          })
        );
      }

      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 80 },
          children: vocabRuns,
        })
      );
    });
  }

  // Core Lesson Notes Sections
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 120 },
      children: [
        new TextRun({
          text: `Structured Class Notes (${note.numberOfPeriods || note.sections.length || 1} Teaching Periods)`,
          bold: true,
          color: '1E3A8A',
        }),
      ],
    })
  );

  note.sections.forEach((section, sIdx) => {
    const periodNum = section.periodNumber || (sIdx + 1);
    const pTitle = section.periodTitle || `Period ${periodNum}: ${section.title}`;

    // Period Header
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 60 },
        children: [
          new TextRun({
            text: `[PERIOD ${periodNum}] `,
            bold: true,
            color: '1D4ED8', // blue-700
          }),
          new TextRun({
            text: pTitle.startsWith(`Period ${periodNum}`) ? pTitle : `${pTitle}`,
            bold: true,
            color: '1F2937',
          }),
        ],
      })
    );

    // Sub-topics if available
    if (section.subTopics && section.subTopics.length > 0) {
      children.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: 'Focus Areas: ',
              bold: true,
              size: 20,
              color: '4B5563',
            }),
            new TextRun({
              text: section.subTopics.join(' • '),
              size: 20,
              italics: true,
              color: '4B5563',
            }),
          ],
        })
      );
    }

    section.explanationBulletPoints.forEach((point) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text: point, size: 22 })],
        })
      );
    });

    if (section.everydayAnalogyOrExample) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: '💡 Everyday Analogy: ', bold: true, color: 'D97706' }),
            new TextRun({ text: section.everydayAnalogyOrExample, italics: true }),
          ],
        })
      );
    }

    if (section.teacherTipOrBoardPrompt) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 140 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: '📋 Board Prompt: ', bold: true, color: '1E40AF' }),
            new TextRun({ text: section.teacherTipOrBoardPrompt, italics: true }),
          ],
        })
      );
    }
  });

  // Visual Lesson Aid Diagrams (Embedded PNG format)
  if (note.diagrams && note.diagrams.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
        children: [
          new TextRun({
            text: 'Visual Lesson Aids & Explanatory Diagrams (PNG)',
            bold: true,
            color: '1E3A8A',
          }),
        ],
      })
    );

    note.diagrams.forEach((diag, dIdx) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 180, after: 80 },
          children: [
            new TextRun({
              text: `Figure ${dIdx + 1}: ${diag.title}`,
              bold: true,
              color: '1F2937',
            }),
            new TextRun({
              text: diag.diagramType ? `  [${diag.diagramType}]` : '',
              italics: true,
              color: '4B5563',
              size: 20,
            }),
          ],
        })
      );

      // Embed the standalone PNG image
      if (diag.pngBase64) {
        try {
          const imageBytes = base64ToUint8Array(diag.pngBase64);
          children.push(
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 120, after: 100 },
              children: [
                new ImageRun({
                  type: 'png',
                  data: imageBytes,
                  transformation: {
                    width: 540,
                    height: 320,
                  },
                }),
              ],
            })
          );
        } catch (imgErr) {
          console.warn('Failed to embed PNG image in DOCX:', imgErr);
        }
      }

      if (diag.caption) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: `Figure Note: ${diag.caption}`,
                italics: true,
                size: 20,
                color: '4B5563',
              }),
            ],
          })
        );
      }

      if (diag.keyLabels && diag.keyLabels.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({
                text: 'Key Diagram Labels: ',
                bold: true,
                size: 20,
                color: '0369A1',
              }),
              new TextRun({
                text: diag.keyLabels.join('  •  '),
                size: 20,
              }),
            ],
          })
        );
      }

      if (diag.teachingPrompt) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 140 },
            indent: { left: 400 },
            children: [
              new TextRun({
                text: '📋 Classroom / Board Prompt: ',
                bold: true,
                size: 20,
                color: 'D97706',
              }),
              new TextRun({
                text: diag.teachingPrompt,
                italics: true,
                size: 20,
              }),
            ],
          })
        );
      }
    });
  }

  // Class Activities
  if (note.classActivities && note.classActivities.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [new TextRun({ text: 'Interactive Class Activities', bold: true, color: '1E3A8A' })],
      })
    );

    note.classActivities.forEach((act, idx) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({
              text: `Activity ${idx + 1}: ${act.title} `,
              bold: true,
              size: 24,
              color: '0369A1',
            }),
            new TextRun({
              text: `(${act.activityType}${act.durationMinutes ? ` - ${act.durationMinutes}` : ''})`,
              italics: true,
              color: '4B5563',
            }),
          ],
        })
      );

      if (act.materialsNeeded && act.materialsNeeded.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new TextRun({ text: 'Materials Needed: ', bold: true }),
              new TextRun({ text: act.materialsNeeded.join(', ') }),
            ],
          })
        );
      }

      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Instructions:', bold: true })],
        })
      );

      act.stepByStepInstructions.forEach((step) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [new TextRun({ text: step })],
          })
        );
      });

      if (act.expectedOutcome) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 140 },
            indent: { left: 400 },
            children: [
              new TextRun({ text: 'Expected Learning Outcome: ', bold: true, color: '059669' }),
              new TextRun({ text: act.expectedOutcome, italics: true }),
            ],
          })
        );
      }
    });
  }

  // Homework
  if (note.homework) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [new TextRun({ text: 'Homework & Take-Home Assignment', bold: true, color: '1E3A8A' })],
      }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: note.homework.title, bold: true, size: 24 }),
        ],
      }),
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({ text: note.homework.instructions, italics: true }),
        ],
      })
    );

    note.homework.questionsOrTasks.forEach((task, idx) => {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `Task ${idx + 1}: `, bold: true }),
            new TextRun({ text: task }),
          ],
        })
      );
    });

    if (note.homework.guidanceForParentsOrSelfStudy) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 60 },
          children: [
            new TextRun({ text: 'Guidance for Parents / Self-Study: ', bold: true, color: '4B5563' }),
            new TextRun({ text: note.homework.guidanceForParentsOrSelfStudy, italics: true }),
          ],
        })
      );
    }

    if (note.homework.submissionDeadlineNote) {
      children.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({ text: 'Submission Note: ', bold: true, color: 'DC2626' }),
            new TextRun({ text: note.homework.submissionDeadlineNote }),
          ],
        })
      );
    }
  }

  // Quick Summary Checklist
  if (note.quickSummaryChecklist && note.quickSummaryChecklist.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        children: [new TextRun({ text: 'Key Takeaways & Summary Checklist', bold: true, color: '1E3A8A' })],
      })
    );

    note.quickSummaryChecklist.forEach((item) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 60 },
          children: [new TextRun({ text: `[  ] ${item}`, size: 22 })],
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanFilename = `${note.subject}_${note.topic}_ClassNotes.docx`.replace(
    /[^a-zA-Z0-9_-]/g,
    '_'
  );
  triggerBlobDownload(blob, cleanFilename);
}

export async function exportExamToWord(
  exam: ExamPaper,
  includeAnswers: boolean = false,
  settings?: PrintSettings
): Promise<void> {
  const schoolName = settings?.schoolName || exam.schoolName || 'BEACON HILL SCHOOLS';
  const termOrSession = `${settings?.termOrSemester || exam.termOrSemester || 'First Term Examination'} (${settings?.academicYear || exam.academicSession || '2025/2026 Academic Session'})`;
  const logoRaw = settings?.schoolLogoUrl || exam.schoolLogoUrl || DEFAULT_CREST_DATA_URL;

  const children: (Paragraph | Table)[] = [];

  // Attempt to load and embed School Crest Logo
  if (logoRaw) {
    try {
      let pngDataUrl = logoRaw;
      if (logoRaw.startsWith('data:image/svg')) {
        pngDataUrl = await svgToPngDataUrl(logoRaw, 160, 160);
      }
      const logoBytes = base64ToUint8Array(pngDataUrl);
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new ImageRun({
              data: logoBytes,
              transformation: {
                width: 50,
                height: 50,
              },
              type: 'png',
            } as any),
          ],
        })
      );
    } catch (err) {
      console.warn('Could not process school logo for docx', err);
    }
  }

  // Header Title & Academic Details
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: schoolName.toUpperCase(),
          bold: true,
          size: 28, // 14pt bold
          color: '1E3A8A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: termOrSession.toUpperCase(),
          bold: true,
          size: 22, // 11pt bold
          color: '374151',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: exam.examTitle,
          bold: true,
          size: 24, // 12pt bold
          color: '111827',
        }),
        includeAnswers
          ? new TextRun({
              text: '  [TEACHER MASTER ANSWER KEY & MARKING GUIDE]',
              bold: true,
              color: 'DC2626',
              size: 22,
            })
          : new TextRun({ text: '' }),
      ],
    })
  );

  // Student details header table (Name, Class, Subject, Time Allowed)
  const studentInfoRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Student Name: __________________________', size: 22 }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Class: ${exam.academicLevel.toUpperCase()} (${exam.subLevel || 'Standard'})`,
                  size: 22,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `Subject: ${exam.subject}`, bold: true, size: 22 }),
              ],
            }),
          ],
        }),
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Time Allowed: ${exam.timeAllowed}  |  Total Marks: ${exam.totalMarks}`,
                  bold: true,
                  size: 22,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ];

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: studentInfoRows,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: 'F3F4F6' },
        insideVertical: { style: BorderStyle.NONE },
      },
    })
  );

  // Instructions
  if (exam.generalInstructions && exam.generalInstructions.length > 0) {
    children.push(
      new Paragraph({
        spacing: { before: 140, after: 40 },
        children: [new TextRun({ text: 'General Instructions:', bold: true, size: 22 })],
      })
    );

    exam.generalInstructions.forEach((inst) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [new TextRun({ text: inst, italics: true, size: 22 })],
        })
      );
    });
  }

  children.push(new Paragraph({ spacing: { before: 100, after: 60 } }));

  // Sections (Strictly NO topic headings, font size 11 = 22 half-points)
  exam.sections.forEach((sec) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 60 },
        children: [
          new TextRun({
            text: `${sec.sectionCode}: ${sec.sectionTitle}`,
            bold: true,
            color: '1E3A8A',
            size: 24,
          }),
          sec.totalMarksForSection
            ? new TextRun({
                text: `  [${sec.totalMarksForSection} Marks]`,
                bold: true,
                color: '4B5563',
                size: 22,
              })
            : new TextRun({ text: '' }),
        ],
      })
    );

    if (sec.instructions) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: sec.instructions, italics: true, size: 22 })],
        })
      );
    }

    sec.questions.forEach((q) => {
      children.push(
        new Paragraph({
          spacing: { before: 70, after: 30 },
          children: [
            new TextRun({
              text: `${q.questionNumber}. ${q.questionText} `,
              bold: true,
              size: 22, // Exact font size 11
            }),
            new TextRun({
              text: `(${q.marks} ${q.marks === 1 ? 'mark' : 'marks'})`,
              italics: true,
              color: '4B5563',
              size: 22, // Exact font size 11
            }),
          ],
        })
      );

      // Options for MCQ in Font Size 11
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          children.push(
            new Paragraph({
              indent: { left: 350 },
              spacing: { after: 20 },
              children: [new TextRun({ text: opt, size: 22 })], // Exact font size 11
            })
          );
        });
      }

      // If teacher answer key mode is on
      if (includeAnswers) {
        children.push(
          new Paragraph({
            indent: { left: 350 },
            spacing: { before: 30, after: 60 },
            children: [
              new TextRun({ text: 'Answer: ', bold: true, color: '059669', size: 22 }),
              new TextRun({ text: q.correctAnswer, bold: true, size: 22 }),
              q.markingSchemeOrRubric
                ? new TextRun({
                    text: `  |  Rubric: ${q.markingSchemeOrRubric}`,
                    italics: true,
                    color: '6B7280',
                    size: 20,
                  })
                : new TextRun({ text: '' }),
            ],
          })
        );
      } else {
        // Space for writing answer if not MCQ
        if (!q.options || q.options.length === 0) {
          children.push(
            new Paragraph({
              spacing: { after: 120 },
              children: [
                new TextRun({
                  text: '____________________________________________________________________________',
                  color: 'D1D5DB',
                  size: 22,
                }),
              ],
            })
          );
        }
      }
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in = ~12.7mm
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const suffix = includeAnswers ? 'Teacher_Answer_Key' : 'Student_Exam_Paper';
  const cleanFilename = `${exam.subject}_${suffix}.docx`.replace(
    /[^a-zA-Z0-9_-]/g,
    '_'
  );
  triggerBlobDownload(blob, cleanFilename);
}
