import { Request, Response } from 'express';
import userModel from '@models/userModel';
import articleModel from '@models/articleModel';
import { sendResponse } from 'utils/formatResponse';
import { ResponseMessage } from 'utils/messages';

export const topUserAccounts = async (req:Request, res:Response) : Promise<void> => {
    try {

        const topUsers = await articleModel.aggregate([
            {
                $group: {
                    _id: "$user",
                    articleCount: {$sum: 1}
                }
            },
            {
                $sort: {articleCount: -1}
            },
            {
                $lookup: {
                    from:'users',
                    localField:"_id",
                    foreignField:"_id",
                    as: "userDetails"
                }
            }, 
            {
                $unwind: "$userDetails"
            },
            {
                $group: {  // Ensure uniqueness of users
                    _id: "$_id",
                    articleCount: { $first: "$articleCount" },
                    firstName: { $first: "$userDetails.firstName" },
                    lastName: { $first: "$userDetails.lastName" },
                    email: { $first: "$userDetails.email" },
                    profileImage: { $first: "$userDetails.profileImage" }
                }
            },
            
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    profileImage: 1,
                    articleCount: 1
                }
            }
        ])

        sendResponse(res, 201, ResponseMessage.USER_LISTED, topUsers)

    } catch (error) {
        const err = error as Error;
        res.status(500).json({message: "Internal server error", error: err.message})
    }
}