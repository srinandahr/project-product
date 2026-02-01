import { Router } from 'express';
import * as resumeController from './resumes.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const resumeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs on resume routes
});

router.use(authenticate);
router.use(resumeRateLimiter);

import { upload } from '../../middlewares/upload.middleware';

router.post('/', upload.single('file'), resumeController.createResume);
router.get('/', resumeController.getResumes);
router.patch('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

export default router;
