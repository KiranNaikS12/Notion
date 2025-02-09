import { Request, Response } from 'express';
import articleModel from '../models/articleModel';
import { getSignedUrl, uploadToS3 } from 'config/s3';
import {  ArticleResponse } from '../types/articleTypes';



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
            res.status(201).json({message: "Article created successfully"})
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
            res.status(404).json({message: 'User Not Found'});
            return;
        }

        if(!articleId) {
            res.status(404).json({message: 'Article Not Found'});
        }

        const article = await articleModel.findById(articleId);
        if(!article) {
            res.status(404).json({message: 'Article Not Found'});
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