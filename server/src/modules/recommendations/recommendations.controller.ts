import { Request, Response } from 'express';
import * as recommendationsService from './recommendations.service';

export const getRecommendations = async (req: any, res: Response) => {
    try {
        const userId = req.user.id;
        const jobs = await recommendationsService.getDailyRecommendations(userId);
        res.json(jobs);
    } catch (error: any) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: error.message });
    }
};

export const clearRecommendations = async (req: any, res: Response) => {
    console.log('[Recommendations] Received DELETE / request');
    try {
        const userId = req.user.id;
        console.log(`[Recommendations] Clearing for user: ${userId}`);
        await recommendationsService.clearDailyRecommendations(userId);
        res.json({ message: 'Recommendations cleared successfully' });
    } catch (error: any) {
        console.error('Error clearing recommendations:', error);
        res.status(500).json({ error: error.message });
    }
};
