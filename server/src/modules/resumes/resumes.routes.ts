import { Router } from 'express';
import * as resumeController from './resumes.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', resumeController.createResume);
router.get('/', resumeController.getResumes);
router.patch('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

export default router;
