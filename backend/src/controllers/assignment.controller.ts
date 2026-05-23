import { Request, Response } from 'express';
import { AssignmentModel } from '../models/assignment.model';
import { triggerAssignmentSynthesis } from '../queues/synthesis.queue';

export async function createAssignment(req: Request, res: Response) {
  try {
    const { title, subject, grade, totalMarks, sourceName, sourceExcerpt } = req.body;
    
    const newAssignment = new AssignmentModel({
      title: title || 'Untitled Assessment Blueprint',
      subject,
      grade,
      totalMarks: totalMarks || 50,
      status: 'processing',
      progressPercent: 10,
      sourceName: sourceName || 'Uploaded Document',
      sourceTextExcerpt: sourceExcerpt || 'Extracted material excerpt.'
    });

    await newAssignment.save();

    // Trigger synthesis background worker
    triggerAssignmentSynthesis(newAssignment._id.toString());

    return res.status(202).json({
      message: 'Assignment synthesis job accepted',
      assignmentId: newAssignment._id
    });
  } catch (error: any) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getAssignments(req: Request, res: Response) {
  try {
    const assignments = await AssignmentModel.find().sort({ createdAt: -1 });
    return res.json(assignments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getAssignmentById(req: Request, res: Response) {
  try {
    const assignment = await AssignmentModel.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.json(assignment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateQuestion(req: Request, res: Response) {
  try {
    const { id, sectionId, questionId } = req.params;
    const { questionText } = req.body;

    const assignment = await AssignmentModel.findById(id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const section = assignment.sections.find(s => s.id === sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const question = section.questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    question.questionText = questionText;
    await assignment.save();

    return res.json(assignment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteQuestion(req: Request, res: Response) {
  try {
    const { id, sectionId, questionId } = req.params;

    const assignment = await AssignmentModel.findById(id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const section = assignment.sections.find(s => s.id === sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const targetQ = section.questions.find(q => q.id === questionId);
    if (!targetQ) return res.status(404).json({ error: 'Question not found' });

    const marksFreed = targetQ.marks;
    section.questions = section.questions.filter(q => q.id !== questionId);
    assignment.totalMarks = Math.max(0, assignment.totalMarks - marksFreed);

    await assignment.save();
    return res.json(assignment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function regenerateQuestion(req: Request, res: Response) {
  try {
    const { id, sectionId, questionId } = req.params;
    const { type } = req.body; // 'easier' | 'harder' | 'rephrase'

    const assignment = await AssignmentModel.findById(id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const section = assignment.sections.find(s => s.id === sectionId);
    if (!section) return res.status(404).json({ error: 'Section not found' });

    const question = section.questions.find(q => q.id === questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    // Simulate API delay for calibration
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const prefix = 
      type === 'easier' ? 'Simpler formulation. ' :
      type === 'harder' ? 'Advanced logical integration. ' :
      'Alternative conceptual phrasing. ';

    question.questionText = `${prefix}Verify this dynamic relation: ${question.questionText.replace(/^(Simpler formulation. |Advanced logical integration. |Alternative conceptual phrasing. )/, '')}`;
    question.confidenceScore = Math.min(100, Math.floor(question.confidenceScore * 0.98 + Math.random() * 3));

    await assignment.save();
    return res.json(assignment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function verifyAssignment(req: Request, res: Response) {
  try {
    const assignment = await AssignmentModel.findByIdAndUpdate(req.params.id, {
      status: 'completed'
    }, { new: true });
    
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    return res.json(assignment);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
