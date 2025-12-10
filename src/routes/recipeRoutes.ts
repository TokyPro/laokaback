import { Router } from 'express';
import { getRecipes, createRecipe, getRecipeById, deleteRecipe, updateRecipe } from '../controllers/recipeController';
import { protect } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(protect);

router.get('/', getRecipes);
router.post('/', upload.single('image'), createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', upload.single('image'), updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
