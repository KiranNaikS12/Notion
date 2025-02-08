import React from 'react'

const DeleteAccount:React.FC = () => {
    return (
        <div className='px-4 py-4 rounded-lg shadow-lg bg-gradient-to-b from-red-50 to-red-100 '>
            <h1 className='text-sm'>Thinking of leaving? Deleting your account will remove all your data permanently. This action cannot be undone. Click below if you wish to proceed
                <span className='ml-1 text-red-500 cursor-pointer text-bold'>Delete Account</span>
            </h1>
        </div>
    )
}

export default DeleteAccount
