import { Request, Response } from 'express';
import * as authService from './auth.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import prisma from '../../config/db';

export const register = async (req: Request, res: Response) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, created_at: true }
        });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
