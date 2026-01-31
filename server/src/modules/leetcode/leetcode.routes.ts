import { Router } from 'express';
import * as leetcodeController from './leetcode.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/connect', leetcodeController.connect);
router.get('/profile', leetcodeController.getProfile);
router.post('/sync', leetcodeController.sync);

export default router;
