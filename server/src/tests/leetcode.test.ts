import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('LeetCode Module', () => {
    let token: string;
    const userId = 'user-123';

    beforeAll(() => {
        token = jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecret_jwt_key_development_only');
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockProfile = {
        id: 'lc-1',
        user_id: userId,
        username: 'coder123',
        total_solved: 100,
        easy_solved: 50,
        medium_solved: 40,
        hard_solved: 10,
        ranking: 1000,
        last_synced_at: new Date(),
    };

    describe('POST /api/leetcode/connect', () => {
        it('should connect profile', async () => {
            prismaMock.leetCodeProfile.upsert.mockResolvedValue(mockProfile);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .post('/api/leetcode/connect')
                .set('Authorization', `Bearer ${token}`)
                .send({ username: 'coder123' });

            expect(res.status).toBe(200);
            expect(res.body.username).toBe('coder123');
        });
    });

    describe('POST /api/leetcode/sync', () => {
        it('should update stats', async () => {
            prismaMock.leetCodeProfile.update.mockResolvedValue({ ...mockProfile, total_solved: 105 });
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .post('/api/leetcode/sync')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    total_solved: 105,
                    easy_solved: 50,
                    medium_solved: 40,
                    hard_solved: 15,
                    ranking: 999
                });

            expect(res.status).toBe(200);
            expect(res.body.total_solved).toBe(105);
        });
    });
});
