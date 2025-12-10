import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getShoppingList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // 1. Get manual items
        const manualItems = await prisma.shoppingItem.findMany({
            where: { userId },
        });

        // 2. Get ingredients from future meal plans (simplification: next 7 days or all future)
        // For now, let's just return manual items + optional aggregated ingredients
        // A more advanced implementation would aggregate ingredients from 'mealPlans' within a date range

        // Returning just the stored items for now as per "Approche recommandée (Simplifiée)" in CDC
        // But CDC also mentions "Approche recommandée (Robuste)"
        // Let's implement the simplified one first (stored items)

        res.json(manualItems);
    } catch (error) {
        next(error);
    }
};

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { name, quantity, unit, category } = req.body;
        const item = await prisma.shoppingItem.create({
            data: {
                userId,
                name,
                quantity: Number(quantity),
                unit,
                category,
                isManual: true
            }
        });
        res.status(201).json(item);
    } catch (error) {
        next(error);
    }
};

export const toggleItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const item = await prisma.shoppingItem.findUnique({ where: { id } });
        if (!item) return res.status(404).json({ message: 'Item not found' });

        const updated = await prisma.shoppingItem.update({
            where: { id },
            data: { checked: !item.checked }
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.shoppingItem.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    } catch (error) {
        next(error);
    }
};

export const deleteCheckedItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        await prisma.shoppingItem.deleteMany({
            where: {
                userId,
                checked: true
            }
        });
        res.json({ message: 'Checked items deleted' });
    } catch (error) {
        next(error);
    }
};
