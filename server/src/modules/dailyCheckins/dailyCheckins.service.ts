import prisma from '../../config/db';
import { z } from 'zod';

const checkinSchema = z.object({
    applied_jobs: z.boolean().optional(),
    practiced_dsa: z.boolean().optional(),
    worked_on_project: z.boolean().optional(),
    resume_updated: z.boolean().optional(),
    notes: z.string().optional(),
});

export const createCheckin = async (userId: string, data: unknown) => {
    const validatedData = checkinSchema.parse(data);

    // Check if check-in exists for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // ALWAYS get the latest one to update
    const existingCheckin = await prisma.dailyCheckin.findFirst({
        where: {
            user_id: userId,
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: { date: 'desc' }
    });

    if (existingCheckin) {
        console.log(`[Checkin] Updating existing record: ${existingCheckin.id}`);
        return await prisma.dailyCheckin.update({
            where: { id: existingCheckin.id },
            data: validatedData,
        });
    }

    console.log(`[Checkin] Creating NEW record`);
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
        orderBy: { date: 'desc' }
    });
};

export const getStreak = async (userId: string) => {
    const checkins = await prisma.dailyCheckin.findMany({
        where: { user_id: userId },
        orderBy: { date: 'desc' },
    });

    // Normalize dates to midnight to compare days easily
    const toDayString = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.toISOString();
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString();

    // Deduplicate days - keep only the latest checkin for each day
    // Since we ordered by date desc, the first one we see is the latest
    const uniqueDayCheckins = new Map<string, typeof checkins[0]>();

    for (const c of checkins) {
        const dayStr = toDayString(c.date);
        if (!uniqueDayCheckins.has(dayStr)) {
            uniqueDayCheckins.set(dayStr, c);
        }
    }

    // Filter for active days from the UNIQUE checkins
    const activeDates = new Set<string>();

    for (const [dayStr, c] of uniqueDayCheckins.entries()) {
        if (c.applied_jobs || c.practiced_dsa || c.worked_on_project || c.resume_updated) {
            activeDates.add(dayStr);
        }
    }

    if (activeDates.size === 0) return { streak: 0 };

    // Check if streak is alive (completed today OR completed yesterday)
    // If neither, streak is 0.
    if (!activeDates.has(todayStr) && !activeDates.has(yesterdayStr)) {
        return { streak: 0 };
    }

    // Calculate streak
    let streak = 0;
    let currentCheck = activeDates.has(todayStr) ? today : yesterday;

    while (activeDates.has(currentCheck.toISOString())) {
        streak++;
        // Go back one day
        currentCheck.setDate(currentCheck.getDate() - 1);
    }

    return { streak };
};
