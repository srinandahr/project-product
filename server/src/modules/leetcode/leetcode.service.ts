import prisma from '../../config/db';

interface LeetCodeData {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    recentSubmissions: Array<{
        title: string;
        titleSlug: string;
        timestamp: string;
        statusDetails?: string;
    }>;
    streak: number;
}

export const fetchLeetCodeStats = async (username: string): Promise<LeetCodeData> => {
    const query = `
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            submitStats: submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
            submissionCalendar
            profile {
                ranking
            }
        }
        recentAcSubmissionList(username: $username, limit: 5) {
            title
            titleSlug
            timestamp
        }
    }`;

    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify({
            query,
            variables: { username }
        })
    });

    if (!response.ok) throw new Error('Failed to fetch from LeetCode');

    const data = await response.json();

    if (data.errors) throw new Error(data.errors[0].message);
    if (!data.data.matchedUser) throw new Error('User not found');

    const stats = data.data.matchedUser.submitStats.acSubmissionNum;
    const profile = data.data.matchedUser.profile;
    const recent = data.data.recentAcSubmissionList;

    let streak = 0;
    try {
        // submissionCalendar is a JSON string of timestamp -> count
        const calendar = JSON.parse(data.data.matchedUser.submissionCalendar || '{}');
        const timestamps = Object.keys(calendar).map(Number).sort((a, b) => b - a);

        if (timestamps.length > 0) {
            // Count backwards from today
            // Normalize to days (seconds / 86400)
            const toDay = (ts: number) => Math.floor(ts / 86400);
            // Current day (LeetCode seems to use UTC seconds for submissionCalendar keys)
            const today = toDay(Math.floor(Date.now() / 1000));
            const uniqueDays = new Set(timestamps.map(ts => toDay(ts)));

            let currentDay = today;

            // Check if user has submitted today?
            // If strictly today is missing, check yesterday (streak might still be alive)
            if (!uniqueDays.has(currentDay)) {
                currentDay--;
                // If yesterday is also missing, streak is 0
                if (!uniqueDays.has(currentDay)) {
                    streak = 0;
                } else {
                    // Streak alive from yesterday
                    while (uniqueDays.has(currentDay)) {
                        streak++;
                        currentDay--;
                    }
                }
            } else {
                // Submitted today, count backwards
                while (uniqueDays.has(currentDay)) {
                    streak++;
                    currentDay--;
                }
            }
        }
    } catch (e) {
        console.error('Failed to calculate streak', e);
    }

    const result = {
        totalSolved: stats.find((s: any) => s.difficulty === 'All')?.count || 0,
        easySolved: stats.find((s: any) => s.difficulty === 'Easy')?.count || 0,
        mediumSolved: stats.find((s: any) => s.difficulty === 'Medium')?.count || 0,
        hardSolved: stats.find((s: any) => s.difficulty === 'Hard')?.count || 0,
        ranking: profile?.ranking || 0,
        streak,
        recentSubmissions: recent
    };

    // Save to Database if userId is provided (we'll modify signature to accept userId optional, 
    // or just assume we always want to save if we can. 
    // Wait, the signature of this function is `(username: string)`.
    // I need to change it to `(username: string, userId?: string)`.

    return result;
};

export const upsertLeetCodeProfile = async (userId: string, username: string, data: LeetCodeData) => {
    await prisma.leetCodeProfile.upsert({
        where: { user_id: userId },
        update: {
            username,
            total_solved: data.totalSolved,
            easy_solved: data.easySolved,
            medium_solved: data.mediumSolved,
            hard_solved: data.hardSolved,
            ranking: data.ranking,
            last_synced_at: new Date(),
        },
        create: {
            user_id: userId,
            username,
            total_solved: data.totalSolved,
            easy_solved: data.easySolved,
            medium_solved: data.mediumSolved,
            hard_solved: data.hardSolved,
            ranking: data.ranking,
        },
    });
};
