import { Router } from 'express';
import * as checkinController from './dailyCheckins.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', checkinController.createCheckin);
router.get('/today', checkinController.getTodayCheckin);
router.get('/streak', checkinController.getStreak);

export default router;
