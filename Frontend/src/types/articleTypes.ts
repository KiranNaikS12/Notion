export interface IArticle {
    _id: string;
    title: string;
    category: string;
    content: string;
    coverImageUrl: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    likes?: {
        user: string;
        isLiked: boolean;
    }[];
    totalLikes?: number;
    createdAt?: string;
    updatedAt?:string;
}