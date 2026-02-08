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
