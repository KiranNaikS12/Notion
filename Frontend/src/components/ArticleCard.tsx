import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Image } from '@heroui/react';

const ArticleCard: React.FC = () => {
    return (
        <div className='flex flex-col mb-10 space-y-4'>
            <div className="flex flex-col w-[850px] gap-4 p-4 transition-colors duration-300 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-50">
                {/* Author Section */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded">
                        <span className="text-xs font-medium text-white">LC</span>
                    </div>
                    <span className="text-sm text-gray-600">In Level Up Coding</span>
                    <span className="text-gray-400">by</span>
                    <span className="text-gray-600">Arnold Gunter</span>
                </div>

                {/* Content Section */}
                <div className="flex justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            If You Can Answer These 7 Questions Correctly You're Decent at JavaScript
                        </h2>
                        <p className="mt-3 text-gray-600 line-clamp-3">
                            Explore the latest trends and innovations in web development.
                            From new frameworks to revolutionary tools, discover how the
                            landscape of web development is evolving.
                        </p>

                        {/* Metadata Section */}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-500">Aug 25, 2024</span>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">2.3K</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare size={16} className="text-gray-500" />
                                <span className="text-gray-500">46</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-shrink-0">
                        <Image
                            isZoomed
                            src="https://heroui.com/images/hero-card.jpeg"
                            alt="Article thumbnail"
                            className="object-cover rounded"
                            width={200}
                            height={200}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4 transition-colors duration-300 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 w-[850px]">
                {/* Author Section */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded">
                        <span className="text-xs font-medium text-white">LC</span>
                    </div>
                    <span className="text-sm text-gray-600">In Level Up Coding</span>
                    <span className="text-gray-400">by</span>
                    <span className="text-gray-600">Arnold Gunter</span>
                </div>

                {/* Content Section */}
                <div className="flex justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            If You Can Answer These 7 Questions Correctly You're Decent at JavaScript
                        </h2>
                        <p className="mt-3 text-gray-600 line-clamp-3">
                            Explore the latest trends and innovations in web development.
                            From new frameworks to revolutionary tools, discover how the
                            landscape of web development is evolving.
                        </p>

                        {/* Metadata Section */}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-500">Aug 25, 2024</span>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">2.3K</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare size={16} className="text-gray-500" />
                                <span className="text-gray-500">46</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-shrink-0">
                        <Image
                            isZoomed
                            src="https://heroui.com/images/hero-card.jpeg"
                            alt="Article thumbnail"
                            className="object-cover rounded"
                            width={200}
                            height={200}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4 transition-colors duration-300 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 w-[850px]">
                {/* Author Section */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded">
                        <span className="text-xs font-medium text-white">LC</span>
                    </div>
                    <span className="text-sm text-gray-600">In Level Up Coding</span>
                    <span className="text-gray-400">by</span>
                    <span className="text-gray-600">Arnold Gunter</span>
                </div>

                {/* Content Section */}
                <div className="flex justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                            If You Can Answer These 7 Questions Correctly You're Decent at JavaScript
                        </h2>
                        <p className="mt-3 text-gray-600 line-clamp-3">
                            Explore the latest trends and innovations in web development.
                            From new frameworks to revolutionary tools, discover how the
                            landscape of web development is evolving.
                        </p>

                        {/* Metadata Section */}
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-gray-500">Aug 25, 2024</span>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500">2.3K</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageSquare size={16} className="text-gray-500" />
                                <span className="text-gray-500">46</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-shrink-0">
                        <Image
                            isZoomed
                            src="https://heroui.com/images/hero-card.jpeg"
                            alt="Article thumbnail"
                            className="object-cover rounded"
                            width={200}
                            height={200}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;