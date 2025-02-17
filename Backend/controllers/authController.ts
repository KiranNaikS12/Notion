import { Request, Response } from 'express';
import userModel from '@models/userModel';
import { hashPassword } from 'utils/hashPassword';
import bcrypt from 'bcryptjs'
import generateToken from 'config/generateToken';
import { getSignedUrl } from 'config/s3';
import { sendResponse } from 'utils/formatResponse';
import { ResponseMessage } from 'utils/messages';
import { sendErrorResponse } from 'utils/errorResponse';


export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
      const { firstName, lastName, email, dob, password, role, interested } = req.body;

      const existingUser = await userModel.find({email});
      if (existingUser) {
        sendErrorResponse(res, 400, ResponseMessage.USER_ALREADY_EXISTS)
        return;
      }
      const hashedPassword = await hashPassword(password)

      const newUser = new userModel({
        firstName,
        lastName,
        email,
        dob,
        password: hashedPassword,
        role,
        interested: interested
      });

      await newUser.save();
      generateToken(res, newUser._id.toString())
      sendResponse(res, 201, ResponseMessage.USER_REGISTERED_SUCCESS, newUser)
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) : Promise<void> => {
    try {

      const { email, password } = req.body;
      const user = await userModel.findOne({email: email});
      const bucketName = process.env.S3_BUCKET_NAME as string;
      if(!user) {
        sendErrorResponse(res, 404, ResponseMessage.USER_NOT_FOUND )
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if(!isPasswordMatch){
        sendErrorResponse(res, 404, ResponseMessage.INVALID_CREDENTIALS)
        return;
      }

      generateToken(res, user._id.toString());

      let userWithSignedUrl = {...user.toObject()};

      if(user.profileImage){
        try {
          const signedUrl = await getSignedUrl(
            bucketName,
            user.profileImage,
          );
          userWithSignedUrl = {
            ...userWithSignedUrl,
            profileImage: signedUrl
          }
        } catch (error) {
          sendErrorResponse(res, 404, ResponseMessage.FAILED_TO_GENERATE_SIGNED_URL)
          return;
        }
      }

      sendResponse(res, 200, ResponseMessage.USER_LOGGED_IN, userWithSignedUrl)
    } catch (error: unknown) {
       const err = error as Error;
       res.status(500).json({message: "Internal server error", error: err.message})
    }
}

export const logoutUser = async (req:Request, res: Response) : Promise<void> => {
  try {

      res.clearCookie('access-token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
      });
      sendResponse(res,200, ResponseMessage.USER_LOGGED_OUT)

  } catch (error) {
       const err = error as Error;
       res.status(500).json({message: "Internal server error", error: err.message})
  }
}
