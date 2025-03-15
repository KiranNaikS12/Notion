import React, { useEffect, useMemo, useState } from "react";
import { handleApiError } from "../types/APIResponse";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { UserStats } from "../types/userTypes";


const ProfileStats: React.FC = () => {

    const [userStats, setUserStats] = useState<UserStats>();
    const { userInfo } = useSelector((state: RootState) => state.user)
    const userId = useMemo(() => userInfo?._id, [userInfo]);

    
    useEffect(() => {
        if (!userId) return;
        const fetchUserStat = async () => {
            try {

                const response = await axios.get(`${baseUrl}stats/${userId}`, {
                    withCredentials: true
                })

                if(response) {
                    setUserStats(response?.data?.data)
                }
            } catch (error) {
                handleApiError(error)
            }
        }

        fetchUserStat()

    }, [userId])

    // Avoid re-renderding if the status won't change..
    const memoizedUserStats = useMemo(() => userStats, [userStats]);

    return (
        <div className=" w-fit">
            <ul className="text-lg ">
                <li className="flex items-center justify-between space-x-2 border border-b-gray-300">
                    <div className="flex items-center justify-center px-2 py-1">
                        <span className=" text-sm w-[130px]">
                            Posts
                        </span>
                        <span className="font-bold text-gray-400">{memoizedUserStats?.articleCount}</span>
                    </div>

                </li>
                <li className="flex items-center space-x-2 border cursor-pointer border-b-gray-300">
                    <div className="flex items-center justify-center px-2 py-1">
                        <span className="text-sm w-[130px]">
                            Followers
                        </span>
                        <span className="font-bold text-gray-400">{memoizedUserStats?.followersCount}</span>
                    </div>
                </li>
                <li className="flex items-center space-x-2 border cursor-pointer border-b-gray-300">
                    <div className="flex items-center justify-center px-2 py-2">
                        <span className=" text-sm w-[130px]">
                            Following
                        </span>
                        <span className="font-bold text-gray-400">{userStats?.followingCount}</span>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ProfileStats;
