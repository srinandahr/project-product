import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as resumeService from './resumes.service';

export const createResume = async (req: AuthRequest, res: Response) => {
    try {
        const resume = await resumeService.createResume(req.user!.id, req.body);
        res.status(201).json(resume);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getResumes = async (req: AuthRequest, res: Response) => {
    try {
        const resumes = await resumeService.getResumes(req.user!.id);
        res.json(resumes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateResume = async (req: AuthRequest, res: Response) => {
    try {
        const result = await resumeService.updateResume(req.user!.id, req.params.id as string, req.body);
        if (result.count === 0) return res.status(404).json({ error: 'Resume not found' });
        res.json({ message: 'Resume updated' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteResume = async (req: AuthRequest, res: Response) => {
    try {
        const result = await resumeService.deleteResume(req.user!.id, req.params.id as string);
        if (result.count === 0) return res.status(404).json({ error: 'Resume not found' });
        res.json({ message: 'Resume deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
