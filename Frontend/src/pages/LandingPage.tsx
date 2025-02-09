import React, { useEffect } from 'react';
import HomeHeader from '../components/HomeHeader';
import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/rootReducer';


const LandingPage: React.FC = () => {

    const navigate = useNavigate();
    const { userInfo } = useSelector((state:RootState) => state.user)

    useEffect(() => {
        if (userInfo) {
            console.log('isAuthenticated')
            navigate("/home", { replace: true })
        }
    }, [userInfo, navigate])

    return (
        <div>
            <HomeHeader />
            <div>
                <div className='border border-gray-400 border-b-1'></div>
            </div>
            {/* Landing Theme  */}
            <div className='flex space-x-24'>
                <div className='flex flex-col space-y-8 ml-[200px]  mt-[140px]'>
                    <div className='flex flex-col justify-start font-serif '>
                        <h1 className='font-medium text-8xl'> <span className='text-[#C20E4D] text-[130px] font-semibold'>One</span> Place With</h1>
                        <h1 className='text-8xl'>Millions Ideas.</h1>
                    </div>
                    <div>
                        <p className='font-serif text-lg'>Read what matters. Write what inspires. Share what you love!</p>
                    </div>
                    <div>
                        <Button variant="ghost" className='font-serif border border-header'>JOIN NOW</Button>
                    </div>
                    <div></div>
                </div>
                <div className='mt-[100px]'>
                    <img
                        alt="preview"
                        src="./banner-img1.png"
                        width={450}
                    />
                </div>
            </div>
            {/* <div className='flex ml-[200px] mt-24 mr-[200px] space-x-10'>
                <div className='flex flex-col'>
                    <div className='mb-6'>
                        <h1 className='font-serif text-3xl'>Trending Articles For You..</h1>
                    </div>
                    <div className='flex'>
                        <ArticleCard />
                    </div>
                </div>
                <div className='flex flex-col mt-16 space-y-8'>
                    <div className="flex w-full max-w-md gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 flex items-center pointer-events-none left-3">
                                <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full py-2 pl-10 pr-4 transition-all duration-200 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <Button
                            variant='faded'
                            className="px-6 py-2 text-white transition-colors duration-200 bg-[#C20E4D] rounded-lg border-none shadow-md"
                        >
                            Search
                        </Button>
                    </div>
                    <div className='flex flex-col w-full space-y-6'>
                        <h1 className='font-semibold text-md'>Trending Categories:</h1>
                        <div className='flex flex-wrap gap-3'>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Programming
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Science
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Sports
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Technology
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Arts
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Health
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Data Structure and Alogrithm
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Technology
                            </Button>
                            <Button variant='solid' radius='sm' className='px-4 w-fit'>
                                Arts
                            </Button>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>

    );
}

export default LandingPage
