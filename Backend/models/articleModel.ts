import { IArticle } from "../types/articleTypes";
import mongoose, { Schema} from "mongoose";


const articleSchema = new Schema<IArticle>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    category: {type: String, required: true},
    coverImage: {type:String, required: true},
    content: {type: Schema.Types.Mixed, required: true},
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isLiked: { type: Boolean, default: false }
    }],
    totalLikes: {type: Number, default: 0}
}, {
    timestamps: true
})

const articleModel = mongoose.model<IArticle>('Article', articleSchema);
export default articleModel;