import { Button, Select, SelectItem } from '@heroui/react'
import { LockIcon, UserIcon, MailIcon, CalendarIcon, ChevronUp, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { interestsList, rolesList } from '../utils/lists'
import { useFormik } from 'formik'
import { validationSchema } from '../validations/authValidations'
import axios from 'axios'


const RegistrationPage: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            dob: '',
            password: '',
            confirmPassword: '',
            identity: '',
            intrested: [] as string[]
        },
        validationSchema: { validationSchema },
        onSubmit: async (values) => {
            try {
                const response = await axios.post('YOUR_BACKEND_URL/api/auth/register', values);
                if (response.status === 200) {
                    navigate('/login')
                }
            } catch (error) {
                console.log('Registration Failed:', error)
            }
        }
    })


    const handleNext = () => {
        const firstStepFields = ['firstName', 'lastName', 'email', 'dob', 'password'];
        const hasErrors = firstStepFields.some(field =>
            formik.touched[field as keyof typeof formik.touched] &&
            formik.errors[field as keyof typeof formik.errors]
        );

        if (!hasErrors && firstStepFields.every(field => formik.values[field as keyof typeof formik.values])) {
            setStep(2);
        } else {
            // Touch all fields to show validation errors
            firstStepFields.forEach(field => {
                formik.setFieldTouched(field, true);
            });
        }
    };

    const handleBack = () => setStep(1);

    const handleInterestToggle = (interest: string) => {
        const currentInterests = formik.values.intrested;
        let newInterests;

        if (currentInterests.includes(interest)) {
            newInterests = currentInterests.filter(item => item !== interest);
        } else {
            newInterests = [...currentInterests, interest];
        }

        formik.setFieldValue('intrested', newInterests);
    };


    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen p-4'>
            <div className="absolute top-0 flex items-center flex-shrink-0 p-6 left-48">
                <h1 className="text-2xl font-bold md:text-4xl text-header">NOTION<span className='text-[#C20E4D]'>.</span></h1>
            </div>
            <form
                onSubmit={formik.handleSubmit}
                className="w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
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
                                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                                <div className='relative'>
                                    <input type="text" id="firstName "  {...formik.getFieldProps('firstName')}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="First Name" required
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <div className="mt-1 text-sm text-red-500">
                                            {formik.errors.firstName}
                                        </div>
                                    )}
                                    <div className='absolute text-gray-400 top-3 left-2'>
                                        <UserIcon size={18} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                                <div className='relative'>
                                    <input type="text" id="lastName" {...formik.getFieldProps('')}
                                        className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <div className='relative'>
                                    <input type="email" id="email" name="email"
                                        className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Email Address" required
                                    />
                                    <div className='absolute text-gray-400 top-3 left-2'>
                                        <MailIcon size={18} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Birth</label>
                                <div className='relative'>
                                    <input type="date" id="dateOfBirth" name='dob'
                                        className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <div className='relative'>
                                    <input type="password" id="password" name="password"
                                        className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Password" required
                                    />
                                    <div className='absolute text-gray-400 top-3 left-2'>
                                        <LockIcon size={18} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                <div className='relative'>
                                    <input type="password" id="confirmPassword" name="confirmPassword"
                                        className="pl-8 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                            <Button onPress={handleNext} className="text-white bg-button" >
                                Next
                            </Button>
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
                                <Select color='default' label='Select Role' {...formik.getFieldProps('identity')}>
                                    {rolesList.map((role, index) => (
                                        <SelectItem key={index}>{role}</SelectItem>
                                    ))}
                                </Select>
                                {formik.touched.identity && formik.errors.identity && (
                                    <div className="text-sm text-red-500">{formik.errors.identity}</div>
                                )}
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
                                                    name="intrested"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleInterestToggle(interest)
                                                    }}
                                                    className={`px-3 py-1 text-sm rounded-full transition-colors ${formik.values.intrested.includes(interest)
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
            </form>
        </div>
    )
}

export default RegistrationPage