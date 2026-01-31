import prisma from '../../config/db';
import { z } from 'zod';

const checkinSchema = z.object({
    applied_jobs: z.boolean().default(false),
    practiced_dsa: z.boolean().default(false),
    worked_on_project: z.boolean().default(false),
    resume_updated: z.boolean().default(false),
    notes: z.string().optional(),
});

export const createCheckin = async (userId: string, data: unknown) => {
    const validatedData = checkinSchema.parse(data);
    return await prisma.dailyCheckin.create({
        data: {
            ...validatedData,
            user_id: userId,
        },
    });
};

export const getTodayCheckin = async (userId: string) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.dailyCheckin.findFirst({
        where: {
            user_id: userId,
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
};

export const getStreak = async (userId: string) => {
    // Simple streak calculation (requires more complex logic for skipped days, but this is a starter)
    const checkins = await prisma.dailyCheckin.findMany({
        where: { user_id: userId },
        orderBy: { date: 'desc' },
        select: { date: true },
    });

    // Calculate streak logic here... placeholder
    return { streak: checkins.length, lastCheckin: checkins[0]?.date };
};
