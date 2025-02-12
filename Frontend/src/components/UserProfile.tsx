import React, { useRef, useState } from 'react'
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
import Logout from './Logout'
import { PenIcon } from 'lucide-react'


interface AccountInfo {
    firstName: string;
    lastName: string;
    profileImage: string;
    dob: string;
    role: string;
    interested: string[]
}

const UserProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isInterestOpen, setIsInterestOpen] = useState<boolean>(false);
    const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
    const { userInfo } = useSelector((state: RootState) => state.user);
    const [isFirstNameEdit, setIsFirstNameEdit] = useState<boolean>(false);
    const [isLastNameEdit, setIsLastNameEdit] = useState<boolean>(false);
    const [isDobEdit, setIsDobEdit] = useState<boolean>(false);
    const [hasImageChange, setHasImageChange] = useState<boolean>(false);
    const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set()); //Track modified fields
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hasFiles = event.target.files !== null && event.target.files.length > 0;
        if (hasFiles) {
            const fileInput = event.target;
            const file = fileInput.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    setImageSrc(result);
                    setHasImageChange(true);
                };

                reader.readAsDataURL(file);
            }
        }
        setHasImageChange(hasFiles);
    };



    const personalFields = isFirstNameEdit || isLastNameEdit || isDobEdit || isRoleOpen || isInterestOpen || hasImageChange


    const handleSubmit = async (values: AccountInfo) => {
        if (!userInfo) return;

        const formData = new FormData();
        let hasChanges = hasImageChange;

        console.log("FormData before submission:", formData.get("profileImage"));

        if (fileInputRef.current && fileInputRef.current.files?.length) {
            formData.append('profileImage', fileInputRef.current.files[0]);
            hasChanges = true;
        }

        console.log("FormData before submission:", formData.get("profileImage"));

        Array.from(modifiedFields).forEach((field) => {
            const key = field as keyof AccountInfo;
            if (key in values && key in userInfo && !isEqual(values[key], userInfo[key])) {
                // Handle arrays (like interested) specially
                if (Array.isArray(values[key])) {
                    formData.append(key, JSON.stringify(values[key]));
                } else {
                    formData.append(key, values[key] as string);
                }
                hasChanges = true;
            }
        });

        //If no actual changes found,
        if (!hasChanges) {
            console.log('No changes found')
            return;
        }


        try {
            const response = await axios.put(`http://localhost:5000/api/profile/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
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
            setImageSrc(null)

        } catch (error) {
            handleApiError(error)
        }
    }
    return (
        <>
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
                                    className="pb-4 text-xl font-bold text-gray-500 transition-colors hover:text-gray-700' 
                                        "
                                >
                                    Personal Info
                                </button>
                            </div>
                        </div>
                        <Formik
                            initialValues={{
                                firstName: userInfo?.firstName || '',
                                lastName: userInfo?.lastName || '',
                                profileImage: userInfo?.profileImage || '',
                                dob: userInfo?.dob || '',
                                role: userInfo?.role || '',
                                interested: userInfo?.interested || []
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({ values, setFieldValue }) => (

                                <Form>
                                    <div className="flex gap-12 flex-nowrap">
                                        <div className='flex flex-col space-y-4'>
                                            <div className='relative z-10 overflow-visible'>
                                                <img src={imageSrc ? imageSrc : userInfo?.profileImage} alt='./profile.webp' className='object-cover rounded-full h-44 w-44' />
                                                <div className='absolute bottom-0 z-50 right-4'>
                                                    <div className='px-2 py-2 bg-gray-300 rounded-full' onClick={handleImageClick}>
                                                        <PenIcon size={18} />
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            name="profileImage"
                                                            ref={fileInputRef}
                                                            onChange={handleImageChange}
                                                            style={{ display: "none" }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Logout />
                                            </div>
                                        </div>
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
                                                        <div className={`overflow-auto transition-all duration-300 ${isInterestOpen ? 'h-40' : 'h-10'}`}>
                                                        {isInterestOpen &&
                                                            interestsList.map((interest) => (
                                                                <div key={interest} className="flex items-center space-x-2">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={values.interested.includes(interest)}
                                                                        onChange={() => handleInterestToggle(interest, values, setFieldValue)}
                                                                    />
                                                                    <label>{interest}</label>
                                                                </div>
                                                            ))
                                                        }
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
                                    {(modifiedFields.size > 0 || hasImageChange) && personalFields && (
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

                    </div>
                </div>
            </div>
        </>
    );
}

export default UserProfile