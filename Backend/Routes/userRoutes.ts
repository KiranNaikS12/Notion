import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/authController';
import { updateProfile } from '../controllers/profileController';
import upload from 'config/multerConfig';
import { createArticle, getArticleById, getArticles, getUserArticle, likeArticle, removeArticle, updateArticle } from '../controllers/articleController';


const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id',upload.single('profileImage'), updateProfile);
router.post('/logout', logoutUser);
router.post('/upload/:id', upload.single('coverImage'), createArticle);
router.get('/articles/:id', getArticles);
router.get('/articles/category/:category', getArticles);
router.post('/heart/:articleId', likeArticle);
router.get('/my-article/:id', getUserArticle);
router.delete('/remove/:articleId', removeArticle);
router.get('/article/:id', getArticleById);
router.put('/article/:id',upload.single('coverImage'), updateArticle)


export default router;