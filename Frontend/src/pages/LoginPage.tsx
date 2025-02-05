import { Button } from '@heroui/react';
import { LockIcon, MailIcon} from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';


const LoginPage: React.FC = () => {
    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen p-4'>
            <div className="absolute top-0 flex items-center flex-shrink-0 p-6 left-48">
                <h1 className="text-2xl font-bold md:text-4xl text-header">NOTION<span className='text-[#C20E4D]'>.</span></h1>
            </div>
            <div className='flex flex-col justify-center space-y-4 mb-7'>
                <Link to='/' className='text-xl text-end'>
                    x
                </Link>
                <div className='text-center'>
                    <h1 className='font-serif text-2xl'>Welcome Back</h1>
                </div>
                <div>
                    <p className='font-serif text-gray-500 w-[400px] break-words text-center'>Continue where you left off and discover new perspectives.</p>
                </div>
            </div>
            <form className="w-full max-w-sm p-6 mx-auto bg-white rounded-lg shadow-lg">
                <div className="mb-5 ">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <div className='relative'>
                        <input type="email" id="email"
                            className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@flowbite.com" required
                        />
                        <div className='absolute text-gray-400 top-3 left-2'>
                            <MailIcon size={18} />
                        </div>
                    </div>
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <div className='relative'>
                        <input type="password" id="password"
                            className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                        <div className='absolute text-gray-400 top-3 left-2'>
                            <LockIcon size={18} />
                        </div>
                    </div>
                </div>
                <Button className='w-full text-white bg-button' type='submit'>
                    Login
                </Button>
            </form>
        </div>
    )
}

export default LoginPage;
