import React, { useState } from 'react'
import HomeHeader from './HomeHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/rootReducer'
import { interestsList, rolesList } from '../utils/lists'
import { Button } from '@heroui/react'
import { Field, Form, Formik } from 'formik'

interface AccountInfo {
    firstName: string;
    lastName: string;
    dob: string;
    role: string;
    interested: string[]
}

const UserProfile: React.FC = () => {
    const [isInterestOpen, setIsInterestOpen] = useState<boolean>(false);
    const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
    const { userInfo } = useSelector((state: RootState) => state.user);
    const [isFirstNameEdit, setIsFirstNameEdit] = useState<boolean>(false);
    const [isLastNameEdit, setIsLastNameEdit] = useState<boolean>(false);
    const [isDobEdit, setIsDobEdit] = useState<boolean>(false);


    const handleInterestedToggle = () => {
        setIsInterestOpen(!isInterestOpen)
    }

    const handleRoleToggle = () => {
        setIsRoleOpen(!isRoleOpen)
    }

    const isAnyFieldEditing = isInterestOpen || isRoleOpen || isFirstNameEdit || isLastNameEdit || isDobEdit;

    const handleSubmit = ( values: AccountInfo ) => {
        console.log(values)
    }

    return (
        <div className="flex flex-col min-h-screen">
            <HomeHeader />
            <div>
                <div className="border border-gray-400 border-b-1"></div>
            </div>

            {/* MAIN */}
            <div className="ml-[220px] mt-16 mr-[225px]">
                <div className="flex flex-col">
                    <div className="mb-6">
                        <h1 className="mb-4 font-serif text-3xl">Account Info</h1>
                    </div>
                    <Formik 
                        initialValues= {{
                            firstName: userInfo?.firstName || '',
                            lastName: userInfo?.lastName || '',
                            dob: userInfo?.dob || '',
                            role: userInfo?.role || '',
                            interested: []
                        }}
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <div className="flex gap-12">
                                <div className="flex-grow space-y-10">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <label htmlFor="firstName" className="mb-4 ">First Name
                                                <span onClick={() => setIsFirstNameEdit(!isFirstNameEdit)} className='ml-1 text-sm font-normal text-blue-500'>
                                                    Edit
                                                </span>
                                            </label>
                                            <Field
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={userInfo?.firstName}
                                                className="w-full px-2 py-3 text-gray-500 border border-gray-300 rounded-2xl"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="lastName" className="mb-4 ">Last Name
                                                <span onClick={() => setIsLastNameEdit(!isLastNameEdit)} className='ml-1 text-sm font-normal text-blue-500'>
                                                    Edit
                                                </span>
                                            </label>
                                            <Field
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={userInfo?.lastName}
                                                className="w-full px-2 py-3 border border-gray-300 rounded-2xl"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex flex-col">
                                            <label htmlFor="dob" className="mb-4 ">Date Of Birth
                                                <span onClick={() => setIsDobEdit(!isDobEdit)} className='ml-1 text-sm font-normal text-blue-500'>
                                                    Edit
                                                </span>
                                            </label>
                                            <Field
                                                type="date"
                                                id="dob"
                                                name="dob"
                                                value={userInfo?.dob}
                                                className="w-full px-2 py-3 border border-gray-300 rounded-2xl"
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="Role" className="mb-4 ">My Role
                                                <span onClick={handleRoleToggle} className='ml-1 text-sm font-normal text-blue-500'>
                                                    Edit
                                                </span>
                                            </label>
                                            {isRoleOpen ? (
                                                <Field
                                                    as = "select"
                                                    id="role"
                                                    name="role"
                                                    value={userInfo?.role}
                                                    className="w-full px-2 py-3 bg-white border border-gray-300 rounded-2xl"
                                                >
                                                    <option value="" disabled>Select Role</option>
                                                    {rolesList.map((role, index) => (
                                                        <option key={index} value={role}>{role}</option>
                                                    ))}
                                                </Field>
                                            ) : (
                                                <input
                                                    type="text"
                                                    id="role"
                                                    name="role"
                                                    value={userInfo?.role}
                                                    className="w-full px-2 py-3 border border-gray-300 rounded-2xl"
                                                    placeholder="Last Name"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="flex flex-col">
                                            <label htmlFor="interests" className="mb-4 ">My Interests
                                                <span onClick={handleInterestedToggle} className='ml-1 text-sm font-normal text-blue-500'>
                                                    Edit
                                                </span>
                                            </label>
                                            {isInterestOpen ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {interestsList?.map((item) => (
                                                        <button
                                                            key={item}
                                                            className={`px-4 py-2 rounded-full transition-colors
                                                    ${userInfo?.interested?.includes(item)
                                                                    ? 'bg-button text-white hover:bg-blue-600'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {userInfo?.interested.map((item) => (
                                                        <div
                                                            key={item}
                                                            className="px-4 py-2 text-sm text-white rounded-full cursor-pointer bg-button hover:bg-gray-500"
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {isAnyFieldEditing && (
                                <div className="flex justify-end pt-6 mt-10 mb-10">
                                    <Button
                                        type='submit'
                                        variant='ghost'
                                        color='danger'
                                        className="px-6 py-2 transition-colors rounded-lg "
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default UserProfile