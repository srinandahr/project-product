import { Router } from 'express';
import * as projectController from './projects.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', projectController.createProject);
router.get('/', projectController.getProjects);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export default router;
