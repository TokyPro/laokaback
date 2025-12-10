"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCheckedItems = exports.deleteItem = exports.toggleItem = exports.addItem = exports.getShoppingList = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getShoppingList = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        // 1. Get manual items
        const manualItems = await prisma_1.default.shoppingItem.findMany({
            where: { userId },
        });
        // 2. Get ingredients from future meal plans (simplification: next 7 days or all future)
        // For now, let's just return manual items + optional aggregated ingredients
        // A more advanced implementation would aggregate ingredients from 'mealPlans' within a date range
        // Returning just the stored items for now as per "Approche recommandée (Simplifiée)" in CDC
        // But CDC also mentions "Approche recommandée (Robuste)"
        // Let's implement the simplified one first (stored items)
        res.json(manualItems);
    }
    catch (error) {
        next(error);
    }
};
exports.getShoppingList = getShoppingList;
const addItem = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const { name, quantity, unit, category } = req.body;
        const item = await prisma_1.default.shoppingItem.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.addItem = addItem;
const toggleItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await prisma_1.default.shoppingItem.findUnique({ where: { id } });
        if (!item)
            return res.status(404).json({ message: 'Item not found' });
        const updated = await prisma_1.default.shoppingItem.update({
            where: { id },
            data: { checked: !item.checked }
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
exports.toggleItem = toggleItem;
const deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.default.shoppingItem.delete({ where: { id } });
        res.json({ message: 'Item deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteItem = deleteItem;
const deleteCheckedItems = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        await prisma_1.default.shoppingItem.deleteMany({
            where: {
                userId,
                checked: true
            }
        });
        res.json({ message: 'Checked items deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCheckedItems = deleteCheckedItems;
