import { Router } from 'express';
import * as recommendationsController from './recommendations.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, recommendationsController.getRecommendations);

export default router;
