import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InterestsCarouselProps {
    interests: string[];
    onSelect: (category: string) => void;
    selectedCategory: string;
}

const InterestsCarousel: React.FC<InterestsCarouselProps> = ({ interests, onSelect, selectedCategory }) => {
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

    //Total interest in a page
    const displayedInterests = interests.slice(currentIndex, currentIndex + 11)
        .concat(interests.slice(0, Math.max(0, (currentIndex + 11) - interests.length)));

    
   //handle category click
   const handleCategoryClick = (category: string) => {
        console.log(category)
        if(selectedCategory === category) {
            onSelect('')
        } else {
            onSelect(category)
        }
   }
        
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
                        onClick={() => handleCategoryClick(interest)}
                        className={`max-w-full px-4 py-2 text-sm transition rounded-full cursor-pointer whitespace-nowrap
                            ${selectedCategory === interest 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-[#E4E4E7] text-button hover:bg-gray-800 hover:text-white'
                            }`}
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