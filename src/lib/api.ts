/**
 * Questora — Typed REST API Client
 * Communicates with the Express backend at http://localhost:5000
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Assignments ──────────────────────────────────────────────────────────────

export interface ApiAssignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  totalMarks: number;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  progressPercent: number;
  sourceName?: string;
  sourceTextExcerpt?: string;
  sections: ApiSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiSection {
  id: string;
  title: string;
  questions: ApiQuestion[];
}

export interface ApiQuestion {
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

export interface CreateAssignmentPayload {
  title: string;
  subject: string;
  grade: string;
  totalMarks?: number;
  sourceName?: string;
  sourceExcerpt?: string;
}

// List all assignments
export const apiGetAssignments = () =>
  request<ApiAssignment[]>('/api/assignments');

// Get single assignment
export const apiGetAssignment = (id: string) =>
  request<ApiAssignment>(`/api/assignments/${id}`);

// Create new assignment (triggers background synthesis)
export const apiCreateAssignment = (payload: CreateAssignmentPayload) =>
  request<{ message: string; assignmentId: string }>('/api/assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// Upload PDF and create assignment
export async function apiUploadAndCreate(
  file: File,
  metadata: { title: string; subject: string; grade: string; totalMarks?: number }
): Promise<{ message: string; assignmentId: string }> {
  const form = new FormData();
  form.append('file', file);
  form.append('title', metadata.title);
  form.append('subject', metadata.subject);
  form.append('grade', metadata.grade);
  form.append('totalMarks', String(metadata.totalMarks ?? 50));

  const res = await fetch(`${BASE_URL}/api/assignments/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Update a single question text
export const apiUpdateQuestion = (
  assignmentId: string,
  sectionId: string,
  questionId: string,
  questionText: string
) =>
  request<ApiAssignment>(
    `/api/assignments/${assignmentId}/sections/${sectionId}/questions/${questionId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ questionText }),
    }
  );

// Delete a question
export const apiDeleteQuestion = (
  assignmentId: string,
  sectionId: string,
  questionId: string
) =>
  request<ApiAssignment>(
    `/api/assignments/${assignmentId}/sections/${sectionId}/questions/${questionId}`,
    { method: 'DELETE' }
  );

// Regenerate a question
export const apiRegenerateQuestion = (
  assignmentId: string,
  sectionId: string,
  questionId: string,
  type: 'easier' | 'harder' | 'rephrase'
) =>
  request<ApiAssignment>(
    `/api/assignments/${assignmentId}/sections/${sectionId}/questions/${questionId}/regenerate`,
    {
      method: 'POST',
      body: JSON.stringify({ type }),
    }
  );

// Mark assignment as verified/completed
export const apiVerifyAssignment = (id: string) =>
  request<ApiAssignment>(`/api/assignments/${id}/verify`, { method: 'PATCH' });

// Health check
export const apiHealthCheck = () =>
  request<{ status: string; timestamp: string }>('/health');
