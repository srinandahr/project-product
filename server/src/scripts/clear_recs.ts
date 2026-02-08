import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const clearRecs = async () => {
    try {
        console.log('Clearing all recommended jobs...');
        const { count } = await prisma.recommendedJob.deleteMany({});
        console.log(`Deleted ${count} recommendations.`);
    } catch (e) {
        console.error('Error clearing recs:', e);
    } finally {
        await prisma.$disconnect();
    }
};

clearRecs();
