import React, { useState } from 'react'
import { Button, Link as UI } from "@heroui/react";
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


const HomeHeader: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isLandingPage = location.pathname === '/'

    return (
        <nav className="z-50 py-3 bg-white shadow-sm ">
            <div className="px-4 mx-auto max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <h1 className="text-2xl font-bold md:text-4xl ">NOTION<span className='text-[#C20E4D]'>.</span></h1>
                    </div>

                    {/* Desktop Menu */}
                    {!isLandingPage ? (
                        <div className="items-center hidden space-x-2 md:flex">
                            <>
                                <Button className='text-white bg-button'>
                                    Publish
                                </Button>
                                <Link to='/profile'>
                                    <Button color='danger' variant='flat'>
                                        Account
                                    </Button>
                                </Link>
                            </>
                        </div>
                    ) : (
                        <>
                            <div className="items-center hidden space-x-8 md:flex">
                                <UI href="#" className="text-gray-600 hover:text-gray-900" underline='hover'>
                                    Explore
                                </UI>
                                <UI href="#" underline="hover" className="text-gray-600 hover:text-gray-900">
                                    About us
                                </UI>
                                <Link to='/login' className='font-medium text-blue-500'>
                                    Sign In
                                </Link>
                                <Link to='/register'>
                                    <Button className='text-white bg-button'>Get Started</Button>
                                </Link>
                            </div>
                        </>
                    )}


                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 text-gray-600 rounded-md hover:text-gray-900 focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a
                                href="#"
                                className="block px-3 py-2 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                            >
                                Explore
                            </a>
                            <a
                                href="#"
                                className="block px-3 py-2 text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                            >
                                About Us
                            </a>
                            <Button
                                variant="ghost"
                                className="w-full px-3 py-2 text-left text-gray-600"
                            >
                                Sign In
                            </Button>
                            <Button className="w-full">Get Started</Button>
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );


}

export default HomeHeader
