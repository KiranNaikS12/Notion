import { Button } from '@heroui/react';
import { LockIcon, MailIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { loginValidationSchema } from '../validations/authValidations';
import { Formik, Form, Field } from 'formik';
import { LoginFormValues } from '../types/userTypes';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/userSlice';
import { handleApiError } from '../types/APIResponse';
import { Toaster } from 'sonner';
import { RootState } from '../redux/store/store';
import { baseUrl } from '../utils/baseUrl';


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state:RootState) => state.user)

    useEffect(() => {
        if (userInfo) {
            navigate("/home", {replace: true})
        }
    }, [userInfo, navigate])
    
    const handleSubmit = async (values: LoginFormValues) => {
        try {
            const response = await axios.post(`${baseUrl}login`, values, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            if(response){
                navigate('/home');
                dispatch(setCredentials(response.data?.data))
            }
        } catch (error) {
            handleApiError(error)
        }
    }

    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen p-4'>
            <Toaster 
               position='top-center'
               richColors
            />
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
            <Formik
                initialValues={{
                    email: '',
                    password: ''
                }}
                validationSchema={loginValidationSchema}
                validateOnMount={true}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form className="w-full max-w-sm p-6 mx-auto bg-white rounded-lg shadow-lg">
                        <div className="mb-5 ">
                            <label htmlFor="firstName" className={`block mb-2 text-sm font-medium ${errors.email && touched.email
                                ? 'text-red-500'
                                : 'text-gray-900'
                                }`}>{`${errors.email && touched.email ? '*' + errors.email : 'First Name'}`}</label>
                            <div className='relative'>
                                <Field type="email" id="email" name = "email"
                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.email && touched.email
                                        ? "border border-red-800"
                                        : "border border-gray-300"
                                        }`}
                                    placeholder="example@gmail.com" required
                                />
                                <div className='absolute text-gray-400 top-3 left-2'>
                                    <MailIcon size={18} />
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="password" className={`block mb-2 text-sm font-medium ${errors.password && touched.password
                                ? 'text-red-500'
                                : 'text-gray-900'
                                }`}>{`${errors.password && touched.password ? '*' + errors.password : 'Password'}`}</label>
                            <div className='relative'>
                                <Field type="password" id="password" name = "password"
                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password && touched.password
                                        ? "border border-red-800"
                                        : "border border-gray-300"
                                        }`}
                                    placeholder="Password" required
                                />
                                <div className='absolute text-gray-400 top-3 left-2'>
                                    <LockIcon size={18} />
                                </div>
                            </div>
                        </div>
                        <Button className='w-full text-white bg-button' type='submit'>
                            Login
                        </Button>
                    </Form>

                )}
            </Formik>
        </div>
    )
}

export default LoginPage;
