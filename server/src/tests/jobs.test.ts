import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('Jobs Module', () => {
    let token: string;
    const userId = 'user-123';

    beforeAll(() => {
        // Mock token generation for valid user
        token = jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecret_jwt_key_development_only');
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockJob = {
        id: 'job-1',
        user_id: userId,
        company_name: 'Tech Corp',
        role: 'Backend Engineer',
        job_type: 'Full-time',
        location: 'Remote',
        status: 'Applied',
        applied_date: new Date(),
        source: 'LinkedIn',
        notes: null,
        created_at: new Date(),
    };

    describe('POST /api/jobs', () => {
        it('should create a new job application', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);
            prismaMock.jobApplication.create.mockResolvedValue(mockJob);

            const res = await request(app)
                .post('/api/jobs')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    company_name: 'Tech Corp',
                    role: 'Backend Engineer',
                    job_type: 'Full-time',
                    location: 'Remote',
                    status: 'Applied',
                    applied_date: '2023-10-01',
                    source: 'LinkedIn'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 'job-1');
            expect(prismaMock.jobApplication.create).toHaveBeenCalled();
        });

        it('should return 401 without token', async () => {
            const res = await request(app).post('/api/jobs').send({});
            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/jobs', () => {
        it('should return list of jobs for user', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);
            prismaMock.jobApplication.findMany.mockResolvedValue([mockJob]);

            const res = await request(app)
                .get('/api/jobs')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body).toHaveLength(1);
        });
    });
});
