import { Request, Response } from 'express';
import userModel from '@models/userModel';

export const updateProfile = async (req:Request, res:Response) : Promise<void> => {
    try {

      const {id} = req.params;
      const updationDetails = req.body;

      const updateUser = await userModel.findByIdAndUpdate(
        id,
        {$set: updationDetails},
        {new: true, runValidators: true}
      )

      if(!updateUser){
         res.status(404).json({message: 'User Not Found'});
         return;
      }

      res.status(201).json({message: 'Profile Updatd Successfully', user: updateUser})

    } catch (error) {
        const err = error as Error;
       res.status(500).json({message: "Internal server error", error: err.message})
    }
}