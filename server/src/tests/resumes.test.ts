import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('Resumes Module', () => {
    let token: string;
    const userId = 'user-123';

    beforeAll(() => {
        token = jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecret_jwt_key_development_only');
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockResume = {
        id: 'resume-1',
        user_id: userId,
        title: 'Backend Resume',
        file_url: 'https://s3.aws.com/resume.pdf',
        tags: ['Backend', 'Node'],
        is_active: true,
        created_at: new Date(),
    };

    describe('POST /api/resumes', () => {
        it('should create resume metadata', async () => {
            prismaMock.resume.create.mockResolvedValue(mockResume);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .post('/api/resumes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Backend Resume',
                    file_url: 'https://s3.aws.com/resume.pdf',
                    tags: ['Backend', 'Node']
                });

            expect(res.status).toBe(201);
            expect(res.body.title).toBe('Backend Resume');
        });
    });

    describe('GET /api/resumes', () => {
        it('should list resumes', async () => {
            prismaMock.resume.findMany.mockResolvedValue([mockResume]);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .get('/api/resumes')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });
});
