import React from 'react'
import { handleApiError } from '../types/APIResponse'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { clearCredentials } from '../redux/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'


const Logout: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out of your account.",
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

            if(result.isConfirmed){
                const response = await axios.post(
                    "http://localhost:5000/api/logout",
                    {},
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
    
                if (response) {
                    console.log(response)
                    dispatch(clearCredentials());
                    navigate('/')
                }           
            }

        } catch (error) {
            handleApiError(error)
        }
    }

    return (
        <div className='px-4 py-4 rounded-lg shadow-lg bg-gradient-to-b from-red-50 to-red-100 '>
            <h1 className='text-sm'>Ready to take a break? You can log out safely and return whenever you want. Click below to log out of your account.
                <span onClick={handleLogout} className='ml-1 text-red-500 cursor-pointer text-bold'>
                    LOGOUT
                </span>
            </h1>
        </div>
    )
}

export default Logout
