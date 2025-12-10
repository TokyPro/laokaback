"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.protect);
router.post('/', uploadMiddleware_1.upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/recipes/${req.file.filename}`;
    res.json({ url: fileUrl });
});
exports.default = router;
