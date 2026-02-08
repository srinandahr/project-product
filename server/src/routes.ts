import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';

import jobsRoutes from './modules/jobs/jobs.routes';
import projectsRoutes from './modules/projects/projects.routes';

import resumesRoutes from './modules/resumes/resumes.routes';
import leetcodeRoutes from './modules/leetcode/leetcode.routes';

import dailyCheckinsRoutes from './modules/dailyCheckins/dailyCheckins.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import recommendationsRoutes from './modules/recommendations/recommendations.routes';

const router = Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/projects', projectsRoutes);
router.use('/resumes', resumesRoutes);
router.use('/leetcode', leetcodeRoutes);
router.use('/checkins', dailyCheckinsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/recommendations', recommendationsRoutes);

export default router;
