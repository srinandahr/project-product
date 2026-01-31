import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import jwt from 'jsonwebtoken';

describe('Projects Module', () => {
    let token: string;
    const userId = 'user-123';

    beforeAll(() => {
        token = jwt.sign({ userId }, process.env.JWT_SECRET || 'supersecret_jwt_key_development_only');
    });

    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockProject = {
        id: 'project-1',
        user_id: userId,
        title: 'Awesome App',
        description: 'A great app',
        tech_stack: ['Node', 'React'],
        repo_url: 'http://github.com/user/repo',
        live_url: 'http://example.com',
        status: 'In Progress',
        start_date: new Date(),
        end_date: null,
    };

    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            prismaMock.project.create.mockResolvedValue(mockProject);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'Awesome App',
                    description: 'A great app',
                    tech_stack: ['Node', 'React'],
                    status: 'In Progress'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id', 'project-1');
        });
    });

    describe('GET /api/projects', () => {
        it('should return projects', async () => {
            prismaMock.project.findMany.mockResolvedValue([mockProject]);
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .get('/api/projects')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe('PATCH /api/projects/:id', () => {
        it('should update project', async () => {
            prismaMock.project.updateMany.mockResolvedValue({ count: 1 });
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .patch('/api/projects/project-1')
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'Completed' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Project updated');
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('should delete project', async () => {
            prismaMock.project.deleteMany.mockResolvedValue({ count: 1 });
            prismaMock.user.findUnique.mockResolvedValue({ id: userId } as any);

            const res = await request(app)
                .delete('/api/projects/project-1')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Project deleted');
        });
    });
});
