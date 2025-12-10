import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getMealPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        const { startDate, endDate } = req.query;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // Basic filter by date range if provided
        const whereClause: any = { userId };
        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            };
        }

        const plans = await prisma.mealPlan.findMany({
            where: whereClause,
            include: { recipe: true },
        });
        res.json(plans);
    } catch (error) {
        next(error);
    }
};

export const upsertMealPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        // Debug log
        console.log('Upsert Plan Body:', req.body);

        // Handle array input from frontend
        const bodyData = Array.isArray(req.body) ? req.body[0] : req.body;
        const { date, type, recipeId, note } = bodyData;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: `Invalid date format. Received: ${date}` });
        }

        if (!type) {
            return res.status(400).json({ message: 'Type is required' });
        }

        // Compound unique key: userId_date_type
        const mealPlan = await prisma.mealPlan.upsert({
            where: {
                userId_date_type: {
                    userId: userId as string,
                    date: parsedDate,
                    type,
                },
            },
            update: {
                recipeId: recipeId || null,
                note: note || null,
            },
            create: {
                userId: userId as string,
                date: parsedDate,
                type,
                recipeId: recipeId || null,
                note: note || null,
            },
        });

        res.json(mealPlan);
    } catch (error) {
        console.error("Upsert Meal Plan Error:", error);
        next(error);
    }
};

export const deleteMealPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.mealPlan.delete({ where: { id } });
        res.json({ message: 'Meal plan removed' });
    } catch (error) {
        next(error);
    }
};

export const clearPlanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { startDate, endDate } = req.query;
        const whereClause: any = { userId };

        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string),
            };
        }

        await prisma.mealPlan.deleteMany({
            where: whereClause
        });

        res.json({ message: 'Meal plans cleared' });
    } catch (error) {
        next(error);
    }
};
