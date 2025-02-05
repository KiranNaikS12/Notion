import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/userTypes";


const userSchema = new Schema<IUser>({
    firstName : { type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    dob: {type: String, required: true},
    password: {type: String, required: true},
    identity: {type: String, required: true},
    intrested: {type: [String], required: true}
})

const userModel = mongoose.model<IUser>('User', userSchema);
export default userModel;