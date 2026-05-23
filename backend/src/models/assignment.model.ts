import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
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

export interface ISection {
  id: string;
  title: string;
  questions: IQuestion[];
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  progressPercent: number;
  sourceName?: string;
  sourceTextExcerpt?: string;
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  id: { type: String, required: true },
  index: { type: Number, required: true },
  questionText: { type: String, required: true },
  options: { type: [String], default: undefined },
  questionType: { type: String, enum: ['MCQ', 'ShortAnswer', 'LongForm', 'FillInBlank'], required: true },
  marks: { type: Number, required: true },
  confidenceScore: { type: Number, required: true },
  sourceCitation: {
    pageNumber: { type: Number },
    passageSnippet: { type: String }
  }
});

const SectionSchema = new Schema<ISection>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  questions: [QuestionSchema]
});

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'processing', 'completed', 'failed'], default: 'draft' },
  progressPercent: { type: Number, default: 0 },
  sourceName: { type: String },
  sourceTextExcerpt: { type: String },
  sections: [SectionSchema]
}, {
  timestamps: true
});

// Compound Index to speed up list searches
AssignmentSchema.index({ status: 1, createdAt: -1 });

export const AssignmentModel = model<IAssignment>('Assignment', AssignmentSchema);
