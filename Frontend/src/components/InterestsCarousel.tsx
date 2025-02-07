import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InterestsCarouselProps {
    interests: string[];
}

const InterestsCarousel: React.FC<InterestsCarouselProps> = ({ interests }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex + 1 >= interests.length) ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 < 0) ? interests.length - (interests.length % 1 || 1) : prevIndex - 1
        );
    };

    const displayedInterests = interests.slice(currentIndex, currentIndex + 11)
        .concat(interests.slice(0, Math.max(0, (currentIndex + 11) - interests.length)));

    return (
        <div className="flex justify-center w-full py-4 bg-gray-50">
        <div className="flex items-center w-full px-4 space-x-4 max-w-7xl">
            <button
                onClick={handlePrev}
                className="flex-shrink-0 p-2 transition bg-gray-200 rounded-full hover:bg-gray-300"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex flex-wrap items-center justify-center flex-grow gap-2 overflow-hidden">
                {displayedInterests.map((interest, index) => (
                    <div
                        key={index}
                        className="max-w-full px-4 py-2 text-sm text-button break-words transition rounded-full cursor-pointer bg-[#E4E4E7] hover:bg-gray-800 hover:text-white whitespace-nowrap"
                    >
                        {interest}
                    </div>
                ))}
            </div>

            <button
                onClick={handleNext}
                className="flex-shrink-0 p-2 transition bg-gray-200 rounded-full hover:bg-gray-300"
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>
    </div>
);
};

export default InterestsCarousel;