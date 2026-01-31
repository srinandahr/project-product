import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as jobService from './jobs.service';

export const createJob = async (req: AuthRequest, res: Response) => {
    try {
        const job = await jobService.createJob(req.user!.id, req.body);
        res.status(201).json(job);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getJobs = async (req: AuthRequest, res: Response) => {
    try {
        const jobs = await jobService.getJobs(req.user!.id);
        res.json(jobs);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
    try {
        const job = await jobService.getJobById(req.user!.id, req.params.id as string);
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
    try {
        const result = await jobService.updateJob(req.user!.id, req.params.id as string, req.body);
        if (result.count === 0) return res.status(404).json({ error: 'Job not found' });
        res.json({ message: 'Job updated' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
    try {
        const result = await jobService.deleteJob(req.user!.id, req.params.id as string);
        if (result.count === 0) return res.status(404).json({ error: 'Job not found' });
        res.json({ message: 'Job deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
