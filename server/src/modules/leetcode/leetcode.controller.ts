import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as leetcodeService from './leetcode.service';

export const connect = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await leetcodeService.connectProfile(req.user!.id, req.body);
        res.json(profile);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await leetcodeService.getProfile(req.user!.id);
        if (!profile) return res.status(404).json({ error: 'Profile not connect' });
        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const sync = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await leetcodeService.syncProfile(req.user!.id, req.body);
        res.json(profile);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
