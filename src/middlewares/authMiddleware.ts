import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string | null;
    } | null;
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    const authReq = req as AuthRequest;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded: any = verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        authReq.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
