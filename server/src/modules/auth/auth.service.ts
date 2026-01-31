import prisma from '../../config/db';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const registerUser = async (data: unknown) => {
    const { name, email, password } = registerSchema.parse(data);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password_hash: hashedPassword,
        },
    });

    const token = generateToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};

export const loginUser = async (data: unknown) => {
    const { email, password } = loginSchema.parse(data);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
};
