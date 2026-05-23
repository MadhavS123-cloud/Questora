import { create } from 'zustand';
import {
  apiGetAssignments,
  apiGetAssignment,
  apiCreateAssignment,
  apiUploadAndCreate,
  apiUpdateQuestion,
  apiDeleteQuestion,
  apiRegenerateQuestion,
  apiVerifyAssignment,
  CreateAssignmentPayload,
} from '../lib/api';

export interface Question {
  id: string;
  index: number;
  questionText: string;
  options?: string[];
  questionType: 'MCQ' | 'ShortAnswer' | 'LongForm' | 'FillInBlank';
  marks: number;
  confidenceScore: number;
  sourceCitation?: {
    pageNumber: number;
    passageSnippet: string;
  };
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  updatedAt: string;
  progressPercent: number;
  sections: Section[];
  sourceName?: string;
  sourceTextExcerpt?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map Mongo _id → id so the rest of the UI never needs to know about _id */
function normalizeAssignment(raw: any): Assignment {
  return {
    id: raw._id ?? raw.id,
    title: raw.title,
    subject: raw.subject,
    grade: raw.grade,
    totalMarks: raw.totalMarks,
    status: raw.status,
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    progressPercent: raw.progressPercent ?? 0,
    sections: (raw.sections ?? []).map((s: any) => ({
      id: s.id ?? s._id,
      title: s.title,
      questions: (s.questions ?? []).map((q: any) => ({
        id: q.id ?? q._id,
        index: q.index,
        questionText: q.questionText,
        options: q.options,
        questionType: q.questionType,
        marks: q.marks,
        confidenceScore: q.confidenceScore,
        sourceCitation: q.sourceCitation,
      })),
    })),
    sourceName: raw.sourceName,
    sourceTextExcerpt: raw.sourceTextExcerpt,
  };
}

// ─── Seed data (shown while the backend loads / offline) ─────────────────────

const seedAssignments: Assignment[] = [
  {
    id: '1',
    title: '10th Grade Kinematics Midterm',
    subject: 'Physics',
    grade: 'Grade 10',
    totalMarks: 50,
    status: 'completed',
    updatedAt: '2 mins ago',
    progressPercent: 100,
    sourceName: 'Kinematics_Lecture_Notes.pdf',
    sourceTextExcerpt:
      'A vehicle accelerates uniformly from rest to a speed of 20 m/s over a distance of 100 meters. Kinematics describes the motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion.',
    sections: [
      {
        id: 'sec-a',
        title: 'SECTION A: MULTIPLE CHOICE QUESTIONS (10 Marks)',
        questions: [
          {
            id: 'q-1',
            index: 1,
            questionType: 'MCQ',
            questionText:
              'A vehicle accelerates uniformly from rest to 20 m/s over 100 m. What is its acceleration?',
            options: ['1.0 m/s²', '2.0 m/s²', '3.0 m/s²', '4.0 m/s²'],
            marks: 2,
            confidenceScore: 98,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'A vehicle accelerates uniformly from rest to a speed of 20 m/s over a distance of 100 meters.',
            },
          },
          {
            id: 'q-2',
            index: 2,
            questionType: 'MCQ',
            questionText: 'Which of the following is a scalar quantity?',
            options: ['Velocity', 'Displacement', 'Speed', 'Acceleration'],
            marks: 2,
            confidenceScore: 95,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Velocity is a vector quantity expressing speed and direction. Speed is purely scalar.',
            },
          },
          {
            id: 'q-3',
            index: 3,
            questionType: 'MCQ',
            questionText: 'What branch of mechanics describes motion without considering forces?',
            options: ['Dynamics', 'Kinematics', 'Statics', 'Thermodynamics'],
            marks: 2,
            confidenceScore: 99,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Kinematics describes the motion of points, bodies, and systems of bodies without consideration of the forces.',
            },
          },
        ],
      },
      {
        id: 'sec-b',
        title: 'SECTION B: SHORT ANSWER QUESTIONS (15 Marks)',
        questions: [
          {
            id: 'q-6',
            index: 6,
            questionType: 'ShortAnswer',
            questionText: 'Distinguish between distance and displacement using a practical classroom scenario.',
            marks: 5,
            confidenceScore: 92,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Velocity is a vector quantity expressing speed and direction. Speed is purely scalar.',
            },
          },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'AP US History Unit 3 Assessment',
    subject: 'History',
    grade: 'Grade 11',
    totalMarks: 30,
    status: 'draft',
    updatedAt: '1 hour ago',
    progressPercent: 0,
    sourceName: 'Revolutionary_War_Syllabus.docx',
    sourceTextExcerpt: 'The American Revolutionary War was fought from 1775 to 1783. Key causes included colonial taxation without parliamentary representation.',
    sections: [
      {
        id: 'sec-a',
        title: 'Section A: Essay Prompt',
        questions: [
          {
            id: 'q-20',
            index: 1,
            questionType: 'LongForm',
            questionText: 'Analyze the impact of colonial taxation policies in unifying colonial resistance against Great Britain.',
            marks: 30,
            confidenceScore: 94,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Key causes included colonial taxation without parliamentary representation, the Stamp Act, and the Boston Tea Party.',
            },
          },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Calculus Limits & Continuity Quiz',
    subject: 'Math',
    grade: 'Grade 12',
    totalMarks: 20,
    status: 'failed',
    updatedAt: '3 hours ago',
    progressPercent: 0,
    sourceName: 'Limits_Intro.txt',
    sourceTextExcerpt: 'Limits define the value that a function approaches as the input approaches some value.',
    sections: [],
  },
];

// ─── Store Interface ───────────────────────────────────────────────────────────

interface AssignmentStore {
  assignments: Assignment[];
  activeAssignment: Assignment | null;
  activeSourceHighlight: string | null;
  generationStep: number;
  generationStatus: 'idle' | 'ingesting' | 'parsing' | 'synthesizing' | 'guardrails' | 'completed' | 'failed';
  generationLogs: string[];
  isBackendOnline: boolean;

  // Actions
  fetchAssignments: () => Promise<void>;
  fetchAssignment: (id: string) => Promise<void>;
  setAssignments: (assignments: Assignment[]) => void;
  setActiveAssignment: (assignment: Assignment | null) => void;
  setActiveSourceHighlight: (highlight: string | null) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status'], progress: number) => void;
  applyServerAssignment: (raw: any) => void;

  // Real API actions (fall back to local simulation if backend offline)
  createAssignmentFromPayload: (payload: CreateAssignmentPayload) => Promise<string>;
  createAssignmentFromFile: (
    file: File,
    meta: { title: string; subject: string; grade: string; totalMarks?: number }
  ) => Promise<string>;

  updateQuestion: (assignmentId: string, sectionId: string, questionId: string, updatedFields: Partial<Question>) => void;
  deleteQuestion: (assignmentId: string, sectionId: string, questionId: string) => void;
  regenerateQuestion: (assignmentId: string, sectionId: string, questionId: string, type: string) => Promise<void>;
  verifyAssignment: (id: string) => void;

  // Generation progress (driven by WebSocket)
  setGenerationProgress: (status: AssignmentStore['generationStatus'], step: number, logs: string[]) => void;

  // Local simulation fallback
  simulateAICompilation: (id: string, onDone?: () => void) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: seedAssignments,
  activeAssignment: null,
  activeSourceHighlight: null,
  generationStep: 0,
  generationStatus: 'idle',
  generationLogs: [],
  isBackendOnline: false,

  // ── Fetch list from backend ──────────────────────────────────────────────
  fetchAssignments: async () => {
    try {
      const raw = await apiGetAssignments();
      const normalized = raw.map(normalizeAssignment);
      set({ assignments: normalized, isBackendOnline: true });
    } catch (err) {
      console.warn('[API] fetchAssignments failed — using seed data:', err);
      set({ isBackendOnline: false });
    }
  },

  // ── Fetch single ────────────────────────────────────────────────────────
  fetchAssignment: async (id: string) => {
    try {
      const raw = await apiGetAssignment(id);
      const normalized = normalizeAssignment(raw);
      set((state) => ({
        activeAssignment: normalized,
        assignments: state.assignments.some((a) => a.id === normalized.id)
          ? state.assignments.map((a) => (a.id === normalized.id ? normalized : a))
          : [normalized, ...state.assignments],
        isBackendOnline: true,
      }));
    } catch (err) {
      console.warn('[API] fetchAssignment failed:', err);
    }
  },

  setAssignments: (assignments) => set({ assignments }),
  setActiveAssignment: (assignment) => set({ activeAssignment: assignment }),
  setActiveSourceHighlight: (highlight) => set({ activeSourceHighlight: highlight }),

  addAssignment: (assignment) =>
    set((state) => ({ assignments: [assignment, ...state.assignments] })),

  updateAssignmentStatus: (id, status, progress) =>
    set((state) => {
      const updated = state.assignments.map((item) =>
        item.id === id ? { ...item, status, progressPercent: progress } : item
      );
      const activeUpdate =
        state.activeAssignment?.id === id
          ? { ...state.activeAssignment, status, progressPercent: progress }
          : state.activeAssignment;
      return { assignments: updated, activeAssignment: activeUpdate };
    }),

  applyServerAssignment: (raw) => {
    const normalized = normalizeAssignment(raw);
    set((state) => ({
      assignments: state.assignments.some((a) => a.id === normalized.id)
        ? state.assignments.map((a) => (a.id === normalized.id ? normalized : a))
        : [normalized, ...state.assignments],
      activeAssignment:
        state.activeAssignment?.id === normalized.id ? normalized : state.activeAssignment,
    }));
  },

  // ── Create from JSON payload ─────────────────────────────────────────────
  createAssignmentFromPayload: async (payload) => {
    try {
      const { assignmentId } = await apiCreateAssignment(payload);
      const draft: Assignment = {
        id: assignmentId,
        title: payload.title,
        subject: payload.subject,
        grade: payload.grade,
        totalMarks: payload.totalMarks ?? 50,
        status: 'processing',
        updatedAt: new Date().toISOString(),
        progressPercent: 10,
        sections: [],
        sourceName: payload.sourceName,
        sourceTextExcerpt: payload.sourceExcerpt,
      };
      get().addAssignment(draft);
      set({ isBackendOnline: true });
      return assignmentId;
    } catch (err) {
      console.warn('[API] createAssignment failed — running local simulation');
      const localId = `local-${Date.now()}`;
      const draft: Assignment = {
        id: localId,
        title: payload.title,
        subject: payload.subject,
        grade: payload.grade,
        totalMarks: payload.totalMarks ?? 50,
        status: 'processing',
        updatedAt: new Date().toISOString(),
        progressPercent: 10,
        sections: [],
        sourceName: payload.sourceName,
      };
      get().addAssignment(draft);
      get().simulateAICompilation(localId);
      return localId;
    }
  },

  // ── Create from uploaded file ─────────────────────────────────────────────
  createAssignmentFromFile: async (file, meta) => {
    try {
      const { assignmentId } = await apiUploadAndCreate(file, meta);
      const draft: Assignment = {
        id: assignmentId,
        title: meta.title,
        subject: meta.subject,
        grade: meta.grade,
        totalMarks: meta.totalMarks ?? 50,
        status: 'processing',
        updatedAt: new Date().toISOString(),
        progressPercent: 10,
        sections: [],
        sourceName: file.name,
      };
      get().addAssignment(draft);
      set({ isBackendOnline: true });
      return assignmentId;
    } catch (err) {
      console.warn('[API] uploadAndCreate failed — running local simulation');
      const localId = `local-${Date.now()}`;
      const draft: Assignment = {
        id: localId,
        title: meta.title,
        subject: meta.subject,
        grade: meta.grade,
        totalMarks: meta.totalMarks ?? 50,
        status: 'processing',
        updatedAt: new Date().toISOString(),
        progressPercent: 10,
        sections: [],
        sourceName: file.name,
      };
      get().addAssignment(draft);
      get().simulateAICompilation(localId);
      return localId;
    }
  },

  // ── Mutation: update question text ──────────────────────────────────────
  updateQuestion: (assignmentId, sectionId, questionId, updatedFields) => {
    // Optimistic update
    set((state) => {
      const updatedAssignments = state.assignments.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment;
        const updatedSections = assignment.sections.map((section) => {
          if (section.id !== sectionId) return section;
          const updatedQuestions = section.questions.map((q) =>
            q.id === questionId ? { ...q, ...updatedFields } : q
          );
          return { ...section, questions: updatedQuestions };
        });
        return { ...assignment, sections: updatedSections };
      });
      const activeUpdate =
        state.activeAssignment?.id === assignmentId
          ? updatedAssignments.find((a) => a.id === assignmentId) || null
          : state.activeAssignment;
      return { assignments: updatedAssignments, activeAssignment: activeUpdate };
    });

    // Persist to backend (fire-and-forget)
    if (updatedFields.questionText) {
      apiUpdateQuestion(assignmentId, sectionId, questionId, updatedFields.questionText).catch(
        (e) => console.warn('[API] updateQuestion failed:', e)
      );
    }
  },

  // ── Mutation: delete question ─────────────────────────────────────────────
  deleteQuestion: (assignmentId, sectionId, questionId) => {
    // Optimistic update
    set((state) => {
      const updatedAssignments = state.assignments.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment;
        let marksFreed = 0;
        const updatedSections = assignment.sections.map((section) => {
          if (section.id !== sectionId) return section;
          const targetQ = section.questions.find((q) => q.id === questionId);
          if (targetQ) marksFreed = targetQ.marks;
          return { ...section, questions: section.questions.filter((q) => q.id !== questionId) };
        });
        return { ...assignment, sections: updatedSections, totalMarks: Math.max(0, assignment.totalMarks - marksFreed) };
      });
      const activeUpdate =
        state.activeAssignment?.id === assignmentId
          ? updatedAssignments.find((a) => a.id === assignmentId) || null
          : state.activeAssignment;
      return { assignments: updatedAssignments, activeAssignment: activeUpdate };
    });

    // Persist to backend
    apiDeleteQuestion(assignmentId, sectionId, questionId).catch((e) =>
      console.warn('[API] deleteQuestion failed:', e)
    );
  },

  // ── Mutation: regenerate question ─────────────────────────────────────────
  regenerateQuestion: async (assignmentId, sectionId, questionId, type) => {
    try {
      const raw = await apiRegenerateQuestion(
        assignmentId,
        sectionId,
        questionId,
        type as 'easier' | 'harder' | 'rephrase'
      );
      get().applyServerAssignment(raw);
    } catch {
      // Local fallback
      const modifierText =
        type === 'easier'
          ? 'Simpler formulation. '
          : type === 'harder'
          ? 'Advanced logical integration. '
          : 'Alternative conceptual phrasing. ';

      set((state) => {
        const updatedAssignments = state.assignments.map((assignment) => {
          if (assignment.id !== assignmentId) return assignment;
          const updatedSections = assignment.sections.map((section) => {
            if (section.id !== sectionId) return section;
            const updatedQuestions = section.questions.map((q) => {
              if (q.id !== questionId) return q;
              return {
                ...q,
                questionText: `${modifierText}${q.questionText.replace(
                  /^(Simpler formulation\. |Advanced logical integration\. |Alternative conceptual phrasing\. )/,
                  ''
                )}`,
                confidenceScore: Math.min(100, Math.floor(q.confidenceScore * 0.98 + Math.random() * 3)),
              };
            });
            return { ...section, questions: updatedQuestions };
          });
          return { ...assignment, sections: updatedSections };
        });
        const activeUpdate =
          state.activeAssignment?.id === assignmentId
            ? updatedAssignments.find((a) => a.id === assignmentId) || null
            : state.activeAssignment;
        return { assignments: updatedAssignments, activeAssignment: activeUpdate };
      });
    }
  },

  // ── Mutation: verify ─────────────────────────────────────────────────────
  verifyAssignment: (id) => {
    // Optimistic
    set((state) => ({
      assignments: state.assignments.map((item) =>
        item.id === id ? { ...item, status: 'completed' as const } : item
      ),
      activeAssignment:
        state.activeAssignment?.id === id
          ? { ...state.activeAssignment, status: 'completed' as const }
          : state.activeAssignment,
    }));

    // Persist
    apiVerifyAssignment(id).catch((e) => console.warn('[API] verifyAssignment failed:', e));
  },

  // ── WebSocket progress handler ────────────────────────────────────────────
  setGenerationProgress: (status, step, logs) => {
    set((state) => ({
      generationStatus: status,
      generationStep: step,
      generationLogs: [...state.generationLogs, ...logs],
    }));
  },

  // ── Local simulation fallback (no Redis / no backend) ────────────────────
  simulateAICompilation: (id, onDone) => {
    set({
      generationStatus: 'ingesting',
      generationStep: 1,
      generationLogs: [
        '[Connection Opened] Local simulation mode active.',
        'Phase 1: Ingesting source files...',
      ],
    });

    const pipelineSteps = [
      {
        status: 'parsing' as const,
        logs: [
          'File check completed. Ingested document.',
          'Phase 2: Semantic core analysis in progress...',
          'Identified core concept group.',
        ],
        progress: 25,
      },
      {
        status: 'synthesizing' as const,
        logs: [
          'Semantic model parsed.',
          'Phase 3: Synthesizing question models...',
          'Drafting Section A: Multiple Choice Questions.',
          'Drafting Section B: Short answer questions.',
        ],
        progress: 60,
      },
      {
        status: 'guardrails' as const,
        logs: [
          'Syntax drafts completed.',
          'Phase 4: Running pedagogical safety checks...',
          'Validating marks and distractors alignment.',
        ],
        progress: 85,
      },
      {
        status: 'completed' as const,
        logs: [
          'Pedagogical check passed.',
          'Phase 5: Final typesetting complete.',
          'WebSocket Stream Closed. Assignment compiled successfully.',
        ],
        progress: 100,
      },
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= pipelineSteps.length) {
        clearInterval(interval);

        const target = get().assignments.find((a) => a.id === id);
        if (target) {
          const finalSections: Section[] =
            target.sections.length > 0
              ? target.sections
              : [
                  {
                    id: 'sec-a',
                    title: 'SECTION A: MULTIPLE CHOICE QUESTIONS (10 Marks)',
                    questions: [
                      {
                        id: 'q-sim-1',
                        index: 1,
                        questionType: 'MCQ',
                        questionText:
                          'Under constant acceleration, which vector quantity aligns with direction change?',
                        options: [
                          'Instantaneous Speed',
                          'Instantaneous Velocity',
                          'Average Mass',
                          'Rotational Inertia',
                        ],
                        marks: 5,
                        confidenceScore: 96,
                        sourceCitation: {
                          pageNumber: 1,
                          passageSnippet: 'Velocity is a vector quantity expressing speed and direction.',
                        },
                      },
                    ],
                  },
                  {
                    id: 'sec-b',
                    title: 'SECTION B: CONTEXTUAL DISCOVERY (40 Marks)',
                    questions: [
                      {
                        id: 'q-sim-2',
                        index: 2,
                        questionType: 'LongForm',
                        questionText:
                          'Evaluate the physical meaning of the area under a Velocity-Time graph, deriving the displacement equation.',
                        marks: 40,
                        confidenceScore: 98,
                        sourceCitation: {
                          pageNumber: 2,
                          passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.',
                        },
                      },
                    ],
                  },
                ];

          set((state) => ({
            assignments: state.assignments.map((a) =>
              a.id === id
                ? { ...a, status: 'completed', progressPercent: 100, sections: finalSections }
                : a
            ),
          }));
        }

        set({ generationStatus: 'completed', generationStep: 5 });
        if (onDone) onDone();
      } else {
        const phase = pipelineSteps[idx];
        set((state) => ({
          generationStatus: phase.status,
          generationStep: idx + 2,
          generationLogs: [...state.generationLogs, ...phase.logs],
        }));
        get().updateAssignmentStatus(
          id,
          phase.status === 'completed' ? 'completed' : 'processing',
          phase.progress
        );
        idx++;
      }
    }, 2500);
  },
}));
