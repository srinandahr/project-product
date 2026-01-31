import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('Dashboard Module', () => {
    let token: string;
    const userId = 'user-123';

    beforeAll(() => {
        token = jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecret_jwt_key_development_only');
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('GET /api/dashboard/overview', () => {
        it('should return aggregated stats', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            // Mock Job Stats
            prismaMock.jobApplication.groupBy.mockResolvedValue([
                { status: 'Applied', _count: { status: 5 } },
                { status: 'Offer', _count: { status: 1 } }
            ] as any);

            // Mock LeetCode
            prismaMock.leetCodeProfile.findUnique.mockResolvedValue({
                total_solved: 50
            } as any);

            // Mock Projects
            prismaMock.project.groupBy.mockResolvedValue([
                { status: 'Completed', _count: { status: 2 } }
            ] as any);

            const res = await request(app)
                .get('/api/dashboard/overview')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.jobStats.applied).toBe(5);
            expect(res.body.jobStats.offers).toBe(1);
            expect(res.body.leetcode.totalSolved).toBe(50);
            expect(res.body.projects.completed).toBe(2);
        });
    });
});
