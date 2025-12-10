import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        const token = signToken({ id: user.id });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ id: user.id });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.user is populated by protect middleware
        const authReq = req as any; // Cast to avoid typescript complaining if AuthRequest isn't exported perfectly
        if (!authReq.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch fresh user data including profile fields
        const user = await prisma.user.findUnique({
            where: { id: authReq.user.id },
            select: { id: true, email: true, name: true, createdAt: true }
        });

        res.json(user);
    } catch (error) {
        next(error);
    }
};
