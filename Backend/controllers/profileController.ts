import { Request, Response } from 'express';
import userModel from '@models/userModel';
import { getSignedUrl, uploadToS3 } from 'config/s3';



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
        res.status(500).json({ message: 'Error uploading profile image' });
        return;
      }
    }

    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updationDetails },
      { new: true, runValidators: true }
    )

    if (!updateUser) {
      res.status(404).json({ message: 'User Not Found' });
      return;
    }

    // Generate signed URL for the profile image if it exists
    let userWithSignedUrl = { ...updateUser.toObject() };

    if (updateUser.profileImage) {
      try {
        const signedUrl = await getSignedUrl(
          bucketName,
          updateUser.profileImage,
          3600 
        );
        userWithSignedUrl = {
          ...userWithSignedUrl,
          profileImage: signedUrl
        };
      } catch (error) {
        res.status(400).json({ messsage: 'Failed to generate signed URL' })
        return;
      }
    }

    res.status(201).json({ message: 'Profile Updatd Successfully', user: userWithSignedUrl })

  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: "Internal server error", error: err.message })
  }
}