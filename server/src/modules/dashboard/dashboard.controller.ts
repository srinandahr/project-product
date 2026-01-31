import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as dashboardService from './dashboard.service';

export const getOverview = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await dashboardService.getDashboardStats(req.user!.id);
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
