import { Request, Response } from 'express';
import userModel from '@models/userModel';
import articleModel from '@models/articleModel';
import { sendResponse } from 'utils/formatResponse';
import { ResponseMessage } from 'utils/messages';
import { sendErrorResponse } from 'utils/errorResponse';
import mongoose from 'mongoose';


export const topUserAccounts = async (req:Request, res:Response) : Promise<void> => {
    try {

        const { userId } = req.params;

        if(!userId) {
            sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND);
            return;
        }
 
        const topUsers = await userModel.aggregate([
            {
                $lookup: {
                    from: "articles",
                    localField: "_id",
                    foreignField: "user",
                    as: "userArticles",
                },
            },
            {
                $addFields: {
                    articleCount: { $size: "$userArticles" },
                },
            },
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(userId) }, 
                },
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    profileImage: 1,
                    articleCount: 1,
                    followers: 1,
                    following: 1,
                },
            },
            {
                $sort: { articleCount: -1 }, // descending order
            },
        ]);

        sendResponse(res, 201, ResponseMessage.USER_LISTED, topUsers)

    } catch (error) {
        const err = error as Error;
        res.status(500).json({message: "Internal server error", error: err.message})
    }
}

export const handleToggleFollow = async (req:Request, res:Response) : Promise<void> => {
    try {
        const {userId} = req.params;
        const { remoteId } = req.body;

        const [localUser, remoteUser] = await Promise.all([
            userModel.findById(userId),
            userModel.findById(remoteId)
        ]);

        if(!localUser) {
            sendErrorResponse(res, 404, ResponseMessage.LOCAL_USER_NOT_FOUND);
            return;
        }

        if(!remoteUser) {
            sendErrorResponse(res, 404, ResponseMessage.REMOTE_USER_NOT_FOUND)
        }
    
        // CHECK IF USER IS ALREADY FOLLOWING
        const existingFollowing = localUser.following.find(follow => follow.user.toString() === remoteId)
        
        if(!existingFollowing) {
            localUser.following.push({user: remoteId})
        } else if(existingFollowing){
            localUser.following = localUser.following.filter(follow => follow.user.toString() !== remoteId);
        }

        // CHECK IF THE USER IS ALREADY A FOLLOWER
        const exisitingFollowers = remoteUser?.followers.find(follow => follow.user.toString() === userId);
        
        if(!exisitingFollowers) {
            remoteUser?.followers.push({user: localUser._id})
        } else if(exisitingFollowers) {
            if(remoteUser?.followers) {
                remoteUser.followers = remoteUser?.followers.filter(follow => follow.user.toString() !== userId)
            }
        }

        await localUser.save()
        await remoteUser?.save()

    }  catch (error) {
        const err = error as Error;
        res.status(500).json({message: "Internal server error", error: err.message})
    }
}

export const currentUser = async(req:Request, res:Response) : Promise<void> => {
    try {

        const { userId } = req.params;

        const user = await userModel.findById(userId);

        if(!user?._id) {
            sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND)
        }
        sendResponse(res, 200, ResponseMessage.USER_LISTED, user)

    } catch (error) {
        const err = error as Error;
        res.status(500).json({message: "Internal server error", error: err.message})
    }
}