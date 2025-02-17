import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController';
import { updateProfile } from '../controllers/profileController';
import upload from 'config/multerConfig';
import { createArticle, getArticles, getUserArticle, likeArticle, removeArticle } from '../controllers/articleController';


const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id',upload.single('profileImage'), updateProfile);
router.post('/logout', logoutUser);
router.post('/upload/:id', upload.single('coverImage'), createArticle);
router.get('/articles', getArticles);
router.get('/articles/category/:category', getArticles);
router.post('/heart/:articleId', likeArticle);
router.get('/my-article/:id', getUserArticle);
router.delete('/remove/:articleId', removeArticle)


export default router;