import { Router } from 'express';
import { getMealPlan, upsertMealPlan, deleteMealPlan, clearPlanner } from '../controllers/plannerController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getMealPlan);
router.post('/', upsertMealPlan);
router.delete('/clear', clearPlanner); // Specific route before Generic :id
router.delete('/:id', deleteMealPlan);

export default router;
