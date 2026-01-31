import prisma from '../../config/db';
import { z } from 'zod';

const resumeSchema = z.object({
    title: z.string(),
    file_url: z.string().url(),
    tags: z.array(z.string()),
    is_active: z.boolean().default(true),
});

export const createResume = async (userId: string, data: unknown) => {
    const validatedData = resumeSchema.parse(data);
    return await prisma.resume.create({
        data: {
            ...validatedData,
            user_id: userId,
        },
    });
};

export const getResumes = async (userId: string) => {
    return await prisma.resume.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
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
