import { Request, Response } from 'express';
import * as leetCodeService from './leetcode.service';

export const getStats = async (req: Request, res: Response) => {
    try {
        console.log(`[LeetCode] Fetching stats for: ${req.params.username}`);
        const { username } = req.params;
        const stats = await leetCodeService.fetchLeetCodeStats(username as string);
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
