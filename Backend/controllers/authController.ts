import { Request, Response } from 'express';
import userModel from '@models/userModel';
import { hashPassword } from 'utils/hashPassword';
import bcrypt from 'bcryptjs'
import generateToken from 'config/generateToken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
      const { firstName, lastName, email, dob, password, role, interested } = req.body;

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User Already exists" });
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
      res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error: unknown) {
    const err = error as Error;
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) : Promise<void> => {
    try {

      const { email, password } = req.body;
      const user = await userModel.findOne({email: email});
      if(!user) {
        res.status(404).json({ message: "User Not Found" });
        return;
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if(!isPasswordMatch){
        res.status(404).json({ message: "Invalid Credentials" });
        return;
      }

      generateToken(res, user._id.toString())
      res.status(200).json({message: 'Logged In Successfully', user: user})
    } catch (error: unknown) {
      const err = error as Error;
       res.status(500).json({message: "Internal server error", error: err.message})
    }
}
