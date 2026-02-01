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

        // Parse LeetCode submission history
        const calendar = leetcodeProfile?.submission_calendar ? JSON.parse(leetcodeProfile.submission_calendar) : {};

        // LeetCode timestamps are unix seconds. 
        // We need to check if the day matches.
        // Convert 'd' (which is 00:00:00 local) into a timestamp range or just check exact day match.
        // Simplest: Iterate calendar keys, convert to date string, check match.

        let leetcodeCount = 0;

        // Optimize: Create a map or lookup once outside the loop if performance matters, 
        // but for 7 days and small calendar it's fine.
        // Actually, let's just do a quick lookup here.

        const targetDateStr = d.toDateString();

        Object.keys(calendar).forEach(ts => {
            const date = new Date(parseInt(ts) * 1000);
            if (date.toDateString() === targetDateStr) {
                leetcodeCount += calendar[ts]; // Add count for this submission entry (usually just 1 or aggregated)
            }
        });

        // The submissionCalendar format from LeetCode is { timestamp: count } where timestamp is start of day or specific sub??
        // LeetCode calendar keys are usually the timestamp of the *day start* (UTC) or specific submission.
        // Let's assume keys are entry timestamps. 
        // Actually LeetCode 'submissionCalendar' keys are unix seconds for the *start of the day* in UTC.
        // So we might need to be careful with timezones.
        // However, converting both to `toDateString` (local) might be "good enough" for personal dashboard 
        // or we can just try to match.
        // Better approach:
        // Convert d to timestamp / 1000. 
        // Iterate calendar, check if entry falls within [startOfDay, endOfDay].

        activityData.push({
            day: dayName,
            applications: applicationCount,
            leetcode: leetcodeCount
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
