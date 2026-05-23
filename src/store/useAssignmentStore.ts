import { create } from 'zustand';

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

interface AssignmentStore {
  assignments: Assignment[];
  activeAssignment: Assignment | null;
  activeSourceHighlight: string | null;
  generationStep: number;
  generationStatus: 'idle' | 'ingesting' | 'parsing' | 'synthesizing' | 'guardrails' | 'completed' | 'failed';
  generationLogs: string[];
  
  // Actions
  setAssignments: (assignments: Assignment[]) => void;
  setActiveAssignment: (assignment: Assignment | null) => void;
  setActiveSourceHighlight: (highlight: string | null) => void;
  addAssignment: (assignment: Assignment) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status'], progress: number) => void;
  updateQuestion: (assignmentId: string, sectionId: string, questionId: string, updatedFields: Partial<Question>) => void;
  deleteQuestion: (assignmentId: string, sectionId: string, questionId: string) => void;
  regenerateQuestion: (assignmentId: string, sectionId: string, questionId: string, type: string) => Promise<void>;
  verifyAssignment: (id: string) => void;
  simulateAICompilation: (id: string, onDone?: () => void) => void;
}

// Initial mockup data to populate the dashboard immediately with high-fidelity states
const initialAssignments: Assignment[] = [
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
    sourceTextExcerpt: "A vehicle accelerates uniformly from rest to a speed of 20 m/s over a distance of 100 meters. Kinematics describes the motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion. Velocity is a vector quantity expressing speed and direction. Speed is purely scalar. Acceleration measures velocity change over time. Uniform acceleration formulas apply to constant velocity rates.",
    sections: [
      {
        id: 'sec-a',
        title: 'SECTION A: MULTIPLE CHOICE QUESTIONS (10 Marks)',
        questions: [
          {
            id: 'q-1',
            index: 1,
            questionType: 'MCQ',
            questionText: 'A vehicle accelerates uniformly from rest to a speed of 20 m/s over a distance of 100 meters. What is the acceleration of the vehicle?',
            options: ['1.0 m/s²', '2.0 m/s²', '3.0 m/s²', '4.0 m/s²'],
            marks: 2,
            confidenceScore: 98,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'A vehicle accelerates uniformly from rest to a speed of 20 m/s over a distance of 100 meters.'
            }
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
              passageSnippet: 'Velocity is a vector quantity expressing speed and direction. Speed is purely scalar.'
            }
          },
          {
            id: 'q-3',
            index: 3,
            questionType: 'MCQ',
            questionText: 'What branch of mechanics describes the motion of bodies without considering the forces causing it?',
            options: ['Dynamics', 'Kinematics', 'Statics', 'Thermodynamics'],
            marks: 2,
            confidenceScore: 99,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Kinematics describes the motion of points, bodies, and systems of bodies without consideration of the forces that cause the motion.'
            }
          },
          {
            id: 'q-4',
            index: 4,
            questionType: 'MCQ',
            questionText: 'Acceleration is defined mathematically as the change in which parameter over time?',
            options: ['Displacement', 'Mass', 'Velocity', 'Kinetic Energy'],
            marks: 2,
            confidenceScore: 97,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Acceleration measures velocity change over time.'
            }
          },
          {
            id: 'q-5',
            index: 5,
            questionType: 'MCQ',
            questionText: 'Under what conditions do classical uniform acceleration equations apply?',
            options: ['Varying Acceleration', 'Constant Acceleration', 'Zero Velocity', 'Relativistic Speeds'],
            marks: 2,
            confidenceScore: 94,
            sourceCitation: {
              pageNumber: 2,
              passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
            }
          }
        ]
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
              passageSnippet: 'Velocity is a vector quantity expressing speed and direction. Speed is purely scalar.'
            }
          },
          {
            id: 'q-7',
            index: 7,
            questionType: 'ShortAnswer',
            questionText: 'A ball is thrown straight upwards with an initial velocity of 15 m/s. Calculate its maximum height, ignoring air resistance. (Take g = 9.8 m/s²)',
            marks: 5,
            confidenceScore: 89,
            sourceCitation: {
              pageNumber: 2,
              passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
            }
          },
          {
            id: 'q-8',
            index: 8,
            questionType: 'ShortAnswer',
            questionText: 'Explain why acceleration can occur even if an object is traveling at a constant speed in a circular track.',
            marks: 5,
            confidenceScore: 91,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Acceleration measures velocity change over time.'
            }
          }
        ]
      },
      {
        id: 'sec-c',
        title: 'SECTION C: LONG FORM PREPARATION (25 Marks)',
        questions: [
          {
            id: 'q-9',
            index: 9,
            questionType: 'LongForm',
            questionText: 'Provide a complete derivation of the three equations of motion under uniform acceleration starting from standard graphical v-t representations.',
            marks: 12.5,
            confidenceScore: 96,
            sourceCitation: {
              pageNumber: 2,
              passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
            }
          },
          {
            id: 'q-10',
            index: 10,
            questionType: 'LongForm',
            questionText: 'Develop an experimental outline to measure the acceleration due to gravity (g) using a free-fall apparatus, indicating potential systematic errors and control variables.',
            marks: 12.5,
            confidenceScore: 93,
            sourceCitation: {
              pageNumber: 2,
              passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
            }
          }
        ]
      }
    ]
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
    sourceTextExcerpt: "The American Revolutionary War was fought from 1775 to 1783. Key causes included colonial taxation without parliamentary representation, the Stamp Act, and the Boston Tea Party. The Declaration of Independence was drafted in 1776. Major battles included Saratoga and Yorktown.",
    sections: [
      {
        id: 'sec-a',
        title: 'Section A: Essay Prompt',
        questions: [
          {
            id: 'q-20',
            index: 1,
            questionType: 'LongForm',
            questionText: 'Analyze the impact of colonial taxation policies, specifically the Stamp Act of 1765, in unifying colonial resistance against Great Britain.',
            marks: 30,
            confidenceScore: 94,
            sourceCitation: {
              pageNumber: 1,
              passageSnippet: 'Key causes included colonial taxation without parliamentary representation, the Stamp Act, and the Boston Tea Party.'
            }
          }
        ]
      }
    ]
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
    sourceTextExcerpt: "Limits define the value that a function approaches as the input approaches some value. Continuity requires that the limit equals the function value.",
    sections: []
  }
];

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: initialAssignments,
  activeAssignment: null,
  activeSourceHighlight: null,
  generationStep: 0,
  generationStatus: 'idle',
  generationLogs: [],

  setAssignments: (assignments) => set({ assignments }),
  setActiveAssignment: (assignment) => set({ activeAssignment: assignment }),
  setActiveSourceHighlight: (highlight) => set({ activeSourceHighlight: highlight }),
  
  addAssignment: (assignment) => set((state) => ({
    assignments: [assignment, ...state.assignments]
  })),

  updateAssignmentStatus: (id, status, progress) => set((state) => {
    const updated = state.assignments.map((item) =>
      item.id === id ? { ...item, status, progressPercent: progress } : item
    );
    // Sync with active assignment if currently focused
    const currentActive = state.activeAssignment;
    const activeUpdate = currentActive && currentActive.id === id 
      ? { ...currentActive, status, progressPercent: progress } 
      : currentActive;

    return { 
      assignments: updated,
      activeAssignment: activeUpdate
    };
  }),

  updateQuestion: (assignmentId, sectionId, questionId, updatedFields) => set((state) => {
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

    const currentActive = state.activeAssignment;
    let activeUpdate = currentActive;
    if (currentActive && currentActive.id === assignmentId) {
      activeUpdate = updatedAssignments.find(a => a.id === assignmentId) || null;
    }

    return {
      assignments: updatedAssignments,
      activeAssignment: activeUpdate
    };
  }),

  deleteQuestion: (assignmentId, sectionId, questionId) => set((state) => {
    const updatedAssignments = state.assignments.map((assignment) => {
      if (assignment.id !== assignmentId) return assignment;

      let marksFreed = 0;
      const updatedSections = assignment.sections.map((section) => {
        if (section.id !== sectionId) return section;

        const targetQ = section.questions.find(q => q.id === questionId);
        if (targetQ) marksFreed = targetQ.marks;

        const filteredQuestions = section.questions.filter((q) => q.id !== questionId);
        return { ...section, questions: filteredQuestions };
      });

      return { 
        ...assignment, 
        sections: updatedSections,
        totalMarks: Math.max(0, assignment.totalMarks - marksFreed)
      };
    });

    const currentActive = state.activeAssignment;
    let activeUpdate = currentActive;
    if (currentActive && currentActive.id === assignmentId) {
      activeUpdate = updatedAssignments.find(a => a.id === assignmentId) || null;
    }

    return {
      assignments: updatedAssignments,
      activeAssignment: activeUpdate
    };
  }),

  regenerateQuestion: async (assignmentId, sectionId, questionId, type) => {
    // Simulate API delay for regenerating a single question
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const modifierText = 
      type === 'easier' ? 'Simpler formulation. ' :
      type === 'harder' ? 'Advanced logical integration. ' :
      'Alternative conceptual phrasing. ';

    set((state) => {
      const updatedAssignments = state.assignments.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment;

        const updatedSections = assignment.sections.map((section) => {
          if (section.id !== sectionId) return section;

          const updatedQuestions = section.questions.map((q) => {
            if (q.id !== questionId) return q;
            return {
              ...q,
              questionText: `${modifierText}Verify this dynamic relation: ${q.questionText.replace(/^(Simpler formulation. |Advanced logical integration. |Alternative conceptual phrasing. )/, '')}`,
              confidenceScore: Math.min(100, Math.floor(q.confidenceScore * 0.98 + Math.random() * 3))
            };
          });
          return { ...section, questions: updatedQuestions };
        });

        return { ...assignment, sections: updatedSections };
      });

      const currentActive = state.activeAssignment;
      let activeUpdate = currentActive;
      if (currentActive && currentActive.id === assignmentId) {
        activeUpdate = updatedAssignments.find(a => a.id === assignmentId) || null;
      }

      return {
        assignments: updatedAssignments,
        activeAssignment: activeUpdate
      };
    });
  },

  verifyAssignment: (id) => set((state) => {
    const updated = state.assignments.map((item) =>
      item.id === id ? { ...item, status: 'completed' as const } : item
    );
    const activeUpdate = state.activeAssignment && state.activeAssignment.id === id
      ? { ...state.activeAssignment, status: 'completed' as const }
      : state.activeAssignment;
      
    return {
      assignments: updated,
      activeAssignment: activeUpdate
    };
  }),

  simulateAICompilation: (id, onDone) => {
    set({ 
      generationStatus: 'ingesting',
      generationStep: 1,
      generationLogs: ['[Connection Opened] Real-time WebSocket channel established.', 'Phase 1: Ingesting source files...']
    });

    const pipelineSteps = [
      {
        status: 'parsing' as const,
        logs: ['File check completed. Ingested 1 PDF document (2.4MB).', 'Phase 2: Semantic core analysis in progress...', 'Identified core concept group: Classical Mechanics & Force Vectors.', 'Parsing chapter definitions and formula schemas...'],
        progress: 25
      },
      {
        status: 'synthesizing' as const,
        logs: ['Semantic model parsed (18 core pedagogical keyterms stored).', 'Phase 3: Synthesizing customized question models...', 'Drafting Section A: Synthesizing Multiple Choice Questions with distraction controls.', 'Drafting Section B: Structuring concept distinction short-answers.', 'Drafting Section C: Creating logical proofs for kinematics derivations.'],
        progress: 60
      },
      {
        status: 'guardrails' as const,
        logs: ['Syntax drafts completed.', 'Phase 4: Running pedagogical safety checks...', 'Verifying syllabus compliance levels against Grade 10 standards.', 'Validating distractors alignment. Ensuring options avoid logical circular references.', 'Refining equation typography (KaTeX format compilation).'],
        progress: 85
      },
      {
        status: 'completed' as const,
        logs: ['Pedagogical check passed: 100% compliance verified.', 'Phase 5: Performing structural typesetting and final print layouts.', 'Typesetting completed.', 'WebSocket Stream Closed. Assignment compiled successfully.'],
        progress: 100
      }
    ];

    let currentStepIndex = 0;

    const interval = setInterval(() => {
      if (currentStepIndex >= pipelineSteps.length) {
        clearInterval(interval);
        
        // Finalize state
        const targetAssignment = get().assignments.find(a => a.id === id);
        if (targetAssignment) {
          // If the paper was empty (e.g. newly created), give it questions modeled from kinematics
          const finalSections: Section[] = targetAssignment.sections.length > 0 ? targetAssignment.sections : [
            {
              id: 'sec-a',
              title: 'SECTION A: MULTIPLE CHOICE QUESTIONS (10 Marks)',
              questions: [
                {
                  id: 'q-new-1',
                  index: 1,
                  questionType: 'MCQ',
                  questionText: 'Under constant acceleration conditions, which vector quantity aligns perfectly with direction change?',
                  options: ['Instantaneous Speed', 'Instantaneous Velocity', 'Average Mass', 'Rotational Inertia'],
                  marks: 5,
                  confidenceScore: 96,
                  sourceCitation: {
                    pageNumber: 1,
                    passageSnippet: 'Velocity is a vector quantity expressing speed and direction.'
                  }
                },
                {
                  id: 'q-new-2',
                  index: 2,
                  questionType: 'MCQ',
                  questionText: 'Distinguish which of these describes acceleration change mathematically.',
                  options: ['Velocity rate over time', 'Displacement rates', 'Momentum bounds', 'Friction constraints'],
                  marks: 5,
                  confidenceScore: 94,
                  sourceCitation: {
                    pageNumber: 1,
                    passageSnippet: 'Acceleration measures velocity change over time.'
                  }
                }
              ]
            },
            {
              id: 'sec-b',
              title: 'SECTION B: CONTEXTUAL DISCOVERY (40 Marks)',
              questions: [
                {
                  id: 'q-new-3',
                  index: 3,
                  questionType: 'LongForm',
                  questionText: 'Evaluate the physical meaning of the area under a Velocity-Time graph, deriving the matching displacement equation.',
                  marks: 40,
                  confidenceScore: 98,
                  sourceCitation: {
                    pageNumber: 2,
                    passageSnippet: 'Uniform acceleration formulas apply to constant velocity rates.'
                  }
                }
              ]
            }
          ];

          set((state) => ({
            assignments: state.assignments.map(a => 
              a.id === id 
                ? { ...a, status: 'completed' as const, progressPercent: 100, sections: finalSections }
                : a
            )
          }));
        }

        set({ 
          generationStatus: 'completed', 
          generationStep: 5 
        });

        if (onDone) onDone();
      } else {
        const currentPhase = pipelineSteps[currentStepIndex];
        set((state) => ({
          generationStatus: currentPhase.status,
          generationStep: currentStepIndex + 2,
          generationLogs: [...state.generationLogs, ...currentPhase.logs]
        }));
        get().updateAssignmentStatus(id, currentPhase.status === 'completed' ? 'completed' : 'processing', currentPhase.progress);
        currentStepIndex++;
      }
    }, 2500); // Transitions step every 2.5s for highly legible log tracking
  }
}));

