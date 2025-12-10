import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not found' });
        }

        const recipes = await prisma.recipe.findMany({
            where: { userId },
            include: { ingredients: true },
        });
        res.json(recipes);
    } catch (error) {
        next(error);
    }
};

export const createRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { title, image, prepTime, servings, tags, steps, origin, ingredients } = req.body;
        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;

        if (req.file) {
            image = `/uploads/recipes/${req.file.filename}`;
        }

        // Parse JSON fields if they come as strings (multipart/form-data)
        if (typeof tags === 'string') tags = JSON.parse(tags);
        if (typeof steps === 'string') steps = JSON.parse(steps);
        if (typeof ingredients === 'string') ingredients = JSON.parse(ingredients);

        if (!userId) {
            return res.status(401).json({ message: 'User not found' });
        }

        const recipe = await prisma.recipe.create({
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
                    create: ingredients?.map((ing: any) => ({
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
    } catch (error) {
        next(error);
    }
};

export const getRecipeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const recipe = await prisma.recipe.findUnique({
            where: { id },
            include: { ingredients: true }
        });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        next(error);
    }
}

export const deleteRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.recipe.delete({ where: { id } });
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        next(error);
    }
}

export const updateRecipe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        let { title, image, prepTime, servings, tags, steps, origin, ingredients } = req.body;

        const authReq = req as AuthRequest;
        const userId = authReq.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (req.file) {
            image = `/uploads/recipes/${req.file.filename}`;
        }

        // Parse JSON fields if they come as strings
        try {
            if (typeof tags === 'string') tags = JSON.parse(tags);
            if (typeof steps === 'string') steps = JSON.parse(steps);
            if (typeof ingredients === 'string') ingredients = JSON.parse(ingredients);
        } catch (e) {
            console.error("JSON Parse error", e);
            return res.status(400).json({ message: "Invalid JSON format for tags, steps or ingredients" });
        }


        const data: any = {
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
                create: ingredients.map((ing: any) => ({
                    name: ing.name,
                    quantity: Number(ing.quantity),
                    unit: ing.unit,
                    category: ing.category,
                }))
            };
        }

        const recipe = await prisma.recipe.update({
            where: { id },
            data,
            include: { ingredients: true }
        });

        res.json(recipe);
    } catch (error) {
        next(error);
    }
};
