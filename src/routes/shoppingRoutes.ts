import { Router } from 'express';
import { getShoppingList, addItem, toggleItem, deleteItem, deleteCheckedItems } from '../controllers/shoppingController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getShoppingList);
router.post('/', addItem);
router.delete('/checked', deleteCheckedItems); // Specific route before Generic :id
router.patch('/:id/toggle', toggleItem);
router.delete('/:id', deleteItem);

export default router;
