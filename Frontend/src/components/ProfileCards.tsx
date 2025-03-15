import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter, Avatar, Button } from "@heroui/react";
import { handleApiError } from "../types/APIResponse";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { IFollowers } from "../types/followerType";
import AllUsers from "./AllUsers";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { IFollowing } from "../types/userTypes";

const ProfileCards:React.FC = () => {
    const [isFollowed, setIsFollowed] = useState<{ [key: string]: boolean }>({});
    const [listUsers, setListUsers] = useState<IFollowers[]>([]);
    const [viewUsers, setViewUsers] = useState<boolean>(false);
    const { userInfo } = useSelector((state: RootState) => state.user)
    const userId = userInfo?._id;

    
    
    useEffect(() => { 
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`${baseUrl}followers/${userId}`, {
                    withCredentials: true
                })
    
                if (response) {
                    setListUsers(response?.data?.data); 
                }
    
                const currentUserResponse = await axios.get(`${baseUrl}user/${userId}`, {
                    withCredentials: true
                })
    
                if(currentUserResponse?.data?.data?.following) {
                    const following = currentUserResponse?.data?.data?.following;
                    console.log(following)
                    
                    const followStatus: {[key: string]: boolean} = {};
    
                    response?.data?.data.forEach((user: IFollowers) => {
                        
                        const isUserFollowed = following.some(
                            (followedUser:IFollowing) => followedUser.user === user.userId
                        );
    
                        followStatus[user.userId] = isUserFollowed;
                    })

                    setIsFollowed(followStatus)
                }
    
            } catch (error) {
                handleApiError(error)
            }
        }
         
        fetchFollowers()
    }, [userId]);


    const handleUserModal = () => {
        setViewUsers(!viewUsers)
    }

    const handleFollowToggle = async (remoteId: string) => {
        try {
            setIsFollowed(prev => {
                const updatedState = {
                    ...prev,
                    [remoteId]: !prev[remoteId]
                };
                console.log("Updated Follow State:", updatedState);
                return updatedState;
            });

            await axios.post(`${baseUrl}follow/${userId}`, {remoteId}, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true
            })
            
        }  catch (error) {
             handleApiError(error);
             setIsFollowed(prev => ({
                ...prev,
                [remoteId]: prev[remoteId]
            }));
        }
    }

    return (
        <>
            {listUsers.slice(0,2).map((user) => (
                <Card key={user.userId} className="max-w-[340px] bg-[#E4E4E7]">
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
                            onPress={() => handleFollowToggle(user.userId)}
                        >
                            {isFollowed[user.userId] ? "Unfollow" : "Follow"}
                        </Button>
                    </CardHeader>
                    <CardFooter className="gap-3">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{user.following.length}</p>
                            <p className=" text-default-400 text-small">Following</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{user.followers.length}</p>
                            <p className="text-default-400 text-small">Followers</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">{user.articleCount}</p>
                            <p className="text-default-400 text-small">Posts</p>
                        </div>
                    </CardFooter>
                    
                </Card>
            ))}
            <Button variant="faded" onPress={() => handleUserModal()}>Explore More Profiles</Button>
            {viewUsers && (
                <AllUsers 
                    isOpen={viewUsers}
                    onOpenChange={() => setViewUsers(false)}
                    content={listUsers}
                    isFollowed = {isFollowed}
                    onFollowHandler = {handleFollowToggle}
                />
            )}
        </>
    );
}

export default ProfileCards;