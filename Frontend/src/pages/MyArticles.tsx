import React, { useEffect, useState } from 'react'
import HomeHeader from '../components/HomeHeader'
import { Search } from 'lucide-react'
import { Button } from '@heroui/react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'
import { handleApiError } from '../types/APIResponse'
import { IArticle } from '../types/articleTypes'
import axios from 'axios'
import ArticleCard from '../components/ArticleCard';
import Swal from 'sweetalert2'
import { baseUrl } from '../utils/baseUrl'
import { Link } from 'react-router-dom'


const MyArticles: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.user);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const id = userInfo?._id;

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const response = await axios.get(`${baseUrl}my-article/${id}`, {
          withCredentials: true
        })
        if (response) {
          setArticles(response?.data?.data)
        }
      } catch (error) {
        handleApiError(error)
      }
    }

    fetchMyArticles()
  }, [id]);

  const handleArticleRemove = async (articleId: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to permanently delete your article",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        position: 'center',
        customClass: {
          popup: 'rounded-lg shadow-lg  border border-green-500 w-[400px]'
        },
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${baseUrl}remove/${articleId}`);
        if (response) {
          setArticles(currentArticles =>
            currentArticles.filter(article => article._id !== articleId)
          )

        }
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen ">
      <HomeHeader />
      <div>
        <div className="border border-gray-400 border-b-1"></div>
      </div>
      <div >
        {articles.length === 0 ? (
          <div className='flex flex-col items-center justify-center min-h-[calc(100vh-100px)] space-y-2'>
            <p className='animate-pulse'>Found Nothing, but every great creation starts from nothing—why not start now :)</p>
            <Link to='/publish'>
              <button className='px-3 py-2 bg-[#D4D4D8] rounded-xl text-sm'>
                Create
              </button>
            </Link>

          </div>
        ) : (
          <div className='flex ml-[230px] mt-16 mr-[200px] space-x-10'>
            <div className='flex flex-col'>
              <div className='mb-6'>
                <h1 className='font-serif text-3xl'>My Articles...</h1>
              </div>
              <div className='flex'>
                <ArticleCard data={articles} userId={id} onArticleRemove={handleArticleRemove} />
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
                <h1 className='font-semibold text-md'>Listed Categories:</h1>
                <div className='flex flex-wrap gap-3'>
                  {articles.map((interest) => (
                    <div key={interest._id} >
                      <Button>{interest.category}</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyArticles
