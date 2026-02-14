import prisma from '../../config/db';
import { z } from 'zod';

const resumeSchema = z.object({
    title: z.string(),
    file_url: z.string(), // We keep this as a 'virtual' URL or filename
    tags: z.array(z.string()),
    is_active: z.boolean().default(true),
});

export const createResume = async (userId: string, data: any, fileBuffer?: Buffer, mimeType?: string) => {
    const validatedData = resumeSchema.parse(data);
    return await prisma.resume.create({
        data: {
            ...validatedData,
            user_id: userId,
            data: fileBuffer,
            mime_type: mimeType
        },
        // Don't return the binary data in the response
        select: {
            id: true,
            user_id: true,
            title: true,
            file_url: true,
            tags: true,
            is_active: true,
            created_at: true
        }
    });
};

export const getResumes = async (userId: string) => {
    return await prisma.resume.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        // Exclude the binary 'data' field for performance
        select: {
            id: true,
            user_id: true,
            title: true,
            file_url: true,
            tags: true,
            is_active: true,
            created_at: true
        }
    });
};

export const getResumeFile = async (userId: string, resumeId: string) => {
    return await prisma.resume.findFirst({
        where: { id: resumeId, user_id: userId },
        select: {
            data: true,
            mime_type: true
        }
    });
};

export const updateResume = async (userId: string, resumeId: string, data: unknown) => {
    const validatedData = resumeSchema.partial().parse(data);
    return await prisma.resume.updateMany({
        where: { id: resumeId, user_id: userId },
        data: validatedData,
    });
};

export const deleteResume = async (userId: string, resumeId: string) => {
    return await prisma.resume.deleteMany({
        where: { id: resumeId, user_id: userId },
    });
};
