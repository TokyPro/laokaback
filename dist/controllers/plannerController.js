"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearPlanner = exports.deleteMealPlan = exports.upsertMealPlan = exports.getMealPlan = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getMealPlan = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        const { startDate, endDate } = req.query;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        // Basic filter by date range if provided
        const whereClause = { userId };
        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        const plans = await prisma_1.default.mealPlan.findMany({
            where: whereClause,
            include: { recipe: true },
        });
        res.json(plans);
    }
    catch (error) {
        next(error);
    }
};
exports.getMealPlan = getMealPlan;
const upsertMealPlan = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        // Debug log
        console.log('Upsert Plan Body:', req.body);
        // Handle array input from frontend
        const bodyData = Array.isArray(req.body) ? req.body[0] : req.body;
        const { date, type, recipeId, note } = bodyData;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
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
        const mealPlan = await prisma_1.default.mealPlan.upsert({
            where: {
                userId_date_type: {
                    userId: userId,
                    date: parsedDate,
                    type,
                },
            },
            update: {
                recipeId: recipeId || null,
                note: note || null,
            },
            create: {
                userId: userId,
                date: parsedDate,
                type,
                recipeId: recipeId || null,
                note: note || null,
            },
        });
        res.json(mealPlan);
    }
    catch (error) {
        console.error("Upsert Meal Plan Error:", error);
        next(error);
    }
};
exports.upsertMealPlan = upsertMealPlan;
const deleteMealPlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.default.mealPlan.delete({ where: { id } });
        res.json({ message: 'Meal plan removed' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMealPlan = deleteMealPlan;
const clearPlanner = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { startDate, endDate } = req.query;
        const whereClause = { userId };
        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }
        await prisma_1.default.mealPlan.deleteMany({
            where: whereClause
        });
        res.json({ message: 'Meal plans cleared' });
    }
    catch (error) {
        next(error);
    }
};
exports.clearPlanner = clearPlanner;
