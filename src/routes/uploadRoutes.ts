import { Router } from 'express';
import { upload } from '../middlewares/uploadMiddleware';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/recipes/${req.file.filename}`;
    res.json({ url: fileUrl });
});

export default router;
