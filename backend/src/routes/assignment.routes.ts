import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateQuestion,
  deleteQuestion,
  regenerateQuestion,
  verifyAssignment
} from '../controllers/assignment.controller';
import { uploadAndCreateAssignment, upload } from '../controllers/upload.controller';

const router = Router();

// File upload route (must be before /:id so it doesn't clash)
router.post('/upload', upload.single('file'), uploadAndCreateAssignment);

router.post('/', createAssignment);
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.patch('/:id/verify', verifyAssignment);
router.put('/:id/sections/:sectionId/questions/:questionId', updateQuestion);
router.delete('/:id/sections/:sectionId/questions/:questionId', deleteQuestion);
router.post('/:id/sections/:sectionId/questions/:questionId/regenerate', regenerateQuestion);

export default router;
