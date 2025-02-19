import React, { useEffect, useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { Button, Image } from '@heroui/react';
import { IArticle } from '../types/articleTypes';
import RenderContent from './RenderContent';
import ViewArticle from './ViewArticle';
import { handleApiError } from '../types/APIResponse';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { baseUrl } from '../utils/baseUrl';


export interface ArticleProps {
    data: IArticle[];
    userId: string | undefined;
    onArticleRemove?: (articleId: string) => Promise<void>;
}

const ArticleCard: React.FC<ArticleProps> = ({ data, userId, onArticleRemove }) => {
    const [articles, setArticles] = useState<IArticle[]>(data);
    const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
    const [likedArticles, setLikedArticles] = useState<{ [key: string]: boolean }>({}); //tracking like state for each articleId
    const location = useLocation();

    useEffect(() => {
        setArticles(data)
    }, [data])

    useEffect(() => {
        if (!userId) return;

        const storedLikes = localStorage.getItem(`likedArticles_${userId}`);
        if (storedLikes) {
            setLikedArticles(JSON.parse(storedLikes));
        }

    }, [userId])

    const hanldeArticleLike = async (articleId: string) => {
        try {
            const isCurrentlyLiked = likedArticles[articleId];
            setLikedArticles((prev) => ({
                ...prev,
                [articleId]: !prev[articleId]
            }));

            // Update the likes count in the articles state
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article._id === articleId
                        ? {
                            ...article,
                            totalLikes: isCurrentlyLiked
                                ? article.totalLikes! - 1
                                : article.totalLikes! + 1
                        }
                        : article
                )
            );

            localStorage.setItem(
                `likedArticles_${userId}`,
                JSON.stringify({ ...likedArticles, [articleId]: !isCurrentlyLiked })
            );

            const response = await axios.post(`${baseUrl}heart/${articleId}`, {
                userId,
                isLiked: !likedArticles[articleId]
            });

            if (response) {
                alert("You Liked the article");
            }
        } catch (error) {
            handleApiError(error)
            setLikedArticles((prev) => ({
                ...prev,
                [articleId]: prev[articleId]
            }));

            // Revert the likes count
            setArticles(prevArticles => 
                prevArticles.map(article => 
                    article._id === articleId 
                        ? {
                            ...article,
                            totalLikes: likedArticles[articleId] 
                                ? article.totalLikes! + 1 
                                : article.totalLikes! - 1
                        }
                        : article
                )
            );
        }
    }


    const handleRemoveArticle = async (articleId: string) => {
        if (!onArticleRemove) return;
        try {
            await onArticleRemove(articleId);
        } catch (error) {
            handleApiError(error);
        }
    }

    const isMyArticlePage = location.pathname === '/articles';

    return (
        <div className='flex flex-col mb-10 space-y-4'>
            {articles.map((article) => (
                <div key={article._id} className="flex flex-col w-[850px] gap-4 p-4 transition-colors duration-300 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 hover:border-blue-500">
                    {/* Author Section */}
                    {!isMyArticlePage && (
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">Creator: </span>
                            <span className="text-gray-600">{article.user.firstName} <span>{article.user.lastName}</span></span>
                        </div>
                    )}
                    {/* Content Section */}
                    <div className="flex flex-col gap-6">
                        <div className='flex'>
                            <div className="flex flex-col gap-2">
                                <h2 onClick={() => setSelectedArticle(article)} className="text-2xl font-bold text-gray-900 hover:text-blue-500">
                                    {article.title}
                                </h2>
                                <p className="mt-3 text-gray-600 line-clamp-3">
                                    <RenderContent
                                        content={article.content}
                                        className='line-clamp-2'
                                    />
                                </p>

                                {/* Metadata Section */}
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-gray-500">{article.createdAt ? new Date(article.createdAt).toISOString().split("T")[0] : "N/A"}</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-gray-500">{article.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <motion.span
                                            className="text-gray-500 cursor-pointer"
                                            onClick={() => hanldeArticleLike(article._id)}
                                            whileTap={{ scale: 1.2 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <HeartIcon
                                                size={18}
                                                color={likedArticles[article._id] ? 'red' : 'gray'}
                                                fill={likedArticles[article._id] ? 'red' : 'none'}
                                            />
                                        </motion.span>
                                        <span className="text-gray-500">{article.totalLikes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="flex-shrink-0">
                                <Image
                                    isZoomed
                                    src={article.coverImageUrl}
                                    alt="Article thumbnail"
                                    className="object-fill rounded"
                                    width={280}
                                    height={200}
                                />
                            </div>
                        </div>
                        {isMyArticlePage && (
                            <div className='flex justify-end space-x-2'>
                                <Link to = {`/update/${article._id}`} >
                                <Button color='primary' variant='faded'>UPDATE</Button>
                                </Link>
                                <Button
                                    color='danger'
                                    variant='flat'
                                    onPress={() => handleRemoveArticle(article._id!)}
                                >
                                    REMOVE
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Render Article View Modal */}
            {selectedArticle && (
                <ViewArticle
                    isOpen={!!selectedArticle}
                    onOpenChange={() => setSelectedArticle(null)}
                    content={selectedArticle}
                />
            )}
        </div>
    );
};

export default ArticleCard;