import mongoose from "mongoose";
import { Schema } from "mongoose";
import { CommentModel, UserModel } from "../internal_exports";
import { CommentSchema } from "./comment.model";



const userCommentSchema = new mongoose.Schema({
    commentId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    }
})

const PostSchema = new mongoose.Schema({
    caption: {
        type: String,
        maxLength: 200,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required:true,
        ref:UserModel.default
    },
    userName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    comments: {
        type: [userCommentSchema],
        default: [],
    }
}, { timestamps: true })


export default mongoose.model('Post',PostSchema);
