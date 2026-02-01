import prisma from '../../config/db';
import { z } from 'zod';

const projectSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    tech_stack: z.array(z.string()),
    repo_url: z.string().url().optional().nullable(),
    live_url: z.string().url().optional().nullable(),
    status: z.enum(['Not Started', 'In Progress', 'Completed']),
    start_date: z.string().transform((str) => new Date(str)).optional().nullable(),
    end_date: z.string().transform((str) => new Date(str)).optional().nullable(),
});

export const createProject = async (userId: string, data: unknown) => {
    const validatedData = projectSchema.parse(data);
    return await prisma.project.create({
        data: {
            ...validatedData,
            user_id: userId,
        },
    });
};

export const getProjects = async (userId: string) => {
    return await prisma.project.findMany({
        where: { user_id: userId },
        orderBy: { start_date: 'desc' },
    });
};

export const updateProject = async (userId: string, projectId: string, data: unknown) => {
    const validatedData = projectSchema.partial().parse(data);
    return await prisma.project.updateMany({
        where: { id: projectId, user_id: userId },
        data: validatedData,
    });
};

export const deleteProject = async (userId: string, projectId: string) => {
    return await prisma.project.deleteMany({
        where: { id: projectId, user_id: userId },
    });
};
