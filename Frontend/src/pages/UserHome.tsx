import React, { useCallback, useEffect, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import InterestsCarousel from '../components/InterestsCarousel'
import { filters, interestsList } from '../utils/lists'
import ArticleCard from '../components/ArticleCard'
import { Search } from 'lucide-react'
import { Button } from '@heroui/react'
import ProfileCards from '../components/ProfileCards'
import { handleApiError } from '../types/APIResponse'
import axios from 'axios'
import { IArticle } from '../types/articleTypes'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'
import { Link } from 'react-router-dom'
import { baseUrl } from '../utils/baseUrl'
import InfiniteScroll from 'react-infinite-scroll-component'



const UserHome: React.FC = () => {
  const [allArticles, setAllArticles] = useState<IArticle[]>([]);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const LIMIT = 3;
  const { userInfo } = useSelector((state: RootState) => state.user);
  const id = userInfo?._id;
 

  const fetchArticles = useCallback(async (pageNumber = 1, reset = false) => {
    try {
      setLoading(true);
      const url = selectedCategory
        ? `${baseUrl}articles/category/${selectedCategory}`
        : `${baseUrl}articles/${id}`;

      const response = await axios.get(`${url}?page=${pageNumber}&limit=${LIMIT}`, {
        withCredentials: true
      });

      const newArticles = response?.data;
      const newIds = new Set<string>(); 

      const uniqueNewArticles = newArticles.filter((article: IArticle) => {
        if (!newIds.has(article._id)) {
          newIds.add(article._id);
          return true;
        }
        return false;
      });

      setHasMore(uniqueNewArticles.length >= LIMIT);
      

      if (reset) {
        setAllArticles(uniqueNewArticles);
        setArticles(uniqueNewArticles);
      } else {
        setAllArticles(prevArticles => [...prevArticles, ...uniqueNewArticles]);
        setArticles(prevArticles => [...prevArticles, ...uniqueNewArticles]);
      }
      
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [id, selectedCategory]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchArticles(1, true)
  }, [selectedCategory, fetchArticles]);


  const loadMoreArticles = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchArticles(nextPage);
    }
  };


  // HandleSearch
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setArticles(allArticles);
      return;
    }

    const filteredArticles = allArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setArticles(filteredArticles);
  };

  const hanldeCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  

  return (
    <div className='flex flex-col min-h-screen'>
      <HomeHeader />

      {/* Divider */}
      <div>
        <div className='border border-gray-400 border-b-1'></div>
      </div>

      {/* Interests Carousel */}
      <div className='w-full mt-8'>
        <InterestsCarousel
          interests={interestsList}
          onSelect={hanldeCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* Main Content */}
      <div className='flex ml-[220px] mt-16 mr-[225px] space-x-10'>

        {/* Left Section: Trending Articles */}
        {articles.length === 0 ? (
          <div className='flex flex-col items-center justify-center w-[1200px] space-y-3'>
            <p className='animate-pulse'>Found Nothing, but every great creation starts from nothing—why not start now :)</p>
            <Link to='/publish'>
              <button className='px-3 py-2 bg-[#D4D4D8] rounded-xl text-sm'>
                Create
              </button>
            </Link>

          </div>
        ) : (
          <div className='flex flex-col'>
            <div className='mb-6'>
              <h1 className='font-serif text-3xl'>Trending Articles For You..</h1>
            </div>

            <div className='flex'>
              <InfiniteScroll
                dataLength={articles.length}
                next={loadMoreArticles}
                hasMore={hasMore}
                loader={<p className="mt-4 text-center">Loading more articles...</p>}
                endMessage={
                  <p className="mt-4 text-center text-gray-500">
                    No more articles to load
                  </p>
                }
                scrollThreshold={0.8}
              >  
                <ArticleCard data={articles} userId={id} />
              </InfiniteScroll>
            </div>
          </div>
        )}

        {/* Right Section: Search Bar */}
        <div className='sticky flex flex-col mt-16 space-y-10 top-5 h-fit'>
          <div className='flex w-full max-w-md gap-2'>

            <div className='relative flex-1'>
              <div className='absolute inset-y-0 flex items-center pointer-events-none left-3'>
                <Search className='w-5 h-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full py-2 pl-10 pr-4 transition-all duration-200 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              />
            </div>

            <Button
              variant='faded'
              onPress={handleSearch}
              className='px-6 py-2 text-white bg-[#C20E4D] rounded-lg border-none shadow-md transition-colors duration-200'
            >
              Search
            </Button>
          </div>
          <div className='flex flex-col w-full space-y-6'>
            <h1 className='font-semibold text-md'>Discover Top Picks:</h1>
            <div className='flex flex-wrap gap-3'>
              {filters.map((filter) => (
                <Button key={filter} variant='ghost' color='danger' radius='sm' className='px-4 w-fit'>
                  {filter}
                </Button>
              ))}
            </div>
          </div>
          <div className='flex flex-col w-full space-y-4'>
            <h1 className='font-semibold text-md'>Inspiring People to Follow:</h1>
            <ProfileCards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;

