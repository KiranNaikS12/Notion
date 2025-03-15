import mongoose from "mongoose";

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    dob: string;
    password: string;
    role: string;
    interested: string[];
    followers: {
        user: mongoose.Types.ObjectId
    }[],
    following: {
        user: mongoose.Types.ObjectId
    }[]
}