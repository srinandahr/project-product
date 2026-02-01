import { Router } from 'express';
import * as checkinController from './dailyCheckins.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

const dailyCheckinsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authenticate);
router.use(dailyCheckinsRateLimiter);

router.post('/', checkinController.createCheckin);
router.get('/today', checkinController.getTodayCheckin);
router.get('/streak', checkinController.getStreak);

export default router;
