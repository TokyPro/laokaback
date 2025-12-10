"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shoppingController_1 = require("../controllers/shoppingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.get('/', shoppingController_1.getShoppingList);
router.post('/', shoppingController_1.addItem);
router.delete('/checked', shoppingController_1.deleteCheckedItems); // Specific route before Generic :id
router.patch('/:id/toggle', shoppingController_1.toggleItem);
router.delete('/:id', shoppingController_1.deleteItem);
exports.default = router;
