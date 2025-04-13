import express from 'express';
import { registerUser, loginUser, logoutUser, getUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/user', authMiddleware, getUser);

export default router;