import React from 'react'
import { handleApiError } from '../types/APIResponse'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { clearCredentials } from '../redux/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Button } from '@heroui/react'
import { baseUrl } from '../utils/baseUrl'


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
                    `${baseUrl}logout`,
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
        <div className='flex flex-col w-full space-y-4'>
            <Button color="danger"  variant="flat" onPress={handleLogout} className='w-40'>Logout</Button>
            <Button color="danger"  variant="ghost" onPress={handleLogout} className='w-40'>Delete Account</Button>
        </div>
    )
}

export default Logout
