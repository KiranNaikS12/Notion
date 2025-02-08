import React, { useState } from 'react'
import HomeHeader from './HomeHeader'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store/rootReducer'
import { interestsList, rolesList } from '../utils/lists'
import { Button } from '@heroui/react'
import { Field, Form, Formik } from 'formik'
import { handleApiError } from '../types/APIResponse';
import { isEqual } from 'lodash'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import { setCredentials } from '../redux/slices/userSlice'
import DeleteAccount from './DeleteAccount'
import Logout from './Logout'


interface AccountInfo {
    firstName: string;
    lastName: string;
    dob: string;
    role: string;
    interested: string[]
}

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'personal' | 'account'>('personal');
    const [isInterestOpen, setIsInterestOpen] = useState<boolean>(false);
    const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
    const { userInfo } = useSelector((state: RootState) => state.user);
    const [isFirstNameEdit, setIsFirstNameEdit] = useState<boolean>(false);
    const [isLastNameEdit, setIsLastNameEdit] = useState<boolean>(false);
    const [isDobEdit, setIsDobEdit] = useState<boolean>(false);
    // const [isEmailEdit, setIsEmailEdit] = useState<boolean>(false);
    const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set()); //Track modified fields
    const dispatch = useDispatch();


    const handleInterestedToggle = () => {
        setIsInterestOpen(!isInterestOpen);
        if (!modifiedFields.has('interested')) {
            setModifiedFields(prev => new Set(prev).add('interested'))
        }
    }

    const handleRoleToggle = () => {
        setIsRoleOpen(!isRoleOpen);
        if (!modifiedFields.has('role')) {
            setModifiedFields(prev => new Set(prev).add('role'));
        }
    };

    const handleFieldEdit = (fieldName: string, isEditing: boolean, setEditState: (state: boolean) => void) => {
        setEditState(isEditing);
        if (isEditing && !modifiedFields.has(fieldName)) {
            setModifiedFields(prev => new Set(prev).add(fieldName));
        }
    };

    const handleInterestToggle = (interest: string, values: AccountInfo, setFieldValue: (field: string, value: string[]) => void) => {
        const currentInterests = values.interested || [];
        let newInterests;

        if (currentInterests.includes(interest)) {
            newInterests = currentInterests.filter(i => i !== interest);
        } else {
            newInterests = [...currentInterests, interest];
        }

        setFieldValue('interested', newInterests);
        if (!modifiedFields.has('interested')) {
            setModifiedFields(prev => new Set(prev).add('interested'));
        }
    };

    const personalFields = isFirstNameEdit || isLastNameEdit || isDobEdit || isRoleOpen || isInterestOpen


    const handleSubmit = async (values: AccountInfo) => {
        if (!userInfo) return;

        const changedFields = Array.from(modifiedFields).reduce((acc, field) => {
            const key = field as keyof AccountInfo;

            type AccType = Partial<AccountInfo>;

            // Compare the new value with original value
            if (key in values && key in userInfo && !isEqual(values[key], userInfo[key])) {
                (acc[key] as AccType[typeof key]) = values[key];
            }

            return acc;
        }, {} as Partial<AccountInfo>);

        //If no actual changes found,
        if (Object.keys(changedFields).length === 0) {
            console.log('No changes found')
            return;
        }


        try {
            const response = await axios.put(`http://localhost:5000/api/profile/${id}`, changedFields, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (response) {
                toast.success(response?.data?.message);
                dispatch(setCredentials(response?.data?.user))
            }
            setIsFirstNameEdit(false);
            setIsLastNameEdit(false);
            setIsDobEdit(false);
            setIsRoleOpen(false);
            setIsInterestOpen(false)

        } catch (error) {
            handleApiError(error)
        }
    }

    const PersonalInfoContent = () => (
        <Formik
            initialValues={{
                firstName: userInfo?.firstName || '',
                lastName: userInfo?.lastName || '',
                dob: userInfo?.dob || '',
                role: userInfo?.role || '',
                interested: userInfo?.interested || []
            }}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (

                <Form>
                    <div className="flex gap-12">
                        <div className="flex-grow space-y-10">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label htmlFor="firstName" className="mb-4 ">First Name
                                        <span onClick={() => handleFieldEdit('firstName', !isFirstNameEdit, setIsFirstNameEdit)} className='ml-1 text-sm font-normal text-blue-500'>
                                            Edit
                                        </span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        disabled={!isFirstNameEdit}
                                        className="w-full px-2 py-3 text-gray-500 border border-gray-300 rounded-lg bg-gradient-to-t from-gray-50 to-gray-200 "
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="lastName" className="mb-4 ">Last Name
                                        <span onClick={() => handleFieldEdit('lastName', !isLastNameEdit, setIsLastNameEdit)} className='ml-1 text-sm font-normal text-blue-500'>
                                            Edit
                                        </span>
                                    </label>
                                    <Field
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        disabled={!isLastNameEdit}
                                        className="w-full px-2 py-3 border border-gray-300 rounded-lg bg-gradient-to-t from-gray-50 to-gray-200"
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label htmlFor="dob" className="mb-4 ">Date Of Birth
                                        <span onClick={() => handleFieldEdit('dob', !isDobEdit, setIsDobEdit)} className='ml-1 text-sm font-normal text-blue-500'>
                                            Edit
                                        </span>
                                    </label>
                                    <Field
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        disabled={!isDobEdit}
                                        className="w-full px-2 py-3 border border-gray-300 rounded-lg bg-gradient-to-b from-gray-50 to-gray-200"
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
                                            as="select"
                                            id="role"
                                            name="role"
                                            disabled={!isRoleOpen}
                                            className="w-full px-2 py-3 bg-white border border-gray-300 rounded-lg bg-gradient-to-b from-gray-50 to-gray-200"
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
                                            className="w-full px-2 py-3 border border-gray-300 rounded-lg bg-gradient-to-b from-gray-50 to-gray-200"
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
                                                    type='button'
                                                    onClick={() => handleInterestToggle(item, values, setFieldValue)}
                                                    className={`px-4 py-2 rounded-full transition-colors
                                                            ${values?.interested?.includes(item)
                                                            ? 'bg-button text-white hover:bg-gray-400'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {values?.interested.map((item) => (
                                                <div
                                                    key={item}
                                                    className="px-4 py-2 text-sm text-black bg-gray-300 rounded-full cursor-pointer hover:bg-button"
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
                    {modifiedFields.size > 0 && personalFields &&  (
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
            )}
        </Formik>
    )

    const AccountInfoContent = () => (
        <div className='flex flex-col gap-6 mt-6'>
            <div className='flex flex-col space-y-4'>
                <div className='px-4 py-4 rounded-lg shadow-lg bg-gradient-to-t from-gray-50 to-gray-300 '>
                    <h1 className='text-sm'>You can update your email address or switch to a different account by logging in with a new email. Managing your email ensures you have access to all your data securely. 
                        <span className='ml-1 text-blue-500 cursor-pointer text-bold'>
                            Manage Email
                        </span>
                    </h1>
                </div>
                <div className='px-4 py-4 rounded-lg shadow-lg bg-gradient-to-t from-gray-50 to-gray-300 '>
                    <h1 className='text-sm'>Keep your account secure by updating your password regularly. Choose a strong password to protect your data. Click below to change your password now. 
                        <span className='ml-1 text-blue-500 cursor-pointer text-bold'>Change Password</span>
                    </h1>
                </div>
                <DeleteAccount/>
                <Logout/>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen">
            <HomeHeader />
            <div>
                <div className="border border-gray-400 border-b-1"></div>
            </div>
            <Toaster position='top-center' richColors />

            <div className="ml-[220px] mt-16 mr-[225px]">
                <div className="flex flex-col">
                    <div className="mb-6">
                        <div className="flex space-x-6 border-b">
                            <button
                                className={`pb-4 transition-colors ${activeTab === 'personal'
                                    ? 'border-b-2  text-red-500 text-xl font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('personal')}
                            >
                                Personal Info
                            </button>
                            <button
                                className={`pb-4 transition-colors ${activeTab === 'account'
                                    ? 'border-b-2  text-red-500 text-xl font-medium'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('account')}
                            >
                                Account Info
                            </button>
                        </div>
                    </div>

                    {activeTab === 'personal' ? <PersonalInfoContent /> : <AccountInfoContent />}
                </div>
            </div>
        </div>
    );
}

export default UserProfile