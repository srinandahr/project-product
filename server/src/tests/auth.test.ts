import request from 'supertest';
import { prismaMock } from './helpers/singleton';
import app from '../app';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth Module', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                password_hash: 'hashedpassword',
                created_at: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue(mockUser);

            const res = await request(app).post('/api/auth/register').send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('id', 'user-123');
            expect(prismaMock.user.create).toHaveBeenCalled();
        });

        it('should fail if user already exists', async () => {
            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                password_hash: 'hashedpassword',
                created_at: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const res = await request(app).post('/api/auth/register').send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('User already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                password_hash: hashedPassword,
                created_at: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const res = await request(app).post('/api/auth/login').send({
                email: 'john@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should fail with invalid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const mockUser = {
                id: 'user-123',
                name: 'John Doe',
                email: 'john@example.com',
                password_hash: hashedPassword,
                created_at: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const res = await request(app).post('/api/auth/login').send({
                email: 'john@example.com',
                password: 'wrongpassword',
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Invalid credentials');
        });
    });
});
