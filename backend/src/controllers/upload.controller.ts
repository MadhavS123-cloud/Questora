import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { AssignmentModel } from '../models/assignment.model';
import { triggerAssignmentSynthesis } from '../queues/synthesis.queue';

// ─── Multer Setup (disk storage) ──────────────────────────────────────────────
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safeName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['application/pdf', 'text/plain'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and plain text files are accepted'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// ─── Upload + Create Controller ───────────────────────────────────────────────
export async function uploadAndCreateAssignment(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, subject, grade, totalMarks } = req.body;

    // Extract text from PDF (or read plain text)
    let extractedText = '';
    try {
      if (file.mimetype === 'application/pdf') {
        const buffer = fs.readFileSync(file.path);
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text.slice(0, 2000); // keep first 2000 chars for excerpt
      } else {
        extractedText = fs.readFileSync(file.path, 'utf-8').slice(0, 2000);
      }
    } catch (parseErr) {
      console.warn('Could not parse file text:', parseErr);
      extractedText = 'Document content could not be extracted.';
    }

    const newAssignment = new AssignmentModel({
      title: title || 'Untitled Assessment Blueprint',
      subject: subject || 'General',
      grade: grade || 'Grade 10',
      totalMarks: Number(totalMarks) || 50,
      status: 'processing',
      progressPercent: 10,
      sourceName: file.originalname,
      sourceTextExcerpt: extractedText.trim(),
    });

    await newAssignment.save();

    // Kick off background synthesis (fire-and-forget)
    triggerAssignmentSynthesis(newAssignment._id.toString());

    return res.status(202).json({
      message: 'File received. Assignment synthesis job accepted.',
      assignmentId: newAssignment._id.toString(),
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message });
  }
}
