import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController';
import { updateProfile } from '../controllers/profileController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id', updateProfile);
router.post('/logout', logoutUser)

export default router;