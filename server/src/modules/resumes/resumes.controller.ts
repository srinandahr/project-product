import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as resumeService from './resumes.service';

export const createResume = async (req: AuthRequest, res: Response) => {
    try {
        let fileBuffer: Buffer | undefined;
        let mimeType: string | undefined;
        let originalName = 'resume.pdf';

        if (req.file) {
            fileBuffer = req.file.buffer;
            mimeType = req.file.mimetype;
            originalName = req.file.originalname;
        }

        let tags = req.body.tags;
        if (typeof tags === 'string') {
            try {
                tags = JSON.parse(tags);
            } catch (e) {
                tags = [tags];
            }
        }

        // We use a placeholder URL initially, then update it with the ID-based API URL
        const resumeData = {
            ...req.body,
            tags,
            file_url: 'http://placeholder/pending' // Placeholder to satisfy Zod .url()
        };

        const resume = await resumeService.createResume(req.user!.id, resumeData, fileBuffer, mimeType);

        // Update with the actual API URL
        // Force HTTPS in production or use protocol from proxy
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : req.protocol;
        const baseUrl = `${protocol}://${req.get('host')}`;
        const apiUrl = `${baseUrl}/api/resumes/${resume.id}/file`;

        await resumeService.updateResume(req.user!.id, resume.id, { file_url: apiUrl });

        // Return the resume with the correct URL
        res.status(201).json({ ...resume, file_url: apiUrl });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getResumes = async (req: AuthRequest, res: Response) => {
    try {
        const resumes = await resumeService.getResumes(req.user!.id);

        // Ensure URLs are HTTPS in production (fixes mixed content for existing data)
        const secureResumes = resumes.map(resume => ({
            ...resume,
            file_url: (process.env.NODE_ENV === 'production' && resume.file_url.startsWith('http:'))
                ? resume.file_url.replace('http:', 'https:')
                : resume.file_url
        }));

        res.json(secureResumes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const serveResumeFile = async (req: AuthRequest, res: Response) => {
    try {
        const resumeId = req.params.id as string;
        const resume = await resumeService.getResumeFile(req.user!.id, resumeId);

        if (!resume || !resume.data) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.setHeader('Content-Type', resume.mime_type || 'application/pdf');
        // prompt for download (attachment) or inline view? 
        // User wants "View", so 'inline' is better, but maybe allow toggle?
        // Defaulting to inline for PDF viewing in iframe.
        res.setHeader('Content-Disposition', 'inline; filename="resume.pdf"');

        res.send(resume.data);
    } catch (error: any) {
        console.error('Error serving resume:', error);
        res.status(500).json({ error: 'Failed to retrieve file' });
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
