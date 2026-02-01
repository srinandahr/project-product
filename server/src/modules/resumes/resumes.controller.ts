import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as resumeService from './resumes.service';

export const createResume = async (req: AuthRequest, res: Response) => {
    try {
        let fileUrl = req.body.file_url;

        if (req.file) {
            // Construct URL for uploaded file
            // Assuming server is running on localhost/domain. 
            // Ideally base URL should be from env config.
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            fileUrl = `${baseUrl}/uploads/resumes/${req.file.filename}`;
        }

        let tags = req.body.tags;
        if (typeof tags === 'string') {
            try {
                tags = JSON.parse(tags);
            } catch (e) {
                // Ignore error, might be plain string or invalid json, validation will handle it
                tags = [tags];
            }
        }

        const resumeData = {
            ...req.body,
            tags,
            file_url: fileUrl
        };

        const resume = await resumeService.createResume(req.user!.id, resumeData);
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
