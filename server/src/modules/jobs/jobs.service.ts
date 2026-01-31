import prisma from '../../config/db';
import { z } from 'zod';

const jobSchema = z.object({
    company_name: z.string().min(1),
    role: z.string().min(1),
    job_type: z.enum(['Full-time', 'Internship', 'Contract']),
    location: z.string().min(1),
    status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
    applied_date: z.string().transform((str) => new Date(str)),
    source: z.string(),
    notes: z.string().optional(),
});

export const createJob = async (userId: string, data: unknown) => {
    const validatedData = jobSchema.parse(data);
    return await prisma.jobApplication.create({
        data: {
            ...validatedData,
            user_id: userId,
        },
    });
};

export const getJobs = async (userId: string) => {
    return await prisma.jobApplication.findMany({
        where: { user_id: userId },
        orderBy: { applied_date: 'desc' },
    });
};

export const getJobById = async (userId: string, jobId: string) => {
    return await prisma.jobApplication.findFirst({
        where: { id: jobId, user_id: userId },
    });
};

export const updateJob = async (userId: string, jobId: string, data: unknown) => {
    const validatedData = jobSchema.partial().parse(data);
    return await prisma.jobApplication.updateMany({
        where: { id: jobId, user_id: userId },
        data: validatedData,
    });
};

export const deleteJob = async (userId: string, jobId: string) => {
    return await prisma.jobApplication.deleteMany({
        where: { id: jobId, user_id: userId },
    });
};
