"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRecipe = exports.deleteRecipe = exports.getRecipeById = exports.createRecipe = exports.getRecipes = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getRecipes = async (req, res, next) => {
    try {
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not found' });
        }
        const recipes = await prisma_1.default.recipe.findMany({
            where: { userId },
            include: { ingredients: true },
        });
        res.json(recipes);
    }
    catch (error) {
        next(error);
    }
};
exports.getRecipes = getRecipes;
const createRecipe = async (req, res, next) => {
    try {
        let { title, image, prepTime, servings, tags, steps, origin, ingredients } = req.body;
        const authReq = req;
        const userId = authReq.user?.id;
        if (req.file) {
            image = `/uploads/recipes/${req.file.filename}`;
        }
        // Parse JSON fields if they come as strings (multipart/form-data)
        if (typeof tags === 'string')
            tags = JSON.parse(tags);
        if (typeof steps === 'string')
            steps = JSON.parse(steps);
        if (typeof ingredients === 'string')
            ingredients = JSON.parse(ingredients);
        if (!userId) {
            return res.status(401).json({ message: 'User not found' });
        }
        const recipe = await prisma_1.default.recipe.create({
            data: {
                title,
                image,
                prepTime: Number(prepTime),
                servings: Number(servings),
                tags,
                steps,
                origin,
                userId,
                ingredients: {
                    create: ingredients?.map((ing) => ({
                        name: ing.name,
                        quantity: Number(ing.quantity),
                        unit: ing.unit,
                        category: ing.category,
                    })) || [],
                },
            },
            include: { ingredients: true },
        });
        res.status(201).json(recipe);
    }
    catch (error) {
        next(error);
    }
};
exports.createRecipe = createRecipe;
const getRecipeById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const recipe = await prisma_1.default.recipe.findUnique({
            where: { id },
            include: { ingredients: true }
        });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    }
    catch (error) {
        next(error);
    }
};
exports.getRecipeById = getRecipeById;
const deleteRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma_1.default.recipe.delete({ where: { id } });
        res.json({ message: 'Recipe deleted' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRecipe = deleteRecipe;
const updateRecipe = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { title, image, prepTime, servings, tags, steps, origin, ingredients } = req.body;
        const authReq = req;
        const userId = authReq.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (req.file) {
            image = `/uploads/recipes/${req.file.filename}`;
        }
        // Parse JSON fields if they come as strings
        try {
            if (typeof tags === 'string')
                tags = JSON.parse(tags);
            if (typeof steps === 'string')
                steps = JSON.parse(steps);
            if (typeof ingredients === 'string')
                ingredients = JSON.parse(ingredients);
        }
        catch (e) {
            console.error("JSON Parse error", e);
            return res.status(400).json({ message: "Invalid JSON format for tags, steps or ingredients" });
        }
        const data = {
            title,
            image,
            prepTime: prepTime ? Number(prepTime) : undefined,
            servings: servings ? Number(servings) : undefined,
            tags,
            steps,
            origin
        };
        // Remove undefined fields
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
        if (ingredients) {
            data.ingredients = {
                deleteMany: {},
                create: ingredients.map((ing) => ({
                    name: ing.name,
                    quantity: Number(ing.quantity),
                    unit: ing.unit,
                    category: ing.category,
                }))
            };
        }
        const recipe = await prisma_1.default.recipe.update({
            where: { id },
            data,
            include: { ingredients: true }
        });
        res.json(recipe);
    }
    catch (error) {
        next(error);
    }
};
exports.updateRecipe = updateRecipe;
