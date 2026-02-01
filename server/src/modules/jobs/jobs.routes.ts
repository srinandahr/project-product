import { Router } from 'express';
import * as jobController from './jobs.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const jobsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs on jobs routes
});

router.use(authenticate);
router.use(jobsRateLimiter);

router.post('/', jobController.createJob);
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.patch('/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

export default router;
