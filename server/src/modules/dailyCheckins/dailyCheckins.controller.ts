import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as checkinService from './dailyCheckins.service';

export const createCheckin = async (req: AuthRequest, res: Response) => {
    try {
        const checkin = await checkinService.createCheckin(req.user!.id, req.body);
        res.status(201).json(checkin);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getTodayCheckin = async (req: AuthRequest, res: Response) => {
    try {
        const checkin = await checkinService.getTodayCheckin(req.user!.id);
        res.json(checkin || { message: 'No check-in for today' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getStreak = async (req: AuthRequest, res: Response) => {
    try {
        const streak = await checkinService.getStreak(req.user!.id);
        res.json(streak);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
