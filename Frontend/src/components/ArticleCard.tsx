import React, { useEffect, useState } from 'react';
import { HeartIcon } from 'lucide-react';
import { Image } from '@heroui/react';
import { IArticle } from '../types/articleTypes';
import RenderContent from './RenderContent';
import ViewArticle from './ViewArticle';
import { handleApiError } from '../types/APIResponse';
import axios from 'axios';
import { motion } from 'framer-motion';


export interface ArticleProps {
    data: IArticle[];
    userId: string | undefined;
}

const ArticleCard: React.FC<ArticleProps> = ({ data, userId }) => {
    const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);
    const [likedArticles, setLikedArticles] = useState<{ [key: string]: boolean }>({}); //tracking like state for each articleId


    useEffect(() => {
        if(!userId) return;

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

            localStorage.setItem(
                `likedArticles_${userId}`,
                JSON.stringify({ ...likedArticles, [articleId]: !isCurrentlyLiked })
            );

            const response = await axios.post(`http://localhost:5000/api/heart/${articleId}`, {
                userId,
                isLiked: !likedArticles[articleId]
            });

            if (response) {
                console.log(response)
                alert("You Liked the article");
            }
        } catch (error) {
            handleApiError(error)
            setLikedArticles((prev) => ({
                ...prev,
                [articleId]: prev[articleId]
            }));
        }
    }



    return (
        <div className='flex flex-col mb-10 space-y-4'>
            {data.map((article) => (
                <div key={article._id} className="flex flex-col w-[850px] gap-4 p-4 transition-colors duration-300 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 hover:border-blue-500">
                    {/* Author Section */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400">Creator: </span>
                        <span className="text-gray-600">{article.user.firstName} <span>{article.user.lastName}</span></span>
                    </div>

                    {/* Content Section */}
                    <div className="flex justify-between gap-6">
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
                                        whileTap={{scale: 1.2}}
                                        transition={{type: "spring", stiffness: 300}}
                                    >
                                        <HeartIcon
                                            size={18}
                                            color={likedArticles[article._id] ? 'red' : 'gray'}
                                            fill={likedArticles[article._id] ? 'red' : 'none'}
                                        />
                                    </motion.span>
                                    <span className="text-gray-500">{article.totalLikes}</span>
                                </div>
                                {/* <div className="flex items-center gap-1">
                                    <MessageSquare size={16} className="text-gray-500" />
                                    <span className="text-gray-500">46</span>
                                </div> */}
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