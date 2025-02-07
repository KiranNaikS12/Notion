import { Button } from '@heroui/react'
import { LockIcon, UserIcon, MailIcon, CalendarIcon, ChevronUp, ChevronDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { interestsList, rolesList } from '../utils/lists';
import { Field, Form, Formik } from 'formik';
import { validationSchema } from '../validations/authValidations';
import { RegistrationFormValues } from '../types/userTypes';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/userSlice';
import { handleApiError } from '../types/APIResponse';
import { RootState } from '../redux/store/store';


const RegistrationPage: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleNext = () => setStep((prev) => prev + 1)
    const handleBack = () => setStep((prev) => prev - 1);
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (userInfo) {
            console.log('isAuthenticated')
            navigate("/home", { replace: true })
        }
    }, [userInfo, navigate])


    const handleSubmit = async (values: RegistrationFormValues) => {
        try {
            const response = await axios.post("http://localhost:5000/api/register", values, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (response) {
                navigate('/home');
                dispatch(setCredentials(response.data?.user))
            }
        } catch (error) {
            handleApiError(error)
        }
    }


    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen p-4'>
            <div className="absolute top-0 flex items-center flex-shrink-0 p-6 left-48">
                <h1 className="text-2xl font-bold md:text-4xl text-header">NOTION<span className='text-[#C20E4D]'>.</span></h1>
            </div>
            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    dob: '',
                    password: '',
                    confirmPassword: '',
                    role: '',
                    interested: []
                }}
                validationSchema={validationSchema(step)}
                validateOnMount={true}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, validateForm, setTouched, setFieldValue, values }) => {

                    const handleInterestToggle = (interest: string) => {
                        const updatedInterests: string[] = (values.interested as string[]).includes(interest)
                            ? values.interested.filter(item => item !== interest)  // Remove if already selected
                            : [...values.interested, interest];

                        setFieldValue("interested", updatedInterests);
                    };
                    return (

                        <Form className="w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                            {step === 1 && (
                                <div>
                                    <div className="flex items-center justify-between mb-7">
                                        <div></div>
                                        <Link to='/' className='text-xl'>
                                            x
                                        </Link>
                                    </div>
                                    <div className='mb-12 text-center'>
                                        <h1 className='font-serif text-2xl'>Create Account</h1>
                                        <p className='font-serif text-gray-500 w-[400px] mx-auto break-words'>Unlock a world of knowledge—dive into your favorite topics.</p>
                                    </div>
                                    <div className="grid grid-cols-2 mb-5 space-x-12">
                                        <div className='flex flex-col'>
                                            <label htmlFor="firstName" className={`block mb-2 text-sm font-medium ${errors.firstName && touched.firstName
                                                ? 'text-red-500'
                                                : 'text-gray-900'
                                                }`}>{`${errors.firstName && touched.firstName ? '*' + errors.firstName : 'First Name'}`}</label>
                                            <div className='relative'>
                                                <Field type="text" id="firstName " name="firstName"
                                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.firstName && touched.firstName
                                                        ? "border border-red-800"
                                                        : "border border-gray-300"
                                                        }`}
                                                    placeholder="First Name" required
                                                />
                                                <div className='absolute text-gray-400 top-3 left-2'>
                                                    <UserIcon size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <label htmlFor="lastName" className={`block mb-2 text-sm font-medium ${errors.lastName && touched.lastName
                                                ? 'text-red-500'
                                                : 'text-gray-900'
                                                }`}>{`${errors.lastName && touched.lastName ? '*' + errors.lastName : 'Last Name'}`}</label>
                                            <div className='relative'>
                                                <Field type="text" id="lastName" name="lastName"
                                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.lastName && touched.lastName
                                                        ? "border border-red-800"
                                                        : "border border-gray-300"
                                                        }`}
                                                    placeholder="Last Name" required
                                                />
                                                <div className='absolute text-gray-400 top-3 left-2'>
                                                    <UserIcon size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Second Row: Email and Date of Birth */}
                                    <div className="grid grid-cols-2 mb-5 space-x-12">
                                        <div className='flex flex-col'>
                                            <label htmlFor="lastName" className={`block mb-2 text-sm font-medium ${errors.email && touched.email
                                                ? 'text-red-500'
                                                : 'text-gray-900'
                                                }`}>{`${errors.email && touched.email ? '*' + errors.email : 'Enter Email'}`}</label>
                                            <div className='relative'>
                                                <Field type="text" id="email" name="email"
                                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.email && touched.email
                                                        ? "border border-red-800"
                                                        : "border border-gray-300"
                                                        }`}
                                                    placeholder="Email" required
                                                />
                                                <div className='absolute text-gray-400 top-3 left-2'>
                                                    <MailIcon size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col'>
                                            <label htmlFor="dob" className={`block mb-2 text-sm font-medium ${errors.dob && touched.dob
                                                ? 'text-red-500'
                                                : 'text-gray-900'
                                                }`}>{`${errors.dob && touched.dob ? '*' + errors.dob : 'Date of Birth'}`}</label>
                                            <div className='relative'>
                                                <Field type="date" id="dob" name='dob'
                                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.dob && touched.dob
                                                        ? "border border-red-800"
                                                        : "border border-gray-300"
                                                        }`}
                                                    required
                                                />
                                                <div className='absolute text-gray-400 top-3 left-2'>
                                                    <CalendarIcon size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Third Row: Password and Confirm Password */}
                                    <div className="grid grid-cols-2 mb-5 space-x-12">
                                        <div className='flex flex-col'>
                                            <label htmlFor="password" className={`block mb-2 text-sm font-medium ${errors.password && touched.password
                                                ? 'text-red-500'
                                                : 'text-gray-900'
                                                }`}>{`${errors.password && touched.password ? '*' + errors.password : 'Password'}`}</label>
                                            <div className='relative'>
                                                <Field type="password" id="password" name="password"
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
                                        <div className='flex flex-col'>
                                            <label htmlFor="lastName" className={`block mb-2 text-sm font-medium ${errors.confirmPassword && touched.confirmPassword
                                                ? 'text-red-500'
                                                : 'text-gray-900'
                                                }`}>{`${errors.confirmPassword && touched.confirmPassword ? '*' + errors.confirmPassword : 'Confirm password'}`}</label>
                                            <div className='relative'>
                                                <Field type="password" id="confirmPassword" name="confirmPassword"
                                                    className={`pl-8 w-full bg-gray-50  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.confirmPassword && touched.confirmPassword
                                                        ? "border border-red-800"
                                                        : "border border-gray-300"
                                                        }`}
                                                    placeholder="Confirm Password" required
                                                />
                                                <div className='absolute text-gray-400 top-3 left-2'>
                                                    <LockIcon size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Button aligned to the right */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                const validationErrors = await validateForm();

                                                if (Object.keys(validationErrors).length > 0) {
                                                    console.log('Error found:', validationErrors);
                                                    setTouched({
                                                        firstName: true,
                                                        lastName: true,
                                                        email: true,
                                                        dob: true,
                                                        password: true,
                                                        confirmPassword: true,
                                                    });
                                                } else {
                                                    handleNext();
                                                }
                                            }}
                                            className="text-white bg-[#3F3F46] px-6 py-2 rounded-xl"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <div className='mb-12 text-center'>
                                        <h1 className='font-serif text-2xl'>Choose Your Preferences</h1>
                                    </div>
                                    <div className='grid grid-cols-2 mb-5 space-x-12'>
                                        <div className='max-w-xs'>
                                            <p className="mt-4 mb-2">What best describes you?</p>
                                            <Field as="select" name="role" className="p-2 border rounded">
                                                <option value="" disabled>Select Role</option>
                                                {rolesList.map((role, index) => (
                                                    <option key={index} value={role}>{role}</option>
                                                ))}
                                            </Field>
                                        </div>
                                        <div className='max-w-2xl'>
                                            <p className="mt-4 mb-2">What are you interested in?</p>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsOpen(!isOpen)
                                                }}
                                                className="flex items-center gap-2 px-8 py-4 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                <span>Select Interests</span>
                                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </button>
                                            {isOpen && (
                                                <div className="p-4 mt-2 bg-white border rounded-lg shadow-lg h-[300px] overflow-auto">
                                                    <div className="flex flex-wrap gap-2">
                                                        {interestsList.map(interest => (
                                                            <button
                                                                key={interest}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleInterestToggle(interest);
                                                                }}
                                                                className={`px-3 py-1 text-sm rounded-full transition-colors ${(values.interested as string[]).includes(interest)
                                                                    ? 'bg-button text-white hover:bg-gray-500'
                                                                    : 'bg-gray-200 hover:bg-gray-300'
                                                                    }`}
                                                            >
                                                                {interest}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <Button onPress={handleBack} className="text-white bg-button" >
                                            Back
                                        </Button>
                                        <Button type='submit' className="text-white bg-[#C20E4D]" >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default RegistrationPage