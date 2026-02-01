import prisma from '../../config/db';
import { getStreak, getTodayCheckin } from '../dailyCheckins/dailyCheckins.service';

export const getDashboardStats = async (userId: string) => {
    // Job Stats
    const jobStatsRaw = await prisma.jobApplication.groupBy({
        by: ['status'],
        where: { user_id: userId },
        _count: { status: true },
    });

    const jobStats = {
        applied: 0,
        interviews: 0,
        offers: 0,
        rejected: 0,
        total: 0,
    };

    jobStatsRaw.forEach((stat: any) => {
        switch (stat.status) {
            case 'Applied':
                jobStats.applied += stat._count.status;
                break;
            case 'Interviewing':
                jobStats.interviews += stat._count.status;
                break;
            case 'Offer':
                jobStats.offers += stat._count.status;
                break;
            case 'Rejected':
                jobStats.rejected += stat._count.status;
                break;
        }
        jobStats.total += stat._count.status;
    });

    // LeetCode Stats
    const leetcodeProfile = await prisma.leetCodeProfile.findUnique({
        where: { user_id: userId },
    });

    // Project Stats
    const projectStatsRaw = await prisma.project.groupBy({
        by: ['status'],
        where: { user_id: userId },
        _count: { status: true },
    });

    const projectStats = {
        completed: 0,
        inProgress: 0,
    };

    projectStatsRaw.forEach((stat: any) => {
        if (stat.status === 'Completed') {
            projectStats.completed += stat._count.status;
        } else {
            projectStats.inProgress += stat._count.status;
        }
    });

    // Check-in Streak
    const { streak: checkinStreak } = await getStreak(userId);
    const todayCheckin = await getTodayCheckin(userId);

    // Graph Data - Last 7 Days
    const activityData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        d.setHours(0, 0, 0, 0);

        const nextDay = new Date(d);
        nextDay.setDate(d.getDate() + 1);

        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

        // Count Job Applications for this day
        const applicationCount = await prisma.jobApplication.count({
            where: {
                user_id: userId,
                created_at: {
                    gte: d,
                    lt: nextDay
                }
            }
        });

        // For LeetCode, strictly speaking we don't have daily history stored yet.
        // We will default to 0 to be accurate to "DB state", or we could potentially
        // infer from checkins if we wanted. For now, 0 or mock is safer than lying.
        // Let's output 0. The user can see "Total Solved" in the card.

        activityData.push({
            day: dayName,
            applications: applicationCount,
            leetcode: 0
        });
    }

    return {
        jobStats,
        leetcode: {
            totalSolved: leetcodeProfile?.total_solved || 0,
            streak: 0,
        },
        checkinStreak,
        todayCheckin,
        projects: projectStats,
        activityData,
    };
};
