import { Router } from 'express';
import * as leetCodeController from './leetcode.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const leetCodeStatsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.use(authenticate);
router.use(leetCodeStatsLimiter);

router.get('/:username', leetCodeController.getStats);

export default router;
