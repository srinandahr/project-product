import { Router } from 'express';
import * as leetCodeController from './leetcode.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/:username', leetCodeController.getStats);

export default router;
