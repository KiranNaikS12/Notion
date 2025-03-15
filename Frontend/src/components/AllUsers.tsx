import React, { useState } from 'react'
import { IFollowers } from '../types/followerType';
import { Avatar, Button, Card, CardFooter, CardHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, } from '@heroui/react';
import { Search } from 'lucide-react';


interface AllUsersProps {
    isOpen: boolean;
    onOpenChange: () => void;
    content: IFollowers[];
    isFollowed: { [key: string]: boolean; };
    onFollowHandler: (remoteId: string) => void;
}


const AllUsers: React.FC<AllUsersProps> = ({ isOpen, onOpenChange, content, isFollowed, onFollowHandler }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const searchUser = content.filter((user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    )


    return (
        <Modal isOpen={isOpen} backdrop='opaque' size='md' scrollBehavior='inside' onOpenChange={onOpenChange}
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 mt-4 text-md">
                            <div className='relative flex-1'>
                                <div className='absolute inset-y-0 flex items-center pointer-events-none left-3'>
                                    <Search className='w-5 h-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    placeholder='Search...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full py-2 pl-10 pr-4 transition-all duration-200 bg-white border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                />
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {searchTerm.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center h-72">
                                    <img src="/users.png" alt="users" className="w-16" />

                                    <p className="mt-2 text-sm text-gray-500">Connect with people</p>
                                </div>
                            ) : (
                                <>
                                    {searchUser.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center text-center h-72">
                                            <img src="/user_not_found.png" alt="users" className="w-32" />

                                            <p className="mt-2 text-sm text-gray-500">No User Found</p>
                                        </div>
                                    ) : (
                                        <>
                                            {searchUser.map((user) => (
                                                <Card key={user.userId} className="w-full bg-[#E4E4E7] cursor-pointer border hover:border-blue-500 hover:shadow-lg">
                                                    <CardHeader className="justify-between">
                                                        <div className="flex gap-5">
                                                            <Avatar
                                                                isBordered
                                                                radius="full"
                                                                size="md"
                                                                src=''
                                                            />
                                                            <div className="flex flex-col items-start justify-center gap-1">
                                                                <h4 className="font-semibold leading-none text-small text-default-600">{user.firstName} {user.lastName}</h4>
                                                                <h5 className="tracking-tight text-small text-default-400">{user.email}</h5>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            color="primary"
                                                            radius="full"
                                                            size="sm"
                                                            variant={isFollowed[user.userId] ? "faded" : "flat"}
                                                            onPress={() => onFollowHandler(user.userId)}
                                                        >
                                                            {isFollowed[user.userId] ? "Unfollow" : "Follow"}
                                                        </Button>
                                                    </CardHeader>
                                                    <CardFooter className="gap-3">
                                                        <div className="flex gap-1">
                                                            <p className="font-semibold text-default-400 text-small">{user.following ? user.following.length : 0}</p>
                                                            <p className=" text-default-400 text-small">Following</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <p className="font-semibold text-default-400 text-small">{user.followers ? user.followers.length : 0}</p>
                                                            <p className="text-default-400 text-small">Followers</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <p className="font-semibold text-default-400 text-small">{user.articleCount}</p>
                                                            <p className="text-default-400 text-small">Posts</p>
                                                        </div>
                                                    </CardFooter>

                                                </Card>
                                            ))}
                                        </>
                                    )}

                                </>
                            )}

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AllUsers
