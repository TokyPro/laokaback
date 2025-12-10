"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plannerController_1 = require("../controllers/plannerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.get('/', plannerController_1.getMealPlan);
router.post('/', plannerController_1.upsertMealPlan);
router.delete('/clear', plannerController_1.clearPlanner); // Specific route before Generic :id
router.delete('/:id', plannerController_1.deleteMealPlan);
exports.default = router;
