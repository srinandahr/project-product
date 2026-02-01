import { Router } from 'express';
import * as leetCodeController from './leetcode.controller';

const router = Router();

router.get('/:username', leetCodeController.getStats);

export default router;
