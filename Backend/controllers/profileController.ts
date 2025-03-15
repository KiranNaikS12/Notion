import { Request, Response } from 'express';
import userModel from '../models/userModel';
import { getSignedUrl, uploadToS3 } from '../config/s3';
import { sendResponse } from '../utils/formatResponse';
import { ResponseMessage } from '../utils/messages';
import { sendErrorResponse } from '../utils/errorResponse';
import mongoose from 'mongoose';


// UPDATE_PROFILE_FUNCTIONALITY
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updationDetails = { ...req.body };
    const profileImage = req.file ? req.file : null;
    const bucketName = process.env.S3_BUCKET_NAME as string;

    if (profileImage) {
      const imageKey = `userProfile/${Date.now()}_${profileImage.originalname}`;

      try {

        await uploadToS3(profileImage, bucketName, imageKey);
        updationDetails.profileImage = imageKey;

      } catch (error) {
        sendErrorResponse(res, 400, ResponseMessage.FILE_UPLOAD_ERROR)
        return;
      }
    }

    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updationDetails },
      { new: true, runValidators: true }
    )

    if (!updateUser) {
      sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND)
      return;
    }

    // Generate signed URL for the profile image if it exists
    let userWithSignedUrl = { ...updateUser.toObject() };

    if (updateUser.profileImage) {
      try {
        const signedUrl = await getSignedUrl(
          bucketName,
          updateUser.profileImage,
        );
        userWithSignedUrl = {
          ...userWithSignedUrl,
          profileImage: signedUrl
        };
      } catch (error) {
        sendErrorResponse(res, 400, ResponseMessage.FAILED_TO_GENERATE_SIGNED_URL)
        return;
      }
    }

    sendResponse(res, 201, ResponseMessage.PROFILE_UPDATED, userWithSignedUrl)

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Internal server error", error: err.message })
  }
}


// GET_USER_STATS
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const userStats = await userModel.aggregate([
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "user",
          as: "userArticles"
        }
      },
      {
        $addFields: {
          articleCount: { $size: { $ifNull: ["$userArticles", []] } }, // Ensure array is not null
          followersCount: { $size: { $ifNull: ["$followers", []] } },  // Convert undefined/null to an empty array
          followingCount: { $size: { $ifNull: ["$following", []] } }  // Convert undefined/null to an empty array
        }
      },
      {
        $match: {
          _id: { $eq: new mongoose.Types.ObjectId(userId) }
        }
      },
      {
        $project: {
          _id: 0,
          followersCount: 1,
          followingCount: 1,
          articleCount: 1 
        }
      }
    ]);

    if (!userStats || userStats.length === 0) {
      sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND)
    }
    sendResponse(res, 200, ResponseMessage.USER_STATS_LISTED, userStats[0])

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Internal server error", error: err.message })
  }
}