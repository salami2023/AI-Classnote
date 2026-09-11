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
} from 'docx';
import { LessonNote, ExamPaper, PrintSettings } from '../types';

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
                new TextRun({ text: 'Duration & Periods: ', bold: true, color: '1E3A8A' }),
                new TextRun({
                  text: `${note.duration || '45 mins'} (${note.periodsCount || note.sections.length} ${
                    (note.periodsCount || note.sections.length) === 1 ? 'Period' : 'Periods'
                  })`,
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
          text: `Structured Class Notes (${note.periodsCount || note.sections.length} ${
            (note.periodsCount || note.sections.length) === 1 ? 'Period' : 'Periods'
          })`,
          bold: true,
          color: '1E3A8A',
        }),
      ],
    })
  );

  note.sections.forEach((section, idx) => {
    const periodHeader =
      section.periodTitle || `Period ${section.period || idx + 1}: ${section.title}`;
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 80 },
        children: [new TextRun({ text: periodHeader, bold: true, color: '1E40AF' })],
      })
    );

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
          spacing: { before: 80, after: 100 },
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
          spacing: { before: 60, after: 120 },
          indent: { left: 400 },
          children: [
            new TextRun({ text: '📋 Board Prompt: ', bold: true, color: '2563EB' }),
            new TextRun({ text: section.teacherTipOrBoardPrompt, italics: true }),
          ],
        })
      );
    }
  });

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
  const schoolName = settings?.schoolName || 'BEACON HILL SCHOOLS';
  const term = settings?.termOrSemester || '';

  const children: (Paragraph | Table)[] = [];

  // Header Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: schoolName.toUpperCase(),
          bold: true,
          size: 32,
          color: '1E3A8A',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 160 },
      children: [
        new TextRun({
          text: exam.examTitle,
          bold: true,
          size: 26,
          color: '1F2937',
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

  // Student details header table (Name, Class, Date, Score)
  const studentInfoRows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: 'Student Name: __________________________' }),
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
                  text: `Class: ${exam.academicLevel.toUpperCase()} (${exam.subLevel || ''})`,
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
                new TextRun({ text: `Subject: ${exam.subject}` }),
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
        spacing: { before: 200, after: 60 },
        children: [new TextRun({ text: 'General Instructions:', bold: true })],
      })
    );

    exam.generalInstructions.forEach((inst) => {
      children.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [new TextRun({ text: inst, italics: true, size: 20 })],
        })
      );
    });
  }

  children.push(new Paragraph({ spacing: { before: 140, after: 100 } }));

  // Sections
  exam.sections.forEach((sec) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 80 },
        children: [
          new TextRun({
            text: `${sec.sectionCode}: ${sec.sectionTitle}`,
            bold: true,
            color: '1E3A8A',
            size: 26,
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
          spacing: { after: 120 },
          children: [new TextRun({ text: sec.instructions, italics: true, size: 20 })],
        })
      );
    }

    sec.questions.forEach((q) => {
      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({
              text: `${q.questionNumber}. ${q.questionText} `,
              bold: true,
            }),
            new TextRun({
              text: `(${q.marks} ${q.marks === 1 ? 'mark' : 'marks'})`,
              italics: true,
              color: '4B5563',
            }),
          ],
        })
      );

      // Options for MCQ
      if (q.options && q.options.length > 0) {
        q.options.forEach((opt) => {
          children.push(
            new Paragraph({
              indent: { left: 400 },
              spacing: { after: 30 },
              children: [new TextRun({ text: opt })],
            })
          );
        });
      }

      // If teacher answer key mode is on
      if (includeAnswers) {
        children.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({ text: 'Answer: ', bold: true, color: '059669' }),
              new TextRun({ text: q.correctAnswer, bold: true }),
              q.markingSchemeOrRubric
                ? new TextRun({
                    text: `  |  Rubric: ${q.markingSchemeOrRubric}`,
                    italics: true,
                    color: '6B7280',
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
              spacing: { after: 160 },
              children: [
                new TextRun({
                  text: '____________________________________________________________________________',
                  color: 'D1D5DB',
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
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const suffix = includeAnswers ? 'Teacher_Answer_Key' : 'Student_Exam_Paper';
  const cleanFilename = `${exam.subject}_${exam.topic}_${suffix}.docx`.replace(
    /[^a-zA-Z0-9_-]/g,
    '_'
  );
  triggerBlobDownload(blob, cleanFilename);
}
