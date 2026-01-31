import prisma from '../../config/db';

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

    return {
        jobStats,
        leetcode: {
            totalSolved: leetcodeProfile?.total_solved || 0,
            streak: 0, // Mock or fetch from LeetCode
        },
        projects: projectStats,
    };
};
