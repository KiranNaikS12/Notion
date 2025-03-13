import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter, Avatar, Button } from "@heroui/react";
import { handleApiError } from "../types/APIResponse";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { IFollowers } from "../types/followerType";

const ProfileCards = () => {
    const [isFollowed, setIsFollowed] = React.useState(false);
    const [listUsers, setListUsers] = useState<IFollowers[]>([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`${baseUrl}followers`, {
                    withCredentials: true
                })

                if (response) {
                    setListUsers(response?.data?.data)
                }
            } catch (error) {
                handleApiError(error)
            }
        }
        fetchFollowers()
    }, [])


    return (
        <>
            {listUsers.map((user) => (
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
                            className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}
                            color="primary"
                            radius="full"
                            size="sm"
                            variant={isFollowed ? "bordered" : "solid"}
                            onPress={() => setIsFollowed(!isFollowed)}
                        >
                            {isFollowed ? "Unfollow" : "Follow"}
                        </Button>
                    </CardHeader>
                    <CardFooter className="gap-3">
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">4</p>
                            <p className=" text-default-400 text-small">Following</p>
                        </div>
                        <div className="flex gap-1">
                            <p className="font-semibold text-default-400 text-small">97.1K</p>
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
    );
}

export default ProfileCards;