import { Router } from 'express';
import * as projectController from './projects.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const projectsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs on project routes
});

router.use(projectsRateLimiter);
router.use(authenticate);

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
