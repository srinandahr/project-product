import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('Daily Check-ins Module', () => {
    let token: string;
    const userId = 'user-123';

    beforeAll(() => {
        token = jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecret_jwt_key_development_only');
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockCheckin = {
        id: 'checkin-1',
        user_id: userId,
        date: new Date(),
        applied_jobs: true,
        practiced_dsa: true,
        worked_on_project: false,
        resume_updated: false,
        notes: null
    };

    describe('POST /api/checkins', () => {
        it('should create checkin', async () => {
            prismaMock.dailyCheckin.create.mockResolvedValue(mockCheckin);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .post('/api/checkins')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    applied_jobs: true,
                    practiced_dsa: true
                });

            expect(res.status).toBe(201);
            expect(res.body.applied_jobs).toBe(true);
        });
    });

    describe('GET /api/checkins/today', () => {
        it('should return today checkin', async () => {
            prismaMock.dailyCheckin.findFirst.mockResolvedValue(mockCheckin);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .get('/api/checkins/today')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.id).toBe('checkin-1');
        });
    });
});
