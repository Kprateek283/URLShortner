import express from 'express';
import { shortenUrl, deleteUrl, getUserUrls } from '../controllers/urlController.js';
import authMiddleware from '../middleware/auth.js';
import logClickMiddleware from '../middleware/logClick.js';
import { getClickInfo, redirectToOriginal } from '../controllers/clickController.js';

const router = express.Router();

router.post('/shorten', authMiddleware, shortenUrl);
router.get('/:shortId', logClickMiddleware, redirectToOriginal);
router.delete('/:shortId', authMiddleware, deleteUrl);
router.get('/user/urls', authMiddleware, getUserUrls);
router.get('/click/:shortId', authMiddleware, getClickInfo);

export default router;