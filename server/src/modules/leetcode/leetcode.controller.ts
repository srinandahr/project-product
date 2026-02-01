import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as leetCodeService from './leetcode.service';

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        console.log(`[LeetCode] Fetching stats for: ${req.params.username}`);
        const { username } = req.params;
        const stats = await leetCodeService.fetchLeetCodeStats(username as string);

        // Save to DB
        if (req.user?.id) {
            await leetCodeService.upsertLeetCodeProfile(req.user.id, username as string, stats);
        }

        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
