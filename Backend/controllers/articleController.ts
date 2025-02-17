import { Request, Response } from 'express';
import articleModel from '../models/articleModel';
import { getSignedUrl, uploadToS3 } from 'config/s3';
import {  ArticleResponse } from '../types/articleTypes';
import userModel from '@models/userModel';
import { sendResponse } from 'utils/formatResponse';
import { ResponseMessage } from 'utils/messages';
import { sendErrorResponse } from 'utils/errorResponse';

// CreateArticle:
export const createArticle = async (req:Request, res:Response) : Promise<void> => {
    try {
        const { id } = req.params;
        const { title, category, content } = req.body;
        const coverImage = req.file ? req.file : null;

        if(coverImage) {
            const bucketName = process.env.S3_BUCKET_NAME as string;
            const imageKey = `articles/${Date.now()}_${coverImage.originalname}`;
    
            await uploadToS3(coverImage, bucketName, imageKey);
        

            const newArticle = new articleModel({
                user: id,
                title,
                category,
                content,
                coverImage: imageKey,
            })

            await newArticle.save()
            sendResponse(res, 201, ResponseMessage.ARTICLE_CREATED_SUCCESSFULLY)
        }
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}


// Fetch Article:
export const getArticles = async (req: Request, res:Response) : Promise<void> => {
    try {
        const bucketName = process.env.S3_BUCKET_NAME as string;
        const { category } = req.params;

        let filter = {};

        if(category) {
            filter={category}
        }

        //Populate Author
        const articles = await articleModel.find(filter)
            .populate('user', 'firstName lastName')
            .sort({createdAt: -1})
            .lean()

        // Get signed URLs for all cover images
        const articlesWithUrls = await Promise.all(
            articles.map(async (articles: ArticleResponse) => {
                if(articles.coverImage) {
                    const signedUrl = await getSignedUrl(
                        bucketName,
                        articles.coverImage,
                        3600
                    );
                    return {...articles, coverImageUrl: signedUrl}
                }
                return articles;
            })
        );
        res.status(200).json(articlesWithUrls)

    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

//HandleLikeArticle:
export const likeArticle = async (req: Request, res:Response) : Promise<void> => {
    try {
        const { articleId } = req.params;
        const { userId, isLiked } = req.body;

        if(!userId) {
            sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND);
            return;
        }

        if(!articleId) {
            sendErrorResponse(res, 404, ResponseMessage.ARTICLE_NOT_FOUND)
        }

        const article = await articleModel.findById(articleId);
        if(!article) {
            sendErrorResponse(res, 404, ResponseMessage.ARTICLE_NOT_FOUND)
            return;
        }

        //Check if user already liked
        const existingLike = article?.likes?.find((like) => like.user.toString() ===  userId)

        if(isLiked) {
            if(!existingLike) {
                article?.likes?.push({user: userId, isLiked: true});
                article.totalLikes = (article.totalLikes ?? 0) + 1;
            }
        } else {
            if (existingLike) {
                article.likes = article?.likes?.filter((like) => like.user.toString() !== userId); //removed matched userId
                article.totalLikes = Math.max(0, article?.totalLikes! - 1);
            }   
        }

        await article.save()

    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Server Error", error: err.message }); 
    }
}

export const getUserArticle = async(req:Request, res:Response) : Promise<void> => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        const bucketName = process.env.S3_BUCKET_NAME as string;

        if(!user) {
            sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND);
            return;
        }

        const articles = await articleModel.find({user: user._id}).sort({createdAt: -1}).lean();

        const articlesWithUrls = await Promise.all(
            articles.map(async (articles: ArticleResponse) => {
                if(articles.coverImage) {
                    const signedUrl = await getSignedUrl(
                        bucketName,
                        articles.coverImage,
                        3600
                    );

                    return {...articles, coverImageUrl: signedUrl}
                };

                return articles;
            })
        )

        sendResponse(res, 200, ResponseMessage.ARTICLE_LISTED_SUCCESSFULLY, articlesWithUrls)
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}


export const removeArticle = async(req:Request, res:Response) : Promise<void> => {
    try {
        const { articleId } = req.params;    
        const article = await articleModel.findByIdAndDelete(articleId);
        if(!article) {
            sendErrorResponse(res, 404, ResponseMessage.ARTICLE_NOT_FOUND)
            return;
        }
        sendResponse(res, 200, ResponseMessage.ARTICLE_REMOVED)
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}