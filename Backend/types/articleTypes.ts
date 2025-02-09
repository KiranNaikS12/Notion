import mongoose from "mongoose";


export interface IArticle {
    user: mongoose.Types.ObjectId,
    title: string;
    category: string;
    coverImage: string;
    content: any;
    likes?: {
        user: mongoose.Types.ObjectId;
        isLiked: boolean;
    }[];
    totalLikes?: number;
}

export interface ArticleResponse {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    title: string;
    category: string;
    content: string;
    coverImage: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: {
        user: mongoose.Types.ObjectId;
        isLiked: boolean;
    }[];
    totalLikes?: number;
}