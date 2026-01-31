import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as projectService from './projects.service';

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        const project = await projectService.createProject(req.user!.id, req.body);
        res.status(201).json(project);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const projects = await projectService.getProjects(req.user!.id);
        res.json(projects);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const result = await projectService.updateProject(req.user!.id, req.params.id as string, req.body);
        if (result.count === 0) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project updated' });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        const result = await projectService.deleteProject(req.user!.id, req.params.id as string);
        if (result.count === 0) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
