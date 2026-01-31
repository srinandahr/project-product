import prisma from '../../config/db';
import { z } from 'zod';

const connectSchema = z.object({
    username: z.string().min(1),
});

const syncSchema = z.object({
    total_solved: z.number().int().nonnegative(),
    easy_solved: z.number().int().nonnegative(),
    medium_solved: z.number().int().nonnegative(),
    hard_solved: z.number().int().nonnegative(),
    ranking: z.number().int().optional(),
});

export const connectProfile = async (userId: string, data: unknown) => {
    const { username } = connectSchema.parse(data);
    return await prisma.leetCodeProfile.upsert({
        where: { user_id: userId },
        update: { username },
        create: { user_id: userId, username },
    });
};

export const getProfile = async (userId: string) => {
    return await prisma.leetCodeProfile.findUnique({
        where: { user_id: userId },
    });
};

export const syncProfile = async (userId: string, data: unknown) => {
    const validatedData = syncSchema.parse(data);
    return await prisma.leetCodeProfile.update({
        where: { user_id: userId },
        data: {
            ...validatedData,
            last_synced_at: new Date(),
        },
    });
};
